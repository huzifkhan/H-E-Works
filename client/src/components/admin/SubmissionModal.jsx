import { useEffect, useState } from 'react';
import { submissionsAPI } from '../../utils/api';
import {
  X,
  Mail,
  User,
  Phone,
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  AlertCircle,
  Paperclip,
  Download,
  FileText,
  Image,
} from 'lucide-react';

const SubmissionModal = ({ submission, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(submission);
  const [error, setError] = useState('');

  // Get backend URL from API config
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', ''); // Get base URL without /api

  useEffect(() => {
    if (submission) {
      setData(submission);
    }
  }, [submission]);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      await submissionsAPI.update(data.id, { status: newStatus });
      setData({ ...data, status: newStatus });
      onUpdate?.();
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  const getStatusBadgeClass = (status) => {
    const classes = {
      new: 'bg-green-100 text-green-700 border-green-200',
      read: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      replied: 'bg-blue-100 text-blue-700 border-blue-200',
      archived: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return classes[status] || classes.new;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Message Details</h3>
                <p className="text-xs text-gray-500">#{data.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-xl flex items-center border border-red-200">
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusBadgeClass(
                  data.status
                )}`}
              >
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </span>

              {/* Status Actions */}
              <div className="flex space-x-2">
                {data.status === 'new' && (
                  <button
                    onClick={() => handleStatusChange('read')}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                  >
                    Mark as Read
                  </button>
                )}
                {data.status === 'read' && (
                  <button
                    onClick={() => handleStatusChange('replied')}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    Mark as Replied
                  </button>
                )}
                {data.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusChange('archived')}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{data.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${data.email}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  {data.email}
                </a>
              </div>
              {data.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <a
                    href={`tel:${data.phone}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {data.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-gray-400" />
                <h4 className="font-semibold text-gray-900">Subject</h4>
              </div>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
                {data.subject}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <h4 className="font-semibold text-gray-900">Message</h4>
              </div>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                {data.message}
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {data.createdAt && !isNaN(new Date(data.createdAt).getTime()) ? (
                    new Date(data.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  {data.createdAt && !isNaN(new Date(data.createdAt).getTime()) ? (
                    new Date(data.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>
            </div>

            {/* Attachments */}
            {data.attachments && data.attachments.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Paperclip className="h-5 w-5 text-gray-400" />
                  <h4 className="font-semibold text-gray-900">Attachments ({data.attachments.length})</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={`${BASE_URL}${attachment.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                    >
                      {attachment.mimetype.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-primary-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary-600" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{attachment.filename}</p>
                        <p className="text-xs text-gray-500">
                          {(attachment.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
