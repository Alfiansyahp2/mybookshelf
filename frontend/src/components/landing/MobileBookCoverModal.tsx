import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import type { EditorialBook } from "../../constants/editorialBooks";
import Book3DModel from "./Book3DModel";

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

                        {/* ── REALISTIC 3D HARDCOVER BOOK MODEL ── */}
                        <div className="pointer-events-auto">
                            <Book3DModel
                                book={activeBook}
                                width={172}
                                height={250}
                                depth={32}
                                imgErrors={imgErrors}
                                setImgErrors={setImgErrors}
                                floatingAnimation={true}
                                showShadow={true}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectBook(activeBook.id);
                                }}
                            />
                        </div>

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
