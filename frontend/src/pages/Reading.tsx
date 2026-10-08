import { useState, useRef } from "react";
import { useBooks } from "../hooks/useBooks";
import { useShelves } from "../hooks/useShelves";
import { useNavigate } from "react-router-dom";
import { useBookstore } from "../store/useBookstore";
import Bookshelf from "../components/shelf/Bookshelf";
import MobileCoverGrid from "../components/shelf/MobileCoverGrid";
import YearlyTargetCards from "../components/reading/YearlyTargetCards";
import { useYearlyStats, getBookYears } from "../hooks/useYearlyStats";
import type { Book } from "../types";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    BookOpen,
    TrendingUp,
    Clock,
    Target,
    Plus,
    LayoutGrid,
} from "lucide-react";
import SEO from "../components/SEO";

export default function Reading() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        selectedBookId,
        isBookDetailOpen,
        toggleBookDetail,
        setSelectedBookId,
    } = useBookstore();
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"shelf" | "grid">(
        typeof window !== "undefined" && window.innerWidth < 768
            ? "grid"
            : "shelf",
    );

    // Fetch all books from API
    const { data: allBooksResponse, isLoading } = useBooks({});

    const allBooks = allBooksResponse?.data?.data || [];
    const readingBooks = allBooks.filter(
        (book: Book) => book.status === "reading",
    );
    const unreadBooks = allBooks.filter(
        (book: Book) => book.status === "unread",
    );

    // Calculate reading statistics
    const totalReadingBooks = readingBooks.length;
    const totalUnreadBooks = unreadBooks.length;
    const totalPagesRead = readingBooks.reduce(
        (sum: number, book: Book) => sum + (book.currentPage || 0),
        0,
    );
    const totalPages = readingBooks.reduce(
        (sum: number, book: Book) => sum + (book.pages || 0),
        0,
    );
    const averageProgress =
        totalReadingBooks > 0
            ? Math.round(
                readingBooks.reduce(
                    (sum: number, book: Book) => sum + (book.progress || 0),
                    0,
                ) / totalReadingBooks,
            )
            : 0;
    // Calculate yearly statistics using custom hook
    const { yearlyStats } = useYearlyStats(allBooks);

    const handleBookClick = (book: any) => {
        setSelectedBookId(book.id);
        toggleBookDetail(book.id);
    };

    const handleAddBook = (shelfId: string, shelfName?: string) => {
        console.log("Add book to shelf:", shelfId, shelfName);
        // TODO: Implement add book functionality
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <SEO title={t("navigation.reading", "Reading")} />
                <div className="text-walnut">
                    {t("reading.loading", "Loading reading progress...")}
                </div>
            </div>
        );
    }

    return (
        <div
            className="px-3.5 sm:px-6 md:px-8 pb-8 md:pb-12 pt-[84px] sm:pt-[92px] md:pt-[104px] flex flex-col min-h-full relative"
            style={{
                background:
                    "linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)",
            }}
        >
            <SEO title={t("navigation.reading", "Reading")} description={t("reading.seo_description", "Track your current reading progress and goals.")} />
            {/* Plaster / linen wall texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    opacity: 0.18,
                    backgroundImage: `
          repeating-linear-gradient(0deg,  transparent, transparent 5px, rgba(0,0,0,0.02) 5px, rgba(0,0,0,0.02) 6px),
          repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px)
        `,
                }}
            />
            <div className="max-w-7xl mx-auto w-full relative z-10">
                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-walnut/10 dark:bg-indigo-500/15 text-walnut dark:text-[#ffd166] text-xs font-semibold tracking-wider uppercase mb-2">
                        {/* <BookOpen size={13} />
                        <span>{t("reading.badge", "Progres Membaca")}</span> */}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-darkBrown dark:text-cream tracking-tight mb-1">
                        {t("reading.currently_reading", "Currently Reading")}
                    </h1>
                    <p className="text-xs sm:text-sm text-walnut/70 dark:text-[#94a3b8]">
                        {t(
                            "reading.track_progress",
                            "Track your progress on {{count}} book{{s}}",
                            {
                                count: totalReadingBooks,
                                s: totalReadingBooks !== 1 ? "s" : "",
                            },
                        )}
                    </p>
                </div>

                <YearlyTargetCards
                    yearlyStats={yearlyStats}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                />

                {/* Selected Year Books */}
                {selectedYear && (
                    <div className="mb-8 sm:mb-10">
                        <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-[#ffd166] shadow-xs" />
                                <h2 className="font-serif font-bold text-base sm:text-lg text-[#0f172a] dark:text-[#f8fafc] tracking-wide">
                                    {t(
                                        "reading.books_read_in_year",
                                        "Buku yang Dibaca Tahun {{year}}",
                                        { year: selectedYear },
                                    )}
                                </h2>
                            </div>
                        </div>
                        {viewMode === "shelf" ? (
                            <Bookshelf
                                books={allBooks
                                    .filter((b: Book) =>
                                        getBookYears(b).includes(selectedYear),
                                    )
                                    .map((b: Book) => ({
                                        ...b,
                                        shelfId: "year-shelf",
                                    }))}
                                shelves={[
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
                                ]}
                                onBookClick={handleBookClick}
                            />
                        ) : (
                            <MobileCoverGrid
                                shelves={[
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
                                ]}
                                books={allBooks
                                    .filter((b: Book) =>
                                        getBookYears(b).includes(selectedYear),
                                    )
                                    .map((b: Book) => ({
                                        ...b,
                                        shelfId: "year-shelf",
                                    }))}
                                onBookClick={handleBookClick}
                            />
                        )}
                    </div>
                )}

                {/* Statistics Cards (Cozy Parchment & Muted Luxury Jewel Badges) */}
                {totalReadingBooks > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
                        {/* 1. Status Sedang Dibaca */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 dark:bg-[#131b2e]/95 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-indigo-500/20 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex flex-col justify-between"
                        >
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </div>
                                <span className="text-[11px] sm:text-xs font-semibold text-walnut/70 dark:text-[#94a3b8] line-clamp-1">
                                    {t("reading.reading_status", "Sedang Dibaca")}
                                </span>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-serif font-bold text-darkBrown dark:text-[#f8fafc] leading-tight">
                                    {totalReadingBooks} <span className="text-xs font-sans font-normal text-walnut/50 dark:text-stone-400">buku</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Progres Rata-rata */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white/90 dark:bg-[#131b2e]/95 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-indigo-500/20 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex flex-col justify-between"
                        >
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 dark:bg-blue-400/15 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </div>
                                <span className="text-[11px] sm:text-xs font-semibold text-walnut/70 dark:text-[#94a3b8] line-clamp-1">
                                    {t("reading.avg_progress", "Rata-rata Progres")}
                                </span>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-serif font-bold text-darkBrown dark:text-[#f8fafc] leading-tight">
                                    {averageProgress}%
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Halaman Terbaca */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/90 dark:bg-[#131b2e]/95 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-indigo-500/20 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex flex-col justify-between"
                        >
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 dark:bg-purple-400/15 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0">
                                    <Target className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </div>
                                <span className="text-[11px] sm:text-xs font-semibold text-walnut/70 dark:text-[#94a3b8] line-clamp-1">
                                    {t("reading.pages_read", "Halaman Dibaca")}
                                </span>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-serif font-bold text-darkBrown dark:text-[#f8fafc] leading-tight">
                                    {totalPagesRead.toLocaleString()} <span className="text-xs font-sans font-normal text-walnut/50 dark:text-stone-400">hal</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 4. Total Progres */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white/90 dark:bg-[#131b2e]/95 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-indigo-500/20 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex flex-col justify-between"
                        >
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </div>
                                <span className="text-[11px] sm:text-xs font-semibold text-walnut/70 dark:text-[#94a3b8] line-clamp-1">
                                    {t("reading.total_progress", "Total Progres")}
                                </span>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-serif font-bold text-darkBrown dark:text-[#f8fafc] leading-tight">
                                    {totalPages > 0
                                        ? Math.round(
                                            (totalPagesRead / totalPages) * 100,
                                        )
                                        : 0}%
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Unified Reading & Unread Bookshelf with View Switcher */}
                {(totalReadingBooks > 0 || totalUnreadBooks > 0) && (
                    <div className="mb-10">
                        {/* Section Header with View Mode Switcher */}
                        <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-[#ffd166] shadow-xs" />
                                <h2 className="font-serif font-bold text-base sm:text-lg text-[#0f172a] dark:text-[#f8fafc] tracking-wide">
                                    {t("reading.shelf_title", "Koleksi Bacaan")}
                                </h2>
                            </div>

                            {/* View Mode Switcher (Shelf vs Grid) */}
                            <div className="flex items-center bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 p-1 rounded-xl shadow-xs shrink-0">
                                <button
                                    onClick={() => setViewMode("shelf")}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "shelf"
                                            ? "bg-white text-darkBrown shadow-xs"
                                            : "text-walnut/70 hover:text-darkBrown"
                                        }`}
                                    title={t("library.view_shelf", "Tampilan Rak")}
                                >
                                    <BookOpen size={14} />
                                    <span className="hidden xs:inline">{t("library.view_shelf_short", "Rak")}</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "grid"
                                            ? "bg-white text-darkBrown shadow-xs"
                                            : "text-walnut/70 hover:text-darkBrown"
                                        }`}
                                    title={t("library.view_grid", "Tampilan Grid Sampul")}
                                >
                                    <LayoutGrid size={14} />
                                    <span className="hidden xs:inline">{t("library.view_grid_short", "Grid")}</span>
                                </button>
                            </div>
                        </div>

                        {viewMode === "shelf" ? (
                            <Bookshelf
                                books={[
                                    ...readingBooks.map((b: Book) => ({
                                        ...b,
                                        shelfId: "reading-shelf",
                                    })),
                                    ...unreadBooks.map((b: Book) => ({
                                        ...b,
                                        shelfId: "unread-shelf",
                                    })),
                                ]}
                                shelves={[
                                    ...(totalReadingBooks > 0
                                        ? [
                                            {
                                                id: "reading-shelf",
                                                name: t(
                                                    "reading.reading_shelf",
                                                    "Sedang Dibaca",
                                                ),
                                                order: 0,
                                                span: 12,
                                                capacity: 100,
                                            },
                                        ]
                                        : []),
                                    ...(totalUnreadBooks > 0
                                        ? [
                                            {
                                                id: "unread-shelf",
                                                name: t(
                                                    "reading.unread_shelf",
                                                    "Belum Dibaca",
                                                ),
                                                order: 1,
                                                span: 12,
                                                capacity: 100,
                                            },
                                        ]
                                        : []),
                                ]}
                                onAddBook={handleAddBook}
                                selectedBookId={selectedBookId}
                                isDrawerOpen={isBookDetailOpen}
                                onBookClick={handleBookClick}
                            />
                        ) : (
                            <MobileCoverGrid
                                shelves={[
                                    ...(totalReadingBooks > 0
                                        ? [
                                            {
                                                id: "reading-shelf",
                                                name: t(
                                                    "reading.reading_shelf",
                                                    "Sedang Dibaca",
                                                ),
                                                order: 0,
                                                span: 12,
                                                capacity: 100,
                                            },
                                        ]
                                        : []),
                                    ...(totalUnreadBooks > 0
                                        ? [
                                            {
                                                id: "unread-shelf",
                                                name: t(
                                                    "reading.unread_shelf",
                                                    "Belum Dibaca",
                                                ),
                                                order: 1,
                                                span: 12,
                                                capacity: 100,
                                            },
                                        ]
                                        : []),
                                ]}
                                books={[
                                    ...readingBooks.map((b: Book) => ({
                                        ...b,
                                        shelfId: "reading-shelf",
                                    })),
                                    ...unreadBooks.map((b: Book) => ({
                                        ...b,
                                        shelfId: "unread-shelf",
                                    })),
                                ]}
                                onBookClick={handleBookClick}
                                onAddBook={handleAddBook}
                            />
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                {totalReadingBooks > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center mt-6 mb-8"
                    >
                        <button
                            onClick={() => navigate("/library")}
                            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            {t("reading.browse_library", "Browse Library")}
                        </button>
                    </motion.div>
                )}

                {/* Empty State - only if truly nothing to show */}
                {totalReadingBooks === 0 && totalUnreadBooks === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 bg-walnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-10 h-10 text-walnut/30" />
                        </div>
                        <h3 className="text-xl font-serif text-darkBrown mb-2">
                            {t("reading.no_books", "Belum ada buku")}
                        </h3>
                        <p className="text-walnut/70 mb-6">
                            {t(
                                "reading.start_journey",
                                "Mulai perjalanan membaca dari perpustakaan kamu",
                            )}
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate("/library")}
                                className="px-6 py-3 bg-walnut text-white rounded-xl font-medium hover:bg-darkBrown transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                {t("reading.browse_library", "Browse Library")}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
