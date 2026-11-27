import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import { achievementsApi } from "../api/achievements.api";

export function useAchievements() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.achievements.all,
        queryFn: () => achievementsApi.getAchievements(),
        enabled: isAuthenticated,
    });
}

export function useUnlockAchievement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => achievementsApi.unlockAchievement(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
        },
    });
}
