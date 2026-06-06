import api from '../api/axios';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login:          (data)     => api.post('/auth/login', data),
  register:       (data)     => api.post('/auth/register', data),
  me:             ()         => api.get('/auth/me'),
  refresh:        (token)    => api.post('/auth/refresh', { refreshToken: token }),
  changePassword: (data)     => api.put('/auth/change-password', data),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll:   (params) => api.get('/users', { params }),
  getById:  (id)     => api.get(`/users/${id}`),
  create:   (data)   => api.post('/users', data),
  update:   (id, d)  => api.put(`/users/${id}`, d),
  remove:   (id)     => api.delete(`/users/${id}`),
};

// ── Buildings ─────────────────────────────────────────────────────────────────
export const buildingsApi = {
  getAll:   (params) => api.get('/buildings', { params }),
  getById:  (id)     => api.get(`/buildings/${id}`),
  create:   (data)   => api.post('/buildings', data),
  update:   (id, d)  => api.put(`/buildings/${id}`, d),
  remove:   (id)     => api.delete(`/buildings/${id}`),
};

// ── Floors ────────────────────────────────────────────────────────────────────
export const floorsApi = {
  getAll:   (params) => api.get('/floors', { params }),
  getById:  (id)     => api.get(`/floors/${id}`),
  create:   (data)   => api.post('/floors', data),
  update:   (id, d)  => api.put(`/floors/${id}`, d),
  remove:   (id)     => api.delete(`/floors/${id}`),
};

// ── Zones (Rooms) ─────────────────────────────────────────────────────────────
export const zonesApi = {
  getAll:   (params) => api.get('/zones', { params }),
  getById:  (id)     => api.get(`/zones/${id}`),
  create:   (data)   => api.post('/zones', data),
  update:   (id, d)  => api.put(`/zones/${id}`, d),
  remove:   (id)     => api.delete(`/zones/${id}`),
};

// ── Sensors (Devices) ─────────────────────────────────────────────────────────
export const sensorsApi = {
  getAll:       (params) => api.get('/sensors', { params }),
  getById:      (id)     => api.get(`/sensors/${id}`),
  create:       (data)   => api.post('/sensors', data),
  update:       (id, d)  => api.put(`/sensors/${id}`, d),
  toggle:       (id)     => api.patch(`/sensors/${id}/toggle`),
  remove:       (id)     => api.delete(`/sensors/${id}`),
};

// ── Energy Readings ───────────────────────────────────────────────────────────
export const readingsApi = {
  getAll:     (params) => api.get('/readings', { params }),
  getLatest:  (params) => api.get('/readings/latest', { params }),
  getSummary: (params) => api.get('/readings/summary', { params }),
  create:     (data)   => api.post('/readings', data),
  bulkCreate: (data)   => api.post('/readings/bulk', data),
  remove:     (id)     => api.delete(`/readings/${id}`),
};

// ── Alerts ────────────────────────────────────────────────────────────────────
export const alertsApi = {
  getRules:        (params)   => api.get('/alerts/rules', { params }),
  createRule:      (data)     => api.post('/alerts/rules', data),
  updateRule:      (id, d)    => api.put(`/alerts/rules/${id}`, d),
  deleteRule:      (id)       => api.delete(`/alerts/rules/${id}`),
  getLogs:         (params)   => api.get('/alerts/logs', { params }),
  updateLogStatus: (id, data) => api.patch(`/alerts/logs/${id}/status`, data),
};

// ── Reports ───────────────────────────────────────────────────────────────────
export const reportsApi = {
  getConsumption:      (params) => api.get('/reports/consumption', { params }),
  getTrends:           (params) => api.get('/reports/trends', { params }),
  getTopConsumers:     (params) => api.get('/reports/top-consumers', { params }),
  getDashboardSummary: ()       => api.get('/reports/dashboard-summary'),
};