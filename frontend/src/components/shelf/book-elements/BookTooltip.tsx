import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "../../../types";
import { STATUS_CFG } from "./bookConstants";

interface BookTooltipProps {
    book: Book;
    colors: [string, string, string];
    visible: boolean;
    triggerRef: React.RefObject<HTMLDivElement | null>;
    bookAreaHeight?: number;
    bookH?: number;
}

export const BookTooltip: React.FC<BookTooltipProps> = React.memo(
    function BookTooltip({
        book,
        colors: [c0, c1, c2],
        visible,
        triggerRef,
    }) {
        const { t } = useTranslation();
        const [coords, setCoords] = useState<{
            top: number;
            left: number;
            arrowTop: number;
            placeOnLeft: boolean;
        } | null>(null);

        const sCfg = STATUS_CFG[book.status] ?? STATUS_CFG["unread"];
        const statusLabel = t(`status.${book.status}`, sCfg.defaultLabel);
        const isFavorite = Boolean(book.favorite || book.isFavorite);
        const readingProgressPct =
            book.pages && book.pages > 0
                ? Math.round(((book.currentPage || 0) / book.pages) * 100)
                : 0;

        useEffect(() => {
            if (!visible || !triggerRef.current) {
                setCoords(null);
                return;
            }

            const updatePosition = () => {
                const el = triggerRef.current;
                if (!el) return;

                const rect = el.getBoundingClientRect();

                // If element is off-screen, hide tooltip
                if (
                    rect.right < 0 ||
                    rect.left > window.innerWidth ||
                    rect.bottom < 0 ||
                    rect.top > window.innerHeight
                ) {
                    setCoords(null);
                    return;
                }

                const tooltipWidth = 224;
                const estimatedTooltipHeight = 230;

                // Horizontal positioning (flip to left if would overflow right edge)
                const placeOnLeft =
                    rect.right + tooltipWidth + 14 > window.innerWidth;
                const left = placeOnLeft
                    ? Math.max(8, rect.left - tooltipWidth - 10)
                    : Math.min(
                          window.innerWidth - tooltipWidth - 8,
                          rect.right + 10
                      );

                // Vertical positioning (center with book spine, but clamp inside viewport)
                const bookCenterY = rect.top + rect.height / 2;
                let top = bookCenterY - estimatedTooltipHeight / 2;

                if (top < 12) {
                    top = 12;
                } else if (
                    top + estimatedTooltipHeight >
                    window.innerHeight - 12
                ) {
                    top = Math.max(
                        12,
                        window.innerHeight - estimatedTooltipHeight - 12
                    );
                }

                // Arrow pointer dynamically tracks book center
                const arrowTop = Math.max(
                    16,
                    Math.min(estimatedTooltipHeight - 20, bookCenterY - top)
                );

                setCoords({ top, left, arrowTop, placeOnLeft });
            };

            updatePosition();

            // Listen to scroll events on window & any parent scrollable container (capture phase)
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);

            return () => {
                window.removeEventListener("scroll", updatePosition, true);
                window.removeEventListener("resize", updatePosition);
            };
        }, [visible, triggerRef]);

        if (!visible || !coords) return null;

        return createPortal(
            <AnimatePresence>
                {visible && coords && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        transition={{ duration: 0.14 }}
                        style={{
                            position: "fixed",
                            top: coords.top,
                            left: coords.left,
                            zIndex: 99999,
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
                                    "0 14px 36px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1)",
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
                                            boxShadow:
                                                "0 4px 8px rgba(0,0,0,0.2)",
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
                                                    justifyContent:
                                                        "space-between",
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

                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            paddingTop: 2,
                                        }}
                                    >
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
                                            background:
                                                "rgba(220, 231, 229, 0.8)",
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
                                                    color: "#0f172a",
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
                                                    justifyContent:
                                                        "space-between",
                                                    fontSize: 9,
                                                    color: "#64748b",
                                                    marginBottom: 3,
                                                }}
                                            >
                                                <span>
                                                    <BookOpen
                                                        size={10}
                                                        style={{
                                                            display: "inline",
                                                            verticalAlign:
                                                                "middle",
                                                            marginRight: 3,
                                                        }}
                                                    />
                                                    {t("landing.pages", "Hal.")}{" "}
                                                    {book.currentPage || 0}
                                                </span>
                                                <span>
                                                    {readingProgressPct}%
                                                </span>
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
                                                        background: "#6366f1",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Pointer Arrow pointing toward book spine */}
                        {coords.placeOnLeft ? (
                            <div
                                style={{
                                    position: "absolute",
                                    right: -5,
                                    top: coords.arrowTop,
                                    width: 0,
                                    height: 0,
                                    borderTop: "5px solid transparent",
                                    borderBottom: "5px solid transparent",
                                    borderLeft:
                                        "5px solid rgba(253,249,243,0.98)",
                                    filter: "drop-shadow(1px 0 1px rgba(0,0,0,0.08))",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    position: "absolute",
                                    left: -5,
                                    top: coords.arrowTop,
                                    width: 0,
                                    height: 0,
                                    borderTop: "5px solid transparent",
                                    borderBottom: "5px solid transparent",
                                    borderRight:
                                        "5px solid rgba(253,249,243,0.98)",
                                    filter: "drop-shadow(-1px 0 1px rgba(0,0,0,0.08))",
                                }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
        );
    }
);
