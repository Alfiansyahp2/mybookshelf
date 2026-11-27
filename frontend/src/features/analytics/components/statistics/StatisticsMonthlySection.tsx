import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import type { StatisticsTopReadBook } from "../../api/statistics.api";

interface MonthlyChartItem {
    month: string;
    books: number;
}

interface StatisticsMonthlySectionProps {
    monthlyData: MonthlyChartItem[];
    topReadBooks: StatisticsTopReadBook[];
}

export default function StatisticsMonthlySection({
    monthlyData,
    topReadBooks,
}: StatisticsMonthlySectionProps) {
    const { t } = useTranslation();

    return (
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
                                        {t("statistics.sessions", "sessions")}
                                    </span>
                                    <span className="text-[11px] text-walnut/60">
                                        {Math.round(item.duration / 60)} min
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
