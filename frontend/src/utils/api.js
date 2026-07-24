const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('movitea_token');

// Set token to localStorage
export const setToken = (token) => {
  localStorage.setItem('movitea_token', token);
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem('movitea_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Generic fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  getMe: () => apiFetch('/auth/me'),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
};

// Products API
export const productsAPI = {
  getAll: () => apiFetch('/products'),
  getAdmin: () => apiFetch('/products/admin'),
  getBySlug: (slug) => apiFetch(`/products/${slug}`),
  create: (formData) => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
      body: formData,
    }).then(res => res.json());
  },
  update: (id, formData) => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
      body: formData,
    }).then(res => res.json());
  },
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
  reorder: (id, orderNumber) => apiFetch(`/products/${id}/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ orderNumber }),
  }),
};

// Orders API
export const ordersAPI = {
  create: (orderData, screenshot) => {
    const token = getToken();
    const formData = new FormData();
    
    Object.keys(orderData).forEach(key => {
      if (key === 'items') {
        formData.append('items', JSON.stringify(orderData.items));
      } else {
        formData.append(key, orderData[key]);
      }
    });

    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    return fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
      body: formData,
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }
      return data;
    });
  },
  getMyOrders: () => apiFetch('/orders/my-orders'),
  getAll: () => apiFetch('/orders/admin'),
  getById: (id) => apiFetch(`/orders/${id}`),
  verify: (id, status) => apiFetch(`/orders/${id}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ verificationStatus: status }),
  }),
  updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ orderStatus: status }),
  }),
};

// Promos API
export const promosAPI = {
  getAll: () => apiFetch('/promos'),
  apply: (code) => apiFetch('/promos/apply', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
  create: (data) => apiFetch('/promos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiFetch(`/promos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiFetch(`/promos/${id}`, { method: 'DELETE' }),
};

// Pre-Orders API
export const preordersAPI = {
  create: (data) => apiFetch('/preorders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAll: () => apiFetch('/preorders'),
  updateStatus: (id, status) => apiFetch(`/preorders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  delete: (id) => apiFetch(`/preorders/${id}`, { method: 'DELETE' }),
};

// Users API
export const usersAPI = {
  getAll: () => apiFetch('/users'),
  getById: (id) => apiFetch(`/users/${id}`),
  updateRole: (id, role) => apiFetch(`/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  }),
  updateProfile: (profileData) => apiFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  promoteByEmail: (email, role) => apiFetch('/users/promote-by-email', {
    method: 'PUT',
    body: JSON.stringify({ email, role }),
  }),
};

// Admin API
export const adminAPI = {
  getStats: () => apiFetch('/admin/stats'),
  getChart: (period = '7d') => apiFetch(`/admin/chart?period=${period}`),
  getEmailStats: () => apiFetch('/admin/emails'),
};

// Cart API
export const cartAPI = {
  get: () => apiFetch('/cart'),
  add: (productId, quantity = 1) => apiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  }),
  update: (cartItemId, quantity) => apiFetch(`/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  remove: (cartItemId) => apiFetch(`/cart/${cartItemId}`, { method: 'DELETE' }),
  clear: () => apiFetch('/cart', { method: 'DELETE' }),
  clearUserCart: (userId) => apiFetch(`/cart/user/${userId}`, { method: 'DELETE' }),
};

// Google OAuth
export const getGoogleAuthURL = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  return `${backendUrl}/api/auth/google`;
};
