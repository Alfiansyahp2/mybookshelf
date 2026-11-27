import { useMemo } from "react";
import { useDashboardSummary } from "@features/analytics";

export interface YearlyStat {
    year: number;
    finished: number;
    totalPages: number;
    pagesRead: number;
    readPct: number;
    goalPct: number;
}

export function useYearlyStats() {
    const { data: summary, isLoading } = useDashboardSummary();

    return useMemo(() => {
        const rawStats = summary?.yearly_stats ?? [];
        const yearlyStats: YearlyStat[] = rawStats.map((item) => ({
            year: item.year,
            finished: item.finished,
            totalPages: item.total_pages,
            pagesRead: item.pages_read,
            readPct: item.read_pct,
            goalPct: item.goal_pct,
        }));
        const activeYears = yearlyStats.map((item) => item.year);

        return { activeYears, yearlyStats, isLoading };
    }, [summary, isLoading]);
}
