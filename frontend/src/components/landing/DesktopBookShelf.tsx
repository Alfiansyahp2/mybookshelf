import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { animate, stagger } from "animejs";
import { useTranslation } from "react-i18next";
import type { EditorialBook } from "../../constants/editorialBooks";

interface DesktopBookShelfProps {
    books: EditorialBook[];
    statusFilter: string;
    langFilter: string;
    hoveredBookId: string | null;
    setHoveredBookId: (id: string | null) => void;
    onSelectBook: (id: string) => void;
    imgErrors: Record<string, boolean>;
    setImgErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function DesktopBookShelf({
    books,
    statusFilter,
    langFilter,
    hoveredBookId,
    setHoveredBookId,
    onSelectBook,
    imgErrors,
    setImgErrors
}: DesktopBookShelfProps) {
    const { t } = useTranslation();
    useEffect(() => {
        const anim = animate(".demo-spine-item", {
            translateX: [-180, 0],
            opacity: [0, 1],
            delay: stagger(65, { start: 100 }),
            duration: 900,
            ease: "outCubic"
        });

        return () => {
            anim.pause();
        };
    }, [statusFilter, langFilter]);

    return (
        <div className="hidden md:flex relative pt-6 pb-5 px-4 flex-wrap items-end justify-center gap-3.5 min-h-[365px] max-h-[400px]">
            {books.map((book) => {
                const isStatusMatch = statusFilter === "All" || book.status === statusFilter;
                const isLangMatch = langFilter === "Semua" || book.language === langFilter;
                const isMatch = isStatusMatch && isLangMatch;
                const isHovered = hoveredBookId === book.id;

                return (
                    <div
                        key={book.id}
                        className={`relative demo-spine-item opacity-0 transition-all ${isHovered ? "z-[9999]" : "z-1"}`}
                        onMouseEnter={() => setHoveredBookId(book.id)}
                        onMouseLeave={() => setHoveredBookId(null)}
                    >
                        <motion.div
                            style={{
                                height: `${book.heightPx}px`,
                                transformOrigin: "bottom center"
                            }}
                            animate={{
                                rotate: isHovered ? 0 : (book.tiltDegree || 0)
                            }}
                            whileHover={{ y: -16, scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onSelectBook(book.id)}
                            className={`cursor-pointer group relative w-12 ${book.spineBg} ${book.textColor} rounded-xs shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.55)] transition-all duration-300 flex flex-col justify-between p-2 select-none border border-black/10 dark:border-black/40 border-t-white/30 dark:border-t-white/10 overflow-hidden ${
                                isMatch
                                    ? "opacity-100 hover:shadow-[#7a5c42]/30 hover:ring-2 hover:ring-[#4a3b2f] dark:hover:ring-[#d4a574]/60"
                                    : "opacity-25 grayscale-[60%] blur-[0.4px] scale-95 pointer-events-none"
                            }`}
                        >
                            {/* Realistic 3D Spine Cylindrical Shading & Hinge Crease */}
                            <div className="absolute inset-0 pointer-events-none rounded-xs bg-gradient-to-r from-black/20 via-transparent to-black/25 dark:from-black/35 dark:via-white/[0.04] dark:to-black/35" />

                            {/* Top Spine Accent Star */}
                            <div className="w-full flex justify-center shrink-0 pt-0.5 relative z-1">
                                <span className="text-[9px] text-[#d4a574]">★</span>
                            </div>

                            {/* Vertical Title Text */}
                            <div className="my-auto py-1 px-0.5 text-center flex items-center justify-center overflow-hidden flex-1 relative z-1">
                                <span
                                    className="font-serif font-bold text-xs tracking-wider uppercase leading-none overflow-hidden max-h-full"
                                    style={{
                                        writingMode: "vertical-rl",
                                        transform: "rotate(180deg)",
                                        maxHeight: `${book.heightPx - 70}px`,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical"
                                    }}
                                >
                                    {book.shortTitle || book.title}
                                </span>
                            </div>

                            {/* Bottom Spine Author */}
                            <div className="w-full text-center shrink-0 pb-1.5 overflow-hidden relative z-1">
                                <span
                                    className="text-[8px] font-semibold opacity-75 uppercase block tracking-tighter truncate"
                                    style={{
                                        writingMode: "vertical-rl",
                                        transform: "rotate(180deg)",
                                        maxHeight: "45px"
                                    }}
                                >
                                    {book.author.split(" ")[0]}
                                </span>
                            </div>
                        </motion.div>

                        {/* ── HOVER TOOLTIP POPUP (DESKTOP ONLY) ── */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.94 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.94 }}
                                    transition={{ duration: 0.16, ease: "easeOut" }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[9999] pointer-events-none w-64 shadow-2xl rounded-2xl overflow-hidden border border-[#7a5c42]/20 dark:border-[#d4a574]/30 bg-[#fdf9f3]/98 dark:bg-[#261810]/98 backdrop-blur-md"
                                    style={{
                                        boxShadow: "0 14px 36px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    {/* Top Accent Line */}
                                    <div
                                        className="h-1 w-full"
                                        style={{
                                            background: `linear-gradient(to right, ${book.c0}, ${book.c1})`
                                        }}
                                    />

                                    <div className="p-4">
                                        {/* Mini Cover + Title & Author Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-14 rounded shadow-md overflow-hidden shrink-0 border border-black/15 bg-[#e8deca] dark:bg-[#3a271d] relative">
                                                {book.coverImage && !imgErrors[book.id] ? (
                                                    <img
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        onError={() => setImgErrors((prev) => ({ ...prev, [book.id]: true }))}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-tr ${book.coverGradient} p-1 flex flex-col justify-between text-white text-[7px]`}>
                                                        <span className="font-serif font-bold line-clamp-2 leading-tight">{book.title}</span>
                                                        <span className="text-[6px] opacity-75 truncate">{book.author}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <h5 className="font-serif font-bold text-sm text-[#1c0f05] dark:text-[#f5ece3] leading-snug line-clamp-2">
                                                    {book.title}
                                                </h5>
                                                <p className="text-[11px] font-serif italic text-[#7c5a3a] dark:text-[#c9ab91] mt-0.5 truncate">
                                                    {book.author}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Category / Genre Pill Box */}
                                        <div className="mb-3 p-2 rounded-xl bg-[#dce7e5]/80 dark:bg-[#34241b] border border-[#b8cfcc]/70 dark:border-[#52392b]">
                                            <p className="text-[9.5px] font-bold tracking-wider text-[#3d6568] dark:text-[#e5b882] uppercase leading-tight font-sans">
                                                {book.category}
                                            </p>
                                        </div>

                                        {/* Separator line */}
                                        <div className="h-[1px] bg-[#e8e0d5] dark:bg-[#3e281b] mb-2.5" />

                                        {/* Status Badge & Rating Footer */}
                                        <div className="flex items-center justify-between text-xs font-semibold">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-semibold ${
                                                    book.status === "Finished"
                                                        ? "bg-[#dbeafe] text-[#1e40af]"
                                                        : book.status === "Reading"
                                                        ? "bg-[#dcfce7] text-[#166534]"
                                                        : "bg-[#f3e8ff] text-[#6b21a8]"
                                                }`}
                                            >
                                                <span
                                                    className={`w-2 h-2 rounded-full ${
                                                        book.status === "Finished"
                                                            ? "bg-[#3b82f6]"
                                                            : book.status === "Reading"
                                                            ? "bg-[#22c55e]"
                                                            : "bg-[#a855f7]"
                                                    }`}
                                                />
                                                {book.status === "Finished" ? t("landing.finished", "Selesai") : book.status === "Reading" ? t("landing.reading", "Sedang Dibaca") : t("landing.wishlist", "Wishlist")}
                                            </span>

                                            <div className="flex items-center gap-1 text-xs font-bold text-[#4a3b2f] dark:text-[#f5ece3]">
                                                <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                                                <span>{book.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}

            {/* Realistic Wooden & Brass Bookshelf Rail */}
            <div className="absolute bottom-2 left-2 right-2 pointer-events-none z-0">
                {/* Brass Lip Highlight Line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4a574]/85 to-transparent rounded-full shadow-xs" />
                {/* Solid Wooden Shelf Plank Body */}
                <div className="h-[12px] w-full bg-gradient-to-b from-[#8c6239] via-[#6d4c2b] to-[#4a331c] dark:from-[#432717] dark:via-[#2e190e] dark:to-[#1a0e08] rounded-b-xs shadow-md border-t border-[#d4a574]/30" />
                {/* Soft Drop Shadow under shelf */}
                <div className="h-[6px] w-full bg-black/25 dark:bg-black/55 blur-[3px]" />
            </div>
        </div>
    );
}
