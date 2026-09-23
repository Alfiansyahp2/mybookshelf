import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    return (
        <AnimatePresence mode="wait">
            {activeBook && (
                <motion.div
                    key={`sampul-box-${activeBook.id}`}
                    initial={{ opacity: 0, scale: 0.85, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 25 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectBook(activeBook.id);
                    }}
                    className="absolute bottom-10 z-50 w-[185px] xs:w-[200px] aspect-[2/3] rounded-2xl bg-gradient-to-tr from-[#fdfbf7] via-[#faf4e8] to-[#f5ecd7] p-2 shadow-2xl border-2 border-[#4a3b2f]/40 cursor-pointer flex flex-col justify-between overflow-hidden group left-0 right-0 mx-auto"
                    style={{
                        boxShadow: "0 24px 50px -10px rgba(0,0,0,0.45), 0 0 25px rgba(122,92,66,0.3)"
                    }}
                >
                    {/* Inner Cover Box */}
                    <div className={`w-full h-full rounded-xl bg-gradient-to-tr ${activeBook.coverGradient} text-white p-2 relative overflow-hidden flex flex-col justify-start border border-white/30 shadow-md`}>
                        {/* Glossy Sheen Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

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
                                title="Tutup"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
