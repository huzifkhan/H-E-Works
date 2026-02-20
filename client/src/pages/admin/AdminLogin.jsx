import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle, Shield } from 'lucide-react';
import SEO from '../../components/common/SEO';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Login"
        description="H&E Works admin portal for managing contact submissions and viewing analytics."
        keywords="admin login, dashboard, H&E Works"
      />

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>

        <div className="max-w-md w-full relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                H&E Works
              </span>
            </Link>
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-4">
              <Shield className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Admin Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Sign in to your account</h1>
            <p className="mt-2 text-gray-600">
              Access the admin dashboard to manage submissions
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-soft-lg p-8 border border-gray-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl flex items-center border border-red-200">
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="admin@heworks.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  'Signing in...'
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
              >
                ← Back to website
              </Link>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
            <p className="font-semibold text-blue-900 mb-2 text-sm">Demo Credentials:</p>
            <div className="space-y-1 text-sm">
              <p className="font-mono text-blue-800 bg-white/50 px-3 py-1 rounded">Email: admin@business.com</p>
              <p className="font-mono text-blue-800 bg-white/50 px-3 py-1 rounded">Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
