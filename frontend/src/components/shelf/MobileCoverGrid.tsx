import React from "react";
import { motion } from "framer-motion";
import { Star, Plus, BookOpen, Clock, CheckCircle2, Bookmark, ArrowUpRight } from "lucide-react";
import type { Book, Shelf as ShelfType } from "../../types";
import { useTranslation } from "react-i18next";

interface MobileCoverGridProps {
    shelves: ShelfType[];
    books: Book[];
    onBookClick: (book: Book) => void;
    onAddBook?: (shelfId: string, shelfName?: string) => void;
    filterStatus?: string;
}

const STATUS_BADGES: Record<
    string,
    { label: string; bg: string; text: string; icon: any }
> = {
    reading: {
        label: "Sedang Dibaca",
        bg: "bg-emerald-500/90 text-white",
        text: "text-emerald-700 dark:text-emerald-400",
        icon: Clock,
    },
    finished: {
        label: "Selesai",
        bg: "bg-blue-600/90 text-white",
        text: "text-blue-700 dark:text-blue-400",
        icon: CheckCircle2,
    },
    unread: {
        label: "Belum Dibaca",
        bg: "bg-stone-500/90 text-white",
        text: "text-stone-700 dark:text-stone-400",
        icon: Bookmark,
    },
    borrowed: {
        label: "Dipinjam",
        bg: "bg-amber-600/90 text-white",
        text: "text-amber-700 dark:text-amber-400",
        icon: ArrowUpRight,
    },
};

export default function MobileCoverGrid({
    shelves,
    books,
    onBookClick,
    onAddBook,
    filterStatus,
}: MobileCoverGridProps) {
    const { t } = useTranslation();

    const filteredBooks = filterStatus
        ? books.filter((b) => b.status === filterStatus)
        : books;

    // Distribute books by shelf
    const shelfMap = new Map<string, Book[]>();
    shelves.forEach((s) => shelfMap.set(s.id, []));
    filteredBooks.forEach((book) => {
        if (book.shelfId && shelfMap.has(book.shelfId)) {
            shelfMap.get(book.shelfId)!.push(book);
        }
    });

    const activeShelves = shelves.filter(
        (s) => (shelfMap.get(s.id) || []).length > 0 || !filterStatus,
    );

    if (filteredBooks.length === 0) {
        return null;
    }

    return (
        <div className="w-full space-y-6 pb-20">
            {activeShelves.map((shelf) => {
                const shelfBooks = shelfMap.get(shelf.id) || [];
                if (filterStatus && shelfBooks.length === 0) return null;

                const maxCapacity = shelf.capacity || 20;

                return (
                    <div
                        key={shelf.id}
                        className="rounded-2xl bg-[#fdfbf7]/80 dark:bg-[#20140e]/90 border border-[#7a5c42]/20 dark:border-[#d4a574]/25 shadow-lg overflow-hidden backdrop-blur-sm"
                    >
                        {/* Wooden top rail of shelf */}
                        <div
                            className="h-4 sm:h-5 w-full relative overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(180deg, #c09060 0%, #9a7040 40%, #7a5428 70%, #624018 100%)",
                                boxShadow:
                                    "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.25)",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 2,
                                    background: "rgba(255,255,255,0.2)",
                                }}
                            />
                        </div>

                        {/* Shelf Content */}
                        <div className="p-3 sm:p-5 pt-3 sm:pt-4">
                            {/* Shelf Header Banner */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#7a5c42]/15 dark:border-[#d4a574]/20">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#d4a574] shadow-xs" />
                                <h2 className="font-serif font-bold text-base sm:text-lg text-[#4a3b2f] dark:text-[#f5ece3] tracking-wide uppercase">
                                    {shelf.name}
                                </h2>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#7a5c42]/10 dark:bg-[#d4a574]/15 text-[#7a5c42] dark:text-[#e5b882] font-semibold">
                                    {shelfBooks.length} / {maxCapacity}
                                </span>
                            </div>

                            {onAddBook && (
                                <button
                                    onClick={() => onAddBook(shelf.id, shelf.name)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#7a5c42]/10 hover:bg-[#7a5c42]/20 dark:bg-[#d4a574]/15 dark:hover:bg-[#d4a574]/25 text-[#4a3b2f] dark:text-[#f5ece3] text-xs font-bold transition-colors"
                                >
                                    <Plus size={14} />
                                    <span>{t("shelf.add_book", "Tambah")}</span>
                                </button>
                            )}
                        </div>

                        {/* Book Cover Cards Grid */}
                        {shelfBooks.length === 0 ? (
                            <div className="py-8 text-center text-xs text-walnut/60 dark:text-stone-400">
                                {t("library.empty_shelf", "Belum ada buku di rak ini.")}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-2.5 sm:gap-3 md:gap-3.5">
                                {shelfBooks.map((book) => {
                                    const badge =
                                        STATUS_BADGES[book.status] ||
                                        STATUS_BADGES["unread"];
                                    const StatusIcon = badge.icon;
                                    const c0 = book.spineColors?.[0] || "#8B7355";
                                    const c1 = book.spineColors?.[1] || "#6B5344";
                                    const c2 = book.spineColors?.[2] || "#5C4532";
                                    const progressPct = book.pages
                                        ? Math.round(
                                              ((book.currentPage || 0) /
                                                  book.pages) *
                                                  100,
                                          )
                                        : 0;

                                    return (
                                        <motion.div
                                            key={book.id}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => onBookClick(book)}
                                            className="group cursor-pointer flex flex-col"
                                        >
                                            {/* Book Cover Card */}
                                            <div
                                                className="w-full aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden shadow-sm relative flex flex-col justify-between p-2 sm:p-2.5 border border-black/15 dark:border-white/10 transition-shadow duration-300 group-hover:shadow-lg"
                                                style={{
                                                    background: book.coverImage
                                                        ? undefined
                                                        : `linear-gradient(145deg, ${c0} 0%, ${c1} 60%, ${c2} 100%)`,
                                                }}
                                            >
                                                {/* Cover Image Background if present */}
                                                {book.coverImage && (
                                                    <img
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                                    />
                                                )}

                                                {/* Spine Crease & Shimmer Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20 pointer-events-none z-10" />
                                                <div className="absolute left-1 top-0 bottom-0 w-0.5 sm:w-1 bg-white/20 blur-[0.5px] pointer-events-none z-10" />

                                                {/* Status Pill Badge (Top Left) */}
                                                <div className="relative z-20 flex justify-between items-start gap-1">
                                                    <span
                                                        className={`text-[8.5px] sm:text-[9.5px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 ${badge.bg} backdrop-blur-xs`}
                                                    >
                                                        <StatusIcon size={9} />
                                                        <span className="hidden md:inline truncate max-w-[55px]">
                                                            {badge.label}
                                                        </span>
                                                    </span>

                                                    {book.personalRating ? (
                                                        <div className="bg-black/60 backdrop-blur-xs px-1 sm:px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-amber-300 text-[8.5px] sm:text-[9.5px] font-bold shadow-xs shrink-0">
                                                            <Star
                                                                size={9}
                                                                className="fill-amber-400 text-amber-400"
                                                            />
                                                            <span>{book.personalRating}</span>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {/* Cover Title Preview (If No Cover Image) */}
                                                {!book.coverImage && (
                                                    <div className="relative z-20 my-auto text-center px-1">
                                                        <p className="font-serif font-bold text-[11px] sm:text-xs text-amber-100 leading-tight line-clamp-3 drop-shadow-md">
                                                            {book.title}
                                                        </p>
                                                        <p className="text-[9px] text-amber-200/80 mt-0.5 truncate font-medium">
                                                            {book.author}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Progress Bar (Bottom of Cover) */}
                                                {book.status === "reading" && (
                                                    <div className="relative z-20 w-full bg-black/50 backdrop-blur-xs p-1 rounded-md mt-auto">
                                                        <div className="flex justify-between text-[8px] sm:text-[8.5px] text-white/90 font-mono mb-0.5">
                                                            <span>Progres</span>
                                                            <span>{progressPct}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-400 rounded-full"
                                                                style={{
                                                                    width: `${Math.min(100, Math.max(0, progressPct))}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Book Metadata Under Cover */}
                                            <div className="pt-1.5 px-0.5 flex-1 flex flex-col justify-between">
                                                <h3 className="font-serif font-bold text-[11px] sm:text-xs text-[#4a3b2f] dark:text-[#f5ece3] line-clamp-1 leading-snug group-hover:text-[#7a5c42] dark:group-hover:text-[#e5b882] transition-colors" title={book.title}>
                                                    {book.title}
                                                </h3>
                                                <p className="text-[10px] text-[#7a5c42]/80 dark:text-[#c9ab91] truncate mt-0.5" title={book.author}>
                                                    {book.author}
                                                </p>
                                                {book.pages && (
                                                    <span className="text-[9px] sm:text-[9.5px] text-walnut/60 dark:text-stone-400 font-mono mt-0.5">
                                                        {book.currentPage ? `${book.currentPage} / ` : ""}
                                                        {book.pages} hal
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
