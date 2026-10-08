import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLogin, useAuthUser } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { BookOpen } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import AuthDecoration from "../components/auth/AuthDecoration";
import AuthLeftPage from "../components/auth/AuthLeftPage";
import SEO from "../components/SEO";
import LandingLanguageToggle from "../components/landing/LandingLanguageToggle";
import LandingThemeToggle from "../components/landing/LandingThemeToggle";

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const login = useLogin();
    const { data: user } = useAuthUser();
    const addNotification = useNotifications((state) => state.addNotification);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const isLogin = true;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        login.mutate(
            { email: formData.email, password: formData.password },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        navigate("/dashboard", { replace: true });
                    }, 100);
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response?.data?.message ||
                        error.message ||
                        "Unknown error";
                    addNotification({
                        title: t("login.failed", "Login failed"),
                        message: errorMessage,
                        type: "warning",
                    });
                },
            },
        );
    };

    const isLoading = login.isPending;

    return (
        <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#0a0e1a] text-[#0f172a] dark:text-[#f8fafc] font-sans flex flex-col justify-between p-4 sm:p-6 md:px-10 md:py-6 selection:bg-indigo-600 selection:text-white relative overflow-hidden select-none transition-colors duration-500">
            <SEO title={t("navigation.login", "Login")} />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-indigo-500/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] bg-sky-500/15 dark:bg-indigo-950/40 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute top-[20%] left-[-10%] w-[380px] h-[380px] bg-purple-600/10 dark:bg-indigo-900/20 blur-3xl pointer-events-none rounded-full" />

            {/* Top Header Bar */}
            <header className="w-full max-w-4xl mx-auto flex items-center justify-between shrink-0 relative z-20 mb-2 sm:mb-4">
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group transition-transform"
                >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0f172a] dark:bg-[#131b2e] text-[#ffd166] border border-slate-700 dark:border-indigo-400/40 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="font-serif italic font-bold text-lg sm:text-2xl tracking-tight text-[#0f172a] dark:text-[#f8fafc]">
                        A?Bookshelf
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <LandingLanguageToggle />
                    <LandingThemeToggle />
                </div>
            </header>

            {/* Extracted Cosmic Decoration */}
            <AuthDecoration isLogin={isLogin} />

            {/* 3D Open Book Container */}
            <main className="w-full max-w-sm sm:max-w-md md:max-w-4xl flex-1 flex flex-col items-center justify-center relative z-10 mx-auto my-auto py-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="login-book"
                        initial={{ opacity: 0, scale: 0.92, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -18 }}
                        transition={{ duration: 0.5, type: "spring", damping: 22 }}
                        className="w-full min-h-[490px] md:h-[580px] relative"
                        style={{ perspective: "2000px" }}
                    >
                        {/* Hardcover Cosmic Titanium Backing */}
                        <div
                            className="absolute inset-[-6px] sm:inset-[-12px] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#0d1322] dark:via-[#151c2e] dark:to-[#0a0e1a] rounded-2xl border-2 border-indigo-400/35 dark:border-[#38bdf8]/40 shadow-2xl"
                            style={{
                                boxShadow:
                                    "0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 2px 10px rgba(0,0,0,0.5)",
                            }}
                        />

                        {/* Pages Container */}
                        <div
                            className="relative md:absolute inset-0 flex flex-col md:flex-row bg-white dark:bg-[#0d1322] rounded-xl shadow-inner overflow-hidden min-h-[480px] border border-slate-200 dark:border-indigo-500/20"
                            style={{
                                boxShadow:
                                    "inset 0 0 0 1px rgba(99, 102, 241, 0.15)",
                            }}
                        >
                            {/* Book Spine / Center Fold Shadow (Desktop Only) */}
                            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 dark:via-black/55 to-transparent pointer-events-none z-20" />

                            {/* Left Page (Welcome Art - Hidden on Mobile) */}
                            <AuthLeftPage isLogin={isLogin} />

                            {/* Right Page (Full width on Mobile) */}
                            <div
                                className="w-full md:w-1/2 bg-gradient-to-bl from-white via-slate-50 to-slate-100 dark:from-[#0d1322] dark:via-[#101728] dark:to-[#0a0f1d] p-5 sm:p-8 md:p-10 flex flex-col justify-center relative min-h-[480px] transition-colors duration-500"
                                style={{
                                    boxShadow:
                                        "inset 20px 0 30px -20px rgba(0,0,0,0.12)",
                                }}
                            >
                                {/* Subtle starlight texture */}
                                <div
                                    className="absolute inset-0 opacity-15 pointer-events-none"
                                    style={{
                                        backgroundImage:
                                            "radial-gradient(#6366f1 0.75px, transparent 0.75px)",
                                        backgroundSize: "20px 20px",
                                    }}
                                />

                                <div className="relative z-10 w-full max-w-sm mx-auto">
                                    {/* Mobile Header Brand Icon */}
                                    <div className="md:hidden flex flex-col items-center text-center mb-4">
                                        <div className="w-11 h-11 mb-2 bg-[#0f172a] dark:bg-[#131b2e] text-[#ffd166] border border-slate-700 dark:border-indigo-400/40 rounded-xl flex items-center justify-center shadow-md">
                                            <BookOpen size={22} />
                                        </div>
                                        <h1 className="text-xl font-serif font-bold text-[#0f172a] dark:text-[#f8fafc]">
                                            A? Bookshelf
                                        </h1>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] dark:text-[#f8fafc] mb-4 sm:mb-6 text-center tracking-tight">
                                        {t("login.sign_in", "Sign In")}
                                    </h2>

                                    <LoginForm
                                        formData={formData}
                                        setFormData={setFormData}
                                        onSubmit={handleSubmit}
                                        isLoading={isLoading}
                                    />

                                    <div className="mt-5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => navigate("/register")}
                                            className="text-slate-600 hover:text-slate-800 dark:text-[#94a3b8] dark:hover:text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5"
                                        >
                                            <span>
                                                {t(
                                                    "login.no_account",
                                                    "Don't have a library card? Create one",
                                                )}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-700 dark:text-[#ffd166] font-semibold border border-indigo-200 dark:border-indigo-500/40">
                                                Coming Soon
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-4xl mx-auto py-2 text-center text-xs text-slate-500 dark:text-[#94a3b8] shrink-0 relative z-10">
                <p>© {new Date().getFullYear()} A?Bookshelf. Crafted with care for passionate readers.</p>
            </footer>
        </div>
    );
}
