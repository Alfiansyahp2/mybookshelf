import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "../../types";

interface ActiveReadingCardProps {
    book: Book;
    index: number;
    isUpdating?: boolean;
    onOpenBook: (book: Book) => void;
    onUpdatePage: (book: Book, nextPage: number) => void;
    onFinishBook: (book: Book) => void;
}

export default function ActiveReadingCard({
    book,
    index,
    isUpdating = false,
    onOpenBook,
    onUpdatePage,
    onFinishBook,
}: ActiveReadingCardProps) {
    const { t } = useTranslation();
    const currentPage = book.currentPage ?? 0;
    const totalPages = book.pages ?? 0;
    const progressPct =
        totalPages > 0
            ? Math.min(Math.round((currentPage / totalPages) * 100), 100)
            : (book.progress ?? 0);
    const remainingPages =
        totalPages > 0 ? Math.max(totalPages - currentPage, 0) : 0;

    const c0 = book.spineColors?.[0] || "#8B7355";
    const c1 = book.spineColors?.[1] || "#6B5344";
    const c2 = book.spineColors?.[2] || "#5C4532";

    const clampPage = (value: number) => {
        if (totalPages > 0) {
            return Math.min(Math.max(value, 0), totalPages);
        }
        return Math.max(value, 0);
    };

    const canDecrease = currentPage > 0 && !isUpdating;
    const canIncrease =
        !isUpdating && (totalPages <= 0 || currentPage < totalPages);

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#fcfaf7]/95 dark:bg-[#231b14]/95 rounded-2xl p-3.5 sm:p-4 border border-walnut/20 dark:border-walnut/35 shadow-sm hover:shadow-md transition-all backdrop-blur-sm flex gap-3.5 sm:gap-4 items-stretch"
        >
            {/* Book Cover / Vintage Spine Preview */}
            <button
                type="button"
                onClick={() => onOpenBook(book)}
                className="w-16 sm:w-[74px] aspect-[2/3] rounded-xl overflow-hidden shadow-md relative shrink-0 border border-black/15 dark:border-white/10 group focus:outline-none focus:ring-2 focus:ring-walnut dark:focus:ring-gold"
                style={{
                    background: book.coverImage
                        ? undefined
                        : `linear-gradient(145deg, ${c0} 0%, ${c1} 58%, ${c2} 100%)`,
                }}
                title={t("reading.open_detail", "Buka detail buku")}
            >
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full p-1.5 flex items-center justify-center text-center">
                        <span className="font-serif font-bold text-[10px] leading-tight text-amber-100 line-clamp-4 drop-shadow">
                            {book.title}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/15 pointer-events-none" />
                <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-white/25 pointer-events-none" />
            </button>

            {/* Book Metadata & Progress Controls */}
            <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => onOpenBook(book)}
                            className="text-left block w-full group"
                        >
                            <h3 className="font-serif font-bold text-sm sm:text-base text-darkBrown dark:text-cream leading-snug line-clamp-1 group-hover:text-walnut dark:group-hover:text-gold transition-colors">
                                {book.title}
                            </h3>
                        </button>
                        <p className="text-xs text-walnut/75 dark:text-cream/65 truncate mt-0.5">
                            {book.author || "-"}
                            {book.genre ? ` · ${book.genre}` : ""}
                        </p>
                    </div>

                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-walnut/12 dark:bg-gold/15 text-walnut dark:text-gold text-[11px] font-bold tabular-nums border border-walnut/15 dark:border-gold/25">
                        {progressPct}%
                    </span>
                </div>

                {/* Progress Bar & Counts */}
                <div>
                    <div className="flex items-center justify-between text-[11px] mb-1 gap-2">
                        <span className="font-semibold text-darkBrown dark:text-cream/90 tabular-nums">
                            {currentPage.toLocaleString()}
                            {totalPages > 0
                                ? ` / ${totalPages.toLocaleString()}`
                                : ""}{" "}
                            <span className="font-normal text-walnut/65 dark:text-cream/55">
                                {t("reading.pages_unit", "hal")}
                            </span>
                        </span>
                        {totalPages > 0 && (
                            <span className="text-walnut/70 dark:text-cream/60 tabular-nums truncate">
                                {remainingPages === 0
                                    ? t("reading.ready_to_finish", "Siap selesai")
                                    : t(
                                          "reading.remaining_pages",
                                          "{{count}} hal tersisa",
                                          { count: remainingPages },
                                      )}
                            </span>
                        )}
                    </div>

                    <div className="h-2 rounded-full bg-walnut/15 dark:bg-black/40 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7a5c42] via-[#b8844a] to-[#d4a574] dark:from-[#a9713b] dark:via-[#d4a574] dark:to-[#ffd166] transition-all duration-300"
                            style={{
                                width: `${Math.min(Math.max(progressPct, 0), 100)}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Quick Page Controls */}
                <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            disabled={!canDecrease}
                            onClick={() =>
                                onUpdatePage(book, clampPage(currentPage - 1))
                            }
                            className="h-7 px-2 rounded-lg border border-walnut/20 dark:border-walnut/35 bg-white/80 dark:bg-[#1a130d] text-darkBrown dark:text-cream text-[11px] font-semibold flex items-center gap-0.5 hover:bg-walnut/10 dark:hover:bg-walnut/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={t("reading.prev_page", "Kurangi 1 halaman")}
                        >
                            <Minus size={11} />
                            <span>1</span>
                        </button>
                        <button
                            type="button"
                            disabled={!canIncrease}
                            onClick={() =>
                                onUpdatePage(book, clampPage(currentPage + 5))
                            }
                            className="h-7 px-2 rounded-lg border border-walnut/20 dark:border-walnut/35 bg-white/80 dark:bg-[#1a130d] text-darkBrown dark:text-cream text-[11px] font-semibold flex items-center gap-0.5 hover:bg-walnut/10 dark:hover:bg-walnut/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={t("reading.add_5_pages", "Tambah 5 halaman")}
                        >
                            <Plus size={11} />
                            <span>5</span>
                        </button>
                        <button
                            type="button"
                            disabled={!canIncrease}
                            onClick={() =>
                                onUpdatePage(book, clampPage(currentPage + 10))
                            }
                            className="h-7 px-2 rounded-lg border border-walnut/20 dark:border-walnut/35 bg-white/80 dark:bg-[#1a130d] text-darkBrown dark:text-cream text-[11px] font-semibold flex items-center gap-0.5 hover:bg-walnut/10 dark:hover:bg-walnut/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={t(
                                "reading.add_10_pages",
                                "Tambah 10 halaman",
                            )}
                        >
                            <Plus size={11} />
                            <span>10</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => onFinishBook(book)}
                            className="h-7 px-2.5 rounded-lg bg-walnut/12 hover:bg-walnut/20 dark:bg-gold/15 dark:hover:bg-gold/25 text-darkBrown dark:text-gold text-[11px] font-semibold flex items-center gap-1 disabled:opacity-40 transition-colors"
                            title={t(
                                "reading.mark_finished",
                                "Tandai selesai",
                            )}
                        >
                            <CheckCircle2 size={12} />
                            <span className="hidden sm:inline">
                                {t("reading.finish_short", "Selesai")}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onOpenBook(book)}
                            className="h-7 px-2.5 rounded-lg bg-walnut hover:bg-darkBrown dark:bg-[#8a5a28] dark:hover:bg-[#a06b35] text-white text-[11px] font-semibold flex items-center gap-0.5 transition-colors"
                        >
                            <span>{t("reading.detail_short", "Detail")}</span>
                            <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
