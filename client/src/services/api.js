import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to add JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Dispatch a custom event so the context can catch it and logout, or we can just redirect
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (username, email, password) => api.post('/auth/register', { username, email, password });
export const googleLogin = (credential) => api.post('/auth/google', { credential });
export const getMe = () => api.get('/auth/me');

export const getGames = () => api.get('/games');
export const getGameBySlug = (slug) => api.get(`/games/${slug}`);
export const getGamePlugins = (slug, params) => api.get(`/games/${slug}/plugins`, { params });

export const getPlugins = (params) => api.get('/plugins', { params });
export const getFeaturedPlugins = () => api.get('/plugins/featured');
export const getPluginById = (id) => api.get(`/plugins/${id}`);

export const getUserProfile = (username) => api.get(`/users/${username}`);

export default api;
