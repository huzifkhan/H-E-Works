const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getAnalyticsOverview,
  getMonthlyReport,
  getConversionMetrics,
  getDashboardStats,
} = require('../controllers/analyticsController');

// All routes are protected (require authentication)
router.use(protect);
router.use(isAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/overview', getAnalyticsOverview);
router.get('/monthly/:year/:month', getMonthlyReport);
router.get('/conversion', getConversionMetrics);

module.exports = router;
