import axios, { AxiosError } from "axios";

// API base URL - in production this should come from environment variables
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            withCredentials: true, // Required for Sanctum SPA authentication
        });

        // Request interceptor - add CSRF token for mutating requests
        this.client.interceptors.request.use(
            (config) => {
                if (
                    ["post", "put", "patch", "delete"].includes(
                        config.method?.toLowerCase() || "",
                    )
                ) {
                    const csrfToken = getCsrfToken();
                    if (csrfToken) {
                        config.headers["X-XSRF-TOKEN"] = csrfToken;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        // Response interceptor - clear cached user profile on unauthorized responses
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("user");
                }
                return Promise.reject(error);
            },
        );
    }

    async get(url: string, params?: Record<string, unknown>, signal?: AbortSignal) {
        const response = await this.client.get(url, { params, signal });
        return response.data;
    }

    async post(url: string, data?: unknown, signal?: AbortSignal) {
        const response = await this.client.post(url, data, { signal });
        return response.data;
    }

    async patch(url: string, data?: unknown, signal?: AbortSignal) {
        const response = await this.client.patch(url, data, { signal });
        return response.data;
    }

    async put(url: string, data?: unknown, signal?: AbortSignal) {
        const response = await this.client.put(url, data, { signal });
        return response.data;
    }

    async delete(url: string, signal?: AbortSignal) {
        const response = await this.client.delete(url, { signal });
        return response.data;
    }

    get instance() {
        return this.client;
    }
}

export const apiClient = new ApiClient();
export default apiClient.instance;
