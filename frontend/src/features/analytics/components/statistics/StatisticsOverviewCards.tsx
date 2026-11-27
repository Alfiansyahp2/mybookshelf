import { BookOpen, Clock, FileText, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatIdr } from "@shared/utils/formatters";
import type { StatisticsOverview, StatisticsPurchases, StatisticsReadingTime } from "../../api/statistics.api";

interface StatisticsOverviewCardsProps {
    overview?: StatisticsOverview;
    readingTime?: StatisticsReadingTime;
    purchases?: StatisticsPurchases;
    fallbackTotalBooks: number;
}

export default function StatisticsOverviewCards({
    overview,
    readingTime,
    purchases,
    fallbackTotalBooks,
}: StatisticsOverviewCardsProps) {
    const { t } = useTranslation();

    return (
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
                        / {overview?.total_books ?? fallbackTotalBooks}
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
                        {t("statistics.library_investment", "Total Invested")}
                    </span>
                    <Wallet size={16} className="text-walnut dark:text-gold" />
                </div>
                <p className="text-2xl font-serif font-bold text-ink">
                    {formatIdr(
                        Number(purchases?.accounting?.total_invested) ||
                            Number(purchases?.total_spent) ||
                            0,
                    )}
                </p>
            </div>
        </div>
    );
}
