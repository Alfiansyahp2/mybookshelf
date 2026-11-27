import axios from "axios";
import { apiClient } from "@shared/api/apiClient";
import type { AuthUser } from "@shared/types/api";

// Get the base API URL without the /api prefix
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const LARAVEL_BASE_URL = API_BASE_URL.replace("/api", "");

export type User = AuthUser;

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

export const authApi = {
    /**
     * Get CSRF cookie for Sanctum SPA authentication.
     */
    async getCsrfCookie(): Promise<void> {
        await axios.get(`${LARAVEL_BASE_URL}/sanctum/csrf-cookie`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
            },
        });
    },

    /**
     * Login user (SPA session-based).
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        await this.getCsrfCookie();
        const response = await apiClient.post("/v1/auth/login", credentials);
        return response.data || response;
    },

    /**
     * Register new user (SPA session-based).
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        await this.getCsrfCookie();
        const response = await apiClient.post("/v1/auth/register", credentials);
        return response.data || response;
    },

    /**
     * Get current authenticated user.
     */
    async me(): Promise<{ user: User }> {
        const response = await apiClient.get("/v1/auth/me");
        return response.data?.data || response.data || response;
    },

    /**
     * Logout and end session.
     */
    async logout(): Promise<void> {
        await apiClient.post("/v1/auth/logout");
    },

    /**
     * Update user profile.
     */
    async updateProfile(data: {
        name: string;
        email: string;
    }): Promise<AuthResponse> {
        const response = await apiClient.put("/v1/user/profile", data);
        return response.data?.data || response.data || response;
    },

    /**
     * Update password.
     */
    async updatePassword(data: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }): Promise<void> {
        await apiClient.put("/v1/user/password", data);
    },
};
