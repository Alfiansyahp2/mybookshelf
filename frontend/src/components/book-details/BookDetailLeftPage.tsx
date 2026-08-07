import { motion } from "framer-motion";
import type { Book } from "../../types";
import BookCoverSection from "./left/BookCoverSection";
import BookMetadataSection from "./left/BookMetadataSection";
import BookStatsSection from "./left/BookStatsSection";
import BookProgressLeft from "./left/BookProgressLeft";
import BookRatingSection from "./left/BookRatingSection";
import BookActionsSection from "./left/BookActionsSection";

interface BookDetailLeftPageProps {
    book: Book;
    c0: string;
    c1: string;
    c2: string;
    cfg: any;
    progress: number;
    userRating: number;
    handleRating: (r: number) => void;
    handleFav: () => void;
    handleStart: () => void;
    handleFinish: () => void;
    toggleFavoritePending: boolean;
    startReadingPending: boolean;
    finishReadingPending: boolean;
    updateBookPending: boolean;
    setActiveTab: (tab: any) => void;
    setShowMarkAsReadDatePicker: (val: boolean) => void;
    updateBookMutate: (args: any) => void;
}

const PAPER_BG = "#f5ecd7";
const PAPER_LINES =
    "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,100,60,0.09) 28px)";

export default function BookDetailLeftPage({
    book,
    c0,
    c1,
    c2,
    cfg,
    progress,
    userRating,
    handleRating,
    handleFav,
    handleStart,
    handleFinish,
    toggleFavoritePending,
    startReadingPending,
    finishReadingPending,
    updateBookPending,
    setActiveTab,
    setShowMarkAsReadDatePicker,
    updateBookMutate,
}: BookDetailLeftPageProps) {
    return (
        <motion.div
            key="left"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{
                type: "spring",
                damping: 28,
                stiffness: 130,
                delay: 0.06,
            }}
            className="w-full md:w-[42%] flex-shrink-0 relative overflow-hidden flex flex-col"
            style={{
                transformOrigin: "right center",
                background: PAPER_BG,
                backgroundImage: PAPER_LINES,
                boxShadow: "inset -18px 0 28px rgba(0,0,0,0.18)",
                borderRadius: "3px 0 0 3px",
            }}
        >
            {/* ── colour accent strip at top (book colour) ── */}
            <div
                className="flex-shrink-0 h-2"
                style={{
                    background: `linear-gradient(to right, ${c2}, ${c0})`,
                }}
            />

            {/* ── scrollable content ─────────────────────── */}
            <div
                className="flex-1 overflow-y-auto flex flex-col"
                style={{ fontFamily: "'Georgia', serif" }}
            >
                {/* ── Cover + Info side-by-side ──────────────── */}
                <div className="flex items-start gap-4 px-6 pt-6 pb-4">
                    <BookCoverSection book={book} c0={c0} c1={c1} c2={c2} />
                    <BookMetadataSection book={book} c1={c1} cfg={cfg} />
                </div>

                {/* divider */}
                <div className="flex items-center gap-2 px-6">
                    <div
                        className="flex-1 h-px"
                        style={{ background: `${c1}30` }}
                    />
                    <span style={{ color: `${c1}60`, fontSize: 10 }}>◆</span>
                    <div
                        className="flex-1 h-px"
                        style={{ background: `${c1}30` }}
                    />
                </div>

                {/* stats 2×2 grid + rest of content */}
                <div className="px-6 pb-5 flex flex-col gap-3 flex-1">
                    <BookStatsSection book={book} c0={c0} />
                    
                    <BookProgressLeft 
                        book={book} 
                        progress={progress} 
                        c0={c0} 
                        c2={c2} 
                    />

                    <BookRatingSection 
                        userRating={userRating} 
                        handleRating={handleRating} 
                    />

                    <BookActionsSection 
                        book={book} 
                        c0={c0} 
                        c2={c2} 
                        handleFav={handleFav} 
                        toggleFavoritePending={toggleFavoritePending} 
                        handleStart={handleStart} 
                        startReadingPending={startReadingPending} 
                        setActiveTab={setActiveTab} 
                        setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker} 
                        updateBookPending={updateBookPending} 
                        handleFinish={handleFinish} 
                        finishReadingPending={finishReadingPending} 
                        updateBookMutate={updateBookMutate} 
                    />
                </div>
            </div>

            {/* ── Page number ─────────────────────────────── */}
            <div
                className="flex-shrink-0 py-2 text-center border-t"
                style={{ borderColor: `${c1}20` }}
            >
                <span
                    className="text-xs italic"
                    style={{ color: `${c1}70`, fontFamily: "Georgia, serif" }}
                >
                    i
                </span>
            </div>
        </motion.div>
    );
}
