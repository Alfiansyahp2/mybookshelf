import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface AuthDecorationProps {
    isLogin?: boolean;
}

export default function AuthDecoration({ isLogin }: AuthDecorationProps) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Ambient Cosmic Sparkles & Floating Celestial Stardust */}
            <motion.div
                animate={{ y: [0, -12, 0], opacity: [0.35, 0.75, 0.35], rotate: [0, 45, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[12%] left-[8%] text-indigo-500/40 dark:text-[#ffd166]/40"
            >
                <Sparkles size={36} />
            </motion.div>
            <motion.div
                animate={{ y: [0, 14, 0], opacity: [0.25, 0.65, 0.25], rotate: [0, -30, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[22%] right-[10%] text-sky-500/40 dark:text-[#38bdf8]/40"
            >
                <Star size={28} />
            </motion.div>
            <motion.div
                animate={{ y: [0, -16, 0], opacity: [0.25, 0.65, 0.25], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] left-[12%] text-purple-500/40 dark:text-[#a78bfa]/40"
            >
                <Star size={24} />
            </motion.div>
            <motion.div
                animate={{ y: [0, 10, 0], opacity: [0.2, 0.55, 0.2] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                className="absolute bottom-[25%] right-[14%] text-indigo-400/40 dark:text-[#ffd166]/40"
            >
                <Sparkles size={32} />
            </motion.div>
        </div>
    );
}
