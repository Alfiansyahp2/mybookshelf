import { BookPlus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book, Collection } from "@shared/types";

interface CollectionBooksModalProps {
    collection: Collection | null;
    booksInCollection: Book[];
    candidateBooks: Book[];
    bookToAddId: string;
    isAdding: boolean;
    onClose: () => void;
    onBookToAddChange: (bookId: string) => void;
    onAttachBook: () => void;
    onDetachBook: (bookId: string) => void;
    onOpenBookDetail: (bookId: string) => void;
}

export default function CollectionBooksModal({
    collection,
    booksInCollection,
    candidateBooks,
    bookToAddId,
    isAdding,
    onClose,
    onBookToAddChange,
    onAttachBook,
    onDetachBook,
    onOpenBookDetail,
}: CollectionBooksModalProps) {
    const { t } = useTranslation();

    if (!collection) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e1712] rounded-2xl shadow-2xl w-full max-w-lg border border-walnut/15 overflow-hidden max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
                    <div className="flex items-center gap-2.5">
                        <span className="text-xl">
                            {collection.icon || "📚"}
                        </span>
                        <h2 className="font-serif font-bold text-lg text-darkBrown dark:text-cream">
                            {collection.name}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-4">
                    {candidateBooks.length > 0 && (
                        <div className="flex gap-2">
                            <select
                                value={bookToAddId}
                                onChange={(e) =>
                                    onBookToAddChange(e.target.value)
                                }
                                className="flex-1 px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                            >
                                <option value="">
                                    {t(
                                        "collections.pick_book",
                                        "Add a book to collection...",
                                    )}
                                </option>
                                {candidateBooks.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.title} — {b.author}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                disabled={!bookToAddId || isAdding}
                                onClick={onAttachBook}
                                className="px-3.5 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <BookPlus size={14} />
                                <span>{t("common.add", "Add")}</span>
                            </button>
                        </div>
                    )}

                    {booksInCollection.length === 0 ? (
                        <p className="text-sm text-walnut/70 text-center py-6">
                            {t(
                                "collections.no_books_in_col",
                                "No books in this collection yet.",
                            )}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {booksInCollection.map((book) => (
                                <div
                                    key={book.id}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-walnut/10 bg-cream/40 dark:bg-black/20"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onOpenBookDetail(book.id)
                                        }
                                        className="text-left min-w-0 flex-1 cursor-pointer"
                                    >
                                        <p className="text-sm font-semibold text-darkBrown dark:text-cream truncate hover:underline">
                                            {book.title}
                                        </p>
                                        <p className="text-xs text-walnut/70 truncate">
                                            {book.author}
                                        </p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDetachBook(book.id)}
                                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700"
                                        title={t(
                                            "collections.remove_book",
                                            "Remove book",
                                        )}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
