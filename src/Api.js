import axios from 'axios';

// Get API URL from environment variable or use default
const API_BASE_URL = process.env.REACT_APP_HISPANIE_API_URL || 'https://api.hispanie.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Include credentials by default for auth
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Response error:', error.response?.data || error.message);
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      error.message = 'Unauthorized. Please log in again.';
    } else if (error.response?.status === 403) {
      error.message = 'Forbidden. You do not have permission to access this resource.';
    } else if (error.response?.status === 404) {
      error.message = 'Resource not found.';
    } else if (error.response?.status === 413) {
      error.message = 'File too large. Please select a smaller file.';
    } else if (error.response?.status === 422) {
      error.message = error.response.data?.detail || 'Validation error.';
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default api;