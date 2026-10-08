import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    ArrowUpRight,
    X,
    Mail,
    Globe,
    Copy,
    Check,
    ExternalLink,
    Menu,
    BookOpen,
    ChevronLeft
} from "lucide-react";
import SEO from "../components/SEO";
import InteractiveBookDemo from "../components/landing/InteractiveBookDemo";
import LibraryAmbientParticles from "../components/landing/LibraryAmbientParticles";
import AnimeHeroHeadline from "../components/landing/AnimeHeroHeadline";
import LandingLanguageToggle from "../components/landing/LandingLanguageToggle";
import LandingThemeToggle from "../components/landing/LandingThemeToggle";

export default function LandingPage() {
    const { t } = useTranslation();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText("alfiansyahdev12@gmail.com");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <div className="h-full w-full overflow-hidden hide-scrollbar bg-[#f0f4f8] dark:bg-[#0a0e1a] text-[#0f172a] dark:text-[#f8fafc] font-sans flex flex-col justify-between p-4 pb-3 sm:p-6 md:p-10 selection:bg-indigo-600 selection:text-white relative transition-colors duration-700 ease-in-out">
            {/* ── CELESTIAL COSMIC NEBULA GLOWS (DARK MODE ONLY) ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden dark:block transition-opacity duration-1000">
                {/* Deep Cosmic Starlight Radial Glow at the Top / Center */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[480px] bg-gradient-to-b from-indigo-500/12 via-purple-600/8 to-transparent rounded-full blur-[90px]" />
                {/* Soft Violet Nebula Whispers at the Top-Right */}
                <div className="absolute top-[10%] -right-20 w-[420px] h-[420px] bg-purple-600/10 rounded-full blur-[100px]" />
                {/* Subtle Celestial Blue/Teal Nebula Starlight on Top-Left */}
                <div className="absolute top-[18%] -left-20 w-[380px] h-[380px] bg-sky-500/10 rounded-full blur-[100px]" />
                {/* Ambient Shelf Starlight Glow below books */}
                <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[800px] h-[220px] bg-gradient-to-t from-indigo-900/15 via-sky-500/10 to-transparent rounded-full blur-[80px]" />
            </div>

            {/* Cozy Floating Dust Particles (Anime.js) */}
            <LibraryAmbientParticles />

            <SEO
                title="A?Bookshelf - Abadikan Setiap Lembar Cerita & Perjalanan Membacamu"
                description="Kelola koleksi buku pribadi, lacak progres membaca, buka pencapaian, dan raih kebiasaan literasi bersama A?Bookshelf."
            />

            {/* ── TOP HEADER BAR (LOGO & ACTIONS) ── */}
            <header className="w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 py-2 gap-2">
                {/* Brand Header */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-serif italic font-bold text-xl sm:text-2xl md:text-3xl tracking-tight text-[#0f172a] dark:text-[#f8fafc] transition-colors duration-700">
                        A?Bookshelf
                    </span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Bilingual Language Switcher */}
                    <LandingLanguageToggle />

                    {/* Dark/Light Theme Toggle */}
                    <LandingThemeToggle />

                    {/* Single 3-line Menu Button with Spring 90° Bookshelf Rotation & Glow */}
                    <motion.button
                        onClick={() => setIsContactModalOpen(true)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-300 dark:border-indigo-400/40 bg-white/70 dark:bg-[#131b2e]/90 text-slate-700 dark:text-[#ffd166] hover:bg-slate-100 dark:hover:bg-[#1e293b] hover:border-indigo-400 dark:hover:border-[#ffd166] shadow-xs hover:shadow-[0_0_15px_rgba(255,209,102,0.45)] select-none transition-all duration-300 cursor-pointer group"
                        aria-label="Menu"
                        title="Menu"
                    >
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ type: "spring", stiffness: 360, damping: 20 }}
                            className="flex items-center justify-center"
                        >
                            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-[#ffd166] transition-colors" />
                        </motion.div>
                    </motion.button>
                </div>
            </header>

            {/* ── MAIN CONTENT SECTION (FULL WIDTH) ── */}
            <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col items-center text-center md:justify-center my-0 md:my-auto md:space-y-12">
                {/* HERO HEADLINE (DESKTOP) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl hidden md:block"
                >
                    <AnimeHeroHeadline />
                </motion.div>

                {/* MOBILE HEADLINE (RESPONSIVELY CENTERED IN THE SPACE BETWEEN HEADER AND BOOKSHELF) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 w-full flex flex-col items-center justify-center md:hidden text-center max-w-xs mx-auto px-4 py-2"
                >
                    {/* Animated Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                        className="font-serif italic font-bold text-2xl xs:text-[27px] text-[#0f172a] dark:text-[#f8fafc] tracking-tight leading-snug transition-colors duration-700"
                    >
                        {t("landing.mobile_title", "Abadikan Setiap Lembar Cerita")}
                    </motion.h1>

                    {/* Animated Gold Underline Divider */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
                        className="h-[2px] w-14 bg-gradient-to-r from-transparent via-indigo-500 dark:via-[#ffd166] to-transparent my-1.5 rounded-full"
                    />

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.28, ease: "easeOut" }}
                        className="text-xs text-slate-600 dark:text-[#94a3b8] font-sans opacity-90 leading-relaxed transition-colors duration-700"
                    >
                        {t("landing.mobile_subtitle", "Jelajahi koleksi editorial & kelola rak buku digitalmu")}
                    </motion.p>
                </motion.div>

                {/* STANDING SPINES SHOWCASE */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full shrink-0"
                >
                    <InteractiveBookDemo />
                </motion.div>
            </main>

            {/* FOOTER SINGLE LINE (HIDDEN ON MOBILE) */}
            <div className="w-full hidden md:flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94a3b8] shrink-0 border-t border-slate-300/60 dark:border-indigo-500/20 pt-3 transition-colors duration-700">
                <span>© {new Date().getFullYear()} A?Bookshelf. {t("landing.footer_copyright", "Side Filter Single Screen Showcase.")}</span>
                <div className="flex gap-4">
                    <button onClick={() => setIsContactModalOpen(true)} className="hover:text-[#0f172a] dark:hover:text-white underline font-medium transition-colors duration-700">
                        {t("landing.contact_dev", "Kontak Developer")}
                    </button>
                    <Link to="/dashboard" className="hover:text-[#0f172a] dark:hover:text-white underline font-bold transition-colors duration-700">
                        {t("landing.open_dashboard", "Buka App Dashboard")} ↗
                    </Link>
                </div>
            </div>

            {/* ── SIDEBAR DRAWER (REPLACES FLOATING MODAL) ── */}
            <AnimatePresence>
                {isContactModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto flex">
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsContactModalOpen(false)}
                            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                        />

                        {/* Sidebar Drawer Container (Frosted Glassmorphism Drawer) */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 280 }}
                            className="relative w-[310px] xs:w-[330px] sm:w-[360px] max-w-[85vw] h-full bg-white/85 dark:bg-[#0d1322]/90 backdrop-blur-xl text-[#0f172a] dark:text-[#f8fafc] z-10 border-r border-slate-200 dark:border-indigo-400/20 shadow-2xl flex flex-col justify-between"
                        >
                            {/* Middle Edge Vintage Leather Bookmark Close Tab */}
                            <button
                                onClick={() => setIsContactModalOpen(false)}
                                className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-12 rounded-r-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#0d1322] dark:via-[#131b2e] dark:to-[#0a0e1a] border-y border-r border-[#ffd166]/60 dark:border-[#38bdf8]/50 shadow-[3px_0_14px_rgba(15,23,42,0.25)] dark:shadow-[3px_0_18px_rgba(0,0,0,0.85)] flex items-center justify-center text-[#ffd166] hover:text-white hover:border-[#ffd166] active:scale-95 transition-all duration-200 z-30 group"
                                aria-label="Tutup Sidebar"
                                title="Tutup Menu"
                            >
                                {/* Subtle inner gold stitch line */}
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-[1.5px] bg-[#ffd166]/40 dark:bg-[#38bdf8]/40 rounded-full" />
                                <ChevronLeft className="w-4 h-4 ml-1 group-hover:-translate-x-0.5 transition-transform" />
                            </button>

                            {/* Top Subtle Gold Accent Line */}
                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ffd166] dark:via-[#38bdf8] to-transparent shrink-0 relative z-10" />

                            <div className="p-4 sm:p-5 flex-1 flex flex-col relative z-10 overflow-y-auto hide-scrollbar">
                                {/* Sidebar Top Header */}
                                <div className="flex items-center pb-3.5 mb-4 border-b border-slate-200 dark:border-indigo-500/20">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-indigo-400/30 flex items-center justify-center text-indigo-600 dark:text-[#ffd166] shadow-xs shrink-0">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif italic font-bold text-base text-[#0f172a] dark:text-[#f8fafc] leading-tight">
                                                A?Bookshelf
                                            </h2>
                                            <p className="text-[10px] text-slate-500 dark:text-[#94a3b8] font-medium tracking-wide">
                                                Personal Digital Bookshelf
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Primary App Launch Button */}
                                <div className="mb-4">
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsContactModalOpen(false)}
                                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#131b2e] dark:via-[#1c2438] dark:to-[#0f172a] text-[#f8fafc] shadow-[0_4px_16px_rgba(15,23,42,0.25)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.35)] hover:border-indigo-400/70 active:scale-[0.98] transition-all duration-300 group font-bold border border-indigo-400/40 relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 relative z-10">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-500/25 border border-indigo-400/40 flex items-center justify-center text-[#ffd166] group-hover:scale-105 group-hover:bg-indigo-500/35 transition-all shrink-0">
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <div className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 text-white">
                                                    <span>{t("landing.enter_app", "MASUK APP")}</span>
                                                    <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-mono font-medium border border-indigo-400/40">
                                                        APP
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-300 font-normal truncate mt-0.5">
                                                    {t("landing.open_dashboard", "Buka App Dashboard")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-7 h-7 rounded-lg bg-white/10 dark:bg-white/5 border border-white/15 flex items-center justify-center text-[#f8fafc] group-hover:bg-[#ffd166] group-hover:text-[#0f172a] group-hover:border-[#ffd166] transition-all shrink-0 relative z-10">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Contact & Social Links Section */}
                                <div className="space-y-2.5 mb-2">
                                    <div className="text-[10px] font-bold text-slate-600 dark:text-[#94a3b8] uppercase tracking-widest px-1 mb-1.5 flex items-center gap-2">
                                        <span>{t("landing.contact", "KONTAK")}</span>
                                        <span className="h-[1px] flex-1 bg-gradient-to-r from-slate-300 dark:from-indigo-500/25 to-transparent" />
                                    </div>

                                    {/* Email */}
                                    <div className="p-2.5 px-3 rounded-xl bg-white/80 dark:bg-[#131b2e]/70 backdrop-blur-md border border-slate-200 dark:border-indigo-500/20 flex items-center justify-between hover:bg-white dark:hover:bg-[#131b2e]/90 hover:border-slate-300 dark:hover:border-indigo-400/30 transition-all duration-200 group shadow-xs">
                                        <a
                                            href="mailto:alfiansyahdev12@gmail.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2.5 min-w-0 flex-1"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <Mail className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[11px] font-bold text-[#0f172a] dark:text-[#f8fafc] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors uppercase tracking-wider">
                                                Email
                                            </span>
                                        </a>
                                        <button
                                            onClick={handleCopyEmail}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-200 flex items-center gap-1 shrink-0 ${
                                                copiedEmail
                                                    ? "bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40"
                                                    : "bg-slate-100 dark:bg-indigo-500/20 hover:bg-slate-200 dark:hover:bg-indigo-500/30 text-slate-700 dark:text-[#ffd166] border border-slate-200 dark:border-indigo-500/30"
                                            }`}
                                            title="Salin Email"
                                        >
                                            {copiedEmail ? (
                                                <>
                                                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                    <span>Tersalin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Medium */}
                                    <a
                                        href="https://medium.com/@putraalfiansyahp0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 px-3 rounded-xl bg-white/80 dark:bg-[#131b2e]/70 backdrop-blur-md border border-slate-200 dark:border-indigo-500/20 flex items-center justify-between hover:bg-white dark:hover:bg-[#131b2e]/90 hover:border-slate-300 dark:hover:border-indigo-400/30 transition-all duration-200 group shadow-xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                                                </svg>
                                            </div>
                                            <span className="text-[11px] font-bold text-[#0f172a] dark:text-[#f8fafc] group-hover:text-black dark:group-hover:text-white transition-colors uppercase tracking-wider">
                                                Medium
                                            </span>
                                        </div>
                                        <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-indigo-500/15 flex items-center justify-center text-slate-700 dark:text-[#ffd166] group-hover:text-black dark:group-hover:text-white transition-all shrink-0">
                                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </a>

                                    {/* Substack */}
                                    <a
                                        href="https://substack.com/@altraln"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 px-3 rounded-xl bg-white/80 dark:bg-[#131b2e]/70 backdrop-blur-md border border-slate-200 dark:border-indigo-500/20 flex items-center justify-between hover:bg-white dark:hover:bg-[#131b2e]/90 hover:border-slate-300 dark:hover:border-indigo-400/30 transition-all duration-200 group shadow-xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6719] to-[#E05300] text-white shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                                                </svg>
                                            </div>
                                            <span className="text-[11px] font-bold text-[#0f172a] dark:text-[#f8fafc] group-hover:text-[#FF6719] dark:group-hover:text-[#FF823E] transition-colors uppercase tracking-wider">
                                                Substack
                                            </span>
                                        </div>
                                        <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-indigo-500/15 flex items-center justify-center text-slate-700 dark:text-[#ffd166] group-hover:text-[#FF6719] dark:group-hover:text-[#FF823E] transition-all shrink-0">
                                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Sidebar Footer Section (Creator Profile & Note Seamlessly at Bottom) */}
                            <div className="p-4 pt-3 border-t border-slate-200 dark:border-indigo-500/20 bg-slate-50/70 dark:bg-[#070b14]/75 backdrop-blur-md relative z-10 flex flex-col gap-2">
                                {/* Creator Profile (Seamless, No Card Box) */}
                                <div className="flex items-center gap-2.5 px-0.5">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#131b2e] dark:via-[#1c2438] dark:to-[#0a0e1a] text-white shadow-xs border border-[#ffd166]/40 dark:border-[#38bdf8]/50 flex items-center justify-center font-serif font-bold text-[11px] tracking-wider shrink-0">
                                        A?
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-serif italic text-xs font-bold text-[#0f172a] dark:text-[#f8fafc] leading-tight">
                                                Alfiansyah
                                            </h3>
                                            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-700 dark:text-[#ffd166] text-[8px] font-bold tracking-widest uppercase border border-indigo-200 dark:border-indigo-500/40">
                                                Creator
                                            </span>
                                        </div>
                                        <p className="text-[9.5px] text-slate-500 dark:text-[#94a3b8] font-medium truncate">
                                            Developer of A?Bookshelf
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Quote Note */}
                                <p className="text-center text-[10px] text-slate-500 dark:text-[#94a3b8] leading-relaxed italic font-serif px-0.5">
                                    Silakan hubungi untuk saran, diskusi, atau kolaborasi seputar A?Bookshelf.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
