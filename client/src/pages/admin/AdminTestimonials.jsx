import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { testimonialsAPI } from '../../utils/api';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Star,
  Quote,
  User,
  Building,
  AlertCircle,
} from 'lucide-react';

const AdminTestimonials = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    company: '',
    rating: 5,
    testimonial: '',
    project_type: '',
    is_approved: false,
    is_featured: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testimonialsRes, statsRes] = await Promise.all([
        testimonialsAPI.getAllAdmin(),
        testimonialsAPI.getStats(),
      ]);
      setTestimonials(testimonialsRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        client_name: testimonial.clientName,
        client_title: testimonial.clientTitle,
        company: testimonial.company,
        rating: testimonial.rating,
        testimonial: testimonial.testimonial,
        project_type: testimonial.projectType,
        is_approved: testimonial.isApproved,
        is_featured: testimonial.isFeatured,
        display_order: testimonial.displayOrder,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        client_name: '',
        client_title: '',
        company: '',
        rating: 5,
        testimonial: '',
        project_type: '',
        is_approved: false,
        is_featured: false,
        display_order: testimonials.length + 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await testimonialsAPI.update(editingTestimonial.id, formData);
      } else {
        await testimonialsAPI.create(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      alert('Failed to save testimonial. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert('Failed to delete testimonial.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
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
                H&E Works - Testimonials
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
            <p className="text-gray-600 mt-1">Client reviews and feedback</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Testimonial</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-1">Avg Rating</p>
            <div className="flex items-center space-x-2">
              <p className="text-3xl font-bold text-gray-900">{stats.averageRating || 0}</p>
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading testimonials...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{testimonial.clientName}</h3>
                        <p className="text-sm text-gray-500">
                          {testimonial.clientTitle} at {testimonial.company}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">{renderStars(testimonial.rating)}</div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                      <div className="flex items-start space-x-2">
                        <Quote className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 italic">{testimonial.testimonial}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                        {testimonial.projectType || 'General'}
                      </span>
                      {testimonial.isApproved && (
                        <span className="px-3 py-1 bg-green-100 rounded-full text-green-700">
                          Approved
                        </span>
                      )}
                      {testimonial.isFeatured && (
                        <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-700">
                          Featured
                        </span>
                      )}
                      <span className="text-gray-400">Order: {testimonial.displayOrder}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(testimonial)}
                      className="p-2 btn-secondary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Title
                    </label>
                    <input
                      type="text"
                      value={formData.client_title}
                      onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
                      className="input-field"
                      placeholder="CEO"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Testimonial *
                  </label>
                  <textarea
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    required
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Client's feedback..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Type
                  </label>
                  <input
                    type="text"
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Infrastructure"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_approved"
                      checked={formData.is_approved}
                      onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="is_approved" className="text-sm font-medium text-gray-700">
                      Approved
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                      Featured
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({ ...formData, display_order: parseInt(e.target.value) })
                      }
                      className="input-field py-1.5"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <button type="submit" className="btn-primary flex-1">
                    <Save className="h-4 w-4 mr-2 inline" />
                    {editingTestimonial ? 'Update' : 'Create'}
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
    </div>
  );
};

export default AdminTestimonials;
