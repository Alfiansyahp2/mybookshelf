import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { Shelf } from '../types';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// Shelves API
export const shelvesApi = {
  async getShelves(): Promise<Shelf[]> {
    const response = await apiClient.get('/v1/shelves');
    console.log('Shelves API response:', response);
    // Laravel API returns {success: true, message: "...", data: [...]}
    return response.data?.data || response.data || [];
  },

  async getShelf(id: string): Promise<any> {
    return apiClient.get(`/v1/shelves/${id}`);
  },

  async createShelf(shelfData: Partial<Shelf>): Promise<any> {
    return apiClient.post('/v1/shelves', shelfData);
  },

  async updateShelf(id: string, updates: Partial<Shelf>): Promise<any> {
    return apiClient.patch(`/v1/shelves/${id}`, updates);
  },

  async deleteShelf(id: string): Promise<any> {
    return apiClient.delete(`/v1/shelves/${id}`);
  },

  async getOccupancy(id: string): Promise<any> {
    return apiClient.get(`/v1/shelves/${id}/occupancy`);
  },
};

/**
 * Hook to fetch all shelves
 */
export function useShelves() {
  return useQuery({
    queryKey: ['shelves'],
    queryFn: () => shelvesApi.getShelves(),
  });
}

/**
 * Hook to create a new shelf
 */
export function useCreateShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shelfData: Partial<Shelf>) =>
      shelvesApi.createShelf(shelfData).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
    },
  });
}

/**
 * Hook to update a shelf
 */
export function useUpdateShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Shelf> }) =>
      shelvesApi.updateShelf(id, updates).then((res) => res.data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
      queryClient.invalidateQueries({ queryKey: ['shelves', variables.id] });
    },
  });
}

/**
 * Hook to delete a shelf
 */
export function useDeleteShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shelvesApi.deleteShelf(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
    },
  });
}

/**
 * Hook to get shelf occupancy
 */
export function useShelfOccupancy(id: string) {
  return useQuery({
    queryKey: ['shelves', id, 'occupancy'],
    queryFn: () => shelvesApi.getOccupancy(id),
    enabled: !!id,
  });
}
