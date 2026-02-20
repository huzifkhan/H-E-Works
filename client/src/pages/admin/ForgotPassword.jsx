import { useState } from 'react';
import { Link } from 'react-router-dom';
import { passwordResetAPI } from '../../utils/api';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await passwordResetAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset request failed:', error);
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-sm text-blue-800 font-semibold mb-2">Didn't receive the email?</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• The link expires in 1 hour</li>
                <li>• Check console for token (development mode)</li>
              </ul>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 btn-secondary w-full"
            >
              Try Another Email
            </button>
            <Link to="/admin/login" className="mt-4 block text-center text-sm text-gray-600 hover:text-primary-600">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link to="/admin/login" className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@business.com"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              <strong>Note:</strong> In development mode, check the browser console for the reset token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
