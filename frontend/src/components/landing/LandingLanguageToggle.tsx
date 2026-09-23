import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

interface LandingLanguageToggleProps {
    className?: string;
}

export default function LandingLanguageToggle({ className = "" }: LandingLanguageToggleProps) {
    const { i18n, t } = useTranslation();
    const isEn = i18n.language?.startsWith("en");

    const toggleLanguage = (e: React.MouseEvent) => {
        e.stopPropagation();
        i18n.changeLanguage(isEn ? "id" : "en");
    };

    return (
        <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-[#7a5c42]/30 text-[11px] sm:text-xs font-bold text-[#7a5c42] hover:bg-[#7a5c42]/10 transition-colors shadow-xs select-none ${className}`}
            title={t("landing.switch_lang", isEn ? "Ganti ke Bahasa Indonesia" : "Switch to English")}
            aria-label="Toggle language"
        >
            <Globe className="w-3.5 h-3.5 text-[#7a5c42]" />
            <span className="tracking-wider font-sans">{isEn ? "EN" : "ID"}</span>
        </motion.button>
    );
}
