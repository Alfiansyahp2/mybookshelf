import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Receipt, Edit, Trash2 } from "lucide-react";
import {
    useExpenses,
    useDeleteExpense,
} from "../../hooks/accounting/useExpenses";
import { useExpenseCategories } from "../../hooks/accounting/useExpenseCategories";
import type {
    Expense,
    ExpenseFilters,
    ExpenseStatus,
} from "../../types/accounting";
import { useTranslation } from "react-i18next";
// Helper functions - defined outside components to be reused
const getStatusColor = (status: ExpenseStatus) => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-700";
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

interface ExpenseListProps {
    userId?: string;
    onExpenseClick?: (expense: Expense) => void;
    onEditExpense?: (expense: Expense) => void;
}

export default function ExpenseList({
    userId,
    onExpenseClick,
    onEditExpense,
}: ExpenseListProps) {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<ExpenseFilters>({
        per_page: 20,
        sort_by: "expense_date",
        sort_order: "desc",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

    const { data: expensesData, isLoading } = useExpenses(filters);
    const deleteExpense = useDeleteExpense();
    const { data: categoriesResponse } = useExpenseCategories();
    const categories = categoriesResponse?.data || [];

    const expenses = Array.isArray(expensesData?.data?.data)
        ? expensesData.data.data
        : Array.isArray(expensesData?.data)
          ? expensesData.data
          : [];

    const handleFilterChange = (key: keyof ExpenseFilters, value: any) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleDelete = (expenseId: string) => {
        setExpenseToDelete(expenseId);
    };

    const confirmDelete = async () => {
        if (!expenseToDelete) return;
        try {
            await deleteExpense.mutateAsync(expenseToDelete);
            setExpenseToDelete(null);
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    return (
        <div className="bg-cream border border-beige rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-walnut/10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-darkBrown">
                        {t("accounting.expense_list.expenses", "Expenses")}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg transition-colors ${
                                showFilters
                                    ? "bg-walnut/20 text-darkBrown"
                                    : "hover:bg-walnut/10 text-walnut"
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
                        placeholder={t(
                            "accounting.expense_list.search_placeholder",
                            "Search expenses...",
                        )}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                    />
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="p-6 border-b border-walnut/10 bg-cream/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-darkBrown mb-2">
                                {t(
                                    "accounting.expense_list.category",
                                    "Category",
                                )}
                            </label>
                            <select
                                value={filters.category_id || ""}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "category_id",
                                        e.target.value || undefined,
                                    )
                                }
                                className="w-full px-3 py-2 border border-walnut/20 bg-white/50 rounded-lg focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown text-sm"
                            >
                                <option value="">
                                    {t(
                                        "accounting.expense_list.all_categories",
                                        "All Categories",
                                    )}
                                </option>
                                {categories.map((category: any) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.icon} {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-darkBrown mb-2">
                                {t("accounting.expense_list.status", "Status")}
                            </label>
                            <select
                                value={filters.status || ""}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "status",
                                        e.target.value as ExpenseStatus,
                                    )
                                }
                                className="w-full px-3 py-2 border border-walnut/20 bg-white/50 rounded-lg focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown text-sm"
                            >
                                <option value="">
                                    {t(
                                        "accounting.expense_list.all_status",
                                        "All Status",
                                    )}
                                </option>
                                <option value="completed">
                                    {t(
                                        "accounting.expense_list.status_completed",
                                        "Completed",
                                    )}
                                </option>
                                <option value="pending">
                                    {t(
                                        "accounting.expense_list.status_pending",
                                        "Pending",
                                    )}
                                </option>
                                <option value="cancelled">
                                    {t(
                                        "accounting.expense_list.status_cancelled",
                                        "Cancelled",
                                    )}
                                </option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-darkBrown mb-2">
                                {t(
                                    "accounting.expense_list.from_date",
                                    "From Date",
                                )}
                            </label>
                            <input
                                type="date"
                                value={filters.start_date || ""}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "start_date",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-walnut/20 bg-white/50 rounded-lg focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-darkBrown mb-2">
                                {t(
                                    "accounting.expense_list.to_date",
                                    "To Date",
                                )}
                            </label>
                            <input
                                type="date"
                                value={filters.end_date || ""}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "end_date",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-walnut/20 bg-white/50 rounded-lg focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Expense List */}
            <div className="divide-y divide-walnut/10">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-walnut/10 rounded-xl h-20"
                            ></div>
                        ))}
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="p-12 text-center">
                        <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-walnut/80">
                            {t(
                                "accounting.expense_list.no_expenses",
                                "No expenses found",
                            )}
                        </p>
                        <p className="text-sm text-walnut/60 mt-2">
                            {searchTerm || filters.category_id
                                ? t(
                                      "accounting.expense_list.adjust_filters",
                                      "Try adjusting your filters",
                                  )
                                : t(
                                      "accounting.expense_list.add_first",
                                      "Add your first expense to get started",
                                  )}
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
                <div className="p-4 border-t border-walnut/10 flex items-center justify-between">
                    <p className="text-sm text-walnut">
                        {t(
                            "accounting.expense_list.page",
                            "Page {{current}} of {{last}}",
                            {
                                current: expensesData.current_page,
                                last: expensesData.last_page,
                            },
                        )}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                handleFilterChange("per_page", filters.per_page)
                            }
                            disabled={expensesData.current_page === 1}
                            className="px-3 py-1 border border-walnut/20 rounded-lg hover:bg-walnut/10 text-darkBrown disabled:opacity-50 transition-colors text-sm"
                        >
                            {t("accounting.expense_list.previous", "Previous")}
                        </button>
                        <button
                            onClick={() =>
                                handleFilterChange("per_page", filters.per_page)
                            }
                            disabled={
                                expensesData.current_page ===
                                expensesData.last_page
                            }
                            className="px-3 py-1 border border-walnut/20 rounded-lg hover:bg-walnut/10 text-darkBrown disabled:opacity-50 transition-colors text-sm"
                        >
                            {t("accounting.expense_list.next", "Next")}
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {expenseToDelete && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            className="bg-cream/95 backdrop-blur-md p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-walnut/20 max-w-sm w-full"
                        >
                            <h3 className="text-lg font-bold text-darkBrown mb-2">
                                {t("accounting.expense_list.delete_title", "Hapus Pengeluaran")}
                            </h3>
                            <p className="text-walnut/80 text-sm mb-6">
                                {t("accounting.expense_list.confirm_delete", "Are you sure you want to delete this expense?")}
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setExpenseToDelete(null)}
                                    className="px-4 py-2 rounded-xl text-sm font-bold text-walnut bg-walnut/10 hover:bg-walnut/20 transition-colors"
                                >
                                    {t("common.cancel", "Batal")}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600/90 hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    {t("common.delete", "Hapus")}
                                </button>
                            </div>
                        </motion.div>
                    </div>,
                    document.body
                )}
            </AnimatePresence>
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
    const { t } = useTranslation();
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
                        <span className="text-lg">
                            {expense.category?.icon || "💰"}
                        </span>
                        <div>
                            <h4 className="font-semibold text-darkBrown">
                                {expense.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded ${getStatusColor(expense.status)}`}
                                >
                                    {t(
                                        `accounting.expense_list.status_${expense.status}`,
                                        expense.status,
                                    )}
                                </span>
                                {expense.is_recurring && (
                                    <span className="text-xs text-walnut/70">
                                        🔄{" "}
                                        {t(
                                            "accounting.expense_list.recurring",
                                            "Recurring",
                                        )}
                                    </span>
                                )}
                                {expense.has_reminder && (
                                    <span className="text-xs text-walnut/70">
                                        🔔{" "}
                                        {t(
                                            "accounting.expense_list.reminder",
                                            "Reminder",
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                            <p className="text-walnut/80">
                                {t("accounting.expense_list.amount", "Amount")}
                            </p>
                            <p className="font-semibold text-darkBrown">
                                {expense.currency}{" "}
                                {expense.amount.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-walnut/80">
                                {t(
                                    "accounting.expense_list.category",
                                    "Category",
                                )}
                            </p>
                            <p className="text-darkBrown">
                                {expense.category?.name ||
                                    t(
                                        "accounting.dashboard.uncategorized",
                                        "Uncategorized",
                                    )}
                            </p>
                        </div>
                        <div>
                            <p className="text-walnut/80">
                                {t("accounting.expense_list.date", "Date")}
                            </p>
                            <p className="text-darkBrown">
                                {new Date(
                                    expense.expense_date,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-walnut/80">
                                {t(
                                    "accounting.expense_list.payment",
                                    "Payment",
                                )}
                            </p>
                            <p className="text-darkBrown capitalize">
                                {expense.payment_method.replace("_", " ")}
                            </p>
                        </div>
                    </div>

                    {expense.description && (
                        <p className="text-sm text-walnut/80 mt-2 line-clamp-1">
                            {expense.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                    {expense.receipt_data && (
                        <div
                            className="p-1.5 bg-walnut/10 rounded-lg"
                            title="Has receipt"
                        >
                            <Receipt className="w-4 h-4 text-walnut" />
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="p-1.5 hover:bg-walnut/10 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4 text-walnut/70" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-1.5 hover:bg-red-50:bg-red-900 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4 text-walnut/70" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

