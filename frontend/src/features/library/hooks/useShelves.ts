import {
    useQuery,
    useMutation,
    useQueryClient,
    type QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import type { Shelf } from "@shared/types";
import { shelvesApi } from "../api/shelves.api";

function invalidateShelfAnalytics(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
    queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
}

export function useShelves() {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.shelves.all,
        queryFn: () => shelvesApi.getShelves(),
        enabled: isAuthenticated,
    });
}

export function useCreateShelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shelfData: Partial<Shelf>) =>
            shelvesApi.createShelf(shelfData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shelves.all });
            invalidateShelfAnalytics(queryClient);
        },
    });
}

export function useUpdateShelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            updates,
        }: {
            id: string;
            updates: Partial<Shelf>;
        }) => shelvesApi.updateShelf(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shelves.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.shelves.detail(variables.id),
            });
            invalidateShelfAnalytics(queryClient);
        },
    });
}

export function useUpdateShelfLayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shelves: { id: string; order: number; span: number }[]) =>
            shelvesApi.updateLayout(shelves),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shelves.all });
            invalidateShelfAnalytics(queryClient);
        },
    });
}

export function useDeleteShelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => shelvesApi.deleteShelf(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shelves.all });
            invalidateShelfAnalytics(queryClient);
        },
    });
}

export function useShelfOccupancy(id: string) {
    const { data: authData } = useAuthUser();
    const isAuthenticated = !!authData?.user;
    return useQuery({
        queryKey: queryKeys.shelves.occupancy(id),
        queryFn: () => shelvesApi.getOccupancy(id),
        enabled: !!id && isAuthenticated,
    });
}
