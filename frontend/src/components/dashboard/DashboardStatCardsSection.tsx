import { motion } from "framer-motion";
import {
    Library,
    Bookmark,
    Heart,
    Users,
    BookMarked,
    DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BRAND, Card, fadeUp } from "./DashboardWidgets";
import { useAccountingOverview } from "../../hooks/accounting/useAccountingReports";
import { useTranslation } from "react-i18next";

interface DashboardStatCardsSectionProps {
    stats: any;
}

export default function DashboardStatCardsSection({
    stats,
}: DashboardStatCardsSectionProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: accountingOverview } = useAccountingOverview({
        period: "month",
    });
    const totalExpenses =
        accountingOverview?.data?.summary?.formatted_total || "Rp 0";

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
            {[
                {
                    icon: Library,
                    label: t("dashboard.stat_cards.total_books"),
                    val: stats.total,
                    sub: t("dashboard.stat_cards.total_books_sub", {
                        count: stats.addedThisMonth,
                    }),
                    color: "#6366f1",
                    bg: "#eef2ff",
                },
                {
                    icon: Heart,
                    label: t("dashboard.stat_cards.favorites"),
                    val: stats.favorites,
                    sub: t("dashboard.stat_cards.favorites_sub"),
                    color: "#ec4899",
                    bg: "#fce7f3",
                },
                {
                    icon: Bookmark,
                    label: t("dashboard.stat_cards.finished"),
                    val: stats.finished,
                    sub: t("dashboard.stat_cards.finished_sub", {
                        count: stats.finishedThisYear,
                    }),
                    color: "#8b5cf6",
                    bg: "#ede9fe",
                },
                {
                    icon: BookMarked,
                    label: t("dashboard.stat_cards.unread"),
                    val: stats.unread,
                    sub: t("dashboard.stat_cards.unread_sub"),
                    color: "#64748b",
                    bg: "#f1f5f9",
                },
                {
                    icon: Users,
                    label: t("dashboard.stat_cards.borrowed"),
                    val: stats.borrowed,
                    sub: t("dashboard.stat_cards.borrowed_sub"),
                    color: "#f59e0b",
                    bg: "#fef3c7",
                },
                {
                    icon: DollarSign,
                    label: t("dashboard.stat_cards.accounting"),
                    val: totalExpenses,
                    sub: t("dashboard.stat_cards.accounting_sub"),
                    color: "#f59e0b",
                    bg: "#fef3c7",
                    valSize: 18,
                    route: "/accounting",
                },
            ].map((s, i) => {
                const Icon = s.icon;
                return (
                    <motion.div
                        key={s.label}
                        {...fadeUp(i * 0.05)}
                        onClick={() => s.route && navigate(s.route)}
                        style={{ cursor: s.route ? "pointer" : "default" }}
                    >
                        <Card
                            className="transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                                padding: "12px 12px",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                ...(s.route
                                    ? {
                                          boxShadow:
                                              "0 4px 12px rgba(0,0,0,0.05)",
                                      }
                                    : {}),
                            }}
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: s.bg }}
                                    >
                                        <Icon size={15} color={s.color} />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-medium text-walnut leading-tight line-clamp-1">
                                        {s.label}
                                    </span>
                                </div>
                                <div
                                    className="font-extrabold text-darkBrown leading-none mb-1 break-words text-xl sm:text-2xl lg:text-[24px]"
                                    style={s.valSize ? { fontSize: s.valSize } : {}}
                                >
                                    {s.val}
                                </div>
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-walnut/50 mt-1 truncate">
                                {s.sub}
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
