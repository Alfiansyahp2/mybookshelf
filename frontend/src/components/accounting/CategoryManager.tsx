import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, Trash2, FolderOpen, DollarSign, Settings } from 'lucide-react';
import { useExpenseCategories, useCreateExpenseCategory, useUpdateExpenseCategory, useDeleteExpenseCategory } from '../../hooks/accounting/useExpenseCategories';
import type { ExpenseCategory } from '../../types/accounting';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryManager({ isOpen, onClose }: CategoryManagerProps) {
  const { data: categoriesResponse, isLoading } = useExpenseCategories();
  const categories = categoriesResponse?.data || [];
  const createCategory = useCreateExpenseCategory();
  const updateCategory = useUpdateExpenseCategory();
  const deleteCategory = useDeleteExpenseCategory();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '📁',
    monthly_budget: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: formData,
        });
      } else {
        await createCategory.mutateAsync(formData);
      }
      setShowCreateModal(false);
      setEditingCategory(null);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory.mutateAsync(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '📁',
      monthly_budget: 0,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingCategory(null);
    setShowCreateModal(true);
  };

  const openEditModal = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon || '📁',
      monthly_budget: category.monthly_budget || 0,
    });
    setShowCreateModal(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-cream border border-beige rounded-lg shadow-sm-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-beige">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-beige rounded-lg">
                <FolderOpen className="w-6 h-6 text-walnut" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-darkBrown">
                  Expense Categories
                </h2>
                <p className="text-sm text-walnut/80">
                  Manage your expense categories and budgets
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-walnut text-cream rounded-lg hover:bg-darkBrown transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Category
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-beige rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-walnut/80" />
              </button>
            </div>
          </div>

          {/* Category List */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-24"></div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 mx-auto text-walnut/40 mb-4" />
                <p className="text-walnut/80 mb-4">No categories yet</p>
                <button
                  onClick={openCreateModal}
                  className="text-walnut hover:text-darkBrown font-medium"
                >
                  Create your first category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category: ExpenseCategory) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={() => openEditModal(category)}
                    onDelete={() => handleDelete(category.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CategoryFormModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCategory(null);
            resetForm();
          }}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isEditing={!!editingCategory}
        />
      )}
    </AnimatePresence>
  );
}

// Category Card Component
interface CategoryCardProps {
  category: ExpenseCategory;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-beige rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: category.color + '20' }}
          >
            {category.icon || '📁'}
          </div>
          <div>
            <h4 className="font-semibold text-darkBrown">{category.name}</h4>
            {category.is_default && (
              <span className="text-xs text-walnut/80">Default</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!category.is_default && (
            <>
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-beige rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 text-walnut/70" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {category.description && (
        <p className="text-sm text-walnut/70 mb-3 line-clamp-2">
          {category.description}
        </p>
      )}

      {category.monthly_budget && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-walnut/80">Monthly Budget</span>
          <span className="font-semibold text-darkBrown">
            Rp {category.monthly_budget.toLocaleString()}
          </span>
        </div>
      )}

      {category.total_expenses !== undefined && (
        <div className="mt-3 pt-3 border-t border-beige">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-walnut/80">Total Spent</span>
            <span className="font-semibold text-darkBrown">
              Rp {category.total_expenses.toLocaleString()}
            </span>
          </div>
          {category.monthly_budget && (
            <div className="w-full bg-beige rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  (category.budget_usage_percentage || 0) > 80 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(category.budget_usage_percentage || 0, 100)}%` }}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Category Form Modal Component
interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  monthly_budget: number;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CategoryFormData;
  setFormData: (data: CategoryFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

function CategoryFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isEditing,
}: CategoryFormModalProps) {
  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
  ];

  const ICONS = ['📚', '📦', '🔧', '🎁', '📝', '💼', '🏠', '✈️', '🍔', '💊'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-cream border border-beige rounded-lg shadow-sm-xl max-w-md w-full"
        >
          <div className="p-6 border-b border-beige">
            <h3 className="text-lg font-semibold text-darkBrown">
              {isEditing ? 'Edit Category' : 'New Category'}
            </h3>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-beige rounded-lg focus:ring-2 focus:ring-walnut focus:outline-none"
                placeholder="e.g., Books, Shipping"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-white border border-beige rounded-lg focus:ring-2 focus:ring-walnut focus:outline-none"
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-darkBrown mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-beige rounded-lg focus:ring-2 focus:ring-walnut focus:outline-none"
                >
                  {ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-darkBrown mb-2">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {COLORS.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className="w-6 h-6 rounded border-2 border-transparent hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-2">
                Monthly Budget
              </label>
              <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_budget}
                    onChange={(e) => setFormData({ ...formData, monthly_budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 pl-10 bg-white border border-beige rounded-lg focus:ring-2 focus:ring-walnut focus:outline-none"
                    placeholder="0.00"
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-walnut/50" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-beige bg-white text-walnut rounded-lg hover:bg-beige transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-walnut text-cream rounded-lg hover:bg-darkBrown transition-colors"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}