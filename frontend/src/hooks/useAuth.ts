import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api/auth';
import type { LoginCredentials, RegisterCredentials } from '../lib/api/auth';

/**
 * Hook to get current authenticated user
 */
export function useAuthUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authApi.me(),
    retry: false,
    // For SPA auth, let the server determine if user is authenticated
    // The API will return 401 if not authenticated
  });
}

/**
 * Hook to login user
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log('Login attempt with credentials:', { email: credentials.email });
      const result = await authApi.login(credentials);
      console.log('Login API result:', result);
      return result;
    },

    onSuccess: (data) => {
      console.log('Login success:', data);
      // Session-based auth: no token to store (cookies are managed automatically)
      localStorage.setItem('user', JSON.stringify(data.user));

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },

    onError: (error: any) => {
      console.error('Login mutation error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
    },
  });
}

/**
 * Hook to register new user
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),

    onSuccess: (data) => {
      // Session-based auth: no token to store (cookies are managed automatically)
      localStorage.setItem('user', JSON.stringify(data.user));

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

/**
 * Hook to logout user
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),

    onSuccess: () => {
      // Clear user data from localStorage
      localStorage.removeItem('user');

      // Clear all queries
      queryClient.clear();
    },
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string }) => authApi.updateProfile(data),
    
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

/**
 * Hook to update password
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) => 
      authApi.updatePassword(data),
  });
}
