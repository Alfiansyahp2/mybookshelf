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
        <div className="h-screen w-full bg-[#f8f5f0] dark:bg-[#180f0a] text-[#4a3b2f] dark:text-[#f5ece3] font-sans flex flex-col justify-between p-4 sm:p-6 md:px-10 md:py-6 selection:bg-[#7a5c42] selection:text-white relative overflow-hidden select-none transition-colors duration-500">
            <SEO
                title={`${t("register_coming_soon.title", "Pendaftaran")} - A?Bookshelf`}
                description={t(
                    "register_coming_soon.subheadline",
                    "Fitur pembuatan akun baru sedang dalam tahap pengembangan.",
                )}
            />

            {/* Ambient Background Glow */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-b from-[#d4a574]/20 via-[#7a5c42]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-[#d4a574]/15 dark:bg-[#3e281b]/30 blur-3xl pointer-events-none rounded-full" />

            {/* ── TOP HEADER BAR ── */}
            <header className="w-full max-w-5xl mx-auto flex items-center justify-between shrink-0 relative z-10">
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group transition-transform"
                >
                    <div className="w-9 h-9 rounded-xl bg-walnut text-[#f8f5f0] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-serif italic font-bold text-xl sm:text-2xl tracking-tight text-[#4a3b2f] dark:text-[#f5ece3]">
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
                    className="w-full bg-[#fdfbf7] dark:bg-[#20140e] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#7a5c42]/20 dark:border-[#d4a574]/25 p-6 sm:p-8 md:p-10 text-center relative overflow-hidden backdrop-blur-md"
                >
                    {/* Top Gold Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7a5c42] via-[#d4a574] to-[#7a5c42]" />

                    {/* Subtle Vintage Texture */}
                    <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                            backgroundImage:
                                "radial-gradient(#7a5c42 0.75px, transparent 0.75px)",
                            backgroundSize: "20px 20px",
                        }}
                    />

                    {/* Status Badge */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring", damping: 15 }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#d4a574]/20 dark:bg-[#d4a574]/15 border border-[#d4a574]/50 text-[#7a5c42] dark:text-[#e5b882] text-xs font-bold uppercase tracking-wider shadow-2xs mb-4"
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
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#7a5c42] via-[#5c4532] to-[#3a281c] text-[#f8f5f0] flex items-center justify-center shadow-lg border-2 border-[#d4a574]/40"
                    >
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4a574]" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#4a3b2f] dark:text-[#f5ece3] mb-3 tracking-tight">
                        {t(
                            "register_coming_soon.headline",
                            "Pendaftaran Masih Dalam Pengembangan",
                        )}
                    </h1>

                    {/* Subheadline / Message */}
                    <p className="text-sm sm:text-base text-[#7a5c42] dark:text-[#c9ab91] leading-relaxed max-w-md mx-auto mb-7">
                        {t(
                            "register_coming_soon.subheadline",
                            "Fitur pembuatan akun baru sedang kami persiapkan dan akan hadir pada pembaruan selanjutnya. Untuk saat ini, silakan masuk menggunakan akun yang sudah terdaftar.",
                        )}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4a3b2f] hover:bg-[#3a2d23] text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>{t("register_coming_soon.back_to_login", "Masuk ke Akun")}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#7a5c42]/30 dark:border-[#d4a574]/40 text-[#7a5c42] dark:text-[#e5b882] hover:bg-[#7a5c42]/10 dark:hover:bg-[#d4a574]/10 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{t("register_coming_soon.back_to_home", "Kembali ke Beranda")}</span>
                        </Link>
                    </div>
                </motion.div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="w-full max-w-5xl mx-auto py-2 text-center text-xs text-[#7a5c42]/70 dark:text-[#c9ab91]/60 shrink-0 relative z-10">
                <p>© {new Date().getFullYear()} A?Bookshelf. Crafted with care for passionate readers.</p>
            </footer>
        </div>
    );
}
