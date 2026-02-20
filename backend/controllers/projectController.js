const Project = require('../models/Project');
const ProjectImage = require('../models/ProjectImage');
const fs = require('fs');
const path = require('path');

// @desc    Get all projects (public - active only)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { featured, category, limit, offset } = req.query;

    // Validate and sanitize pagination parameters (handle array pollution)
    const limitValue = Array.isArray(limit) ? limit[0] : limit;
    const offsetValue = Array.isArray(offset) ? offset[0] : offset;
    
    let limitNum = parseInt(limitValue) || 100; // Default 100
    let offsetNum = parseInt(offsetValue) || 0;

    // Enforce bounds: limit 1-100, offset >= 0
    limitNum = Math.max(1, Math.min(limitNum, 100));
    offsetNum = Math.max(0, offsetNum);

    let projects;
    if (featured !== undefined || category) {
      projects = await Project.findAllActive({
        featured: featured === 'true',
        category
      });
    } else {
      projects = await Project.findAllActive();
    }

    // Apply pagination
    projects = projects.slice(offsetNum, offsetNum + limitNum);

    // Get images for each project
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const images = await ProjectImage.findByProjectId(project.id);
        return { ...project, images };
      })
    );

    res.json({ success: true, data: projectsWithImages });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all projects (admin - including inactive)
// @route   GET /api/projects/admin
// @access  Private
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    
    // Get images for each project
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const images = await ProjectImage.findByProjectId(project.id);
        return { ...project, images };
      })
    );

    res.json({ success: true, data: projectsWithImages });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get project by ID with images
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    // Validate project ID - must be a positive integer
    const projectId = parseInt(req.params.id);
    
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID. ID must be a positive number.' 
      });
    }

    const project = await Project.findByIdWithImages(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Get project error:', error);
    // Don't expose database errors to client
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching the project' 
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { 
      title, description, client_name, completion_date, budget, 
      category, location, duration, is_featured, is_active 
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const project = await Project.create({
      title,
      description,
      client_name,
      completion_date,
      budget,
      category,
      location,
      duration,
      is_featured,
      is_active,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.update(req.params.id, req.body);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete associated images from filesystem
    const images = await ProjectImage.findByProjectId(req.params.id);
    for (const image of images) {
      const imagePath = path.join(__dirname, '..', image.image_url.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete images from database (cascade will handle this, but being explicit)
    await ProjectImage.deleteByProjectId(req.params.id);

    // Delete project
    await Project.delete(req.params.id);

    res.json({ success: true, message: 'Project and associated images deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Upload project image
// @route   POST /api/projects/:id/images
// @access  Private
const uploadProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const { caption, display_order } = req.body;

    const image = await ProjectImage.create({
      project_id: project.id,
      image_url: `/uploads/${req.file.filename}`,
      caption,
      display_order,
    });

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    console.error('Upload project image error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update project image
// @route   PUT /api/projects/images/:id
// @access  Private
const updateProjectImage = async (req, res) => {
  try {
    const image = await ProjectImage.update(req.params.id, req.body);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.json({ success: true, data: image });
  } catch (error) {
    console.error('Update project image error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete project image
// @route   DELETE /api/projects/images/:id
// @access  Private
const deleteProjectImage = async (req, res) => {
  try {
    const image = await ProjectImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete file from filesystem
    const imagePath = path.join(__dirname, '..', image.image_url.replace('/uploads/', 'uploads/'));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete from database
    await ProjectImage.delete(req.params.id);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete project image error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private
const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/projects/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Project.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  updateProjectImage,
  deleteProjectImage,
  getProjectStats,
  getCategories,
};
