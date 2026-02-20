const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  updateProjectImage,
  deleteProjectImage,
  getProjectStats,
  getCategories,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/projects/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
    }
  },
});

// Public routes
router.get('/', getProjects);
router.get('/categories', getCategories);
router.get('/:id', getProject);

// Admin routes (protected)
router.get('/admin/all', protect, getAllProjects);
router.get('/stats', protect, getProjectStats);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// Image upload routes
router.post('/:id/images', protect, upload.single('image'), uploadProjectImage);
router.put('/images/:id', protect, updateProjectImage);
router.delete('/images/:id', protect, deleteProjectImage);

module.exports = router;
