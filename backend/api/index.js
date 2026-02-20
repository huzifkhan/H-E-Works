const app = require('../server');

// Vercel serverless export with database initialization
let isInitialized = false;
let initPromise = null;

const ensureInitialized = async () => {
  if (isInitialized) return;
  
  if (!initPromise) {
    initPromise = app.initializeDatabase()
      .then(() => {
        isInitialized = true;
        console.log('✅ Database initialized for serverless');
      })
      .catch((err) => {
        console.error('❌ Serverless DB init failed:', err);
        initPromise = null; // Reset to allow retry
        throw err;
      });
  }
  
  return initPromise;
};

module.exports = async (req, res) => {
  // Initialize database on first request
  try {
    await ensureInitialized();
  } catch (err) {
    return res.status(500).json({ 
      error: 'Database initialization failed',
      message: err.message 
    });
  }
  
  // Handle the request
  return app(req, res);
};
