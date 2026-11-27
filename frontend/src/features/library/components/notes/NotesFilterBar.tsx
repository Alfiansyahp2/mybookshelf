import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export type NotesFilter = "with_notes" | "all" | "without_notes";

interface NotesFilterBarProps {
    filter: NotesFilter;
    searchQuery: string;
    totalCount: number;
    withNotesCount: number;
    withoutNotesCount: number;
    onFilterChange: (filter: NotesFilter) => void;
    onSearchChange: (value: string) => void;
}

export default function NotesFilterBar({
    filter,
    searchQuery,
    totalCount,
    withNotesCount,
    withoutNotesCount,
    onFilterChange,
    onSearchChange,
}: NotesFilterBarProps) {
    const { t } = useTranslation();

    const tabs = [
        {
            key: "with_notes" as const,
            label: `${t("notes.tab_noted", "Ada Catatan")} (${withNotesCount})`,
        },
        {
            key: "without_notes" as const,
            label: `${t("notes.tab_unnoted", "Belum Ada")} (${withoutNotesCount})`,
        },
        {
            key: "all" as const,
            label: `${t("notes.tab_all", "Semua")} (${totalCount})`,
        },
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="inline-flex p-1 rounded-xl bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-walnut/15 self-start">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onFilterChange(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            filter === tab.key
                                ? "bg-walnut text-white shadow-xs"
                                : "text-darkBrown/75 dark:text-cream/75 hover:text-darkBrown"
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
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t(
                        "notes.search_placeholder",
                        "Search notes or book titles...",
                    )}
                    className="w-full pl-9 pr-3 py-2 bg-surface/95 border border-walnut/20 dark:border-walnut/35 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-walnut/30"
                />
            </div>
        </div>
    );
}
