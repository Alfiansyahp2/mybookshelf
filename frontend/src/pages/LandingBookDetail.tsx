import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    X,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    ArrowLeft
} from "lucide-react";
import SEO from "../components/SEO";
import { DEMO_EDITORIAL_BOOKS, type EditorialBook } from "../components/landing/InteractiveBookDemo";

export default function LandingBookDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [books] = useState<EditorialBook[]>(DEMO_EDITORIAL_BOOKS);
    const bookIndex = books.findIndex((b) => b.id === id);
    const currentBook = books[bookIndex] || books[0];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handlePrev = () => {
        if (bookIndex > 0) {
            navigate(`/landing/book/${books[bookIndex - 1].id}`);
        }
    };

    const handleNext = () => {
        if (bookIndex >= 0 && bookIndex < books.length - 1) {
            navigate(`/landing/book/${books[bookIndex + 1].id}`);
        }
    };

    if (!currentBook) return null;

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#f8f5f0] text-[#4a3b2f] font-sans flex flex-col justify-between p-6 sm:p-10 relative selection:bg-[#7a5c42] selection:text-white">
            <SEO
                title={`${currentBook.title} - ${currentBook.author} | MyBookshelf`}
                description={currentBook.synopsis}
            />

            {/* ── TOP HEADER BAR ── */}
            <header className="w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 py-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#7a5c42]/30 text-xs font-bold text-[#7a5c42] hover:bg-[#7a5c42]/10 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>KEMBALI KE LANDING</span>
                    </button>
                    <span className="font-serif italic font-bold text-2xl sm:text-3xl tracking-tight text-[#4a3b2f] hidden sm:inline-block">
                        MyBookshelf
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#4a3b2f] hover:bg-[#3a2d23] text-[#f8f5f0] text-xs font-bold shadow-md transition-all"
                    >
                        <span>MASUK APP</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full hover:bg-black/10 transition-colors text-[#4a3b2f]"
                        title="Tutup"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* ── MAIN EDITORIAL CONTENT (NO CARD BOX) ── */}
            <main className="my-auto w-full max-w-6xl mx-auto flex-1 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 py-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBook.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                        className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16"
                    >
                        {/* LEFT COLUMN: 3D COVER ART */}
                        <div className="w-full md:w-5/12 flex items-center justify-center shrink-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className={`w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4.4] rounded-r-2xl rounded-l-xs bg-gradient-to-tr ${currentBook.coverGradient} shadow-2xl p-8 text-[#f8f5f0] flex flex-col justify-between border-r-4 border-b-4 border-black/40 relative overflow-hidden`}
                            >
                                {/* Spine crease highlight */}
                                <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/40 via-white/10 to-transparent" />

                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 border border-white/20 px-2.5 py-1 rounded-full w-fit">
                                    {currentBook.category.split(",")[0]}
                                </span>

                                <div className="my-auto py-6">
                                    <h3 className="font-serif font-bold text-2xl sm:text-3xl leading-tight text-[#f8f5f0] drop-shadow-md">
                                        {currentBook.title}
                                    </h3>
                                    <p className="text-sm text-[#f8f5f0]/85 font-medium mt-3">
                                        {currentBook.author}
                                    </p>
                                </div>

                                <div className="text-xs font-semibold text-[#f8f5f0]/75 flex justify-between border-t border-white/20 pt-3">
                                    <span>{currentBook.year}</span>
                                    <span>{currentBook.pages} Hal</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN: EDITORIAL DETAILS & SYNOPSIS */}
                        <div className="w-full md:w-7/12 flex flex-col justify-between text-left space-y-5">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#7a5c42] block mb-1">
                                    {currentBook.author}
                                </span>

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
                                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#e8e0d5]/40 border-l-4 border-[#7a5c42] text-sm sm:text-base font-serif italic text-[#4a3b2f] leading-relaxed shadow-xs">
                                    "{currentBook.personalQuote}"
                                </div>

                                {/* Synopsis */}
                                <div className="mt-6 text-sm sm:text-base text-[#4a3b2f]/90 leading-relaxed font-sans max-w-2xl">
                                    <p>{currentBook.synopsis}</p>
                                </div>
                            </div>

                            {/* Footer Controls & Pagination */}
                            <div className="pt-6 border-t border-[#7a5c42]/20 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrev}
                                        disabled={bookIndex <= 0}
                                        className="p-2.5 rounded-full border border-[#7a5c42]/20 hover:bg-[#7a5c42]/10 text-[#4a3b2f] disabled:opacity-30 transition-colors"
                                        title="Buku Sebelumnya"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={bookIndex >= books.length - 1}
                                        className="p-2.5 rounded-full border border-[#7a5c42]/20 hover:bg-[#7a5c42]/10 text-[#4a3b2f] disabled:opacity-30 transition-colors"
                                        title="Buku Selanjutnya"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <span className="text-xs text-[#7a5c42] font-bold ml-2">
                                        {bookIndex + 1} / {books.length}
                                    </span>
                                </div>

                                <Link
                                    to="/dashboard"
                                    className="px-6 py-2.5 rounded-full bg-[#4a3b2f] hover:bg-[#3a2d23] text-[#f8f5f0] text-xs font-bold shadow-md transition-all flex items-center gap-2"
                                >
                                    <span>Buka di App Dashboard</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* FOOTER SINGLE LINE */}
            <footer className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] text-[#7a5c42] shrink-0 border-t border-[#7a5c42]/15 pt-3">
                <span>© {new Date().getFullYear()} MyBookshelf. Editorial Showcase.</span>
                <Link to="/dashboard" className="hover:text-[#4a3b2f] underline font-bold">
                    Buka App Dashboard ↗
                </Link>
            </footer>
        </div>
    );
}
