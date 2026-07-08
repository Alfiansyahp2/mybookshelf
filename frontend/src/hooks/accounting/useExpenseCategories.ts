import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseCategoriesApi } from '../../lib/api/accounting';
import type { ExpenseCategory } from '../../types/accounting';

// Get all categories
export function useExpenseCategories() {
  return useQuery({
    queryKey: ['expense-categories'],
    queryFn: () => expenseCategoriesApi.getCategories(),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get single category
export function useExpenseCategory(id: string) {
  return useQuery({
    queryKey: ['expense-categories', id],
    queryFn: () => expenseCategoriesApi.getCategory(id),
    enabled: !!id,
  });
}

// Create category
export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; color?: string; icon?: string; monthly_budget?: number }) =>
      expenseCategoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
    },
  });
}

// Update category
export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; description: string; color: string; icon: string; monthly_budget: number }> }) =>
      expenseCategoriesApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      queryClient.invalidateQueries({ queryKey: ['expense-categories', variables.id] });
    },
  });
}

// Delete category
export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseCategoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
    },
  });
}

// Get default categories
export function useDefaultExpenseCategories() {
  return useQuery({
    queryKey: ['expense-categories', 'default'],
    queryFn: () => expenseCategoriesApi.getDefaultCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Initialize defaults
export function useInitializeExpenseCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => expenseCategoriesApi.initializeDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
    },
  });
}

// Get category statistics
export function useExpenseCategoryStatistics(id: string) {
  return useQuery({
    queryKey: ['expense-categories', id, 'statistics'],
    queryFn: () => expenseCategoriesApi.getCategoryStatistics(id),
    enabled: !!id,
  });
}