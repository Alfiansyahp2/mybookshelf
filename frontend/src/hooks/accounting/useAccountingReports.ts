import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../../lib/api/accounting';
import type { AccountingOverview, MonthlyComparison, YearToDateSummary } from '../../types/accounting';

// Get accounting overview
export function useAccountingOverview(params?: { start_date?: string; end_date?: string; period?: 'today' | 'week' | 'month' | 'year' | 'all' }) {
  return useQuery({
    queryKey: ['accounting-overview', params],
    queryFn: () => reportsApi.getOverview(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get expenses by category
export function useExpensesByCategoryReport(params?: { start_date?: string; end_date?: string; category_id?: string }) {
  return useQuery({
    queryKey: ['reports', 'expenses-by-category', params],
    queryFn: () => reportsApi.getExpensesByCategory(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get expenses by period
export function useExpensesByPeriodReport(params: { start_date: string; end_date: string; group_by?: 'day' | 'week' | 'month' | 'year'; category_id?: string }) {
  return useQuery({
    queryKey: ['reports', 'expenses-by-period', params],
    queryFn: () => reportsApi.getExpensesByPeriod(params),
    enabled: !!params.start_date && !!params.end_date,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get budget tracking
export function useBudgetTrackingReport(params?: { is_active?: boolean; period?: string }) {
  return useQuery({
    queryKey: ['reports', 'budget-tracking', params],
    queryFn: () => reportsApi.getBudgetTracking(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get payment methods analysis
export function usePaymentMethodsAnalysis(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: ['reports', 'payment-methods', params],
    queryFn: () => reportsApi.getPaymentMethodsAnalysis(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get monthly comparison
export function useMonthlyComparison(months?: number) {
  return useQuery({
    queryKey: ['reports', 'monthly-comparison', months],
    queryFn: () => reportsApi.getMonthlyComparison(months),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get year-to-date summary
export function useYearToDateSummary() {
  return useQuery({
    queryKey: ['reports', 'year-to-date'],
    queryFn: () => reportsApi.getYearToDateSummary(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Export report
export function useExportReport() {
  return useMutation({
    mutationFn: (params: { report_type: string; format: string; start_date?: string; end_date?: string }) =>
      reportsApi.exportReport(params),
  });
}