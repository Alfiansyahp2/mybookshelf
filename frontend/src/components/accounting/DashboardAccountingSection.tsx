import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Wallet, AlertCircle, ChevronRight } from 'lucide-react';
import { useAccountingOverview } from '../../hooks/accounting/useAccountingReports';
import { useBudgetSummary } from '../../hooks/accounting/useBudgets';

export default function DashboardAccountingSection() {
  const navigate = useNavigate();
  const { data: overview, isLoading } = useAccountingOverview({ period: 'month' });
  const { data: budgetSummary } = useBudgetSummary();

  if (isLoading) {
    return (
      <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-beige animate-pulse rounded w-1/3"></div>
          <div className="h-32 bg-beige animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  const summary = overview?.summary;
  const budget = budgetSummary;

  return (
    <div className="bg-cream border border-beige rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-beige flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold font-serif text-darkBrown">Accounting Overview</h3>
          <p className="text-sm text-walnut/80 mt-1">
            Track your book-related expenses
          </p>
        </div>
        <button
          onClick={() => navigate('/accounting')}
          className="flex items-center gap-2 text-gold hover:text-darkBrown font-medium"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gold font-medium">Total Expenses</p>
                <p className="text-lg font-bold font-serif text-darkBrown">
                  {summary?.formatted_total || 'Rp 0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-walnut font-medium">Budget Status</p>
                <p className="text-lg font-bold font-serif text-darkBrown">
                  {budget?.healthy_count || 0}/{budget?.active_budgets_count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        {(budget?.exceeded_count || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-red-900 text-sm">
                {budget.exceeded_count} Budget Alert{budget.exceeded_count > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-red-700">
                Budget exceeded this month
              </p>
            </div>
          </motion.div>
        )}

        {/* Monthly Comparison */}
        {summary && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">vs Last Month</span>
              <span className={`text-sm font-medium ${
                (summary.month_over_month_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(summary.month_over_month_change || 0) >= 0 ? '+' : ''}
                {summary.month_over_month_change?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-beige animate-pulse rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-2 rounded-full ${
                  (summary.month_over_month_change || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
        )}

        {/* Pending Expenses */}
        {summary && summary.pending_expenses > 0 && (
          <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
              <span className="text-lg">⏰</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-yellow-900 dark:text-yellow-100 text-sm">
                {summary.pending_expenses} Pending Payment{summary.pending_expenses > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Expenses awaiting payment
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}