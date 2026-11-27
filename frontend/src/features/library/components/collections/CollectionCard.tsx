import { motion } from "framer-motion";
import { BookOpen, Edit3, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Collection } from "@shared/types";

interface CollectionCardProps {
    collection: Collection;
    onEdit: (col: Collection) => void;
    onDelete: (col: Collection) => void;
    onManageBooks: (col: Collection) => void;
}

export default function CollectionCard({
    collection,
    onEdit,
    onDelete,
    onManageBooks,
}: CollectionCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 backdrop-blur-sm"
        >
            <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs"
                            style={{
                                backgroundColor: `${collection.color || "#7A5C42"}20`,
                                border: `1px solid ${collection.color || "#7A5C42"}40`,
                            }}
                        >
                            {collection.icon || "📚"}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-serif font-bold text-lg text-ink truncate">
                                {collection.name}
                            </h2>
                            <p className="text-xs text-walnut/75 dark:text-cream/65">
                                {collection.bookIds.length}{" "}
                                {t("collections.books_count", "books")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => onEdit(collection)}
                            className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut/70 hover:text-walnut"
                            title={t("common.edit", "Edit")}
                        >
                            <Edit3 size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(collection)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700"
                            title={t("common.delete", "Delete")}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {collection.description && (
                    <p className="text-xs text-walnut/80 dark:text-cream/70 line-clamp-2 mb-3">
                        {collection.description}
                    </p>
                )}

                <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-walnut/80">
                        <span>{t("collections.completion", "Completion")}</span>
                        <span>{Math.round(collection.progress)}%</span>
                    </div>
                    <div className="h-2 bg-walnut/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${Math.min(100, collection.progress)}%`,
                                backgroundColor: collection.color || "#7A5C42",
                            }}
                        />
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => onManageBooks(collection)}
                className="w-full py-2 rounded-xl bg-walnut/10 hover:bg-walnut/20 text-darkBrown dark:text-cream text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
                <BookOpen size={14} />
                <span>{t("collections.manage_books", "Manage Books")}</span>
            </button>
        </motion.div>
    );
}
