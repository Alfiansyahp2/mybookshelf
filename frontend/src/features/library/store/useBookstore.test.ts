import { beforeEach, describe, expect, it } from "vitest";
import type { Shelf } from "@shared/types";
import { useBookstore } from "./useBookstore";

describe("useBookstore", () => {
    beforeEach(() => {
        useBookstore.setState({
            selectedBookId: null,
            isBookDetailOpen: false,
            editingShelf: null,
            sidebarCollapsed: false,
            searchQuery: "",
            activeFilter: "all",
        });
    });

    it("opens and closes book detail modal state cleanly", () => {
        useBookstore.getState().toggleBookDetail("book-123");

        expect(useBookstore.getState().selectedBookId).toBe("book-123");
        expect(useBookstore.getState().isBookDetailOpen).toBe(true);

        useBookstore.getState().closeBookDetail();

        expect(useBookstore.getState().selectedBookId).toBeNull();
        expect(useBookstore.getState().isBookDetailOpen).toBe(false);
    });

    it("tracks editing shelf, filter, search query, and sidebar state", () => {
        const shelf: Shelf = {
            id: "shelf-1",
            name: "Philosophy",
            capacity: 15,
            order: 0,
            span: 12,
        };

        useBookstore.getState().openEditShelf(shelf);
        useBookstore.getState().setSearchQuery("Sapiens");
        useBookstore.getState().setActiveFilter("reading");
        useBookstore.getState().toggleSidebar();

        expect(useBookstore.getState().editingShelf).toEqual(shelf);
        expect(useBookstore.getState().searchQuery).toBe("Sapiens");
        expect(useBookstore.getState().activeFilter).toBe("reading");
        expect(useBookstore.getState().sidebarCollapsed).toBe(true);

        useBookstore.getState().closeEditShelf();
        expect(useBookstore.getState().editingShelf).toBeNull();
    });
});
