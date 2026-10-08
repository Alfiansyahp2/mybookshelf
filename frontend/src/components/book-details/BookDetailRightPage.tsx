import { motion, AnimatePresence } from "framer-motion";
import {
    Edit,
    Trash2,
    X,
    BookOpen,
    ShoppingBag,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import type { Book } from "../../types";
import ReadingProgressSection from "./right/ReadingProgressSection";
import ReadingSessionTimer from "./right/ReadingSessionTimer";
import BookNotesSection from "./right/BookNotesSection";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface BookDetailRightPageProps {
    book: Book;
    c0: string;
    c1: string;
    c2: string;
    tabs: any[];
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

const bookPageLeafVariants = {
    enter: (direction: number) => ({
        rotateY: direction > 0 ? 35 : -85,
        opacity: 0,
        skewY: direction > 0 ? 1.5 : -2.5,
        scale: 0.98,
        transformOrigin: "left center",
        boxShadow: direction > 0
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
            ease: [0.22, 1, 0.36, 1], // natural paper settle
        },
    },
    exit: (direction: number) => ({
        rotateY: direction > 0 ? -90 : 35,
        opacity: 0,
        skewY: direction > 0 ? -2.5 : 1.5,
        scale: 0.98,
        transformOrigin: "left center",
        boxShadow: direction > 0
            ? "-30px 0 45px rgba(0,0,0,0.45)"
            : "inset 25px 0 35px -10px rgba(0,0,0,0.22)",
        filter: "brightness(0.85)",
        transition: {
            duration: 0.38,
            ease: [0.35, 0.05, 0.2, 1], // natural page peel acceleration
        },
    }),
};

export default function BookDetailRightPage({
    book,
    c0,
    c1,
    c2,
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
    const { t } = useTranslation();
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
                boxShadow: typeof window !== "undefined" && window.innerWidth >= 768 ? "inset 18px 0 28px rgba(0,0,0,0.13)" : "none",
            }}
        >
            {/* top accent strip (desktop only; mobile has the top switcher bar) */}
            <div className="hidden md:block flex-shrink-0 h-2 bg-walnut" />

            {/* ── Tab bar ─────────────────────────────────── */}
            <div
                className="flex-shrink-0 flex items-center justify-between gap-1 px-3 sm:px-4 pt-2 sm:pt-3 pb-0 border-b overflow-hidden"
                style={{ borderColor: `${c1}22` }}
            >
                {/* Horizontal scrollable tab buttons */}
                <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto hide-scrollbar scrollbar-none flex-1 pb-0.5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                handleTabChange(tab.id);
                            }}
                            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 shrink-0 whitespace-nowrap cursor-pointer"
                            style={
                                activeTab === tab.id
                                    ? {
                                          color: "#2a1a08",
                                          borderBottomColor: c1,
                                          background: "rgba(255,255,255,0.85)",
                                          boxShadow: "0 -2px 6px rgba(0,0,0,0.06)",
                                      }
                                    : {
                                          color: "#9c6d3a",
                                          borderBottomColor: "transparent",
                                          background: "transparent",
                                      }
                            }
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* action icons (Desktop only, mobile has them in the top header bar) */}
                <div className="hidden md:flex items-center gap-0.5 pb-1 shrink-0 ml-2">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(book)}
                            className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
                            title={t("bookDetail.actions.edit", "Edit")}
                            style={{ color: "#3b82f6" }}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => {
                                if (
                                    window.confirm(
                                        t(
                                            "bookDetail.confirm_delete",
                                            'Hapus "{{title}}"?',
                                            { title: book.title },
                                        ),
                                    )
                                ) {
                                    onDelete(book.id);
                                    onClose();
                                }
                            }}
                            className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                            title={t("bookDetail.actions.delete", "Hapus")}
                            style={{ color: "#ef4444" }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
                        title={t("bookDetail.actions.close", "Tutup")}
                        style={{ color: "#9ca3af" }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

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

                        {activeTab === "progress" && (
                            <div className="space-y-4">
                                {book.status === "reading" ||
                                book.status === "finished" ? (
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
                                <div className="flex flex-col items-center justify-center py-14 text-center">
                                    <BookOpen
                                        className="w-12 h-12 mb-3"
                                        style={{ color: `${c1}40` }}
                                    />
                                    <p
                                        className="text-sm"
                                        style={{ color: "#9c6d3a" }}
                                    >
                                        {t(
                                            "bookDetail.progress.start_to_see",
                                            "Mulai membaca untuk melihat progress",
                                        )}
                                    </p>
                                    {book.status === "unread" &&
                                        !showMarkAsReadDatePicker && (
                                            <div className="flex gap-3 mt-5">
                                                <button
                                                    onClick={handleStart}
                                                    disabled={
                                                        startReadingPending
                                                    }
                                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 bg-walnut"
                                                >
                                                    {t(
                                                        "bookDetail.actions.start_reading",
                                                        "Mulai Membaca",
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setShowMarkAsReadDatePicker(
                                                            true,
                                                        )
                                                    }
                                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 border-2"
                                                    style={{
                                                        color: c0,
                                                        borderColor: c0,
                                                        background:
                                                            "transparent",
                                                    }}
                                                >
                                                    {t(
                                                        "bookDetail.actions.already_read",
                                                        "Sudah Baca",
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    {book.status === "unread" &&
                                        showMarkAsReadDatePicker && (
                                            <div
                                                className="flex flex-col items-center gap-3 mt-5 p-4 rounded-xl"
                                                style={{
                                                    background:
                                                        "rgba(255,255,255,0.6)",
                                                    border: `1px solid ${c0}30`,
                                                }}
                                            >
                                                <label
                                                    className="text-sm font-medium"
                                                    style={{ color: "#2a1a08" }}
                                                >
                                                    {t(
                                                        "bookDetail.progress.choose_finish_date",
                                                        "Pilih Tanggal Selesai Dibaca:",
                                                    )}
                                                </label>
                                                <input
                                                    type="date"
                                                    value={markAsReadDate}
                                                    onChange={(e) =>
                                                        setMarkAsReadDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2"
                                                    style={{
                                                        borderColor: `${c0}40`,
                                                        color: "#2a1a08",
                                                    }}
                                                />
                                                <div className="flex gap-2 w-full mt-1">
                                                    <button
                                                        onClick={
                                                            handleMarkAsReadNow
                                                        }
                                                        disabled={
                                                            updateBookPending
                                                        }
                                                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 bg-walnut"
                                                    >
                                                        {t(
                                                            "bookDetail.actions.save",
                                                            "Simpan",
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setShowMarkAsReadDatePicker(
                                                                false,
                                                            )
                                                        }
                                                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 border border-transparent"
                                                        style={{
                                                            color: c0,
                                                            background: `${c0}15`,
                                                        }}
                                                    >
                                                        {t(
                                                            "bookDetail.actions.cancel",
                                                            "Batal",
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    )}

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

                        {activeTab === "info" && (
                            <div className="space-y-2.5">
                            {/* Note: I removed the lucide-react icons from the array definition to prevent JSX in object literal type issues if not careful, passing them directly here or letting them be defined in parent if needed. For simplicity, we inline them. */}

                            <div
                                className="flex items-center gap-3 p-3 rounded-xl"
                                style={{
                                    background: "rgba(255,255,255,0.7)",
                                    border: `1px solid ${c0}22`,
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                                }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${c0}20`, color: c1 }}
                                >
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div
                                        className="text-[10px] uppercase tracking-wider"
                                        style={{ color: "#9c6d3a" }}
                                    >
                                        {t(
                                            "bookDetail.info.publisher",
                                            "Penerbit",
                                        )}
                                    </div>
                                    <div
                                        className="text-sm font-medium truncate"
                                        style={{ color: "#2a1a08" }}
                                    >
                                        {book.publisher || "—"}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 rounded-xl"
                                style={{
                                    background: "rgba(255,255,255,0.7)",
                                    border: `1px solid ${c0}22`,
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                                }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${c0}20`, color: c1 }}
                                >
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div
                                        className="text-[10px] uppercase tracking-wider"
                                        style={{ color: "#9c6d3a" }}
                                    >
                                        {t("bookDetail.info.isbn", "ISBN")}
                                    </div>
                                    <div
                                        className="text-sm font-medium truncate font-mono"
                                        style={{ color: "#2a1a08" }}
                                    >
                                        {book.isbn || "—"}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 rounded-xl"
                                style={{
                                    background: "rgba(255,255,255,0.7)",
                                    border: `1px solid ${c0}22`,
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                                }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${c0}20`, color: c1 }}
                                >
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div
                                        className="text-[10px] uppercase tracking-wider"
                                        style={{ color: "#9c6d3a" }}
                                    >
                                        {t(
                                            "bookDetail.info.language",
                                            "Bahasa",
                                        )}
                                    </div>
                                    <div
                                        className="text-sm font-medium truncate"
                                        style={{ color: "#2a1a08" }}
                                    >
                                        {book.language || "—"}
                                    </div>
                                </div>
                            </div>

                            {(book.purchaseDate ||
                                (book.purchasePrice !== undefined &&
                                    book.purchasePrice !== null) ||
                                book.purchaseLocation ||
                                book.isGift) && (
                                <div className="mt-3">
                                    <p
                                        className="text-[10px] uppercase tracking-widest px-1 mb-2"
                                        style={{ color: "#9c6d3a" }}
                                    >
                                        {t(
                                            "bookDetail.info.purchase_info",
                                            "Informasi Pembelian",
                                        )}
                                    </p>
                                    <div
                                        className="p-3 rounded-xl space-y-2"
                                        style={{
                                            background: "#fef9ec",
                                            border: "1px solid #fcd34d66",
                                        }}
                                    >
                                        {book.purchaseDate && (
                                            <div className="flex justify-between items-center text-sm pb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag
                                                        className="w-3.5 h-3.5 flex-shrink-0"
                                                        style={{
                                                            color: "#d97706",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            color: "#9c6d3a",
                                                        }}
                                                    >
                                                        {t(
                                                            "bookDetail.info.date",
                                                            "Tanggal",
                                                        )}
                                                    </span>
                                                </div>
                                                <span
                                                    className="font-medium"
                                                    style={{ color: "#2a1a08" }}
                                                >
                                                    {new Date(
                                                        book.purchaseDate,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {book.purchaseLocation && (
                                            <div className="flex justify-between items-center text-sm pb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin
                                                        className="w-3.5 h-3.5 flex-shrink-0"
                                                        style={{
                                                            color: "#d97706",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            color: "#9c6d3a",
                                                        }}
                                                    >
                                                        {t(
                                                            "bookDetail.info.location",
                                                            "Tempat",
                                                        )}
                                                    </span>
                                                </div>
                                                <span
                                                    className="font-medium text-right max-w-[60%] truncate"
                                                    style={{ color: "#2a1a08" }}
                                                >
                                                    {book.purchaseLocation}
                                                </span>
                                            </div>
                                        )}
                                        {book.isGift ? (
                                            <div
                                                className="flex justify-between items-center pt-1.5 border-t"
                                                style={{
                                                    borderColor: "#fcd34d66",
                                                }}
                                            >
                                                <span
                                                    className="text-xs"
                                                    style={{ color: "#9c6d3a" }}
                                                >
                                                    {t(
                                                        "bookDetail.info.status",
                                                        "Status",
                                                    )}
                                                </span>
                                                <span
                                                    className="font-bold px-2 py-0.5 rounded-full bg-[#fcd34d66]"
                                                    style={{
                                                        color: "#d97706",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    🎁{" "}
                                                    {t(
                                                        "bookDetail.badges.gift",
                                                        "Hadiah",
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            book.purchasePrice !== undefined &&
                                            book.purchasePrice !== null && (
                                                <div
                                                    className="flex justify-between items-center pt-1.5 border-t"
                                                    style={{
                                                        borderColor:
                                                            "#fcd34d66",
                                                    }}
                                                >
                                                    <span
                                                        className="text-xs"
                                                        style={{
                                                            color: "#9c6d3a",
                                                        }}
                                                    >
                                                        {t(
                                                            "bookDetail.info.price",
                                                            "Harga",
                                                        )}
                                                    </span>
                                                    <span
                                                        className="font-bold"
                                                        style={{
                                                            color: "#2a1a08",
                                                        }}
                                                    >
                                                        {new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                style: "currency",
                                                                currency:
                                                                    book.purchaseCurrency ||
                                                                    "IDR",
                                                                minimumFractionDigits: 0,
                                                            },
                                                        ).format(
                                                            book.purchasePrice,
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {(book.startedDate || book.finishedDate) && (
                                <div className="mt-2">
                                    <p
                                        className="text-[10px] uppercase tracking-widest px-1 mb-2"
                                        style={{ color: "#9c6d3a" }}
                                    >
                                        {t(
                                            "bookDetail.info.reading_history",
                                            "Riwayat Membaca",
                                        )}
                                    </p>
                                    <div
                                        className="p-3 rounded-xl space-y-1.5"
                                        style={{
                                            background: "rgba(255,255,255,0.7)",
                                            border: `1px solid ${c0}22`,
                                        }}
                                    >
                                        {book.startedDate && (
                                            <div className="flex justify-between text-sm">
                                                <span
                                                    style={{ color: "#9c6d3a" }}
                                                >
                                                    {t(
                                                        "bookDetail.info.started",
                                                        "Mulai membaca",
                                                    )}
                                                </span>
                                                <span
                                                    className="font-medium"
                                                    style={{ color: "#2a1a08" }}
                                                >
                                                    {new Date(
                                                        book.startedDate,
                                                    ).toLocaleDateString(
                                                        t("locale", "id-ID"),
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {book.finishedDate && (
                                            <div className="flex justify-between text-sm">
                                                <span
                                                    style={{ color: "#9c6d3a" }}
                                                >
                                                    {t(
                                                        "bookDetail.info.finished",
                                                        "Selesai",
                                                    )}
                                                </span>
                                                <span
                                                    className="font-medium"
                                                    style={{ color: "#2a1a08" }}
                                                >
                                                    {new Date(
                                                        book.finishedDate,
                                                    ).toLocaleDateString(
                                                        t("locale", "id-ID"),
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Page footer with navigator ───────────────── */}
            <div
                className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-t select-none"
                style={{ borderColor: `${c1}18` }}
            >
                <motion.button
                    whileHover={{ scale: 1.15, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        if (tabIdx > 0) {
                            handleTabChange(tabs[tabIdx - 1].id);
                        }
                    }}
                    disabled={tabIdx === 0}
                    className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0 cursor-pointer"
                    title={t("bookDetail.actions.prev_page", "Halaman Sebelumnya")}
                >
                    <ChevronLeft
                        className="w-4 h-4"
                        style={{ color: "#9c6d3a" }}
                    />
                </motion.button>
                <span
                    className="text-xs italic inline-flex items-center gap-1.5"
                    style={{ color: `${c1}80`, fontFamily: "Georgia, serif" }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={tabIdx}
                            initial={{ y: direction > 0 ? 6 : -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: direction > 0 ? -6 : 6, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="font-bold inline-block"
                            style={{ color: "#2a1a08" }}
                        >
                            {tabIdx + 1}
                        </motion.span>
                    </AnimatePresence>
                    <span>/</span>
                    <span>{tabs.length}</span>
                </span>
                <motion.button
                    whileHover={{ scale: 1.15, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        if (tabIdx < tabs.length - 1) {
                            handleTabChange(tabs[tabIdx + 1].id);
                        }
                    }}
                    disabled={tabIdx === tabs.length - 1}
                    className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0 cursor-pointer"
                    title={t("bookDetail.actions.next_page", "Halaman Selanjutnya")}
                >
                    <ChevronRight
                        className="w-4 h-4"
                        style={{ color: "#9c6d3a" }}
                    />
                </motion.button>
            </div>
        </motion.div>
    );
}
