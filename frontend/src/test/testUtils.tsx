import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

export function createTestQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

export function createQueryWrapper(queryClient = createTestQueryClient()) {
    return function QueryWrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>{children}</MemoryRouter>
            </QueryClientProvider>
        );
    };
}

export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient },
) {
    const queryClient = options?.queryClient ?? createTestQueryClient();
    const Wrapper = createQueryWrapper(queryClient);

    return {
        queryClient,
        ...render(ui, { wrapper: Wrapper, ...options }),
    };
}
