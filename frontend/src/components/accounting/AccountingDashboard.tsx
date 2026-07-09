import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, PieChart, BarChart3, Wallet, AlertCircle, Plus } from 'lucide-react';
import { useAccountingOverview } from '../../hooks/accounting/useAccountingReports';
import { useTotalExpenses } from '../../hooks/accounting/useExpenses';
import type { AccountingOverview, ExpenseByCategory } from '../../types/accounting';

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
  const { data: totalExpenses } = useTotalExpenses();

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

  const summary = overview?.summary;
  const budgetData = overview?.budget;
  const categoriesData = overview?.expenses_by_category || [];
  const recentExpenses = overview?.recent_expenses || [];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif text-darkBrown">Accounting Overview</h2>
        <div className="flex items-center gap-3">
          {onCreateBudget && (
            <button
              onClick={onCreateBudget}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-darkBrown rounded-lg hover:bg-gold/80 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              New Budget
            </button>
          )}
          {onCreateExpense && (
            <button
              onClick={onCreateExpense}
              className="flex items-center gap-2 px-4 py-2 bg-walnut text-cream rounded-lg hover:bg-darkBrown shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream border border-beige rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">Total Expenses</p>
              <p className="text-2xl font-bold text-darkBrown">
                {summary?.formatted_total || 'Rp 0'}
              </p>
              <p className="text-xs text-walnut/80 mt-1">
                {summary?.period_type === 'month' ? 'This month' : 'Selected period'}
              </p>
            </div>
            <div className="p-3 bg-gold/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-gold" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cream border border-beige rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">Pending</p>
              <p className="text-2xl font-bold text-darkBrown">
                {summary?.pending_expenses || 0}
              </p>
              <p className="text-xs text-walnut/80 mt-1">Unpaid expenses</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cream border border-beige rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">vs Last Month</p>
              <p className={`text-2xl font-bold ${
                (summary?.month_over_month_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(summary?.month_over_month_change || 0) >= 0 ? '+' : ''}
                {summary?.month_over_month_change?.toFixed(1)}%
              </p>
              <p className="text-xs text-walnut/80 mt-1">Change</p>
            </div>
            <div className={`p-3 rounded-lg ${
              (summary?.month_over_month_change || 0) >= 0 ? 'bg-walnut/20' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                (summary?.month_over_month_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cream border border-beige rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">Budget Status</p>
              <p className="text-2xl font-bold text-darkBrown">
                {budgetData?.healthy_count || 0}/{budgetData?.active_budgets_count || 0}
              </p>
              <p className="text-xs text-walnut/80 mt-1">Healthy budgets</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Wallet className="w-6 h-6 text-walnut" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Alerts */}
      {(budgetData?.exceeded_count || 0) > 0 || (budgetData?.warning_count || 0) > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-100">
                Budget Alerts Active
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {budgetData.exceeded_count} exceeded, {budgetData.warning_count} at warning level
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-cream border border-beige rounded-lg shadow-sm"
        >
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-darkBrown flex items-center gap-2">
              <PieChart className="w-5 h-5" />
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
                {categoriesData.map((category, index) => (
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
          className="bg-cream border border-beige rounded-lg shadow-sm"
        >
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-darkBrown flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
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
                {recentExpenses.slice(0, 5).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-darkBrown">{expense.title}</p>
                      <p className="text-sm text-walnut/80">
                        {expense.category?.name || 'Uncategorized'} • {new Date(expense.expense_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-darkBrown">
                        Rp {expense.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-walnut/80">{expense.currency}</p>
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
        className="bg-cream border border-beige rounded-lg shadow-sm"
      >
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-darkBrown">Budget Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                <span className="text-2xl font-bold text-walnut">
                  {budgetData?.healthy_count || 0}
                </span>
              </div>
              <p className="text-sm text-walnut">On Track</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {budgetData?.warning_count || 0}
                </span>
              </div>
              <p className="text-sm text-walnut">Warning</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {budgetData?.exceeded_count || 0}
                </span>
              </div>
              <p className="text-sm text-walnut">Exceeded</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-walnut">Total Budget Allocation</span>
              <span className="font-semibold text-darkBrown">
                Rp {(budgetData?.total_budget || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-walnut">Total Spent</span>
              <span className="font-semibold text-darkBrown">
                Rp {(budgetData?.total_spent || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-walnut">Overall Usage</span>
              <span className={`font-semibold ${
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
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category.category_icon || '📊'}</span>
          <span className="font-medium text-darkBrown">{category.category_name}</span>
        </div>
        <div className="text-right">
          <p className="font-semibold text-darkBrown">
            Rp {category.total_amount.toLocaleString()}
          </p>
          <p className="text-xs text-walnut/80">{category.expense_count} expenses</p>
        </div>
      </div>
      <div className="relative">
        <div className="w-full bg-beige animate-pulse rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: index * 0.1 }}
            className="h-2 rounded-full"
            style={{ backgroundColor: category.category_color }}
          />
        </div>
      </div>
    </div>
  );
}