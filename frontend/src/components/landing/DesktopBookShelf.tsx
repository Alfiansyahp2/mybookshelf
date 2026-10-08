import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animate, stagger } from "animejs";
import { useTranslation } from "react-i18next";
import type { EditorialBook } from "../../constants/editorialBooks";
import Book3DModel from "./Book3DModel";

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
                                    ? "opacity-100 hover:shadow-indigo-500/30 hover:ring-2 hover:ring-indigo-600 dark:hover:ring-[#38bdf8]/60"
                                    : "opacity-25 grayscale-[60%] blur-[0.4px] scale-95 pointer-events-none"
                            }`}
                        >
                            {/* Realistic 3D Spine Cylindrical Shading & Hinge Crease */}
                            <div className="absolute inset-0 pointer-events-none rounded-xs bg-gradient-to-r from-black/20 via-transparent to-black/25 dark:from-black/35 dark:via-white/[0.04] dark:to-black/35" />

                            {/* Top Spine Accent Star */}
                            <div className="w-full flex justify-center shrink-0 pt-0.5 relative z-1">
                                <span className="text-[9px] text-[#ffd166] dark:text-[#38bdf8]">★</span>
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

                        {/* ── HOVER 3D BOOK PREVIEW (DESKTOP) ── */}
                        <AnimatePresence>
                            {isHovered && (
                                <div
                                    className="absolute bottom-10 z-[9999] pointer-events-auto cursor-pointer flex flex-col items-center select-none"
                                    style={{
                                        left: "50%",
                                        transform: "translateX(-50%)"
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectBook(book.id);
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.75 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.75 }}
                                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                                        className="flex flex-col items-center"
                                        style={{
                                            perspective: "1200px",
                                            perspectiveOrigin: "50% 50%"
                                        }}
                                    >
                                        {/* 3D Realistic Hardcover Book Model */}
                                        <Book3DModel
                                            book={book}
                                            width={142}
                                            height={206}
                                            depth={26}
                                            imgErrors={imgErrors}
                                            setImgErrors={setImgErrors}
                                            floatingAnimation={true}
                                            showShadow={true}
                                        />

                                        {/* Glassmorphic Action Pill Badge */}
                                        <div className="mt-2 px-3.5 py-1 rounded-full bg-[#0f172a]/92 dark:bg-[#0d1527]/95 backdrop-blur-md text-[#f8fafc] text-[10px] font-medium tracking-wide flex items-center gap-1 shadow-xl border border-indigo-500/30 dark:border-sky-400/35 hover:border-indigo-400/60 dark:hover:border-sky-400/70 transition-all duration-200 whitespace-nowrap group/pill">
                                            <span className="text-slate-200 dark:text-slate-100 text-[9.5px] font-sans flex items-center gap-1 group-hover/pill:text-white transition-colors">
                                                {t("landing.click_to_read", "Klik untuk detail")}
                                                <span className="text-[#ffd166] dark:text-[#38bdf8] font-bold group-hover/pill:translate-x-0.5 transition-transform">→</span>
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}

            {/* Sleek Floating Cosmic & Starlight Bookshelf Rail */}
            <div className="absolute bottom-2 left-2 right-2 pointer-events-none z-0">
                {/* Luminescent Cosmic Starlight Beam / Lip */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ffd166]/90 dark:via-[#38bdf8]/85 to-transparent rounded-full shadow-xs" />
                {/* Floating Cosmic Titanium & Obsidian Shelf Plank */}
                <div className="h-[12px] w-full bg-gradient-to-b from-[#475569] via-[#334155] to-[#1e293b] dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#020617] rounded-b-xs shadow-md border-t border-[#ffd166]/40 dark:border-[#38bdf8]/35 transition-colors duration-700" />
                {/* Soft Cosmic Drop Shadow under shelf */}
                <div className="h-[6px] w-full bg-slate-900/20 dark:bg-sky-950/40 blur-[4px]" />
            </div>
        </div>
    );
}
