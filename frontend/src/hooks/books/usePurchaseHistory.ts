import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

interface PurchaseHistoryData {
  month: string;
  month_name: string;
  total_amount: number;
  formatted_amount: string;
  book_count: number;
  average_price: number;
  books: Array<{
    id: string;
    title: string;
    purchase_price: number;
    purchase_currency: string;
    purchase_date: string;
  }>;
}

interface PurchaseHistoryResponse {
  success: boolean;
  message: string;
  data: PurchaseHistoryData[];
}

export function usePurchaseHistory(months: number = 12) {
  return useQuery<PurchaseHistoryResponse>({
    queryKey: ['purchase-history', months],
    queryFn: async () => {
      const response = await apiClient.get('/v1/books/purchase-history', { months });

      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response structure');
      }

      // Validate data is array
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format in response');
      }

      return response as PurchaseHistoryResponse;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
