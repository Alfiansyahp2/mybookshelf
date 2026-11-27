import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import { statisticsApi } from "../api/statistics.api";

export function useStatistics() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.statistics.all,
        queryFn: statisticsApi.getStatistics,
        enabled: isAuthenticated,
    });
}
