import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../utils/api';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Image,
  Calendar,
  MapPin,
  DollarSign,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES = [
  'Infrastructure',
  'Building',
  'Industrial',
  'Commercial',
  'Residential',
  'Public Works',
  'Other',
];

const AdminProjects = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProjectForImages, setSelectedProjectForImages] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_name: '',
    completion_date: '',
    budget: '',
    category: 'Infrastructure',
    location: '',
    is_featured: false,
    is_active: true,
  });
  const [imageFormData, setImageFormData] = useState({
    caption: '',
    display_order: 0,
    is_primary: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAllAdmin();
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || '',
        client_name: project.clientName || '',
        completion_date: project.completionDate ? project.completionDate.split('T')[0] : '',
        budget: project.budget || '',
        category: project.category || 'Infrastructure',
        location: project.location || '',
        is_featured: project.isFeatured || false,
        is_active: project.isActive !== false,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        client_name: '',
        completion_date: '',
        budget: '',
        category: 'Infrastructure',
        location: '',
        is_featured: false,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.id, formData);
      } else {
        await projectsAPI.create(formData);
      }
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated images.')) return;
    try {
      await projectsAPI.delete(id);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project.');
    }
  };

  const handleOpenImageModal = (project) => {
    setSelectedProjectForImages(project);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedProjectForImages(null);
    setImageFormData({
      caption: '',
      display_order: 0,
      is_primary: false,
    });
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('projectImageInput');
    const file = fileInput?.files[0];

    if (!file) {
      alert('Please select an image file');
      return;
    }

    try {
      setUploadingImage(true);
      const formDataImg = new FormData();
      formDataImg.append('image', file);
      formDataImg.append('caption', imageFormData.caption);
      formDataImg.append('display_order', imageFormData.display_order);
      formDataImg.append('is_primary', imageFormData.is_primary);

      await projectsAPI.addImage(selectedProjectForImages.id, formDataImg);

      handleCloseImageModal();
      fetchProjects();
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId, projectId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await projectsAPI.deleteImage(imageId);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                H&E Works - Projects
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
            <p className="text-gray-600 mt-1">Showcase your portfolio and completed work</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-100">
            <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">Start building your portfolio by adding your first project</p>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <Plus className="h-5 w-5 mr-2 inline" />
              Add Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Project Image Preview */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0].imageUrl || project.images[0].image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    {project.isFeatured && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                    {!project.isActive && (
                      <span className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                      {project.category || 'General'}
                    </span>
                    {project.images && project.images.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {project.images.length} image{project.images.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || 'No description'}
                  </p>

                  <div className="space-y-2 mb-4">
                    {project.clientName && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {project.clientName}
                      </div>
                    )}
                    {project.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {project.location}
                      </div>
                    )}
                    {project.completionDate && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(project.completionDate).toLocaleDateString()}
                      </div>
                    )}
                    {project.budget && (
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${project.budget.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="flex-1 btn-secondary flex items-center justify-center space-x-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleOpenImageModal(project)}
                      className="flex-1 btn-secondary flex items-center justify-center space-x-1"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Images</span>
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="input-field"
                    placeholder="e.g., Downtown Office Complex"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Describe the project..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="input-field"
                      placeholder="Client or company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-field"
                      placeholder="e.g., New York, NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      value={formData.completion_date}
                      onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 500000"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                      Featured (show on homepage)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      Active (show on website)
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <button type="submit" className="btn-primary flex-1">
                    <Save className="h-4 w-4 mr-2 inline" />
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary flex-1"
                  >
                    <X className="h-4 w-4 mr-2 inline" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      {showImageModal && selectedProjectForImages && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseImageModal} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg font-bold text-gray-900">
                  Manage Images - {selectedProjectForImages.title}
                </h3>
                <button
                  onClick={handleCloseImageModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Current Images */}
                {selectedProjectForImages.images && selectedProjectForImages.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedProjectForImages.images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.imageUrl || img.image_url}
                            alt={img.caption || 'Project image'}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {img.isPrimary && (
                            <span className="absolute top-1 left-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded">
                              Primary
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteImage(img.id, selectedProjectForImages.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {img.caption || 'No caption'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleUploadImage} className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700">Upload New Image</h4>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image File *
                    </label>
                    <input
                      id="projectImageInput"
                      type="file"
                      accept="image/*"
                      required
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Caption
                    </label>
                    <input
                      type="text"
                      value={imageFormData.caption}
                      onChange={(e) => setImageFormData({ ...imageFormData, caption: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Front view of building"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={imageFormData.display_order}
                        onChange={(e) => setImageFormData({ ...imageFormData, display_order: parseInt(e.target.value) })}
                        className="input-field"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="is_primary"
                        checked={imageFormData.is_primary}
                        onChange={(e) => setImageFormData({ ...imageFormData, is_primary: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="is_primary" className="text-sm font-medium text-gray-700">
                        Set as primary image
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4 mr-2 inline" />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseImageModal}
                      className="btn-secondary flex-1"
                    >
                      <X className="h-4 w-4 mr-2 inline" />
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
