import { QueryClient } from '@tanstack/react-query';

// Create React Query client with custom defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus (reduces unnecessary API calls)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Export hooks for easier usage
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
