// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // for handling cookies (optional, based on backend setup)
});

// Request Interceptor: Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error handler
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      console.error(`[API Error] ${config?.method?.toUpperCase()} ${config?.url} - ${status}`, error.response.data);

      if (status === 401) {
        console.warn('Unauthorized. Redirecting to login...');
        window.location.href = '/login';
      } else if (status === 403) {
        console.warn('Forbidden');
      } else if (status === 500) {
        console.error('Internal Server Error');
      }
    } else if (error.request) {
      console.error('[API Error] No response received:', error.request);
    } else {
      console.error('[API Error] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
