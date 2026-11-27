import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3 } from "lucide-react";
import SEO from "@shared/components/ui/SEO";
import { useStatistics } from "../hooks/useStatistics";
import StatisticsOverviewCards from "../components/statistics/StatisticsOverviewCards";
import StatisticsChartsGrid from "../components/statistics/StatisticsChartsGrid";
import StatisticsMonthlySection from "../components/statistics/StatisticsMonthlySection";

export default function StatisticsPage() {
    const { t } = useTranslation();
    const { data: statisticsResponse, isLoading } = useStatistics();

    const stats = statisticsResponse?.data;

    const genreData = useMemo(() => {
        const dist = stats?.genre_distribution || {};
        return Object.entries(dist)
            .filter(([name]) => name && name !== "")
            .map(([name, count]) => ({ name, count }));
    }, [stats]);

    const formatData = useMemo(() => {
        const dist = stats?.format_distribution || {};
        return Object.entries(dist)
            .filter(([name]) => name && name !== "")
            .map(([name, value]) => ({ name, value }));
    }, [stats]);

    const monthlyData = useMemo(() => {
        const monthly = stats?.monthly_reading || {};
        return Object.entries(monthly).map(([month, books]) => ({
            month,
            books,
        }));
    }, [stats]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <SEO title={t("navigation.statistics", "Statistics")} />
                <p className="text-walnut">
                    {t("statistics.loading", "Loading reading statistics...")}
                </p>
            </div>
        );
    }

    return (
        <div
            className="px-3.5 sm:px-6 md:px-8 pb-16 pt-[88px] sm:pt-[96px] md:pt-[104px] flex flex-col min-h-full relative transition-colors duration-500"
            style={{ background: "var(--app-wall-bg)" }}
        >
            <SEO
                title={t("navigation.statistics", "Statistics")}
                description={t(
                    "statistics.seo_description",
                    "Visualize your reading speed, genres, formats, and book investments.",
                )}
            />
            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-walnut/15 dark:bg-walnut/25 text-walnut dark:text-gold text-xs font-semibold tracking-wider uppercase mb-2">
                        <BarChart3 size={13} />
                        <span>{t("statistics.badge", "Analitik Literasi")}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-darkBrown dark:text-cream tracking-tight mb-1">
                        {t("statistics.title", "Statistics")}
                    </h1>
                    <p className="text-xs sm:text-sm text-walnut/80 dark:text-cream/70">
                        {t(
                            "statistics.subtitle",
                            "Insights from {{count}} books in your library.",
                            {
                                count: stats?.overview?.total_books ?? 0,
                            },
                        )}
                    </p>
                </div>

                <StatisticsOverviewCards
                    overview={stats?.overview}
                    readingTime={stats?.reading_time}
                    purchases={stats?.purchases}
                    fallbackTotalBooks={stats?.overview?.total_books ?? 0}
                />

                <StatisticsChartsGrid
                    genreData={genreData}
                    formatData={formatData}
                />

                <StatisticsMonthlySection
                    monthlyData={monthlyData}
                    topReadBooks={stats?.top_read_books || []}
                />
            </div>
        </div>
    );
}
