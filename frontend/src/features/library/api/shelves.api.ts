import { apiClient } from "@shared/api/apiClient";
import type { Shelf, ShelfOccupancy } from "@shared/types";
import { transformBook, type RawBook } from "./books.api";

interface RawShelf extends Omit<Shelf, "books"> {
    books?: RawBook[];
}

function transformShelf(raw: RawShelf): Shelf {
    return {
        ...raw,
        books: raw.books ? raw.books.map(transformBook) : [],
    };
}

export const shelvesApi = {
    async getShelves(): Promise<Shelf[]> {
        const response = await apiClient.get("/v1/shelves");
        const shelves: RawShelf[] = response.data?.data || response.data || [];
        return shelves.map(transformShelf);
    },

    async getShelf(id: string): Promise<Shelf> {
        const response = await apiClient.get(`/v1/shelves/${id}`);
        const raw: RawShelf = response.data?.data || response.data;
        return transformShelf(raw);
    },

    async createShelf(shelfData: Partial<Shelf>): Promise<Shelf> {
        const response = await apiClient.post("/v1/shelves", shelfData);
        return response.data?.data || response.data;
    },

    async updateShelf(id: string, updates: Partial<Shelf>): Promise<Shelf> {
        const response = await apiClient.patch(`/v1/shelves/${id}`, updates);
        return response.data?.data || response.data;
    },

    async updateLayout(
        shelves: { id: string; order: number; span: number }[],
    ): Promise<void> {
        await apiClient.put("/v1/shelves/layout", { shelves });
    },

    async deleteShelf(id: string): Promise<void> {
        await apiClient.delete(`/v1/shelves/${id}`);
    },

    async getOccupancy(id: string): Promise<ShelfOccupancy> {
        const response = await apiClient.get(`/v1/shelves/${id}/occupancy`);
        return response.data?.data || response.data;
    },
};
