import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@shared/components/ui/SEO";
import ReadingCalendarModal from "@shared/components/modals/ReadingCalendarModal";
import type { Book, BookStatus } from "@shared/types";
import { useBooks } from "../hooks/useBooks";
import { useShelves, useUpdateShelfLayout } from "../hooks/useShelves";
import { useBookstore } from "../store/useBookstore";
import Bookshelf from "../components/shelf/Bookshelf";
import MobileCoverGrid from "../components/shelf/MobileCoverGrid";
import AddBookModal from "../components/modals/AddBookModal";
import LibraryToolbar from "../components/shelf/LibraryToolbar";

export default function LibraryPage() {
    const { t } = useTranslation();
    const {
        selectedBookId,
        isBookDetailOpen,
        toggleBookDetail,
        setSelectedBookId,
    } = useBookstore();
    const { mutate: updateLayout } = useUpdateShelfLayout();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const bookId = searchParams.get("book_id") || searchParams.get("book");
        if (bookId) {
            setSelectedBookId(bookId);
            if (!useBookstore.getState().isBookDetailOpen) {
                toggleBookDetail(bookId);
            }
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete("book_id");
            nextParams.delete("book");
            setSearchParams(nextParams, { replace: true });
        }
    }, [searchParams, setSearchParams, setSelectedBookId, toggleBookDetail]);

    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"shelf" | "grid">("shelf");
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [selectedShelfId, setSelectedShelfId] = useState<string | undefined>();
    const [selectedShelfName, setSelectedShelfName] = useState<
        string | undefined
    >();
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const filterParams =
        activeFilter === "all" ? {} : { status: activeFilter as BookStatus };
    const { data: booksResponse, isLoading, error } = useBooks(filterParams);
    const { data: shelves = [], isLoading: shelvesLoading } = useShelves();

    if (isLoading || shelvesLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <SEO title={t("navigation.library", "Library")} />
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-walnut/30 border-t-walnut rounded-full animate-spin" />
                    <p className="text-sm text-walnut/60">
                        {t("library.loading")}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <SEO title={t("navigation.library", "Library")} />
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-lg font-serif text-darkBrown mb-1">
                    {t("library.error_title")}
                </h3>
                <p className="text-sm text-walnut/60">
                    {t("library.error_desc")}
                </p>
            </div>
        );
    }

    const books: Book[] = booksResponse?.data?.data || [];
    const counts = {
        all: books.length,
        reading: books.filter((b: Book) => b.status === "reading").length,
        finished: books.filter((b: Book) => b.status === "finished").length,
        unread: books.filter((b: Book) => b.status === "unread").length,
        borrowed: books.filter((b: Book) => b.status === "borrowed").length,
    };

    const handleAddBook = (shelfId: string, shelfName?: string) => {
        setSelectedShelfId(shelfId);
        setSelectedShelfName(shelfName);
        setIsAddBookModalOpen(true);
    };

    const handleBookClick = (book: Book) => {
        setSelectedBookId(book.id);
        toggleBookDetail(book.id);
    };

    return (
        <div
            className="px-3 md:px-5 pb-3 md:pb-5 pt-14 md:pt-16 flex flex-col min-h-full relative transition-colors duration-500"
            style={{
                background: "var(--app-wall-bg)",
            }}
        >
            <SEO
                title={t("navigation.library", "Library")}
                description={t(
                    "library.seo_description",
                    "Browse and manage your personal book library.",
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

            <LibraryToolbar
                viewMode={viewMode}
                isEditMode={isEditMode}
                activeFilter={activeFilter}
                isFilterExpanded={isFilterExpanded}
                counts={counts}
                onViewModeChange={setViewMode}
                onEditModeChange={setIsEditMode}
                onFilterToggle={() => setIsFilterExpanded((prev) => !prev)}
                onFilterSelect={setActiveFilter}
                onOpenCalendar={() => setIsCalendarModalOpen(true)}
            />

            {/* Main Library View: Bookshelf or Cover Grid */}
            <div
                className="relative z-0"
                style={{ flex: 1, opacity: isEditMode ? 0.95 : 1 }}
            >
                {viewMode === "shelf" ? (
                    <Bookshelf
                        books={books}
                        shelves={shelves}
                        isEditMode={isEditMode}
                        onSaveLayout={(layoutData) => {
                            updateLayout(layoutData);
                        }}
                        onAddBook={isEditMode ? undefined : handleAddBook}
                        filterStatus={
                            activeFilter === "all" ? undefined : activeFilter
                        }
                        selectedBookId={selectedBookId}
                        isDrawerOpen={isBookDetailOpen}
                        onBookClick={isEditMode ? undefined : handleBookClick}
                    />
                ) : (
                    <MobileCoverGrid
                        shelves={shelves}
                        books={books}
                        onBookClick={handleBookClick}
                        onAddBook={handleAddBook}
                        filterStatus={
                            activeFilter === "all" ? undefined : activeFilter
                        }
                    />
                )}
            </div>

            {books.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-5xl mb-3">📚</div>
                    <h3 className="text-lg font-serif text-darkBrown mb-1">
                        {activeFilter === "all"
                            ? t("library.empty.all_title")
                            : t("library.empty.filter_title")}
                    </h3>
                    <p className="text-sm text-walnut/50">
                        {activeFilter === "all"
                            ? t("library.empty.all_desc")
                            : t("library.empty.filter_desc", {
                                  status: t(`library.filters.${activeFilter}`),
                              })}
                    </p>
                </div>
            )}

            <AddBookModal
                isOpen={isAddBookModalOpen}
                onClose={() => setIsAddBookModalOpen(false)}
                shelfId={selectedShelfId}
                shelfName={selectedShelfName}
            />

            <ReadingCalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                books={books}
            />
        </div>
    );
}
