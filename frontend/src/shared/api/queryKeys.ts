import type { BookStatus } from "@shared/types";

export interface BooksFilterKey {
    status?: BookStatus;
    favorite?: boolean;
    search?: string;
}

export const queryKeys = {
    auth: {
        all: ["auth"] as const,
        user: () => [...queryKeys.auth.all, "user"] as const,
    },
    books: {
        all: ["books"] as const,
        list: (filters?: BooksFilterKey) =>
            filters ? ([...queryKeys.books.all, filters] as const) : queryKeys.books.all,
        detail: (id: string) => [...queryKeys.books.all, id] as const,
        timeline: (id: string) => [...queryKeys.books.all, id, "timeline"] as const,
        purchaseHistory: (months?: number) =>
            months !== undefined
                ? (["books", "purchase-history", months] as const)
                : (["books", "purchase-history"] as const),
    },
    shelves: {
        all: ["shelves"] as const,
        detail: (id: string) => [...queryKeys.shelves.all, id] as const,
        occupancy: (id: string) =>
            [...queryKeys.shelves.all, id, "occupancy"] as const,
    },
    collections: {
        all: ["collections"] as const,
        detail: (id: string) => [...queryKeys.collections.all, id] as const,
    },
    readingSessions: {
        all: ["reading-sessions"] as const,
        book: (bookId: string) =>
            [...queryKeys.readingSessions.all, "book", bookId] as const,
    },
    statistics: {
        all: ["statistics"] as const,
    },
    achievements: {
        all: ["achievements"] as const,
    },
    accounting: {
        expenses: (filters?: Record<string, unknown>) =>
            filters
                ? (["accounting", "expenses", filters] as const)
                : (["accounting", "expenses"] as const),
        expense: (id: string) => ["accounting", "expenses", id] as const,
        categories: () => ["accounting", "categories"] as const,
        category: (id: string) => ["accounting", "categories", id] as const,
        budgets: (filters?: Record<string, unknown>) =>
            filters
                ? (["accounting", "budgets", filters] as const)
                : (["accounting", "budgets"] as const),
        budget: (id: string) => ["accounting", "budgets", id] as const,
        currencyRates: () => ["accounting", "currency", "rates"] as const,
        reports: () => ["accounting", "reports"] as const,
    },
} as const;
