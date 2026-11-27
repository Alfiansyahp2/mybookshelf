import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { BookUp2, Plus, Search } from "lucide-react";
import SEO from "@shared/components/ui/SEO";
import type { BooksFilterKey } from "@shared/api/queryKeys";
import type { Book } from "@shared/types";
import { useDashboardSummary } from "@features/analytics";
import { useBooks, useBorrowBook, useReturnBook } from "../hooks/useBooks";
import { useBookstore } from "../store/useBookstore";
import BorrowStatsGrid from "../components/borrow-loan/BorrowStatsGrid";
import LoanBookCard from "../components/borrow-loan/LoanBookCard";
import BorrowLoanModal from "../components/borrow-loan/BorrowLoanModal";

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

export default function BorrowLoanPage() {
    const { t } = useTranslation();
    const borrowBook = useBorrowBook();
    const returnBook = useReturnBook();
    const { setSelectedBookId, toggleBookDetail } = useBookstore();

    const [activeTab, setActiveTab] = useState<FilterTab>("borrowed");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [selectedLoanBookId, setSelectedLoanBookId] = useState("");
    const [borrowedBy, setBorrowedBy] = useState("");
    const [dueDate, setDueDate] = useState(defaultTomorrowDate);

    useEffect(() => {
        const trimmed = searchQuery.trim();
        const timer = setTimeout(() => {
            setDebouncedSearch(trimmed);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: summary } = useDashboardSummary();

    const listFilters = useMemo<BooksFilterKey>(() => {
        const searchPart = debouncedSearch ? { search: debouncedSearch } : {};
        if (activeTab === "borrowed") {
            return { status: "borrowed", ...searchPart, per_page: 500 };
        }
        if (activeTab === "overdue") {
            return { overdue: true, ...searchPart, per_page: 500 };
        }
        return {
            exclude_statuses: ["borrowed", "wishlist"],
            ...searchPart,
            per_page: 500,
        };
    }, [activeTab, debouncedSearch]);

    const { data: booksResponse, isLoading } = useBooks(listFilters);
    const { data: modalBooksResponse } = useBooks(
        { exclude_statuses: ["borrowed", "wishlist"], per_page: 500 },
        { enabled: isLoanModalOpen },
    );

    const displayedBooks = useMemo(
        () => booksResponse?.data?.data || [],
        [booksResponse],
    );

    const modalAvailableBooks = useMemo(
        () => modalBooksResponse?.data?.data || [],
        [modalBooksResponse],
    );

    const overview = summary?.overview;
    const borrowedCount = overview?.borrowed ?? 0;
    const overdueCount = overview?.overdue_count ?? 0;
    const availableCount =
        overview?.available_to_loan_count ?? modalAvailableBooks.length;

    const openBorrowModal = (preselectedId?: string) => {
        setSelectedLoanBookId(
            preselectedId || modalAvailableBooks[0]?.id || "",
        );
        setBorrowedBy("");
        setDueDate(defaultTomorrowDate());
        setIsLoanModalOpen(true);
    };

    const handleBorrowSubmit = (e: FormEvent) => {
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
                        t("borrow.loan_created", "Book marked as borrowed."),
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
                toast.error(t("borrow.return_failed", "Failed to return book."));
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
                        disabled={availableCount === 0}
                        className="px-4 py-2.5 bg-walnut hover:bg-darkBrown text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
                    >
                        <Plus size={16} />
                        <span>{t("borrow.loan_book", "Loan a Book")}</span>
                    </button>
                </div>

                <BorrowStatsGrid
                    borrowedCount={borrowedCount}
                    overdueCount={overdueCount}
                    availableCount={availableCount}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div className="inline-flex p-1 rounded-xl bg-surface/65 dark:bg-black/30 backdrop-blur-sm border border-walnut/15 dark:border-walnut/30 self-start">
                        {(
                            [
                                {
                                    key: "borrowed",
                                    label: `${t("borrow.tab_borrowed", "Dipinjam")} (${borrowedCount})`,
                                },
                                {
                                    key: "overdue",
                                    label: `${t("borrow.tab_overdue", "Terlambat")} (${overdueCount})`,
                                },
                                {
                                    key: "available",
                                    label: `${t("borrow.tab_available", "Tersedia")} (${availableCount})`,
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
                        {displayedBooks.map((book) => (
                            <LoanBookCard
                                key={book.id}
                                book={book}
                                isOverdue={
                                    book.status === "borrowed" &&
                                    isBookOverdue(book.dueDate)
                                }
                                isReturning={returnBook.isPending}
                                onOpenDetail={handleOpenDetail}
                                onReturnBook={handleReturnBook}
                                onLendBook={openBorrowModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BorrowLoanModal
                isOpen={isLoanModalOpen}
                availableBooks={modalAvailableBooks}
                selectedLoanBookId={selectedLoanBookId || modalAvailableBooks[0]?.id || ""}
                borrowedBy={borrowedBy}
                dueDate={dueDate}
                isSubmitting={borrowBook.isPending}
                onClose={() => setIsLoanModalOpen(false)}
                onSelectBook={setSelectedLoanBookId}
                onBorrowedByChange={setBorrowedBy}
                onDueDateChange={setDueDate}
                onSubmit={handleBorrowSubmit}
            />
        </div>
    );
}
