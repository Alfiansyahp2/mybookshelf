import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, PieChart, BarChart3, Wallet, AlertCircle, Plus } from 'lucide-react';
import { useAccountingOverview } from '../../hooks/accounting/useAccountingReports';
import type { ExpenseByCategory } from '../../types/accounting';
import PurchaseHistoryChart from './MonthlyExpensesChart';

interface AccountingDashboardProps {
  period?: 'today' | 'week' | 'month' | 'year' | 'all';
  onCreateExpense?: () => void;
  onCreateBudget?: () => void;
}

export default function AccountingDashboard({
  period = 'month',
  onCreateExpense,
  onCreateBudget,
}: AccountingDashboardProps) {
  const { data: overview, isLoading } = useAccountingOverview({ period });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-cream border border-beige rounded-lg shadow-sm p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-beige animate-pulse rounded w-1/3"></div>
                <div className="h-8 bg-beige animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const summary = overview?.data?.summary;
  const budgetData = overview?.data?.budget;
  const categoriesData = overview?.data?.expenses_by_category || [];
  const recentExpenses = overview?.data?.recent_expenses || [];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold font-serif text-darkBrown tracking-wide">Accounting Overview</h2>
        <div className="flex items-center gap-3">
          {onCreateBudget && (
            <button
              onClick={onCreateBudget}
              className="flex items-center gap-2 px-5 py-2.5 bg-gold text-darkBrown rounded-lg hover:bg-gold/80 transition-colors text-sm font-medium"
            >
              <Wallet className="w-4 h-4" />
              New Budget
            </button>
          )}
          {onCreateExpense && (
            <button
              onClick={onCreateExpense}
              className="flex items-center gap-2 px-5 py-2.5 bg-walnut text-cream rounded-lg hover:bg-darkBrown shadow-sm transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', padding: '16px 14px', boxShadow: '0 2px 12px -4px rgba(122,92,66,0.06)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DollarSign size={18} color="#f59e0b" />
            </div>
            <span style={{ fontSize: 11, color: '#7A5C42', fontWeight: 500, lineHeight: 1.3 }}>Total Expenses</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#4A3B2F', lineHeight: 1, marginBottom: 3 }}>
            {summary?.formatted_total || 'Rp 0'}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>
            {summary?.period_type === 'month' ? 'This month' : 'Selected period'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', padding: '16px 14px', boxShadow: '0 2px 12px -4px rgba(122,92,66,0.06)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={18} color="#ef4444" />
            </div>
            <span style={{ fontSize: 11, color: '#7A5C42', fontWeight: 500, lineHeight: 1.3 }}>Pending</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#4A3B2F', lineHeight: 1, marginBottom: 3 }}>
            {summary?.pending_expenses || 0}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>Unpaid expenses</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', padding: '16px 14px', boxShadow: '0 2px 12px -4px rgba(122,92,66,0.06)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: (summary?.month_over_month_change || 0) >= 0 ? '#d1fae5' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={18} color={(summary?.month_over_month_change || 0) >= 0 ? '#10b981' : '#ef4444'} />
            </div>
            <span style={{ fontSize: 11, color: '#7A5C42', fontWeight: 500, lineHeight: 1.3 }}>vs Last Month</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: (summary?.month_over_month_change || 0) >= 0 ? '#10b981' : '#ef4444', lineHeight: 1, marginBottom: 3 }}>
            {(summary?.month_over_month_change || 0) >= 0 ? '+' : ''}
            {summary?.month_over_month_change?.toFixed(1)}%
          </div>
          <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>Change</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', padding: '16px 14px', boxShadow: '0 2px 12px -4px rgba(122,92,66,0.06)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Wallet size={18} color="#8b5cf6" />
            </div>
            <span style={{ fontSize: 11, color: '#7A5C42', fontWeight: 500, lineHeight: 1.3 }}>Budget Status</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#4A3B2F', lineHeight: 1, marginBottom: 3 }}>
            {budgetData?.healthy_count || 0}/{budgetData?.active_budgets_count || 0}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>Healthy budgets</div>
        </motion.div>
      </div>

      {/* Budget Alerts */}
      {budgetData && (budgetData.exceeded_count > 0 || budgetData.warning_count > 0) ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fef2f2', borderRadius: 16, border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', boxShadow: '0 2px 12px -4px rgba(239, 68, 68, 0.1)' }}
          className="mb-6 flex items-center gap-3"
        >
          <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}>
            <AlertCircle size={20} color="#ef4444" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#991b1b', margin: '0 0 2px' }}>
              Budget Alerts Active
            </p>
            <p style={{ fontSize: 12, color: '#b91c1c', margin: 0 }}>
              {budgetData.exceeded_count} exceeded, {budgetData.warning_count} at warning level
            </p>
          </div>
        </motion.div>
      ) : null}

      {/* Monthly Purchase History Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <PurchaseHistoryChart months={12} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', boxShadow: '0 2px 12px -4px rgba(122,92,66,0.06)', overflow: 'hidden' }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(139,99,56,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3B2F', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <PieChart size={18} color="#7A5C42" />
              Expenses by Category
            </h3>
          </div>
          <div className="p-6">
            {categoriesData.length === 0 ? (
              <p className="text-center text-walnut/80 py-8">
                No expense data available
              </p>
            ) : (
              <div className="space-y-4">
                {categoriesData.map((category: ExpenseByCategory, index: number) => (
                  <CategoryBar key={index} category={category} index={index} allCategories={categoriesData} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', boxShadow: '0 2px 12px -4px rgba(122,92,66,0.06)', overflow: 'hidden' }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(139,99,56,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3B2F', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <BarChart3 size={18} color="#7A5C42" />
              Recent Expenses
            </h3>
          </div>
          <div className="p-6">
            {recentExpenses.length === 0 ? (
              <p className="text-center text-walnut/80 py-8">
                No recent expenses
              </p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.slice(0, 5).map((expense: any) => (
                  <div
                    key={expense.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8F5F0', borderRadius: 12, border: '1px solid rgba(139,99,56,0.05)' }}
                  >
                    <div className="flex-1">
                      <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#4A3B2F' }}>{expense.title}</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'rgba(122,92,66,0.8)' }}>
                        {expense.category?.name || 'Uncategorized'} • {new Date(expense.expense_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: '#4A3B2F' }}>
                        Rp {expense.amount.toLocaleString()}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: 'rgba(122,92,66,0.6)', fontWeight: 600 }}>{expense.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', boxShadow: '0 2px 12px -4px rgba(122,92,66,0.06)', overflow: 'hidden' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(139,99,56,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3B2F', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Wallet size={18} color="#7A5C42" />
            Budget Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                <span className="text-2xl font-bold text-walnut">
                  {budgetData?.healthy_count || 0}
                </span>
              </div>
              <p className="text-sm text-walnut leading-relaxed">On Track</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {budgetData?.warning_count || 0}
                </span>
              </div>
              <p className="text-sm text-walnut leading-relaxed">Warning</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {budgetData?.exceeded_count || 0}
                </span>
              </div>
              <p className="text-sm text-walnut leading-relaxed">Exceeded</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-walnut leading-relaxed">Total Budget Allocation</span>
              <span className="font-semibold text-darkBrown">
                Rp {(budgetData?.total_budget || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-walnut leading-relaxed">Total Spent</span>
              <span className="font-semibold text-darkBrown">
                Rp {(budgetData?.total_spent || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-walnut leading-relaxed">Overall Usage</span>
              <span className={`font-semibold leading-relaxed ${
                (budgetData?.overall_usage_percentage || 0) > 80 ? 'text-red-600' : 'text-green-600'
              }`}>
                {budgetData?.overall_usage_percentage?.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Category Bar Component
interface CategoryBarProps {
  category: ExpenseByCategory;
  index: number;
  allCategories: ExpenseByCategory[];
}

function CategoryBar({ category, index, allCategories }: CategoryBarProps) {
  // Calculate percentage relative to total
  const maxAmount = Math.max(...allCategories.map(c => c.total_amount));
  const percentage = maxAmount > 0 ? (category.total_amount / maxAmount) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm leading-relaxed">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="font-medium text-darkBrown leading-relaxed">{category.category_name}</span>
        </div>
        <div className="text-right">
          <p className="font-semibold text-darkBrown leading-relaxed">
            Rp {category.total_amount.toLocaleString()}
          </p>
          <p className="text-xs text-walnut/70 leading-relaxed">{category.expense_count} expenses</p>
        </div>
      </div>
      <div className="relative">
        <div className="w-full bg-beige animate-pulse rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: index * 0.1 }}
            className="h-2.5 rounded-full"
            style={{ backgroundColor: category.category_color }}
          />
        </div>
      </div>
    </div>
  );
}