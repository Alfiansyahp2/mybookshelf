import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    BookUp2,
    BookCheck,
    Clock,
    AlertTriangle,
    Search,
    Plus,
    Calendar,
    User,
    RotateCcw,
    X,
} from "lucide-react";
import {
    useBooks,
    useBorrowBook,
    useReturnBook,
} from "../hooks/useBooks";
import { useBookstore } from "../store/useBookstore";
import type { Book } from "../types";
import SEO from "../components/SEO";

type FilterTab = "borrowed" | "overdue" | "available";

function isBookOverdue(dueDate?: string): boolean {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
}

function defaultTomorrowDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
}

export default function BorrowLoan() {
    const { t } = useTranslation();
    const { data: booksResponse, isLoading } = useBooks({});
    const borrowBook = useBorrowBook();
    const returnBook = useReturnBook();
    const { setSelectedBookId, toggleBookDetail } = useBookstore();

    const [activeTab, setActiveTab] = useState<FilterTab>("borrowed");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [selectedLoanBookId, setSelectedLoanBookId] = useState("");
    const [borrowedBy, setBorrowedBy] = useState("");
    const [dueDate, setDueDate] = useState(defaultTomorrowDate);

    const allBooks = useMemo(
        () => booksResponse?.data?.data || [],
        [booksResponse],
    );

    const borrowedBooks = useMemo(
        () => allBooks.filter((b) => b.status === "borrowed"),
        [allBooks],
    );

    const overdueBooks = useMemo(
        () => borrowedBooks.filter((b) => isBookOverdue(b.dueDate)),
        [borrowedBooks],
    );

    const availableBooks = useMemo(
        () =>
            allBooks.filter(
                (b) => b.status !== "borrowed" && b.status !== "wishlist",
            ),
        [allBooks],
    );

    const displayedBooks = useMemo(() => {
        const source =
            activeTab === "borrowed"
                ? borrowedBooks
                : activeTab === "overdue"
                  ? overdueBooks
                  : availableBooks;

        if (!searchQuery.trim()) return source;
        const q = searchQuery.toLowerCase();
        return source.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                (b.borrowedBy || "").toLowerCase().includes(q),
        );
    }, [activeTab, borrowedBooks, overdueBooks, availableBooks, searchQuery]);

    const openBorrowModal = (preselectedId?: string) => {
        setSelectedLoanBookId(preselectedId || availableBooks[0]?.id || "");
        setBorrowedBy("");
        setDueDate(defaultTomorrowDate());
        setIsLoanModalOpen(true);
    };

    const handleBorrowSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLoanBookId || !borrowedBy.trim() || !dueDate) {
            toast.error(
                t(
                    "borrow.validation_required",
                    "Please choose a book, borrower name, and due date.",
                ),
            );
            return;
        }

        borrowBook.mutate(
            {
                id: selectedLoanBookId,
                borrowedBy: borrowedBy.trim(),
                dueDate,
            },
            {
                onSuccess: () => {
                    toast.success(
                        t(
                            "borrow.loan_created",
                            "Book marked as borrowed.",
                        ),
                    );
                    setIsLoanModalOpen(false);
                },
                onError: () => {
                    toast.error(
                        t(
                            "borrow.loan_failed",
                            "Unable to record loan. Ensure due date is after today.",
                        ),
                    );
                },
            },
        );
    };

    const handleReturnBook = (book: Book) => {
        returnBook.mutate(book.id, {
            onSuccess: () => {
                toast.success(
                    t("borrow.book_returned", {
                        defaultValue: `"${book.title}" marked as returned.`,
                    }),
                );
            },
            onError: () => {
                toast.error(
                    t("borrow.return_failed", "Failed to return book."),
                );
            },
        });
    };

    const handleOpenDetail = (bookId: string) => {
        setSelectedBookId(bookId);
        toggleBookDetail(bookId);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <SEO title={t("navigation.borrowloan", "Borrow & Loan")} />
                <p className="text-walnut">
                    {t("borrow.loading", "Loading loan tracker...")}
                </p>
            </div>
        );
    }

    return (
        <div
            className="px-3.5 sm:px-6 md:px-8 pb-16 pt-[88px] sm:pt-[96px] md:pt-[104px] flex flex-col min-h-full relative transition-colors duration-500"
            style={{
                background: "var(--app-wall-bg)",
            }}
        >
            <SEO
                title={t("navigation.borrowloan", "Borrow & Loan")}
                description={t(
                    "borrow.seo_description",
                    "Track books loaned to friends and manage return due dates.",
                )}
            />
            <div className="max-w-7xl mx-auto w-full relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-walnut/15 dark:bg-walnut/25 text-walnut dark:text-gold text-xs font-semibold tracking-wider uppercase mb-2">
                            <BookUp2 size={13} />
                            <span>
                                {t("borrow.badge", "Pelacak Peminjaman")}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-darkBrown dark:text-cream tracking-tight mb-1">
                            {t("borrow.title", "Borrow & Loan")}
                        </h1>
                        <p className="text-xs sm:text-sm text-walnut/80 dark:text-cream/70">
                            {t(
                                "borrow.subtitle",
                                "Keep track of books lent to friends and manage due dates.",
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => openBorrowModal()}
                        disabled={availableBooks.length === 0}
                        className="px-4 py-2.5 bg-walnut hover:bg-darkBrown text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
                    >
                        <Plus size={16} />
                        <span>{t("borrow.loan_book", "Loan a Book")}</span>
                    </button>
                </div>

                {/* Summary KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <BookUp2 size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                                {t("borrow.currently_loaned", "Currently Loaned")}
                            </p>
                            <p className="text-2xl font-serif font-bold text-ink">
                                {borrowedBooks.length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                                {t("borrow.overdue", "Overdue")}
                            </p>
                            <p className="text-2xl font-serif font-bold text-rose-700 dark:text-rose-400">
                                {overdueBooks.length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <BookCheck size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-walnut/75 dark:text-cream/65 font-medium">
                                {t(
                                    "borrow.available_to_loan",
                                    "Available in Library",
                                )}
                            </p>
                            <p className="text-2xl font-serif font-bold text-ink">
                                {availableBooks.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div className="inline-flex p-1 rounded-xl bg-surface/65 dark:bg-black/30 backdrop-blur-sm border border-walnut/15 dark:border-walnut/30 self-start">
                        {(
                            [
                                {
                                    key: "borrowed",
                                    label: `${t("borrow.tab_borrowed", "Dipinjam")} (${borrowedBooks.length})`,
                                },
                                {
                                    key: "overdue",
                                    label: `${t("borrow.tab_overdue", "Terlambat")} (${overdueBooks.length})`,
                                },
                                {
                                    key: "available",
                                    label: `${t("borrow.tab_available", "Tersedia")} (${availableBooks.length})`,
                                },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === tab.key
                                        ? "bg-walnut text-white shadow-xs"
                                        : "text-ink/75 hover:text-ink"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/50"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t(
                                "borrow.search_placeholder",
                                "Search title, author, or borrower...",
                            )}
                            className="w-full pl-9 pr-3 py-2 bg-surface/95 border border-walnut/20 dark:border-walnut/35 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-walnut/30"
                        />
                    </div>
                </div>

                {/* Books List */}
                {displayedBooks.length === 0 ? (
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-12 text-center backdrop-blur-sm">
                        <BookUp2
                            size={36}
                            className="mx-auto mb-3 text-walnut/40 dark:text-gold/60"
                        />
                        <h3 className="font-serif text-lg font-semibold text-ink mb-1">
                            {t(
                                "borrow.empty_title",
                                "No matching books in this view",
                            )}
                        </h3>
                        <p className="text-sm text-walnut/75 dark:text-cream/65">
                            {activeTab === "borrowed"
                                ? t(
                                      "borrow.empty_borrowed",
                                      "All of your books are currently on your shelves.",
                                  )
                                : t(
                                      "borrow.empty_generic",
                                      "Try clearing the search filter or switching tabs.",
                                  )}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayedBooks.map((book) => {
                            const overdue =
                                book.status === "borrowed" &&
                                isBookOverdue(book.dueDate);
                            return (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-4 backdrop-blur-sm"
                                >
                                    <div className="flex gap-3.5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenDetail(book.id)
                                            }
                                            className="w-12 h-16 rounded-lg shrink-0 shadow-inner border border-black/10 overflow-hidden cursor-pointer"
                                            style={{
                                                background: `linear-gradient(135deg, ${book.spineColors?.[0] || "#8B7355"}, ${book.spineColors?.[2] || "#5C4532"})`,
                                            }}
                                            title={book.title}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenDetail(book.id)
                                                }
                                                className="text-left font-serif font-bold text-darkBrown dark:text-cream hover:underline line-clamp-1 cursor-pointer"
                                            >
                                                {book.title}
                                            </button>
                                            <p className="text-xs text-walnut/70 dark:text-cream/60 line-clamp-1 mb-2">
                                                {book.author}
                                            </p>

                                            {book.status === "borrowed" ? (
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center gap-1.5 text-darkBrown dark:text-cream/90">
                                                        <User size={12} />
                                                        <span className="font-medium truncate">
                                                            {book.borrowedBy ||
                                                                "—"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        <span
                                                            className={
                                                                overdue
                                                                    ? "text-rose-600 font-semibold"
                                                                    : "text-walnut/75 dark:text-cream/70"
                                                            }
                                                        >
                                                            {book.dueDate
                                                                ? new Date(
                                                                      book.dueDate,
                                                                  ).toLocaleDateString()
                                                                : "—"}
                                                        </span>
                                                        {overdue && (
                                                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                                                                {t(
                                                                    "borrow.overdue_badge",
                                                                    "Overdue",
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-walnut/10 text-walnut font-medium">
                                                    <Clock size={11} />
                                                    <span>
                                                        {t(
                                                            `status.${book.status}`,
                                                            book.status,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-walnut/10">
                                        {book.status === "borrowed" ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleReturnBook(book)
                                                }
                                                disabled={returnBook.isPending}
                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                <RotateCcw size={13} />
                                                <span>
                                                    {t(
                                                        "borrow.mark_returned",
                                                        "Mark Returned",
                                                    )}
                                                </span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openBorrowModal(book.id)
                                                }
                                                className="px-3 py-1.5 rounded-xl bg-walnut hover:bg-darkBrown text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                                            >
                                                <BookUp2 size={13} />
                                                <span>
                                                    {t(
                                                        "borrow.lend_this",
                                                        "Lend Book",
                                                    )}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Loan Book Modal */}
            {isLoanModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1712] rounded-2xl shadow-2xl w-full max-w-md border border-walnut/15 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
                            <h2 className="font-serif font-bold text-lg text-darkBrown dark:text-cream">
                                {t("borrow.modal_title", "Loan a Book")}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsLoanModalOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleBorrowSubmit}
                            className="p-5 space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold text-walnut mb-1">
                                    {t("borrow.select_book", "Select Book")}
                                </label>
                                <select
                                    value={selectedLoanBookId}
                                    onChange={(e) =>
                                        setSelectedLoanBookId(e.target.value)
                                    }
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
                                    {t(
                                        "borrow.borrower_name",
                                        "Borrower Name",
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={borrowedBy}
                                    onChange={(e) =>
                                        setBorrowedBy(e.target.value)
                                    }
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
                                    min={new Date(Date.now() + 86400000)
                                        .toISOString()
                                        .split("T")[0]}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsLoanModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-walnut/20 text-sm font-medium text-walnut hover:bg-walnut/5"
                                >
                                    {t("common.cancel", "Cancel")}
                                </button>
                                <button
                                    type="submit"
                                    disabled={borrowBook.isPending}
                                    className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold disabled:opacity-50"
                                >
                                    {borrowBook.isPending
                                        ? t("common.saving", "Saving...")
                                        : t("borrow.confirm_loan", "Confirm Loan")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
