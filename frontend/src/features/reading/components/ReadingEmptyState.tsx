import { motion } from "framer-motion";
import { BookOpen, Library, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReadingEmptyStateProps {
    onBrowseLibrary: () => void;
    onAddBook: () => void;
}

export default function ReadingEmptyState({
    onBrowseLibrary,
    onAddBook,
}: ReadingEmptyStateProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-14 sm:py-16 bg-surface/90 rounded-2xl border border-walnut/20 dark:border-walnut/30 p-6 sm:p-10 backdrop-blur-sm shadow-sm"
        >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-walnut/10 dark:bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-walnut/50 dark:text-gold/70" />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink mb-2">
                {t("reading.no_books", "Belum ada buku")}
            </h3>
            <p className="text-sm text-walnut/80 dark:text-cream/65 mb-6 max-w-md mx-auto">
                {t(
                    "reading.start_journey",
                    "Mulai perjalanan membaca dari perpustakaan kamu",
                )}
            </p>
            <div className="flex justify-center gap-2.5 flex-wrap">
                <button
                    type="button"
                    onClick={onBrowseLibrary}
                    className="px-5 py-2.5 bg-surfaceAlt hover:bg-surface text-ink border border-walnut/25 dark:border-walnut/35 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                >
                    <Library size={16} />
                    {t("reading.browse_library", "Jelajahi Perpustakaan")}
                </button>
                <button
                    type="button"
                    onClick={onAddBook}
                    className="px-5 py-2.5 bg-walnut hover:bg-darkBrown text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                >
                    <Plus size={16} />
                    {t("reading.add_book", "Tambah Buku")}
                </button>
            </div>
        </motion.div>
    );
}
