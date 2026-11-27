import { useMemo } from "react";
import type { Book } from "@shared/types";

export const getBookYears = (b: Book): number[] => {
    const years = new Set<number>();
    if (b.finishedDate) years.add(new Date(b.finishedDate).getFullYear());
    if (b.startedDate) years.add(new Date(b.startedDate).getFullYear());
    if (b.readDates && Array.isArray(b.readDates)) {
        b.readDates.forEach((d: string) =>
            years.add(new Date(d).getFullYear()),
        );
    }
    if (
        years.size === 0 &&
        (b.status === "reading" || b.status === "finished")
    ) {
        years.add(new Date(b.lastModified || b.dateAdded).getFullYear());
    }
    return Array.from(years);
};

export interface YearlyStat {
    year: number;
    finished: number;
    totalPages: number;
    pagesRead: number;
    readPct: number;
    goalPct: number;
}

export function useYearlyStats(allBooks: Book[]) {
    return useMemo(() => {
        const activeYears = Array.from(
            new Set(allBooks.flatMap(getBookYears)),
        );
        activeYears.sort((a, b) => b - a);

        const yearlyStats: YearlyStat[] = activeYears.map((year) => {
            const booksThisYear = allBooks.filter((b: Book) =>
                getBookYears(b).includes(year),
            );
            const finishedThisYear = booksThisYear.filter((b: Book) => {
                if (b.status === "finished" && b.finishedDate) {
                    return new Date(b.finishedDate).getFullYear() === year;
                }
                if (b.status === "finished" && !b.finishedDate) {
                    if (b.readDates && Array.isArray(b.readDates)) {
                        return b.readDates.some(
                            (d: string) => new Date(d).getFullYear() === year,
                        );
                    }
                    return (
                        new Date(
                            b.lastModified || b.dateAdded,
                        ).getFullYear() === year
                    );
                }
                return false;
            }).length;

            const totalPages = booksThisYear.reduce(
                (s: number, b: Book) => s + (b.pages || 0),
                0,
            );
            const pagesRead = booksThisYear.reduce((s: number, b: Book) => {
                if (b.status === "finished") return s + (b.pages || 0);
                return s + (b.currentPage || 0);
            }, 0);
            const readPct =
                totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;
            const goalPct = Math.min((finishedThisYear / 12) * 100, 100);

            return {
                year,
                finished: finishedThisYear,
                totalPages,
                pagesRead,
                readPct,
                goalPct,
            };
        });

        return { activeYears, yearlyStats };
    }, [allBooks]);
}
