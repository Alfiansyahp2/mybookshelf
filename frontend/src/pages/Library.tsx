import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBooks } from "../hooks/useBooks";
import { useShelves } from "../hooks/useShelves";
import { useBookstore } from "../store/useBookstore";
import type { Book } from "../types";
import Bookshelf from "../components/shelf/Bookshelf";
import MobileCoverGrid from "../components/shelf/MobileCoverGrid";
import AddBookModal from "../components/modals/AddBookModal";
import { LayoutGrid, Save, Filter, X, BookOpen, Layers } from "lucide-react";
import { useUpdateShelfLayout } from "../hooks/useShelves";
import ReadingCalendarModal from "../components/modals/ReadingCalendarModal";
import LightingControl from "../components/shelf/LightingControl";
import BigDigitalClock from "../components/ui/BigDigitalClock";
import FlipCalendar from "../components/ui/FlipCalendar";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";

const FILTER_TABS = [
    { key: "all", labelKey: "library.filters.all" },
    { key: "reading", labelKey: "library.filters.reading" },
    { key: "finished", labelKey: "library.filters.finished" },
    { key: "unread", labelKey: "library.filters.unread" },
    { key: "borrowed", labelKey: "library.filters.borrowed" },
];

export default function Library() {
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
        const bookId = searchParams.get("book_id");
        if (bookId) {
            setSelectedBookId(bookId);
            if (!useBookstore.getState().isBookDetailOpen) {
                toggleBookDetail(bookId);
            }
            // Clear the param after handling to avoid re-opening on reload
            searchParams.delete("book_id");
            setSearchParams(searchParams);
        }
    }, [searchParams]);

    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"shelf" | "grid">("shelf");
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [selectedShelfId, setSelectedShelfId] = useState<
        string | undefined
    >();
    const [selectedShelfName, setSelectedShelfName] = useState<
        string | undefined
    >();
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const filterParams =
        activeFilter === "all" ? {} : { status: activeFilter as any };
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

    const handleBookClick = (book: any) => {
        setSelectedBookId(book.id);
        toggleBookDetail(book.id);
    };

    return (
        <div
            className="px-3 md:px-5 pb-3 md:pb-5 pt-14 md:pt-16 flex flex-col min-h-full relative"
            style={{
                background:
                    "linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)",
            }}
        >
            <SEO title={t("navigation.library", "Library")} description={t("library.seo_description", "Browse and manage your personal book library.")} />
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

            {/* Filter tabs + Widgets on top of shelf */}
            <div className="relative z-50 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-0 pt-0 px-1 md:px-0">
                {/* Left Side (Filters, View Switcher & Layout) */}
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto hide-scrollbar mb-1 md:mb-1.5">
                    {/* View Mode Switcher (Shelf vs Grid) */}
                    <div className="flex items-center bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 p-1 rounded-2xl shadow-xs shrink-0">
                        <button
                            onClick={() => setViewMode("shelf")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                                viewMode === "shelf"
                                    ? "bg-white text-darkBrown shadow-sm"
                                    : "text-walnut/70 hover:text-darkBrown"
                            }`}
                            title={t("library.view_shelf", "Tampilan Rak")}
                        >
                            <BookOpen size={16} />
                            <span className="hidden xs:inline">{t("library.view_shelf_short", "Rak")}</span>
                        </button>
                        <button
                            onClick={() => {
                                setViewMode("grid");
                                setIsEditMode(false);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                                viewMode === "grid"
                                    ? "bg-white text-darkBrown shadow-sm"
                                    : "text-walnut/70 hover:text-darkBrown"
                            }`}
                            title={t("library.view_grid", "Tampilan Grid Sampul")}
                        >
                            <LayoutGrid size={16} />
                            <span className="hidden xs:inline">{t("library.view_grid_short", "Grid")}</span>
                        </button>
                    </div>

                    {/* Edit Layout Button (Only available in Shelf view) */}
                    {viewMode === "shelf" && (
                        <div className="flex gap-2 shrink-0">
                            {isEditMode ? (
                                <button
                                    onClick={() => setIsEditMode(false)}
                                    className="h-9 md:h-12 px-3 md:px-5 rounded-xl bg-green-600/90 text-white backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:bg-green-500 shadow-xl transition-all"
                                >
                                    <Save size={16} />
                                    <span className="text-xs md:text-sm font-bold">
                                        {t("library.done")}
                                    </span>
                                </button>
                            ) : (
                                <motion.button
                                    onClick={() => setIsEditMode(true)}
                                    className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-white/40 backdrop-blur-md border border-white/40 shadow-sm md:shadow-lg flex items-center justify-center text-[#5a3410] transition-all hover:bg-white/60"
                                    title={t("library.edit_layout")}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Layers size={18} />
                                </motion.button>
                            )}
                        </div>
                    )}

                    {/* Filter Tabs (Animated Expandable Sliding Pill) */}
                    <motion.div 
                        layout
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center bg-white/30 backdrop-blur-md border border-white/50 p-1 md:p-1.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] shrink-0"
                    >
                        {/* Toggle Button */}
                        <motion.button
                            layout
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            className={`flex items-center justify-center h-8 md:h-10 px-2.5 md:px-3.5 rounded-xl shrink-0 ${
                                isFilterExpanded 
                                    ? "bg-white/40 text-darkBrown hover:bg-white/60" 
                                    : "bg-white text-darkBrown shadow-xs hover:bg-white/90"
                            }`}
                        >
                            <div className="w-4 h-4 relative flex items-center justify-center shrink-0">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={isFilterExpanded ? "close" : "open"}
                                        initial={{ rotate: isFilterExpanded ? -90 : 90, opacity: 0, scale: 0.7 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: isFilterExpanded ? 90 : -90, opacity: 0, scale: 0.7 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        {isFilterExpanded ? <X size={16} /> : <Filter size={16} />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <AnimatePresence initial={false}>
                                {!isFilterExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, width: 0, x: -6 }}
                                        animate={{ opacity: 1, width: "auto", x: 0 }}
                                        exit={{ opacity: 0, width: 0, x: -6 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="ml-1.5 md:ml-2 flex items-center gap-1.5 overflow-hidden whitespace-nowrap"
                                    >
                                        <span className="text-xs md:text-sm font-bold">
                                            {t(FILTER_TABS.find(t => t.key === activeFilter)?.labelKey as any)}
                                        </span>
                                        <span className="text-[10px] md:text-[11px] px-1.5 bg-walnut/10 text-darkBrown font-bold rounded-full">
                                            {counts[activeFilter as keyof typeof counts]}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Expandable Tabs */}
                        <AnimatePresence initial={false}>
                            {isFilterExpanded && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -10, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="flex items-center pl-1.5 md:pl-2 gap-1 w-max"
                                    >
                                        {FILTER_TABS.filter(
                                            (t) =>
                                                t.key === "all" ||
                                                counts[t.key as keyof typeof counts] > 0,
                                        ).map((tab) => {
                                            const count = counts[tab.key as keyof typeof counts];
                                            const active = activeFilter === tab.key;
                                            return (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => setActiveFilter(tab.key)}
                                                    className={`relative flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap z-10 select-none ${
                                                        active
                                                            ? "text-darkBrown"
                                                            : "text-walnut/70 hover:text-darkBrown hover:bg-white/30"
                                                    }`}
                                                    style={{ transition: "color 0.2s ease, background-color 0.2s ease" }}
                                                >
                                                    {active && (
                                                        <motion.div
                                                            layoutId="activeFilterTab"
                                                            className="absolute inset-0 bg-white rounded-xl shadow-xs z-[-1]"
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 450,
                                                                damping: 32,
                                                            }}
                                                        />
                                                    )}
                                                    <span className="relative z-10">{t(tab.labelKey as any)}</span>
                                                    <span
                                                        className={`relative z-10 text-[10px] md:text-[11px] px-1.5 md:px-2 py-0.5 rounded-full transition-colors duration-200 ${
                                                            active
                                                                ? "bg-walnut/10 text-darkBrown font-bold"
                                                                : "bg-walnut/10 text-walnut/60 font-medium"
                                                        }`}
                                                    >
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Widgets sitting on top of bookshelf rail / shelf card */}
                <div className="flex flex-shrink-0 items-end justify-center sm:justify-end gap-2 sm:gap-4 md:gap-5 relative z-10 w-full md:w-auto scale-80 xs:scale-85 sm:scale-95 md:scale-100 origin-bottom sm:origin-bottom-right mb-[-2px]">
                    <FlipCalendar
                        onClick={() => setIsCalendarModalOpen(true)}
                    />
                    <div className="pb-1">
                        <BigDigitalClock />
                    </div>
                    <div className="pb-0.5">
                        <LightingControl />
                    </div>
                </div>
            </div>

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

            {/* Empty state */}
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
