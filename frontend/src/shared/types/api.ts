export interface AuthUser {
    id: string;
    name: string;
    email: string;
    created_at?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface PaginatedPayload<T> {
    current_page: number;
    data: T[];
    first_page_url?: string;
    from: number | null;
    last_page: number;
    last_page_url?: string;
    next_page_url?: string | null;
    path?: string;
    per_page: number;
    prev_page_url?: string | null;
    to: number | null;
    total: number;
}
