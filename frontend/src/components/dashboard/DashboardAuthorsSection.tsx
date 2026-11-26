import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
} from "recharts";
import { Card, ChartTooltip } from "./DashboardWidgets";
import { BRAND, fadeUp } from "../../constants/dashboardTheme";
import type { DashboardStats } from "../../hooks/useDashboardStats";
import { useTranslation } from "react-i18next";

interface DashboardAuthorsSectionProps {
    stats: DashboardStats;
}

export default function DashboardAuthorsSection({
    stats,
}: DashboardAuthorsSectionProps) {
    const { t } = useTranslation();
    const authorData = stats.authorChart.map((a) => ({
        ...a,
        displayName:
            a.name.length > 14 ? `${a.name.slice(0, 14)}…` : a.name,
    }));

    return (
        <motion.div {...fadeUp(0.58)}>
            <Card
                style={{
                    height: 272,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        padding: "14px 18px 10px",
                        borderBottom:
                            "1px solid rgb(var(--color-walnut-rgb) / 0.14)",
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            fontSize: 14,
                            fontFamily: "'Georgia',serif",
                            fontWeight: 700,
                            color: BRAND.darkBrown,
                        }}
                    >
                        {t("dashboard.authors.title")}
                    </h3>
                </div>
                <div
                    style={{
                        padding: "10px 14px 12px",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,
                    }}
                >
                    {authorData.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "20px 0",
                                color: "rgb(var(--app-ink-rgb) / 0.5)",
                                fontSize: 12,
                            }}
                        >
                            {t("dashboard.authors.no_data")}
                        </div>
                    ) : (
                        <div
                            style={{
                                overflowY: "auto",
                                flex: 1,
                                paddingRight: 4,
                                display: "flex",
                                flexDirection: "column",
                            }}
                            className="hide-scrollbar"
                        >
                            <div
                                style={{
                                    minHeight: Math.max(
                                        150,
                                        authorData.length * 28,
                                    ),
                                    flex: 1,
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={authorData}
                                        layout="vertical"
                                        margin={{
                                            left: 4,
                                            right: 16,
                                            top: 2,
                                            bottom: 2,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgb(var(--color-walnut-rgb) / 0.14)"
                                            horizontal={false}
                                        />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            type="category"
                                            dataKey="displayName"
                                            tick={{
                                                fontSize: 10.5,
                                                fill: "rgb(var(--app-ink-rgb) / 0.78)",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={92}
                                        />
                                        <Tooltip
                                            content={<ChartTooltip />}
                                            cursor={{
                                                fill: "rgb(var(--color-walnut-rgb) / 0.1)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            name={t("dashboard.authors.books")}
                                            fill={BRAND.gold}
                                            radius={[0, 4, 4, 0]}
                                            barSize={14}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
