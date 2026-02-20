const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/uploadMiddleware');
const { submitContactForm } = require('../controllers/contactController');
const rateLimit = require('express-rate-limit');

// Rate limiting for contact form (5 submissions per hour per IP)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 submissions per hour per IP
  message: {
    success: false,
    message: 'Too many submissions. Please try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
  // Handler to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

// reCAPTCHA validation middleware (optional - only if enabled)
const validateRecaptcha = async (req, res, next) => {
  // If reCAPTCHA is not configured, skip validation
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    return next();
  }

  const recaptchaToken = req.body?.recaptchaToken;

  if (!recaptchaToken) {
    return res.status(400).json({
      success: false,
      message: 'reCAPTCHA verification failed. Please try again.',
    });
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const data = await response.json();

    if (!data.success || data.score < 0.5) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed. Please try again.',
      });
    }

    next();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    // Don't block submission if reCAPTCHA service is unavailable
    next();
  }
};

// Handle file upload and form submission
// Note: upload.array() must come before validateContact to parse multipart form
router.post(
  '/',
  contactLimiter, // Rate limit MUST come first
  upload.array('attachments', 5), // Max 5 files - MUST be before validation to parse multipart
  validateContact,
  validateRecaptcha,
  submitContactForm
);

module.exports = router;
