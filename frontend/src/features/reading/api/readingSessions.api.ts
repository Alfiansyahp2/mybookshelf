import { apiClient } from "@shared/api/apiClient";
import type { Book } from "@shared/types";

export interface ReadingSession {
    id: string;
    user_id: string;
    book_id: string;
    start_time: string;
    end_time: string | null;
    start_page: number;
    end_page: number | null;
    duration: number | null;
    is_paused: boolean;
    paused_seconds: number;
    last_paused_at: string | null;
    mood: "great" | "good" | "okay" | "difficult" | null;
    location: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    book?: {
        id: string;
        title: string;
        author: string;
        pages: number;
    };
}

export interface ReadingSessionStatistics {
    total_sessions: number;
    total_duration_seconds: number;
    total_duration_formatted: string;
    total_pages_read: number;
    average_reading_speed_pages_per_hour: number;
}

export interface StartSessionData {
    start_page: number;
    mood?: "great" | "good" | "okay" | "difficult";
    location?: string;
}

export interface EndSessionData {
    end_page: number;
    notes?: string;
}

export interface BookReadingSessionsResponse {
    sessions: ReadingSession[];
    statistics: ReadingSessionStatistics;
}

export const readingSessionsApi = {
    async startSession(
        bookId: string,
        data: StartSessionData,
    ): Promise<ReadingSession> {
        const response = await apiClient.post(
            `/v1/books/${bookId}/reading-sessions/start`,
            data,
        );
        return response.data || response;
    },

    async endSession(
        bookId: string,
        sessionId: string,
        data: EndSessionData,
    ): Promise<ReadingSession> {
        const response = await apiClient.put(
            `/v1/books/${bookId}/reading-sessions/${sessionId}/end`,
            data,
        );
        return response.data || response;
    },

    async pauseSession(
        bookId: string,
        sessionId: string,
        isPaused: boolean,
    ): Promise<ReadingSession> {
        const response = await apiClient.patch(
            `/v1/books/${bookId}/reading-sessions/${sessionId}/pause`,
            { is_paused: isPaused },
        );
        return response.data || response;
    },

    async getBookSessions(
        bookId: string,
    ): Promise<BookReadingSessionsResponse> {
        const response = await apiClient.get(
            `/v1/books/${bookId}/reading-sessions`,
        );
        return response.data || response;
    },

    async readAgain(bookId: string): Promise<Book> {
        const response = await apiClient.post(`/v1/books/${bookId}/read-again`);
        return response.data || response;
    },
};
