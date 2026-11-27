import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import {
    authApi,
    type LoginCredentials,
    type RegisterCredentials,
} from "../api/auth.api";

export { useAuthUser };

/**
 * Hook to login user.
 */
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authApi.login(credentials),
        onSuccess: (data) => {
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                queryClient.setQueryData(queryKeys.auth.user(), data);
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
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
                queryClient.setQueryData(queryKeys.auth.user(), data);
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
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
                queryClient.setQueryData(queryKeys.auth.user(), data);
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
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
