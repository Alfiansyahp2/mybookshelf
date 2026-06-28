import axios from 'axios';
import { apiClient } from '../apiClient';

// Get the base API URL without the /api prefix
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const LARAVEL_BASE_URL = API_BASE_URL.replace('/api', '');

export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
}

// Auth API
export const authApi = {
  /**
   * Get CSRF cookie for Sanctum SPA authentication
   * IMPORTANT: This must be called directly to Laravel, not through /api prefix
   */
  async getCsrfCookie(): Promise<void> {
    console.log('Getting CSRF cookie from:', `${LARAVEL_BASE_URL}/sanctum/csrf-cookie`);
    // Use axios directly to avoid the /api prefix
    await axios.get(`${LARAVEL_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('CSRF cookie received');
  },

  /**
   * Login user (SPA session-based)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('authApi.login called with:', credentials);

    // First, get CSRF cookie
    await this.getCsrfCookie();

    // Then login
    const response = await apiClient.post('/v1/auth/login', credentials);
    console.log('authApi.login received response:', response);
    console.log('response.data:', response.data);
    console.log('response.data.data:', response.data?.data);

    // The apiClient.post() returns response.data, which is our API response
    // So response is: { success: true, message: "...", data: { user } }
    const authData = response.data || response;
    console.log('authApi.login returning:', authData);

    return authData;
  },

  /**
   * Register new user (SPA session-based)
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    console.log('authApi.register called with:', credentials);

    // First, get CSRF cookie
    await this.getCsrfCookie();

    // Then register
    const response = await apiClient.post('/v1/auth/register', credentials);
    console.log('authApi.register received response:', response);

    // Same logic as login
    const authData = response.data || response;
    console.log('authApi.register returning:', authData);

    return authData;
  },

  /**
   * Get current user info
   */
  async me(): Promise<{ user: User }> {
    console.log('authApi.me called');
    const response = await apiClient.get('/v1/auth/me');
    console.log('authApi.me response:', response);

    // response is: { success: true, data: { user: {...} } }
    const userData = response.data || response;
    console.log('authApi.me returning:', userData);

    return userData;
  },

  /**
   * Logout and end session
   */
  async logout(): Promise<void> {
    await apiClient.post('/v1/auth/logout');
  },
};
