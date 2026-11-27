import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import { readingSessionsApi } from "../api/readingSessions.api";
import type {
    StartSessionData,
    EndSessionData,
} from "../api/readingSessions.api";

/**
 * Hook to start a reading session.
 */
export function useStartReadingSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            bookId,
            data,
        }: {
            bookId: string;
            data: StartSessionData;
        }) => readingSessionsApi.startSession(bookId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.readingSessions.book(variables.bookId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.analytics.dashboard(),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.achievements.all,
            });
        },
    });
}

/**
 * Hook to end a reading session.
 */
export function useEndReadingSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            bookId,
            sessionId,
            data,
        }: {
            bookId: string;
            sessionId: string;
            data: EndSessionData;
        }) => readingSessionsApi.endSession(bookId, sessionId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.readingSessions.book(variables.bookId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.analytics.dashboard(),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.achievements.all,
            });
        },
    });
}

/**
 * Hook to pause or resume a reading session.
 */
export function usePauseReadingSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            bookId,
            sessionId,
            isPaused,
        }: {
            bookId: string;
            sessionId: string;
            isPaused: boolean;
        }) => readingSessionsApi.pauseSession(bookId, sessionId, isPaused),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.readingSessions.book(variables.bookId),
            });
        },
    });
}

/**
 * Hook to get reading sessions for a book.
 */
export function useBookReadingSessions(bookId: string) {
    const isDemoBook = !bookId || bookId.startsWith("b");
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.readingSessions.book(bookId),
        queryFn: () => readingSessionsApi.getBookSessions(bookId),
        enabled: !!bookId && !isDemoBook && isAuthenticated,
    });
}

/**
 * Hook to read again (restart finished book).
 */
export function useReadAgain() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookId: string) => readingSessionsApi.readAgain(bookId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.books.detail(variables),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.analytics.dashboard(),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
        },
    });
}
