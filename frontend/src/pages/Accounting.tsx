import { useState } from "react";
import {
    DollarSign,
    Wallet,
    Plus,
    Filter,
    PieChart,
    BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Expense } from "../types/accounting";
import AccountingDashboard from "../components/accounting/AccountingDashboard";
import ExpenseList from "../components/accounting/ExpenseList";
import ExpenseModal from "../components/accounting/ExpenseModal";
import BudgetTracker from "../components/accounting/BudgetTracker";
import CategoryManager from "../components/accounting/CategoryManager";
import SEO from "../components/SEO";

export default function Accounting() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<
        "overview" | "expenses" | "budgets" | "categories"
    >("overview");
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const tabs = [
        {
            id: "overview",
            label: t("accounting.overview", "Overview"),
            icon: PieChart,
        },
        {
            id: "expenses",
            label: t("accounting.expenses", "Expenses"),
            icon: DollarSign,
        },
        {
            id: "budgets",
            label: t("accounting.budgets", "Budgets"),
            icon: Wallet,
        },
        {
            id: "categories",
            label: t("accounting.categories", "Categories"),
            icon: BarChart3,
        },
    ];

    return (
        <div
            className="pt-[88px] md:pt-[100px]"
            style={{
                paddingBottom: "40px",
                paddingLeft: "20px",
                paddingRight: "20px",
                maxWidth: 1200,
                margin: "0 auto",
            }}
        >
            <SEO title={t("navigation.accounting", "Accounting")} />
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 28,
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#7A5C42",
                            opacity: 0.6,
                            margin: "0 0 4px",
                        }}
                    >
                        {t("accounting.subtitle", "Keuangan & Pengeluaran")}
                    </p>
                    <h1
                        style={{
                            fontSize: 28,
                            fontFamily: "'Georgia',serif",
                            fontWeight: 700,
                            color: "#4A3B2F",
                            margin: 0,
                            lineHeight: 1.2,
                        }}
                    >
                        {t("accounting.title", "Accounting")}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 text-walnut hover:bg-beige rounded-lg"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            setExpenseToEdit(null);
                            setShowExpenseModal(true);
                        }}
                        className="p-2 bg-walnut text-cream rounded-lg hover:bg-darkBrown shadow-sm transition"
                        title={t("accounting.add_expense", "Add Expense")}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div
                style={{
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid rgba(139,99,56,0.1)",
                    boxShadow: "0 2px 12px -4px rgba(122,92,66,0.06)",
                    overflow: "hidden",
                    marginTop: 32,
                }}
            >
                <div
                    style={{
                        borderBottom: "1px solid rgba(139,99,56,0.1)",
                        background: "#F8F5F0",
                    }}
                >
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() =>
                                    setActiveTab(
                                        tab.id as
                                            | "overview"
                                            | "expenses"
                                            | "budgets"
                                            | "categories",
                                    )
                                }
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                                    activeTab === tab.id
                                        ? "border-gold text-darkBrown"
                                        : "border-transparent text-walnut/80 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "overview" && <AccountingDashboard period="all" />}
                    {activeTab === "expenses" && (
                        <ExpenseList 
                            onEditExpense={(expense) => {
                                setExpenseToEdit(expense);
                                setShowExpenseModal(true);
                            }}
                        />
                    )}
                    {activeTab === "budgets" && <BudgetTracker />}
                    {activeTab === "categories" && (
                        <CategoryManager
                            isOpen={activeTab === "categories"}
                            onClose={() => setActiveTab("overview")}
                        />
                    )}
                </div>
            </div>

            {/* Expense Modal */}
            {showExpenseModal && (
                <ExpenseModal 
                    isOpen={showExpenseModal}
                    mode={expenseToEdit ? "edit" : "create"}
                    expense={expenseToEdit}
                    onClose={() => {
                        setShowExpenseModal(false);
                        setExpenseToEdit(null);
                    }} 
                />
            )}
        </div>
    );
}
