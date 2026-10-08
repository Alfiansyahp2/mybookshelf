import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "../../types";
import BookmarkHeart from "../icons/BookmarkHeart";

interface WishlistCardProps {
    book: Book;
    index: number;
    onClick: (book: Book) => void;
    onStartReading?: (bookId: string, e: React.MouseEvent) => void;
    viewMode?: "list" | "grid";
    t?: any;
}

export default function WishlistCard({
    book,
    index,
    onClick,
    onStartReading,
    viewMode = "list",
    t: customT,
}: WishlistCardProps) {
    const { t: hookT } = useTranslation();
    const t = customT || hookT;
    const c0 = book.spineColors?.[0] || "#8B7355";
    const c1 = book.spineColors?.[1] || "#6B5344";
    const c2 = book.spineColors?.[2] || "#5C4532";

    // GRID VIEW: Realistic vertical book cover with caption
    if (viewMode === "grid") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => onClick(book)}
                className="group cursor-pointer flex flex-col"
            >
                <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all relative border border-black/15 dark:border-white/10 flex flex-col justify-between p-2">
                    {book.coverImage ? (
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            className="absolute inset-0 w-full h-full object-cover z-0"
                        />
                    ) : (
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                background: `linear-gradient(145deg, ${c0} 0%, ${c1} 60%, ${c2} 100%)`,
                            }}
                        />
                    )}

                    {/* Spine Crease & Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20 pointer-events-none z-10" />
                    <div className="absolute left-1 top-0 bottom-0 w-0.5 sm:w-1 bg-white/20 blur-[0.5px] pointer-events-none z-10" />

                    {/* Ribbon Tag */}
                    <div className="relative z-20 flex justify-end">
                        <span className="w-3.5 h-4.5 bg-gradient-to-b from-pink-500 to-rose-600 rounded-b-xs shadow-xs flex items-center justify-center">
                            <BookmarkHeart className="w-2 h-2 text-white fill-white" />
                        </span>
                    </div>

                    {/* Title & Author if no cover image */}
                    {!book.coverImage && (
                        <div className="relative z-20 my-auto text-center px-1">
                            <p className="font-serif font-bold text-xs sm:text-sm text-amber-100 leading-tight line-clamp-3 drop-shadow-md">
                                {book.title}
                            </p>
                            <p className="text-[10px] text-amber-200/80 mt-1 truncate font-medium">
                                {book.author}
                            </p>
                        </div>
                    )}

                    {/* Bottom bar */}
                    <div className="relative z-20 mt-auto flex justify-between items-center text-[9px] text-white/90 bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                        <span className="truncate capitalize">{book.format || "Buku"}</span>
                        {book.pages ? <span>{book.pages}p</span> : null}
                    </div>
                </div>

                {/* Caption */}
                <div className="mt-1.5 px-0.5">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-darkBrown dark:text-[#f8fafc] line-clamp-1 leading-snug group-hover:text-indigo-600 dark:group-hover:text-[#ffd166] transition-colors">
                        {book.title}
                    </h4>
                    <p className="text-[11px] text-walnut/70 dark:text-[#94a3b8] truncate">
                        {book.author}
                    </p>
                </div>
            </motion.div>
        );
    }

    // LIST VIEW: Warm parchment catalog card with vertical book cover and actions
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onClick(book)}
            className="group bg-white/90 dark:bg-[#131b2e]/95 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-indigo-500/20 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-row gap-3 sm:gap-4 backdrop-blur-sm relative overflow-hidden"
        >
            {/* Left: Realistic 2:3 Book Cover */}
            <div className="w-20 xs:w-24 sm:w-28 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md relative border border-black/15 dark:border-white/10 transition-shadow">
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className="w-full h-full flex flex-col justify-between p-2 relative"
                        style={{
                            background: `linear-gradient(145deg, ${c0} 0%, ${c1} 60%, ${c2} 100%)`,
                        }}
                    >
                        {/* Spine crease & reflection */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20 pointer-events-none" />
                        <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-white/20 blur-[0.5px] pointer-events-none" />

                        <div className="my-auto text-center relative z-10 px-0.5">
                            <p className="font-serif font-bold text-[10px] xs:text-[11px] text-amber-100 leading-tight line-clamp-3 drop-shadow-sm">
                                {book.title}
                            </p>
                            <p className="text-[8.5px] text-amber-200/80 mt-1 truncate font-medium">
                                {book.author}
                            </p>
                        </div>
                    </div>
                )}

                {/* Bookmark Ribbon on Cover */}
                <div className="absolute top-0 right-2 w-3.5 h-4.5 bg-gradient-to-b from-pink-500 to-rose-600 rounded-b-xs shadow-xs flex items-center justify-center z-20">
                    <BookmarkHeart className="w-2 h-2 text-white fill-white" />
                </div>
            </div>

            {/* Right: Book Details & Actions */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    {/* Title & Author */}
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-darkBrown dark:text-[#f8fafc] line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-[#ffd166] transition-colors">
                            {book.title}
                        </h3>
                    </div>
                    <p className="text-xs text-walnut/75 dark:text-[#94a3b8] truncate font-medium">
                        {book.author}
                    </p>

                    {/* Genre Tags */}
                    {book.genre && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {book.genre
                                .split(",")
                                .slice(0, 2)
                                .map((g: string, i: number) => (
                                    <span
                                        key={i}
                                        className="font-medium text-[10px] text-indigo-700 dark:text-[#ffd166] bg-indigo-500/10 dark:bg-indigo-500/20 px-2 py-0.5 rounded-md truncate max-w-[130px]"
                                    >
                                        {g.trim()}
                                    </span>
                                ))}
                        </div>
                    )}
                </div>

                {/* Metadata & Actions */}
                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-indigo-500/20 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-walnut/70 dark:text-[#94a3b8]">
                        {book.pages ? (
                            <span className="flex items-center gap-1 font-medium">
                                <BookOpen size={12} className="text-indigo-600 dark:text-[#ffd166]" />
                                <span>{book.pages} hal</span>
                            </span>
                        ) : null}
                        {book.format ? (
                            <span className="capitalize px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-medium truncate max-w-[80px]">
                                {book.format}
                            </span>
                        ) : null}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {onStartReading && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStartReading(book.id, e);
                                }}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1"
                                title={t("wishlist.start_reading", "Mulai Baca")}
                            >
                                <span>{t("wishlist.read_now", "Baca")}</span>
                            </button>
                        )}
                        <div className="px-2 py-1 bg-white/70 dark:bg-black/30 hover:bg-white text-darkBrown dark:text-[#f8fafc] rounded-lg text-xs font-medium border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1">
                            <span>{t("wishlist.details", "Detail")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
