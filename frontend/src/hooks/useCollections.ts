import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { transformBook, type RawBook } from "../lib/api/books";
import { useAuthUser } from "./useAuth";
import type { Collection } from "../types";

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

export function useCollections() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: ["collections"],
        queryFn: () => collectionsApi.getCollections(),
        enabled: isAuthenticated,
    });
}

export function useCollection(id: string) {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: ["collections", id],
        queryFn: () => collectionsApi.getCollection(id),
        enabled: !!id && isAuthenticated,
    });
}

export function useCreateCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (collectionData: Partial<Collection>) =>
            collectionsApi.createCollection(collectionData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });
}

export function useUpdateCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            updates,
        }: {
            id: string;
            updates: Partial<Collection>;
        }) => collectionsApi.updateCollection(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({
                queryKey: ["collections", variables.id],
            });
        },
    });
}

export function useDeleteCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => collectionsApi.deleteCollection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });
}

export function useAddBookToCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            collectionId,
            bookId,
        }: {
            collectionId: string;
            bookId: string;
        }) => collectionsApi.addBookToCollection(collectionId, bookId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({
                queryKey: ["collections", variables.collectionId],
            });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}

export function useRemoveBookFromCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            collectionId,
            bookId,
        }: {
            collectionId: string;
            bookId: string;
        }) => collectionsApi.removeBookFromCollection(collectionId, bookId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({
                queryKey: ["collections", variables.collectionId],
            });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}
