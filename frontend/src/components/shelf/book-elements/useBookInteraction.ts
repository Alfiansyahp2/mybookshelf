import { useState, useEffect, useRef, useCallback } from "react";

interface UseBookInteractionOptions {
    isDrawerOpen?: boolean;
    onClick: () => void;
}

export function useBookInteraction({
    isDrawerOpen,
    onClick,
}: UseBookInteractionOptions) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);
    const hasLongPressed = useRef(false);
    const bookRef = useRef<HTMLDivElement>(null);

    // Sync drawer open state to clicked animation state
    useEffect(() => {
        if (isDrawerOpen) {
            setClicked(true);
        } else {
            const t = setTimeout(() => setClicked(false), 400);
            return () => clearTimeout(t);
        }
    }, [isDrawerOpen]);

    // Handle click/touch outside to close tooltip
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (bookRef.current && !bookRef.current.contains(event.target as Node)) {
                setHovered(false);
            }
        };

        if (hovered) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [hovered]);

    // Mobile touch long-press detection (400ms) for tooltip preview
    const handleTouchStart = useCallback(() => {
        hasLongPressed.current = false;
        touchTimer.current = setTimeout(() => {
            setHovered(true);
            hasLongPressed.current = true;
        }, 400);
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (touchTimer.current) clearTimeout(touchTimer.current);
    }, []);

    const handleTouchMove = useCallback(() => {
        if (touchTimer.current) clearTimeout(touchTimer.current);
    }, []);

    const handleBookClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (hasLongPressed.current) {
                hasLongPressed.current = false;
                return;
            }
            onClick();
        },
        [onClick]
    );

    return {
        bookRef,
        hovered,
        setHovered,
        clicked,
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove,
        handleBookClick,
    };
}
