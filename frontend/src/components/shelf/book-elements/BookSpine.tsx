import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Book } from "../../../types";

interface BookSpineProps {
    book: Book;
    bookW: number;
    bookH: number;
    colors: [string, string, string];
    isHoveredOrClicked: boolean;
}

export const BookSpine: React.FC<BookSpineProps> = React.memo(function BookSpine({
    book,
    bookW,
    bookH,
    colors: [c0, c1, c2],
    isHoveredOrClicked,
}) {
    const isFavorite = Boolean(book.favorite || book.isFavorite);
    const isReading = book.status === "reading";
    const isFinished = book.status === "finished";

    return (
        <>
            {/* Main spine — MATTE finish */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    /*
                     * Matte spine: only subtle edge darkening, no harsh specular.
                     * Left 10% = binding edge (slightly darker)
                     * Center     = flat base color
                     * Right 8%   = far edge (slight shadow)
                     */
                    background: `linear-gradient(to right,
                        ${c2} 0%,
                        rgba(0,0,0,0.14) 9%,
                        ${c0} 18%,
                        ${c1} 78%,
                        rgba(0,0,0,0.10) 93%,
                        ${c2} 100%)`,
                    borderRadius: "1px 2px 2px 1px",
                    boxShadow: isHoveredOrClicked
                        ? "1px 0 10px rgba(0,0,0,0.45)"
                        : "1px 0 4px rgba(0,0,0,0.28)",
                    overflow: "hidden",
                }}
            >
                {/* Canvas / cloth weave texture — dominant for tactile matte book look */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.14,
                        backgroundImage: `
                            repeating-linear-gradient(0deg,
                                transparent, transparent 1px,
                                rgba(0,0,0,0.55) 1px, rgba(0,0,0,0.55) 2px),
                            repeating-linear-gradient(90deg,
                                transparent, transparent 1px,
                                rgba(255,255,255,0.18) 1px, rgba(255,255,255,0.18) 2px)
                        `,
                    }}
                />

                {/* Very soft top/bottom edge highlights & shadows */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: "rgba(255,255,255,0.12)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "rgba(0,0,0,0.30)",
                    }}
                />

                {/* Subtle decorative embossed bands */}
                <div
                    style={{
                        position: "absolute",
                        top: 6,
                        left: 1,
                        right: 3,
                        height: 1,
                        background: "rgba(0,0,0,0.18)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 6,
                        left: 1,
                        right: 3,
                        height: 1,
                        background: "rgba(0,0,0,0.18)",
                    }}
                />

                {/* Page-edge on the right side */}
                <div
                    style={{
                        position: "absolute",
                        top: 1,
                        right: 0,
                        bottom: 1,
                        width: 2,
                        background: "linear-gradient(to left,#e8dcc8,#d4c5a9)",
                        opacity: 0.65,
                    }}
                />

                {/* Vertical Book Title */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "14px 2px",
                    }}
                >
                    <span
                        style={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                            transform: "rotate(180deg)",
                            color: "rgba(255,255,255,0.92)",
                            fontSize: bookW <= 22 ? 7.5 : bookW >= 38 ? 9 : 8.5,
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            textShadow: "0 1px 3px rgba(0,0,0,0.85)",
                            maxHeight: bookH - 36,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: bookW <= 22 ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.15,
                        }}
                    >
                        {book.title}
                    </span>
                </div>

                {/* Reading ribbon */}
                {isReading && (
                    <motion.div
                        style={{
                            position: "absolute",
                            top: -10,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 4,
                            height: 22,
                            background: "linear-gradient(180deg,#ef4444,#b91c1c)",
                            borderRadius: "0 0 2px 2px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
                        }}
                        animate={{ scaleY: [1, 1.07, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />
                )}
                {isReading && (
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                        }}
                        animate={{
                            boxShadow: [
                                "inset 0 0 5px rgba(239,68,68,0.15)",
                                "inset 0 0 12px rgba(239,68,68,0.35)",
                                "inset 0 0 5px rgba(239,68,68,0.15)",
                            ],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />
                )}

                {/* Finished status diamond */}
                {isFinished && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 10,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 8,
                            height: 8,
                            background: "linear-gradient(135deg,#fcd34d,#f59e0b)",
                            clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                        }}
                    />
                )}

                {/* Favorite star */}
                {isFavorite && (
                    <div
                        style={{
                            position: "absolute",
                            top: 9,
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    >
                        <Star
                            size={7}
                            style={{
                                fill: "#fde68a",
                                color: "#fde68a",
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Cast shadow on shelf wood board */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    transform: "translateY(100%) scaleY(0.5)",
                    transformOrigin: "top",
                    background:
                        "radial-gradient(ellipse at center top,rgba(0,0,0,0.38) 0%,transparent 100%)",
                    filter: "blur(2px)",
                    zIndex: -1,
                    pointerEvents: "none",
                }}
            />
        </>
    );
});
