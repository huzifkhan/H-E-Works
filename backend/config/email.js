require('dotenv').config();
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if SMTP credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP credentials not configured. Emails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

// Send email function
const sendEmail = async (options) => {
  const { to, subject, html, text } = options;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'H&E Works'}" <${process.env.SMTP_USER || 'noreply@heworks.com'}>`,
    to,
    subject,
    html,
    text,
  };

  // If transporter not configured, log to console
  if (!transporter) {
    console.log('\n📧 EMAIL (Console Mode - Configure SMTP to send):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', html);
    console.log('---\n');
    return { success: true, message: 'Email logged to console (SMTP not configured)' };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Verify transporter connection
const verifyConnection = async () => {
  if (!transporter) {
    return { success: false, message: 'SMTP not configured' };
  }

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    return { success: true };
  } catch (error) {
    console.error('❌ SMTP verification failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  verifyConnection,
  transporter,
};
