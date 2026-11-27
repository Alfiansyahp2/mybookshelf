import {
    useQuery,
    useMutation,
    useQueryClient,
    type QueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { queryKeys, type BooksFilterKey } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import { useNotifications } from "@shared/store/useNotificationStore";
import type { Book } from "@shared/types";
import { booksApi } from "../api/books.api";

interface ApiErrorBody {
    message?: string;
}

function invalidateDerivedAnalytics(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
    queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
}

/**
 * Hook to fetch paginated books with optional server-side filters.
 */
export function useBooks(
    filters?: BooksFilterKey,
    options?: { enabled?: boolean },
) {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.books.list(filters),
        queryFn: ({ signal }) => booksApi.getBooks(filters, signal),
        enabled: isAuthenticated && (options?.enabled ?? true),
    });
}

/**
 * Hook to fetch a single book.
 */
export function useBook(id: string, options?: { enabled?: boolean }) {
    const isDemoBook = !id || id.startsWith("b");
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.books.detail(id),
        queryFn: () => booksApi.getBook(id),
        enabled: !!id && !isDemoBook && isAuthenticated && (options?.enabled ?? true),
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
            invalidateDerivedAnalytics(queryClient);
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
