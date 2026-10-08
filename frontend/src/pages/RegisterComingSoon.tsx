import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    BookOpen,
    Hammer,
    ArrowLeft,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import SEO from "../components/SEO";
import LandingLanguageToggle from "../components/landing/LandingLanguageToggle";
import LandingThemeToggle from "../components/landing/LandingThemeToggle";

export default function RegisterComingSoon() {
    const { t } = useTranslation();

    return (
        <div className="h-screen w-full bg-[#f0f4f8] dark:bg-[#0a0e1a] text-[#0f172a] dark:text-[#f8fafc] font-sans flex flex-col justify-between p-4 sm:p-6 md:px-10 md:py-6 selection:bg-indigo-600 selection:text-white relative overflow-hidden select-none transition-colors duration-500">
            <SEO
                title={`${t("register_coming_soon.title", "Pendaftaran")} - A?Bookshelf`}
                description={t(
                    "register_coming_soon.subheadline",
                    "Fitur pembuatan akun baru sedang dalam tahap pengembangan.",
                )}
            />

            {/* Ambient Background Glow */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-b from-indigo-500/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-sky-500/15 dark:bg-indigo-950/40 blur-3xl pointer-events-none rounded-full" />

            {/* ── TOP HEADER BAR ── */}
            <header className="w-full max-w-5xl mx-auto flex items-center justify-between shrink-0 relative z-10">
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group transition-transform"
                >
                    <div className="w-9 h-9 rounded-xl bg-[#0f172a] dark:bg-[#131b2e] text-[#ffd166] border border-slate-700 dark:border-indigo-400/40 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-serif italic font-bold text-xl sm:text-2xl tracking-tight text-[#0f172a] dark:text-[#f8fafc]">
                        A?Bookshelf
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <LandingLanguageToggle />
                    <LandingThemeToggle />
                </div>
            </header>

            {/* ── MAIN CONTENT (CLEAN & CENTERED) ── */}
            <main className="w-full max-w-lg mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-0 relative z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full bg-white/85 dark:bg-[#0d1322]/90 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-indigo-400/20 p-6 sm:p-8 md:p-10 text-center relative overflow-hidden backdrop-blur-md"
                >
                    {/* Top Gold Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 dark:via-[#ffd166] to-transparent" />

                    {/* Subtle Vintage Texture */}
                    <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                            backgroundImage:
                                "radial-gradient(#6366f1 0.75px, transparent 0.75px)",
                            backgroundSize: "20px 20px",
                        }}
                    />

                    {/* Status Badge */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring", damping: 15 }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/15 dark:bg-indigo-500/25 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-[#ffd166] text-xs font-bold uppercase tracking-wider shadow-2xs mb-4"
                    >
                        <Hammer className="w-3.5 h-3.5" />
                        <span>{t("register_coming_soon.badge", "TAHAP PENGEMBANGAN")}</span>
                        <Sparkles className="w-3.5 h-3.5" />
                    </motion.div>

                    {/* Centered Decorative Icon */}
                    <motion.div
                        initial={{ y: 5 }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#131b2e] dark:via-[#1c2438] dark:to-[#0a0e1a] text-white flex items-center justify-center shadow-lg border-2 border-indigo-400/40 dark:border-[#38bdf8]/50"
                    >
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#ffd166] dark:text-[#38bdf8]" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0f172a] dark:text-[#f8fafc] mb-3 tracking-tight">
                        {t(
                            "register_coming_soon.headline",
                            "Pendaftaran Masih Dalam Pengembangan",
                        )}
                    </h1>

                    {/* Subheadline / Message */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-[#94a3b8] leading-relaxed max-w-md mx-auto mb-7">
                        {t(
                            "register_coming_soon.subheadline",
                            "Fitur pembuatan akun baru sedang kami persiapkan dan akan hadir pada pembaruan selanjutnya. Untuk saat ini, silakan masuk menggunakan akun yang sudah terdaftar.",
                        )}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] dark:bg-[#131b2e] dark:hover:bg-[#1e293b] text-[#f8fafc] border border-slate-700 dark:border-indigo-400/40 text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>{t("register_coming_soon.back_to_login", "Masuk ke Akun")}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-indigo-500/30 text-slate-700 dark:text-[#ffd166] hover:bg-slate-100 dark:hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{t("register_coming_soon.back_to_home", "Kembali ke Beranda")}</span>
                        </Link>
                    </div>
                </motion.div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="w-full max-w-5xl mx-auto py-2 text-center text-xs text-slate-500 dark:text-[#94a3b8] shrink-0 relative z-10">
                <p>© {new Date().getFullYear()} A?Bookshelf. Crafted with care for passionate readers.</p>
            </footer>
        </div>
    );
}
