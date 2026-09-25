import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLogin, useAuthUser } from "../hooks/useAuth";
// import { useRegister } from "../hooks/useAuth"; // Dinonaktifkan sementara - dialihkan ke Coming Soon
import { useNotifications } from "../hooks/useNotifications";
import { BookOpen } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
// import RegisterForm from "../components/auth/RegisterForm"; // Dinonaktifkan sementara - dialihkan ke Coming Soon
import AuthDecoration from "../components/auth/AuthDecoration";
import AuthLeftPage from "../components/auth/AuthLeftPage";
import SEO from "../components/SEO";

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const login = useLogin();
    // const register = useRegister();
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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center p-4">
            <SEO title={t("navigation.login", "Login")} />
            {/* Extracted Decoration & Background */}
            <AuthDecoration isLogin={isLogin} />

            <AnimatePresence mode="wait">
                <motion.div
                    key="login-book"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.6, type: "spring", damping: 20 }}
                    className="w-full max-w-sm sm:max-w-md md:max-w-4xl min-h-[500px] md:h-[600px] relative z-10 mx-auto my-auto"
                    style={{ perspective: "2000px" }}
                >
                    {/* Hardcover Backing */}
                    <div
                        className="absolute inset-[-6px] sm:inset-[-12px] bg-[#5C4532] rounded-xl shadow-2xl"
                        style={{
                            boxShadow:
                                "0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 2px 10px rgba(0,0,0,0.5)",
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
                        }}
                    />

                    {/* Pages Container */}
                    <div
                        className="relative md:absolute inset-0 flex flex-col md:flex-row bg-[#fdfbf7] rounded-md shadow-inner overflow-hidden min-h-[490px]"
                        style={{
                            boxShadow:
                                "inset 0 0 0 1px rgba(139, 115, 85, 0.2)",
                        }}
                    >
                        {/* Book Spine / Center Fold Shadow (Desktop Only) */}
                        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-20" />

                        {/* Left Page (Welcome Art - Hidden on Mobile) */}
                        <AuthLeftPage isLogin={isLogin} />

                        {/* Right Page (Full width on Mobile) */}
                        <div
                            className="w-full md:w-1/2 bg-gradient-to-bl from-[#fdfbf7] to-[#f4f1ea] p-5 sm:p-8 md:p-10 flex flex-col justify-center relative min-h-[480px]"
                            style={{
                                boxShadow:
                                    "inset 20px 0 30px -20px rgba(0,0,0,0.15)",
                            }}
                        >
                            {/* Subtle page texture */}
                            <div
                                className="absolute inset-0 opacity-30 pointer-events-none"
                                style={{
                                    backgroundImage:
                                        "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(139, 115, 85, 0.05) 24px, rgba(139, 115, 85, 0.05) 25px)",
                                }}
                            />

                            <div className="relative z-10 w-full max-w-sm mx-auto">
                                {/* Mobile Header Brand Icon */}
                                <div className="md:hidden flex flex-col items-center text-center mb-4">
                                    <div className="w-11 h-11 mb-2 bg-walnut text-white rounded-xl flex items-center justify-center shadow-md">
                                        <BookOpen size={22} />
                                    </div>
                                    <h1 className="text-xl font-serif font-bold text-darkBrown">
                                        A? Bookshelf
                                    </h1>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-serif font-bold text-darkBrown mb-4 sm:mb-6 text-center">
                                    {t("login.sign_in", "Sign In")}
                                </h2>

                                <LoginForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    onSubmit={handleSubmit}
                                    isLoading={isLoading}
                                />

                                {/* 
                                    Form Register dinonaktifkan sementara dan dialihkan ke page Coming Soon di /register:
                                    <RegisterForm
                                        formData={formData}
                                        setFormData={setFormData}
                                        onSubmit={handleSubmit}
                                        isLoading={isLoading}
                                    />
                                */}

                                <div className="mt-5 text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/register")}
                                        className="text-walnut/80 hover:text-walnut text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5"
                                    >
                                        <span>
                                            {t(
                                                "login.no_account",
                                                "Don't have a library card? Create one",
                                            )}
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                                            Coming Soon
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
