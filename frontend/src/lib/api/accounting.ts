import { apiClient } from '../apiClient';
import type {
  Expense,
  ExpenseCategory,
  Budget,
  CurrencyRate,
  AccountingTimelineEvent,
  AccountingOverview,
  ExpenseByCategory,
  BudgetProgress,
  ExpenseFormData,
  BudgetFormData,
  ExpenseFilters,
  BudgetFilters,
  CurrencyConversion,
  MonthlyComparison,
  YearToDateSummary,
  PaginatedResponse,
  ApiResponse,
} from '../../types/accounting';

// Expenses API
export const expensesApi = {
  // Get all expenses with filters
  getExpenses: (filters?: ExpenseFilters) =>
    apiClient.get('/v1/accounting/expenses', filters),

  // Get single expense
  getExpense: (id: string) =>
    apiClient.get(`/v1/accounting/expenses/${id}`),

  // Create new expense
  createExpense: (data: ExpenseFormData) =>
    apiClient.post('/v1/accounting/expenses', data),

  // Update expense
  updateExpense: (id: string, data: Partial<ExpenseFormData>) =>
    apiClient.patch(`/v1/accounting/expenses/${id}`, data),

  // Delete expense
  deleteExpense: (id: string) =>
    apiClient.delete(`/v1/accounting/expenses/${id}`),

  // Upload receipt
  uploadReceipt: (id: string, receiptData: { data: string; mime_type?: string; filename?: string }) =>
    apiClient.post(`/v1/accounting/expenses/${id}/receipt`, receiptData),

  // Get receipt
  getReceipt: (id: string) =>
    apiClient.get(`/v1/accounting/expenses/${id}/receipt`),

  // Duplicate expense
  duplicateExpense: (id: string) =>
    apiClient.post(`/v1/accounting/expenses/${id}/duplicate`),

  // Convert currency
  convertCurrency: (id: string, targetCurrency: string) =>
    apiClient.post(`/v1/accounting/expenses/${id}/convert-currency`, { target_currency: targetCurrency }),

  // Mark as paid
  markAsPaid: (id: string) =>
    apiClient.post(`/v1/accounting/expenses/${id}/mark-paid`),

  // Send reminder
  sendReminder: (id: string) =>
    apiClient.post(`/v1/accounting/expenses/${id}/send-reminder`),

  // Get expenses by category
  getExpensesByCategory: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/v1/accounting/expenses/by-category', params),

  // Get total expenses
  getTotalExpenses: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/v1/accounting/expenses/total', params),
};

// Expense Categories API
export const expenseCategoriesApi = {
  // Get all categories
  getCategories: () =>
    apiClient.get('/v1/accounting/categories'),

  // Get single category
  getCategory: (id: string) =>
    apiClient.get(`/v1/accounting/categories/${id}`),

  // Create new category
  createCategory: (data: { name: string; description?: string; color?: string; icon?: string; monthly_budget?: number }) =>
    apiClient.post('/v1/accounting/categories', data),

  // Update category
  updateCategory: (id: string, data: Partial<{ name: string; description: string; color: string; icon: string; monthly_budget: number }>) =>
    apiClient.patch(`/v1/accounting/categories/${id}`, data),

  // Delete category
  deleteCategory: (id: string) =>
    apiClient.delete(`/v1/accounting/categories/${id}`),

  // Get default categories
  getDefaultCategories: () =>
    apiClient.get('/v1/accounting/categories/default'),

  // Initialize default categories for user
  initializeDefaults: () =>
    apiClient.post('/v1/accounting/categories/initialize-defaults'),

  // Get category statistics
  getCategoryStatistics: (id: string) =>
    apiClient.get(`/v1/accounting/categories/${id}/statistics`),
};

// Budgets API
export const budgetsApi = {
  // Get all budgets
  getBudgets: (filters?: BudgetFilters) =>
    apiClient.get('/v1/accounting/budgets', filters),

  // Get single budget
  getBudget: (id: string) =>
    apiClient.get(`/v1/accounting/budgets/${id}`),

  // Create new budget
  createBudget: (data: BudgetFormData) =>
    apiClient.post('/v1/accounting/budgets', data),

  // Update budget
  updateBudget: (id: string, data: Partial<BudgetFormData>) =>
    apiClient.patch(`/v1/accounting/budgets/${id}`, data),

  // Delete budget
  deleteBudget: (id: string) =>
    apiClient.delete(`/v1/accounting/budgets/${id}`),

  // Get budget progress
  getBudgetProgress: (id: string) =>
    apiClient.get(`/v1/accounting/budgets/${id}/progress`),

  // Get budget expenses
  getBudgetExpenses: (id: string, params?: { start_date?: string; end_date?: string; per_page?: number }) =>
    apiClient.get(`/v1/accounting/budgets/${id}/expenses`, params),

  // Reset budget period
  resetBudgetPeriod: (id: string) =>
    apiClient.post(`/v1/accounting/budgets/${id}/reset-period`),

  // Check budget alerts
  checkAlerts: () =>
    apiClient.get('/v1/accounting/budgets/check-alerts'),

  // Get budget summary
  getSummary: () =>
    apiClient.get('/v1/accounting/budgets/summary'),

  // Get top spending categories
  getTopSpendingCategories: (params?: { start_date?: string; end_date?: string; limit?: number }) =>
    apiClient.get('/v1/accounting/budgets/top-spending-categories', params),

  // Get performance trends
  getPerformanceTrends: (id: string) =>
    apiClient.get(`/v1/accounting/budgets/${id}/performance-trends`),
};

// Currency API
export const currencyApi = {
  // Get all currency rates
  getRates: () =>
    apiClient.get('/v1/accounting/currency/rates'),

  // Get specific rate
  getRate: (fromCurrency: string, toCurrency?: string) =>
    apiClient.get('/v1/accounting/currency/rates/current', { from_currency: fromCurrency, to_currency: toCurrency || 'IDR' }),

  // Set currency rate
  setRate: (data: { from_currency: string; to_currency?: string; rate: number; effective_date?: string; expires_at?: string }) =>
    apiClient.post('/v1/accounting/currency/rates', data),

  // Convert amount between currencies
  convert: (amount: number, fromCurrency: string, toCurrency?: string) =>
    apiClient.post('/v1/accounting/currency/convert', { amount, from_currency: fromCurrency, to_currency: toCurrency || 'IDR' }),

  // Sync live rates
  syncRates: () =>
    apiClient.post('/v1/accounting/currency/rates/sync'),

  // Get historical rates
  getHistoricalRates: (fromCurrency: string, toCurrency?: string, date?: string) =>
    apiClient.get('/v1/accounting/currency/rates/historical', { from_currency: fromCurrency, to_currency: toCurrency || 'IDR', date }),

  // Bulk upsert rates
  bulkUpsertRates: (rates: Array<{ from_currency: string; to_currency?: string; rate: number }>) =>
    apiClient.post('/v1/accounting/currency/rates/bulk-upsert', { rates }),

  // Get supported currencies
  getSupportedCurrencies: () =>
    apiClient.get('/v1/accounting/currency/supported'),

  // Validate currency code
  validateCurrency: (currencyCode: string) =>
    apiClient.get('/v1/accounting/currency/validate', { currency_code: currencyCode }),

  // Get currency info
  getCurrencyInfo: (currencyCode: string) =>
    apiClient.get('/v1/accounting/currency/info', { currency_code: currencyCode }),

  // Deactivate old rates
  deactivateOldRates: (daysToKeep?: number) =>
    apiClient.post('/v1/accounting/currency/rates/deactivate-old', { days_to_keep: daysToKeep || 30 }),
};

// Reports API
export const reportsApi = {
  // Get accounting overview
  getOverview: (params?: { start_date?: string; end_date?: string; period?: 'today' | 'week' | 'month' | 'year' | 'all' }) =>
    apiClient.get('/v1/accounting/reports/overview', params),

  // Get expenses by category
  getExpensesByCategory: (params?: { start_date?: string; end_date?: string; category_id?: string }) =>
    apiClient.get('/v1/accounting/reports/expenses-by-category', params),

  // Get expenses by period
  getExpensesByPeriod: (params: { start_date: string; end_date: string; group_by?: 'day' | 'week' | 'month' | 'year'; category_id?: string }) =>
    apiClient.get('/v1/accounting/reports/expenses-by-period', params),

  // Get budget tracking
  getBudgetTracking: (params?: { is_active?: boolean; period?: string }) =>
    apiClient.get('/v1/accounting/reports/budget-tracking', params),

  // Get payment methods analysis
  getPaymentMethodsAnalysis: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/v1/accounting/reports/payment-methods', params),

  // Get monthly comparison
  getMonthlyComparison: (months?: number) =>
    apiClient.get('/v1/accounting/reports/monthly-comparison', { months: months || 6 }),

  // Get year-to-date summary
  getYearToDateSummary: () =>
    apiClient.get('/v1/accounting/reports/year-to-date'),

  // Export report
  exportReport: (params: { report_type: string; format: string; start_date?: string; end_date?: string }) =>
    apiClient.post('/v1/accounting/reports/export', params),
};

// Combined exports
export default {
  expenses: expensesApi,
  categories: expenseCategoriesApi,
  budgets: budgetsApi,
  currency: currencyApi,
  reports: reportsApi,
};