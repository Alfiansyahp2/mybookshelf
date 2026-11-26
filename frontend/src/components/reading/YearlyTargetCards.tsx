import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Award, Check, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { YearlyStat } from "../../hooks/useYearlyStats";

interface YearlyTargetCardsProps {
    yearlyStats: YearlyStat[];
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
        const edgeSize = 100;

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
        <div className="mb-5 sm:mb-6">
            {/* Cards Container (Responsive Grid on Tablet/Desktop, Smooth Scroll on Mobile) */}
            <div
                ref={scrollContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onScroll={handleScroll}
                className={`flex flex-row md:grid gap-3 sm:gap-3.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-1 snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0 ${
                    yearlyStats.length === 1
                        ? "md:grid-cols-1 md:max-w-md"
                        : yearlyStats.length === 2
                          ? "md:grid-cols-2"
                          : yearlyStats.length === 3
                            ? "md:grid-cols-3"
                            : "sm:grid-cols-2 lg:grid-cols-4"
                }`}
            >
                {yearlyStats.map((stat, idx) => {
                    const isSelected = selectedYear === stat.year;
                    const isAchieved = stat.goalPct >= 100;

                    return (
                        <motion.div
                            key={stat.year}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            onClick={() =>
                                setSelectedYear(isSelected ? null : stat.year)
                            }
                            className={`w-[84vw] max-w-[330px] shrink-0 sm:shrink md:w-auto md:max-w-none snap-start cursor-pointer transition-all duration-200 rounded-2xl ${
                                isSelected
                                    ? "ring-2 ring-walnut dark:ring-gold ring-offset-2 ring-offset-[#cdb07c] dark:ring-offset-[#19120c] shadow-lg -translate-y-0.5"
                                    : "hover:-translate-y-0.5 hover:shadow-md"
                            }`}
                        >
                            <div className="bg-[#fcfaf7]/95 dark:bg-[#231b14]/95 rounded-2xl border border-walnut/20 dark:border-walnut/35 shadow-sm overflow-hidden h-full backdrop-blur-sm flex flex-col">
                                {/* Warm Walnut & Burnished Gold Card Header */}
                                <div className="px-3.5 py-3 bg-gradient-to-br from-[#5c3a1e] via-[#4a2e16] to-[#3a2210] dark:from-[#3d2614] dark:via-[#2e1c0e] dark:to-[#221409] border-b border-[#d4a574]/25 relative overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd166]/40 to-transparent pointer-events-none" />

                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <Target
                                                size={14}
                                                className="text-[#ffd166] shrink-0"
                                            />
                                            <h3 className="m-0 text-xs sm:text-sm font-bold text-[#fff8ee] font-serif tracking-wide whitespace-nowrap">
                                                {t(
                                                    "reading.target",
                                                    "Target {{year}}",
                                                    { year: stat.year },
                                                )}
                                            </h3>
                                            {isSelected && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#ffd166]/20 text-[#ffd166] text-[9px] font-semibold">
                                                    <Check size={9} />
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-baseline gap-0.5 shrink-0 whitespace-nowrap">
                                            <span className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                                                {stat.finished}
                                            </span>
                                            <span className="text-amber-100/70 text-[11px] font-sans font-medium">
                                                / 12
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-1.5 rounded-full bg-black/35 border border-white/10 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${Math.min(stat.goalPct, 100)}%`,
                                            }}
                                            transition={{
                                                duration: 1.0,
                                                delay: 0.25 + idx * 0.08,
                                                ease: "easeOut",
                                            }}
                                            className={`h-full rounded-full ${
                                                isAchieved
                                                    ? "bg-gradient-to-r from-[#d4a574] via-[#f2ca7e] to-[#ffd166]"
                                                    : "bg-gradient-to-r from-[#a9713b] via-[#cfa064] to-[#e7bd82]"
                                            }`}
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium truncate">
                                        {isAchieved ? (
                                            <span className="inline-flex items-center gap-1 text-[#ffd166] truncate">
                                                <Award
                                                    size={12}
                                                    className="shrink-0"
                                                />
                                                <span className="truncate">
                                                    {t(
                                                        "reading.target_achieved",
                                                        "Target tercapai!",
                                                    )}
                                                </span>
                                            </span>
                                        ) : (
                                            <span className="text-amber-100/80 truncate">
                                                {t(
                                                    "reading.books_left_for_target",
                                                    "{{count}} buku lagi untuk target tahun ini",
                                                    {
                                                        count: Math.max(
                                                            12 - stat.finished,
                                                            0,
                                                        ),
                                                    },
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card Metrics Grid */}
                                <div className="grid grid-cols-3 divide-x divide-walnut/15 dark:divide-walnut/25 py-2.5 px-1.5 bg-[#fcfaf7]/90 dark:bg-[#1c150f]/95">
                                    <div className="text-center px-1 min-w-0">
                                        <div className="text-sm sm:text-base font-serif font-bold text-darkBrown dark:text-cream tabular-nums">
                                            {stat.pagesRead.toLocaleString()}
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-walnut/75 dark:text-gold/85 mt-0.5 font-semibold uppercase tracking-normal whitespace-nowrap">
                                            {t(
                                                "reading.pages_read_short",
                                                "Hal. Dibaca",
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center px-1 min-w-0">
                                        <div className="text-sm sm:text-base font-serif font-bold text-darkBrown dark:text-cream tabular-nums">
                                            {stat.totalPages.toLocaleString()}
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-walnut/75 dark:text-gold/85 mt-0.5 font-semibold uppercase tracking-normal whitespace-nowrap">
                                            {t(
                                                "reading.total_pages_short",
                                                "Total Hal.",
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center px-1 min-w-0">
                                        <div className="text-sm sm:text-base font-serif font-bold text-darkBrown dark:text-cream tabular-nums">
                                            {stat.readPct}%
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-walnut/75 dark:text-gold/85 mt-0.5 font-semibold uppercase tracking-normal whitespace-nowrap">
                                            {t(
                                                "reading.percent_read",
                                                "% Terbaca",
                                            )}
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
                <div className="flex justify-center items-center gap-1.5 mt-2 md:hidden">
                    {yearlyStats.map((stat, i) => (
                        <button
                            key={stat.year}
                            type="button"
                            onClick={() => scrollToCard(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeIndex === i
                                    ? "w-6 bg-walnut dark:bg-gold"
                                    : "w-1.5 bg-walnut/30 dark:bg-walnut/45"
                            }`}
                            aria-label={`Slide ${stat.year}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
