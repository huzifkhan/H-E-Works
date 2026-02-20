const express = require('express');
const router = express.Router();
const { protect, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');
const {
  getAllAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} = require('../controllers/adminController');

// All routes require authentication and admin/super-admin role
router.use(protect);
router.use(isAdmin);

router.get('/', isSuperAdmin, getAllAdmins);
router.get('/:id', isSuperAdmin, getAdmin);
router.post('/', isSuperAdmin, createAdmin);
router.put('/:id', isSuperAdmin, updateAdmin);
router.put('/:id/toggle-status', isSuperAdmin, toggleAdminStatus);
router.delete('/:id', isSuperAdmin, deleteAdmin);

module.exports = router;
