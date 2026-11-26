export const BRAND = {
    cream: "#F8F5F0",
    walnut: "#7A5C42",
    darkBrown: "#4A3B2F",
    gold: "#D4A574",
    beige: "#E8E0D5",
} as const;

export const STATUS_CFG = {
    reading: {
        label: "Dibaca",
        color: "#10b981",
        bg: "#d1fae5",
        dark: "#065f46",
    },
    finished: {
        label: "Selesai",
        color: "#8b5cf6",
        bg: "#ede9fe",
        dark: "#4c1d95",
    },
    unread: {
        label: "Belum Dibaca",
        color: "#f59e0b",
        bg: "#fef3c7",
        dark: "#78350f",
    },
    wishlist: {
        label: "Wishlist",
        color: "#ec4899",
        bg: "#fce7f3",
        dark: "#831843",
    },
    borrowed: {
        label: "Dipinjam",
        color: "#ef4444",
        bg: "#fee2e2",
        dark: "#7f1d1d",
    },
} as const;

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: EASE_OUT_EXPO },
});

export interface DashboardBookSummary {
    id: string;
    title: string;
    author: string;
    pages: number;
    currentPage: number;
    color: string;
    status: "reading" | "unread";
}

export interface DashboardTopReadBook {
    id: string;
    name: string;
    author: string;
    coverImage?: string;
    personalRating?: number;
    genre: string;
    value: number;
    color: string;
}

export interface DashboardGenreCount {
    name: string;
    count: number;
}

export interface DashboardStatusSlice {
    name: string;
    value: number;
    color: string;
}
