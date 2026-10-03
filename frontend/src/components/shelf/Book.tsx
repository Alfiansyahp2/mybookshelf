import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { Book } from "../../types";
import {
    getBookDimensions,
    getSpineColors,
    useBookInteraction,
    BookSpine,
    BookTooltip,
} from "./book-elements";

export interface BookProps {
    book: Book;
    onClick: () => void;
    isDrawerOpen?: boolean;
    bookAreaHeight: number;
}

export function RealisticBook({
    book,
    onClick,
    isDrawerOpen,
    bookAreaHeight,
}: BookProps) {
    const {
        bookRef,
        hovered,
        setHovered,
        clicked,
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove,
        handleBookClick,
    } = useBookInteraction({ isDrawerOpen, onClick });

    const colors = useMemo(() => getSpineColors(book), [book.spineColors]);
    const { bookH, bookW } = useMemo(
        () => getBookDimensions(book.height, book.thickness, bookAreaHeight),
        [book.height, book.thickness, bookAreaHeight]
    );

    const isHoveredOrClicked = hovered || clicked;

    return (
        <div
            ref={bookRef}
            style={{
                position: "relative",
                flexShrink: 0,
                width: bookW,
                height: bookAreaHeight,
                display: "flex",
                alignItems: "flex-end",
                zIndex: isHoveredOrClicked ? 100 : 1,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
        >
            {/* ── Book body ──────────────────────────── */}
            <motion.div
                onClick={handleBookClick}
                style={{
                    width: "100%",
                    height: bookH,
                    cursor: "pointer",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom",
                }}
                animate={
                    clicked
                        ? {
                              y: -(bookAreaHeight * 0.14),
                              rotateY: 10,
                              scale: 1.06,
                              zIndex: 60,
                          }
                        : hovered
                          ? {
                                y: -(bookAreaHeight * 0.06),
                                scale: 1.02,
                                zIndex: 40,
                            }
                          : { y: 0, rotateY: 0, scale: 1, zIndex: 1 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                whileTap={{ scale: 0.97 }}
            >
                <BookSpine
                    book={book}
                    bookW={bookW}
                    bookH={bookH}
                    colors={colors}
                    isHoveredOrClicked={isHoveredOrClicked}
                />
            </motion.div>

            {/* ── Hover / Preview Tooltip ────────────── */}
            <BookTooltip
                book={book}
                colors={colors}
                bookAreaHeight={bookAreaHeight}
                bookH={bookH}
                visible={hovered && !clicked}
            />
        </div>
    );
}

export default React.memo(RealisticBook);
