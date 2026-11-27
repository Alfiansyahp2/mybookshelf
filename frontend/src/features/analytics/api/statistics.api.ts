import { apiClient } from "@shared/api/apiClient";

export interface StatisticsOverview {
    total_books: number;
    finished_books: number;
    currently_reading: number;
    favorite_books: number;
    pages_read: number;
    total_pages: number;
}

export interface StatisticsDailyActivity {
    date: string;
    duration: number;
    pages: number;
    books_finished: number;
    books_read: string[];
}

export interface StatisticsTopReadBook {
    id: string;
    name: string;
    value: number;
    duration: number;
    color: string;
}

export interface StatisticsReadingTime {
    total_seconds: number;
    total_hours: number;
    total_days: number;
}

export interface StatisticsPurchases {
    total_spent: number;
    average_price: number;
    accounting: {
        total_expenses: number;
        total_invested: number;
        active_budgets: number;
        this_month_expenses: number;
    };
}

export interface StatisticsData {
    overview: StatisticsOverview;
    reading_time: StatisticsReadingTime;
    genre_distribution: Record<string, number>;
    format_distribution: Record<string, number>;
    monthly_reading: Record<string, number>;
    yearly_reading: Record<string, number>;
    daily_activity: StatisticsDailyActivity[];
    purchases: StatisticsPurchases;
    top_read_books: StatisticsTopReadBook[];
    generated_at: string;
}

export interface StatisticsApiResponse {
    success: boolean;
    message: string;
    data: StatisticsData;
}

export const statisticsApi = {
    getStatistics: async (): Promise<StatisticsApiResponse> => {
        return await apiClient.get("/v1/statistics");
    },
};
