import type { Book as BookType } from "../../../types";

/* ── Dimensions ─────────────────────────────────── */
export const BOOK_AREA_H = 200; // book cavity height
export const BOARD_H = 14;      // shelf board thickness
export const INFO_H = 32;       // info strip below board

/* ── Wood palette (warm teak) ───────────────────── */
export const WOOD = {
    // Back wall: visible warm teak grain — NOT black
    back: "linear-gradient(180deg, #b8844a 0%, #a87038 50%, #926030 100%)",
    backDark: "linear-gradient(180deg, #9a6e3a 0%, #8a5e2c 50%, #7a5025 100%)",
    // Shelf board top face
    board: "linear-gradient(180deg, #d4a464 0%, #bc8c48 30%, #a07030 65%, #845020 100%)",
    // Side panels
    side: "linear-gradient(to right, #6a4018 0%, #8a5a28 45%, #7a4e20 70%, #5a3410 100%)",
    sideR: "linear-gradient(to left,  #6a4018 0%, #8a5a28 45%, #7a4e20 70%, #5a3410 100%)",
    // Info strip
    info: "linear-gradient(180deg, #3a2008 0%, #2c1606 100%)",
} as const;

export const SIDE_GRAIN_Y = [14, 32, 52, 80, 115, 154, 186] as const;
export const VERTICAL_GRAINS = [8, 16, 24, 33, 42, 51, 60, 69, 78, 87, 94] as const;
export const HORIZONTAL_GRAINS = [30, 80, 130, 170] as const;
export const BOARD_GRAINS = [6, 18, 32, 48, 65, 82, 93] as const;

/**
 * Calculates occupied books count, capacity percentage, and status color.
 */
export function getShelfCapacity(books: BookType[], capacity: number) {
    const occupied = books.filter((b) => b.status !== "borrowed").length;
    const safeCapacity = capacity > 0 ? capacity : 1;
    const percentage = Math.min((occupied / safeCapacity) * 100, 100);
    const pctColor =
        percentage >= 90 ? "#f87171" : percentage >= 70 ? "#fbbf24" : "#34d399";

    return { occupied, percentage, pctColor };
}
