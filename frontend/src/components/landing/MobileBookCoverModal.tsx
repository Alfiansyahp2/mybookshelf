import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
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

    return (
        <AnimatePresence mode="wait">
            {activeBook && (
                <div
                    className="absolute inset-x-0 bottom-8 z-50 flex justify-center items-center pointer-events-none"
                    style={{ perspective: "1000px" }}
                >
                    <motion.div
                        key={`sampul-box-${activeBook.id}`}
                        initial={{ opacity: 0, scale: 0.82, y: 35, rotateX: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 25, rotateX: -8 }}
                        transition={{ type: "spring", stiffness: 340, damping: 24 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectBook(activeBook.id);
                        }}
                        className="pointer-events-auto w-[190px] xs:w-[205px] aspect-[2/3] rounded-2xl bg-gradient-to-tr from-[#fdfbf7] via-[#faf4e8] to-[#f5ecd7] dark:from-[#261810] dark:via-[#2d1e15] dark:to-[#362318] p-2 shadow-2xl border-2 border-[#4a3b2f]/40 dark:border-[#d4a574]/40 cursor-pointer flex flex-col justify-between overflow-hidden group relative"
                        style={{
                            boxShadow: "0 24px 50px -10px rgba(0,0,0,0.5), 0 0 30px rgba(212,165,116,0.35)"
                        }}
                    >
                        {/* Inner Cover Box */}
                        <div className={`w-full h-full rounded-xl bg-gradient-to-tr ${activeBook.coverGradient} text-white p-2 relative overflow-hidden flex flex-col justify-between border border-white/30 shadow-md`}>
                            {/* Dynamic Foil Gloss Sweep Animation */}
                            <motion.div
                                initial={{ x: "-150%", opacity: 0 }}
                                animate={{ x: "250%", opacity: [0, 0.45, 0] }}
                                transition={{ duration: 0.9, delay: 0.15, ease: "easeInOut" }}
                                className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none z-20"
                            />

                            {/* Book Cover Image background if available */}
                            {activeBook.coverImage && !imgErrors[activeBook.id] ? (
                                <img
                                    src={activeBook.coverImage}
                                    alt={activeBook.title}
                                    onError={() => setImgErrors((prev) => ({ ...prev, [activeBook.id]: true }))}
                                    className="absolute inset-0 w-full h-full object-cover opacity-100 z-0"
                                />
                            ) : (
                                /* Fallback text only if cover image is missing */
                                <div className="my-auto text-center p-3 relative z-10">
                                    <h4 className="font-serif font-bold text-sm text-white drop-shadow-md">{activeBook.title}</h4>
                                    <p className="text-[10px] font-serif italic text-white/90 mt-1">{activeBook.author}</p>
                                </div>
                            )}

                            {/* Top Right Close Button */}
                            <div className="relative z-10 flex items-center justify-end w-full">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center text-xs font-bold border border-white/20 transition-all active:scale-90 shadow-md"
                                    title={t("landing.close", "Tutup")}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Bottom Tap to Detail Call-to-Action Pill */}
                            <div className="relative z-10 flex items-center justify-center w-full mt-auto pb-0.5">
                                <div className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] text-white font-medium tracking-wide flex items-center gap-1.5 shadow-lg border border-white/20 group-hover:bg-black/80 transition-colors">
                                    <span>{t("landing.tap_to_read", "Ketuk untuk detail")}</span>
                                    <motion.span
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                        className="text-[#d4a574] font-bold"
                                    >
                                        →
                                    </motion.span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
