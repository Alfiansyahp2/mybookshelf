import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "../../../types";
import { STATUS_CFG } from "./bookConstants";

interface BookTooltipProps {
    book: Book;
    colors: [string, string, string];
    bookAreaHeight: number;
    bookH: number;
    visible: boolean;
}

export const BookTooltip: React.FC<BookTooltipProps> = React.memo(function BookTooltip({
    book,
    colors: [c0, c1, c2],
    bookAreaHeight,
    bookH,
    visible,
}) {
    const { t } = useTranslation();
    const sCfg = STATUS_CFG[book.status] ?? STATUS_CFG["unread"];
    const statusLabel = t(`status.${book.status}`, sCfg.defaultLabel);
    const isFavorite = Boolean(book.favorite || book.isFavorite);
    const readingProgressPct =
        book.pages && book.pages > 0
            ? Math.round(((book.currentPage || 0) / book.pages) * 100)
            : 0;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, x: -4, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -4, scale: 0.95 }}
                    transition={{ duration: 0.14 }}
                    style={{
                        position: "absolute",
                        left: "100%",
                        bottom: bookAreaHeight - bookH,
                        marginLeft: 10,
                        zIndex: 9999,
                        pointerEvents: "none",
                        width: 224,
                    }}
                >
                    <div
                        style={{
                            background: "rgba(253, 249, 243, 0.98)",
                            backdropFilter: "blur(16px)",
                            borderRadius: 16,
                            boxShadow:
                                "0 14px 36px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)",
                            border: "1px solid rgba(139,99,56,0.18)",
                            overflow: "hidden",
                            width: 224,
                        }}
                    >
                        {/* Top Accent Strip */}
                        <div
                            style={{
                                height: 4,
                                background: `linear-gradient(to right, ${c0}, ${c1})`,
                            }}
                        />

                        <div style={{ padding: "14px" }}>
                            {/* Mini cover & Title/Author */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    alignItems: "flex-start",
                                    marginBottom: 12,
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        width: 40,
                                        height: 56,
                                        flexShrink: 0,
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        border: "1px solid rgba(0,0,0,0.12)",
                                        backgroundColor: "#e8deca",
                                    }}
                                >
                                    {book.coverImage ? (
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                background: `linear-gradient(150deg, ${c0}, ${c1} 50%, ${c2})`,
                                                padding: 4,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                color: "#ffffff",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 7,
                                                    fontWeight: 700,
                                                    fontFamily: "serif",
                                                    lineHeight: 1.1,
                                                }}
                                            >
                                                {book.title}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                                    <p
                                        style={{
                                            color: "#1c0f05",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            fontFamily: "'Georgia', serif",
                                            lineHeight: 1.25,
                                            margin: "0 0 3px",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {book.title}
                                    </p>
                                    <p
                                        style={{
                                            color: "#7c5a3a",
                                            fontSize: 11,
                                            margin: 0,
                                            fontFamily: "'Georgia', serif",
                                            fontStyle: "italic",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {book.author}
                                    </p>
                                </div>
                            </div>

                            {/* Category Pill Box */}
                            {book.genre && (
                                <div
                                    style={{
                                        marginBottom: 10,
                                        padding: "7px 10px",
                                        borderRadius: 10,
                                        background: "rgba(220, 231, 229, 0.8)",
                                        border: "1px solid rgba(184, 207, 204, 0.7)",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "block",
                                            fontSize: 9.5,
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            color: "#3d6568",
                                            lineHeight: 1.25,
                                        }}
                                    >
                                        {book.genre}
                                    </span>
                                </div>
                            )}

                            {/* Divider line */}
                            <div
                                style={{
                                    height: 1,
                                    background: "#e8e0d5",
                                    margin: "10px 0 8px",
                                }}
                            />

                            {/* Status & Rating / Favorite */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        background: sCfg.bg,
                                        color: sCfg.text,
                                        fontSize: 10.5,
                                        fontWeight: 600,
                                        padding: "3px 10px",
                                        borderRadius: 14,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: sCfg.dot,
                                            flexShrink: 0,
                                            display: "inline-block",
                                        }}
                                    />
                                    {statusLabel}
                                </div>

                                {book.personalRating ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 3,
                                        }}
                                    >
                                        <Star
                                            size={13}
                                            style={{
                                                fill: "#f59e0b",
                                                color: "#f59e0b",
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: "#4a3b2f",
                                            }}
                                        >
                                            {book.personalRating}
                                        </span>
                                    </div>
                                ) : isFavorite ? (
                                    <Heart
                                        size={12}
                                        style={{
                                            fill: "#f87171",
                                            color: "#f87171",
                                        }}
                                    />
                                ) : null}
                            </div>

                            {/* Reading progress bar */}
                            {book.status === "reading" &&
                                book.pages &&
                                book.pages > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 9,
                                                color: "#9c7a5a",
                                                marginBottom: 3,
                                            }}
                                        >
                                            <span>
                                                <BookOpen
                                                    size={10}
                                                    style={{
                                                        display: "inline",
                                                        verticalAlign: "middle",
                                                        marginRight: 3,
                                                    }}
                                                />
                                                {t("landing.pages", "Hal.")} {book.currentPage || 0}
                                            </span>
                                            <span>{readingProgressPct}%</span>
                                        </div>
                                        <div
                                            style={{
                                                height: 3,
                                                borderRadius: 2,
                                                overflow: "hidden",
                                                background: `${c0}25`,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: "100%",
                                                    borderRadius: 2,
                                                    width: `${readingProgressPct}%`,
                                                    background: "#7a5c42",
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Left Pointer Arrow */}
                    <div
                        style={{
                            position: "absolute",
                            left: -5,
                            top: 18,
                            width: 0,
                            height: 0,
                            borderTop: "5px solid transparent",
                            borderBottom: "5px solid transparent",
                            borderRight: "5px solid rgba(253,249,243,0.98)",
                            filter: "drop-shadow(-1px 0 1px rgba(0,0,0,0.08))",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
});
