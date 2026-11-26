import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readingSessionsApi } from "../lib/api/readingSessions";
import { useAuthUser } from "./useAuth";
import type {
    StartSessionData,
    EndSessionData,
} from "../lib/api/readingSessions";

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
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({
                queryKey: ["books", variables.bookId],
            });
            queryClient.invalidateQueries({
                queryKey: ["reading-sessions", variables.bookId],
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
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({
                queryKey: ["books", variables.bookId],
            });
            queryClient.invalidateQueries({
                queryKey: ["reading-sessions", variables.bookId],
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
                queryKey: ["reading-sessions", variables.bookId],
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
        queryKey: ["reading-sessions", bookId],
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
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["books", variables] });
        },
    });
}
