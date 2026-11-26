import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    BarChart3,
    BookOpen,
    Clock,
    FileText,
    Wallet,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useStatistics } from "../hooks/useStatistics";
import { useBooks } from "../hooks/useBooks";
import SEO from "../components/SEO";

const CHART_COLORS = [
    "#7A5C42",
    "#D4A574",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ec4899",
];

function formatIDR(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export default function Statistics() {
    const { t } = useTranslation();
    const { data: statisticsResponse, isLoading } = useStatistics();
    const { data: booksResponse } = useBooks({});

    const stats = statisticsResponse?.data;
    const allBooks = useMemo(
        () => booksResponse?.data?.data || [],
        [booksResponse],
    );

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

    const overview = stats?.overview;
    const readingTime = stats?.reading_time;
    const purchases = stats?.purchases;
    const topReadBooks = stats?.top_read_books || [];

    return (
        <div
            className="px-3.5 sm:px-6 md:px-8 pb-16 pt-[88px] sm:pt-[96px] md:pt-[104px] flex flex-col min-h-full relative transition-colors duration-500"
            style={{
                background: "var(--app-wall-bg)",
            }}
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
                            { count: overview?.total_books ?? allBooks.length },
                        )}
                    </p>
                </div>

                {/* Overview KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                                {t("statistics.books_finished", "Books Finished")}
                            </span>
                            <BookOpen size={16} className="text-walnut dark:text-gold" />
                        </div>
                        <p className="text-2xl font-serif font-bold text-ink">
                            {overview?.finished_books ?? 0}
                            <span className="text-sm font-sans font-normal text-walnut/65 dark:text-cream/50">
                                {" "}
                                / {overview?.total_books ?? allBooks.length}
                            </span>
                        </p>
                    </div>

                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                                {t("statistics.pages_read", "Pages Read")}
                            </span>
                            <FileText size={16} className="text-walnut dark:text-gold" />
                        </div>
                        <p className="text-2xl font-serif font-bold text-ink">
                            {(overview?.pages_read ?? 0).toLocaleString()}
                            <span className="text-sm font-sans font-normal text-walnut/65 dark:text-cream/50">
                                {" "}
                                / {(overview?.total_pages ?? 0).toLocaleString()}
                            </span>
                        </p>
                    </div>

                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                                {t("statistics.reading_time", "Reading Time")}
                            </span>
                            <Clock size={16} className="text-walnut dark:text-gold" />
                        </div>
                        <p className="text-2xl font-serif font-bold text-ink">
                            {readingTime?.total_hours ?? 0}
                            <span className="text-sm font-sans font-normal text-walnut/65 dark:text-cream/50">
                                {" "}
                                {t("statistics.hours", "hrs")}
                            </span>
                        </p>
                    </div>

                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                                {t(
                                    "statistics.library_investment",
                                    "Total Invested",
                                )}
                            </span>
                            <Wallet size={16} className="text-walnut dark:text-gold" />
                        </div>
                        <p className="text-2xl font-serif font-bold text-ink">
                            {formatIDR(
                                Number(purchases?.accounting?.total_invested) ||
                                    Number(purchases?.total_spent) ||
                                    0,
                            )}
                        </p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                    {/* Genre Distribution */}
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
                        <h2 className="font-serif font-bold text-lg text-ink mb-4">
                            {t("statistics.top_genres", "Top Genres")}
                        </h2>
                        {genreData.length === 0 ? (
                            <p className="text-sm text-walnut/60 py-12 text-center">
                                {t(
                                    "statistics.no_genre_data",
                                    "No genre data recorded yet.",
                                )}
                            </p>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={genreData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#7A5C4220"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="count"
                                            fill="#7A5C42"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Format Distribution */}
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
                        <h2 className="font-serif font-bold text-lg text-ink mb-4">
                            {t("statistics.formats", "Book Formats")}
                        </h2>
                        {formatData.length === 0 ? (
                            <p className="text-sm text-walnut/60 dark:text-cream/55 py-12 text-center">
                                {t(
                                    "statistics.no_format_data",
                                    "No format data available.",
                                )}
                            </p>
                        ) : (
                            <div className="h-64 flex items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={formatData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={85}
                                            label
                                        >
                                            {formatData.map((entry, idx) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={
                                                        CHART_COLORS[
                                                            idx %
                                                                CHART_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Finished + Top Read Books */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
                        <h2 className="font-serif font-bold text-lg text-ink mb-4">
                            {t(
                                "statistics.monthly_finished",
                                "Books Finished This Year",
                            )}
                        </h2>
                        {monthlyData.length === 0 ? (
                            <p className="text-sm text-walnut/60 dark:text-cream/55 py-10 text-center">
                                {t(
                                    "statistics.no_monthly_data",
                                    "Complete a book to see your monthly reading pace.",
                                )}
                            </p>
                        ) : (
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#7A5C4220"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="books"
                                            fill="#D4A574"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
                        <h2 className="font-serif font-bold text-lg text-ink mb-4">
                            {t(
                                "statistics.top_sessions",
                                "Most Active Reading Sessions",
                            )}
                        </h2>
                        {topReadBooks.length === 0 ? (
                            <p className="text-sm text-walnut/60 dark:text-cream/55 py-10 text-center">
                                {t(
                                    "statistics.no_sessions_data",
                                    "Start a reading session timer on a book to track session activity.",
                                )}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {topReadBooks.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surfaceAlt/85 border border-walnut/15 dark:border-walnut/25"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className="w-3 h-7 rounded-sm shrink-0"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="text-sm font-semibold text-darkBrown dark:text-cream truncate">
                                                {item.name}
                                            </span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-bold text-walnut block">
                                                {item.value}{" "}
                                                {t(
                                                    "statistics.sessions",
                                                    "sessions",
                                                )}
                                            </span>
                                            <span className="text-[11px] text-walnut/60">
                                                {Math.round(
                                                    item.duration / 60,
                                                )}{" "}
                                                min
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
