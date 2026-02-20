const { query } = require('../config/db');

class ActivityLog {
  // Create activity log
  static async create(data) {
    const result = await query(
      `INSERT INTO activity_logs 
       (admin_id, action, entity_type, entity_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.adminId,
        data.action,
        data.entityType || null,
        data.entityId || null,
        JSON.stringify(data.details || {}),
        data.ipAddress || null,
        data.userAgent || null,
      ]
    );
    return result.rows[0];
  }

  // Get logs by admin
  static async findByAdminId(adminId, limit = 50) {
    const result = await query(
      `SELECT al.*, a.name as admin_name, a.email as admin_email
       FROM activity_logs al
       LEFT JOIN admins a ON al.admin_id = a.id
       WHERE al.admin_id = $1
       ORDER BY al.created_at DESC
       LIMIT $2`,
      [adminId, limit]
    );
    return result.rows;
  }

  // Get all logs with pagination
  static async findAll({ page = 1, limit = 50, adminId, action, entityType } = {}) {
    const offset = (page - 1) * limit;
    let whereClause = [];
    let values = [];
    let paramIndex = 1;

    if (adminId) {
      whereClause.push(`admin_id = $${paramIndex}`);
      values.push(adminId);
      paramIndex++;
    }

    if (action) {
      whereClause.push(`action ILIKE $${paramIndex}`);
      values.push(`%${action}%`);
      paramIndex++;
    }

    if (entityType) {
      whereClause.push(`entity_type = $${paramIndex}`);
      values.push(entityType);
      paramIndex++;
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM activity_logs ${where}`;
    const countResult = await query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get logs
    const selectQuery = `
      SELECT al.*, a.name as admin_name, a.email as admin_email
      FROM activity_logs al
      LEFT JOIN admins a ON al.admin_id = a.id
      ${where}
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    values.push(limit, offset);

    const result = await query(selectQuery, values);

    return {
      logs: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get activity statistics
  static async getStats(adminId) {
    const totalResult = await query(
      'SELECT COUNT(*) FROM activity_logs' + (adminId ? ` WHERE admin_id = ${adminId}` : '')
    );
    
    const actionsResult = await query(`
      SELECT action, COUNT(*) as count
      FROM activity_logs
      ${adminId ? `WHERE admin_id = ${adminId}` : ''}
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `);

    return {
      total: parseInt(totalResult.rows[0].count),
      topActions: actionsResult.rows,
    };
  }

  // Delete old logs (cleanup)
  static async deleteOlderThan(days) {
    const result = await query(
      `DELETE FROM activity_logs 
       WHERE created_at < NOW() - INTERVAL '${days} days'
       RETURNING id`
    );
    return result.rows.length;
  }
}

module.exports = ActivityLog;
