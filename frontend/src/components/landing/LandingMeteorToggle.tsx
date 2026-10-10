import React from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface LandingMeteorToggleProps {
    isActive: boolean;
    onToggle: () => void;
    className?: string;
}

export default function LandingMeteorToggle({
    isActive,
    onToggle,
    className = "",
}: LandingMeteorToggleProps) {
    const { t } = useTranslation();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle();
    };

    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ease-in-out shadow-xs select-none cursor-pointer relative group ${
                isActive
                    ? "bg-gradient-to-tr from-indigo-950 via-[#131b2e] to-sky-950 border-sky-400 dark:border-[#ffd166] text-[#ffd166] shadow-[0_0_15px_rgba(56,189,248,0.45)] dark:shadow-[0_0_18px_rgba(255,209,102,0.45)]"
                    : "bg-white/70 dark:bg-[#131b2e]/90 border-slate-300 dark:border-indigo-400/40 text-slate-700 dark:text-indigo-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] hover:border-sky-400 dark:hover:border-[#ffd166] hover:text-sky-600 dark:hover:text-[#ffd166] hover:shadow-[0_0_12px_rgba(56,189,248,0.3)]"
            } ${className}`}
            title={
                isActive
                    ? t(
                          "landing.meteor_active",
                          "Hujan Meteor Aktif ✨ (Klik untuk Langit Tenang)",
                      )
                    : t(
                          "landing.meteor_trigger",
                          "Panggil Hujan Meteor ✨ (Meteor Shower)",
                      )
            }
            aria-label="Toggle Meteor Shower"
        >
            {/* Ambient Active Pulse Ring */}
            {isActive && (
                <span className="absolute inset-0 rounded-full border border-sky-400/50 dark:border-[#ffd166]/50 animate-ping pointer-events-none opacity-40" />
            )}

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isActive ? "meteor-on" : "meteor-off"}
                    initial={{ rotate: -45, scale: 0.4, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 45, scale: 0.4, opacity: 0 }}
                    whileHover={{ rotate: 18 }}
                    transition={{ type: "spring", stiffness: 380, damping: 20 }}
                    className="flex items-center justify-center relative"
                >
                    <Sparkles
                        className={`w-4 h-4 transition-colors ${
                            isActive
                                ? "text-[#ffd166] fill-[#ffd166]/30 filter drop-shadow-[0_0_6px_#ffd166]"
                                : "text-slate-600 dark:text-indigo-300 group-hover:text-sky-500 dark:group-hover:text-[#ffd166]"
                        }`}
                    />
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
}
