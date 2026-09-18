import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUpRight,
    X,
    Mail,
    Globe,
    Copy,
    Check,
    ExternalLink,
    User
} from "lucide-react";
import SEO from "../components/SEO";
import InteractiveBookDemo from "../components/landing/InteractiveBookDemo";
import LibraryAmbientParticles from "../components/landing/LibraryAmbientParticles";
import AnimeHeroHeadline from "../components/landing/AnimeHeroHeadline";

export default function LandingPage() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText("alfiansyahdev12@gmail.com");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#f8f5f0] text-[#4a3b2f] font-sans flex flex-col justify-between p-6 sm:p-10 selection:bg-[#7a5c42] selection:text-white relative">
            {/* Cozy Floating Dust Particles (Anime.js) */}
            <LibraryAmbientParticles />

            <SEO
                title="A?Bookshelf - Abadikan Setiap Lembar Cerita & Perjalanan Membacamu"
                description="Kelola koleksi buku pribadi, lacak progres membaca, buka pencapaian, dan raih kebiasaan literasi bersama A?Bookshelf."
            />

            {/* ── TOP HEADER BAR (LOGO & ACTIONS) ── */}
            <header className="w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 py-2">
                {/* Brand Header */}
                <div className="flex items-center gap-3">
                    <span className="font-serif italic font-bold text-2xl sm:text-3xl tracking-tight text-[#4a3b2f]">
                        A?Bookshelf
                    </span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#7a5c42]/30 text-xs font-bold text-[#7a5c42] hover:bg-[#7a5c42]/10 transition-colors"
                    >
                        <User className="w-3.5 h-3.5 text-[#7a5c42]" />
                        <span>KONTAK</span>
                    </button>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#4a3b2f] hover:bg-[#3a2d23] text-[#f8f5f0] text-xs font-bold shadow-md transition-all"
                    >
                        <span>MASUK APP</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* ── MAIN CONTENT SECTION (FULL WIDTH) ── */}
            <main className="my-auto w-full max-w-6xl mx-auto flex flex-col items-center text-center justify-center space-y-8 sm:space-y-12">
                {/* HERO HEADLINE (ANIMATED WITH ANIME.JS) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl"
                >
                    <AnimeHeroHeadline />
                </motion.div>

                {/* STANDING SPINES SHOWCASE */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full"
                >
                    <InteractiveBookDemo />
                </motion.div>
            </main>

            {/* FOOTER SINGLE LINE */}
            <div className="w-full flex items-center justify-between text-[11px] text-[#7a5c42] shrink-0 border-t border-[#7a5c42]/15 pt-3">
                <span>© {new Date().getFullYear()} A?Bookshelf. Side Filter Single Screen Showcase.</span>
                <div className="flex gap-4">
                    <button onClick={() => setIsContactModalOpen(true)} className="hover:text-[#4a3b2f] underline font-medium">
                        Kontak Developer
                    </button>
                    <Link to="/dashboard" className="hover:text-[#4a3b2f] underline font-bold">
                        Buka App Dashboard ↗
                    </Link>
                </div>
            </div>

            {/* CONTACT DEVELOPER MODAL */}
            <AnimatePresence>
                {isContactModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsContactModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 14 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 14 }}
                            transition={{ type: "spring", damping: 25, stiffness: 280 }}
                            className="relative w-full max-w-md bg-[#f5ecd7] text-[#4a3b2f] rounded-3xl shadow-2xl z-10 border border-[#7a5c42]/25 overflow-hidden"
                        >
                            {/* Top Gold/Walnut Accent Bar */}
                            <div className="h-1.5 w-full bg-gradient-to-r from-[#4a3b2f] via-[#d4a574] to-[#4a3b2f]" />

                            <div className="p-6 sm:p-7">
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsContactModalOpen(false)}
                                    className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 transition-colors text-[#7a5c42]"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Header Profile */}
                                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#7a5c42]/15">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4a3b2f] via-[#5c4532] to-[#2c1a0e] text-[#f8f5f0] shadow-lg border border-[#d4a574]/40 flex items-center justify-center font-bold text-xl tracking-wider ring-4 ring-[#4a3b2f]/5 shrink-0">
                                        A?
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-serif italic text-xl font-bold text-[#4a3b2f] leading-tight">
                                                A?
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#7a5c42]/12 text-[#7a5c42] text-[10px] font-bold tracking-wider uppercase border border-[#7a5c42]/20">
                                                Creator
                                            </span>
                                            <span className="text-xs text-[#7a5c42]/80 font-medium">
                                                Developer of A?Bookshelf
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Links Stack */}
                                <div className="space-y-3">
                                    {/* Email */}
                                    <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#7a5c42]/15 flex items-center justify-between hover:bg-white hover:border-[#7a5c42]/30 hover:shadow-md transition-all duration-300 group">
                                        <a
                                            href="mailto:alfiansyahdev12@gmail.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3.5 min-w-0 flex-1"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-sm flex items-center justify-center shrink-0">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] uppercase font-bold text-[#7a5c42]/70 tracking-wider">Email</p>
                                                {/* <p className="text-xs font-bold text-[#4a3b2f] truncate group-hover:text-red-700 transition-colors">alfiansyahdev12@gmail.com</p> */}
                                            </div>
                                        </a>
                                        <button
                                            onClick={handleCopyEmail}
                                            className={`ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${copiedEmail
                                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                                : "bg-[#7a5c42]/10 hover:bg-[#7a5c42] hover:text-white text-[#7a5c42]"
                                                }`}
                                            title="Salin Email"
                                        >
                                            {copiedEmail ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Tersalin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    {/* <span>Salin</span> */}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* LinkedIn */}
                                    <a
                                        href="https://linkedin.com/in/alfiansyahpp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#7a5c42]/15 flex items-center justify-between hover:bg-white hover:border-[#7a5c42]/30 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] uppercase font-bold text-[#7a5c42]/70 tracking-wider">LinkedIn</p>
                                                {/* <p className="text-xs font-bold text-[#4a3b2f] truncate group-hover:text-blue-700 transition-colors">linkedin.com/in/alfiansyahpp</p> */}
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-[#7a5c42]/50 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                                    </a>

                                    {/* GitHub */}
                                    <a
                                        href="https://github.com/Alfiansyahp2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#7a5c42]/15 flex items-center justify-between hover:bg-white hover:border-[#7a5c42]/30 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-sm flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] uppercase font-bold text-[#7a5c42]/70 tracking-wider">GitHub</p>
                                                {/* <p className="text-xs font-bold text-[#4a3b2f] truncate group-hover:text-zinc-900 transition-colors">github.com/Alfiansyahp2</p> */}
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-[#7a5c42]/50 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                                    </a>

                                    {/* Website / Portfolio */}
                                    <a
                                        href="https://alfiansyahpp.vercel.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#7a5c42]/15 flex items-center justify-between hover:bg-white hover:border-[#7a5c42]/30 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm flex items-center justify-center shrink-0">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] uppercase font-bold text-[#7a5c42]/70 tracking-wider">Portofolio / Website</p>
                                                {/* <p className="text-xs font-bold text-[#4a3b2f] truncate group-hover:text-amber-800 transition-colors">alfiansyahpp.vercel.app</p> */}
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-[#7a5c42]/50 group-hover:text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                                    </a>
                                </div>

                                {/* Footer Note */}
                                <p className="text-center text-[11px] text-[#7a5c42]/80 mt-5 pt-3.5 border-t border-[#7a5c42]/15 italic">
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
