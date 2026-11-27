import { motion } from "framer-motion";
import { BookUp2, Calendar, Clock, RotateCcw, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "@shared/types";

interface LoanBookCardProps {
    book: Book;
    isOverdue: boolean;
    isReturning: boolean;
    onOpenDetail: (bookId: string) => void;
    onReturnBook: (book: Book) => void;
    onLendBook: (bookId: string) => void;
}

export default function LoanBookCard({
    book,
    isOverdue,
    isReturning,
    onOpenDetail,
    onReturnBook,
    onLendBook,
}: LoanBookCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-4 backdrop-blur-sm"
        >
            <div className="flex gap-3.5">
                <button
                    type="button"
                    onClick={() => onOpenDetail(book.id)}
                    className="w-12 h-16 rounded-lg shrink-0 shadow-inner border border-black/10 overflow-hidden cursor-pointer"
                    style={{
                        background: `linear-gradient(135deg, ${book.spineColors?.[0] || "#8B7355"}, ${book.spineColors?.[2] || "#5C4532"})`,
                    }}
                    title={book.title}
                />
                <div className="min-w-0 flex-1">
                    <button
                        type="button"
                        onClick={() => onOpenDetail(book.id)}
                        className="text-left font-serif font-bold text-darkBrown dark:text-cream hover:underline line-clamp-1 cursor-pointer"
                    >
                        {book.title}
                    </button>
                    <p className="text-xs text-walnut/70 dark:text-cream/60 line-clamp-1 mb-2">
                        {book.author}
                    </p>

                    {book.status === "borrowed" ? (
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1.5 text-darkBrown dark:text-cream/90">
                                <User size={12} />
                                <span className="font-medium truncate">
                                    {book.borrowedBy || "—"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                <span
                                    className={
                                        isOverdue
                                            ? "text-rose-600 font-semibold"
                                            : "text-walnut/75 dark:text-cream/70"
                                    }
                                >
                                    {book.dueDate
                                        ? new Date(
                                              book.dueDate,
                                          ).toLocaleDateString()
                                        : "—"}
                                </span>
                                {isOverdue && (
                                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                                        {t("borrow.overdue_badge", "Overdue")}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-walnut/10 text-walnut font-medium">
                            <Clock size={11} />
                            <span>
                                {t(`status.${book.status}`, book.status)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-walnut/10">
                {book.status === "borrowed" ? (
                    <button
                        type="button"
                        onClick={() => onReturnBook(book)}
                        disabled={isReturning}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <RotateCcw size={13} />
                        <span>
                            {t("borrow.mark_returned", "Mark Returned")}
                        </span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onLendBook(book.id)}
                        className="px-3 py-1.5 rounded-xl bg-walnut hover:bg-darkBrown text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                        <BookUp2 size={13} />
                        <span>{t("borrow.lend_this", "Lend Book")}</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
