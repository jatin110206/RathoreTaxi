import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach JWT token from localStorage ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 → clear session ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored tokens on unauthorized
      localStorage.removeItem('rt_token');
      localStorage.removeItem('rt_user');
      localStorage.removeItem('rt_captain');
      
      const isAuthPage = ['/login', '/register', '/captain/login', '/captain/register', '/'].includes(
        window.location.pathname
      );
      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
