import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Library, BookOpen, DollarSign, Calendar } from "lucide-react";
import { BRAND, MiniSpines, fadeUp } from "./DashboardWidgets";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuth";

interface DashboardHeroSectionProps {
    bookColors: string[];
    onOpenCalendar?: () => void;
}

export default function DashboardHeroSection({
    bookColors,
    onOpenCalendar,
}: DashboardHeroSectionProps) {
    const { t } = useTranslation();
    const { data: authData } = useAuthUser();
    const authUser = authData?.user || (authData as any)?.data;
    const firstName = authUser?.name ? authUser.name.split(" ")[0] : null;

    return (
        <motion.div {...fadeUp(0)} className="mb-6 md:mb-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                {/* Title & Greeting */}
                <div>
                    <p className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-walnut/70 mb-1">
                        {firstName ? (
                            <span>{t("dashboard.hero.greeting", "Halo, {{name}}!", { name: firstName })}</span>
                        ) : (
                            t("dashboard.hero.subtitle")
                        )}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-darkBrown leading-tight">
                        {t("dashboard.hero.title")}
                    </h1>
                </div>

                {/* Decorative mini spines (Desktop) */}
                <div className="hidden sm:block opacity-75 shrink-0">
                    <MiniSpines colors={bookColors} />
                </div>
            </div>

            {/* Quick Action Shortcuts (Mobile-optimized pill bar) */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mt-4 pt-1 pb-1">
                <Link
                    to="/library"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-darkBrown border border-walnut/15 text-xs font-semibold shadow-xs shrink-0 transition-all hover:scale-105 active:scale-95"
                >
                    <Library className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t("dashboard.quick_actions.library", "Rak Buku")}</span>
                </Link>

                <Link
                    to="/reading"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-darkBrown border border-walnut/15 text-xs font-semibold shadow-xs shrink-0 transition-all hover:scale-105 active:scale-95"
                >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("dashboard.quick_actions.reading", "Sedang Baca")}</span>
                </Link>

                <Link
                    to="/accounting"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-darkBrown border border-walnut/15 text-xs font-semibold shadow-xs shrink-0 transition-all hover:scale-105 active:scale-95"
                >
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t("dashboard.quick_actions.accounting", "Keuangan")}</span>
                </Link>

                {onOpenCalendar && (
                    <button
                        onClick={onOpenCalendar}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-darkBrown border border-walnut/15 text-xs font-semibold shadow-xs shrink-0 transition-all hover:scale-105 active:scale-95"
                    >
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>{t("dashboard.quick_actions.calendar", "Kalender")}</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
