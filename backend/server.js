const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { pool } = require('./config/db');
const createTables = require('./config/initDB');

// Import routes
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const weeklyDigestRoutes = require('./routes/weeklyDigestRoutes');

// Initialize express app
const app = express();

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to Neon PostgreSQL');
    
    // Create tables
    await createTables();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/weekly-digest', weeklyDigestRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Brand API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact',
      auth: '/api/auth',
      submissions: '/api/submissions',
      services: '/api/services',
      projects: '/api/projects',
      testimonials: '/api/testimonials',
      analytics: '/api/analytics',
      admins: '/api/admins',
    },
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

// Weekly digest scheduler (every Monday at 9 AM)
const scheduleWeeklyDigest = () => {
  const sendWeeklyDigest = async () => {
    try {
      const { sendWeeklyDigest: sendDigest } = require('./controllers/weeklyDigestController');
      await sendDigest();
    } catch (error) {
      console.error('Scheduled weekly digest failed:', error);
    }
  };

  // Calculate time until next Monday 9 AM
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + (7 - now.getDay()) % 7);
  nextMonday.setHours(9, 0, 0, 0);
  
  if (nextMonday <= now) {
    nextMonday.setDate(nextMonday.getDate() + 7);
  }

  const delay = nextMonday.getTime() - now.getTime();
  
  console.log(`📅 Weekly digest scheduled for ${nextMonday.toLocaleString()} (in ${Math.round(delay / (1000 * 60 * 60))} hours)`);
  
  setTimeout(() => {
    sendWeeklyDigest();
    // Then repeat every 7 days
    setInterval(sendWeeklyDigest, 7 * 24 * 60 * 60 * 1000);
  }, delay);
};

// Initialize database and start server
initializeDatabase().then(() => {
  scheduleWeeklyDigest();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});

module.exports = app;
