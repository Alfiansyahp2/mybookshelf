import type { FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "@shared/types";

interface BorrowLoanModalProps {
    isOpen: boolean;
    availableBooks: Book[];
    selectedLoanBookId: string;
    borrowedBy: string;
    dueDate: string;
    isSubmitting: boolean;
    onClose: () => void;
    onSelectBook: (bookId: string) => void;
    onBorrowedByChange: (value: string) => void;
    onDueDateChange: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
}

export default function BorrowLoanModal({
    isOpen,
    availableBooks,
    selectedLoanBookId,
    borrowedBy,
    dueDate,
    isSubmitting,
    onClose,
    onSelectBook,
    onBorrowedByChange,
    onDueDateChange,
    onSubmit,
}: BorrowLoanModalProps) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e1712] rounded-2xl shadow-2xl w-full max-w-md border border-walnut/15 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
                    <h2 className="font-serif font-bold text-lg text-darkBrown dark:text-cream">
                        {t("borrow.modal_title", "Loan a Book")}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-walnut mb-1">
                            {t("borrow.select_book", "Select Book")}
                        </label>
                        <select
                            value={selectedLoanBookId}
                            onChange={(e) => onSelectBook(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                            required
                        >
                            {availableBooks.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.title} — {b.author}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-walnut mb-1">
                            {t("borrow.borrower_name", "Borrower Name")}
                        </label>
                        <input
                            type="text"
                            value={borrowedBy}
                            onChange={(e) => onBorrowedByChange(e.target.value)}
                            placeholder={t(
                                "borrow.borrower_placeholder",
                                "e.g. Andi Pratama",
                            )}
                            className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-walnut mb-1">
                            {t("borrow.due_date", "Return Due Date")}
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            min={
                                new Date(Date.now() + 86400000)
                                    .toISOString()
                                    .split("T")[0]
                            }
                            onChange={(e) => onDueDateChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-walnut/20 text-sm font-medium text-walnut hover:bg-walnut/5"
                        >
                            {t("common.cancel", "Cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold disabled:opacity-50"
                        >
                            {isSubmitting
                                ? t("common.saving", "Saving...")
                                : t("borrow.confirm_loan", "Confirm Loan")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
