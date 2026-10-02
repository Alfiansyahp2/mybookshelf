import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useBooks } from "../hooks/useBooks";
import { useShelves } from "../hooks/useShelves";
import { useStatistics } from "../hooks/useStatistics";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useTranslation } from "react-i18next";

import DashboardHeroSection from "../components/dashboard/DashboardHeroSection";
import DashboardStatCardsSection from "../components/dashboard/DashboardStatCardsSection";
import DashboardReadingSection from "../components/dashboard/DashboardReadingSection";
import DashboardChartsSection from "../components/dashboard/DashboardChartsSection";
import DashboardGoalsSection from "../components/dashboard/DashboardGoalsSection";
import DashboardAuthorsSection from "../components/dashboard/DashboardAuthorsSection";
import DashboardActivitySection from "../components/dashboard/DashboardActivitySection";
import DashboardEmptyState from "../components/dashboard/DashboardEmptyState";
import ReadingCalendarModal from "../components/modals/ReadingCalendarModal";
import { fadeUp, BRAND } from "../components/dashboard/DashboardWidgets";
import SEO from "../components/SEO";

/* ══════════════════════════════════════════════
    MAIN DASHBOARD
   ══════════════════════════════════════════════ */
export default function Dashboard() {
    const { t } = useTranslation();
    const { data: booksResponse, isLoading } = useBooks();
    const { data: shelves = [] } = useShelves();
    const { data: statisticsResponse } = useStatistics();

    const backendStats = statisticsResponse?.data;
    const dailyActivity = backendStats?.daily_activity || [];
    const books = useMemo(
        () => booksResponse?.data?.data || [],
        [booksResponse],
    );

    const [genreFilter, setGenreFilter] = useState<string>("Semua");
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [mobileAnalyticsTab, setMobileAnalyticsTab] = useState<"charts" | "authors">("charts");

    const stats = useDashboardStats(books);

    if (isLoading)
        return (
            <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.2,
                            ease: "linear",
                        }}
                        style={{
                            width: 28,
                            height: 28,
                            border: "3px solid rgba(122,92,66,0.2)",
                            borderTopColor: BRAND.walnut,
                            borderRadius: "50%",
                        }}
                    />
                    <p style={{ color: BRAND.walnut, fontSize: 13 }}>
                        {t("dashboard.loading")}
                    </p>
                </div>
            </div>
        );

    return (
        <div className="px-4 md:px-5 pt-[88px] md:pt-[100px] pb-10 max-w-[1200px] mx-auto">
            <SEO title={t("navigation.dashboard", "Dashboard")} />
            {/* ─── Hero header ──────────────────────────── */}
            <DashboardHeroSection
                bookColors={stats.bookColors}
                onOpenCalendar={() => setIsCalendarModalOpen(true)}
            />

            {/* ─── KPI stat cards ───────────────────────── */}
            <DashboardStatCardsSection stats={stats} />

            {/* ─── Main content area: Desktop (lg+) ────── */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_320px] gap-5 mb-5">
                {/* LEFT — Currently reading + unread & Charts */}
                <div className="flex flex-col gap-5">
                    <DashboardReadingSection
                        currentlyReading={stats.currentlyReading}
                        topReadBooks={stats.topReadBooks || []}
                    />

                    <DashboardChartsSection
                        stats={stats}
                        genreFilter={genreFilter}
                        setGenreFilter={setGenreFilter}
                    />
                </div>

                {/* RIGHT — Goals & Authors */}
                <div className="flex flex-col gap-4 min-h-0">
                    <DashboardGoalsSection
                        stats={stats}
                        shelvesLength={shelves.length}
                    />
                    <DashboardAuthorsSection stats={stats} />
                </div>
            </div>

            {/* ─── Main content area: Mobile (< lg) ─────── */}
            <div className="flex flex-col gap-5 mb-5 lg:hidden">
                {/* 1. Priority #1: Currently reading & Unread */}
                <DashboardReadingSection
                    currentlyReading={stats.currentlyReading}
                    topReadBooks={stats.topReadBooks || []}
                />

                {/* 2. Priority #2: Reading Goals & Shelves */}
                <DashboardGoalsSection
                    stats={stats}
                    shelvesLength={shelves.length}
                />

                {/* 3. Priority #3: Analytics & Insights with Segmented Tabs */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-walnut/70">
                            {t("dashboard.tabs.analytics_title", "Statistik & Wawasan")}
                        </span>
                        {/* Segmented Control */}
                        <div className="inline-flex p-1 rounded-xl bg-walnut/10 border border-walnut/15 text-xs font-medium">
                            <button
                                type="button"
                                onClick={() => setMobileAnalyticsTab("charts")}
                                className={`px-3 py-1 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                                    mobileAnalyticsTab === "charts"
                                        ? "bg-white text-darkBrown shadow-xs"
                                        : "text-walnut/80 hover:text-darkBrown"
                                }`}
                            >
                                {t("dashboard.tabs.charts", "Grafik & Genre")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileAnalyticsTab("authors")}
                                className={`px-3 py-1 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                                    mobileAnalyticsTab === "authors"
                                        ? "bg-white text-darkBrown shadow-xs"
                                        : "text-walnut/80 hover:text-darkBrown"
                                }`}
                            >
                                {t("dashboard.tabs.authors", "Penulis")}
                            </button>
                        </div>
                    </div>

                    {mobileAnalyticsTab === "charts" ? (
                        <DashboardChartsSection
                            stats={stats}
                            genreFilter={genreFilter}
                            setGenreFilter={setGenreFilter}
                        />
                    ) : (
                        <DashboardAuthorsSection stats={stats} />
                    )}
                </div>
            </div>

            {/* ─── Reading progress area chart + recent books ─ */}
            <DashboardActivitySection
                dailyActivity={dailyActivity}
                books={books}
                stats={stats}
                setIsCalendarModalOpen={setIsCalendarModalOpen}
            />

            {/* ─── Empty state ──────────────────────────── */}
            <DashboardEmptyState total={stats.total} />

            {/* Reading Calendar Modal */}
            <ReadingCalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                books={books}
            />
        </div>
    );
}
