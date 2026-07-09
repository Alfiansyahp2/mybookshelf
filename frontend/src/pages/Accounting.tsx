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
          <h1 className="text-3xl font-bold font-serif text-darkBrown">Accounting</h1>
          <p className="text-walnut/80 mt-1">
            Track your book-related expenses and budgets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-walnut hover:bg-beige rounded-lg rounded-lg"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-walnut text-cream rounded-lg hover:bg-darkBrown shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Alert for Budget Exceeded */}
      {budgetSummary?.data && budgetSummary.data.exceeded_count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-900">
              {budgetSummary.data.exceeded_count} Budget Alert{budgetSummary.data.exceeded_count > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-red-700">
              You have exceeded your budget limits this month
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cream border border-beige p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-sm text-walnut/80">Total Expenses</p>
              <p className="text-2xl font-bold text-darkBrown">
                {overview?.data?.summary?.formatted_total || 'Rp 0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cream border border-beige p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-walnut/20 rounded-lg">
              <Wallet className="w-6 h-6 text-walnut" />
            </div>
            <div>
              <p className="text-sm text-walnut/80">Budget</p>
              <p className="text-2xl font-bold text-darkBrown">
                {budgetSummary?.data?.active_budgets_count || 0} Active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cream border border-beige p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-darkBrown/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-darkBrown" />
            </div>
            <div>
              <p className="text-sm text-walnut/80">vs Last Month</p>
              <p className={`text-2xl font-bold ${
                (overview?.data?.summary?.month_over_month_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(overview?.data?.summary?.month_over_month_change || 0) >= 0 ? '+' : ''}
                {overview?.data?.summary?.month_over_month_change?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cream border border-beige p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold/30 rounded-lg">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-sm text-walnut/80">Pending</p>
              <p className="text-2xl font-bold text-darkBrown">
                {overview?.data?.summary?.pending_expenses || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-cream border border-beige rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-beige bg-white/50">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-gold text-darkBrown'
                    : 'border-transparent text-walnut/80 hover:text-gray-700 dark:hover:text-gray-300'
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
