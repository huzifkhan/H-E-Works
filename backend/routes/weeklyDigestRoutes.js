const express = require('express');
const router = express.Router();
const { protect, isSuperAdmin } = require('../middleware/authMiddleware');
const { triggerWeeklyDigest } = require('../controllers/weeklyDigestController');

// Manual trigger (Super Admin only)
router.post('/trigger', protect, isSuperAdmin, triggerWeeklyDigest);

module.exports = router;
