const { query } = require('../config/db');

class ProjectImage {
  // Get all images for a project
  static async findByProjectId(projectId) {
    const result = await query(
      `SELECT * FROM project_images 
       WHERE project_id = $1 
       ORDER BY display_order ASC, created_at ASC`,
      [projectId]
    );
    return result.rows;
  }

  // Find by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM project_images WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new project image
  static async create(data) {
    const result = await query(
      `INSERT INTO project_images 
       (project_id, image_url, caption, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.project_id,
        data.image_url,
        data.caption || null,
        data.display_order || 0,
      ]
    );
    return result.rows[0];
  }

  // Update project image
  static async update(id, data) {
    const allowedFields = ['image_url', 'caption', 'display_order'];
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
      `UPDATE project_images SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // Delete project image
  static async delete(id) {
    const result = await query(
      'DELETE FROM project_images WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  // Delete all images for a project
  static async deleteByProjectId(projectId) {
    const result = await query(
      'DELETE FROM project_images WHERE project_id = $1 RETURNING *',
      [projectId]
    );
    return result.rows;
  }

  // Reorder images
  static async reorder(images) {
    const client = await query('BEGIN');
    try {
      for (const image of images) {
        await query(
          'UPDATE project_images SET display_order = $1 WHERE id = $2',
          [image.display_order, image.id]
        );
      }
      await query('COMMIT');
      return true;
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }
}

module.exports = ProjectImage;
