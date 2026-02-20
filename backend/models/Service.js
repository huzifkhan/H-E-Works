const { query } = require('../config/db');

class Service {
  // Get all active services for public page
  static async findAllActive() {
    const result = await query(
      `SELECT * FROM services 
       WHERE is_active = true 
       ORDER BY display_order ASC, created_at DESC`
    );
    return result.rows;
  }

  // Get all services for admin (including inactive)
  static async findAll() {
    const result = await query(
      `SELECT * FROM services 
       ORDER BY display_order ASC, created_at DESC`
    );
    return result.rows;
  }

  // Find by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new service
  static async create(data) {
    const result = await query(
      `INSERT INTO services 
       (title, description, icon, image_url, category, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.title,
        data.description || null,
        data.icon || null,
        data.image_url || null,
        data.category || null,
        data.display_order || 0,
        data.is_active !== undefined ? data.is_active : true,
      ]
    );
    return result.rows[0];
  }

  // Update service
  static async update(id, data) {
    const allowedFields = ['title', 'description', 'icon', 'image_url', 'category', 'display_order', 'is_active'];
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
      `UPDATE services SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // Delete service
  static async delete(id) {
    const result = await query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  // Get services by category
  static async findByCategory(category) {
    const result = await query(
      `SELECT * FROM services 
       WHERE category = $1 AND is_active = true 
       ORDER BY display_order ASC`,
      [category]
    );
    return result.rows;
  }

  // Get all categories
  static async getCategories() {
    const result = await query(
      `SELECT DISTINCT category FROM services 
       WHERE is_active = true 
       ORDER BY category`
    );
    return result.rows.map(row => row.category);
  }
}

module.exports = Service;
