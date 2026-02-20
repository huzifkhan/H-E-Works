const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerAdmin, loginAdmin, getMe } = require('../controllers/authController');
const {
  forgotPassword,
  verifyToken,
  resetPassword,
} = require('../controllers/passwordResetController');
const { protect } = require('../middleware/authMiddleware');

// Validation middleware
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
];

const validateResetPassword = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

router.post('/register', validateRegister, registerAdmin);
router.post('/login', validateLogin, loginAdmin);
router.get('/me', protect, getMe);

// Password reset routes
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.get('/verify-token/:token', verifyToken);
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;
