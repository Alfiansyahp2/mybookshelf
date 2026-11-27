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
import { Card } from "./DashboardWidgets";
import { fadeUp } from "../../constants/dashboardTheme";
import { useAccountingOverview } from "@features/accounting";
import type { DashboardStats } from "../../hooks/useDashboardStats";
import { useTranslation } from "react-i18next";

interface DashboardStatCardsSectionProps {
    stats: DashboardStats;
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

    const kpis = [
        {
            icon: Library,
            label: t("dashboard.stat_cards.total_books"),
            val: stats.total,
            sub: t("dashboard.stat_cards.total_books_sub", {
                count: stats.addedThisMonth,
            }),
            badgeCls:
                "bg-indigo-500/15 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300",
        },
        {
            icon: Heart,
            label: t("dashboard.stat_cards.favorites"),
            val: stats.favorites,
            sub: t("dashboard.stat_cards.favorites_sub"),
            badgeCls:
                "bg-rose-500/15 dark:bg-rose-400/20 text-rose-600 dark:text-rose-300",
        },
        {
            icon: Bookmark,
            label: t("dashboard.stat_cards.finished"),
            val: stats.finished,
            sub: t("dashboard.stat_cards.finished_sub", {
                count: stats.finishedThisYear,
            }),
            badgeCls:
                "bg-violet-500/15 dark:bg-violet-400/20 text-violet-600 dark:text-violet-300",
        },
        {
            icon: BookMarked,
            label: t("dashboard.stat_cards.unread"),
            val: stats.unread,
            sub: t("dashboard.stat_cards.unread_sub"),
            badgeCls:
                "bg-slate-500/15 dark:bg-slate-400/20 text-slate-600 dark:text-slate-300",
        },
        {
            icon: Users,
            label: t("dashboard.stat_cards.borrowed"),
            val: stats.borrowed,
            sub: t("dashboard.stat_cards.borrowed_sub"),
            badgeCls:
                "bg-amber-500/15 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300",
        },
        {
            icon: DollarSign,
            label: t("dashboard.stat_cards.accounting"),
            val: totalExpenses,
            sub: t("dashboard.stat_cards.accounting_sub"),
            badgeCls:
                "bg-walnut/15 dark:bg-gold/20 text-walnut dark:text-gold",
            valSize: 18,
            route: "/accounting",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
            {kpis.map((s, i) => {
                const Icon = s.icon;
                return (
                    <motion.div
                        key={s.label}
                        {...fadeUp(i * 0.05)}
                        onClick={() => s.route && navigate(s.route)}
                        className={s.route ? "cursor-pointer" : "cursor-default"}
                    >
                        <Card
                            className="transition-all duration-200 hover:-translate-y-0.5 h-full p-3 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${s.badgeCls}`}
                                    >
                                        <Icon size={15} />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-medium text-ink/75 leading-tight line-clamp-1">
                                        {s.label}
                                    </span>
                                </div>
                                <div
                                    className="font-extrabold text-ink leading-none mb-1 break-words text-xl sm:text-2xl lg:text-[23px] tabular-nums"
                                    style={
                                        s.valSize
                                            ? { fontSize: s.valSize }
                                            : undefined
                                    }
                                >
                                    {s.val}
                                </div>
                            </div>
                            <div className="text-[10px] text-ink/55 mt-1 truncate">
                                {s.sub}
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
