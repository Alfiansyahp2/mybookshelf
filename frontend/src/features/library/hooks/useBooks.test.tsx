import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/msw/server";
import { createQueryWrapper } from "../../../test/testUtils";
import { useBooks } from "./useBooks";

describe("useBooks", () => {
    it("fetches and transforms raw books for authenticated users with filters", async () => {
        let capturedStatus: string | null = null;

        server.use(
            http.get("http://localhost:8000/api/v1/books", ({ request }) => {
                const url = new URL(request.url);
                capturedStatus = url.searchParams.get("status");

                return HttpResponse.json({
                    success: true,
                    data: {
                        data: [
                            {
                                id: "book-1",
                                user_id: "user-1",
                                shelf_id: "shelf-1",
                                title: "Clean Architecture",
                                author: "Robert C. Martin",
                                isbn: null,
                                genre: "Software",
                                language: "en",
                                publisher: null,
                                publish_year: 2017,
                                pages: 432,
                                format: "paperback",
                                height: "medium",
                                thickness: "medium",
                                status: "reading",
                                spine_color_light: "#D4B499",
                                spine_color_medium: "#A67C52",
                                spine_color_dark: "#6F4E37",
                                cover_image: null,
                                position: 1,
                                favorite: true,
                                current_page: 216,
                                progress: "50.00",
                                started_date: null,
                                finished_date: null,
                                estimated_start_date: null,
                                borrowed_by: null,
                                borrowed_date: null,
                                due_date: null,
                                is_returned: true,
                                personal_notes: null,
                                personal_rating: 5,
                                purchase_date: null,
                                purchase_price: 250000,
                                purchase_currency: "IDR",
                                is_gift: false,
                                purchase_location: null,
                                read_dates: [],
                                date_added: "2026-11-01T00:00:00Z",
                                last_modified: "2026-11-02T00:00:00Z",
                                deleted_at: null,
                            },
                        ],
                        meta: {
                            total: 1,
                            per_page: 24,
                            current_page: 1,
                            last_page: 1,
                        },
                    },
                });
            }),
        );

        const { result } = renderHook(() => useBooks({ status: "reading" }), {
            wrapper: createQueryWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(capturedStatus).toBe("reading");
        expect(result.current.data?.data.data).toHaveLength(1);
        expect(result.current.data?.data.data[0].title).toBe("Clean Architecture");
        expect(result.current.data?.data.data[0].progress).toBe(50);
    });

    it("does not query books when user is unauthenticated", async () => {
        let booksRequested = false;

        server.use(
            http.get("http://localhost:8000/api/v1/auth/me", () =>
                HttpResponse.json({ message: "Unauthenticated" }, { status: 401 }),
            ),
            http.get("http://localhost:8000/api/v1/books", () => {
                booksRequested = true;
                return HttpResponse.json({ success: true, data: { data: [] } });
            }),
        );

        const { result } = renderHook(() => useBooks(), {
            wrapper: createQueryWrapper(),
        });

        await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));
        expect(booksRequested).toBe(false);
    });
});
