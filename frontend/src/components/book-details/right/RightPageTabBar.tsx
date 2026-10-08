import type { Book } from "../../../types";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, X } from "lucide-react";

export interface TabItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface RightPageTabBarProps {
    tabs: TabItem[];
    activeTab: string;
    handleTabChange: (id: string) => void;
    c1: string;
    book: Book;
    onEdit?: (book: Book) => void;
    onDelete?: (id: string) => void;
    onClose: () => void;
}

export default function RightPageTabBar({
    tabs,
    activeTab,
    handleTabChange,
    c1,
    book,
    onEdit,
    onDelete,
    onClose,
}: RightPageTabBarProps) {
    const { t } = useTranslation();

    return (
        <div
            className="flex-shrink-0 flex items-center justify-between gap-1 px-3 sm:px-4 pt-2 sm:pt-3 pb-0 border-b overflow-hidden select-none"
            style={{ borderColor: `${c1}22` }}
        >
            {/* Horizontal scrollable tab buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto hide-scrollbar scrollbar-none flex-1 pb-0.5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 shrink-0 whitespace-nowrap cursor-pointer"
                        style={
                            activeTab === tab.id
                                ? {
                                      color: "#2a1a08",
                                      borderBottomColor: c1,
                                      background: "rgba(255,255,255,0.85)",
                                      boxShadow: "0 -2px 6px rgba(0,0,0,0.06)",
                                  }
                                : {
                                      color: "#9c6d3a",
                                      borderBottomColor: "transparent",
                                      background: "transparent",
                                  }
                        }
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Action icons (Desktop only; mobile has them in the top header bar) */}
            <div className="hidden md:flex items-center gap-0.5 pb-1 shrink-0 ml-2">
                {onEdit && (
                    <button
                        onClick={() => onEdit(book)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-blue-50 cursor-pointer"
                        title={t("bookDetail.actions.edit", "Edit")}
                        style={{ color: "#3b82f6" }}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => {
                            if (
                                window.confirm(
                                    t(
                                        "bookDetail.confirm_delete",
                                        'Hapus "{{title}}"?',
                                        { title: book.title }
                                    )
                                )
                            ) {
                                onDelete(book.id);
                                onClose();
                            }
                        }}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50 cursor-pointer"
                        title={t("bookDetail.actions.delete", "Hapus")}
                        style={{ color: "#ef4444" }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 cursor-pointer"
                    title={t("bookDetail.actions.close", "Tutup")}
                    style={{ color: "#9ca3af" }}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
