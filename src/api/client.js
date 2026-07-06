import axios from 'axios';

let rawUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'https://movietea.onrender.com';
if (rawUrl.endsWith('/')) rawUrl = rawUrl.slice(0, -1);
if (!rawUrl.endsWith('/api')) rawUrl += '/api';

const api = axios.create({
  baseURL: rawUrl,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${rawUrl.replace('/api', '')}${path}`;
  return path;
};
