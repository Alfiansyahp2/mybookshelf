import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsApi } from '../../lib/api/accounting';
import type { Budget, BudgetFormData, BudgetFilters } from '../../types/accounting';

// Get all budgets
export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: ['budgets', filters],
    queryFn: () => budgetsApi.getBudgets(filters),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get single budget
export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: () => budgetsApi.getBudget(id),
    enabled: !!id,
  });
}

// Create budget
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BudgetFormData) => budgetsApi.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}

// Update budget
export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetFormData> }) =>
      budgetsApi.updateBudget(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}

// Delete budget
export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsApi.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}

// Get budget progress
export function useBudgetProgress(id: string) {
  return useQuery({
    queryKey: ['budgets', id, 'progress'],
    queryFn: () => budgetsApi.getBudgetProgress(id),
    enabled: !!id,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

// Get budget expenses
export function useBudgetExpenses(id: string, params?: { start_date?: string; end_date?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['budgets', id, 'expenses', params],
    queryFn: () => budgetsApi.getBudgetExpenses(id, params),
    enabled: !!id,
  });
}

// Reset budget period
export function useResetBudgetPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsApi.resetBudgetPeriod(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.id, 'progress'] });
    },
  });
}

// Check budget alerts
export function useCheckBudgetAlerts() {
  return useMutation({
    mutationFn: () => budgetsApi.checkAlerts(),
  });
}

// Get budget summary
export function useBudgetSummary() {
  return useQuery({
    queryKey: ['budgets-summary'],
    queryFn: () => budgetsApi.getSummary(),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get top spending categories
export function useTopSpendingCategories(params?: { start_date?: string; end_date?: string; limit?: number }) {
  return useQuery({
    queryKey: ['top-spending-categories', params],
    queryFn: () => budgetsApi.getTopSpendingCategories(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get performance trends
export function useBudgetPerformanceTrends(id: string) {
  return useQuery({
    queryKey: ['budgets', id, 'performance'],
    queryFn: () => budgetsApi.getPerformanceTrends(id),
    enabled: !!id,
  });
}