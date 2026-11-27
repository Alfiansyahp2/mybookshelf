import { apiClient } from "@shared/api/apiClient";
import type { Book, BookStatus } from "@shared/types";
import type {
    DashboardBookSummary,
    DashboardTopReadBook,
} from "../constants/dashboardTheme";
import type { StatisticsDailyActivity } from "./statistics.api";

export interface DashboardOverviewSummary {
    total: number;
    reading: number;
    finished: number;
    unread: number;
    wishlist: number;
    borrowed: number;
    favorites: number;
    noted_count: number;
    overdue_count: number;
    available_to_loan_count: number;
    added_this_month: number;
    finished_this_year: number;
    current_year: number;
    target: number;
    total_pages: number;
    pages_read: number;
    reading_pages_read: number;
    reading_total_pages: number;
    avg_rating: number;
    top_genre: string;
    shelves_count: number;
}

export interface YearlyStatSummary {
    year: number;
    finished: number;
    total_pages: number;
    pages_read: number;
    read_pct: number;
    goal_pct: number;
}

export interface DashboardSummary {
    overview: DashboardOverviewSummary;
    yearly_stats: YearlyStatSummary[];
    genre_chart: Array<{ name: string; count: number }>;
    author_chart: Array<{ name: string; count: number }>;
    status_counts: Record<BookStatus, number>;
    currently_reading: DashboardBookSummary[];
    top_read_books: DashboardTopReadBook[];
    recent_books: Book[];
    recently_finished: Book[];
    book_colors: string[];
    daily_activity: StatisticsDailyActivity[];
    activity_books: Book[];
    generated_at: string;
}

export interface DashboardSummaryApiResponse {
    success: boolean;
    message: string;
    data: DashboardSummary;
}

export const analyticsApi = {
    async getDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
        const response: DashboardSummaryApiResponse = await apiClient.get(
            "/v1/analytics/dashboard",
            undefined,
            signal,
        );
        return response.data;
    },
};
