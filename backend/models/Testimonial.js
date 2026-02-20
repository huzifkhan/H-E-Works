const { query } = require('../config/db');

class Testimonial {
  // Get all approved testimonials for public page
  static async findAllApproved() {
    const result = await query(
      `SELECT * FROM testimonials 
       WHERE is_approved = true 
       ORDER BY display_order ASC, created_at DESC`
    );
    return result.rows;
  }

  // Get all testimonials for admin (including unapproved)
  static async findAll() {
    const result = await query(
      `SELECT * FROM testimonials 
       ORDER BY display_order ASC, created_at DESC`
    );
    return result.rows;
  }

  // Find by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM testimonials WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new testimonial
  static async create(data) {
    const result = await query(
      `INSERT INTO testimonials 
       (client_name, client_title, company, rating, testimonial, is_approved, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.client_name,
        data.client_title || null,
        data.company || null,
        data.rating || 5,
        data.testimonial,
        data.is_approved !== undefined ? data.is_approved : false,
        data.display_order || 0,
      ]
    );
    return result.rows[0];
  }

  // Update testimonial
  static async update(id, data) {
    const allowedFields = ['client_name', 'client_title', 'company', 'rating', 'testimonial', 'is_approved', 'display_order'];
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
      `UPDATE testimonials SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // Delete testimonial
  static async delete(id) {
    const result = await query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  // Get testimonials by rating
  static async findByRating(rating) {
    const result = await query(
      `SELECT * FROM testimonials 
       WHERE rating = $1 AND is_approved = true 
       ORDER BY display_order ASC`,
      [rating]
    );
    return result.rows;
  }

  // Get statistics
  static async getStats() {
    const totalResult = await query('SELECT COUNT(*) FROM testimonials');
    const approvedResult = await query('SELECT COUNT(*) FROM testimonials WHERE is_approved = true');
    const avgRatingResult = await query('SELECT AVG(rating) as avg_rating FROM testimonials WHERE is_approved = true');

    return {
      total: parseInt(totalResult.rows[0].count),
      approved: parseInt(approvedResult.rows[0].count),
      averageRating: parseFloat(avgRatingResult.rows[0].avg_rating || 0).toFixed(1),
    };
  }
}

module.exports = Testimonial;
