import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../lib/api/books';
import type { Book, BookStatus } from '../types';

/**
 * Hook to fetch all books with optional filters
 */
export function useBooks(filters?: {
  status?: BookStatus;
  favorite?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => booksApi.getBooks(filters),
  });
}

/**
 * Hook to fetch a single book
 */
export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => booksApi.getBook(id),
    enabled: !!id,
    select: (response) => response.data, // Extract the actual book data from API response
  });
}

/**
 * Hook to create a new book
 */
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: Partial<Book>) =>
      booksApi.createBook(bookData),

    onSuccess: () => {
      // Invalidate books queries to refetch
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

/**
 * Hook to update a book
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Book> }) =>
      booksApi.updateBook(id, updates),

    onSuccess: (_, { id }) => {
      // Invalidate both the specific book and the books list
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', id] });
    },
  });
}

/**
 * Hook to delete a book
 */
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => booksApi.deleteBook(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

/**
 * Hook to start reading a book
 */
export function useStartReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      booksApi.startReading(id),

    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', bookId] });
    },
  });
}

/**
 * Hook to finish reading a book
 */
export function useFinishReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      booksApi.finishReading(id),

    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', bookId] });
    },
  });
}

/**
 * Hook to upload a book cover image
 */
export function useUploadCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      booksApi.uploadCover(id, file),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
    },
  });
}

/**
 * Hook to update reading progress
 */
export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentPage }: { id: string; currentPage: number }) =>
      booksApi.updateProgress(id, currentPage),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
    },
  });
}

/**
 * Hook to toggle favorite status
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      booksApi.toggleFavorite(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['books', { favorite: true }] });
    },
  });
}

/**
 * Hook to update personal notes
 */
export function useUpdateNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      booksApi.updateNotes(id, notes),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
    },
  });
}

/**
 * Hook to update personal rating
 */
export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) =>
      booksApi.updateRating(id, rating),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
    },
  });
}

/**
 * Hook to move book to different shelf
 */
export function useMoveToShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, shelfId, position }: { id: string; shelfId: string; position?: number }) =>
      booksApi.moveToShelf(id, shelfId, position),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
    },
  });
}

/**
 * Hook to borrow book
 */
export function useBorrowBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, borrowedBy, dueDate }: { id: string; borrowedBy: string; dueDate: string }) =>
      booksApi.borrowBook(id, borrowedBy, dueDate),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
    },
  });
}

/**
 * Hook to return borrowed book
 */
export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      booksApi.returnBook(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
    },
  });
}

/**
 * Hook to get book timeline
 */
export function useBookTimeline(id: string) {
  return useQuery({
    queryKey: ['books', id, 'timeline'],
    queryFn: () => booksApi.getBookTimeline(id),
    enabled: !!id,
  });
}
