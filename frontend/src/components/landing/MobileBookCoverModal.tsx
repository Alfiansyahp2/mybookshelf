import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import type { EditorialBook } from "../../constants/editorialBooks";

interface MobileBookCoverModalProps {
    activeBook: EditorialBook | null;
    onClose: () => void;
    onSelectBook: (id: string) => void;
    imgErrors: Record<string, boolean>;
    setImgErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function MobileBookCoverModal({
    activeBook,
    onClose,
    onSelectBook,
    imgErrors,
    setImgErrors
}: MobileBookCoverModalProps) {
    const { t } = useTranslation();

    // 3D Hardcover Book Geometry Specifications (in pixels)
    const bookW = 172; // Width of the book
    const bookH = 250; // Height of the book
    const bookD = 32;  // Depth / Thickness of the book

    return (
        <AnimatePresence>
            {activeBook && (
                <motion.div
                    key={`mobile-book-modal-${activeBook.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    {/* Invisible Click-Outside Overlay to Close (No rectangular box/borders) */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="fixed inset-[-100vh_-100vw] pointer-events-auto z-10 cursor-pointer"
                    />

                    {/* 3D Scene Perspective Viewport */}
                    <motion.div
                        initial={{ scale: 0.78, y: 25 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 15 }}
                        transition={{ type: "spring", stiffness: 340, damping: 25 }}
                        className="relative z-20 flex flex-col items-center pointer-events-none"
                        style={{
                            perspective: "1200px",
                            perspectiveOrigin: "50% 45%"
                        }}
                    >
                        {/* Top-Right Close Button Header */}
                        <div className="w-full flex justify-end mb-2 pr-1 pointer-events-auto z-40">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="w-7 h-7 rounded-full bg-black/65 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center text-xs font-bold border border-white/25 shadow-lg active:scale-90 transition-all cursor-pointer"
                                title={t("landing.close", "Tutup")}
                                aria-label="Tutup Preview"
                            >
                                ✕
                            </button>
                        </div>

                        {/* ── REALISTIC 3D HARDCOVER BOOK CONTAINER ── */}
                        <motion.div
                            animate={{
                                y: [0, -7, 0],
                                rotateY: [-26, -18, -26],
                                rotateX: [10, 13, 10],
                                rotateZ: [-2, -1, -2]
                            }}
                            transition={{
                                y: { repeat: Infinity, duration: 4.2, ease: "easeInOut" },
                                rotateY: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                                rotateX: { repeat: Infinity, duration: 4.6, ease: "easeInOut" },
                                rotateZ: { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
                            }}
                            whileHover={{ scale: 1.04, rotateY: -15, rotateX: 6 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectBook(activeBook.id);
                            }}
                            className="cursor-pointer pointer-events-auto relative select-none"
                            style={{
                                width: bookW,
                                height: bookH,
                                transformStyle: "preserve-3d"
                            }}
                        >
                            {/* ── 1. FRONT COVER (+Z) ── */}
                            <div
                                className="absolute inset-0 rounded-r-sm overflow-hidden bg-cover bg-center border-r border-t border-b border-white/25 shadow-2xl"
                                style={{
                                    transform: `translateZ(${bookD / 2}px)`,
                                    backfaceVisibility: "hidden",
                                    boxShadow: "0 12px 28px rgba(0,0,0,0.35)"
                                }}
                            >
                                <div className={`w-full h-full bg-gradient-to-tr ${activeBook.coverGradient} relative overflow-hidden flex flex-col justify-between`}>
                                    {/* Cover Image */}
                                    {activeBook.coverImage && !imgErrors[activeBook.id] ? (
                                        <img
                                            src={activeBook.coverImage}
                                            alt={activeBook.title}
                                            onError={() => setImgErrors((prev) => ({ ...prev, [activeBook.id]: true }))}
                                            className="absolute inset-0 w-full h-full object-cover z-0"
                                        />
                                    ) : (
                                        <div className="my-auto text-center p-3 relative z-10">
                                            <h4 className="font-serif font-bold text-sm text-white drop-shadow-md">{activeBook.title}</h4>
                                            <p className="text-[10px] font-serif italic text-white/90 mt-1">{activeBook.author}</p>
                                        </div>
                                    )}

                                    {/* Hardcover Spine Hinge Crease / Joint (realistic vertical indentation) */}
                                    <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-black/40 shadow-[1px_0_2px_rgba(255,255,255,0.25)] pointer-events-none z-20" />
                                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/45 via-black/15 to-transparent pointer-events-none z-20" />

                                    {/* Dynamic Specular Foil Light Gleam */}
                                    <motion.div
                                        animate={{ x: ["-130%", "220%"], opacity: [0, 0.45, 0] }}
                                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
                                        className="absolute inset-0 w-3/5 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none z-20"
                                    />

                                    {/* Corner bevel highlight on the open edge */}
                                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/40 pointer-events-none z-20" />
                                </div>
                            </div>

                            {/* ── 2. BOOK SPINE (LEFT FACE, -X) ── */}
                            <div
                                className="absolute flex flex-col justify-between items-center py-3 overflow-hidden shadow-inner border-y border-l border-white/20"
                                style={{
                                    width: `${bookD}px`,
                                    height: `${bookH}px`,
                                    left: "50%",
                                    top: "50%",
                                    transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${bookW / 2}px)`,
                                    backgroundColor: activeBook.c0 || "#3a2d23",
                                    backfaceVisibility: "hidden"
                                }}
                            >
                                {/* Top Gold Foil Accent Stripe */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#d4a574] to-transparent shrink-0 opacity-85" />

                                {/* Vertical Spine Title */}
                                <div className="flex-1 flex flex-col items-center justify-center overflow-hidden my-1">
                                    <span
                                        className="text-[9px] font-serif font-bold text-white/95 uppercase tracking-widest block truncate max-h-[145px]"
                                        style={{
                                            writingMode: "vertical-rl",
                                            transform: "rotate(180deg)"
                                        }}
                                    >
                                        {activeBook.shortTitle || activeBook.title}
                                    </span>
                                </div>

                                {/* Bottom Gold Foil Accent Stripe */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#d4a574] to-transparent shrink-0 opacity-85" />
                            </div>

                            {/* ── 3. BOOK PAGES BLOCK (RIGHT FACE, +X) ── */}
                            <div
                                className="absolute rounded-r-xs overflow-hidden"
                                style={{
                                    width: `${bookD - 4}px`, // 28px width, recessed for hardcover overhang lip
                                    height: `${bookH - 8}px`, // 242px height, recessed 4px top and bottom
                                    left: "50%",
                                    top: "50%",
                                    transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${bookW / 2 - 3}px)`,
                                    background: "repeating-linear-gradient(to bottom, #fcf9f2 0px, #f4eee2 2px, #e7dcce 3px, #fcf9f2 4px)",
                                    boxShadow: "inset 4px 0 8px rgba(0,0,0,0.22), inset -4px 0 8px rgba(0,0,0,0.2)"
                                }}
                            />

                            {/* ── 4. TOP PAGES FACE (UP, -Y) ── */}
                            <div
                                className="absolute"
                                style={{
                                    width: `${bookW - 8}px`,
                                    height: `${bookD - 4}px`,
                                    left: "50%",
                                    top: "50%",
                                    transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${bookH / 2 - 3}px)`,
                                    background: "repeating-linear-gradient(to right, #fcf9f2 0px, #f4eee2 2px, #e7dcce 3px, #fcf9f2 4px)",
                                    boxShadow: "inset 0 3px 6px rgba(0,0,0,0.2), inset 0 -3px 6px rgba(0,0,0,0.18)"
                                }}
                            />

                            {/* ── 5. BOTTOM PAGES FACE (DOWN, +Y) ── */}
                            <div
                                className="absolute"
                                style={{
                                    width: `${bookW - 8}px`,
                                    height: `${bookD - 4}px`,
                                    left: "50%",
                                    top: "50%",
                                    transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${bookH / 2 - 3}px)`,
                                    background: "repeating-linear-gradient(to right, #fcf9f2 0px, #f4eee2 2px, #e7dcce 3px, #fcf9f2 4px)",
                                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.28)"
                                }}
                            />

                            {/* ── 6. BACK COVER (-Z) ── */}
                            <div
                                className="absolute rounded-l-sm overflow-hidden flex flex-col justify-between p-2.5 border-l border-t border-b border-white/10"
                                style={{
                                    width: `${bookW}px`,
                                    height: `${bookH}px`,
                                    left: "50%",
                                    top: "50%",
                                    transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${bookD / 2}px)`,
                                    backgroundColor: activeBook.c0 || "#2c1d11",
                                    boxShadow: "0 0 16px rgba(0,0,0,0.45)",
                                    backfaceVisibility: "hidden"
                                }}
                            >
                                <div className={`w-full h-full bg-gradient-to-tr ${activeBook.coverGradient} opacity-95 p-2 flex flex-col justify-between text-white/80 rounded-xs`}>
                                    <div className="h-1 w-12 bg-[#d4a574]/60 mx-auto rounded-full mt-2" />
                                    <p className="text-[8.5px] font-serif italic text-center line-clamp-3 opacity-75 px-1">
                                        "{activeBook.personalQuote || activeBook.title}"
                                    </p>
                                    <div className="flex items-center justify-between text-[7px] font-mono opacity-50 px-1 border-t border-white/15 pt-1">
                                        <span>ISBN {activeBook.year}</span>
                                        <span>{activeBook.pages} pp</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── 3D FLOOR / CONTACT PERSPECTIVE SHADOW ── */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.48, 0.32, 0.48],
                                x: [0, 2, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                            className="w-[165px] h-[16px] bg-black/60 rounded-full blur-md mx-auto mt-2 pointer-events-none"
                            style={{
                                transform: "rotateX(75deg)"
                            }}
                        />

                        {/* ── BOTTOM CALL TO ACTION PILL ── */}
                        <div className="mt-3 pointer-events-auto z-40">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectBook(activeBook.id);
                                }}
                                className="px-3.5 py-1.5 rounded-full bg-[#4a3b2f]/95 hover:bg-[#3a2d23] dark:bg-[#3d2719]/95 dark:hover:bg-[#4d3222] backdrop-blur-md text-xs text-[#f8f5f0] font-medium tracking-wide flex items-center gap-2 shadow-xl border border-[#d4a574]/40 hover:border-[#d4a574]/80 active:scale-95 transition-all cursor-pointer group"
                            >
                                <BookOpen className="w-3.5 h-3.5 text-[#d4a574]" />
                                <span>{t("landing.tap_to_read", "Ketuk untuk detail")}</span>
                                <motion.span
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                    className="text-[#d4a574] font-bold"
                                >
                                    →
                                </motion.span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
