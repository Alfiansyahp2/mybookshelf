import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Edit, Clock, Hash, X } from "lucide-react";
import type { Book } from "../../types";
import BookDetailLeftPage from "../book-details/BookDetailLeftPage";
import BookDetailRightPage from "../book-details/BookDetailRightPage";

interface DemoBookDetailModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
}

const STATUS_CFG: Record<
    string,
    { labelKey: string; color: string; bg: string; border: string; dot: string; label: string }
> = {
    reading: {
        labelKey: "status.reading",
        label: "Sedang Dibaca",
        color: "#065f46",
        bg: "#d1fae5",
        border: "#6ee7b7",
        dot: "#10b981",
    },
    finished: {
        labelKey: "status.finished",
        label: "Selesai",
        color: "#1e40af",
        bg: "#dbeafe",
        border: "#93c5fd",
        dot: "#3b82f6",
    },
    unread: {
        labelKey: "status.unread",
        label: "Belum Dibaca",
        color: "#374151",
        bg: "#f3f4f6",
        border: "#d1d5db",
        dot: "#9ca3af",
    },
    wishlist: {
        labelKey: "status.wishlist",
        label: "Wishlist",
        color: "#6b21a8",
        bg: "#f3e8ff",
        border: "#c4b5fd",
        dot: "#a855f7",
    },
    borrowed: {
        labelKey: "status.borrowed",
        label: "Dipinjam",
        color: "#92400e",
        bg: "#fef3c7",
        border: "#fcd34d",
        dot: "#f59e0b",
    },
};

type RightTab = "progress" | "session" | "notes" | "info";

export default function DemoBookDetailModal({
    book: initialBook,
    isOpen,
    onClose,
}: DemoBookDetailModalProps) {
    const [book, setBook] = useState<Book | null>(initialBook);
    const [userRating, setUserRating] = useState(0);
    const [userNotes, setUserNotes] = useState("");
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [tempNotes, setTempNotes] = useState("");
    const [activeTab, setActiveTab] = useState<RightTab>("progress");
    const [showMarkAsReadDatePicker, setShowMarkAsReadDatePicker] = useState(false);
    const [markAsReadDate, setMarkAsReadDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [mobilePage, setMobilePage] = useState<"left" | "right">("left");

    useEffect(() => {
        if (initialBook) {
            setBook(initialBook);
            setUserRating(initialBook.personalRating || 0);
            setUserNotes(initialBook.personalNotes || "");
            setTempNotes(initialBook.personalNotes || "");
        }
    }, [initialBook]);

    useEffect(() => {
        if (isOpen && book) {
            setIsEditingNotes(false);
            if (book.status === "reading" || book.status === "finished") {
                setActiveTab("progress");
            } else {
                setActiveTab("info");
            }
        }
    }, [isOpen, book?.id]);

    if (!isOpen || !book) return null;

    const cfg = STATUS_CFG[book.status] ?? STATUS_CFG["unread"];
    const progress =
        book.pages && book.pages > 0
            ? Math.round(((book.currentPage || 0) / book.pages) * 100)
            : 0;
    const c0 = book.spineColors?.[0] || "#8B7355";
    const c1 = book.spineColors?.[1] || "#6B5344";
    const c2 = book.spineColors?.[2] || "#5C4532";

    const tabs: { id: RightTab; label: string; icon: React.ReactNode }[] = [
        { id: "progress", label: "Progress", icon: <BookOpen className="w-3.5 h-3.5" /> },
        { id: "session", label: "Sesi", icon: <Clock className="w-3.5 h-3.5" /> },
        { id: "notes", label: "Catatan", icon: <Edit className="w-3.5 h-3.5" /> },
        { id: "info", label: "Info", icon: <Hash className="w-3.5 h-3.5" /> },
    ];
    const tabIdx = tabs.findIndex((t) => t.id === activeTab);

    // Pure Local Handlers for Demo Mode
    const handleFav = () => {
        setBook((prev) => (prev ? { ...prev, favorite: !prev.favorite, isFavorite: !prev.favorite } : null));
    };

    const handleRating = (r: number) => {
        setUserRating(r);
        setBook((prev) => (prev ? { ...prev, personalRating: r } : null));
    };

    const handleProgress = (p: number) => {
        setBook((prev) =>
            prev
                ? {
                    ...prev,
                    currentPage: p,
                    progress: Math.round((p / (prev.pages || 1)) * 100),
                }
                : null
        );
    };

    const handleNotes = () => {
        setUserNotes(tempNotes);
        setBook((prev) => (prev ? { ...prev, personalNotes: tempNotes } : null));
        setIsEditingNotes(false);
    };

    const handleStart = () => {
        setBook((prev) =>
            prev
                ? {
                    ...prev,
                    status: "reading",
                    startedDate: new Date().toISOString().split("T")[0],
                }
                : null
        );
    };

    const handleFinish = () => {
        setBook((prev) =>
            prev
                ? {
                    ...prev,
                    status: "finished",
                    progress: 100,
                    currentPage: prev.pages,
                    finishedDate: new Date().toISOString().split("T")[0],
                }
                : null
        );
    };

    const handleMarkAsReadNow = () => {
        handleFinish();
        setShowMarkAsReadDatePicker(false);
    };

    const handleAddReadDate = (date: string) => {
        setBook((prev) => {
            if (!prev) return null;
            const dates = prev.readDates ? [...prev.readDates] : [];
            if (!dates.includes(date)) dates.push(date);
            return {
                ...prev,
                readDates: dates,
                status: "finished",
                progress: 100,
                currentPage: prev.pages,
            };
        });
    };

    const handleRemoveReadDate = (date: string) => {
        setBook((prev) => {
            if (!prev || !prev.readDates) return prev;
            return { ...prev, readDates: prev.readDates.filter((d) => d !== date) };
        });
    };

    // Automatically switch to right page if user selects a right-page tab
    const handleMobileSetActiveTab = (tab: RightTab) => {
        setActiveTab(tab);
        setMobilePage("right");
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* 2-Page Open Book Reader Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 12 }}
                    transition={{ type: "spring", damping: 25, stiffness: 280 }}
                    className="relative w-full max-w-[94vw] sm:max-w-xl md:max-w-5xl h-[88vh] sm:h-[88vh] md:h-[90vh] max-h-[600px] sm:max-h-[620px] md:max-h-[640px] bg-[#f5ecd7] rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col border-2 border-[#8b643c]/30"
                    style={{ perspective: 1200 }}
                >
                    {/* Mobile 2-Page Switcher Bar */}
                    <div className="md:hidden flex items-center justify-between px-3 py-2 bg-[#4a3b2f] text-[#f8f5f0] border-b border-[#7a5c42]/30 shrink-0 z-40">
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setMobilePage("left")}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${mobilePage === "left"
                                    ? "bg-[#d4a574] text-[#2c1a0e] shadow-sm"
                                    : "text-[#f8f5f0]/70 hover:text-white"
                                    }`}
                            >
                                <span>Cover</span>
                            </button>
                            <button
                                onClick={() => setMobilePage("right")}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${mobilePage === "right"
                                    ? "bg-[#d4a574] text-[#2c1a0e] shadow-sm"
                                    : "text-[#f8f5f0]/70 hover:text-white"
                                    }`}
                            >
                                <span>Progress</span>
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-white/10 text-white"
                            aria-label="Tutup"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Book Spine / Center Fold Shadow (Desktop & Mobile) */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-[42%] -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-30" />

                    {/* Desktop Side-by-Side 2-Page Spread */}
                    <div className="hidden md:flex w-full h-full flex-row overflow-hidden">
                        <BookDetailLeftPage
                            book={book}
                            c0={c0}
                            c1={c1}
                            c2={c2}
                            cfg={cfg}
                            progress={progress}
                            userRating={userRating}
                            handleRating={handleRating}
                            handleFav={handleFav}
                            handleStart={handleStart}
                            handleFinish={handleFinish}
                            toggleFavoritePending={false}
                            startReadingPending={false}
                            finishReadingPending={false}
                            updateBookPending={false}
                            setActiveTab={handleMobileSetActiveTab}
                            setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker}
                            updateBookMutate={() => { }}
                        />

                        <BookDetailRightPage
                            book={book}
                            c0={c0}
                            c1={c1}
                            c2={c2}
                            tabs={tabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            tabIdx={tabIdx}
                            onClose={onClose}
                            showMarkAsReadDatePicker={showMarkAsReadDatePicker}
                            setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker}
                            markAsReadDate={markAsReadDate}
                            setMarkAsReadDate={setMarkAsReadDate}
                            handleStart={handleStart}
                            handleMarkAsReadNow={handleMarkAsReadNow}
                            handleProgress={handleProgress}
                            handleAddReadDate={handleAddReadDate}
                            handleRemoveReadDate={handleRemoveReadDate}
                            userNotes={userNotes}
                            tempNotes={tempNotes}
                            isEditingNotes={isEditingNotes}
                            setTempNotes={setTempNotes}
                            setIsEditingNotes={setIsEditingNotes}
                            handleNotes={handleNotes}
                            startReadingPending={false}
                            updateBookPending={false}
                            updateNotes={{ isPending: false }}
                            updateProgress={{ isPending: false }}
                        />
                    </div>

                    {/* Mobile Page View (Flippable Page 1 vs Page 2) */}
                    <div className="flex md:hidden w-full h-full flex-col overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {mobilePage === "left" ? (
                                <motion.div
                                    key="mobile-left"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full flex flex-col overflow-hidden"
                                >
                                    <BookDetailLeftPage
                                        book={book}
                                        c0={c0}
                                        c1={c1}
                                        c2={c2}
                                        cfg={cfg}
                                        progress={progress}
                                        userRating={userRating}
                                        handleRating={handleRating}
                                        handleFav={handleFav}
                                        handleStart={handleStart}
                                        handleFinish={handleFinish}
                                        toggleFavoritePending={false}
                                        startReadingPending={false}
                                        finishReadingPending={false}
                                        updateBookPending={false}
                                        setActiveTab={handleMobileSetActiveTab}
                                        setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker}
                                        updateBookMutate={() => { }}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="mobile-right"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full flex flex-col overflow-hidden"
                                >
                                    <BookDetailRightPage
                                        book={book}
                                        c0={c0}
                                        c1={c1}
                                        c2={c2}
                                        tabs={tabs}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        tabIdx={tabIdx}
                                        onClose={onClose}
                                        showMarkAsReadDatePicker={showMarkAsReadDatePicker}
                                        setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker}
                                        markAsReadDate={markAsReadDate}
                                        setMarkAsReadDate={setMarkAsReadDate}
                                        handleStart={handleStart}
                                        handleMarkAsReadNow={handleMarkAsReadNow}
                                        handleProgress={handleProgress}
                                        handleAddReadDate={handleAddReadDate}
                                        handleRemoveReadDate={handleRemoveReadDate}
                                        userNotes={userNotes}
                                        tempNotes={tempNotes}
                                        isEditingNotes={isEditingNotes}
                                        setTempNotes={setTempNotes}
                                        setIsEditingNotes={setIsEditingNotes}
                                        handleNotes={handleNotes}
                                        startReadingPending={false}
                                        updateBookPending={false}
                                        updateNotes={{ isPending: false }}
                                        updateProgress={{ isPending: false }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
