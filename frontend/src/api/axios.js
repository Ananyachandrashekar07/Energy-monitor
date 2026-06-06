import axios from 'axios';
import toast from 'react-hot-toast';

// ── Base instance ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor — attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — handle 401 / token refresh ────────────────────────
let isRefreshing  = false;
let failedQueue   = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in-flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry  = true;
      isRefreshing     = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        processQueue(error);
        isRefreshing = false;
        logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefresh } = data.data;
        localStorage.setItem('accessToken',  accessToken);
        localStorage.setItem('refreshToken', newRefresh);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr);
        logout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Show toast for server errors (except 401 which we handle silently)
    const msg = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status !== 401) {
      toast.error(msg);
    }

    return Promise.reject(error);
  },
);

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default api;