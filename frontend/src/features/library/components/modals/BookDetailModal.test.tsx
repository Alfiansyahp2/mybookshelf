import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { Book } from "@shared/types";
import { server } from "../../../../test/msw/server";
import { renderWithProviders } from "../../../../test/testUtils";
import BookDetailModal from "./BookDetailModal";

const sampleBook: Book = {
    id: "book-uuid-1",
    title: "Domain-Driven Design",
    author: "Eric Evans",
    isbn: "978-0321125217",
    genre: "Software Architecture",
    language: "en",
    publisher: "Addison-Wesley",
    publishYear: 2003,
    pages: 560,
    format: "hardcover",
    spineColors: ["#D4B499", "#A67C52", "#6F4E37"],
    height: "tall",
    thickness: "thick",
    status: "reading",
    favorite: false,
    isFavorite: false,
    currentPage: 140,
    progress: 25,
    isReturned: true,
    readDates: [],
    dateAdded: "2026-11-01T00:00:00Z",
    lastModified: "2026-11-10T00:00:00Z",
};

describe("BookDetailModal", () => {
    it("renders book metadata and triggers onEdit and favorite mutation", async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();
        let favoritePatched = false;

        server.use(
            http.patch(
                `http://localhost:8000/api/v1/books/${sampleBook.id}/favorite`,
                () => {
                    favoritePatched = true;
                    return HttpResponse.json({
                        success: true,
                        data: { ...sampleBook, favorite: true },
                    });
                },
            ),
        );

        renderWithProviders(
            <BookDetailModal
                book={sampleBook}
                isOpen
                onClose={vi.fn()}
                onEdit={onEdit}
                onDelete={vi.fn()}
            />,
        );

        expect(
            screen.getAllByText("Domain-Driven Design").length,
        ).toBeGreaterThan(0);
        expect(screen.getAllByText("Eric Evans").length).toBeGreaterThan(0);

        const editButtons = screen.getAllByTitle("Edit");
        await user.click(editButtons[0]);
        expect(onEdit).toHaveBeenCalledWith(sampleBook);

        const favoriteButtons = screen.getAllByRole("button", {
            name: /Favorite|Favorit/i,
        });
        await user.click(favoriteButtons[0]);

        await waitFor(() => expect(favoritePatched).toBe(true));
    });
});
