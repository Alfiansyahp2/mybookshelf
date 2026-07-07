import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { achievementsApi } from '../lib/api/achievements';

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementsApi.getAchievements(),
  });
}

export function useUnlockAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => achievementsApi.unlockAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}
