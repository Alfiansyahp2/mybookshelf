import { apiClient } from "@shared/api/apiClient";
import type { Collection } from "@shared/types";
import { transformBook, type RawBook } from "./books.api";

interface RawCollection {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    progress: string | number;
    created_at?: string;
    createdAt?: string;
    books?: RawBook[];
    bookIds?: string[];
}

function transformCollection(raw: RawCollection): Collection {
    const books = raw.books ? raw.books.map(transformBook) : [];
    const bookIds = raw.bookIds ?? books.map((b) => b.id);
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description || "",
        bookIds,
        books,
        color: raw.color || "#7A5C42",
        icon: raw.icon || "📚",
        createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
        progress: Number(raw.progress) || 0,
    };
}

export const collectionsApi = {
    async getCollections(): Promise<Collection[]> {
        const response = await apiClient.get("/v1/collections");
        const items: RawCollection[] =
            response.data?.data || response.data || [];
        return items.map(transformCollection);
    },

    async getCollection(id: string): Promise<Collection> {
        const response = await apiClient.get(`/v1/collections/${id}`);
        return transformCollection(response.data?.data || response.data);
    },

    async createCollection(
        collectionData: Partial<Collection>,
    ): Promise<Collection> {
        const response = await apiClient.post("/v1/collections", collectionData);
        return transformCollection(response.data?.data || response.data);
    },

    async updateCollection(
        id: string,
        updates: Partial<Collection>,
    ): Promise<Collection> {
        const response = await apiClient.patch(
            `/v1/collections/${id}`,
            updates,
        );
        return transformCollection(response.data?.data || response.data);
    },

    async deleteCollection(id: string): Promise<void> {
        await apiClient.delete(`/v1/collections/${id}`);
    },

    async addBookToCollection(
        collectionId: string,
        bookId: string,
    ): Promise<Collection> {
        const response = await apiClient.post(
            `/v1/collections/${collectionId}/books`,
            { book_id: bookId },
        );
        return transformCollection(response.data?.data || response.data);
    },

    async removeBookFromCollection(
        collectionId: string,
        bookId: string,
    ): Promise<Collection> {
        const response = await apiClient.delete(
            `/v1/collections/${collectionId}/books/${bookId}`,
        );
        return transformCollection(response.data?.data || response.data);
    },
};
