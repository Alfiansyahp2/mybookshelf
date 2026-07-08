import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  AlertCircle,
  Plus,
  Filter,
  Download,
  Calendar,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useAccountingOverview } from '../hooks/accounting/useAccountingReports';
import { useExpenses } from '../hooks/accounting/useExpenses';
import { useBudgetSummary } from '../hooks/accounting/useBudgets';
import AccountingDashboard from '../components/accounting/AccountingDashboard';
import ExpenseList from '../components/accounting/ExpenseList';
import ExpenseModal from '../components/accounting/ExpenseModal';
import BudgetTracker from '../components/accounting/BudgetTracker';
import CategoryManager from '../components/accounting/CategoryManager';

export default function Accounting() {
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'budgets' | 'categories'>('overview');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: overview, isLoading: overviewLoading } = useAccountingOverview({ period: 'month' });
  const { data: budgetSummary } = useBudgetSummary();
  const { data: expenses } = useExpenses({ per_page: 10 });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'budgets', label: 'Budgets', icon: Wallet },
    { id: 'categories', label: 'Categories', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your book-related expenses and budgets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Alert for Budget Exceeded */}
      {budgetSummary && budgetSummary.exceeded_count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-900 dark:text-red-100">
              {budgetSummary.exceeded_count} Budget Alert{budgetSummary.exceeded_count > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              You have exceeded your budget limits this month
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview?.summary?.formatted_total || 'Rp 0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {budgetSummary?.active_budgets_count || 0} Active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">vs Last Month</p>
              <p className={`text-2xl font-bold ${
                (overview?.summary?.month_over_month_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(overview?.summary?.month_over_month_change || 0) >= 0 ? '+' : ''}
                {overview?.summary?.month_over_month_change?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview?.summary?.pending_expenses || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <AccountingDashboard />}
          {activeTab === 'expenses' && <ExpenseList />}
          {activeTab === 'budgets' && <BudgetTracker />}
          {activeTab === 'categories' && <CategoryManager />}
        </div>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <ExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSuccess={() => {
            setShowExpenseModal(false);
            // Invalidate queries to refresh data
          }}
        />
      )}
    </div>
  );
}
