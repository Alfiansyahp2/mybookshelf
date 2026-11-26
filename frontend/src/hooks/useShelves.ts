import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { transformBook, type RawBook } from "../lib/api/books";
import { useAuthUser } from "./useAuth";
import type { Shelf, ShelfOccupancy } from "../types";

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

export function useShelves() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: ["shelves"],
        queryFn: () => shelvesApi.getShelves(),
        enabled: isAuthenticated,
    });
}

export function useCreateShelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shelfData: Partial<Shelf>) =>
            shelvesApi.createShelf(shelfData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shelves"] });
        },
    });
}

export function useUpdateShelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            updates,
        }: {
            id: string;
            updates: Partial<Shelf>;
        }) => shelvesApi.updateShelf(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["shelves"] });
            queryClient.invalidateQueries({
                queryKey: ["shelves", variables.id],
            });
        },
    });
}

export function useUpdateShelfLayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shelves: { id: string; order: number; span: number }[]) =>
            shelvesApi.updateLayout(shelves),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shelves"] });
        },
    });
}

export function useDeleteShelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => shelvesApi.deleteShelf(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shelves"] });
        },
    });
}

export function useShelfOccupancy(id: string) {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: ["shelves", id, "occupancy"],
        queryFn: () => shelvesApi.getOccupancy(id),
        enabled: !!id && isAuthenticated,
    });
}
