const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class Admin {
  // Find admin by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  // Find admin by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, name, email, role, is_active, created_at, updated_at FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new admin
  static async create({ name, email, password, role = 'admin' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO admins (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, is_active, created_at`,
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update admin
  static async update(id, data) {
    const allowedFields = ['name', 'email', 'role', 'is_active', 'last_login'];
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE admins SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // Get all admins
  static async findAll() {
    const result = await query(
      'SELECT id, name, email, role, is_active, last_login, created_at, updated_at FROM admins ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Delete admin
  static async delete(id) {
    const result = await query(
      'DELETE FROM admins WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create password reset token
  static async createPasswordResetToken(adminId, token, expiresAt) {
    const result = await query(
      `INSERT INTO password_reset_tokens (admin_id, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [adminId, token, expiresAt]
    );
    return result.rows[0];
  }

  // Find password reset token
  static async findPasswordResetToken(token) {
    const result = await query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = $1 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`
    );
    return result.rows[0] || null;
  }

  // Use password reset token
  static async usePasswordResetToken(token) {
    await query(
      `UPDATE password_reset_tokens SET used = true WHERE token = $1`,
      [token]
    );
  }

  // Expire old tokens
  static async expireOldTokens(adminId) {
    await query(
      `UPDATE password_reset_tokens SET used = true WHERE admin_id = $1`,
      [adminId]
    );
  }

  // Check if admin is super admin
  static async isSuperAdmin(id) {
    const result = await query(
      'SELECT role FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0]?.role === 'super-admin';
  }

  // Get admin count
  static async getCount() {
    const result = await query('SELECT COUNT(*) FROM admins');
    return parseInt(result.rows[0].count);
  }

  // Get admins by role
  static async findByRole(role) {
    const result = await query(
      'SELECT id, name, email, role, is_active, created_at FROM admins WHERE role = $1 ORDER BY created_at DESC',
      [role]
    );
    return result.rows;
  }

  // Validate password strength
  static validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = Admin;
