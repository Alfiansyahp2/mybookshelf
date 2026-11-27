import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@shared/api/reactQuery";

// Provider component for React Query
export function ReactQueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
