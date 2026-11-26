import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../lib/api/auth";
import type { LoginCredentials, RegisterCredentials } from "../lib/api/auth";

/**
 * Hook to get current authenticated user (single source of truth via Sanctum session).
 */
export function useAuthUser() {
    return useQuery({
        queryKey: ["auth", "user"],
        queryFn: async () => {
            const data = await authApi.me();
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            return data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to login user.
 */
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (data) => {
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                queryClient.setQueryData(["auth", "user"], data);
            }
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

/**
 * Hook to register new user.
 */
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) =>
            authApi.register(credentials),
        onSuccess: (data) => {
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                queryClient.setQueryData(["auth", "user"], data);
            }
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

/**
 * Hook to logout user.
 */
export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            localStorage.removeItem("user");
            queryClient.clear();
        },
    });
}

/**
 * Hook to update user profile.
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; email: string }) =>
            authApi.updateProfile(data),
        onSuccess: (data) => {
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                queryClient.setQueryData(["auth", "user"], data);
            }
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

/**
 * Hook to update password.
 */
export function useUpdatePassword() {
    return useMutation({
        mutationFn: (data: {
            current_password: string;
            password: string;
            password_confirmation: string;
        }) => authApi.updatePassword(data),
    });
}
