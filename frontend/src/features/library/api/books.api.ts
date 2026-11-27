import { apiClient } from "@shared/api/apiClient";
import type { ApiResponse, Book, BookStatus, TimelineEvent } from "@shared/types";

export interface BooksListResponse {
    data: {
        data: Book[];
        meta: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
            from?: number;
            to?: number;
        };
    };
}

// Raw API Book type (snake_case from Laravel)
export interface RawBook {
    id: string;
    user_id: string;
    shelf_id: string | null;
    title: string;
    author: string;
    isbn: string | null;
    genre: string | null;
    language: string | null;
    publisher: string | null;
    publish_year: number | null;
    pages: number;
    format: string;
    height: string;
    thickness: string;
    status: string;
    spine_color_light: string;
    spine_color_medium: string;
    spine_color_dark: string;
    cover_image: string | null;
    position: number;
    favorite: boolean;
    current_page: number | null;
    progress: string | number;
    started_date: string | null;
    finished_date: string | null;
    estimated_start_date: string | null;
    borrowed_by: string | null;
    borrowed_date: string | null;
    due_date: string | null;
    is_returned: boolean;
    personal_notes: string | null;
    personal_rating: number | null;
    purchase_date: string | null;
    purchase_price: string | number | null;
    purchase_currency: string | null;
    is_gift: boolean;
    purchase_location: string | null;
    read_dates: string[] | null;
    date_added: string;
    last_modified: string;
    deleted_at: string | null;
}

export function transformBook(raw: RawBook): Book {
    return {
        id: raw.id,
        title: raw.title,
        author: raw.author,
        isbn: raw.isbn || "",
        genre: raw.genre || "",
        language: raw.language || "",
        publisher: raw.publisher || "",
        publishYear: raw.publish_year || 0,
        pages: raw.pages || 0,
        format: raw.format as Book["format"],
        spineColors: [
            raw.spine_color_light,
            raw.spine_color_medium,
            raw.spine_color_dark,
        ] as [string, string, string],
        height: raw.height as Book["height"],
        thickness: raw.thickness as Book["thickness"],
        coverImage: raw.cover_image || undefined,
        status: raw.status as BookStatus,
        favorite: raw.favorite,
        isFavorite: raw.favorite,
        currentPage: raw.current_page || undefined,
        progress: Number(raw.progress) || 0,
        startedDate: raw.started_date || undefined,
        finishedDate: raw.finished_date || undefined,
        estimatedStartDate: raw.estimated_start_date || undefined,
        readDates: raw.read_dates || [],
        borrowedBy: raw.borrowed_by || undefined,
        borrowedDate: raw.borrowed_date || undefined,
        dueDate: raw.due_date || undefined,
        isReturned: raw.is_returned,
        personalNotes: raw.personal_notes || undefined,
        personalRating: raw.personal_rating ? Number(raw.personal_rating) : undefined,
        purchaseDate: raw.purchase_date || undefined,
        purchasePrice:
            raw.purchase_price !== null && raw.purchase_price !== undefined
                ? Number(raw.purchase_price)
                : undefined,
        purchaseCurrency: raw.purchase_currency || undefined,
        isGift: raw.is_gift || false,
        purchaseLocation: raw.purchase_location || undefined,
        shelfId: raw.shelf_id || undefined,
        position: raw.position,
        dateAdded: raw.date_added,
        lastModified: raw.last_modified,
    };
}

export const booksApi = {
    async getBooks(filters?: {
        status?: BookStatus;
        favorite?: boolean;
        search?: string;
    }): Promise<BooksListResponse> {
        const params = new URLSearchParams();
        if (filters?.status) params.append("status", filters.status);
        if (filters?.favorite !== undefined)
            params.append("favorite", String(filters.favorite));
        if (filters?.search) params.append("search", filters.search);

        const queryString = params.toString();
        const url = `/v1/books${queryString ? `?${queryString}` : ""}`;
        const response = await apiClient.get(url);
        const booksData: RawBook[] = response.data?.data || response.data || [];

        return {
            data: {
                data: booksData.map(transformBook),
                meta: {
                    total: response.data?.total || response.total || 0,
                    per_page:
                        response.data?.per_page || response.per_page || 15,
                    current_page:
                        response.data?.current_page ||
                        response.current_page ||
                        1,
                    last_page:
                        response.data?.last_page || response.last_page || 1,
                    from: response.data?.from || response.from,
                    to: response.data?.to || response.to,
                },
            },
        };
    },

    async getBook(id: string): Promise<ApiResponse<Book>> {
        const response = await apiClient.get(`/v1/books/${id}`);
        const bookData: RawBook = response.data?.data || response.data;
        return {
            success: true,
            message: "Book retrieved successfully",
            data: transformBook(bookData),
        };
    },

    async createBook(bookData: Partial<Book>): Promise<ApiResponse<Book>> {
        const apiData: Record<string, unknown> = {
            title: bookData.title,
            author: bookData.author,
            shelf_id: bookData.shelfId,
            isbn: bookData.isbn,
            genre: bookData.genre,
            language: bookData.language,
            publisher: bookData.publisher,
            publish_year: bookData.publishYear,
            pages: bookData.pages,
            format: bookData.format,
            height: bookData.height,
            thickness: bookData.thickness,
            spine_color_light: bookData.spineColors?.[0],
            spine_color_medium: bookData.spineColors?.[1],
            spine_color_dark: bookData.spineColors?.[2],
            status: bookData.status || "unread",
            favorite: false,
            cover_image: bookData.coverImage,
            position: bookData.position || 0,
            purchase_date: bookData.purchaseDate || null,
            purchase_price: bookData.purchasePrice ?? null,
            purchase_currency: bookData.purchaseCurrency || "IDR",
            is_gift: bookData.isGift || false,
            purchase_location: bookData.purchaseLocation || null,
            started_date: bookData.startedDate || null,
            finished_date: bookData.finishedDate || null,
            personal_notes: bookData.personalNotes || null,
            borrowed_by: bookData.borrowedBy || null,
            borrowed_date: bookData.borrowedDate || null,
            due_date: bookData.dueDate || null,
        };

        const response = await apiClient.post("/v1/books", apiData);
        return {
            success: true,
            message: "Book created successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async updateBook(
        id: string,
        updates: Partial<Book>,
    ): Promise<ApiResponse<Book>> {
        const apiData: Record<string, unknown> = {};
        if (updates.title) apiData.title = updates.title;
        if (updates.author) apiData.author = updates.author;
        if (updates.isbn) apiData.isbn = updates.isbn;
        if (updates.genre) apiData.genre = updates.genre;
        if (updates.language) apiData.language = updates.language;
        if (updates.publisher !== undefined)
            apiData.publisher = updates.publisher;
        if (updates.publishYear) apiData.publish_year = updates.publishYear;
        if (updates.pages) apiData.pages = updates.pages;
        if (updates.format) apiData.format = updates.format;
        if (updates.height) apiData.height = updates.height;
        if (updates.thickness) apiData.thickness = updates.thickness;
        if (updates.status) apiData.status = updates.status;
        if (updates.isFavorite !== undefined)
            apiData.favorite = updates.isFavorite;
        if (updates.currentPage !== undefined)
            apiData.current_page = updates.currentPage;
        if (updates.personalNotes !== undefined)
            apiData.personal_notes = updates.personalNotes;
        if (updates.personalRating !== undefined)
            apiData.personal_rating = updates.personalRating;
        if (updates.borrowedBy !== undefined)
            apiData.borrowed_by = updates.borrowedBy || null;
        if (updates.borrowedDate !== undefined)
            apiData.borrowed_date = updates.borrowedDate || null;
        if (updates.dueDate !== undefined)
            apiData.due_date = updates.dueDate || null;
        if (updates.shelfId !== undefined) apiData.shelf_id = updates.shelfId;
        if (updates.readDates) apiData.read_dates = updates.readDates;
        if (updates.startedDate !== undefined)
            apiData.started_date = updates.startedDate || null;
        if (updates.finishedDate !== undefined)
            apiData.finished_date = updates.finishedDate || null;
        if (updates.purchaseDate !== undefined)
            apiData.purchase_date = updates.purchaseDate || null;
        if (updates.purchasePrice !== undefined)
            apiData.purchase_price = updates.purchasePrice ?? null;
        if (updates.purchaseCurrency !== undefined)
            apiData.purchase_currency = updates.purchaseCurrency;
        if (updates.isGift !== undefined) apiData.is_gift = updates.isGift;
        if (updates.purchaseLocation !== undefined)
            apiData.purchase_location = updates.purchaseLocation || null;
        if (updates.spineColors) {
            apiData.spine_color_light = updates.spineColors[0];
            apiData.spine_color_medium = updates.spineColors[1];
            apiData.spine_color_dark = updates.spineColors[2];
        }

        const response = await apiClient.patch(`/v1/books/${id}`, apiData);
        return {
            success: true,
            message: "Book updated successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async deleteBook(id: string): Promise<ApiResponse<null>> {
        await apiClient.delete(`/v1/books/${id}`);
        return {
            success: true,
            message: "Book deleted successfully",
            data: null,
        };
    },

    async startReading(id: string): Promise<ApiResponse<Book>> {
        const response = await apiClient.post(`/v1/books/${id}/start`);
        return {
            success: true,
            message: "Started reading successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async finishReading(id: string): Promise<ApiResponse<Book>> {
        const response = await apiClient.post(`/v1/books/${id}/finish`);
        return {
            success: true,
            message: "Finished reading successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async uploadCover(
        id: string,
        file: File,
    ): Promise<{ cover_image: string }> {
        const formData = new FormData();
        formData.append("cover", file);

        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        const csrfToken = match ? decodeURIComponent(match[1]) : "";

        const API_BASE_URL =
            import.meta.env.VITE_API_URL || "http://localhost:8000/api";

        const response = await fetch(`${API_BASE_URL}/v1/books/${id}/cover`, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": csrfToken,
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    `Upload failed with status ${response.status}`,
            );
        }

        const data = await response.json();
        return data.data || data;
    },

    async updateProgress(
        id: string,
        currentPage: number,
    ): Promise<ApiResponse<Book>> {
        const response = await apiClient.patch(`/v1/books/${id}/progress`, {
            current_page: currentPage,
        });
        return {
            success: true,
            message: "Progress updated successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async toggleFavorite(id: string): Promise<ApiResponse<Book>> {
        const response = await apiClient.patch(`/v1/books/${id}/favorite`);
        return {
            success: true,
            message: "Favorite toggled successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async updateNotes(id: string, notes: string): Promise<ApiResponse<Book>> {
        const response = await apiClient.patch(`/v1/books/${id}/notes`, {
            notes,
        });
        return {
            success: true,
            message: "Notes updated successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async updateRating(id: string, rating: number): Promise<ApiResponse<Book>> {
        const response = await apiClient.patch(`/v1/books/${id}/rating`, {
            rating,
        });
        return {
            success: true,
            message: "Rating updated successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async moveToShelf(
        id: string,
        shelfId: string,
        position?: number,
    ): Promise<ApiResponse<Book>> {
        const response = await apiClient.patch(`/v1/books/${id}/shelf`, {
            shelf_id: shelfId,
            position,
        });
        return {
            success: true,
            message: "Book moved successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async borrowBook(
        id: string,
        borrowedBy: string,
        dueDate: string,
    ): Promise<ApiResponse<Book>> {
        const response = await apiClient.post(`/v1/books/${id}/borrow`, {
            borrowed_by: borrowedBy,
            due_date: dueDate,
        });
        return {
            success: true,
            message: "Book borrowed successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async returnBook(id: string): Promise<ApiResponse<Book>> {
        const response = await apiClient.post(`/v1/books/${id}/return`);
        return {
            success: true,
            message: "Book returned successfully",
            data: transformBook(response.data?.data || response.data),
        };
    },

    async getBookTimeline(id: string): Promise<ApiResponse<TimelineEvent[]>> {
        const response = await apiClient.get(`/v1/books/${id}/timeline`);
        return {
            success: true,
            message: "Timeline retrieved successfully",
            data: response.data || [],
        };
    },
};
