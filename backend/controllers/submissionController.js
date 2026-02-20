const ContactSubmission = require('../models/ContactSubmission');

// Helper function to convert snake_case to camelCase
const convertToCamelCase = (obj) => {
  if (!obj) return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result;
};

// @desc    Get all contact submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const result = await ContactSubmission.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      search,
    });

    // Convert to camelCase
    const submissions = result.submissions.map(convertToCamelCase);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message,
    });
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private/Admin
const getSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      data: convertToCamelCase(submission),
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
    });
  }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id
// @access  Private/Admin
const updateSubmission = async (req, res) => {
  try {
    const { status } = req.body;

    const submission = await ContactSubmission.update(req.params.id, { status });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully',
      data: convertToCamelCase(submission),
    });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submission',
    });
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private/Admin
const deleteSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.delete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission',
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/submissions/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const stats = await ContactSubmission.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};

module.exports = {
  getAllSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  getStats,
};
