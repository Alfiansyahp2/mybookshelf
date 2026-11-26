import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    BookOpen,
    ChevronRight,
    BarChart2,
    Star,
    CheckCircle2,
} from "lucide-react";
import { Card } from "./DashboardWidgets";
import {
    BRAND,
    fadeUp,
    type DashboardBookSummary,
    type DashboardTopReadBook,
} from "../../constants/dashboardTheme";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface DashboardReadingSectionProps {
    currentlyReading: DashboardBookSummary[];
    topReadBooks?: DashboardTopReadBook[];
}

export default function DashboardReadingSection({
    currentlyReading,
    topReadBooks = [],
}: DashboardReadingSectionProps) {
    const { t } = useTranslation();
    const [view, setView] = useState<"reading" | "top">("reading");
    return (
        <motion.div {...fadeUp(0.35)}>
            <Card className="flex flex-col min-h-[260px] lg:h-[296px]">
                <div
                    className="px-4 py-3 sm:px-5 sm:py-3 flex items-center justify-between shrink-0"
                    style={{
                        borderBottom:
                            "1px solid rgb(var(--color-walnut-rgb) / 0.14)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setView("reading")}
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                margin: 0,
                                fontSize: 15,
                                fontFamily: "'Georgia',serif",
                                fontWeight: 700,
                                color:
                                    view === "reading"
                                        ? BRAND.darkBrown
                                        : "rgb(var(--app-ink-rgb) / 0.5)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                transition: "color 0.2s",
                            }}
                        >
                            <BookOpen
                                size={16}
                                color={
                                    view === "reading"
                                        ? BRAND.gold
                                        : "rgb(var(--app-ink-rgb) / 0.5)"
                                }
                            />{" "}
                            {t("dashboard.reading.title")}
                        </button>
                        <span
                            style={{
                                color: "rgb(var(--color-walnut-rgb) / 0.3)",
                            }}
                        >
                            |
                        </span>
                        <button
                            type="button"
                            onClick={() => setView("top")}
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                margin: 0,
                                fontSize: 15,
                                fontFamily: "'Georgia',serif",
                                fontWeight: 700,
                                color:
                                    view === "top"
                                        ? BRAND.darkBrown
                                        : "rgb(var(--app-ink-rgb) / 0.5)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                transition: "color 0.2s",
                            }}
                        >
                            <BarChart2
                                size={16}
                                color={
                                    view === "top"
                                        ? BRAND.gold
                                        : "rgb(var(--app-ink-rgb) / 0.5)"
                                }
                            />{" "}
                            {t(
                                "dashboard.charts.top_read_books",
                                "Buku Sering Dibaca",
                            )}
                        </button>
                    </div>
                    {view === "reading" && (
                        <Link
                            to="/reading"
                            style={{
                                fontSize: 11.5,
                                color: "rgb(var(--app-ink-rgb) / 0.72)",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            {t("dashboard.reading.view_all")}{" "}
                            <ChevronRight size={13} />
                        </Link>
                    )}
                </div>

                <div
                    className="hide-scrollbar"
                    style={{
                        padding: "14px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        overflowY: "auto",
                        flex: 1,
                    }}
                >
                    {view === "reading" ? (
                        currentlyReading.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "24px 0",
                                    color: "rgb(var(--app-ink-rgb) / 0.5)",
                                }}
                            >
                                <BookOpen
                                    size={32}
                                    style={{
                                        margin: "0 auto 8px",
                                        display: "block",
                                        opacity: 0.45,
                                    }}
                                />
                                <p style={{ fontSize: 12, margin: 0 }}>
                                    {t("dashboard.reading.no_books")}
                                </p>
                            </div>
                        ) : (
                            currentlyReading.map((b, i) => {
                                const pct =
                                    b.pages > 0
                                        ? Math.round(
                                              (b.currentPage / b.pages) * 100,
                                          )
                                        : 0;
                                const isUnread = b.status === "unread";
                                return (
                                    <motion.div
                                        key={b.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.07 }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                            }}
                                        >
                                            {/* Spine mini */}
                                            <div
                                                style={{
                                                    width: 10,
                                                    height: 50,
                                                    background: isUnread
                                                        ? `${b.color}66`
                                                        : `linear-gradient(to right,${b.color}aa,${b.color},${b.color}dd)`,
                                                    borderRadius:
                                                        "1px 2px 2px 1px",
                                                    flexShrink: 0,
                                                    boxShadow:
                                                        "1px 0 4px rgba(0,0,0,0.18)",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        marginBottom: 2,
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: 13.5,
                                                            fontWeight: 700,
                                                            color: BRAND.darkBrown,
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {b.title}
                                                    </p>
                                                    {isUnread && (
                                                        <span
                                                            style={{
                                                                fontSize: 9,
                                                                fontWeight: 700,
                                                                padding:
                                                                    "2px 7px",
                                                                borderRadius: 10,
                                                                background:
                                                                    "rgb(var(--app-surface-alt-rgb))",
                                                                color: "rgb(var(--app-ink-rgb) / 0.78)",
                                                                border: "1px solid rgb(var(--color-walnut-rgb) / 0.25)",
                                                                flexShrink: 0,
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {t(
                                                                "dashboard.reading.unread_badge",
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <p
                                                    style={{
                                                        margin: "0 0 7px",
                                                        fontSize: 11.5,
                                                        color: "rgb(var(--app-ink-rgb) / 0.65)",
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    {b.author}
                                                </p>
                                                {isUnread ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 6,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                height: 4,
                                                                borderRadius: 2,
                                                                background:
                                                                    "rgb(var(--color-walnut-rgb) / 0.2)",
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                fontSize: 10.5,
                                                                color: "rgb(var(--app-ink-rgb) / 0.62)",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {b.pages
                                                                ? t(
                                                                      "dashboard.reading.pages",
                                                                      {
                                                                          count: b.pages,
                                                                      },
                                                                  )
                                                                : "—"}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                height: 5,
                                                                borderRadius: 3,
                                                                background:
                                                                    "rgb(var(--color-walnut-rgb) / 0.22)",
                                                                overflow:
                                                                    "hidden",
                                                            }}
                                                        >
                                                            <motion.div
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                animate={{
                                                                    width: `${pct}%`,
                                                                }}
                                                                transition={{
                                                                    duration: 0.9,
                                                                    delay:
                                                                        0.5 +
                                                                        i * 0.07,
                                                                    ease: "easeOut",
                                                                }}
                                                                style={{
                                                                    height: "100%",
                                                                    borderRadius: 3,
                                                                    background:
                                                                        "linear-gradient(to right, rgb(var(--color-walnut-rgb)), rgb(var(--color-gold-rgb)))",
                                                                }}
                                                            />
                                                        </div>
                                                        <span
                                                            style={{
                                                                fontSize: 10.5,
                                                                fontWeight: 700,
                                                                color: BRAND.gold,
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {pct}%
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: 10.5,
                                                                color: "rgb(var(--app-ink-rgb) / 0.65)",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {t(
                                                                "dashboard.reading.page_of",
                                                                {
                                                                    current:
                                                                        b.currentPage,
                                                                    total: b.pages,
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {i < currentlyReading.length - 1 && (
                                            <div
                                                style={{
                                                    height: 1,
                                                    background:
                                                        "rgb(var(--color-walnut-rgb) / 0.14)",
                                                    marginTop: 12,
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })
                        )
                    ) : !topReadBooks || topReadBooks.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "20px 0",
                                color: "rgb(var(--app-ink-rgb) / 0.5)",
                                fontSize: 12,
                            }}
                        >
                            {t("dashboard.activity.no_books")}
                        </div>
                    ) : (
                        <div
                            className="hide-scrollbar"
                            style={{
                                display: "flex",
                                gap: 16,
                                overflowX: "auto",
                                paddingBottom: 8,
                                paddingTop: 4,
                            }}
                        >
                            {topReadBooks.map((b, i) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{
                                        width: 120,
                                        flexShrink: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 120,
                                            height: 170,
                                            borderRadius: 6,
                                            overflow: "hidden",
                                            boxShadow:
                                                "0 4px 12px rgba(0,0,0,0.08)",
                                            background: b.coverImage
                                                ? "#fff"
                                                : `linear-gradient(135deg, ${b.color}aa, ${b.color})`,
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {b.coverImage ? (
                                            <img
                                                src={b.coverImage}
                                                alt={b.name}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <span
                                                style={{
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    fontSize: 24,
                                                    opacity: 0.5,
                                                }}
                                            >
                                                {b.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}

                                        {/* Top Label */}
                                        {b.genre && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 8,
                                                    left: 8,
                                                    right: 8,
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 9,
                                                        fontWeight: 700,
                                                        background:
                                                            "rgba(255,255,255,0.92)",
                                                        padding: "2px 6px",
                                                        borderRadius: 4,
                                                        color: "#3a291c",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        maxWidth: "60%",
                                                    }}
                                                >
                                                    {b.genre.split(",")[0]}
                                                </span>
                                                {b.value > 1 && (
                                                    <span
                                                        style={{
                                                            fontSize: 9,
                                                            fontWeight: 800,
                                                            background:
                                                                "#FDE047",
                                                            padding: "2px 6px",
                                                            borderRadius: 4,
                                                            color: "#854D0E",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <CheckCircle2
                                                            size={10}
                                                        />{" "}
                                                        {b.value}x
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 3,
                                        }}
                                    >
                                        <h4
                                            style={{
                                                margin: 0,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: BRAND.darkBrown,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                            title={b.name}
                                        >
                                            {b.name}
                                        </h4>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: "50%",
                                                    background: b.color,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#fff",
                                                    fontSize: 7,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {b.author
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: 10,
                                                    color: "rgb(var(--app-ink-rgb) / 0.72)",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    flex: 1,
                                                }}
                                            >
                                                {b.author}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                                marginTop: 1,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={9}
                                                        color={
                                                            star <=
                                                            Number(
                                                                b.personalRating ||
                                                                    0,
                                                            )
                                                                ? "#FBBF24"
                                                                : "#E5E7EB"
                                                        }
                                                        fill={
                                                            star <=
                                                            Number(
                                                                b.personalRating ||
                                                                    0,
                                                            )
                                                                ? "#FBBF24"
                                                                : "transparent"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 9,
                                                    color: "rgb(var(--app-ink-rgb) / 0.65)",
                                                }}
                                            >
                                                {Number(b.personalRating || 0) >
                                                0
                                                    ? `${b.personalRating}/5`
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 9.5,
                                                color: "rgb(var(--app-ink-rgb) / 0.65)",
                                                marginTop: 1,
                                            }}
                                        >
                                            Tamat:{" "}
                                            <span
                                                style={{
                                                    fontWeight: 600,
                                                    color: BRAND.darkBrown,
                                                }}
                                            >
                                                {b.value} kali
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
