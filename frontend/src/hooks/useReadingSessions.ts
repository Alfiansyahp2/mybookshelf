import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readingSessionsApi } from '../lib/api/readingSessions';
import type { StartSessionData, EndSessionData } from '../lib/api/readingSessions';

/**
 * Hook to start a reading session
 */
export function useStartReadingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, data }: { bookId: string; data: StartSessionData }) =>
      readingSessionsApi.startSession(bookId, data),

    onSuccess: (data, variables) => {
      console.log('Reading session started successfully:', data);

      // Invalidate and refetch books and reading sessions queries
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ['reading-sessions', variables.bookId] });
    },

    onError: (error: any) => {
      console.error('Failed to start reading session:', error);
      console.error('Error response:', error.response?.data);
    },
  });
}

/**
 * Hook to end a reading session
 */
export function useEndReadingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, sessionId, data }: { bookId: string; sessionId: string; data: EndSessionData }) =>
      readingSessionsApi.endSession(bookId, sessionId, data),

    onSuccess: (data, variables) => {
      console.log('Reading session ended successfully:', data);

      // Invalidate and refetch books and reading sessions queries
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ['reading-sessions', variables.bookId] });
    },

    onError: (error: any) => {
      console.error('Failed to end reading session:', error);
      console.error('Error response:', error.response?.data);
    },
  });
}

/**
 * Hook to pause or resume a reading session
 */
export function usePauseReadingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, sessionId, isPaused }: { bookId: string; sessionId: string; isPaused: boolean }) =>
      readingSessionsApi.pauseSession(bookId, sessionId, isPaused),

    onSuccess: (data, variables) => {
      console.log('Reading session pause toggled successfully:', data);

      // Invalidate and refetch reading sessions queries
      queryClient.invalidateQueries({ queryKey: ['reading-sessions', variables.bookId] });
    },

    onError: (error: any) => {
      console.error('Failed to toggle pause for reading session:', error);
      console.error('Error response:', error.response?.data);
    },
  });
}

/**
 * Hook to get reading sessions for a book
 */
export function useBookReadingSessions(bookId: string) {
  return useQuery({
    queryKey: ['reading-sessions', bookId],
    queryFn: () => readingSessionsApi.getBookSessions(bookId),
    enabled: !!bookId,
  });
}

/**
 * Hook to read again (restart finished book)
 */
export function useReadAgain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => readingSessionsApi.readAgain(bookId),

    onSuccess: (data, variables) => {
      console.log('Book restarted successfully:', data);

      // Invalidate and refetch books queries
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables] });
    },

    onError: (error: any) => {
      console.error('Failed to restart book:', error);
      console.error('Error response:', error.response?.data);
    },
  });
}