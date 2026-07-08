import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '../../lib/api/accounting';
import type { Expense, ExpenseFormData, ExpenseFilters } from '../../types/accounting';

// Get all expenses
export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expensesApi.getExpenses(filters),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get single expense
export function useExpense(id: string) {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () => expensesApi.getExpense(id),
    enabled: !!id,
  });
}

// Create expense
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExpenseFormData) => expensesApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}

// Update expense
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) =>
      expensesApi.updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}

// Delete expense
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}

// Upload receipt
export function useUploadReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, receiptData }: { id: string; receiptData: { data: string; mime_type?: string; filename?: string } }) =>
      expensesApi.uploadReceipt(id, receiptData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
    },
  });
}

// Duplicate expense
export function useDuplicateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesApi.duplicateExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}

// Get expenses by category
export function useExpensesByCategory(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: ['expenses', 'by-category', params],
    queryFn: () => expensesApi.getExpensesByCategory(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get total expenses
export function useTotalExpenses(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: ['expenses', 'total', params],
    queryFn: () => expensesApi.getTotalExpenses(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Mark as paid
export function useMarkAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesApi.markAsPaid(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
  });
}