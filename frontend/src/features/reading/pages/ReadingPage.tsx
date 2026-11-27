import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Library, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import SEO from "@shared/components/ui/SEO";
import type { Book } from "@shared/types";
import {
    AddBookModal,
    useBooks,
    useBookstore,
    useFinishReading,
    useShelves,
    useUpdateProgress,
} from "@features/library";
import YearlyTargetCards from "../components/YearlyTargetCards";
import ActiveReadingCard from "../components/ActiveReadingCard";
import ReadingKpiStrip from "../components/ReadingKpiStrip";
import YearlyBooksDrilldown from "../components/YearlyBooksDrilldown";
import ReadingCollectionSection, {
    type ReadingShelfFilter,
} from "../components/ReadingCollectionSection";
import ReadingEmptyState from "../components/ReadingEmptyState";
import { getBookYears, useYearlyStats } from "../hooks/useYearlyStats";

export default function ReadingPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        selectedBookId,
        isBookDetailOpen,
        toggleBookDetail,
        setSelectedBookId,
    } = useBookstore();

    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [shelfFilter, setShelfFilter] = useState<ReadingShelfFilter>("all");
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

    const allBooks = useMemo(
        () => allBooksResponse?.data?.data || [],
        [allBooksResponse],
    );
    const readingBooks = useMemo(
        () => allBooks.filter((book) => book.status === "reading"),
        [allBooks],
    );
    const unreadBooks = useMemo(
        () => allBooks.filter((book) => book.status === "unread"),
        [allBooks],
    );

    const totalReadingBooks = readingBooks.length;
    const totalUnreadBooks = unreadBooks.length;
    const totalPagesRead = readingBooks.reduce(
        (sum, book) => sum + (book.currentPage || 0),
        0,
    );
    const totalPages = readingBooks.reduce(
        (sum, book) => sum + (book.pages || 0),
        0,
    );
    const overallProgress =
        totalPages > 0 ? Math.round((totalPagesRead / totalPages) * 100) : 0;
    const remainingPages = Math.max(totalPages - totalPagesRead, 0);

    const { yearlyStats } = useYearlyStats(allBooks);

    const selectedYearBooks = useMemo(() => {
        if (!selectedYear) return [];
        return allBooks
            .filter((b) => getBookYears(b).includes(selectedYear))
            .map((b) => ({ ...b, shelfId: "year-shelf" }));
    }, [allBooks, selectedYear]);

    const activeShelfId =
        shelfFilter === "unread" ? "unread-shelf" : "reading-shelf";

    const displayedShelfBooks = useMemo(() => {
        const items: Book[] = [];
        if (shelfFilter === "all" || shelfFilter === "reading") {
            items.push(
                ...readingBooks.map((b) => ({ ...b, shelfId: activeShelfId })),
            );
        }
        if (shelfFilter === "all" || shelfFilter === "unread") {
            items.push(
                ...unreadBooks.map((b) => ({ ...b, shelfId: activeShelfId })),
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
        setAddInitialStatus(shelfId === "unread-shelf" ? "unread" : "reading");
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
                    t(
                        "reading.book_finished",
                        '"{{title}}" ditandai selesai!',
                        { title: book.title },
                    ),
                );
            },
            onError: () => {
                toast.error(
                    t("reading.finish_failed", "Gagal menandai buku selesai"),
                );
            },
            onSettled: () => setUpdatingBookId(null),
        });
    };

    if (isLoading) {
        return (
            <div
                className="min-h-full px-4 pt-[70px] pb-16 flex items-center justify-center transition-colors duration-500"
                style={{ background: "var(--app-wall-bg)" }}
            >
                <SEO title={t("navigation.reading", "Reading")} />
                <div className="text-sm font-medium text-walnut dark:text-gold">
                    {t("reading.loading", "Loading reading progress...")}
                </div>
            </div>
        );
    }

    return (
        <div
            className="px-3.5 sm:px-6 md:px-8 pb-10 md:pb-14 pt-[58px] sm:pt-[62px] md:pt-[70px] flex flex-col min-h-full relative transition-colors duration-500"
            style={{ background: "var(--app-wall-bg)" }}
        >
            <SEO
                title={t("navigation.reading", "Reading")}
                description={t(
                    "reading.seo_description",
                    "Track your current reading progress and goals.",
                )}
            />
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
                <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3.5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-walnut/15 dark:bg-walnut/30 border border-walnut/15 dark:border-gold/20 text-walnut dark:text-gold text-[11px] font-semibold tracking-wider uppercase mb-2">
                            <BookOpen size={12} />
                            <span>
                                {t("reading.badge", "Progres Membaca")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-ink tracking-tight">
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
                        <p className="text-xs sm:text-sm text-walnut/85 dark:text-cream/65">
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

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate("/library")}
                            className="px-3 py-2 rounded-xl bg-surface/85 hover:bg-surface border border-walnut/20 dark:border-walnut/35 text-ink text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-xs transition-all backdrop-blur-sm"
                        >
                            <Library
                                size={15}
                                className="text-walnut dark:text-gold"
                            />
                            <span>
                                {t(
                                    "reading.browse_library",
                                    "Jelajahi Perpustakaan",
                                )}
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
                            className="px-3.5 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all"
                        >
                            <Plus size={16} />
                            <span>{t("reading.add_book", "Tambah Buku")}</span>
                        </button>
                    </div>
                </div>

                <YearlyTargetCards
                    yearlyStats={yearlyStats}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                />

                <YearlyBooksDrilldown
                    selectedYear={selectedYear}
                    books={selectedYearBooks}
                    viewMode={viewMode}
                    onClose={() => setSelectedYear(null)}
                    onBookClick={handleBookClick}
                />

                <ReadingKpiStrip
                    totalReadingBooks={totalReadingBooks}
                    totalUnreadBooks={totalUnreadBooks}
                    totalPagesRead={totalPagesRead}
                    totalPages={totalPages}
                    overallProgress={overallProgress}
                    remainingPages={remainingPages}
                />

                {readingBooks.length > 0 && (
                    <section className="mb-7 sm:mb-8">
                        <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-walnut dark:bg-gold shadow-xs" />
                                <h2 className="font-serif font-bold text-base sm:text-lg text-ink tracking-wide">
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
                            {readingBooks.map((book, index) => (
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

                <ReadingCollectionSection
                    totalReadingBooks={totalReadingBooks}
                    totalUnreadBooks={totalUnreadBooks}
                    displayedShelfBooks={displayedShelfBooks}
                    shelfGroups={shelfGroups}
                    shelfFilter={shelfFilter}
                    onShelfFilterChange={setShelfFilter}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    selectedBookId={selectedBookId}
                    isBookDetailOpen={isBookDetailOpen}
                    onBookClick={handleBookClick}
                    onAddBook={handleAddBook}
                />

                {totalReadingBooks === 0 && totalUnreadBooks === 0 && (
                    <ReadingEmptyState
                        onBrowseLibrary={() => navigate("/library")}
                        onAddBook={() =>
                            handleAddBook(
                                "reading-shelf",
                                t("reading.reading_shelf", "Sedang Dibaca"),
                            )
                        }
                    />
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
