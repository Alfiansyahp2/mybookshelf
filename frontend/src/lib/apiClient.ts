import axios, { AxiosError } from 'axios';

// API base URL - in production this should come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to get CSRF token from cookies
function getCsrfToken(): string | undefined {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

class ApiClient {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true, // IMPORTANT: Required for Sanctum SPA authentication
    });

    // Request interceptor - add CSRF token and handle session auth
    this.client.interceptors.request.use(
      (config) => {
        // Add CSRF token for POST/PUT/PATCH/DELETE requests
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
          const csrfToken = getCsrfToken();
          if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
            console.log('CSRF token added to request:', csrfToken.substring(0, 20) + '...');
          } else {
            console.warn('No CSRF token found in cookies!');
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.config.url, response.status, response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error('API Error:', error.config?.url, error.message, error.response?.data);
        if (error.response?.status === 401) {
          // Session expired - clear user data from localStorage
          localStorage.removeItem('user');
          console.warn('Authentication required. Please login.');
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url: string, params?: Record<string, any>) {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post(url: string, data?: Record<string, any>) {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async patch(url: string, data?: Record<string, any>) {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  async put(url: string, data?: Record<string, any>) {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete(url: string) {
    const response = await this.client.delete(url);
    return response.data;
  }

  get instance() {
    return this.client;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export axios instance for direct use if needed
export default apiClient.instance;
