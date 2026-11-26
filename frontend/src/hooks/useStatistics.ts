import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../lib/api/statistics";
import { useAuthUser } from "./useAuth";

export function useStatistics() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: ["statistics"],
        queryFn: statisticsApi.getStatistics,
        enabled: isAuthenticated,
    });
}
