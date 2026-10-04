import { useBooks } from "../hooks/useBooks";
import { useShelves } from "../hooks/useShelves";
import { useStartReading } from "../hooks/useBooks";
import { useNavigate } from "react-router-dom";
import { useBookstore } from "../store/useBookstore";
import AddWishlistBookModal from "../components/modals/AddWishlistBookModal";
import WishlistCard from "../components/assets/WishlistCard";
import { useState } from "react";
import type { Book } from "../types";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    Plus,
    List,
    LayoutGrid,
} from "lucide-react";
import BookmarkHeart from "../components/icons/BookmarkHeart";
import SEO from "../components/SEO";

export default function Wishlist() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        toggleBookDetail,
        setSelectedBookId,
    } = useBookstore();
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [, setAddShelfId] = useState<string | undefined>();
    const [, setAddShelfName] = useState<string | undefined>();

    // Fetch all books and shelves from API
    const { data: allBooksResponse, isLoading } = useBooks({});
    const { isLoading: shelvesLoading } = useShelves();
    const startReadingMutation = useStartReading();

    const allBooks = allBooksResponse?.data?.data || [];
    const wishlistBooks = allBooks.filter(
        (book: Book) => book.status === "wishlist",
    );

    // Calculate wishlist statistics
    const totalWishlist = wishlistBooks.length;

    const genresCount = wishlistBooks.reduce((acc: any, book: Book) => {
        if (book.genre) {
            book.genre
                .split(",")
                .map((g: string) => g.trim())
                .forEach((g: string) => {
                    if (g) acc[g] = (acc[g] || 0) + 1;
                });
        }
        return acc;
    }, {});
    const topGenre =
        Object.keys(genresCount).sort(
            (a, b) => genresCount[b] - genresCount[a],
        )[0] || "-";

    const authorsCount = wishlistBooks.reduce((acc: any, book: Book) => {
        if (book.author) {
            acc[book.author] = (acc[book.author] || 0) + 1;
        }
        return acc;
    }, {});
    const topAuthor =
        Object.keys(authorsCount).sort(
            (a, b) => authorsCount[b] - authorsCount[a],
        )[0] || "-";

    const handleStartReading = (bookId: string) => {
        startReadingMutation.mutate(bookId);
    };

    const handleBookClick = (book: any) => {
        setSelectedBookId(book.id);
        toggleBookDetail(book.id);
    };

    // Loading state
    if (isLoading || shelvesLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <SEO title={t("navigation.wishlist", "Wishlist")} />
                <div className="text-walnut">
                    {t("wishlist.loading", "Loading wishlist...")}
                </div>
            </div>
        );
    }

    return (
        <div
            className="px-3.5 sm:px-6 md:px-8 pb-16 md:pb-20 pt-[84px] sm:pt-[92px] md:pt-[104px] flex flex-col min-h-full relative"
            style={{
                background:
                    "linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)",
            }}
        >
            <SEO
                title={t("navigation.wishlist", "Wishlist")}
                description={t(
                    "wishlist.seo_description",
                    "Manage your book wishlist and track what you want to read next.",
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
                {/* Header Container */}
                <div className="mb-6 sm:mb-8 flex flex-col gap-3.5 sm:gap-4">
                    {/* Top Row: Badge & Header Actions */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-walnut/10 dark:bg-[#d4a574]/15 border border-walnut/10 dark:border-[#d4a574]/20 text-xs font-semibold text-walnut dark:text-[#d4a574] uppercase tracking-wider">
                            <BookmarkHeart className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 fill-pink-600/30" />
                            <span>{t("wishlist.badge", "Daftar Keinginan")}</span>
                        </div>

                        {/* Right: View Switcher & Add Button */}
                        <div className="flex items-center gap-2">
                            {totalWishlist > 0 && (
                                <div className="flex items-center bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 p-1 rounded-xl shadow-xs">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                            viewMode === "list"
                                                ? "bg-white dark:bg-[#322015] text-darkBrown dark:text-cream shadow-xs"
                                                : "text-walnut/70 hover:text-darkBrown dark:text-stone-300"
                                        }`}
                                        title={t("wishlist.view_list", "Daftar")}
                                    >
                                        <List size={14} />
                                        <span className="hidden xs:inline">
                                            {t("wishlist.view_list", "Daftar")}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                            viewMode === "grid"
                                                ? "bg-white dark:bg-[#322015] text-darkBrown dark:text-cream shadow-xs"
                                                : "text-walnut/70 hover:text-darkBrown dark:text-stone-300"
                                        }`}
                                        title={t("wishlist.view_grid", "Grid")}
                                    >
                                        <LayoutGrid size={14} />
                                        <span className="hidden xs:inline">
                                            {t("wishlist.view_grid", "Grid")}
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Add to Wishlist Button */}
                            <motion.button
                                onClick={() => setIsAddBookModalOpen(true)}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#7a5c42] hover:bg-[#5c3e28] text-white rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all text-xs sm:text-sm font-medium shrink-0"
                                title={t("wishlist.add_to_wishlist", "Tambah Buku")}
                                whileTap={{ scale: 0.96 }}
                            >
                                <Plus className="w-4 h-4" />
                                <span>{t("wishlist.add_book", "Tambah")}</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Main Title & Subtitle */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-darkBrown dark:text-[#f5ece3] tracking-tight">
                                {t("wishlist.title", "Wishlist")}
                            </h1>
                            {totalWishlist > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-[#7a5c42]/15 dark:bg-[#d4a574]/20 text-[#5c3e28] dark:text-[#d4a574] font-serif font-bold text-xs sm:text-sm">
                                    {totalWishlist}
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-walnut/70 dark:text-[#c9ab91]">
                            {t(
                                "wishlist.subtitle",
                                "Buku impian yang ingin kamu koleksi dan baca selanjutnya",
                            )}
                        </p>
                    </div>
                </div>

                {/* Quick Insight Stats Bar */}
                {totalWishlist > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 grid grid-cols-3 divide-x divide-[#7a5c42]/10 dark:divide-[#d4a574]/15 bg-[#fdfbf7]/80 dark:bg-[#20140e]/90 rounded-2xl p-3 border border-[#7a5c42]/15 dark:border-[#d4a574]/20 shadow-xs backdrop-blur-xs text-center"
                    >
                        <div className="px-1">
                            <div className="text-base sm:text-lg font-serif font-bold text-darkBrown dark:text-[#f5ece3]">
                                {totalWishlist}
                            </div>
                            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-walnut/70 dark:text-[#c9ab91] font-medium truncate">
                                {t("wishlist.total_wished", "Total Ingin")}
                            </div>
                        </div>
                        <div className="px-1">
                            <div className="text-base sm:text-lg font-serif font-bold text-darkBrown dark:text-[#f5ece3] truncate">
                                {topGenre}
                            </div>
                            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-walnut/70 dark:text-[#c9ab91] font-medium truncate">
                                {t("wishlist.top_genre", "Genre Favorit")}
                            </div>
                        </div>
                        <div className="px-1">
                            <div className="text-base sm:text-lg font-serif font-bold text-darkBrown dark:text-[#f5ece3] truncate">
                                {topAuthor}
                            </div>
                            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-walnut/70 dark:text-[#c9ab91] font-medium truncate">
                                {t("wishlist.top_author", "Penulis Populer")}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Wishlist Books Grid / List */}
                {totalWishlist > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-8"
                    >
                        <div
                            className={
                                viewMode === "list"
                                    ? "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
                                    : "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4"
                            }
                        >
                            {wishlistBooks.map((book: Book, index: number) => {
                                return (
                                    <WishlistCard
                                        key={book.id}
                                        book={book}
                                        index={index}
                                        onClick={handleBookClick}
                                        onStartReading={handleStartReading}
                                        viewMode={viewMode}
                                        t={t}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {totalWishlist === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-[#fdfbf7]/80 dark:bg-[#20140e]/90 rounded-2xl border border-[#7a5c42]/15 dark:border-[#d4a574]/20 p-8 backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#7a5c42]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookmarkHeart className="w-8 h-8 sm:w-10 sm:h-10 text-[#7a5c42]/40 fill-pink-500/20" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-darkBrown dark:text-[#f5ece3] mb-2">
                            {t("wishlist.empty", "Wishlist masih kosong")}
                        </h3>
                        <p className="text-sm text-walnut/70 dark:text-[#c9ab91] mb-6 max-w-sm mx-auto">
                            {t(
                                "wishlist.empty_desc",
                                "Simpan buku yang ingin kamu beli atau baca nanti",
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
                            <button
                                onClick={() => navigate("/library")}
                                className="px-5 py-2.5 bg-[#7a5c42] hover:bg-[#5c3e28] text-white rounded-xl font-medium transition-colors text-sm shadow-xs"
                            >
                                {t("wishlist.browse_library", "Jelajahi Library")}
                            </button>
                            <button
                                onClick={() => setIsAddBookModalOpen(true)}
                                className="px-5 py-2.5 bg-white/70 dark:bg-black/30 text-darkBrown dark:text-[#f5ece3] rounded-xl font-medium hover:bg-white transition-colors border border-[#7a5c42]/20 text-sm"
                            >
                                {t(
                                    "wishlist.add_to_wishlist",
                                    "Tambah ke Wishlist",
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                <AddWishlistBookModal
                    isOpen={isAddBookModalOpen}
                    onClose={() => {
                        setIsAddBookModalOpen(false);
                        setAddShelfId(undefined);
                        setAddShelfName(undefined);
                    }}
                />
            </div>
        </div>
    );
}
