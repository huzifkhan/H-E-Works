const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ActivityLog = require('../models/ActivityLog');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from token (exclude password)
      req.admin = await Admin.findById(decoded.id);

      if (!req.admin) {
        return res.status(401).json({ message: 'Admin not found' });
      }

      if (!req.admin.is_active) {
        return res.status(401).json({ message: 'Admin account is deactivated' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin role check
const isAdmin = (req, res, next) => {
  if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'super-admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Super admin role check
const isSuperAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'super-admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized - super admin access required' });
  }
};

// Activity logging middleware
const logActivity = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to log after response
    res.json = function(data) {
      // Log activity if admin exists and action was successful
      if (req.admin && res.statusCode < 400) {
        ActivityLog.create({
          adminId: req.admin.id,
          action,
          entityType,
          entityId: req.params.id ? parseInt(req.params.id) : null,
          details: { method: req.method, path: req.path },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        }).catch(err => console.error('Activity log error:', err));
      }
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = { protect, isAdmin, isSuperAdmin, logActivity };
