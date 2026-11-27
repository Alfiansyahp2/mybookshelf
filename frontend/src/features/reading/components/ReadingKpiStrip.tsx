import { motion } from "framer-motion";
import { BookOpen, Bookmark, FileText, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReadingKpiStripProps {
    totalReadingBooks: number;
    totalUnreadBooks: number;
    totalPagesRead: number;
    totalPages: number;
    overallProgress: number;
    remainingPages: number;
}

export default function ReadingKpiStrip({
    totalReadingBooks,
    totalUnreadBooks,
    totalPagesRead,
    totalPages,
    overallProgress,
    remainingPages,
}: ReadingKpiStripProps) {
    const { t } = useTranslation();

    if (totalReadingBooks === 0 && totalUnreadBooks === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 sm:mb-7">
            {/* 1. Sedang Dibaca */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
            >
                <div className="w-9 h-9 rounded-xl bg-walnut/15 dark:bg-gold/15 text-walnut dark:text-gold flex items-center justify-center shrink-0">
                    <BookOpen size={17} />
                </div>
                <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-walnut/80 dark:text-cream/65 truncate">
                        {t("reading.reading_status", "Sedang Dibaca")}
                    </div>
                    <div className="text-lg sm:text-xl font-serif font-bold text-ink leading-tight tabular-nums">
                        {totalReadingBooks}{" "}
                        <span className="text-xs font-sans font-normal text-walnut/65 dark:text-cream/50">
                            {t("reading.books_unit", "buku")}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* 2. Antrean Belum Dibaca */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className="bg-surface/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
            >
                <div className="w-9 h-9 rounded-xl bg-walnut/12 dark:bg-gold/15 text-walnut dark:text-gold flex items-center justify-center shrink-0">
                    <Bookmark size={17} />
                </div>
                <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-walnut/80 dark:text-cream/65 truncate">
                        {t("reading.unread_queue", "Belum Dibaca")}
                    </div>
                    <div className="text-lg sm:text-xl font-serif font-bold text-ink leading-tight tabular-nums">
                        {totalUnreadBooks}{" "}
                        <span className="text-xs font-sans font-normal text-walnut/65 dark:text-cream/50">
                            {t("reading.books_unit", "buku")}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* 3. Halaman Dibaca */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="bg-surface/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
            >
                <div className="w-9 h-9 rounded-xl bg-gold/20 dark:bg-gold/15 text-walnut dark:text-gold flex items-center justify-center shrink-0">
                    <FileText size={17} />
                </div>
                <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-walnut/80 dark:text-cream/65 truncate">
                        {t("reading.pages_read", "Halaman Dibaca")}
                    </div>
                    <div className="text-lg sm:text-xl font-serif font-bold text-ink leading-tight tabular-nums truncate">
                        {totalPagesRead.toLocaleString()}{" "}
                        <span className="text-[11px] font-sans font-normal text-walnut/65 dark:text-cream/50">
                            {totalPages > 0
                                ? `/ ${totalPages.toLocaleString()}`
                                : t("reading.pages_unit", "hal")}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* 4. Total Progres */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="bg-surface/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
            >
                <div className="w-9 h-9 rounded-xl bg-walnut/15 dark:bg-gold/18 text-walnut dark:text-gold flex items-center justify-center shrink-0">
                    <TrendingUp size={17} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-walnut/80 dark:text-cream/65 truncate">
                            {t("reading.total_progress", "Total Progres")}
                        </span>
                        {totalPages > 0 && (
                            <span className="text-[10px] text-walnut/65 dark:text-cream/50 tabular-nums shrink-0">
                                -{remainingPages.toLocaleString()}{" "}
                                {t("reading.pages_unit", "hal")}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-serif font-bold text-ink leading-tight tabular-nums">
                            {overallProgress}%
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-walnut/15 dark:bg-black/40 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-walnut to-gold"
                                style={{
                                    width: `${Math.min(overallProgress, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
