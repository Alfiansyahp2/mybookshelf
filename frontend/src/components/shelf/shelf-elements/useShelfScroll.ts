import { useState, useRef, useEffect, useCallback } from "react";
import type { Book as BookType } from "../../../types";

export function useShelfScroll(books: BookType[]) {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const booksTrackRef = useRef<HTMLDivElement>(null);

    const checkScroll = useCallback(() => {
        if (booksTrackRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = booksTrackRef.current;
            setCanScrollLeft(scrollLeft > 6);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
        }
    }, []);

    const handleTrackScroll = useCallback(() => {
        checkScroll();
    }, [checkScroll]);

    useEffect(() => {
        checkScroll();
        const el = booksTrackRef.current;
        if (el) {
            const observer = new ResizeObserver(() => checkScroll());
            observer.observe(el);
            return () => observer.disconnect();
        }
    }, [books, checkScroll]);

    return {
        booksTrackRef,
        canScrollLeft,
        canScrollRight,
        handleTrackScroll,
    };
}
