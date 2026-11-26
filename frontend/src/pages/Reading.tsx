import { useEffect, useMemo, useRef, useState } from "react";
import {
    useBooks,
    useFinishReading,
    useUpdateProgress,
} from "../hooks/useBooks";
import { useShelves } from "../hooks/useShelves";
import { useNavigate } from "react-router-dom";
import { useBookstore } from "../store/useBookstore";
import Bookshelf from "../components/shelf/Bookshelf";
import MobileCoverGrid from "../components/shelf/MobileCoverGrid";
import AddBookModal from "../components/modals/AddBookModal";
import YearlyTargetCards from "../components/reading/YearlyTargetCards";
import ActiveReadingCard from "../components/reading/ActiveReadingCard";
import { getBookYears, useYearlyStats } from "../hooks/useYearlyStats";
import type { Book } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
    BookOpen,
    Bookmark,
    Check,
    ChevronDown,
    FileText,
    Filter,
    TrendingUp,
    Plus,
    LayoutGrid,
    Library,
    X,
} from "lucide-react";
import SEO from "../components/SEO";

type ShelfFilter = "all" | "reading" | "unread";

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
    const [shelfFilter, setShelfFilter] = useState<ShelfFilter>("all");
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<"shelf" | "grid">(
        typeof window !== "undefined" && window.innerWidth < 768
            ? "grid"
            : "shelf",
    );
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [addShelfId, setAddShelfId] = useState<string | undefined>();
    const [addShelfName, setAddShelfName] = useState<string | undefined>();
    const [addInitialStatus, setAddInitialStatus] =
        useState<Book["status"]>("reading");
    const [updatingBookId, setUpdatingBookId] = useState<string | null>(null);

    const { data: allBooksResponse, isLoading } = useBooks({});
    const { data: shelves = [] } = useShelves();
    const updateProgressMutation = useUpdateProgress();
    const finishReadingMutation = useFinishReading();

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

    const allBooks = useMemo(
        () => allBooksResponse?.data?.data || [],
        [allBooksResponse],
    );
    const readingBooks = useMemo(
        () => allBooks.filter((book: Book) => book.status === "reading"),
        [allBooks],
    );
    const unreadBooks = useMemo(
        () => allBooks.filter((book: Book) => book.status === "unread"),
        [allBooks],
    );

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
    const overallProgress =
        totalPages > 0 ? Math.round((totalPagesRead / totalPages) * 100) : 0;
    const remainingPages = Math.max(totalPages - totalPagesRead, 0);

    const { yearlyStats } = useYearlyStats(allBooks);

    const selectedYearBooks = useMemo(() => {
        if (!selectedYear) return [];
        return allBooks
            .filter((b: Book) => getBookYears(b).includes(selectedYear))
            .map((b: Book) => ({
                ...b,
                shelfId: "year-shelf",
            }));
    }, [allBooks, selectedYear]);

    const activeShelfId =
        shelfFilter === "unread" ? "unread-shelf" : "reading-shelf";

    const displayedShelfBooks = useMemo(() => {
        const items: Book[] = [];
        if (shelfFilter === "all" || shelfFilter === "reading") {
            items.push(
                ...readingBooks.map((b: Book) => ({
                    ...b,
                    shelfId: activeShelfId,
                })),
            );
        }
        if (shelfFilter === "all" || shelfFilter === "unread") {
            items.push(
                ...unreadBooks.map((b: Book) => ({
                    ...b,
                    shelfId: activeShelfId,
                })),
            );
        }
        return items;
    }, [activeShelfId, readingBooks, shelfFilter, unreadBooks]);

    const shelfGroups = useMemo(() => {
        if (displayedShelfBooks.length === 0) return [];
        const shelfName =
            shelfFilter === "reading"
                ? t("reading.reading_shelf", "Sedang Dibaca")
                : shelfFilter === "unread"
                  ? t("reading.unread_shelf", "Belum Dibaca")
                  : t("reading.shelf_title", "Koleksi Bacaan");

        return [
            {
                id: activeShelfId,
                name: shelfName,
                order: 0,
                span: 12,
                capacity: 100,
            },
        ];
    }, [activeShelfId, displayedShelfBooks.length, shelfFilter, t]);

    const handleBookClick = (book: Book) => {
        setSelectedBookId(book.id);
        toggleBookDetail(book.id);
    };

    const handleAddBook = (shelfId: string, shelfName?: string) => {
        const matchedShelf = shelves.find((s) => s.id === shelfId);
        const fallbackShelf = matchedShelf ?? shelves[0];

        if (!fallbackShelf) {
            toast.error(
                t(
                    "reading.no_real_shelf",
                    "Create a shelf in your library first before adding a book.",
                ),
            );
            navigate("/library");
            return;
        }

        setAddShelfId(fallbackShelf.id);
        setAddShelfName(shelfName || fallbackShelf.name);
        setAddInitialStatus(
            shelfId === "unread-shelf" ? "unread" : "reading",
        );
        setIsAddBookModalOpen(true);
    };

    const handleQuickPageUpdate = (book: Book, nextPage: number) => {
        setUpdatingBookId(book.id);
        updateProgressMutation.mutate(
            { id: book.id, currentPage: nextPage },
            {
                onSuccess: () => {
                    toast.success(
                        t(
                            "reading.progress_updated",
                            "Progres diperbarui ke halaman {{page}}",
                            { page: nextPage },
                        ),
                    );
                },
                onError: () => {
                    toast.error(
                        t(
                            "reading.progress_update_failed",
                            "Gagal memperbarui progres halaman",
                        ),
                    );
                },
                onSettled: () => setUpdatingBookId(null),
            },
        );
    };

    const handleFinishBook = (book: Book) => {
        setUpdatingBookId(book.id);
        finishReadingMutation.mutate(book.id, {
            onSuccess: () => {
                toast.success(
                    t("reading.book_finished", "\"{{title}}\" ditandai selesai!", {
                        title: book.title,
                    }),
                );
            },
            onError: () => {
                toast.error(
                    t(
                        "reading.finish_failed",
                        "Gagal menandai buku selesai",
                    ),
                );
            },
            onSettled: () => setUpdatingBookId(null),
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-full px-4 pt-[70px] pb-16 flex items-center justify-center bg-[linear-gradient(150deg,#e2c99a_0%,#cdb07c_45%,#b89860_100%)] dark:bg-[linear-gradient(150deg,#211810_0%,#19120c_48%,#120c08_100%)]">
                <SEO title={t("navigation.reading", "Reading")} />
                <div className="text-sm font-medium text-walnut dark:text-gold">
                    {t("reading.loading", "Loading reading progress...")}
                </div>
            </div>
        );
    }

    return (
        <div className="px-3.5 sm:px-6 md:px-8 pb-10 md:pb-14 pt-[58px] sm:pt-[62px] md:pt-[70px] flex flex-col min-h-full relative bg-[linear-gradient(150deg,#e2c99a_0%,#cdb07c_45%,#b89860_100%)] dark:bg-[linear-gradient(150deg,#211810_0%,#19120c_48%,#120c08_100%)] transition-colors duration-500">
            <SEO
                title={t("navigation.reading", "Reading")}
                description={t(
                    "reading.seo_description",
                    "Track your current reading progress and goals.",
                )}
            />
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
                <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3.5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-walnut/15 dark:bg-walnut/30 border border-walnut/15 dark:border-gold/20 text-walnut dark:text-gold text-[11px] font-semibold tracking-wider uppercase mb-2">
                            <BookOpen size={12} />
                            <span>
                                {t("reading.badge", "Progres Membaca")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-darkBrown dark:text-cream tracking-tight">
                                {t(
                                    "reading.currently_reading",
                                    "Currently Reading",
                                )}
                            </h1>
                            {totalReadingBooks > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[26px] h-6 px-2 rounded-full bg-walnut/15 dark:bg-gold/15 text-walnut dark:text-gold font-serif font-bold text-xs sm:text-sm border border-walnut/15 dark:border-gold/25">
                                    {totalReadingBooks}
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-walnut/80 dark:text-cream/65">
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

                    {/* Top-Right Balanced Quick Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate("/library")}
                            className="px-3 py-2 rounded-xl bg-[#fcfaf7]/80 hover:bg-[#fcfaf7] dark:bg-[#231b14]/85 dark:hover:bg-[#2d2219] border border-walnut/20 dark:border-walnut/35 text-darkBrown dark:text-cream text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-xs transition-all backdrop-blur-sm"
                        >
                            <Library size={15} className="text-walnut dark:text-gold" />
                            <span>
                                {t("reading.browse_library", "Jelajahi Perpustakaan")}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleAddBook(
                                    "reading-shelf",
                                    t("reading.reading_shelf", "Sedang Dibaca"),
                                )
                            }
                            className="px-3.5 py-2 rounded-xl bg-walnut hover:bg-darkBrown dark:bg-[#8a5a28] dark:hover:bg-[#a06b35] text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all"
                        >
                            <Plus size={16} />
                            <span>{t("reading.add_book", "Tambah Buku")}</span>
                        </button>
                    </div>
                </div>

                {/* Yearly Targets Strip */}
                <YearlyTargetCards
                    yearlyStats={yearlyStats}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                />

                {/* Selected Year Books Drilldown */}
                {selectedYear && (
                    <motion.section
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-7 sm:mb-8"
                    >
                        <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-walnut dark:bg-gold shadow-xs" />
                                <h2 className="font-serif font-bold text-base sm:text-lg text-darkBrown dark:text-cream tracking-wide">
                                    {t(
                                        "reading.books_read_in_year",
                                        "Buku yang Dibaca Tahun {{year}}",
                                        { year: selectedYear },
                                    )}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedYear(null)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fcfaf7]/80 dark:bg-[#231b14]/90 border border-walnut/20 dark:border-walnut/35 text-[11px] font-semibold text-walnut dark:text-gold hover:bg-[#fcfaf7] dark:hover:bg-[#2d2219] transition-colors"
                            >
                                <X size={12} />
                                <span>
                                    {t("reading.clear_filter", "Tutup")}
                                </span>
                            </button>
                        </div>
                        {viewMode === "shelf" ? (
                            <Bookshelf
                                books={selectedYearBooks}
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
                                books={selectedYearBooks}
                                onBookClick={handleBookClick}
                            />
                        )}
                    </motion.section>
                )}

                {/* Warm Compact KPI Summary Strip */}
                {(totalReadingBooks > 0 || totalUnreadBooks > 0) && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 sm:mb-7">
                        {/* 1. Sedang Dibaca */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#fcfaf7]/95 dark:bg-[#231b14]/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
                        >
                            <div className="w-9 h-9 rounded-xl bg-walnut/15 dark:bg-gold/15 text-walnut dark:text-gold flex items-center justify-center shrink-0">
                                <BookOpen size={17} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11px] font-semibold text-walnut/75 dark:text-cream/60 truncate">
                                    {t(
                                        "reading.reading_status",
                                        "Sedang Dibaca",
                                    )}
                                </div>
                                <div className="text-lg sm:text-xl font-serif font-bold text-darkBrown dark:text-cream leading-tight tabular-nums">
                                    {totalReadingBooks}{" "}
                                    <span className="text-xs font-sans font-normal text-walnut/60 dark:text-cream/45">
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
                            className="bg-[#fcfaf7]/95 dark:bg-[#231b14]/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#9a5b25]/12 dark:bg-amber-400/15 text-[#8a4d19] dark:text-amber-300 flex items-center justify-center shrink-0">
                                <Bookmark size={17} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11px] font-semibold text-walnut/75 dark:text-cream/60 truncate">
                                    {t(
                                        "reading.unread_queue",
                                        "Belum Dibaca",
                                    )}
                                </div>
                                <div className="text-lg sm:text-xl font-serif font-bold text-darkBrown dark:text-cream leading-tight tabular-nums">
                                    {totalUnreadBooks}{" "}
                                    <span className="text-xs font-sans font-normal text-walnut/60 dark:text-cream/45">
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
                            className="bg-[#fcfaf7]/95 dark:bg-[#231b14]/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
                        >
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-400/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                                <FileText size={17} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11px] font-semibold text-walnut/75 dark:text-cream/60 truncate">
                                    {t("reading.pages_read", "Halaman Dibaca")}
                                </div>
                                <div className="text-lg sm:text-xl font-serif font-bold text-darkBrown dark:text-cream leading-tight tabular-nums truncate">
                                    {totalPagesRead.toLocaleString()}{" "}
                                    <span className="text-[11px] font-sans font-normal text-walnut/60 dark:text-cream/45">
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
                            className="bg-[#fcfaf7]/95 dark:bg-[#231b14]/95 rounded-2xl p-3 sm:p-3.5 border border-walnut/20 dark:border-walnut/35 shadow-xs hover:shadow-md transition-all backdrop-blur-sm flex items-center gap-3"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#5c3a1e]/12 dark:bg-[#d4a574]/18 text-[#5c3a1e] dark:text-[#f2d0a4] flex items-center justify-center shrink-0">
                                <TrendingUp size={17} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-[11px] font-semibold text-walnut/75 dark:text-cream/60 truncate">
                                        {t(
                                            "reading.total_progress",
                                            "Total Progres",
                                        )}
                                    </span>
                                    {totalPages > 0 && (
                                        <span className="text-[10px] text-walnut/60 dark:text-cream/45 tabular-nums shrink-0">
                                            -{remainingPages.toLocaleString()} {t("reading.pages_unit", "hal")}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-lg sm:text-xl font-serif font-bold text-darkBrown dark:text-cream leading-tight tabular-nums">
                                        {overallProgress}%
                                    </span>
                                    <div className="flex-1 h-1.5 rounded-full bg-walnut/15 dark:bg-black/40 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[#8a5a28] via-[#cfa064] to-[#e7bd82]"
                                            style={{
                                                width: `${Math.min(overallProgress, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Active Reading Focus Cards (Direct Progress Controls) */}
                {readingBooks.length > 0 && (
                    <section className="mb-7 sm:mb-8">
                        <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-walnut dark:bg-gold shadow-xs" />
                                <h2 className="font-serif font-bold text-base sm:text-lg text-darkBrown dark:text-cream tracking-wide">
                                    {t(
                                        "reading.active_focus_title",
                                        "Fokus Bacaan Saat Ini",
                                    )}
                                </h2>
                            </div>
                            <span className="text-xs text-walnut/75 dark:text-cream/60 font-medium">
                                {t(
                                    "reading.quick_update_hint",
                                    "Klik tombol untuk update cepat",
                                )}
                            </span>
                        </div>

                        <div
                            className={
                                readingBooks.length === 1
                                    ? "grid grid-cols-1 max-w-2xl gap-3"
                                    : "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5"
                            }
                        >
                            {readingBooks.map((book: Book, index: number) => (
                                <ActiveReadingCard
                                    key={book.id}
                                    book={book}
                                    index={index}
                                    isUpdating={updatingBookId === book.id}
                                    onOpenBook={handleBookClick}
                                    onUpdatePage={handleQuickPageUpdate}
                                    onFinishBook={handleFinishBook}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Single Collapsible Shelf & Status Dropdown */}
                {(totalReadingBooks > 0 || totalUnreadBooks > 0) && (
                    <section className="mb-6">
                        <div className="relative z-30 flex items-center justify-between gap-2.5 mb-3 px-0.5 flex-wrap">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsCollectionOpen((prev) => !prev)
                                }
                                aria-expanded={isCollectionOpen}
                                title={
                                    isCollectionOpen
                                        ? t(
                                              "reading.collapse_shelf",
                                              "Lipat rak",
                                          )
                                        : t(
                                              "reading.expand_shelf",
                                              "Tampilkan rak",
                                          )
                                }
                                className="flex items-center gap-2 group py-1 pr-2 rounded-xl hover:bg-white/25 dark:hover:bg-white/5 transition-colors"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-walnut dark:bg-gold shadow-xs" />
                                <h2 className="font-serif font-bold text-base sm:text-lg text-darkBrown dark:text-cream tracking-wide">
                                    {t(
                                        "reading.shelf_title",
                                        "Koleksi Bacaan",
                                    )}
                                </h2>
                                <span className="text-[11px] font-serif font-bold px-2 py-0.5 rounded-full bg-walnut/15 dark:bg-gold/15 text-walnut dark:text-gold border border-walnut/15 dark:border-gold/20">
                                    {displayedShelfBooks.length}
                                </span>
                                <span className="w-6 h-6 rounded-lg bg-white/45 dark:bg-black/30 border border-white/50 dark:border-white/10 flex items-center justify-center text-walnut dark:text-gold group-hover:bg-white/75 dark:group-hover:bg-black/45 transition-colors">
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${
                                            isCollectionOpen
                                                ? "rotate-180"
                                                : "rotate-0"
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
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/55 hover:bg-white/75 dark:bg-black/35 dark:hover:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/15 text-darkBrown dark:text-cream text-[11px] sm:text-xs font-semibold shadow-xs transition-all"
                                    >
                                        <Filter
                                            size={13}
                                            className="text-walnut dark:text-gold"
                                        />
                                        <span>
                                            {shelfFilter === "reading"
                                                ? t(
                                                      "library.filters.reading",
                                                      "Dibaca",
                                                  )
                                                : shelfFilter === "unread"
                                                  ? t(
                                                        "library.filters.unread",
                                                        "Belum Dibaca",
                                                    )
                                                  : t(
                                                        "library.filters.all",
                                                        "Semua",
                                                    )}
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
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -6,
                                                    scale: 0.97,
                                                }}
                                                transition={{ duration: 0.15 }}
                                                role="listbox"
                                                className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[#fcfaf7] dark:bg-[#231b14] border border-walnut/20 dark:border-walnut/40 shadow-lg py-1.5 z-40"
                                            >
                                                {(
                                                    [
                                                        {
                                                            key: "all",
                                                            label: t(
                                                                "library.filters.all",
                                                                "Semua",
                                                            ),
                                                            count:
                                                                totalReadingBooks +
                                                                totalUnreadBooks,
                                                        },
                                                        {
                                                            key: "reading",
                                                            label: t(
                                                                "library.filters.reading",
                                                                "Dibaca",
                                                            ),
                                                            count: totalReadingBooks,
                                                        },
                                                        {
                                                            key: "unread",
                                                            label: t(
                                                                "library.filters.unread",
                                                                "Belum Dibaca",
                                                            ),
                                                            count: totalUnreadBooks,
                                                        },
                                                    ] as const
                                                ).map((opt) => {
                                                    const isSelected =
                                                        shelfFilter === opt.key;
                                                    return (
                                                        <button
                                                            key={opt.key}
                                                            type="button"
                                                            role="option"
                                                            aria-selected={
                                                                isSelected
                                                            }
                                                            onClick={() => {
                                                                setShelfFilter(
                                                                    opt.key,
                                                                );
                                                                setIsCollectionOpen(
                                                                    true,
                                                                );
                                                                setIsFilterMenuOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                                                isSelected
                                                                    ? "bg-walnut/10 dark:bg-gold/15 text-darkBrown dark:text-gold"
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
                                                                <span>
                                                                    {opt.label}
                                                                </span>
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
                                            setViewMode("shelf");
                                            setIsCollectionOpen(true);
                                        }}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                                            viewMode === "shelf"
                                                ? "bg-white dark:bg-[#2b2017] text-darkBrown dark:text-cream shadow-xs"
                                                : "text-walnut/75 dark:text-cream/65 hover:text-darkBrown dark:hover:text-cream"
                                        }`}
                                        title={t(
                                            "library.view_shelf",
                                            "Tampilan Rak",
                                        )}
                                    >
                                        <BookOpen size={14} />
                                        <span className="hidden sm:inline">
                                            {t(
                                                "library.view_shelf_short",
                                                "Rak",
                                            )}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setViewMode("grid");
                                            setIsCollectionOpen(true);
                                        }}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                                            viewMode === "grid"
                                                ? "bg-white dark:bg-[#2b2017] text-darkBrown dark:text-cream shadow-xs"
                                                : "text-walnut/75 dark:text-cream/65 hover:text-darkBrown dark:hover:text-cream"
                                        }`}
                                        title={t(
                                            "library.view_grid",
                                            "Tampilan Grid Sampul",
                                        )}
                                    >
                                        <LayoutGrid size={14} />
                                        <span className="hidden sm:inline">
                                            {t(
                                                "library.view_grid_short",
                                                "Grid",
                                            )}
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
                                        <div className="bg-[#fcfaf7]/85 dark:bg-[#231b14]/90 rounded-2xl border border-walnut/20 dark:border-walnut/30 p-8 text-center">
                                            <p className="text-sm font-medium text-darkBrown dark:text-cream mb-1">
                                                {t(
                                                    "reading.empty_filtered_title",
                                                    "Belum ada buku pada kategori ini",
                                                )}
                                            </p>
                                            <p className="text-xs text-walnut/70 dark:text-cream/60">
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
                                            onAddBook={handleAddBook}
                                            selectedBookId={selectedBookId}
                                            isDrawerOpen={isBookDetailOpen}
                                            onBookClick={handleBookClick}
                                        />
                                    ) : (
                                        <MobileCoverGrid
                                            shelves={shelfGroups}
                                            books={displayedShelfBooks}
                                            onBookClick={handleBookClick}
                                            onAddBook={handleAddBook}
                                        />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                )}

                {/* Empty State - only if truly nothing to show */}
                {totalReadingBooks === 0 && totalUnreadBooks === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-14 sm:py-16 bg-[#fcfaf7]/85 dark:bg-[#231b14]/90 rounded-2xl border border-walnut/20 dark:border-walnut/30 p-6 sm:p-10 backdrop-blur-sm shadow-sm"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-walnut/10 dark:bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-walnut/50 dark:text-gold/70" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-darkBrown dark:text-cream mb-2">
                            {t("reading.no_books", "Belum ada buku")}
                        </h3>
                        <p className="text-sm text-walnut/75 dark:text-cream/65 mb-6 max-w-md mx-auto">
                            {t(
                                "reading.start_journey",
                                "Mulai perjalanan membaca dari perpustakaan kamu",
                            )}
                        </p>
                        <div className="flex justify-center gap-2.5 flex-wrap">
                            <button
                                type="button"
                                onClick={() => navigate("/library")}
                                className="px-5 py-2.5 bg-white/90 hover:bg-white dark:bg-[#1b140e] dark:hover:bg-[#281e15] text-darkBrown dark:text-cream border border-walnut/25 dark:border-walnut/35 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                            >
                                <Library size={16} />
                                {t(
                                    "reading.browse_library",
                                    "Jelajahi Perpustakaan",
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    handleAddBook(
                                        "reading-shelf",
                                        t(
                                            "reading.reading_shelf",
                                            "Sedang Dibaca",
                                        ),
                                    )
                                }
                                className="px-5 py-2.5 bg-walnut hover:bg-darkBrown dark:bg-[#8a5a28] dark:hover:bg-[#a06b35] text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                            >
                                <Plus size={16} />
                                {t("reading.add_book", "Tambah Buku")}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            <AddBookModal
                isOpen={isAddBookModalOpen}
                onClose={() => setIsAddBookModalOpen(false)}
                shelfId={addShelfId}
                shelfName={addShelfName}
                initialStatus={addInitialStatus}
            />
        </div>
    );
}
