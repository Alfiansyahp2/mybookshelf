import { AlertTriangle, BookCheck, BookUp2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BorrowStatsGridProps {
    borrowedCount: number;
    overdueCount: number;
    availableCount: number;
}

export default function BorrowStatsGrid({
    borrowedCount,
    overdueCount,
    availableCount,
}: BorrowStatsGridProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <BookUp2 size={20} />
                </div>
                <div>
                    <p className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                        {t("borrow.currently_loaned", "Currently Loaned")}
                    </p>
                    <p className="text-2xl font-serif font-bold text-ink">
                        {borrowedCount}
                    </p>
                </div>
            </div>

            <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <p className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                        {t("borrow.overdue", "Overdue")}
                    </p>
                    <p className="text-2xl font-serif font-bold text-rose-700 dark:text-rose-400">
                        {overdueCount}
                    </p>
                </div>
            </div>

            <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <BookCheck size={20} />
                </div>
                <div>
                    <p className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                        {t("borrow.available_to_loan", "Available in Library")}
                    </p>
                    <p className="text-2xl font-serif font-bold text-ink">
                        {availableCount}
                    </p>
                </div>
            </div>
        </div>
    );
}
