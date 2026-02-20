const { query } = require('../config/db');

class ContactSubmission {
  // Create new submission
  static async create(data) {
    const result = await query(
      `INSERT INTO contact_submissions
       (name, email, phone, subject, message, ip_address, user_agent, attachments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.name,
        data.email,
        data.phone || '',
        data.subject,
        data.message,
        data.ipAddress || '',
        data.userAgent || '',
        JSON.stringify(data.attachments || []),
      ]
    );
    return result.rows[0];
  }

  // Find by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Get all submissions with pagination and filters
  static async findAll({ page = 1, limit = 10, status, search, startDate, endDate } = {}) {
    const offset = (page - 1) * limit;
    let whereClause = [];
    let values = [];
    let paramIndex = 1;

    if (status && status !== 'all') {
      whereClause.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (search) {
      whereClause.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR subject ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (startDate) {
      whereClause.push(`created_at >= $${paramIndex}`);
      values.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereClause.push(`created_at <= $${paramIndex}`);
      values.push(endDate);
      paramIndex++;
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM contact_submissions ${where}`;
    const countResult = await query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get submissions
    const selectQuery = `
      SELECT * FROM contact_submissions 
      ${where} 
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    values.push(limit, offset);
    
    const result = await query(selectQuery, values);
    
    return {
      submissions: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Update submission
  static async update(id, data) {
    const allowedFields = ['status'];
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

    values.push(id);
    
    const result = await query(
      `UPDATE contact_submissions SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // Delete submission
  static async delete(id) {
    const result = await query(
      'DELETE FROM contact_submissions WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  // Get statistics
  static async getStats() {
    const totalResult = await query('SELECT COUNT(*) FROM contact_submissions');
    const newResult = await query("SELECT COUNT(*) FROM contact_submissions WHERE status = 'new'");
    const readResult = await query("SELECT COUNT(*) FROM contact_submissions WHERE status = 'read'");
    const repliedResult = await query("SELECT COUNT(*) FROM contact_submissions WHERE status = 'replied'");

    const recentResult = await query(`
      SELECT id, name, email, subject, status, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return {
      total: parseInt(totalResult.rows[0].count),
      new: parseInt(newResult.rows[0].count),
      read: parseInt(readResult.rows[0].count),
      replied: parseInt(repliedResult.rows[0].count),
      recent: recentResult.rows,
    };
  }

  // Get submissions over time (daily for last 30 days, monthly for last 12 months)
  static async getSubmissionsOverTime(period = '30days') {
    let dateGroup, dateSelect, interval;
    
    if (period === '30days') {
      dateGroup = 'DATE(created_at)';
      dateSelect = 'DATE(created_at) as date';
      interval = "INTERVAL '30 days'";
    } else if (period === '12months') {
      dateGroup = "TO_CHAR(created_at, 'YYYY-MM')";
      dateSelect = "TO_CHAR(created_at, 'YYYY-MM') as date";
      interval = "INTERVAL '12 months'";
    } else {
      // 7 days
      dateGroup = 'DATE(created_at)';
      dateSelect = 'DATE(created_at) as date';
      interval = "INTERVAL '7 days'";
    }

    const result = await query(`
      SELECT ${dateSelect}, COUNT(*) as count
      FROM contact_submissions
      WHERE created_at >= NOW() - ${interval}
      GROUP BY ${dateGroup}
      ORDER BY date ASC
    `);

    return result.rows;
  }

  // Get status distribution
  static async getStatusDistribution() {
    const result = await query(`
      SELECT status, COUNT(*) as count
      FROM contact_submissions
      GROUP BY status
      ORDER BY count DESC
    `);

    return result.rows;
  }

  // Get response time metrics (average time from new to replied)
  static async getResponseTimeMetrics() {
    const result = await query(`
      SELECT 
        EXTRACT(EPOCH FROM AVG(
          CASE 
            WHEN replied_at IS NOT NULL THEN replied_at - created_at
            ELSE NULL
          END
        )) / 3600 as avg_response_hours,
        EXTRACT(EPOCH FROM MIN(
          CASE 
            WHEN replied_at IS NOT NULL THEN replied_at - created_at
            ELSE NULL
          END
        )) / 3600 as min_response_hours,
        EXTRACT(EPOCH FROM MAX(
          CASE 
            WHEN replied_at IS NOT NULL THEN replied_at - created_at
            ELSE NULL
          END
        )) / 3600 as max_response_hours
      FROM contact_submissions
      WHERE replied_at IS NOT NULL
    `);

    return result.rows[0] || { avg_response_hours: 0, min_response_hours: 0, max_response_hours: 0 };
  }

  // Get monthly summary for reports
  static async getMonthlySummary(year, month) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new,
        COUNT(*) FILTER (WHERE status = 'read') as read,
        COUNT(*) FILTER (WHERE status = 'replied') as replied,
        COUNT(*) FILTER (WHERE status = 'archived') as archived,
        COUNT(DISTINCT DATE(created_at)) as active_days
      FROM contact_submissions
      WHERE created_at BETWEEN $1 AND $2
    `, [startDate, endDate]);

    return result.rows[0] || { total: 0, new: 0, read: 0, replied: 0, archived: 0, active_days: 0 };
  }
}

module.exports = ContactSubmission;
