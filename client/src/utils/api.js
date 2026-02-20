import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  submitMultipart: (data) => api.post('/contact', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Submissions API
export const submissionsAPI = {
  getAll: (params) => api.get('/submissions', { params }),
  getOne: (id) => api.get(`/submissions/${id}`),
  update: (id, data) => api.put(`/submissions/${id}`, data),
  delete: (id) => api.delete(`/submissions/${id}`),
  getStats: () => api.get('/submissions/stats'),
  export: (params) => api.get('/submissions/export', {
    params,
    responseType: 'blob',
  }),
  bulkUpdate: (ids, status) => api.put('/submissions/bulk', { ids, status }),
  bulkDelete: (ids) => api.delete('/submissions/bulk', { data: { ids } }),
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getAllAdmin: () => api.get('/projects/admin/all'),
  getOne: (id) => api.get(`/projects/${id}`),
  getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
  getCategories: () => api.get('/projects/categories'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addImage: (id, formData) => api.post(`/projects/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteImage: (imageId) => api.delete(`/projects/images/${imageId}`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getAllAdmin: () => api.get('/services/admin/all'),
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  getAllAdmin: () => api.get('/testimonials/admin/all'),
  getStats: () => api.get('/testimonials/stats'),
  getOne: (id) => api.get(`/testimonials/${id}`),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (period) => api.get('/analytics/overview', { params: { period } }),
  getDashboard: () => api.get('/analytics/dashboard'),
  getMonthlyReport: (year, month) => api.get(`/analytics/monthly/${year}/${month}`),
  getConversion: (period) => api.get('/analytics/conversion', { params: { period } }),
};

// Admin Management API
export const adminsAPI = {
  getAll: () => api.get('/admins'),
  getOne: (id) => api.get(`/admins/${id}`),
  create: (data) => api.post('/admins', data),
  update: (id, data) => api.put(`/admins/${id}`, data),
  toggleStatus: (id) => api.put(`/admins/${id}/toggle-status`),
  delete: (id) => api.delete(`/admins/${id}`),
};

// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/change-password', data),
};

// Password Reset API
export const passwordResetAPI = {
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyToken: (token) => api.get(`/auth/verify-token/${token}`),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export default api;
