import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { achievementsApi } from "../lib/api/achievements";
import { useAuthUser } from "./useAuth";

export function useAchievements() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: ["achievements"],
        queryFn: () => achievementsApi.getAchievements(),
        enabled: isAuthenticated,
    });
}

export function useUnlockAchievement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => achievementsApi.unlockAchievement(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["achievements"] });
        },
    });
}
