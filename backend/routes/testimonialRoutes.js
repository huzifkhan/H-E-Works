const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialStats,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Admin routes (protected)
router.get('/admin/all', protect, getAllTestimonials);
router.get('/stats', protect, getTestimonialStats);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
