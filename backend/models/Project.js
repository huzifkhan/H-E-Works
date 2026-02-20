const { query } = require('../config/db');

class Project {
  // Get all active projects for public page
  static async findAllActive({ featured, category } = {}) {
    let whereClause = ['is_active = true'];
    let values = [];
    let paramIndex = 1;

    if (featured !== undefined) {
      whereClause.push(`is_featured = $${paramIndex}`);
      values.push(featured);
      paramIndex++;
    }

    if (category) {
      whereClause.push(`category = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }

    const where = whereClause.join(' AND ');

    const result = await query(
      `SELECT * FROM projects 
       WHERE ${where}
       ORDER BY is_featured DESC, completion_date DESC, created_at DESC`,
      values
    );
    return result.rows;
  }

  // Get all projects for admin (including inactive)
  static async findAll() {
    const result = await query(
      `SELECT * FROM projects 
       ORDER BY is_featured DESC, completion_date DESC, created_at DESC`
    );
    return result.rows;
  }

  // Find by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Find by ID with images
  static async findByIdWithImages(id) {
    const project = await this.findById(id);
    if (!project) return null;

    const ProjectImage = require('./ProjectImage');
    const images = await ProjectImage.findByProjectId(id);
    
    return {
      ...project,
      images,
    };
  }

  // Create new project
  static async create(data) {
    const result = await query(
      `INSERT INTO projects 
       (title, description, client_name, completion_date, budget, category, location, duration, is_featured, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.title,
        data.description || null,
        data.client_name || null,
        data.completion_date || null,
        data.budget || null,
        data.category || null,
        data.location || null,
        data.duration || null,
        data.is_featured !== undefined ? data.is_featured : false,
        data.is_active !== undefined ? data.is_active : true,
      ]
    );
    return result.rows[0];
  }

  // Update project
  static async update(id, data) {
    const allowedFields = ['title', 'description', 'client_name', 'completion_date', 'budget', 'category', 'location', 'duration', 'is_featured', 'is_active'];
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
      `UPDATE projects SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // Delete project
  static async delete(id) {
    const result = await query(
      'DELETE FROM projects WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  // Get projects by category
  static async findByCategory(category) {
    const result = await query(
      `SELECT * FROM projects 
       WHERE category = $1 AND is_active = true 
       ORDER BY is_featured DESC, completion_date DESC`,
      [category]
    );
    return result.rows;
  }

  // Get all categories
  static async getCategories() {
    const result = await query(
      `SELECT DISTINCT category FROM projects 
       WHERE is_active = true 
       ORDER BY category`
    );
    return result.rows.map(row => row.category);
  }

  // Get featured projects
  static async getFeatured(limit = 6) {
    const result = await query(
      `SELECT * FROM projects 
       WHERE is_active = true AND is_featured = true 
       ORDER BY completion_date DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  // Get statistics
  static async getStats() {
    const totalResult = await query('SELECT COUNT(*) FROM projects WHERE is_active = true');
    const featuredResult = await query('SELECT COUNT(*) FROM projects WHERE is_active = true AND is_featured = true');
    const categoriesResult = await query('SELECT COUNT(DISTINCT category) FROM projects WHERE is_active = true');

    return {
      total: parseInt(totalResult.rows[0].count),
      featured: parseInt(featuredResult.rows[0].count),
      categories: parseInt(categoriesResult.rows[0].count),
    };
  }
}

module.exports = Project;
