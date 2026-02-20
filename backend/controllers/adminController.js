const Admin = require('../models/Admin');
const AdminProfile = require('../models/AdminProfile');
const ActivityLog = require('../models/ActivityLog');
const bcrypt = require('bcryptjs');

// @desc    Get all admins (Super Admin only)
// @route   GET /api/admins
// @access  Private/Super Admin
const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminProfile.findAllWithAdmins();
    
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message,
    });
  }
};

// @desc    Get admin by ID
// @route   GET /api/admins/:id
// @access  Private/Super Admin
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    const profile = await AdminProfile.findByAdminId(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {
        ...admin,
        profile,
      },
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin',
      error: error.message,
    });
  }
};

// @desc    Create new admin
// @route   POST /api/admins
// @access  Private/Super Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, phone, department, bio } = req.body;

    // Validate password strength
    const passwordValidation = Admin.validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
      });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    // Create admin
    const admin = await Admin.create({ name, email, password, role: role || 'admin' });

    // Create profile
    await AdminProfile.create(admin.id, { phone, department, bio });

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: 'admin_created',
      entityType: 'admin',
      entityId: admin.id,
      details: { name, email, role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message,
    });
  }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/Super Admin
const updateAdmin = async (req, res) => {
  try {
    const { name, email, role, is_active, phone, department, bio } = req.body;
    const adminId = req.params.id;

    // Prevent updating own role or status
    if (parseInt(adminId) === req.admin.id) {
      if (role || is_active !== undefined) {
        return res.status(403).json({
          success: false,
          message: 'Cannot modify your own role or status',
        });
      }
    }

    // Check if admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Update admin
    await Admin.update(adminId, { name, email, role, is_active });

    // Update profile
    if (phone || department || bio) {
      await AdminProfile.update(adminId, { phone, department, bio });
    }

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: 'admin_updated',
      entityType: 'admin',
      entityId: adminId,
      details: { name, email, role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin',
      error: error.message,
    });
  }
};

// @desc    Toggle admin status
// @route   PUT /api/admins/:id/toggle-status
// @access  Private/Super Admin
const toggleAdminStatus = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Prevent toggling own status
    if (parseInt(adminId) === req.admin.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Ensure at least one super admin remains active
    if (admin.role === 'super-admin') {
      const superAdmins = await Admin.findByRole('super-admin');
      const activeSuperAdmins = superAdmins.filter(a => a.is_active);
      
      if (activeSuperAdmins.length === 1 && admin.is_active) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active super admin',
        });
      }
    }

    const newStatus = !admin.is_active;
    await Admin.update(adminId, { is_active: newStatus });

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: 'admin_status_changed',
      entityType: 'admin',
      entityId: adminId,
      details: { newStatus },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: `Admin ${newStatus ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle admin status',
      error: error.message,
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private/Super Admin
const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Prevent deleting own account
    if (parseInt(adminId) === req.admin.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Ensure at least one super admin remains
    if (admin.role === 'super-admin') {
      const superAdmins = await Admin.findByRole('super-admin');
      if (superAdmins.length === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last super admin',
        });
      }
    }

    await Admin.delete(adminId);

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: 'admin_deleted',
      entityType: 'admin',
      entityId: adminId,
      details: { name: admin.name, email: admin.email },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin',
      error: error.message,
    });
  }
};

module.exports = {
  getAllAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
};
