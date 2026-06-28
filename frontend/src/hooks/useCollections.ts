import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { Collection } from '../types';

// Collections API
export const collectionsApi = {
  async getCollections(): Promise<Collection[]> {
    const response = await apiClient.get('/v1/collections');
    return response.data?.data || response.data || [];
  },

  async getCollection(id: string): Promise<any> {
    return apiClient.get(`/v1/collections/${id}`);
  },

  async createCollection(collectionData: Partial<Collection>): Promise<any> {
    return apiClient.post('/v1/collections', collectionData);
  },

  async updateCollection(id: string, updates: Partial<Collection>): Promise<any> {
    return apiClient.patch(`/v1/collections/${id}`, updates);
  },

  async deleteCollection(id: string): Promise<any> {
    return apiClient.delete(`/v1/collections/${id}`);
  },

  async addBookToCollection(collectionId: string, bookId: string): Promise<any> {
    return apiClient.post(`/v1/collections/${collectionId}/books`, { book_id: bookId });
  },

  async removeBookFromCollection(collectionId: string, bookId: string): Promise<any> {
    return apiClient.delete(`/v1/collections/${collectionId}/books/${bookId}`);
  },
};

/**
 * Hook to fetch all collections
 */
export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionsApi.getCollections(),
  });
}

/**
 * Hook to fetch a single collection
 */
export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: () => collectionsApi.getCollection(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new collection
 */
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionData: Partial<Collection>) =>
      collectionsApi.createCollection(collectionData).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

/**
 * Hook to update a collection
 */
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Collection> }) =>
      collectionsApi.updateCollection(id, updates).then((res) => res.data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', variables.id] });
    },
  });
}

/**
 * Hook to delete a collection
 */
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionsApi.deleteCollection(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

/**
 * Hook to add book to collection
 */
export function useAddBookToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, bookId }: { collectionId: string; bookId: string }) =>
      collectionsApi.addBookToCollection(collectionId, bookId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

/**
 * Hook to remove book from collection
 */
export function useRemoveBookFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, bookId }: { collectionId: string; bookId: string }) =>
      collectionsApi.removeBookFromCollection(collectionId, bookId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
