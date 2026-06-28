import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { Room } from '../types';

// Rooms API
export const roomsApi = {
  async getRooms(): Promise<Room[]> {
    const response = await apiClient.get('/v1/rooms');
    return response.data?.data || response.data || [];
  },

  async getRoom(id: string): Promise<any> {
    return apiClient.get(`/v1/rooms/${id}`);
  },

  async createRoom(roomData: Partial<Room>): Promise<any> {
    return apiClient.post('/v1/rooms', roomData);
  },

  async updateRoom(id: string, updates: Partial<Room>): Promise<any> {
    return apiClient.patch(`/v1/rooms/${id}`, updates);
  },

  async deleteRoom(id: string): Promise<any> {
    return apiClient.delete(`/v1/rooms/${id}`);
  },
};

/**
 * Hook to fetch all rooms
 */
export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.getRooms(),
  });
}

/**
 * Hook to fetch a single room
 */
export function useRoom(id: string) {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: () => roomsApi.getRoom(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new room
 */
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomData: Partial<Room>) =>
      roomsApi.createRoom(roomData).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

/**
 * Hook to update a room
 */
export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Room> }) =>
      roomsApi.updateRoom(id, updates).then((res) => res.data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.id] });
    },
  });
}

/**
 * Hook to delete a room
 */
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomsApi.deleteRoom(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}
