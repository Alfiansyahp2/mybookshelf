import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../lib/api/statistics";

export function useStatistics() {
    const isAuthenticated = !!localStorage.getItem("user");
    return useQuery({
        queryKey: ["statistics"],
        queryFn: statisticsApi.getStatistics,
        enabled: isAuthenticated,
    });
}
