const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/profileController');

// All routes require authentication
router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
