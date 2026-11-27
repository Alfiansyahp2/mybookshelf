import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, ChevronDown, Filter, LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Bookshelf, MobileCoverGrid } from "@features/library";
import type { Book, Shelf } from "@shared/types";

export type ReadingShelfFilter = "all" | "reading" | "unread";

interface ReadingCollectionSectionProps {
    totalReadingBooks: number;
    totalUnreadBooks: number;
    displayedShelfBooks: Book[];
    shelfGroups: Shelf[];
    shelfFilter: ReadingShelfFilter;
    onShelfFilterChange: (filter: ReadingShelfFilter) => void;
    viewMode: "shelf" | "grid";
    onViewModeChange: (mode: "shelf" | "grid") => void;
    selectedBookId: string | null;
    isBookDetailOpen: boolean;
    onBookClick: (book: Book) => void;
    onAddBook: (shelfId: string, shelfName?: string) => void;
}

export default function ReadingCollectionSection({
    totalReadingBooks,
    totalUnreadBooks,
    displayedShelfBooks,
    shelfGroups,
    shelfFilter,
    onShelfFilterChange,
    viewMode,
    onViewModeChange,
    selectedBookId,
    isBookDetailOpen,
    onBookClick,
    onAddBook,
}: ReadingCollectionSectionProps) {
    const { t } = useTranslation();
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const filterMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isFilterMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterMenuRef.current &&
                !filterMenuRef.current.contains(event.target as Node)
            ) {
                setIsFilterMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isFilterMenuOpen]);

    if (totalReadingBooks === 0 && totalUnreadBooks === 0) {
        return null;
    }

    const filterOptions = [
        {
            key: "all" as const,
            label: t("library.filters.all", "Semua"),
            count: totalReadingBooks + totalUnreadBooks,
        },
        {
            key: "reading" as const,
            label: t("library.filters.reading", "Dibaca"),
            count: totalReadingBooks,
        },
        {
            key: "unread" as const,
            label: t("library.filters.unread", "Belum Dibaca"),
            count: totalUnreadBooks,
        },
    ];

    return (
        <section className="mb-6">
            <div className="relative z-30 flex items-center justify-between gap-2.5 mb-3 px-0.5 flex-wrap">
                <button
                    type="button"
                    onClick={() => setIsCollectionOpen((prev) => !prev)}
                    aria-expanded={isCollectionOpen}
                    title={
                        isCollectionOpen
                            ? t("reading.collapse_shelf", "Lipat rak")
                            : t("reading.expand_shelf", "Tampilkan rak")
                    }
                    className="flex items-center gap-2 group py-1 pr-2 rounded-xl hover:bg-white/25 dark:hover:bg-white/5 transition-colors"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-walnut dark:bg-gold shadow-xs" />
                    <h2 className="font-serif font-bold text-base sm:text-lg text-ink tracking-wide">
                        {t("reading.shelf_title", "Koleksi Bacaan")}
                    </h2>
                    <span className="text-[11px] font-serif font-bold px-2 py-0.5 rounded-full bg-walnut/15 dark:bg-gold/15 text-walnut dark:text-gold border border-walnut/15 dark:border-gold/20">
                        {displayedShelfBooks.length}
                    </span>
                    <span className="w-6 h-6 rounded-lg bg-surface/65 dark:bg-black/30 border border-white/50 dark:border-white/10 flex items-center justify-center text-walnut dark:text-gold group-hover:bg-surface/90 dark:group-hover:bg-black/45 transition-colors">
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                                isCollectionOpen ? "rotate-180" : "rotate-0"
                            }`}
                        />
                    </span>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {/* Status Filter Dropdown */}
                    <div ref={filterMenuRef} className="relative">
                        <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isFilterMenuOpen}
                            aria-label={t(
                                "reading.filter_label",
                                "Filter Status",
                            )}
                            onClick={() =>
                                setIsFilterMenuOpen((prev) => !prev)
                            }
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface/65 hover:bg-surface/90 dark:bg-black/35 dark:hover:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/15 text-ink text-[11px] sm:text-xs font-semibold shadow-xs transition-all"
                        >
                            <Filter
                                size={13}
                                className="text-walnut dark:text-gold"
                            />
                            <span>
                                {shelfFilter === "reading"
                                    ? t("library.filters.reading", "Dibaca")
                                    : shelfFilter === "unread"
                                      ? t(
                                            "library.filters.unread",
                                            "Belum Dibaca",
                                        )
                                      : t("library.filters.all", "Semua")}
                            </span>
                            <span className="text-[9px] sm:text-[10px] px-1.5 rounded-full bg-walnut/12 dark:bg-gold/15 text-walnut dark:text-gold font-semibold">
                                {displayedShelfBooks.length}
                            </span>
                            <ChevronDown
                                size={13}
                                className={`text-walnut/70 dark:text-gold/80 transition-transform duration-200 ${
                                    isFilterMenuOpen
                                        ? "rotate-180"
                                        : "rotate-0"
                                }`}
                            />
                        </button>

                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.97,
                                    }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    role="listbox"
                                    className="absolute right-0 mt-1.5 w-48 rounded-xl bg-surface border border-walnut/20 dark:border-walnut/40 shadow-lg py-1.5 z-40"
                                >
                                    {filterOptions.map((opt) => {
                                        const isSelected =
                                            shelfFilter === opt.key;
                                        return (
                                            <button
                                                key={opt.key}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => {
                                                    onShelfFilterChange(opt.key);
                                                    setIsCollectionOpen(true);
                                                    setIsFilterMenuOpen(false);
                                                }}
                                                className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                                    isSelected
                                                        ? "bg-walnut/10 dark:bg-gold/15 text-ink dark:text-gold"
                                                        : "text-walnut/85 dark:text-cream/80 hover:bg-walnut/5 dark:hover:bg-white/5"
                                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Check
                                                        size={13}
                                                        className={
                                                            isSelected
                                                                ? "opacity-100 text-walnut dark:text-gold"
                                                                : "opacity-0"
                                                        }
                                                    />
                                                    <span>{opt.label}</span>
                                                </span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-walnut/10 dark:bg-black/30 text-walnut dark:text-gold tabular-nums">
                                                    {opt.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* View Mode Switcher (Shelf vs Grid) */}
                    <div className="flex items-center bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 p-0.5 sm:p-1 rounded-xl shadow-xs shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                onViewModeChange("shelf");
                                setIsCollectionOpen(true);
                            }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                                viewMode === "shelf"
                                    ? "bg-surface text-ink shadow-xs"
                                    : "text-walnut/75 dark:text-cream/65 hover:text-ink"
                            }`}
                            title={t("library.view_shelf", "Tampilan Rak")}
                        >
                            <BookOpen size={14} />
                            <span className="hidden sm:inline">
                                {t("library.view_shelf_short", "Rak")}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onViewModeChange("grid");
                                setIsCollectionOpen(true);
                            }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                                viewMode === "grid"
                                    ? "bg-surface text-ink shadow-xs"
                                    : "text-walnut/75 dark:text-cream/65 hover:text-ink"
                            }`}
                            title={t(
                                "library.view_grid",
                                "Tampilan Grid Sampul",
                            )}
                        >
                            <LayoutGrid size={14} />
                            <span className="hidden sm:inline">
                                {t("library.view_grid_short", "Grid")}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isCollectionOpen && (
                    <motion.div
                        key="reading-collection-dropdown"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                            transitionEnd: { overflow: "visible" },
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            overflow: "hidden",
                        }}
                        transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ overflow: "hidden" }}
                    >
                        {shelfGroups.length === 0 ? (
                            <div className="bg-surface/90 rounded-2xl border border-walnut/20 dark:border-walnut/30 p-8 text-center">
                                <p className="text-sm font-medium text-ink mb-1">
                                    {t(
                                        "reading.empty_filtered_title",
                                        "Belum ada buku pada kategori ini",
                                    )}
                                </p>
                                <p className="text-xs text-walnut/75 dark:text-cream/60">
                                    {t(
                                        "reading.empty_filtered_desc",
                                        "Tambahkan buku atau pilih kategori lain dari dropdown untuk melihat koleksi.",
                                    )}
                                </p>
                            </div>
                        ) : viewMode === "shelf" ? (
                            <Bookshelf
                                books={displayedShelfBooks}
                                shelves={shelfGroups}
                                onAddBook={onAddBook}
                                selectedBookId={selectedBookId}
                                isDrawerOpen={isBookDetailOpen}
                                onBookClick={onBookClick}
                            />
                        ) : (
                            <MobileCoverGrid
                                shelves={shelfGroups}
                                books={displayedShelfBooks}
                                onBookClick={onBookClick}
                                onAddBook={onAddBook}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
