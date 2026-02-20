const Admin = require('../models/Admin');
const { sendEmail } = require('../config/email');
const { passwordResetTemplate } = require('../utils/emailTemplates');
const crypto = require('crypto');
const { query } = require('../config/db');

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find admin
    const admin = await Admin.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!admin) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }

    // Check rate limiting (3 requests per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentTokens = await query(
      `SELECT COUNT(*) FROM password_reset_tokens 
       WHERE admin_id = $1 AND created_at > $2`,
      [admin.id, oneHourAgo]
    );

    if (parseInt(recentTokens.rows[0].count) >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate old tokens
    await Admin.expireOldTokens(admin.id);

    // Save new token
    await Admin.createPasswordResetToken(admin.id, resetToken, expiresAt);

    // Send email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/reset-password/${resetToken}`;
    const html = passwordResetTemplate(admin.name, resetUrl, expiresAt);
    
    await sendEmail({
      to: admin.email,
      subject: 'Password Reset Request - H&E Works Admin',
      html,
    });

    // Log activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      adminId: admin.id,
      action: 'password_reset_requested',
      entityType: 'admin',
      entityId: admin.id,
      details: { email },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message,
    });
  }
};

// @desc    Verify reset token
// @route   GET /api/auth/verify-token/:token
// @access  Public
const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const resetToken = await Admin.findPasswordResetToken(token);

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify token',
      error: error.message,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find token
    const resetToken = await Admin.findPasswordResetToken(token);

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Validate password
    const validation = Admin.validatePassword(password);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: validation.errors,
      });
    }

    // Hash new password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await query(
      'UPDATE admins SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, resetToken.admin_id]
    );

    // Mark token as used
    await query(
      `UPDATE password_reset_tokens 
       SET used = true, used_at = CURRENT_TIMESTAMP, ip_address = $1 
       WHERE token = $2`,
      [req.ip, token]
    );

    // Log activity
    const ActivityLog = require('../models/ActivityLog');
    const admin = await Admin.findById(resetToken.admin_id);
    await ActivityLog.create({
      adminId: resetToken.admin_id,
      action: 'password_reset_completed',
      entityType: 'admin',
      entityId: resetToken.admin_id,
      details: { email: admin.email },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

module.exports = {
  forgotPassword,
  verifyToken,
  resetPassword,
};
