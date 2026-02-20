const { query } = require('../config/db');

class AdminProfile {
  // Get profile by admin ID
  static async findByAdminId(adminId) {
    const result = await query(
      'SELECT * FROM admin_profiles WHERE admin_id = $1',
      [adminId]
    );
    return result.rows[0] || null;
  }

  // Create profile for admin
  static async create(adminId, data = {}) {
    const result = await query(
      `INSERT INTO admin_profiles 
       (admin_id, avatar_url, phone, department, bio, notification_preferences)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (admin_id) DO UPDATE SET
         avatar_url = EXCLUDED.avatar_url,
         phone = EXCLUDED.phone,
         department = EXCLUDED.department,
         bio = EXCLUDED.bio,
         notification_preferences = EXCLUDED.notification_preferences,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        adminId,
        data.avatar_url || null,
        data.phone || null,
        data.department || null,
        data.bio || null,
        data.notification_preferences || {},
      ]
    );
    return result.rows[0];
  }

  // Update profile
  static async update(adminId, data) {
    const allowedFields = ['avatar_url', 'phone', 'department', 'bio', 'notification_preferences', 'timezone'];
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

    values.push(adminId);

    const result = await query(
      `UPDATE admin_profiles SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE admin_id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // Get all profiles with admin info
  static async findAllWithAdmins() {
    const result = await query(`
      SELECT 
        ap.*,
        a.name,
        a.email,
        a.role,
        a.is_active,
        a.last_login,
        a.created_at as admin_created_at
      FROM admin_profiles ap
      JOIN admins a ON a.id = ap.admin_id
      ORDER BY a.created_at DESC
    `);
    return result.rows;
  }

  // Delete profile
  static async delete(adminId) {
    const result = await query(
      'DELETE FROM admin_profiles WHERE admin_id = $1 RETURNING *',
      [adminId]
    );
    return result.rows[0];
  }
}

module.exports = AdminProfile;
