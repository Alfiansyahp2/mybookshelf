import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/msw/server";
import { createQueryWrapper } from "../../../test/testUtils";
import { useYearlyStats } from "./useYearlyStats";

describe("useYearlyStats", () => {
    it("transforms dashboard summary yearly_stats into camelCase YearlyStat rows", async () => {
        server.use(
            http.get("http://localhost:8000/api/v1/analytics/dashboard", () =>
                HttpResponse.json({
                    success: true,
                    message: "Success",
                    data: {
                        overview: {
                            total: 10,
                            reading: 2,
                            finished: 6,
                            unread: 2,
                            wishlist: 0,
                            borrowed: 0,
                            favorites: 3,
                            noted_count: 4,
                            overdue_count: 0,
                            available_to_loan_count: 8,
                            added_this_month: 2,
                            finished_this_year: 6,
                            current_year: 2026,
                            target: 12,
                            total_pages: 3000,
                            pages_read: 2100,
                            reading_pages_read: 300,
                            reading_total_pages: 600,
                            avg_rating: 4.5,
                            top_genre: "Engineering",
                            shelves_count: 2,
                        },
                        yearly_stats: [
                            {
                                year: 2026,
                                finished: 6,
                                total_pages: 3000,
                                pages_read: 2100,
                                read_pct: 70,
                                goal_pct: 50,
                            },
                            {
                                year: 2025,
                                finished: 12,
                                total_pages: 4200,
                                pages_read: 4200,
                                read_pct: 100,
                                goal_pct: 100,
                            },
                        ],
                        genre_chart: [],
                        author_chart: [],
                        status_counts: {
                            reading: 2,
                            finished: 6,
                            unread: 2,
                            wishlist: 0,
                            borrowed: 0,
                        },
                        currently_reading: [],
                        top_read_books: [],
                        recent_books: [],
                        recently_finished: [],
                        book_colors: [],
                        daily_activity: [],
                        activity_books: [],
                        generated_at: "2026-11-28T00:00:00Z",
                    },
                }),
            ),
        );

        const { result } = renderHook(() => useYearlyStats(), {
            wrapper: createQueryWrapper(),
        });

        await waitFor(() =>
            expect(result.current.activeYears).toEqual([2026, 2025]),
        );

        expect(result.current.yearlyStats).toEqual([
            {
                year: 2026,
                finished: 6,
                totalPages: 3000,
                pagesRead: 2100,
                readPct: 70,
                goalPct: 50,
            },
            {
                year: 2025,
                finished: 12,
                totalPages: 4200,
                pagesRead: 4200,
                readPct: 100,
                goalPct: 100,
            },
        ]);
    });
});
