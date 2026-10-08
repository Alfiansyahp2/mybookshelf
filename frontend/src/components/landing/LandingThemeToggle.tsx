import React from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../store/useThemeStore";

interface LandingThemeToggleProps {
    className?: string;
}

export default function LandingThemeToggle({ className = "" }: LandingThemeToggleProps) {
    const { t } = useTranslation();
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleDarkMode();
    };

    return (
        <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ease-in-out shadow-xs select-none cursor-pointer ${
                isDarkMode
                    ? "bg-[#131b2e]/90 border-indigo-400/40 text-[#ffd166] hover:bg-[#1e293b] hover:border-[#ffd166] shadow-[0_0_10px_rgba(255,209,102,0.15)] hover:shadow-[0_0_15px_rgba(255,209,102,0.45)]"
                    : "bg-slate-200/60 border-slate-300 text-slate-700 hover:bg-slate-200 hover:border-indigo-400 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)]"
            } ${className}`}
            title={
                isDarkMode
                    ? t("landing.theme_light", "Beralih ke Mode Stellar Dawn")
                    : t("landing.theme_dark", "Beralih ke Mode Langit Kosmik")
            }
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? "sun" : "moon"}
                    initial={{ rotate: -90, scale: 0.2, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.2, opacity: 0 }}
                    whileHover={{ rotate: 25 }}
                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                    className="flex items-center justify-center"
                >
                    {isDarkMode ? (
                        <Sun className="w-4 h-4 text-[#ffd166]" />
                    ) : (
                        <Moon className="w-4 h-4 text-indigo-600" />
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
}
