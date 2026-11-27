import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import type { Collection } from "@shared/types";
import { collectionsApi } from "../api/collections.api";

export function useCollections() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.collections.all,
        queryFn: () => collectionsApi.getCollections(),
        enabled: isAuthenticated,
    });
}

export function useCollection(id: string) {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.collections.detail(id),
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
            queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
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
            queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.collections.detail(variables.id),
            });
        },
    });
}

export function useDeleteCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => collectionsApi.deleteCollection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
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
            queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.collections.detail(variables.collectionId),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
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
            queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.collections.detail(variables.collectionId),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
        },
    });
}
