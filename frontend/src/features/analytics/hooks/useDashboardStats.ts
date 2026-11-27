import { useMemo } from "react";
import { STATUS_CFG } from "../constants/dashboardTheme";
import type { DashboardSummary } from "../api/analytics.api";

export function buildDashboardStatsFromSummary(summary?: DashboardSummary) {
    const overview = summary?.overview;
    const statusCounts = summary?.status_counts;
    const currentYear = overview?.current_year ?? new Date().getFullYear();

    return {
        total: overview?.total ?? 0,
        reading: overview?.reading ?? 0,
        finished: overview?.finished ?? 0,
        unread: overview?.unread ?? 0,
        wishlist: overview?.wishlist ?? 0,
        borrowed: overview?.borrowed ?? 0,
        favorites: overview?.favorites ?? 0,
        totalPages: overview?.total_pages ?? 0,
        pagesRead: overview?.pages_read ?? 0,
        addedThisMonth: overview?.added_this_month ?? 0,
        topGenre: overview?.top_genre ?? "—",
        avgRating: overview?.avg_rating ?? 0,
        finishedThisYear: overview?.finished_this_year ?? 0,
        currentYear,
        target: overview?.target ?? 12,
        currentlyReading: summary?.currently_reading ?? [],
        recentBooks: summary?.recent_books ?? [],
        recentlyFinished: summary?.recently_finished ?? [],
        genreChart: summary?.genre_chart ?? [],
        authorChart: summary?.author_chart ?? [],
        statusPie: (
            Object.entries(STATUS_CFG) as Array<
                [
                    keyof typeof STATUS_CFG,
                    (typeof STATUS_CFG)[keyof typeof STATUS_CFG],
                ]
            >
        )
            .map(([k, v]) => ({
                name: v.label,
                value: statusCounts?.[k] ?? overview?.[k] ?? 0,
                color: v.color,
            }))
            .filter((d) => d.value > 0),
        topReadBooks: summary?.top_read_books ?? [],
        bookColors: summary?.book_colors ?? [],
    };
}

export function useDashboardStats(summary?: DashboardSummary) {
    return useMemo(() => buildDashboardStatsFromSummary(summary), [summary]);
}

export type DashboardStats = ReturnType<typeof buildDashboardStatsFromSummary>;
