import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LandingLanguageToggleProps {
    className?: string;
}

export default function LandingLanguageToggle({ className = "" }: LandingLanguageToggleProps) {
    const { i18n, t } = useTranslation();
    const isEn = i18n.language?.startsWith("en");
    const [clickCount, setClickCount] = useState(0);

    const toggleLanguage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setClickCount((prev) => prev + 1);
        i18n.changeLanguage(isEn ? "id" : "en");
    };

    return (
        <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-slate-300 dark:border-indigo-400/40 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-[#ffd166] hover:bg-slate-100 dark:hover:bg-indigo-500/20 hover:border-indigo-400 dark:hover:border-[#ffd166] shadow-xs hover:shadow-[0_0_12px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_0_14px_rgba(255,209,102,0.35)] transition-all duration-300 ease-in-out select-none cursor-pointer ${className}`}
            title={t("landing.switch_lang", isEn ? "Ganti ke Bahasa Indonesia" : "Switch to English")}
            aria-label="Toggle language"
        >
            <motion.div
                animate={{ rotate: clickCount * 360 }}
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="flex items-center justify-center shrink-0"
            >
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-[#ffd166] transition-colors duration-500" />
            </motion.div>

            <div className="w-4.5 text-center overflow-hidden inline-flex justify-center">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isEn ? "EN" : "ID"}
                        initial={{ y: -9, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 9, opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        className="tracking-wider font-sans inline-block"
                    >
                        {isEn ? "EN" : "ID"}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.button>
    );
}
