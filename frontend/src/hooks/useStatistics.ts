import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../lib/api/statistics';

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsApi.getStatistics,
  });
}
