const Service = require('../models/Service');

// @desc    Get all services (public - active only)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { category } = req.query;
    
    let services;
    if (category) {
      services = await Service.findByCategory(category);
    } else {
      services = await Service.findAllActive();
    }

    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all services (admin - including inactive)
// @route   GET /api/services/admin
// @access  Private
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  try {
    const { title, description, icon, image_url, category, display_order, is_active } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const service = await Service.create({
      title,
      description,
      icon,
      image_url,
      category,
      display_order,
      is_active,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    const service = await Service.update(req.params.id, req.body);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.delete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/services/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Service.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getServices,
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories,
};
