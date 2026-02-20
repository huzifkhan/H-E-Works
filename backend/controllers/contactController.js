const ContactSubmission = require('../models/ContactSubmission');
const { sendEmail } = require('../config/email');
const { newSubmissionAlertTemplate } = require('../utils/emailTemplates');
const Admin = require('../models/Admin');
const path = require('path');

// Helper function to convert snake_case to camelCase
const convertToCamelCase = (obj) => {
  if (!obj) return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result;
};

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.originalname,
        path: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      }));
    }

    // Create submission
    const submission = await ContactSubmission.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      ipAddress: req.ip || req.connection.remoteAddress || '',
      userAgent: req.get('user-agent') || '',
      attachments,
    });

    // Send email notifications (non-blocking)
    // Don't wait for emails to send before responding
    (async () => {
      try {
        // Get all active admins
        const admins = await Admin.findAll();
        const activeAdmins = admins.filter(a => a.is_active);

        // Send notification to all active admins
        for (const admin of activeAdmins) {
          const html = newSubmissionAlertTemplate({
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            subject: submission.subject,
            message: submission.message,
          }, admin.name);

          await sendEmail({
            to: admin.email,
            subject: `New Contact Submission: ${submission.subject}`,
            html,
          });
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError.message);
        // Don't fail the request if email fails
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: convertToCamelCase(submission),
    });
  } catch (error) {
    console.error('Contact submission error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = { submitContactForm };
