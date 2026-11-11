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
            {/* Cards Container (Responsive Grid on Tablet/Desktop, Smooth Scroll on Mobile) */}
            <div
                ref={scrollContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onScroll={handleScroll}
                className={`flex flex-row md:grid gap-3 sm:gap-3.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-1 snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 ${
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
                    return (
                        <motion.div
                            key={stat.year}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            onClick={() =>
                                setSelectedYear(isSelected ? null : stat.year)
                            }
                            className={`w-[85vw] max-w-[340px] shrink-0 sm:shrink md:w-auto md:max-w-none snap-start cursor-pointer transition-all duration-200 ${
                                isSelected
                                    ? "scale-[1.01] ring-2 ring-walnut dark:ring-gold ring-offset-2 ring-offset-cream dark:ring-offset-[#1a1612] shadow-md"
                                    : "hover:scale-[1.005]"
                            }`}
                        >
                            <div className="bg-[#fcfaf7]/95 dark:bg-[#201a14]/95 rounded-2xl border border-walnut/20 dark:border-walnut/30 shadow-sm overflow-hidden h-full backdrop-blur-sm">
                                {/* Card Header (Rich Mahogany & Warm Amber Wood Accent) */}
                                <div
                                    style={{
                                        padding: "13px 15px",
                                        background:
                                            "linear-gradient(135deg, #2b1810 0%, #3e2417 50%, #2b1810 100%)",
                                    }}
                                    className="border-b border-[#ffd166]/20 relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <h3 className="m-0 text-xs sm:text-sm md:text-base font-bold text-white font-serif flex items-center gap-1.5 tracking-wide whitespace-nowrap">
                                            <Target size={15} className="text-[#ffd166] shrink-0" />
                                            <span>
                                                {t(
                                                    "reading.target",
                                                    "Target {{year}}",
                                                    { year: stat.year },
                                                )}
                                            </span>
                                        </h3>
                                        <div className="flex items-baseline gap-1 shrink-0 whitespace-nowrap">
                                            <span className="text-base sm:text-lg md:text-xl font-serif font-bold text-white tracking-tight">
                                                {stat.finished}
                                            </span>
                                            <span className="text-amber-100/70 text-xs font-sans font-normal">
                                                / 12
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden">
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
                                                    : "bg-gradient-to-r from-amber-600 via-[#d4a574] to-[#ffd166]"
                                            }`}
                                        />
                                    </div>

                                    <p className="mt-2 text-[11px] sm:text-xs text-amber-100/80 m-0 font-medium truncate">
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

                                {/* Card Metrics Grid */}
                                <div className="grid grid-cols-3 divide-x divide-walnut/15 dark:divide-walnut/20 py-2.5 px-1 sm:py-3 sm:px-1.5 bg-[#fcfaf7]/90 dark:bg-[#1a140e]/90">
                                    <div className="text-center px-0.5">
                                        <div className="text-sm sm:text-base lg:text-lg font-serif font-bold text-darkBrown dark:text-cream truncate">
                                            {stat.pagesRead.toLocaleString()}
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-walnut/80 dark:text-gold mt-0.5 font-medium uppercase tracking-tight truncate">
                                            {t(
                                                "reading.pages_read",
                                                "Hal. Baca",
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center px-0.5">
                                        <div className="text-sm sm:text-base lg:text-lg font-serif font-bold text-darkBrown dark:text-cream truncate">
                                            {stat.totalPages.toLocaleString()}
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-walnut/80 dark:text-gold mt-0.5 font-medium uppercase tracking-tight truncate">
                                            {t(
                                                "reading.total_pages",
                                                "Total Hal.",
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center px-0.5">
                                        <div className="text-sm sm:text-base lg:text-lg font-serif font-bold text-darkBrown dark:text-cream truncate">
                                            {stat.readPct}%
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-walnut/80 dark:text-gold mt-0.5 font-medium uppercase tracking-tight truncate">
                                            {t("reading.percent_read", "% Target")}
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
                <div className="flex justify-center items-center gap-1.5 mt-2.5 md:hidden">
                    {yearlyStats.map((stat, i) => (
                        <button
                            key={stat.year}
                            onClick={() => scrollToCard(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeIndex === i
                                    ? "w-6 bg-walnut dark:bg-gold"
                                    : "w-1.5 bg-walnut/30 dark:bg-walnut/40"
                            }`}
                            aria-label={`Slide ${stat.year}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
