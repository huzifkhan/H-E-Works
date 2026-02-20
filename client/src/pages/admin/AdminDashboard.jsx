import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { submissionsAPI } from '../../utils/api';
import SubmissionModal from '../../components/admin/SubmissionModal';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import {
  Inbox,
  CheckSquare,
  Archive,
  Search,
  Trash2,
  RefreshCw,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Mail,
  User,
  Calendar,
  Download,
  Filter,
  Square,
  Briefcase,
  MessageSquare,
  Settings,
  Image,
} from 'lucide-react';
import SEO from '../../components/common/SEO';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [bulkAction, setBulkAction] = useState('');
  const [dashboardView, setDashboardView] = useState('submissions'); // 'submissions' or 'analytics'

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, submissionsRes] = await Promise.all([
        submissionsAPI.getStats(),
        submissionsAPI.getAll({
          page: currentPage,
          limit: 10,
          status: activeTab === 'all' ? '' : activeTab,
          search: searchQuery,
        }),
      ]);
      setStats(statsRes.data.data);
      setSubmissions(submissionsRes.data.data);
      setPagination(submissionsRes.data.pagination);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await submissionsAPI.update(id, { status });
      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleViewSubmission = async (id) => {
    try {
      const response = await submissionsAPI.getOne(id);
      setSelectedSubmission(response.data.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch submission:', error);
    }
  };

  const handleModalUpdate = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await submissionsAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(submissions.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    try {
      const response = await submissionsAPI.export({
        status: activeTab === 'all' ? '' : activeTab,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleBulkAction = async () => {
    if (selectedIds.length === 0) return;

    if (!bulkAction) return;

    try {
      if (bulkAction === 'delete') {
        if (window.confirm(`Delete ${selectedIds.length} submissions? This cannot be undone.`)) {
          await submissionsAPI.bulkDelete(selectedIds);
        }
      } else {
        await submissionsAPI.bulkUpdate(selectedIds, bulkAction);
      }
      setSelectedIds([]);
      setBulkAction('');
      fetchData();
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const statCards = [
    { title: 'Total', value: stats?.total || 0, icon: <Inbox className="h-6 w-6" />, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
    { title: 'New', value: stats?.new || 0, icon: <Mail className="h-6 w-6" />, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { title: 'Read', value: stats?.read || 0, icon: <CheckSquare className="h-6 w-6" />, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
    { title: 'Replied', value: stats?.replied || 0, icon: <Archive className="h-6 w-6" />, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
  ];

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'read', label: 'Read' },
    { id: 'replied', label: 'Replied' },
  ];

  const getStatusBadgeClass = (status) => {
    const classes = {
      new: 'bg-green-100 text-green-700 border-green-200',
      read: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      replied: 'bg-blue-100 text-blue-700 border-blue-200',
      archived: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return classes[status] || classes.new;
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Admin Dashboard"
        description="H&E Works admin dashboard - Manage contact submissions and view analytics."
      />

      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">H</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    H&E Works Admin
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/admin/profile"
                  className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{admin?.name}</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Management Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <a
              href="/admin/services"
              className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Manage Services</h3>
                  <p className="text-white/80 text-sm">Edit website services</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/testimonials"
              className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Manage Testimonials</h3>
                  <p className="text-white/80 text-sm">Client reviews & feedback</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/projects"
              className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Image className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Manage Projects</h3>
                  <p className="text-white/80 text-sm">Project portfolio</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/admins"
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Admin Management</h3>
                  <p className="text-white/80 text-sm">Manage admin users</p>
                </div>
              </div>
            </a>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setDashboardView('submissions')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                dashboardView === 'submissions'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Inbox className="h-4 w-4 inline mr-2" />
              Submissions
            </button>
            <button
              onClick={() => setDashboardView('analytics')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                dashboardView === 'analytics'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </div>

          {/* Conditional Rendering */}
          {dashboardView === 'analytics' ? (
            <AnalyticsDashboard />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-4 rounded-xl`}>
                    <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-lg text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              {/* Search and Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-6 w-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">Contact Submissions</h2>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-primary-100 text-primary-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or subject..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="input-field pl-12"
                    />
                  </div>

                  {/* Date Range Filter */}
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => {
                        setDateRange({ ...dateRange, startDate: e.target.value });
                        setCurrentPage(1);
                      }}
                      className="input-field py-2 px-3 text-sm"
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => {
                        setDateRange({ ...dateRange, endDate: e.target.value });
                        setCurrentPage(1);
                      }}
                      className="input-field py-2 px-3 text-sm"
                      placeholder="To"
                    />
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={handleExport}
                    className="btn-secondary whitespace-nowrap flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-xl">
                    <p className="text-sm font-medium text-primary-900">
                      {selectedIds.length} submission(s) selected
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="input-field py-1.5 px-3 text-sm"
                      >
                        <option value="">Select action...</option>
                        <option value="read">Mark as Read</option>
                        <option value="replied">Mark as Replied</option>
                        <option value="archived">Mark as Archived</option>
                        <option value="delete">Delete</option>
                      </select>
                      <button
                        onClick={handleBulkAction}
                        disabled={!bulkAction}
                        className="btn-primary py-1.5 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIds([]);
                          setBulkAction('');
                        }}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                      <input
                        type="checkbox"
                        checked={submissions.length > 0 && selectedIds.length === submissions.length}
                        onChange={handleSelectAll}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="max-w-sm mx-auto">
                          <Inbox className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 font-medium">No submissions found</p>
                          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    submissions.map((submission) => (
                      <tr
                        key={submission.id}
                        onClick={() => handleViewSubmission(submission.id)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(submission.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectOne(submission.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{submission.name}</div>
                            <div className="text-sm text-gray-500">{submission.email}</div>
                            {submission.phone && (
                              <div className="text-xs text-gray-400 mt-1">{submission.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium max-w-xs truncate">
                            {submission.subject}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {submission.message}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={submission.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(submission.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer ${getStatusBadgeClass(submission.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {submission.createdAt ? (
                              new Date(submission.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(submission.id);
                            }}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{((currentPage - 1) * 10) + 1}</span> to <span className="font-semibold">{Math.min(currentPage * 10, pagination.total)}</span> of <span className="font-semibold">{pagination.total}</span> results
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200">
                    {currentPage} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={currentPage === pagination.pages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
            </>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      {modalOpen && selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => {
            setModalOpen(false);
            setSelectedSubmission(null);
          }}
          onUpdate={handleModalUpdate}
        />
      )}
    </>
  );
};

export default AdminDashboard;
