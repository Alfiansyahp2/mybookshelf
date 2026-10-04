import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { useTranslation } from "react-i18next";

interface YearlyTargetCardsProps {
    yearlyStats: any[];
    selectedYear: number | null;
    setSelectedYear: (year: number | null) => void;
}

export default function YearlyTargetCards({
    yearlyStats,
    selectedYear,
    setSelectedYear,
}: YearlyTargetCardsProps) {
    const { t } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const speedRef = useRef(0);
    const isScrolling = useRef(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const startScrolling = () => {
        if (isScrolling.current) return;
        isScrolling.current = true;
        const scroll = () => {
            if (!isScrolling.current || !scrollContainerRef.current) return;
            scrollContainerRef.current.scrollLeft += speedRef.current;
            requestAnimationFrame(scroll);
        };
        requestAnimationFrame(scroll);
    };

    const stopScrolling = () => {
        isScrolling.current = false;
        speedRef.current = 0;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        const { left, right } =
            scrollContainerRef.current.getBoundingClientRect();
        const x = e.clientX;
        const edgeSize = 100; // Area on left/right edges to trigger scroll

        if (x < left + edgeSize) {
            speedRef.current = -((left + edgeSize - x) / edgeSize) * 15;
            startScrolling();
        } else if (x > right - edgeSize) {
            speedRef.current = ((x - (right - edgeSize)) / edgeSize) * 15;
            startScrolling();
        } else {
            stopScrolling();
        }
    };

    const handleMouseLeave = () => {
        stopScrolling();
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, offsetWidth } = scrollContainerRef.current;
        const cardWidth = offsetWidth * 0.85;
        const idx = Math.round(scrollLeft / (cardWidth || 1));
        setActiveIndex(Math.min(Math.max(idx, 0), yearlyStats.length - 1));
    };

    const scrollToCard = (index: number) => {
        if (!scrollContainerRef.current) return;
        const card = scrollContainerRef.current.children[index] as HTMLElement;
        if (card) {
            card.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
            setActiveIndex(index);
        }
    };

    if (yearlyStats.length === 0) return null;

    return (
        <div className="mb-6">
            {/* Scrollable Cards Container */}
            <div
                ref={scrollContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onScroll={handleScroll}
                className="flex flex-row gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
            >
                {yearlyStats.map((stat, idx) => {
                    const isSelected = selectedYear === stat.year;
                    return (
                        <motion.div
                            key={stat.year}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            onClick={() =>
                                setSelectedYear(isSelected ? null : stat.year)
                            }
                            className={`w-[85vw] max-w-[340px] shrink-0 sm:shrink sm:w-auto ${
                                yearlyStats.length <= 2
                                    ? "sm:flex-1 sm:max-w-[420px]"
                                    : "sm:w-[320px] sm:shrink-0"
                            } snap-start cursor-pointer transition-all duration-200 ${
                                isSelected
                                    ? "scale-[1.01] ring-2 ring-[#d4a574] ring-offset-2 ring-offset-cream dark:ring-offset-[#1a100b] shadow-md"
                                    : "hover:scale-[1.005]"
                            }`}
                        >
                            <div className="bg-[#fdfbf7]/90 dark:bg-[#20140e]/95 rounded-2xl border border-[#7a5c42]/20 dark:border-[#d4a574]/25 shadow-sm overflow-hidden h-full backdrop-blur-sm">
                                {/* Card Header (Rich Walnut & Gold Accent) */}
                                <div
                                    style={{
                                        padding: "16px 18px",
                                        background:
                                            "linear-gradient(135deg, #3d2516 0%, #56361e 50%, #422917 100%)",
                                    }}
                                    className="border-b border-[#d4a574]/20 relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between gap-3 mb-2.5">
                                        <h3 className="m-0 text-sm sm:text-base font-bold text-amber-100 font-serif flex items-center gap-2 tracking-wide whitespace-nowrap">
                                            <Target size={16} className="text-[#d4a574] shrink-0" />
                                            <span>
                                                {t(
                                                    "reading.target",
                                                    "Target {{year}}",
                                                    { year: stat.year },
                                                )}
                                            </span>
                                        </h3>
                                        <div className="flex items-baseline gap-1 shrink-0 whitespace-nowrap">
                                            <span className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                                                {stat.finished}
                                            </span>
                                            <span className="text-amber-200/60 text-xs sm:text-sm font-sans font-normal">
                                                / 12
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-2 rounded-full bg-black/35 border border-white/10 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(stat.goalPct, 100)}%` }}
                                            transition={{
                                                duration: 1.2,
                                                delay: 0.4 + idx * 0.1,
                                                ease: "easeOut",
                                            }}
                                            className={`h-full rounded-full ${
                                                stat.goalPct >= 100
                                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                                    : "bg-gradient-to-r from-[#d4a574] to-[#f3cf9f]"
                                            }`}
                                        />
                                    </div>

                                    <p className="mt-2 text-[11px] sm:text-xs text-amber-100/75 m-0 font-medium truncate">
                                        {stat.goalPct >= 100
                                            ? t(
                                                  "reading.target_achieved",
                                                  "🎉 Target tercapai!",
                                              )
                                            : t(
                                                  "reading.books_left_for_target",
                                                  "{{count}} buku lagi untuk target tahun ini",
                                                  { count: Math.max(12 - stat.finished, 0) },
                                              )}
                                    </p>
                                </div>

                                {/* Card Metrics Grid (Warm Parchment) */}
                                <div className="grid grid-cols-3 divide-x divide-[#7a5c42]/10 dark:divide-[#d4a574]/15 p-3 sm:p-4 bg-[#fdfbf7]/70 dark:bg-[#1a120c]/80">
                                    <div className="text-center px-1">
                                        <div className="text-base sm:text-xl font-serif font-bold text-[#4a3b2f] dark:text-[#f5ece3] truncate">
                                            {stat.pagesRead.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] sm:text-[11px] text-[#7a5c42]/70 dark:text-[#c9ab91] mt-0.5 font-medium uppercase tracking-wider truncate">
                                            {t(
                                                "reading.pages_read",
                                                "Halaman",
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center px-1">
                                        <div className="text-base sm:text-xl font-serif font-bold text-[#4a3b2f] dark:text-[#f5ece3] truncate">
                                            {stat.totalPages.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] sm:text-[11px] text-[#7a5c42]/70 dark:text-[#c9ab91] mt-0.5 font-medium uppercase tracking-wider truncate">
                                            {t(
                                                "reading.total_pages",
                                                "Total Hal.",
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center px-1">
                                        <div className="text-base sm:text-xl font-serif font-bold text-[#4a3b2f] dark:text-[#f5ece3] truncate">
                                            {stat.readPct}%
                                        </div>
                                        <div className="text-[10px] sm:text-[11px] text-[#7a5c42]/70 dark:text-[#c9ab91] mt-0.5 font-medium uppercase tracking-wider truncate">
                                            {t("reading.percent_read", "% Terbaca")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Mobile Pagination Indicator Dots */}
            {yearlyStats.length > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-2.5 sm:hidden">
                    {yearlyStats.map((stat, i) => (
                        <button
                            key={stat.year}
                            onClick={() => scrollToCard(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeIndex === i
                                    ? "w-6 bg-[#7a5c42] dark:bg-[#d4a574]"
                                    : "w-1.5 bg-[#7a5c42]/25 dark:bg-[#d4a574]/25"
                            }`}
                            aria-label={`Slide ${stat.year}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
