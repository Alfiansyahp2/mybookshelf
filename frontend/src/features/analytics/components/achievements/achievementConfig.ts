import {
    Trophy,
    BookOpen,
    Star,
    Crown,
    Heart,
    Sparkles,
    Layers,
    Bookmark,
    CheckCircle,
    Flame,
    Shield,
    Map,
    type LucideIcon,
} from "lucide-react";
import type { TFunction } from "i18next";
import type { Book } from "@shared/types";
import type { Achievement as ApiAchievement } from "../../api/achievements.api";

export const ACHIEVEMENT_BRAND = {
    cream: "#F8F5F0",
    walnut: "#7A5C42",
    darkBrown: "#4A3B2F",
    gold: "#D4A574",
    beige: "#E8E0D5",
} as const;

export const ACHIEVEMENT_ICON_MAP: Record<string, LucideIcon> = {
    BookOpen,
    CheckCircle,
    Trophy,
    Flame,
    Shield,
    Bookmark,
    Crown,
    Layers,
    Map,
    Star,
    Heart,
    Sparkles,
};

export const ACHIEVEMENT_COLOR_MAP: Record<string, string> = {
    common: "#3b82f6",
    rare: "#10b981",
    epic: "#8b5cf6",
    legendary: "#f59e0b",
};

export interface ComputedAchievementItem {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    category: "special" | "collection" | "milestone";
    target: number;
    progress: number;
    unlocked: boolean;
    color: string;
}

export interface LibraryProgressMetrics {
    total: number;
    finished: number;
    wishlist: number;
    favs: number;
    rated: number;
    fiveStar: number;
    pages: number;
    genres: number;
    shelves: number;
}

export function computeLibraryProgressMetrics(
    books: Book[],
    shelvesCount: number,
): LibraryProgressMetrics {
    const finished = books.filter((b) => b.status === "finished");
    const wishlist = books.filter((b) => b.status === "wishlist");
    const favs = books.filter((b) => b.favorite || b.isFavorite);
    const rated = books.filter((b) => (b.personalRating || 0) > 0);
    const fiveStar = books.filter((b) => b.personalRating === 5);
    const pages = finished.reduce((sum, b) => sum + (b.pages || 0), 0);
    const genres = new Set(books.filter((b) => b.genre).map((b) => b.genre));

    return {
        total: books.length,
        finished: finished.length,
        wishlist: wishlist.length,
        favs: favs.length,
        rated: rated.length,
        fiveStar: fiveStar.length,
        pages,
        genres: genres.size,
        shelves: shelvesCount,
    };
}

export function mapApiAchievementsToItems(
    apiAchievements: ApiAchievement[],
    t: TFunction,
): ComputedAchievementItem[] {
    return apiAchievements.map((ach) => {
        const isUnlocked = ach.user_progress?.unlocked || false;
        const progress = ach.user_progress?.current ?? 0;

        return {
            id: ach.id,
            title: t(
                `achievements.data.${ach.title.replace(/\./g, "_")}.title`,
                ach.title,
            ),
            description: t(
                `achievements.data.${ach.description.replace(/\./g, "_")}`,
                ach.description,
            ),
            icon: ACHIEVEMENT_ICON_MAP[ach.icon] || Trophy,
            category:
                ach.category === "special"
                    ? "special"
                    : ach.category === "collections"
                      ? "collection"
                      : "milestone",
            target: ach.requirement,
            progress,
            unlocked: isUnlocked,
            color:
                ACHIEVEMENT_COLOR_MAP[ach.rarity] ||
                ACHIEVEMENT_COLOR_MAP.common,
        };
    });
}
