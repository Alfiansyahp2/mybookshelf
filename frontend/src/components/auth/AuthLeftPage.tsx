import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthLeftPageProps {
    isLogin: boolean;
    onTogglePage?: (toRegister: boolean) => void;
}

export default function AuthLeftPage({ isLogin, onTogglePage }: AuthLeftPageProps) {
    const { t } = useTranslation();
    return (
        <div
            className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0d1322] dark:via-[#101728] dark:to-[#0a0f1d] border-r border-slate-200 dark:border-indigo-500/20 p-8 lg:p-10 flex-col justify-center relative overflow-hidden transition-colors duration-500"
            style={{
                boxShadow: "inset -20px 0 30px -20px rgba(0,0,0,0.12)",
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

            {/* Dynamic Page Flip Spine Shadow Sweep */}
            <motion.div
                key={isLogin ? "left-shadow-login" : "left-shadow-reg"}
                initial={{ opacity: isLogin ? 0 : 0.45 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-black/40 via-black/15 to-transparent pointer-events-none z-20"
            />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#131b2e] dark:via-[#1c2438] dark:to-[#0a0e1a] text-[#ffd166] dark:text-[#38bdf8] border-2 border-indigo-400/40 dark:border-[#38bdf8]/50 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3"
                >
                    <BookOpen size={40} />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? "left-login" : "left-register"}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                    >
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f172a] dark:text-[#f8fafc] mb-4 leading-tight whitespace-pre-line tracking-tight transition-colors duration-500">
                            {isLogin
                                ? t(
                                      "login.welcome_back",
                                      "Welcome Back\nto Your Library",
                                  )
                                : t(
                                      "login.begin_journey",
                                      "Begin Your\nReading Journey",
                                  )}
                        </h1>
                        <p className="text-slate-600 dark:text-[#94a3b8] text-xs sm:text-sm leading-relaxed max-w-xs mx-auto transition-colors duration-500">
                            {isLogin
                                ? t(
                                      "login.welcome_desc",
                                      "Open the pages of your collection and continue exactly where you left off.",
                                  )
                                : t(
                                      "login.begin_desc",
                                      "Create your personal catalog and organize your reading life beautifully.",
                                  )}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Interactive Cosmic Page Indicator */}
                <div className="mt-8 flex justify-center items-center gap-2.5">
                    {/* Page 1: Login */}
                    <button
                        type="button"
                        onClick={() => onTogglePage?.(false)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            isLogin
                                ? "w-8 bg-indigo-600 dark:bg-[#38bdf8] shadow-sm shadow-indigo-500/40"
                                : "w-3 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                        }`}
                        title={t("login.sign_in", "Masuk")}
                        aria-label="Halaman 1: Masuk"
                    />

                    {/* Center Stardust Dot */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffd166] shadow-xs" />

                    {/* Page 2: Register */}
                    <button
                        type="button"
                        onClick={() => onTogglePage?.(true)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            !isLogin
                                ? "w-8 bg-indigo-600 dark:bg-[#38bdf8] shadow-sm shadow-sky-500/40"
                                : "w-3 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                        }`}
                        title={t("login.register", "Daftar")}
                        aria-label="Halaman 2: Pendaftaran"
                    />
                </div>
            </div>
        </div>
    );
}
