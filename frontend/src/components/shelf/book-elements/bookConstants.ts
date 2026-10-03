import type { Book } from "../../../types";

/* ── Realistic height variation by book.height ─── */
export const HEIGHT_RATIO: Record<string, number> = {
    short: 0.72, // ~72% of shelf height
    medium: 0.86,
    tall: 0.96,
};

/* ── Width (spine thickness) ──────────────────── */
export const THICKNESS_PX: Record<string, number> = {
    thin: 18,
    regular: 26,
    thick: 38,
};

export interface StatusConfig {
    dot: string;
    bg: string;
    text: string;
    defaultLabel: string;
}

export const STATUS_CFG: Record<string, StatusConfig> = {
    reading: {
        dot: "#22c55e",
        bg: "#dcfce7",
        text: "#166534",
        defaultLabel: "Sedang Dibaca",
    },
    finished: {
        dot: "#3b82f6",
        bg: "#dbeafe",
        text: "#1e40af",
        defaultLabel: "Selesai",
    },
    unread: {
        dot: "#94a3b8",
        bg: "#f1f5f9",
        text: "#475569",
        defaultLabel: "Belum Dibaca",
    },
    wishlist: {
        dot: "#a855f7",
        bg: "#f3e8ff",
        text: "#6b21a8",
        defaultLabel: "Wishlist",
    },
    borrowed: {
        dot: "#f59e0b",
        bg: "#fef3c7",
        text: "#92400e",
        defaultLabel: "Dipinjam",
    },
};

export const DEFAULT_SPINE_COLORS = ["#8B7355", "#6B5344", "#5C4532"] as const;

/**
 * Calculates physical dimensions (height, width, ratio) of a book on the shelf.
 */
export function getBookDimensions(
    height: string | undefined,
    thickness: string | undefined,
    bookAreaHeight: number
) {
    const ratio = (height && HEIGHT_RATIO[height]) ?? 0.86;
    const bookH = Math.round(bookAreaHeight * ratio);
    const bookW = (thickness && THICKNESS_PX[thickness]) ?? 28;
    return { bookH, bookW, ratio };
}

/**
 * Safely extracts 3-tier spine gradient colors with fallback palette.
 */
export function getSpineColors(book: Book): [string, string, string] {
    const c0 = book.spineColors?.[0] || DEFAULT_SPINE_COLORS[0];
    const c1 = book.spineColors?.[1] || DEFAULT_SPINE_COLORS[1];
    const c2 = book.spineColors?.[2] || DEFAULT_SPINE_COLORS[2];
    return [c0, c1, c2];
}
