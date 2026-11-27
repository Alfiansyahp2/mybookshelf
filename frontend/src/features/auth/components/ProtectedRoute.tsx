import { Navigate } from "react-router-dom";
import { useAuthUser } from "@shared/hooks/useAuthSession";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data, isLoading, isError } = useAuthUser();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-amber-800 font-serif">Loading...</p>
                </div>
            </div>
        );
    }

    if (isError || !data?.user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
