import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { BRAND, Card, ContributionGraph, fadeUp } from "./DashboardWidgets";
import { useTranslation } from "react-i18next";

interface DashboardActivitySectionProps {
    dailyActivity: any[];
    books: any[];
    stats: any;
    setIsCalendarModalOpen: (val: boolean) => void;
}

export default function DashboardActivitySection({
    dailyActivity,
    books,
    setIsCalendarModalOpen,
}: DashboardActivitySectionProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.language.startsWith("en") ? "en-US" : "id-ID";
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const [expandedMonths, setExpandedMonths] = useState<
        Record<string, boolean>
    >({});

    const toggleMonth = (month: string) => {
        setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
    };

    const getBookDates = (b: any) => {
        const dates: Date[] = [];
        if (b.status === "finished") {
            if (b.finishedDate) dates.push(new Date(b.finishedDate));
            if (b.readDates && Array.isArray(b.readDates)) {
                b.readDates.forEach((rd: any) => dates.push(new Date(rd)));
            }
        } else if (b.created_at) {
            dates.push(new Date(b.created_at));
        } else {
            dates.push(new Date());
        }
        return dates.sort((a, b) => a.getTime() - b.getTime());
    };

    const getLatestBookDate = (b: any) => {
        const dates = getBookDates(b);
        return dates[dates.length - 1];
    };

    const booksInYear = books
        .filter((b) => {
            const dates = getBookDates(b);
            return dates.some(d => d.getFullYear() === selectedYear);
        })
        .sort((a, b) => {
            return getLatestBookDate(b).getTime() - getLatestBookDate(a).getTime();
        });

    // Augment dailyActivity with fallback pages for finished books that have no tracking on their finish date
    const activityMap = new Map();
    dailyActivity.forEach((d) => {
        activityMap.set(d.date, { ...d });
    });

    books.forEach((b) => {
        if (b.status === "finished") {
            const finalDateStrs = new Set<string>();
            if (b.finishedDate) {
                const d = new Date(b.finishedDate);
                finalDateStrs.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
            }
            if (b.readDates && Array.isArray(b.readDates)) {
                b.readDates.forEach((rd: any) => {
                    const d = new Date(rd);
                    finalDateStrs.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
                });
            }

            finalDateStrs.forEach(finalDateStr => {
                const existing = activityMap.get(finalDateStr) || {
                    date: finalDateStr,
                    pages: 0,
                    books_read: [],
                };
                if (!existing.pages || existing.pages === 0) {
                    if (!existing.fallbackPages) existing.fallbackPages = 0;
                    existing.fallbackPages += b.totalPages || b.pages || 0;
                }
                activityMap.set(finalDateStr, existing);
            });
        }
    });

    const augmentedDailyActivity = Array.from(activityMap.values()).map(
        (a) => ({
            ...a,
            pages: a.pages > 0 ? a.pages : a.fallbackPages || 0,
        }),
    );

    const totalPagesInYear = augmentedDailyActivity
        .filter((d) => new Date(d.date).getFullYear() === selectedYear)
        .reduce((sum, d) => sum + (d.pages || 0), 0);

    const groupedByMonth = booksInYear.reduce((acc: any, book: any) => {
        // Group the book in EVERY month it was read/finished during the selected year
        const dates = getBookDates(book).filter(d => d.getFullYear() === selectedYear);
        const monthsAdded = new Set<string>();
        dates.forEach(d => {
            const month = d.toLocaleString(locale, { month: "long" });
            if (!monthsAdded.has(month)) {
                monthsAdded.add(month);
                if (!acc[month]) acc[month] = [];
                acc[month].push(book);
            }
        });
        return acc;
    }, {});

    const [isTimelineVisible, setIsTimelineVisible] = useState(false);

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 60px",
                gap: 30,
                paddingBottom: 40,
            }}
        >
            {/* Left Column: Graph + Timeline */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 32,
                    minWidth: 0,
                }}
            >
                {/* Heatmap Card */}
                <motion.div {...fadeUp(0.6)}>
                    <div
                        style={{
                            fontSize: 14,
                            color: BRAND.darkBrown,
                            marginBottom: 12,
                            paddingLeft: 4,
                            fontWeight: 500,
                        }}
                    >
                        {t("dashboard.activity.pages_read", {
                            count: totalPagesInYear,
                            year: selectedYear,
                        })}
                    </div>
                    <Card
                        style={{
                            padding: "16px 20px",
                            border: "1px solid rgba(139,99,56,0.15)",
                        }}
                    >
                        <div style={{ paddingBottom: 20 }}>
                            {augmentedDailyActivity.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "24px 0",
                                        color: "rgba(122,92,66,0.4)",
                                        fontSize: 12,
                                    }}
                                >
                                    {t("dashboard.activity.no_activity")}
                                </div>
                            ) : (
                                <ContributionGraph
                                    data={augmentedDailyActivity}
                                    books={books}
                                    selectedYear={selectedYear}
                                    onClick={() => setIsCalendarModalOpen(true)}
                                />
                            )}
                        </div>

                        <div
                            style={{
                                borderTop: "1px solid rgba(139,99,56,0.1)",
                                paddingTop: 16,
                            }}
                        >
                            <div
                                onClick={() =>
                                    setIsTimelineVisible(!isTimelineVisible)
                                }
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 14,
                                    color: BRAND.darkBrown,
                                    marginBottom: isTimelineVisible ? 24 : 0,
                                    paddingLeft: 4,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    userSelect: "none",
                                    width: "fit-content",
                                }}
                            >
                                <span>
                                    {t("dashboard.activity.read_activity")}
                                </span>
                                <span
                                    style={{
                                        fontSize: 14,
                                        color: "rgba(139,99,56,0.6)",
                                        transition: "transform 0.2s",
                                        transform: isTimelineVisible
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                    }}
                                >
                                    ▼
                                </span>
                            </div>

                            <AnimatePresence>
                                {isTimelineVisible && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 16,
                                            }}
                                        >
                                            {Object.keys(groupedByMonth).length === 0 ? (
                                                <div style={{ fontSize: 13, color: "rgba(139,99,56,0.6)", padding: "20px 0", textAlign: "center" }}>
                                                    {t("dashboard.activity.no_books")}
                                                </div>
                                            ) : (
                                                Object.entries(groupedByMonth).map(([month, monthBooks]: any) => {
                                                    const isExpanded = expandedMonths[month];
                                                    return (
                                                        <div
                                                            key={month}
                                                            style={{
                                                                background: "rgba(139,99,56,0.02)",
                                                                borderRadius: 12,
                                                                border: "1px solid rgba(139,99,56,0.1)",
                                                                overflow: "hidden",
                                                                transition: "all 0.2s ease"
                                                            }}
                                                        >
                                                            {/* Header Row */}
                                                            <div
                                                                onClick={() => toggleMonth(month)}
                                                                style={{
                                                                    padding: "16px 20px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    cursor: "pointer",
                                                                    userSelect: "none"
                                                                }}
                                                            >
                                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                                    <div style={{ 
                                                                        width: 32, height: 32, borderRadius: "50%", 
                                                                        background: "rgba(139,99,56,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
                                                                        color: BRAND.walnut
                                                                    }}>
                                                                        <BookOpen size={16} />
                                                                    </div>
                                                                    <span style={{ fontSize: 15, fontWeight: 700, color: BRAND.darkBrown }}>
                                                                        {month} {selectedYear}
                                                                    </span>
                                                                    <span style={{ 
                                                                        padding: "2px 8px", background: "rgba(139,99,56,0.1)", 
                                                                        color: BRAND.walnut, fontSize: 11, borderRadius: 12, fontWeight: 600 
                                                                    }}>
                                                                        {monthBooks.length} activities
                                                                    </span>
                                                                </div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                                    {/* Mini Covers Preview */}
                                                                    {!isExpanded && (
                                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                                            {monthBooks.slice(0, 4).map((b: any, i: number) => (
                                                                                <div key={b.id || i} style={{ 
                                                                                    width: 20, height: 28, borderRadius: 2, 
                                                                                    marginLeft: i > 0 ? -10 : 0, 
                                                                                    boxShadow: "-2px 0 5px rgba(0,0,0,0.15)", 
                                                                                    background: b.coverImage ? `url(${b.coverImage}) center/cover` : b.spineColors?.[0] || BRAND.walnut, 
                                                                                    zIndex: 10 - i, border: "1px solid rgba(255,255,255,0.8)" 
                                                                                }} />
                                                                            ))}
                                                                            {monthBooks.length > 4 && (
                                                                                <div style={{ 
                                                                                    width: 20, height: 28, borderRadius: 2, marginLeft: -10, 
                                                                                    background: "rgba(139,99,56,0.15)", border: "1px solid rgba(255,255,255,0.8)", 
                                                                                    zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", 
                                                                                    fontSize: 9, fontWeight: 700, color: BRAND.walnut, backdropFilter: "blur(2px)" 
                                                                                }}>
                                                                                    +{monthBooks.length - 4}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    <span style={{ color: "rgba(139,99,56,0.5)", transition: "transform 0.3s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                                                                        ▼
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Expanded View */}
                                                            <AnimatePresence>
                                                                {isExpanded && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        style={{ overflow: "hidden" }}
                                                                    >
                                                                        <div style={{ padding: "0 20px 20px 20px" }}>
                                                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                                                                                {monthBooks.map((b: any, i: number) => {
                                                                                    const dates = getBookDates(b);
                                                                                    const hasFinishedInSelectedYear = dates.some(d => d.getFullYear() === selectedYear);
                                                                                    const isFinished = b.status === "finished" && hasFinishedInSelectedYear;
                                                                                    return (
                                                                                        <div key={b.id || i} style={{ 
                                                                                            display: "flex", alignItems: "center", gap: 12, 
                                                                                            background: "white", padding: "10px 12px", 
                                                                                            borderRadius: 8, border: "1px solid rgba(139,99,56,0.1)" 
                                                                                        }}>
                                                                                            {b.coverImage ? (
                                                                                                <div style={{ width: 32, height: 48, borderRadius: 4, background: `url(${b.coverImage}) center/cover`, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                                                                                            ) : (
                                                                                                <div style={{ width: 32, height: 48, borderRadius: 4, background: b.spineColors?.[0] || BRAND.walnut, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                                                                                            )}
                                                                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                                                                                                <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.darkBrown, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</span>
                                                                                                <span style={{ fontSize: 11, color: "rgba(139,99,56,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.author}</span>
                                                                                            </div>
                                                                                            <div style={{ flexShrink: 0, paddingLeft: 8 }}>
                                                                                                {isFinished ? (
                                                                                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: 4 }}>
                                                                                                        {t("dashboard.activity.finished")}
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.walnut, background: "rgba(139,99,56,0.1)", padding: "2px 6px", borderRadius: 4 }}>
                                                                                                        {t("dashboard.activity.added")}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Right Column: Year Selector */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    paddingTop: 30,
                }}
            >
                {[0, 1, 2, 3].map((offset) => {
                    const year = currentYear - offset;
                    const isActive = selectedYear === year;
                    return (
                        <div
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            style={{
                                background: isActive
                                    ? "#7A5C42"
                                    : "transparent",
                                color: isActive
                                    ? "white"
                                    : "rgba(122,92,66,0.7)",
                                padding: "6px 12px",
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive)
                                    e.currentTarget.style.background =
                                        "rgba(139,99,56,0.05)";
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive)
                                    e.currentTarget.style.background =
                                        "transparent";
                            }}
                        >
                            {year}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
