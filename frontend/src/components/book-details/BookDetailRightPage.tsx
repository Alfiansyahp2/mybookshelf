import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Book } from "../../types";
import ReadingProgressSection from "./right/ReadingProgressSection";
import ReadingSessionTimer from "./right/ReadingSessionTimer";
import BookNotesSection from "./right/BookNotesSection";
import BookInfoSection from "./right/BookInfoSection";
import UnreadStartSection from "./right/UnreadStartSection";
import RightPageTabBar, { type TabItem } from "./right/RightPageTabBar";
import RightPageFooter from "./right/RightPageFooter";

interface BookDetailRightPageProps {
    book: Book;
    c0: string;
    c1: string;
    c2: string;
    tabs: TabItem[];
    activeTab: string;
    setActiveTab: (id: any) => void;
    tabIdx: number;
    onEdit?: (book: Book) => void;
    onDelete?: (id: string) => void;
    onClose: () => void;
    showMarkAsReadDatePicker: boolean;
    setShowMarkAsReadDatePicker: (val: boolean) => void;
    markAsReadDate: string;
    setMarkAsReadDate: (val: string) => void;
    handleStart: () => void;
    handleMarkAsReadNow: () => void;
    handleProgress: (p: number) => void;
    handleAddReadDate: (d: string) => void;
    handleRemoveReadDate: (d: string) => void;
    userNotes: string;
    tempNotes: string;
    isEditingNotes: boolean;
    setTempNotes: (val: string) => void;
    setIsEditingNotes: (val: boolean) => void;
    handleNotes: () => void;
    startReadingPending: boolean;
    updateBookPending: boolean;
    updateNotes: any;
    updateProgress: any;
}

const PAPER_BG = "#f5ecd7";
const PAPER_LINES =
    "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,100,60,0.09) 28px)";

const bookPageLeafVariants: Variants = {
    enter: (direction: number) => ({
        rotateY: direction > 0 ? 35 : -85,
        opacity: 0,
        skewY: direction > 0 ? 1.5 : -2.5,
        scale: 0.98,
        transformOrigin: "left center",
        boxShadow:
            direction > 0
                ? "inset 20px 0 30px -10px rgba(0,0,0,0.18)"
                : "-25px 0 35px rgba(0,0,0,0.35)",
        filter: "brightness(0.92)",
    }),
    center: {
        rotateY: 0,
        opacity: 1,
        skewY: 0,
        scale: 1,
        transformOrigin: "left center",
        boxShadow: "inset 18px 0 25px -15px rgba(0,0,0,0.12)",
        filter: "brightness(1)",
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // natural paper settle
        },
    },
    exit: (direction: number) => ({
        rotateY: direction > 0 ? -90 : 35,
        opacity: 0,
        skewY: direction > 0 ? -2.5 : 1.5,
        scale: 0.98,
        transformOrigin: "left center",
        boxShadow:
            direction > 0
                ? "-30px 0 45px rgba(0,0,0,0.45)"
                : "inset 25px 0 35px -10px rgba(0,0,0,0.22)",
        filter: "brightness(0.85)",
        transition: {
            duration: 0.38,
            ease: [0.35, 0.05, 0.2, 1] as [number, number, number, number], // natural page peel acceleration
        },
    }),
};

export default function BookDetailRightPage({
    book,
    c0,
    c1,
    tabs,
    activeTab,
    setActiveTab,
    tabIdx,
    onEdit,
    onDelete,
    onClose,
    showMarkAsReadDatePicker,
    setShowMarkAsReadDatePicker,
    markAsReadDate,
    setMarkAsReadDate,
    handleStart,
    handleMarkAsReadNow,
    handleProgress,
    handleAddReadDate,
    handleRemoveReadDate,
    userNotes,
    tempNotes,
    isEditingNotes,
    setTempNotes,
    setIsEditingNotes,
    handleNotes,
    startReadingPending,
    updateBookPending,
    updateNotes,
    updateProgress,
}: BookDetailRightPageProps) {
    const [selectedReadDate, setSelectedReadDate] = useState<string | null>(null);
    const [direction, setDirection] = useState<number>(1);
    const [prevTabIdx, setPrevTabIdx] = useState<number>(tabIdx);

    const handleTabChange = (newTabId: string) => {
        const newIdx = tabs.findIndex((t) => t.id === newTabId);
        if (newIdx !== -1 && newIdx !== tabIdx) {
            setDirection(newIdx > tabIdx ? 1 : -1);
            setPrevTabIdx(tabIdx);
        }
        if (newTabId !== "session") setSelectedReadDate(null);
        setActiveTab(newTabId);
    };

    // Keep direction updated if tabIdx changes externally
    if (tabIdx !== prevTabIdx) {
        setDirection(tabIdx > prevTabIdx ? 1 : -1);
        setPrevTabIdx(tabIdx);
    }

    // Keyboard arrow navigation for turning pages like a real book
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable)
            ) {
                return;
            }
            if (e.key === "ArrowRight") {
                if (tabIdx < tabs.length - 1) {
                    handleTabChange(tabs[tabIdx + 1].id);
                }
            } else if (e.key === "ArrowLeft") {
                if (tabIdx > 0) {
                    handleTabChange(tabs[tabIdx - 1].id);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [tabIdx, tabs]);

    return (
        <motion.div
            key="right"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{
                type: "spring",
                damping: 28,
                stiffness: 130,
                delay: 0.12,
            }}
            className="w-full md:flex-1 relative flex flex-col min-h-[500px] overflow-hidden rounded-b-2xl md:rounded-l-none md:rounded-r-md"
            style={{
                transformOrigin: "left center",
                background: PAPER_BG,
                backgroundImage: PAPER_LINES,
                boxShadow:
                    typeof window !== "undefined" && window.innerWidth >= 768
                        ? "inset 18px 0 28px rgba(0,0,0,0.13)"
                        : "none",
            }}
        >
            {/* Top accent strip (desktop only; mobile has top switcher bar) */}
            <div className="hidden md:block flex-shrink-0 h-2 bg-walnut" />

            {/* ── Tab bar & Actions ────────────────────────── */}
            <RightPageTabBar
                tabs={tabs}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                c1={c1}
                book={book}
                onEdit={onEdit}
                onDelete={onDelete}
                onClose={onClose}
            />

            {/* ── 3D Page Leaf Flip Container ───────────────── */}
            <div className="flex-1 overflow-hidden relative" style={{ perspective: 1400 }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        variants={bookPageLeafVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full h-full overflow-y-auto px-5 py-4 hide-scrollbar"
                        style={{
                            transformOrigin: "left center",
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden",
                        }}
                    >
                        {/* Dynamic Spine Crease Shadow overlay on the turning page leaf */}
                        <div className="absolute left-0 top-0 bottom-0 w-6 pointer-events-none bg-gradient-to-r from-black/15 via-black/5 to-transparent z-10" />

                        {/* TAB 1: Progress */}
                        {activeTab === "progress" && (
                            <div className="space-y-4">
                                {book.status === "reading" || book.status === "finished" ? (
                                    <ReadingProgressSection
                                        book={book}
                                        onProgressChange={handleProgress}
                                        onAddReadDate={handleAddReadDate}
                                        onRemoveReadDate={handleRemoveReadDate}
                                        onSelectReadDate={(date) => {
                                            setSelectedReadDate(date);
                                            handleTabChange("session");
                                        }}
                                    />
                                ) : (
                                    <UnreadStartSection
                                        book={book}
                                        c0={c0}
                                        c1={c1}
                                        handleStart={handleStart}
                                        showMarkAsReadDatePicker={showMarkAsReadDatePicker}
                                        setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker}
                                        markAsReadDate={markAsReadDate}
                                        setMarkAsReadDate={setMarkAsReadDate}
                                        handleMarkAsReadNow={handleMarkAsReadNow}
                                        startReadingPending={startReadingPending}
                                        updateBookPending={updateBookPending}
                                    />
                                )}
                            </div>
                        )}

                        {/* TAB 2: Reading Session Timer */}
                        {activeTab === "session" && (
                            <div>
                                <ReadingSessionTimer
                                    book={book}
                                    updateProgress={updateProgress}
                                    selectedReadDate={selectedReadDate}
                                    onClearSelectedReadDate={() => setSelectedReadDate(null)}
                                />
                            </div>
                        )}

                        {/* TAB 3: Personal Notes */}
                        {activeTab === "notes" && (
                            <div className="h-full flex flex-col">
                                <BookNotesSection
                                    book={book}
                                    userNotes={userNotes}
                                    tempNotes={tempNotes}
                                    isEditingNotes={isEditingNotes}
                                    updateNotes={updateNotes}
                                    onEdit={() => {
                                        setTempNotes(userNotes);
                                        setIsEditingNotes(true);
                                    }}
                                    onSave={handleNotes}
                                    onCancel={() => setIsEditingNotes(false)}
                                    onTempNotesChange={setTempNotes}
                                />
                            </div>
                        )}

                        {/* TAB 4: Book Metadata & Purchase Info */}
                        {activeTab === "info" && (
                            <BookInfoSection book={book} c0={c0} c1={c1} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Page footer with navigator ───────────────── */}
            <RightPageFooter
                tabIdx={tabIdx}
                totalPages={tabs.length}
                direction={direction}
                c1={c1}
                onPrevPage={() => {
                    if (tabIdx > 0) handleTabChange(tabs[tabIdx - 1].id);
                }}
                onNextPage={() => {
                    if (tabIdx < tabs.length - 1) handleTabChange(tabs[tabIdx + 1].id);
                }}
            />
        </motion.div>
    );
}
