import React from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 shadow-xs select-none ${
                isDarkMode
                    ? "bg-[#3e281b]/70 border-[#d4a574]/50 text-[#e5b882] hover:bg-[#4d3222] shadow-[0_0_12px_rgba(212,165,116,0.2)]"
                    : "bg-[#7a5c42]/5 border-[#7a5c42]/30 text-[#7a5c42] hover:bg-[#7a5c42]/10"
            } ${className}`}
            title={
                isDarkMode
                    ? t("landing.theme_light", "Beralih ke Mode Terang")
                    : t("landing.theme_dark", "Beralih ke Mode Coklat Malam")
            }
            aria-label="Toggle theme"
        >
            <motion.div
                key={isDarkMode ? "sun" : "moon"}
                initial={{ rotate: -45, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 45, scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
            >
                {isDarkMode ? (
                    <Sun className="w-4 h-4 text-[#e5b882]" />
                ) : (
                    <Moon className="w-4 h-4 text-[#7a5c42]" />
                )}
            </motion.div>
        </motion.button>
    );
}
