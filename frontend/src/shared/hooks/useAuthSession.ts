import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/api/apiClient";
import { queryKeys } from "@shared/api/queryKeys";
import type { AuthUser } from "@shared/types/api";

export interface AuthSessionResponse {
    user: AuthUser;
}

/**
 * Shared Sanctum session query used across feature hooks to gate authenticated requests
 * without introducing cross-feature imports between feature slices.
 */
export function useAuthUser() {
    return useQuery<AuthSessionResponse>({
        queryKey: queryKeys.auth.user(),
        queryFn: async () => {
            const response = await apiClient.get("/v1/auth/me");
            const data: AuthSessionResponse =
                response.data?.data || response.data || response;
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            return data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}
