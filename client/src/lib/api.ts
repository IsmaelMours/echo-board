import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Use environment variable or empty for relative URLs
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - no need to add auth token since we're using session cookies
api.interceptors.request.use(
  (config) => {
    // Session-based authentication - no need to add token to headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

import { UserType, Feedback, AuthResponse } from '@/types';

// API methods
export const authAPI = {
  signUp: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/api/users/signup', data),
  
  signIn: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/users/signin', data),
  
  signOut: () => api.post('/api/users/signout'),
  
  getCurrentUser: () => api.get('/api/users/currentuser'),
};

export const feedbackAPI = {
  getAll: () => api.get<Feedback[]>('/api/feedback'),
  
  getById: (id: string) => api.get<Feedback>(`/api/feedback/${id}`),
  
  create: (data: { title: string; message: string; rating: number; userId: string }) =>
    api.post<Feedback>('/api/feedback', data),
  
  update: (id: string, data: { status?: string; title?: string; message?: string; rating?: number }) =>
    api.put(`/api/feedback/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/feedback/${id}`),
};

export const userAPI = {
  getAll: () => api.get('/api/users'),
  
  getById: (id: string) => api.get(`/api/users/${id}`),
  
  update: (id: string, data: any) => api.patch(`/api/users/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/users/${id}`),
};

export const healthAPI = {
  getStatus: () => api.get('/api/health'),
};

export default api;