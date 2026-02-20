const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  getStats,
} = require('../controllers/submissionController');
const {
  exportSubmissions,
  bulkUpdate,
  bulkDelete,
} = require('../controllers/exportController');

// All routes are protected (require authentication)
router.use(protect);
router.use(isAdmin);

// Export and bulk routes
router.get('/export', exportSubmissions);
router.put('/bulk', bulkUpdate);
router.delete('/bulk', bulkDelete);

// Individual submission routes
router.get('/stats', getStats);
router.get('/', getAllSubmissions);
router.get('/:id', getSubmission);
router.put('/:id', updateSubmission);
router.delete('/:id', deleteSubmission);

module.exports = router;
