const Testimonial = require('../models/Testimonial');

// @desc    Get all approved testimonials (public)
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAllApproved();
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all testimonials (admin - including unapproved)
// @route   GET /api/testimonials/admin
// @access  Private
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public
const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = async (req, res) => {
  try {
    const { client_name, client_title, company, rating, testimonial, is_approved, display_order } = req.body;

    // Validation
    if (!client_name || !testimonial) {
      return res.status(400).json({ success: false, message: 'Client name and testimonial are required' });
    }

    const newTestimonial = await Testimonial.create({
      client_name,
      client_title,
      company,
      rating,
      testimonial,
      is_approved,
      display_order,
    });

    res.status(201).json({ success: true, data: newTestimonial });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.update(req.params.id, req.body);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.delete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get testimonial statistics
// @route   GET /api/testimonials/stats
// @access  Private
const getTestimonialStats = async (req, res) => {
  try {
    const stats = await Testimonial.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get testimonial stats error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTestimonials,
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialStats,
};
