import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import {
    X,
    DollarSign,
    Receipt,
    Upload,
    Calendar,
    CreditCard,
    Wallet,
    Repeat,
    Bell,
    Trash2,
} from "lucide-react";
import {
    useCreateExpense,
    useUpdateExpense,
    useDeleteExpense,
    useUploadReceipt,
} from "../../hooks/accounting/useExpenses";
import { useExpenseCategories } from "../../hooks/accounting/useExpenseCategories";
import { useBooks } from "../../hooks/useBooks";
import type {
    Expense,
    ExpenseFormData,
    PaymentMethod,
} from "../../types/accounting";
import { useTranslation } from "react-i18next";
interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense?: Expense | null;
    mode?: "create" | "edit";
}

const PAYMENT_METHODS = [
    { value: "cash", label: "Cash", icon: Wallet },
    { value: "transfer", label: "Transfer", icon: CreditCard },
    { value: "e-wallet", label: "E-Wallet", icon: Wallet },
    { value: "credit_card", label: "Credit Card", icon: CreditCard },
];

export default function ExpenseModal({
    isOpen,
    onClose,
    expense,
    mode = "create",
}: ExpenseModalProps) {
    const { t } = useTranslation();
    const createExpense = useCreateExpense();
    const updateExpense = useUpdateExpense();
    const deleteExpense = useDeleteExpense();
    const uploadReceipt = useUploadReceipt();
    const { data: categoriesResponse } = useExpenseCategories();
    const categories = categoriesResponse?.data || [];
    const { data: booksResponse } = useBooks();
    const books = Array.isArray(booksResponse?.data?.data)
        ? booksResponse.data.data
        : Array.isArray(booksResponse?.data)
          ? booksResponse.data
          : Array.isArray(booksResponse)
            ? booksResponse
            : [];

    const [formData, setFormData] = useState<ExpenseFormData>({
        title: "",
        description: "",
        amount: 0,
        currency: "IDR",
        category_id: "",
        payment_method: "cash",
        expense_date: new Date().toISOString().split("T")[0],
        is_recurring: false,
        recurring_period: "monthly",
        book_id: "",
        vendor: "",
        location: "",
        has_reminder: false,
        reminder_date: "",
        status: "completed",
    });

    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens or expense changes
    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && expense) {
                setFormData({
                    title: expense.title,
                    description: expense.description || "",
                    amount: expense.amount,
                    currency: expense.currency,
                    category_id: expense.category_id || "",
                    payment_method: expense.payment_method,
                    expense_date: expense.expense_date.split("T")[0],
                    is_recurring: expense.is_recurring,
                    recurring_period: expense.recurring_period || "monthly",
                    book_id: expense.book_id || "",
                    vendor: expense.vendor || "",
                    location: expense.location || "",
                    has_reminder: expense.has_reminder,
                    reminder_date: expense.reminder_date
                        ? expense.reminder_date.split("T")[0]
                        : "",
                    status: expense.status,
                });
            } else {
                // Reset to defaults for create mode
                setFormData({
                    title: "",
                    description: "",
                    amount: 0,
                    currency: "IDR",
                    category_id: "",
                    payment_method: "cash",
                    expense_date: new Date().toISOString().split("T")[0],
                    is_recurring: false,
                    recurring_period: "monthly",
                    book_id: "",
                    vendor: "",
                    location: "",
                    has_reminder: false,
                    reminder_date: "",
                    status: "completed",
                });
            }
            setReceiptFile(null);
            setReceiptPreview(null);
        }
    }, [isOpen, mode, expense]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dataToSubmit = { ...formData };

            // Handle receipt upload
            if (receiptFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    dataToSubmit.receipt_data = reader.result as string;
                    submitExpense(dataToSubmit);
                };
                reader.readAsDataURL(receiptFile);
            } else {
                submitExpense(dataToSubmit);
            }
        } catch (error) {
            console.error("Error submitting expense:", error);
            setIsSubmitting(false);
        }
    };

    const submitExpense = async (data: ExpenseFormData) => {
        try {
            if (mode === "create") {
                await createExpense.mutateAsync(data);
            } else {
                await updateExpense.mutateAsync({ id: expense!.id, data });
            }
            onClose();
        } catch (error) {
            console.error("Error submitting expense:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReceiptFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setReceiptPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async () => {
        if (!expense || !window.confirm(t("accounting.expense_modal.confirm_delete", "Are you sure you want to delete this expense?"))) return;
        
        try {
            await deleteExpense.mutateAsync(expense.id);
            onClose();
        } catch (error) {
            console.error("Error deleting expense:", error);
            alert("Gagal menghapus pengeluaran. " + (error as any)?.message);
        }
    };

    if (!isOpen) return null;

    const modalTitle = mode === "create" 
        ? t("accounting.expense_modal.add_new", "Add New Expense") 
        : t("accounting.expense_modal.edit", "Edit Expense");

    const modalFooter = (
        <div className="flex items-center gap-4 w-full">
            {mode === "edit" && (
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteExpense.isPending}
                    className="w-10 h-10 bg-transparent text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors mr-auto"
                    title={t("common.delete", "Delete")}
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            )}
            <div className={mode === "create" ? "flex-1" : ""} />
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-walnut/20 text-walnut rounded-lg hover:bg-walnut/5 transition-colors ml-auto"
            >
                {t("accounting.expense_modal.cancel", "Cancel")}
            </button>
            <button
                type="submit"
                form="expense-form"
                disabled={isSubmitting}
                className="px-6 py-2 bg-walnut text-cream rounded-lg hover:bg-darkBrown disabled:opacity-50 transition-colors flex items-center gap-2"
            >
                {isSubmitting ? (
                    t("accounting.expense_modal.saving", "Saving...")
                ) : (
                    <>
                        {mode === "create"
                            ? t("accounting.expense_modal.create_btn", "Create Expense")
                            : t("accounting.expense_modal.update_btn", "Update Expense")}
                    </>
                )}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="lg"
            footer={modalFooter}
            contentClassName="!p-0" // We'll handle padding inside the form
        >
            <form id="expense-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-darkBrown mb-2">
                                {t("accounting.expense_modal.title", "Title *")}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                placeholder={t(
                                    "accounting.expense_modal.title_placeholder",
                                    "e.g., 'The Great Gatsby - Paperback'",
                                )}
                            />
                        </div>

                        {/* Amount & Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.amount",
                                        "Amount *",
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                amount:
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                            })
                                        }
                                        className="w-full px-4 py-2 pl-10 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                        placeholder="0.00"
                                    />
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.currency",
                                        "Currency",
                                    )}
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            currency: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                >
                                    <option value="IDR">
                                        IDR - Indonesian Rupiah
                                    </option>
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">
                                        GBP - British Pound
                                    </option>
                                    <option value="JPY">
                                        JPY - Japanese Yen
                                    </option>
                                    <option value="SGD">
                                        SGD - Singapore Dollar
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Category & Payment Method */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.category",
                                        "Category",
                                    )}
                                </label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                >
                                    <option value="">
                                        {t(
                                            "accounting.expense_modal.select_category",
                                            "Select category",
                                        )}
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.icon} {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.payment_method",
                                        "Payment Method",
                                    )}
                                </label>
                                <select
                                    value={formData.payment_method}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            payment_method: e.target
                                                .value as PaymentMethod,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                >
                                    {PAYMENT_METHODS.map((method) => (
                                        <option
                                            key={method.value}
                                            value={method.value}
                                        >
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Book & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.related_book",
                                        "Related Book (Optional)",
                                    )}
                                </label>
                                <select
                                    value={formData.book_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            book_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                >
                                    <option value="">
                                        {t(
                                            "accounting.expense_modal.select_book",
                                            "Select book",
                                        )}
                                    </option>
                                    {books.slice(0, 50).map((book) => (
                                        <option key={book.id} value={book.id}>
                                            {book.title} by {book.author}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.expense_date",
                                        "Expense Date *",
                                    )}
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.expense_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            expense_date: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-darkBrown mb-2">
                                {t(
                                    "accounting.expense_modal.description",
                                    "Description",
                                )}
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                placeholder={t(
                                    "accounting.expense_modal.desc_placeholder",
                                    "Add notes about this expense...",
                                )}
                            />
                        </div>

                        {/* Vendor & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.vendor",
                                        "Vendor",
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={formData.vendor}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            vendor: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                    placeholder={t(
                                        "accounting.expense_modal.vendor_placeholder",
                                        "e.g., Amazon, Local Bookstore",
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-darkBrown mb-2">
                                    {t(
                                        "accounting.expense_modal.location",
                                        "Location",
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            location: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-walnut/20 bg-white/50 rounded-xl focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                    placeholder={t(
                                        "accounting.expense_modal.location_placeholder",
                                        "e.g., Online, Jakarta",
                                    )}
                                />
                            </div>
                        </div>

                        {/* Recurring & Reminder */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="is_recurring"
                                    checked={formData.is_recurring}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_recurring: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 text-walnut rounded border-walnut/30 focus:ring-walnut/30"
                                />
                                <div className="flex-1">
                                    <label
                                        htmlFor="is_recurring"
                                        className="flex items-center gap-2 text-sm font-medium text-darkBrown cursor-pointer"
                                    >
                                        <Repeat className="w-4 h-4" />
                                        {t(
                                            "accounting.expense_modal.recurring",
                                            "Recurring Expense",
                                        )}
                                    </label>
                                    {formData.is_recurring && (
                                        <select
                                            value={formData.recurring_period}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    recurring_period: e.target
                                                        .value as any,
                                                })
                                            }
                                            className="mt-2 w-full px-3 py-1 text-sm border border-walnut/20 bg-white/50 rounded-lg focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                        >
                                            <option value="daily">
                                                {t(
                                                    "accounting.expense_modal.daily",
                                                    "Daily",
                                                )}
                                            </option>
                                            <option value="weekly">
                                                {t(
                                                    "accounting.expense_modal.weekly",
                                                    "Weekly",
                                                )}
                                            </option>
                                            <option value="monthly">
                                                {t(
                                                    "accounting.expense_modal.monthly",
                                                    "Monthly",
                                                )}
                                            </option>
                                            <option value="yearly">
                                                {t(
                                                    "accounting.expense_modal.yearly",
                                                    "Yearly",
                                                )}
                                            </option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="has_reminder"
                                    checked={formData.has_reminder}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            has_reminder: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 text-walnut rounded border-walnut/30 focus:ring-walnut/30"
                                />
                                <div className="flex-1">
                                    <label
                                        htmlFor="has_reminder"
                                        className="flex items-center gap-2 text-sm font-medium text-darkBrown cursor-pointer"
                                    >
                                        <Bell className="w-4 h-4" />
                                        {t(
                                            "accounting.expense_modal.payment_reminder",
                                            "Payment Reminder",
                                        )}
                                    </label>
                                    {formData.has_reminder && (
                                        <input
                                            type="date"
                                            value={formData.reminder_date}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    reminder_date:
                                                        e.target.value,
                                                })
                                            }
                                            className="mt-2 w-full px-3 py-1 text-sm border border-walnut/20 bg-white/50 rounded-lg focus:ring-2 focus:ring-walnut/30 focus:border-walnut focus:bg-white transition-all text-darkBrown"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Receipt Upload */}
                        <div>
                            <label className="block text-sm font-medium text-darkBrown mb-2">
                                {t(
                                    "accounting.expense_modal.receipt",
                                    "Receipt/Proof of Purchase",
                                )}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-walnut transition-colors">
                                {receiptPreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={receiptPreview}
                                            alt="Receipt preview"
                                            className="max-h-40 mx-auto rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReceiptFile(null);
                                                setReceiptPreview(null);
                                            }}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            {t(
                                                "accounting.expense_modal.remove_receipt",
                                                "Remove receipt",
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <label className="cursor-pointer">
                                            <span className="text-walnut hover:text-darkBrown font-medium">
                                                {t(
                                                    "accounting.expense_modal.upload_receipt",
                                                    "Upload receipt",
                                                )}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleReceiptChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {t(
                                                "accounting.expense_modal.receipt_format",
                                                "PNG, JPG up to 10MB",
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

            </form>
        </Modal>
    );
}

