/**
 * API Service for connecting frontend to the Render/local Node.js backend.
 * Uses VITE_API_URL if configured, otherwise falls back to http://localhost:5000.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

/**
 * Generic fetch wrapper with timeout and JSON handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for cold starts

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Server took too long to respond. The backend might be waking up on Render.');
    }
    throw err;
  }
}

export const api = {
  baseUrl: API_BASE_URL,

  // Health check
  async checkHealth() {
    try {
      const data = await apiRequest('/api/health');
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  // Authentication
  auth: {
    async login(email, password) {
      return await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    async register(name, email, password) {
      return await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    },

    async getMe(token) {
      return await apiRequest('/api/auth/me', {
        method: 'GET',
        token
      });
    }
  },

  // Quotations
  quotations: {
    async getAll(token) {
      return await apiRequest('/api/quotations', {
        method: 'GET',
        token
      });
    },

    async save(quotation, token) {
      return await apiRequest('/api/quotations', {
        method: 'POST',
        body: JSON.stringify(quotation),
        token
      });
    },

    async delete(id, token) {
      return await apiRequest(`/api/quotations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        token
      });
    }
  },

  // Invoices
  invoices: {
    async getAll(token) {
      return await apiRequest('/api/invoices', {
        method: 'GET',
        token
      });
    },

    async save(invoice, token) {
      return await apiRequest('/api/invoices', {
        method: 'POST',
        body: JSON.stringify(invoice),
        token
      });
    },

    async delete(id, token) {
      return await apiRequest(`/api/invoices/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        token
      });
    }
  },

  // Business Profile
  business: {
    async get(token) {
      return await apiRequest('/api/business', {
        method: 'GET',
        token
      });
    },

    async update(businessInfo, token) {
      return await apiRequest('/api/business', {
        method: 'PUT',
        body: JSON.stringify(businessInfo),
        token
      });
    }
  }
};

