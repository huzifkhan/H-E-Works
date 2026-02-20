const express = require('express');
const router = express.Router();
const {
  getServices,
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:id', getService);

// Admin routes (protected)
router.get('/admin/all', protect, getAllServices);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
