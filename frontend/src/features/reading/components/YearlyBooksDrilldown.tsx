import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Bookshelf, MobileCoverGrid } from "@features/library";
import type { Book } from "@shared/types";

interface YearlyBooksDrilldownProps {
    selectedYear: number | null;
    books: Book[];
    viewMode: "shelf" | "grid";
    onClose: () => void;
    onBookClick: (book: Book) => void;
}

export default function YearlyBooksDrilldown({
    selectedYear,
    books,
    viewMode,
    onClose,
    onBookClick,
}: YearlyBooksDrilldownProps) {
    const { t } = useTranslation();

    if (!selectedYear) {
        return null;
    }

    const virtualShelf = [
        {
            id: "year-shelf",
            name: t(
                "reading.books_read_in_year",
                "Buku yang Dibaca Tahun {{year}}",
                { year: selectedYear },
            ),
            order: 0,
            span: 12,
            capacity: 100,
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 sm:mb-8"
        >
            <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-walnut dark:bg-gold shadow-xs" />
                    <h2 className="font-serif font-bold text-base sm:text-lg text-ink tracking-wide">
                        {t(
                            "reading.books_read_in_year",
                            "Buku yang Dibaca Tahun {{year}}",
                            { year: selectedYear },
                        )}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface/85 border border-walnut/20 dark:border-walnut/35 text-[11px] font-semibold text-walnut dark:text-gold hover:bg-surface transition-colors"
                >
                    <X size={12} />
                    <span>{t("reading.clear_filter", "Tutup")}</span>
                </button>
            </div>
            {viewMode === "shelf" ? (
                <Bookshelf
                    books={books}
                    shelves={virtualShelf}
                    onBookClick={onBookClick}
                />
            ) : (
                <MobileCoverGrid
                    shelves={virtualShelf}
                    books={books}
                    onBookClick={onBookClick}
                />
            )}
        </motion.section>
    );
}
