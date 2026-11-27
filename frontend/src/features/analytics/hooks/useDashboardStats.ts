import { useMemo } from "react";
import type { Book } from "@shared/types";
import { BRAND, STATUS_CFG } from "../constants/dashboardTheme";

export function useDashboardStats(books: Book[]) {
    return useMemo(() => {
        const byStatus = (s: string) =>
            books.filter((b) => b.status === s);
        const reading = byStatus("reading");
        const finished = byStatus("finished");
        const unread = byStatus("unread");
        const wishlist = byStatus("wishlist");
        const borrowed = byStatus("borrowed");
        const favs = books.filter((b) => b.isFavorite || b.favorite);

        const now = new Date();

        const booksReadThisYear = books.filter((b) => {
            let isThisYear = false;
            if (b.finishedDate)
                isThisYear =
                    new Date(b.finishedDate).getFullYear() ===
                    now.getFullYear();
            if (!isThisYear && b.startedDate)
                isThisYear =
                    new Date(b.startedDate).getFullYear() === now.getFullYear();
            if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
                isThisYear = b.readDates.some(
                    (d) => new Date(d).getFullYear() === now.getFullYear(),
                );
            }
            if (!isThisYear && b.status === "reading") {
                isThisYear =
                    new Date(b.lastModified || b.dateAdded).getFullYear() ===
                    now.getFullYear();
            }
            return isThisYear;
        });

        const totalPages = booksReadThisYear.reduce(
            (s, b) => s + (b.pages || 0),
            0,
        );
        const pagesRead = booksReadThisYear.reduce((s, b) => {
            if (b.status === "finished") return s + (b.pages || 0);
            return s + (b.currentPage || 0);
        }, 0);

        const addedThisMonth = books.filter((b) => {
            const d = new Date(b.dateAdded);
            return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
            );
        }).length;

        const finishedThisYear = finished.filter((b) => {
            let isThisYear = false;
            if (b.finishedDate) {
                isThisYear =
                    new Date(b.finishedDate).getFullYear() ===
                    now.getFullYear();
            }
            if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
                isThisYear = b.readDates.some(
                    (d) => new Date(d).getFullYear() === now.getFullYear(),
                );
            }
            return isThisYear;
        }).length;

        const genreCounts: Record<string, number> = {};
        books.forEach((b) => {
            if (b.genre) {
                const genres = b.genre
                    .split(",")
                    .map((g) => g.trim())
                    .filter(Boolean);
                genres.forEach((g) => {
                    genreCounts[g] = (genreCounts[g] || 0) + 1;
                });
            }
        });
        const topGenre =
            Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
            "—";

        const rated = books.filter((b) => Number(b.personalRating) > 0);
        const avgRating = rated.length
            ? rated.reduce((s, b) => s + Number(b.personalRating || 0), 0) /
              rated.length
            : 0;

        const currentlyReading = [
            ...reading.map((b) => ({
                id: b.id,
                title: b.title,
                author: b.author,
                pages: b.pages || 1,
                currentPage: b.currentPage || 0,
                color: b.spineColors?.[0] || BRAND.walnut,
                status: "reading" as const,
            })),
            ...unread.map((b) => ({
                id: b.id,
                title: b.title,
                author: b.author,
                pages: b.pages || 0,
                currentPage: 0,
                color: b.spineColors?.[0] || BRAND.walnut,
                status: "unread" as const,
            })),
        ];

        const recentBooks = [...books]
            .sort(
                (a, b) =>
                    new Date(b.dateAdded).getTime() -
                    new Date(a.dateAdded).getTime(),
            )
            .slice(0, 3);

        const recentlyFinished = [...finished]
            .sort(
                (a, b) =>
                    new Date(b.finishedDate || 0).getTime() -
                    new Date(a.finishedDate || 0).getTime(),
            )
            .slice(0, 4);

        const authorCounts: Record<string, number> = {};
        books.forEach((b) => {
            if (b.author)
                authorCounts[b.author] = (authorCounts[b.author] || 0) + 1;
        });

        return {
            total: books.length,
            reading: reading.length,
            finished: finished.length,
            unread: unread.length,
            wishlist: wishlist.length,
            borrowed: borrowed.length,
            favorites: favs.length,
            totalPages,
            pagesRead,
            addedThisMonth,
            topGenre,
            avgRating: Math.round(avgRating * 10) / 10,
            finishedThisYear,
            currentYear: now.getFullYear(),
            target: 12,
            currentlyReading,
            recentBooks,
            recentlyFinished,
            genreChart: Object.entries(genreCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            authorChart: Object.entries(authorCounts)
                .map(([name, count]) => ({
                    name: name.length > 15 ? name.slice(0, 15) + "…" : name,
                    count,
                }))
                .sort((a, b) => b.count - a.count),
            statusPie: Object.entries(STATUS_CFG)
                .map(([k, v]) => ({
                    name: v.label,
                    value: byStatus(k).length,
                    color: v.color,
                }))
                .filter((d) => d.value > 0),
            topReadBooks: books
                .map((b) => {
                    const count =
                        b.readDates && Array.isArray(b.readDates)
                            ? b.readDates.length
                            : b.status === "finished"
                              ? 1
                              : 0;
                    return {
                        id: b.id,
                        name: b.title || "Unknown Book",
                        author: b.author || "Unknown Author",
                        coverImage: b.coverImage,
                        personalRating: b.personalRating,
                        genre: b.genre,
                        value: count,
                        color: b.spineColors?.[0] || BRAND.walnut,
                    };
                })
                .filter((b) => b.value > 0)
                .sort((a, b) => b.value - a.value)
                .slice(0, 5),
            bookColors: books
                .slice(0, 12)
                .map((b) => b.spineColors?.[0] || "#8B7355"),
        };
    }, [books]);
}

export type DashboardStats = ReturnType<typeof useDashboardStats>;
