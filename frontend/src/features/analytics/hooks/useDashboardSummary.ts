import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import { analyticsApi } from "../api/analytics.api";

export function useDashboardSummary() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;

    return useQuery({
        queryKey: queryKeys.analytics.dashboard(),
        queryFn: ({ signal }) => analyticsApi.getDashboardSummary(signal),
        enabled: isAuthenticated,
        staleTime: 60_000,
    });
}
