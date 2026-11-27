import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const defaultHandlers = [
    http.get("http://localhost:8000/api/v1/auth/me", () => {
        return HttpResponse.json({
            success: true,
            data: {
                user: {
                    id: "user-1",
                    name: "Test Reader",
                    email: "reader@example.com",
                    email_verified_at: "2026-11-01T00:00:00Z",
                },
            },
        });
    }),
    http.get("http://localhost:8000/api/v1/books", () => {
        return HttpResponse.json({
            success: true,
            data: {
                data: [],
                meta: {
                    total: 0,
                    per_page: 24,
                    current_page: 1,
                    last_page: 1,
                },
            },
        });
    }),
    http.get("http://localhost:8000/api/v1/accounting/categories", () => {
        return HttpResponse.json({
            success: true,
            data: [
                {
                    id: "cat-1",
                    name: "Book Purchases",
                    color: "#3B82F6",
                    icon: "📚",
                    is_default: true,
                },
            ],
        });
    }),
    http.get("http://localhost:8000/api/v1/accounting/budgets", () => {
        return HttpResponse.json({
            success: true,
            data: {
                data: [],
                meta: {
                    total: 0,
                    per_page: 15,
                    current_page: 1,
                    last_page: 1,
                },
            },
        });
    }),
];

export const server = setupServer(...defaultHandlers);
