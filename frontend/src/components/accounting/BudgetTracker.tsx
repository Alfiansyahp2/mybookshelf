import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, AlertCircle, Target, Plus, Edit, Trash2 } from 'lucide-react';
import { useBudgets, useBudgetProgress, useDeleteBudget, useCreateBudget, useUpdateBudget } from '../../hooks/accounting/useBudgets';
import { useBudgetSummary } from '../../hooks/accounting/useBudgets';
import type { Budget, BudgetFormData } from '../../types/accounting';

interface BudgetTrackerProps {
  userId?: string;
  period?: 'monthly' | 'yearly' | 'all';
}

export default function BudgetTracker({ userId, period = 'monthly' }: BudgetTrackerProps) {
  const { data: budgets = [], isLoading } = useBudgets({ is_active: true, period });
  const { data: summary } = useBudgetSummary();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getBudgetStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded':
        return TrendingUp;
      case 'warning':
        return AlertCircle;
      case 'healthy':
        return Target;
      default:
        return Wallet;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-beige rounded w-1/4"></div>
          <div className="h-32 bg-beige rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">Total Budget</p>
              <p className="text-2xl font-bold font-serif text-darkBrown">
                Rp {(summary?.total_budget || 0).toLocaleString()}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">Total Spent</p>
              <p className="text-2xl font-bold font-serif text-darkBrown">
                Rp {(summary?.total_spent || 0).toLocaleString()}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">Remaining</p>
              <p className="text-2xl font-bold font-serif text-darkBrown">
                Rp {(summary?.total_remaining || 0).toLocaleString()}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-walnut/80">Usage</p>
              <p className="text-2xl font-bold font-serif text-darkBrown">
                {summary?.overall_usage_percentage?.toFixed(1) || 0}%
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              (summary?.overall_usage_percentage || 0) > 80 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <span className={(summary?.overall_usage_percentage || 0) > 80 ? 'text-red-600' : 'text-green-600'}>
                {(summary?.overall_usage_percentage || 0) > 80 ? '!' : '✓'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-cream border border-beige rounded-lg shadow-sm">
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-darkBrown">
            Active Budgets
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Budget
          </button>
        </div>

        <div className="p-6">
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-walnut/80 mb-4">No budgets set up yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first budget
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onViewDetails={() => setSelectedBudget(budget)}
                  onEdit={() => {/* Handle edit */}}
                  onDelete={() => {/* Handle delete */}}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts Summary */}
      {(summary?.exceeded_count || 0) > 0 || (summary?.warning_count || 0) > 0 ? (
        <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-darkBrown mb-4">Budget Alerts</h4>
          <div className="space-y-3">
            {(summary?.exceeded_count || 0) > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">
                    {summary.exceeded_count} Budget{summary.exceeded_count > 1 ? 's' : ''} Exceeded
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    You've spent more than your allocated budget
                  </p>
                </div>
              </div>
            )}
            {(summary?.warning_count || 0) > 0 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    {summary.warning_count} Budget{summary.warning_count > 1 ? 's' : ''} at Warning Level
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You've used 80% or more of your budget
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Budget Card Component
interface BudgetCardProps {
  budget: Budget;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function BudgetCard({ budget, onViewDetails, onEdit, onDelete }: BudgetCardProps) {
  const { data: progress } = useBudgetProgress(budget.id);
  const StatusIcon = budget.status === 'exceeded' ? TrendingUp :
                    budget.status === 'warning' ? AlertCircle : Target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-beige bg-white/40 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${getBudgetStatusColor(budget.status || 'healthy')}`}>
              <StatusIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-darkBrown">{budget.name}</h4>
              <p className="text-sm text-walnut/80 capitalize">{budget.period}</p>
            </div>
          </div>
          {budget.category && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg">{budget.category.icon}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{budget.category.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewDetails}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View details"
          >
            <Target className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit budget"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Delete budget"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">Progress</span>
          <span className={`font-medium ${
            (progress?.usage_percentage || 0) > 80 ? 'text-red-600' : 'text-darkBrown'
          }`}>
            {progress?.usage_percentage?.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-beige rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              (progress?.usage_percentage || 0) > 80 ? 'bg-red-500' :
              (progress?.usage_percentage || 0) > 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(progress?.usage_percentage || 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Amount Details */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-walnut/80">Budget</p>
          <p className="font-medium text-darkBrown">
            Rp {progress?.budget_amount?.toLocaleString() || 0}
          </p>
        </div>
        <div>
          <p className="text-walnut/80">Spent</p>
          <p className="font-medium text-darkBrown">
            Rp {progress?.total_spent?.toLocaleString() || 0}
          </p>
        </div>
        <div>
          <p className="text-walnut/80">Remaining</p>
          <p className={`font-medium ${
            (progress?.remaining_amount || 0) < 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            Rp {progress?.remaining_amount?.toLocaleString() || 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function getBudgetStatusColor(status: string): string {
  switch (status) {
    case 'exceeded':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'warning':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'healthy':
      return 'bg-green-100 text-green-700 border-green-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}