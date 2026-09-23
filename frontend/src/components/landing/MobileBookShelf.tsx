import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    type EditorialBook,
    MOBILE_BOOK_STYLES
} from "../../constants/editorialBooks";
import MobileBookCoverModal from "./MobileBookCoverModal";

interface MobileBookShelfProps {
    books: EditorialBook[];
    onSelectBook: (id: string) => void;
    activeMobileBookId: string | null;
    setActiveMobileBookId: (id: string | null) => void;
    trainIndex: number;
    setTrainIndex: React.Dispatch<React.SetStateAction<number>>;
    imgErrors: Record<string, boolean>;
    setImgErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function MobileBookShelf({
    books,
    onSelectBook,
    activeMobileBookId,
    setActiveMobileBookId,
    trainIndex,
    setTrainIndex,
    imgErrors,
    setImgErrors
}: MobileBookShelfProps) {
    const { t } = useTranslation();
    const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
    const [isInitialMounted, setIsInitialMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialMounted(true);
        }, 850);
        return () => clearTimeout(timer);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsInitialMounted(true);
        setTouchStartPos({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartPos) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = touchStartPos.x - endX;
        const diffY = touchStartPos.y - endY;

        // Intentional horizontal swipe (> 25px horizontal, and horizontal > vertical * 1.3)
        if (Math.abs(diffX) > 25 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
            if (diffX > 0) {
                // Swipe Left -> next book in train (infinite, no limit)
                setTrainIndex((prev) => prev + 1);
            } else {
                // Swipe Right -> previous book in train (infinite, no limit)
                setTrainIndex((prev) => prev - 1);
            }
        }
        setTouchStartPos(null);
    };

    // Calculate slots for the infinite virtual sliding window
    const slots: number[] = [];
    for (let i = trainIndex - 4; i <= trainIndex + 8; i++) {
        slots.push(i);
    }

    const activeBook = books.find((b) => b.id === activeMobileBookId) || null;

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex md:hidden flex-col items-center justify-end w-full pt-1 pb-2 px-1 select-none relative touch-pan-y"
        >
            {/* 5 VISIBLE BOOKS VIEWPORT WINDOW OVER THE INFINITE CONTINUOUS TRAIN TRACK */}
            <div className="w-full max-w-[365px] xs:max-w-[385px] mx-auto overflow-hidden relative min-h-[355px] pb-3 flex items-end">
                <motion.div
                    animate={{ x: -trainIndex * 66 }}
                    transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.7 }}
                    className="relative h-[340px] w-full"
                >
                    {slots.map((slotIndex) => {
                        const bookIdx = ((slotIndex % books.length) + books.length) % books.length;
                        const book = books[bookIdx];
                        const isActive = activeMobileBookId === book.id;
                        const style = MOBILE_BOOK_STYLES[bookIdx] || { height: 280, tilt: 0 };
                        const transformOrigin =
                            style.tilt < 0 ? "left bottom" : style.tilt > 0 ? "right bottom" : "center bottom";
                        const visibleOffset = Math.max(0, Math.min(5, slotIndex - trainIndex));

                        return (
                            <motion.div
                                key={`infinite-book-slot-${slotIndex}`}
                                onClick={() => {
                                    setIsInitialMounted(true);
                                    if (activeMobileBookId === book.id) {
                                        setActiveMobileBookId(null);
                                    } else {
                                        setActiveMobileBookId(book.id);
                                    }
                                }}
                                initial={{ y: 55, opacity: 0 }}
                                animate={{
                                    y: isActive ? -80 : 0,
                                    scale: isActive ? 1.05 : 1,
                                    rotate: isActive ? 0 : style.tilt,
                                    opacity: 1,
                                    zIndex: isActive ? 50 : style.tilt !== 0 ? 15 : 10
                                }}
                                transition={
                                    !isInitialMounted
                                        ? { delay: visibleOffset * 0.06 + 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                                        : { type: "spring", stiffness: 320, damping: 25 }
                                }
                                className={`absolute cursor-pointer w-[54px] xs:w-14 rounded-xs shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.55)] flex flex-col justify-between p-2 select-none border border-black/10 dark:border-black/40 border-t-white/30 dark:border-t-white/10 overflow-hidden transition-all duration-300 ${
                                    book.spineBg
                                } ${book.textColor} ${
                                    isActive
                                        ? "ring-2 ring-[#d4a574] shadow-2xl shadow-[#d4a574]/25"
                                        : "hover:shadow-2xl"
                                }`}
                                style={{
                                    left: `${slotIndex * 66}px`,
                                    bottom: "12px",
                                    height: `${style.height}px`,
                                    transformOrigin
                                }}
                            >
                                {/* Realistic 3D Spine Cylindrical Shading & Hinge Crease */}
                                <div className="absolute inset-0 pointer-events-none rounded-xs bg-gradient-to-r from-black/20 via-transparent to-black/25 dark:from-black/35 dark:via-white/[0.04] dark:to-black/35" />

                                {/* Spine Top Accent Star */}
                                <div className="w-full flex justify-center shrink-0 pt-0.5 relative z-1">
                                    <span
                                        className={`text-[9.5px] transition-all duration-300 ${
                                            isActive ? "text-[#ffd700] scale-125" : "text-[#d4a574]"
                                        }`}
                                    >
                                        ★
                                    </span>
                                </div>

                                {/* Vertical Title Text */}
                                <div className="my-auto text-center flex items-center justify-center overflow-hidden flex-1 relative z-1">
                                    <span
                                        className="font-serif font-bold text-[11px] tracking-wider uppercase leading-none truncate"
                                        style={{
                                            writingMode: "vertical-rl",
                                            transform: "rotate(180deg)",
                                            maxHeight: `${style.height - 70}px`
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
                                            maxHeight: "40px"
                                        }}
                                    >
                                        {book.author.split(" ")[0]}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Realistic Wooden & Brass Shelf Rail Across the entire visible shelf */}
                <div className="absolute bottom-1.5 left-2 right-2 pointer-events-none z-0">
                    {/* Top Brass Highlight Line */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4a574]/70 to-transparent rounded-full shadow-xs" />
                    {/* Wooden Rail Plank Body */}
                    <div className="h-[5px] w-full bg-gradient-to-b from-[#7a5c42]/35 via-[#5c4033]/45 to-[#3a2d23]/55 rounded-xs mt-[1px]" />
                    {/* Bottom Soft Drop Shadow */}
                    <div className="h-[3px] w-full bg-black/10 blur-[2px]" />
                </div>

                {/* Left Edge Blur & Smooth Fade */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-12 xs:w-16 pointer-events-none z-20 backdrop-blur-xs sm:backdrop-blur-sm bg-gradient-to-r from-[#f8f5f0] via-[#f8f5f0]/80 to-transparent dark:from-[#180f0a] dark:via-[#180f0a]/80"
                    style={{
                        WebkitMaskImage: "linear-gradient(to right, black 30%, rgba(0,0,0,0.5) 65%, transparent 100%)",
                        maskImage: "linear-gradient(to right, black 30%, rgba(0,0,0,0.5) 65%, transparent 100%)"
                    }}
                />

                {/* Right Edge Blur & Smooth Fade */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-12 xs:w-16 pointer-events-none z-20 backdrop-blur-xs sm:backdrop-blur-sm bg-gradient-to-l from-[#f8f5f0] via-[#f8f5f0]/80 to-transparent dark:from-[#180f0a] dark:via-[#180f0a]/80"
                    style={{
                        WebkitMaskImage: "linear-gradient(to left, black 30%, rgba(0,0,0,0.5) 65%, transparent 100%)",
                        maskImage: "linear-gradient(to left, black 30%, rgba(0,0,0,0.5) 65%, transparent 100%)"
                    }}
                />
            </div>

            {/* Swipe Gesture Indicator & Infinite Train Controls (LOCATED AT THE BOTTOM) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="flex items-center gap-2 px-3.5 py-1 mt-1 mb-1 rounded-full bg-[#7a5c42]/10 dark:bg-[#3d2516]/60 backdrop-blur-md border border-[#7a5c42]/20 dark:border-[#d4a574]/30 text-[#4a3b2f] dark:text-[#f5ece3] text-[10.5px] font-bold tracking-wide z-10 shadow-xs"
            >
                <motion.button
                    animate={{ x: [-1.5, 0, -1.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsInitialMounted(true);
                        setTrainIndex((prev) => prev - 1);
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#7a5c42]/20 dark:hover:bg-[#d4a574]/25 text-[#7a5c42] dark:text-[#e5b882] active:scale-90 transition-all font-bold text-xs"
                    aria-label="Geser ke kiri"
                    title="Geser ke kiri"
                >
                    ‹
                </motion.button>
                <span className="select-none">{t("landing.swipe_bookshelf", "Geser Rak Buku")}</span>
                <motion.button
                    animate={{ x: [1.5, 0, 1.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsInitialMounted(true);
                        setTrainIndex((prev) => prev + 1);
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#7a5c42]/20 dark:hover:bg-[#d4a574]/25 text-[#7a5c42] dark:text-[#e5b882] active:scale-90 transition-all font-bold text-xs"
                    aria-label="Geser ke kanan"
                    title="Geser ke kanan"
                >
                    ›
                </motion.button>
            </motion.div>

            {/* "SAMPUL" COVER OVERLAY (APPEARS ONLY WHEN A BOOK IS CLICKED!) */}
            <MobileBookCoverModal
                activeBook={activeBook}
                onClose={() => setActiveMobileBookId(null)}
                onSelectBook={onSelectBook}
                imgErrors={imgErrors}
                setImgErrors={setImgErrors}
            />
        </div>
    );
}
