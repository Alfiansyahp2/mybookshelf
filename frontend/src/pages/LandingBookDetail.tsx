import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    X,
    ArrowUpRight,
    BookOpen
} from "lucide-react";
import SEO from "../components/SEO";
import { DEMO_EDITORIAL_BOOKS, type EditorialBook } from "../components/landing/InteractiveBookDemo";
import DemoBookDetailModal from "../components/modals/DemoBookDetailModal";
import type { Book } from "../types";

export default function LandingBookDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [books] = useState<EditorialBook[]>(DEMO_EDITORIAL_BOOKS);
    const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
    const [coverImgError, setCoverImgError] = useState(false);
    const [direction, setDirection] = useState<number>(1);

    const bookIndex = books.findIndex((b) => b.id === id);
    const currentBook = books[bookIndex] || books[0];

    useEffect(() => {
        window.scrollTo(0, 0);
        setCoverImgError(false);
    }, [id]);

    const navigateToBook = (newIndex: number) => {
        if (newIndex === bookIndex || newIndex < 0 || newIndex >= books.length) return;
        setDirection(newIndex > bookIndex ? 1 : -1);
        navigate(`/landing/book/${books[newIndex].id}`);
    };

    // Handle Keyboard Arrow & Mouse Wheel Scroll Navigation
    useEffect(() => {
        let lastWheelTime = 0;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isReaderModalOpen) return;
            if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "ArrowUp") {
                if (bookIndex > 0) navigateToBook(bookIndex - 1);
            } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === "ArrowDown") {
                if (bookIndex < books.length - 1) navigateToBook(bookIndex + 1);
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (isReaderModalOpen) return;
            const now = Date.now();
            if (now - lastWheelTime < 450) return;

            if (e.deltaY > 15 || e.deltaX > 15) {
                if (bookIndex < books.length - 1) {
                    lastWheelTime = now;
                    navigateToBook(bookIndex + 1);
                }
            } else if (e.deltaY < -15 || e.deltaX < -15) {
                if (bookIndex > 0) {
                    lastWheelTime = now;
                    navigateToBook(bookIndex - 1);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        };
    }, [bookIndex, books, isReaderModalOpen]);

    if (!currentBook) return null;

    // Smooth page transitions variants
    const pageVariants = {
        initial: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? 50 : -50,
            filter: "blur(6px)",
            scale: 0.98
        }),
        animate: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                duration: 0.35,
                ease: [0.25, 1, 0.5, 1]
            }
        },
        exit: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? -50 : 50,
            filter: "blur(6px)",
            scale: 0.98,
            transition: {
                duration: 0.25,
                ease: [0.5, 0, 0.75, 0]
            }
        })
    };

    const coverVariants = {
        initial: (dir: number) => ({
            rotateY: dir > 0 ? 20 : -20,
            scale: 0.9,
            opacity: 0
        }),
        animate: {
            rotateY: 0,
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 24,
                stiffness: 220,
                delay: 0.05
            }
        },
        exit: (dir: number) => ({
            rotateY: dir > 0 ? -20 : 20,
            scale: 0.9,
            opacity: 0,
            transition: { duration: 0.2 }
        })
    };

    // Convert EditorialBook to full Book model for 2-page Reader Modal
    const fullBook: Book = {
        id: currentBook.id,
        title: currentBook.title,
        author: currentBook.author,
        isbn: "978-602-06-1234-5",
        genre: currentBook.category,
        language: currentBook.language,
        publisher: "Gramedia / Editorial Demo",
        publishYear: currentBook.year,
        pages: currentBook.pages,
        format: "paperback",
        spineColors: [currentBook.c0, currentBook.c1, currentBook.c2],
        height: "medium",
        thickness: "regular",
        coverImage: currentBook.coverImage,
        status: currentBook.status === "Finished" ? "finished" : currentBook.status === "Reading" ? "reading" : "wishlist",
        favorite: true,
        isFavorite: true,
        currentPage: currentBook.status === "Finished" ? currentBook.pages : Math.round(currentBook.pages * 0.4),
        progress: currentBook.status === "Finished" ? 100 : 40,
        startedDate: "2026-07-04",
        finishedDate: currentBook.status === "Finished" ? "2026-07-04" : undefined,
        readDates: ["2026-07-04"],
        personalNotes: currentBook.synopsis,
        personalRating: currentBook.rating,
        dateAdded: "2026-01-01",
        lastModified: "2026-09-19"
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#f8f5f0] text-[#4a3b2f] font-sans flex flex-col justify-between p-6 sm:p-10 relative selection:bg-[#7a5c42] selection:text-white">
            <SEO
                title={`${currentBook.title} - ${currentBook.author} | A?Bookshelf`}
                description={currentBook.synopsis}
            />

            {/* Dynamic Subtle Ambient Glow */}
            <motion.div
                key={`glow-${currentBook.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: `radial-gradient(circle at 35% 50%, ${currentBook.c1} 0%, transparent 65%)`
                }}
            />

            {/* ── TOP HEADER BAR ── */}
            <header className="w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 py-2 relative z-10">
                <div className="flex items-center gap-4">
                    <span className="font-serif italic font-bold text-2xl sm:text-3xl tracking-tight text-[#4a3b2f]">
                        A?Bookshelf
                    </span>
                    <span className="text-xs font-semibold text-[#7a5c42]/60 hidden sm:inline-block border-l border-[#7a5c42]/20 pl-4 py-0.5">
                        Koleksi Kurasi Demo
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2.5 rounded-full hover:bg-black/5 active:scale-95 transition-all text-[#4a3b2f] flex items-center gap-1.5 font-bold text-xs"
                        title="Tutup Editorial Showcase"
                    >
                        <X className="w-5 h-5" />
                        {/* <span className="hidden sm:inline">Tutup</span> */}
                    </button>
                </div>
            </header>

            {/* ── MAIN EDITORIAL CONTENT ── */}
            <main className="my-auto w-full max-w-6xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 py-4 relative z-10">
                {/* ── LEFT VERTICAL DASH SCROLL BAR ── */}
                <div className="hidden lg:flex flex-col items-center justify-center gap-3 shrink-0 py-4 pr-6 border-r border-[#7a5c42]/15 my-auto select-none">
                    <div className="flex flex-col items-center gap-2.5">
                        {books.map((b, idx) => {
                            const isActive = idx === bookIndex;
                            return (
                                <button
                                    key={b.id}
                                    onClick={() => navigateToBook(idx)}
                                    className="relative group py-1 focus:outline-none flex items-center justify-center min-h-[18px]"
                                    title={`${idx + 1}. ${b.title}`}
                                >
                                    {isActive ? (
                                        <motion.div
                                            layoutId="activeDashIndicator"
                                            className="w-7 h-1.5 bg-[#2554c7] rounded-full shadow-xs"
                                            transition={{ type: "spring", damping: 26, stiffness: 320 }}
                                        />
                                    ) : (
                                        <div className="w-5 h-1 bg-[#adb9c9] group-hover:bg-[#2554c7]/70 group-hover:w-6 rounded-full transition-all duration-300" />
                                    )}

                                    {/* Hover Tooltip */}
                                    <span className="absolute left-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#4a3b2f] text-[#f8f5f0] text-[11px] font-medium py-1 px-2.5 rounded-md whitespace-nowrap shadow-md pointer-events-none z-30">
                                        {idx + 1}. {b.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* SLIDER WRAPPER WITH DRAG / SWIPE SUPPORT */}
                <div className="w-full flex-1 flex items-center justify-center relative">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentBook.id}
                            custom={direction}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.15}
                            onDragEnd={(_, { offset }) => {
                                if (offset.x < -60 && bookIndex < books.length - 1) {
                                    navigateToBook(bookIndex + 1);
                                } else if (offset.x > 60 && bookIndex > 0) {
                                    navigateToBook(bookIndex - 1);
                                }
                            }}
                            className="w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-14 px-8 sm:px-12"
                        >
                            {/* LEFT COLUMN: 3D COVER ART */}
                            <div className="w-full md:w-5/12 flex items-center justify-center shrink-0 perspective-1000">
                                <motion.div
                                    custom={direction}
                                    variants={coverVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    whileHover={{ scale: 1.03, y: -4, rotateY: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsReaderModalOpen(true)}
                                    className={`w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4.4] rounded-r-2xl rounded-l-xs bg-gradient-to-tr ${currentBook.coverGradient} shadow-2xl p-6 text-[#f8f5f0] flex flex-col justify-between border-r-4 border-b-4 border-black/40 relative overflow-hidden cursor-pointer group transition-shadow duration-300 hover:shadow-3xl`}
                                >
                                    {/* Cover Image background if available */}
                                    {currentBook.coverImage && !coverImgError ? (
                                        <img
                                            src={currentBook.coverImage}
                                            alt={currentBook.title}
                                            onError={() => setCoverImgError(true)}
                                            className="absolute inset-0 w-full h-full object-cover z-0"
                                        />
                                    ) : (
                                        <>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 border border-white/20 px-2.5 py-1 rounded-full w-fit relative z-1">
                                                {currentBook.category.split(",")[0]}
                                            </span>

                                            <div className="my-auto py-6 relative z-1">
                                                <h3 className="font-serif font-bold text-2xl sm:text-3xl leading-tight text-[#f8f5f0] drop-shadow-md">
                                                    {currentBook.title}
                                                </h3>
                                                <p className="text-sm text-[#f8f5f0]/85 font-medium mt-3">
                                                    {currentBook.author}
                                                </p>
                                            </div>

                                            <div className="text-xs font-semibold text-[#f8f5f0]/75 flex justify-between border-t border-white/20 pt-3 relative z-1">
                                                <span>{currentBook.year}</span>
                                                <span>{currentBook.pages} Hal</span>
                                            </div>
                                        </>
                                    )}

                                    {/* Spine crease highlight overlay */}
                                    <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/50 via-white/10 to-transparent z-10 pointer-events-none" />

                                    {/* Click hint overlay badge */}
                                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20 backdrop-blur-[2px]">
                                        <span className="px-4 py-2 rounded-full bg-[#f5ecd7] text-[#4a3b2f] text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <BookOpen className="w-4 h-4" />
                                            <span>Buka Reader View</span>
                                        </span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* RIGHT COLUMN: EDITORIAL DETAILS & SYNOPSIS */}
                            <div className="w-full md:w-7/12 flex flex-col justify-between text-left space-y-5">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#7a5c42]">
                                            {currentBook.author}
                                        </span>
                                        <span className="text-xs font-serif italic text-[#7a5c42]/70 font-semibold">
                                            {String(bookIndex + 1).padStart(2, "0")} / {String(books.length).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <h1 className="font-serif italic font-bold text-4xl sm:text-6xl text-[#4a3b2f] leading-none tracking-tight">
                                        {currentBook.title}
                                    </h1>

                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#7a5c42] font-medium">
                                        <span>{currentBook.category}</span>
                                        <span>•</span>
                                        <span>{currentBook.pages} pages</span>
                                        <span>•</span>
                                        <span>{currentBook.year}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-[#d4a574] font-bold">
                                            <Star className="w-4 h-4 fill-[#d4a574] text-[#d4a574]" />
                                            {currentBook.rating.toFixed(1)}
                                        </span>
                                    </div>

                                    {/* Personal Quote Callout Box */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.3 }}
                                        className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#e8e0d5]/40 border-l-4 border-[#7a5c42] text-sm sm:text-base font-serif italic text-[#4a3b2f] leading-relaxed shadow-xs"
                                    >
                                        "{currentBook.personalQuote}"
                                    </motion.div>

                                    {/* Synopsis */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, duration: 0.3 }}
                                        className="mt-6 text-sm sm:text-base text-[#4a3b2f]/90 leading-relaxed font-sans max-w-2xl"
                                    >
                                        <p>{currentBook.synopsis}</p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* FOOTER SINGLE LINE */}
            <footer className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] text-[#7a5c42] shrink-0 border-t border-[#7a5c42]/15 pt-3 relative z-10">
                <span>© {new Date().getFullYear()} A?Bookshelf. Editorial Showcase.</span>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline text-[#7a5c42]/60">Gunakan scroll mouse untuk berpindah</span>
                    <Link to="/dashboard" className="hover:text-[#4a3b2f] underline font-bold flex items-center gap-1">
                        <span>Buka App Dashboard</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </footer>

            {/* DEMO 2-PAGE READER BOOK DETAIL MODAL */}
            <DemoBookDetailModal
                book={fullBook}
                isOpen={isReaderModalOpen}
                onClose={() => setIsReaderModalOpen(false)}
            />
        </div>
    );
}

