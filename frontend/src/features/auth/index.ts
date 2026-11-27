export { authApi, type User, type LoginCredentials, type RegisterCredentials, type AuthResponse } from "./api/auth.api";
export {
    useAuthUser,
    useLogin,
    useRegister,
    useLogout,
    useUpdateProfile,
    useUpdatePassword,
} from "./hooks/useAuth";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
