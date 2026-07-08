// Accounting Types for MyBookshelf

export interface Expense {
  id: string;
  user_id: string;
  book_id?: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  amount_base_currency: number;
  exchange_rate: number;
  category_id?: string;
  category?: ExpenseCategory;
  payment_method: PaymentMethod;
  expense_date: string;
  is_recurring: boolean;
  recurring_period?: RecurringPeriod;
  parent_expense_id?: string;
  vendor?: string;
  location?: string;
  receipt_data?: string;
  receipt_mime_type?: string;
  receipt_filename?: string;
  has_reminder: boolean;
  reminder_date?: string;
  reminder_sent: boolean;
  status: ExpenseStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  // Computed properties
  formatted_amount?: string;
  formatted_base_amount?: string;
}

export interface ExpenseCategory {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  is_default: boolean;
  monthly_budget?: number;
  budget_currency: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  // Computed properties
  total_expenses?: number;
  budget_usage_percentage?: number;
  is_budget_exceeded?: boolean;
  is_near_threshold?: boolean;
  formatted_budget?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id?: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  amount_base_currency: number;
  period: BudgetPeriod;
  start_date: string;
  end_date?: string;
  alert_threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  // Computed properties
  category?: ExpenseCategory;
  total_spent?: number;
  remaining_amount?: number;
  usage_percentage?: number;
  status?: 'healthy' | 'warning' | 'exceeded' | 'inactive';
  is_exceeded?: boolean;
  is_at_threshold?: boolean;
  formatted_amount?: string;
  formatted_spent?: string;
  formatted_remaining?: string;
}

export interface CurrencyRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  effective_date: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  formatted?: string;
}

export interface AccountingTimelineEvent {
  id: string;
  user_id: string;
  expense_id?: string;
  budget_id?: string;
  type: TimelineEventType;
  event_date: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Computed properties
  expense?: Expense;
  budget?: Budget;
  formatted_date?: string;
  type_label?: string;
}

export interface AccountingOverview {
  period: {
    start_date?: string;
    end_date?: string;
    period_type: string;
  };
  summary: {
    total_expenses: number;
    formatted_total: string;
    pending_expenses: number;
    this_month_expenses: number;
    last_month_expenses: number;
    month_over_month_change: number;
  };
  budget: {
    total_budget: number;
    total_spent: number;
    total_remaining: number;
    overall_usage_percentage: number;
    active_budgets_count: number;
    exceeded_count: number;
    warning_count: number;
    healthy_count: number;
  };
  expenses_by_category: ExpenseByCategory[];
  top_spending_categories: TopSpendingCategory[];
  recent_expenses: Expense[];
}

export interface ExpenseByCategory {
  category_id: string;
  category_name: string;
  category_color: string;
  total_amount: number;
  expense_count: number;
}

export interface TopSpendingCategory {
  category_id: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  total_amount: number;
  expense_count: number;
}

export interface BudgetProgress {
  budget_id: string;
  budget_name: string;
  budget_amount: string;
  total_spent: string;
  remaining_amount: string;
  usage_percentage: number;
  status: string;
  is_exceeded: boolean;
  is_at_threshold: boolean;
  alert_threshold: number;
  period: string;
  start_date: string;
  end_date?: string;
  category?: string;
}

export interface ExpenseFormData {
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  category_id?: string;
  payment_method?: PaymentMethod;
  expense_date?: string;
  is_recurring?: boolean;
  recurring_period?: RecurringPeriod;
  book_id?: string;
  vendor?: string;
  location?: string;
  has_reminder?: boolean;
  reminder_date?: string;
  status?: ExpenseStatus;
  receipt_data?: string;
}

export interface BudgetFormData {
  name: string;
  description?: string;
  amount: number;
  currency?: string;
  period?: BudgetPeriod;
  start_date?: string;
  end_date?: string;
  category_id?: string;
  alert_threshold?: number;
  is_active?: boolean;
}

export interface ExpenseFilters {
  category_id?: string;
  payment_method?: PaymentMethod;
  status?: ExpenseStatus;
  book_id?: string;
  start_date?: string;
  end_date?: string;
  is_recurring?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}

export interface BudgetFilters {
  is_active?: boolean;
  period?: BudgetPeriod;
  category_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}

export interface CurrencyConversion {
  original_amount: number;
  converted_amount: number;
  from_currency: string;
  to_currency: string;
  rate: number;
  rate_date?: string;
  converted_at: string;
}

export interface MonthlyComparison {
  month: string;
  month_name: string;
  total_expenses: number;
  formatted_amount: string;
  expense_count: number;
  average_expense: number;
}

export interface YearToDateSummary {
  year: number;
  year_to_date_expenses: number;
  formatted_ytd: string;
  monthly_average: number;
  formatted_monthly_average: string;
  projected_yearly_total: number;
  formatted_projected: string;
  last_year_total: number;
  formatted_last_year: string;
  year_over_year_growth: number;
  months_passed: number;
  remaining_months: number;
}

// Enums
export type PaymentMethod = 'cash' | 'transfer' | 'e-wallet' | 'credit_card';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ExpenseStatus = 'pending' | 'completed' | 'cancelled';
export type TimelineEventType =
  | 'expense_created'
  | 'expense_updated'
  | 'budget_exceeded'
  | 'budget_alert'
  | 'payment_reminder'
  | 'currency_rate_updated';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Form types
export type ExpenseFormMode = 'create' | 'edit';
export type BudgetFormMode = 'create' | 'edit';