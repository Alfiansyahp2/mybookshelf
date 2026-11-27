import { useState, useEffect } from "react";
import type { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLogin, useRegister, useAuthUser } from "../hooks/useAuth";
import { useNotifications } from "@shared/store/useNotificationStore";
import { BookOpen } from "lucide-react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AuthDecoration from "../components/AuthDecoration";
import AuthLeftPage from "../components/AuthLeftPage";
import SEO from "@shared/components/ui/SEO";
import LandingLanguageToggle from "@shared/components/ui/LandingLanguageToggle";
import LandingThemeToggle from "@shared/components/ui/LandingThemeToggle";

const loginLeafVariants = {
    enter: {
        rotateY: -105,
        opacity: 0,
        skewY: -3,
        transformOrigin: "left center",
        boxShadow: "-30px 0 45px rgba(0,0,0,0.55)",
    },
    center: {
        rotateY: 0,
        opacity: 1,
        skewY: 0,
        transformOrigin: "left center",
        boxShadow: "inset 20px 0 30px -20px rgba(0,0,0,0.12)",
        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1] as const, // natural paper settle
        },
    },
    exit: {
        rotateY: -105,
        opacity: 0,
        skewY: -3,
        transformOrigin: "left center",
        boxShadow: "-35px 0 50px rgba(0,0,0,0.6)",
        transition: {
            duration: 0.6,
            ease: [0.35, 0.05, 0.2, 1] as const, // natural page peel acceleration
        },
    },
};

const registerBaseVariants = {
    enter: {
        opacity: 0.85,
        scale: 0.985,
        filter: "brightness(0.9)",
    },
    center: {
        opacity: 1,
        scale: 1,
        filter: "brightness(1)",
        transition: {
            duration: 0.55,
            ease: "easeOut" as const,
        },
    },
    exit: {
        opacity: 0.5,
        scale: 0.985,
        filter: "brightness(0.85)",
        transition: {
            duration: 0.55,
            ease: "easeIn" as const,
        },
    },
};

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const login = useLogin();
    const register = useRegister();
    const { data: user } = useAuthUser();
    const addNotification = useNotifications((state) => state.addNotification);

    const isRegister = location.pathname.startsWith("/register");
    const isLogin = !isRegister;
    const direction = isRegister ? 1 : -1;

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user?.user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleTogglePage = (toRegister: boolean) => {
        if (toRegister && !isRegister) {
            navigate("/register");
        } else if (!toRegister && isRegister) {
            navigate("/login");
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        register.mutate(registerData, {
            onSuccess: () => {
                setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                }, 100);
            },
            onError: (error) => {
                const axiosErr = error as AxiosError<{ message?: string }>;
                const errorMessage =
                    axiosErr.response?.data?.message ||
                    axiosErr.message ||
                    "Registration failed";
                addNotification({
                    title: t("register.failed", "Registration failed"),
                    message: errorMessage,
                    type: "warning",
                });
            },
        });
    };

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
                onError: (error) => {
                    const axiosErr = error as AxiosError<{ message?: string }>;
                    const errorMessage =
                        axiosErr.response?.data?.message ||
                        axiosErr.message ||
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
            <SEO
                title={
                    isRegister
                        ? `${t("register_coming_soon.title", "Pendaftaran")} - A?Bookshelf`
                        : `${t("navigation.login", "Login")} - A?Bookshelf`
                }
                description={
                    isRegister
                        ? t(
                            "register_coming_soon.subheadline",
                            "Fitur pembuatan akun baru sedang kami persiapkan dan akan hadir pada pembaruan selanjutnya.",
                        )
                        : undefined
                }
            />

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
                            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 dark:via-black/55 to-transparent pointer-events-none z-30" />

                            {/* Left Page (Welcome Art - Hidden on Mobile) */}
                            <AuthLeftPage isLogin={isLogin} onTogglePage={handleTogglePage} />

                            {/* Right Page (Simultaneous 3D Turning Leaf Container) */}
                            <div
                                className="w-full md:w-1/2 relative min-h-[480px] md:min-h-0 md:h-full flex flex-col overflow-hidden bg-slate-100/50 dark:bg-[#0a0f1d]/50"
                                style={{ perspective: "2200px" }}
                            >
                                <AnimatePresence initial={false} custom={direction}>
                                    {isRegister ? (
                                        <motion.div
                                            key="register-sheet"
                                            variants={registerBaseVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="absolute inset-0 w-full h-full p-5 sm:p-8 md:p-10 flex flex-col justify-center bg-gradient-to-bl from-white via-slate-50 to-slate-100 dark:from-[#0d1322] dark:via-[#101728] dark:to-[#0a0f1d] transition-colors duration-500 overflow-hidden z-10"
                                            style={{
                                                boxShadow:
                                                    "inset 20px 0 30px -20px rgba(0,0,0,0.12)",
                                            }}
                                        >
                                            {/* Dynamic Lifting Shadow overlay as Login lifts away */}
                                            <motion.div
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 0 }}
                                                exit={{ opacity: 0.7 }}
                                                transition={{ duration: 0.55, ease: "easeInOut" }}
                                                className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/45 via-black/15 to-transparent pointer-events-none z-30"
                                            />

                                            {/* Subtle starlight texture */}
                                            <div
                                                className="absolute inset-0 opacity-15 pointer-events-none"
                                                style={{
                                                    backgroundImage:
                                                        "radial-gradient(#6366f1 0.75px, transparent 0.75px)",
                                                    backgroundSize: "20px 20px",
                                                }}
                                            />

                                            {/* Content: Registration Form */}
                                            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-center">
                                                {/* Mobile Header Brand Icon */}
                                                <div className="md:hidden flex flex-col items-center text-center mb-3">
                                                    <div className="w-10 h-10 mb-1.5 bg-[#0f172a] dark:bg-[#131b2e] text-[#ffd166] border border-slate-700 dark:border-indigo-400/40 rounded-xl flex items-center justify-center shadow-md">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <h1 className="text-lg font-serif font-bold text-[#0f172a] dark:text-[#f8fafc]">
                                                        A? Bookshelf
                                                    </h1>
                                                </div>

                                                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] dark:text-[#f8fafc] mb-3.5 text-center tracking-tight">
                                                    {t("login.register", "Create Account")}
                                                </h2>

                                                <RegisterForm
                                                    formData={registerData}
                                                    setFormData={setRegisterData}
                                                    onSubmit={handleRegisterSubmit}
                                                    isLoading={register.isPending}
                                                />

                                                {/* Switch Link back to Login */}
                                                <div className="mt-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate("/login")}
                                                        className="text-slate-600 hover:text-slate-800 dark:text-[#94a3b8] dark:hover:text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
                                                    >
                                                        <span>{t("login.has_account", "Already have a library card? Sign in")}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="login-sheet"
                                            variants={loginLeafVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="absolute inset-0 w-full h-full p-5 sm:p-8 md:p-10 flex flex-col justify-center bg-gradient-to-bl from-white via-slate-50 to-slate-100 dark:from-[#0d1322] dark:via-[#101728] dark:to-[#0a0f1d] transition-colors duration-500 overflow-hidden z-20"
                                            style={{
                                                transformStyle: "preserve-3d",
                                                transformOrigin: "left center",
                                                backfaceVisibility: "hidden",
                                            }}
                                        >
                                            {/* Dynamic Page Turning Sheen overlay when landing */}
                                            <motion.div
                                                initial={{ opacity: 0.5, x: "-35%" }}
                                                animate={{ opacity: 0, x: "100%" }}
                                                transition={{ duration: 0.7, ease: "easeOut" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-sky-400/10 to-transparent pointer-events-none z-30"
                                            />

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
                                                        className="text-slate-600 hover:text-slate-800 dark:text-[#94a3b8] dark:hover:text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                                                    >
                                                            <span>
                                                                {t(
                                                                    "login.no_account",
                                                                    "Don't have a library card? Create one",
                                                                )}
                                                            </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
