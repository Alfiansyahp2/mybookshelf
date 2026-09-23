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
            translateY: [45, 0],
            opacity: [0, 1],
            delay: stagger(55, { start: 150 }),
            duration: 900,
            ease: "outQuad",
            onComplete: () => {
                animate(".demo-spine-item", {
                    translateY: ((_el: any, i: number) => (i % 2 === 0 ? [-3, 3] : [3, -3])) as any,
                    duration: 3600,
                    delay: stagger(140),
                    loop: true,
                    direction: "alternate",
                    ease: "inOutSine"
                });
            }
        });

        return () => {
            anim.pause();
        };
    }, []);

    return (
        <div className="hidden md:flex relative py-6 px-4 flex-wrap items-end justify-center gap-4 min-h-[360px] max-h-[390px]">
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
                            className={`cursor-pointer group relative w-12 ${book.spineBg} ${book.textColor} rounded-sm shadow-xl transition-all duration-300 flex flex-col justify-between p-2 select-none border-t border-l border-white/80 overflow-hidden ${
                                isMatch
                                    ? "opacity-100 hover:shadow-[#7a5c42]/30 hover:ring-2 hover:ring-[#4a3b2f]"
                                    : "opacity-25 grayscale-[60%] blur-[0.4px] scale-95 pointer-events-none"
                            }`}
                        >
                            {/* Top Spine Accent Star */}
                            <div className="w-full flex justify-center shrink-0 pt-0.5">
                                <span className="text-[9px] text-[#d4a574]">★</span>
                            </div>

                            {/* Vertical Title Text */}
                            <div className="my-auto py-1 px-0.5 text-center flex items-center justify-center overflow-hidden flex-1">
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
                            <div className="w-full text-center shrink-0 pb-0.5 overflow-hidden">
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
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[9999] pointer-events-none w-64 shadow-2xl rounded-2xl overflow-hidden border border-[#7a5c42]/20"
                                    style={{
                                        background: "rgba(253, 249, 243, 0.98)",
                                        backdropFilter: "blur(16px)",
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
                                            <div className="w-10 h-14 rounded shadow-md overflow-hidden shrink-0 border border-black/15 bg-[#e8deca] relative">
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
                                                <h5 className="font-serif font-bold text-sm text-[#1c0f05] leading-snug line-clamp-2">
                                                    {book.title}
                                                </h5>
                                                <p className="text-[11px] font-serif italic text-[#7c5a3a] mt-0.5 truncate">
                                                    {book.author}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Category / Genre Pill Box */}
                                        <div className="mb-3 p-2 rounded-xl bg-[#dce7e5]/80 border border-[#b8cfcc]/70">
                                            <p className="text-[9.5px] font-bold tracking-wider text-[#3d6568] uppercase leading-tight font-sans">
                                                {book.category}
                                            </p>
                                        </div>

                                        {/* Separator line */}
                                        <div className="h-[1px] bg-[#e8e0d5] mb-2.5" />

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

                                            <div className="flex items-center gap-1 text-xs font-bold text-[#4a3b2f]">
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

            {/* Bottom Baseline Floor Line */}
            <div className="absolute bottom-1 left-2 right-2 h-[2px] bg-[#7a5c42]/30 rounded-full" />
        </div>
    );
}
