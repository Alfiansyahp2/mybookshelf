import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useTranslation } from "react-i18next";

const CHART_COLORS = [
    "#7A5C42",
    "#D4A574",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ec4899",
];

interface GenreChartItem {
    name: string;
    count: number;
}

interface FormatChartItem {
    name: string;
    value: number;
}

interface StatisticsChartsGridProps {
    genreData: GenreChartItem[];
    formatData: FormatChartItem[];
}

export default function StatisticsChartsGrid({
    genreData,
    formatData,
}: StatisticsChartsGridProps) {
    const { t } = useTranslation();

    return (
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
                                                    idx % CHART_COLORS.length
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
    );
}
