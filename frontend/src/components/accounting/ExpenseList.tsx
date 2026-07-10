import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Receipt, Edit, Trash2 } from 'lucide-react';
import { useExpenses, useDeleteExpense } from '../../hooks/accounting/useExpenses';
import { useExpenseCategories } from '../../hooks/accounting/useExpenseCategories';
import type { Expense, ExpenseFilters, ExpenseStatus } from '../../types/accounting';

// Helper functions - defined outside components to be reused
const getStatusColor = (status: ExpenseStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

interface ExpenseListProps {
  userId?: string;
  onExpenseClick?: (expense: Expense) => void;
  onEditExpense?: (expense: Expense) => void;
}

export default function ExpenseList({ userId, onExpenseClick, onEditExpense }: ExpenseListProps) {
  const [filters, setFilters] = useState<ExpenseFilters>({
    per_page: 20,
    sort_by: 'expense_date',
    sort_order: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: expensesData, isLoading } = useExpenses(filters);
  const deleteExpense = useDeleteExpense();
  const { data: categories = [] } = useExpenseCategories();

  const expenses = Array.isArray(expensesData?.data) ? expensesData.data : [];

  const handleFilterChange = (key: keyof ExpenseFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense.mutateAsync(expenseId);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  return (
    <div className="bg-cream border border-beige rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-darkBrown">Expenses</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-2">
                Category
              </label>
              <select
                value={filters.category_id || ''}
                onChange={(e) => handleFilterChange('category_id', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value as ExpenseStatus)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="divide-y dark:divide-gray-700">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-walnut/80">No expenses found</p>
            <p className="text-sm text-walnut/60 mt-2">
              {searchTerm || filters.category_id ? 'Try adjusting your filters' : 'Add your first expense to get started'}
            </p>
          </div>
        ) : (
          expenses.map((expense: Expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onClick={() => onExpenseClick?.(expense)}
              onEdit={() => onEditExpense?.(expense)}
              onDelete={() => handleDelete(expense.id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {expensesData && expensesData.last_page > 1 && (
        <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {expensesData.current_page} of {expensesData.last_page}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFilterChange('per_page', filters.per_page)}
              disabled={expensesData.current_page === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => handleFilterChange('per_page', filters.per_page)}
              disabled={expensesData.current_page === expensesData.last_page}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Expense Row Component
interface ExpenseRowProps {
  expense: Expense;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ExpenseRow({ expense, onClick, onEdit, onDelete }: ExpenseRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 hover:bg-white/40 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">{expense.category?.icon || '💰'}</span>
            <div>
              <h4 className="font-semibold text-darkBrown">{expense.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(expense.status)}`}>
                  {expense.status}
                </span>
                {expense.is_recurring && (
                  <span className="text-xs text-gray-500">🔄 Recurring</span>
                )}
                {expense.has_reminder && (
                  <span className="text-xs text-gray-500">🔔 Reminder</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
            <div>
              <p className="text-walnut/80">Amount</p>
              <p className="font-semibold text-darkBrown">
                {expense.currency} {expense.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-walnut/80">Category</p>
              <p className="text-darkBrown">
                {expense.category?.name || 'Uncategorized'}
              </p>
            </div>
            <div>
              <p className="text-walnut/80">Date</p>
              <p className="text-darkBrown">
                {new Date(expense.expense_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-walnut/80">Payment</p>
              <p className="text-darkBrown capitalize">
                {expense.payment_method.replace('_', ' ')}
              </p>
            </div>
          </div>

          {expense.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-1">
              {expense.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {expense.receipt_data && (
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg" title="Has receipt">
              <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}