const ContactSubmission = require('../models/ContactSubmission');
const { Parser } = require('json2csv');

// @desc    Export submissions to CSV
// @route   GET /api/submissions/export
// @access  Private/Admin
const exportSubmissions = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    // Get all submissions (with optional filters)
    let submissions;
    if (status || startDate || endDate) {
      // Custom query with filters
      let query = 'SELECT * FROM contact_submissions WHERE 1=1';
      let params = [];
      let paramIndex = 1;

      if (status) {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (startDate) {
        query += ` AND created_at >= $${paramIndex}`;
        params.push(startDate);
        paramIndex++;
      }

      if (endDate) {
        query += ` AND created_at <= $${paramIndex}`;
        params.push(endDate);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      const { pool } = require('../config/db');
      const result = await pool.query(query, params);
      submissions = result.rows;
    } else {
      const result = await ContactSubmission.findAll({ page: 1, limit: 10000 });
      submissions = result.submissions;
    }

    // Format data for CSV
    const csvData = submissions.map(s => ({
      ID: s.id,
      Date: new Date(s.created_at).toLocaleDateString(),
      Time: new Date(s.created_at).toLocaleTimeString(),
      Name: s.name,
      Email: s.email,
      Phone: s.phone,
      Subject: s.subject,
      Message: s.message,
      Status: s.status,
      Attachments: s.attachments ? s.attachments.length : 0,
      IP: s.ip_address,
    }));

    // Generate CSV
    const parser = new Parser({
      fields: ['ID', 'Date', 'Time', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Attachments', 'IP'],
    });

    const csv = parser.parse(csvData);

    // Set headers for download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=submissions_${new Date().toISOString().split('T')[0]}.csv`);

    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export submissions',
      error: error.message,
    });
  }
};

// @desc    Bulk update submissions
// @route   PUT /api/submissions/bulk
// @access  Private/Admin
const bulkUpdate = async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No IDs provided',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const { pool } = require('../config/db');
    
    await pool.query(
      `UPDATE contact_submissions 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ANY($2::int[])`,
      [status, ids]
    );

    res.status(200).json({
      success: true,
      message: `Updated ${ids.length} submission(s) to ${status}`,
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submissions',
      error: error.message,
    });
  }
};

// @desc    Bulk delete submissions
// @route   DELETE /api/submissions/bulk
// @access  Private/Admin
const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No IDs provided',
      });
    }

    const { pool } = require('../config/db');
    
    await pool.query(
      `DELETE FROM contact_submissions WHERE id = ANY($1::int[])`,
      [ids]
    );

    res.status(200).json({
      success: true,
      message: `Deleted ${ids.length} submission(s)`,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete submissions',
      error: error.message,
    });
  }
};

module.exports = {
  exportSubmissions,
  bulkUpdate,
  bulkDelete,
};
