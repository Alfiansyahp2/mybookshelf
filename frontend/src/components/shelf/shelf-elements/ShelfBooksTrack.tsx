import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import RealisticBook from "../Book";
import {
    renderDecoration,
    type ShelfDecoration,
} from "../../decorations/DecorationSystem";
import type { Book as BookType } from "../../../types";
import { BOOK_AREA_H, BOARD_H } from "./shelfConstants";

interface ShelfBooksTrackProps {
    books: BookType[];
    onBookClick?: (book: BookType) => void;
    isDrawerOpen?: boolean;
    selectedBookId?: string | null;
    leftDeco?: ShelfDecoration;
    rightDeco?: ShelfDecoration;
    onOpenDecoPicker: (slot: "left" | "right") => void;
    booksTrackRef: React.RefObject<HTMLDivElement | null>;
    canScrollLeft: boolean;
    canScrollRight: boolean;
    onScroll: () => void;
}

export const ShelfBooksTrack: React.FC<ShelfBooksTrackProps> = React.memo(
    function ShelfBooksTrack({
        books,
        onBookClick,
        isDrawerOpen,
        selectedBookId,
        leftDeco,
        rightDeco,
        onOpenDecoPicker,
        booksTrackRef,
        canScrollLeft,
        canScrollRight,
        onScroll,
    }) {
        const { t } = useTranslation();

        return (
            <div
                style={{
                    position: "absolute",
                    left: 20,
                    right: 20,
                    top: 0,
                    bottom: BOARD_H,
                    zIndex: 15,
                    display: "flex",
                    alignItems: "flex-end",
                    overflow: "hidden", // Keeps books inside the wooden cavity!
                }}
            >
                {/* Scroll Cue (Left) */}
                {canScrollLeft && (
                    <div
                        className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-30 transition-opacity duration-300 flex items-center justify-start pl-1"
                        style={{
                            background:
                                "linear-gradient(to right, rgba(40, 24, 10, 0.75), transparent)",
                        }}
                    >
                        <span className="text-amber-200/90 text-sm font-bold animate-pulse select-none">
                            ‹
                        </span>
                    </div>
                )}

                {/* Scroll Cue (Right) */}
                {canScrollRight && (
                    <div
                        className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-30 transition-opacity duration-300 flex items-center justify-end pr-1"
                        style={{
                            background:
                                "linear-gradient(to left, rgba(40, 24, 10, 0.75), transparent)",
                        }}
                    >
                        <span className="text-amber-200/90 text-sm font-bold animate-pulse select-none">
                            ›
                        </span>
                    </div>
                )}

                {/* Left decoration slot */}
                <div
                    style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems:
                            leftDeco?.kind === "plant_hanging"
                                ? "flex-start"
                                : "flex-end",
                        height: "100%",
                        paddingLeft: 4,
                        paddingRight: 6,
                        cursor: "pointer",
                        position: "relative",
                        minWidth: 8,
                    }}
                    onClick={() => onOpenDecoPicker("left")}
                    title={t("shelf.add_left_deco")}
                >
                    {leftDeco ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                                paddingBottom:
                                    leftDeco.kind === "plant_hanging" ? 0 : 2,
                            }}
                        >
                            {renderDecoration(leftDeco)}
                        </motion.div>
                    ) : (
                        <div
                            style={{
                                width: 22,
                                height: 40,
                                border: "1.5px dashed rgba(255,210,100,0.3)",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,200,80,0.06)",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(255,200,80,0.14)";
                                e.currentTarget.style.borderColor =
                                    "rgba(255,210,100,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(255,200,80,0.06)";
                                e.currentTarget.style.borderColor =
                                    "rgba(255,210,100,0.3)";
                            }}
                        >
                            <Sparkles size={10} color="rgba(255,210,100,0.5)" />
                        </div>
                    )}
                </div>

                {/* Books Track */}
                <div
                    ref={booksTrackRef}
                    onScroll={onScroll}
                    className="hide-scrollbar"
                    style={{
                        flex: 1,
                        height: "calc(100% + 30px)",
                        marginTop: -30,
                        paddingTop: 30,
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1,
                        overflowX: "auto",
                        overflowY: "hidden",
                        perspective: "500px",
                        perspectiveOrigin: "50% 100%",
                        paddingBottom: 2,
                        paddingLeft: 4,
                        paddingRight: 4,
                        WebkitOverflowScrolling: "touch",
                        touchAction: "pan-x",
                        scrollBehavior: "smooth",
                    }}
                >
                    {books.map((book) => {
                        if (book.status === "borrowed") {
                            return (
                                <div
                                    key={book.id}
                                    onClick={() => onBookClick?.(book)}
                                    className="cursor-pointer hover:border-white/40 transition-colors"
                                    style={{
                                        width: 22,
                                        height: BOOK_AREA_H * 0.82,
                                        flexShrink: 0,
                                        background:
                                            "repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 3px,transparent 3px,transparent 7px)",
                                        border: "1px dashed rgba(255,255,255,0.15)",
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 11,
                                            opacity: 0.4,
                                        }}
                                        title={t("shelf.borrowed_by", {
                                            name: book.borrowedBy || "someone",
                                        })}
                                    >
                                        📤
                                    </span>
                                </div>
                            );
                        }
                        return (
                            <RealisticBook
                                key={book.id}
                                book={book}
                                onClick={() => onBookClick?.(book)}
                                isDrawerOpen={
                                    Boolean(isDrawerOpen && selectedBookId === book.id)
                                }
                                bookAreaHeight={BOOK_AREA_H}
                            />
                        );
                    })}
                </div>

                {/* Right decoration slot */}
                <div
                    style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems:
                            rightDeco?.kind === "plant_hanging"
                                ? "flex-start"
                                : "flex-end",
                        height: "100%",
                        paddingLeft: 6,
                        paddingRight: 4,
                        cursor: "pointer",
                        position: "relative",
                        minWidth: 8,
                    }}
                    onClick={() => onOpenDecoPicker("right")}
                    title={t("shelf.add_right_deco")}
                >
                    {rightDeco ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                                paddingBottom:
                                    rightDeco.kind === "plant_hanging" ? 0 : 2,
                            }}
                        >
                            {renderDecoration(rightDeco)}
                        </motion.div>
                    ) : (
                        <div
                            style={{
                                width: 22,
                                height: 40,
                                border: "1.5px dashed rgba(255,210,100,0.3)",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,200,80,0.06)",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(255,200,80,0.14)";
                                e.currentTarget.style.borderColor =
                                    "rgba(255,210,100,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(255,200,80,0.06)";
                                e.currentTarget.style.borderColor =
                                    "rgba(255,210,100,0.3)";
                            }}
                        >
                            <Sparkles size={10} color="rgba(255,210,100,0.5)" />
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
