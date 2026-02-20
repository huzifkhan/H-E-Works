const Admin = require('../models/Admin');
const AdminProfile = require('../models/AdminProfile');
const ActivityLog = require('../models/ActivityLog');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// @desc    Get current admin profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    const profile = await AdminProfile.findByAdminId(req.admin.id);

    res.status(200).json({
      success: true,
      data: {
        ...admin,
        profile,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { phone, department, bio, timezone, notification_preferences } = req.body;

    await AdminProfile.update(req.admin.id, {
      phone,
      department,
      bio,
      timezone,
      notification_preferences,
    });

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: 'profile_updated',
      entityType: 'admin_profile',
      entityId: req.admin.id,
      details: { phone, department },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/profile/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current admin
    const admin = await Admin.findByEmail(req.admin.email);

    // Verify current password
    const isMatch = await Admin.comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Validate new password
    const validation = Admin.validatePassword(newPassword);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: validation.errors,
      });
    }

    // Hash new password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { query } = require('../config/db');
    await query(
      'UPDATE admins SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.admin.id]
    );

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: 'password_changed',
      entityType: 'admin',
      entityId: req.admin.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
