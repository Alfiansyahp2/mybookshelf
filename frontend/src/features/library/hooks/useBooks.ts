import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { queryKeys, type BooksFilterKey } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import { useNotifications } from "@shared/store/useNotificationStore";
import type { Book } from "@shared/types";
import { booksApi } from "../api/books.api";

interface ApiErrorBody {
    message?: string;
}

/**
 * Hook to fetch all books with optional filters.
 */
export function useBooks(filters?: BooksFilterKey) {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.books.list(filters),
        queryFn: () => booksApi.getBooks(filters),
        enabled: isAuthenticated,
    });
}

/**
 * Hook to fetch a single book.
 */
export function useBook(id: string) {
    const isDemoBook = !id || id.startsWith("b");
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.books.detail(id),
        queryFn: () => booksApi.getBook(id),
        enabled: !!id && !isDemoBook && isAuthenticated,
        select: (response) => response.data,
    });
}

/**
 * Hook to create a new book.
 */
export function useCreateBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookData: Partial<Book>) => booksApi.createBook(bookData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.shelves.all });
            useNotifications.getState().addNotification({
                title: "Success",
                message: "Book added successfully",
                type: "success",
            });
        },
        onError: (error: AxiosError<ApiErrorBody>) => {
            const message =
                error.response?.data?.message ||
                "Failed to create book. Please check your inputs.";
            useNotifications.getState().addNotification({
                title: "Validation Error",
                message,
                type: "warning",
            });
        },
    });
}

/**
 * Hook to update a book.
 */
export function useUpdateBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Book> }) =>
            booksApi.updateBook(id, updates),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(id) });
            useNotifications.getState().addNotification({
                title: "Success",
                message: "Book updated successfully",
                type: "success",
            });
        },
        onError: (error: AxiosError<ApiErrorBody>) => {
            const message =
                error.response?.data?.message ||
                "Failed to update book. Please check your inputs.";
            useNotifications.getState().addNotification({
                title: "Validation Error",
                message,
                type: "warning",
            });
        },
    });
}

/**
 * Hook to delete a book.
 */
export function useDeleteBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => booksApi.deleteBook(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.shelves.all });
        },
    });
}

/**
 * Hook to start reading a book.
 */
export function useStartReading() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => booksApi.startReading(id),
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(bookId),
            });
        },
    });
}

/**
 * Hook to finish reading a book.
 */
export function useFinishReading() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => booksApi.finishReading(id),
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(bookId),
            });
        },
    });
}

/**
 * Hook to upload a book cover image.
 */
export function useUploadCover() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) =>
            booksApi.uploadCover(id, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to update reading progress.
 */
export function useUpdateProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            currentPage,
        }: {
            id: string;
            currentPage: number;
        }) => booksApi.updateProgress(id, currentPage),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to toggle favorite status.
 */
export function useToggleFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => booksApi.toggleFavorite(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.list({ favorite: true }),
            });
        },
    });
}

/**
 * Hook to update personal notes.
 */
export function useUpdateNotes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, notes }: { id: string; notes: string }) =>
            booksApi.updateNotes(id, notes),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to update personal rating.
 */
export function useUpdateRating() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, rating }: { id: string; rating: number }) =>
            booksApi.updateRating(id, rating),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to move book to different shelf.
 */
export function useMoveToShelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            shelfId,
            position,
        }: {
            id: string;
            shelfId: string;
            position?: number;
        }) => booksApi.moveToShelf(id, shelfId, position),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.shelves.all });
        },
    });
}

/**
 * Hook to borrow book to someone.
 */
export function useBorrowBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            borrowedBy,
            dueDate,
        }: {
            id: string;
            borrowedBy: string;
            dueDate: string;
        }) => booksApi.borrowBook(id, borrowedBy, dueDate),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to return borrowed book.
 */
export function useReturnBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => booksApi.returnBook(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables),
            });
        },
    });
}

/**
 * Hook to get book timeline.
 */
export function useBookTimeline(id: string) {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.books.timeline(id),
        queryFn: () => booksApi.getBookTimeline(id),
        enabled: !!id && isAuthenticated,
    });
}
