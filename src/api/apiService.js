import { API_BASE_URL, getAuthToken } from './config';

class ApiService {
  async request(endpoint, options = {}) {
    const { headers = {}, requiresAuth = false, ...restOptions } = options;

    const config = {
      ...restOptions,
      headers: {
        ...headers,
      },
    };

    // Add auth token if required or available
    if (requiresAuth || getAuthToken()) {
      const token = getAuthToken();
      if (!token && requiresAuth) {
        throw new Error('Authentication required');
      }
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Add Content-Type for JSON if body is present and not FormData
    if (config.body && !(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // Auth endpoints
  auth = {
    login: async (email, password) => {
      return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (fullName, email, password) => {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      });
    },
  };

  // Artwork endpoints
  artworks = {
    upload: async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      return this.request('/artworks/upload', {
        method: 'POST',
        body: formData,
        requiresAuth: true,
      });
    },

    analyze: async (artworkId) => {
      return this.request(`/artworks/${artworkId}/analyze`, {
        method: 'POST',
        requiresAuth: true,
      });
    },
  };

  // Pattern endpoints
  patterns = {
    generate: async (files, settings) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('settingsJson', JSON.stringify(settings));

      return this.request('/patterns/generate', {
        method: 'POST',
        body: formData,
        requiresAuth: true,
      });
    },
  };

  // Mockup endpoints
  mockups = {
    generate: async (patternUrl, productType, settings) => {
      return this.request('/mockups/generate', {
        method: 'POST',
        body: JSON.stringify({ patternUrl, productType, settings }),
        requiresAuth: true,
      });
    },
  };

  // Design endpoints
  designs = {
    create: async (artworkIds, patternSettings, mockupUrl) => {
      return this.request('/designs', {
        method: 'POST',
        body: JSON.stringify({ artworkIds, patternSettings, mockupUrl }),
        requiresAuth: true,
      });
    },

    getAll: async () => {
      return this.request('/designs', {
        method: 'GET',
        requiresAuth: true,
      });
    },

    getById: async (id) => {
      return this.request(`/designs/${id}`, {
        method: 'GET',
        requiresAuth: true,
      });
    },

    delete: async (id) => {
      return this.request(`/designs/${id}`, {
        method: 'DELETE',
        requiresAuth: true,
      });
    },
  };

  // Order endpoints
  orders = {
    create: async (orderData) => {
      return this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        requiresAuth: true,
      });
    },

    getAll: async () => {
      return this.request('/orders', {
        method: 'GET',
        requiresAuth: true,
      });
    },

    getById: async (id) => {
      return this.request(`/orders/${id}`, {
        method: 'GET',
        requiresAuth: true,
      });
    },
  };
}

export default new ApiService();
