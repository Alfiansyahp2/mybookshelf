import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FolderKanban,
    Plus,
    Trash2,
    Edit3,
    BookPlus,
    X,
    BookOpen,
} from "lucide-react";
import {
    useCollections,
    useCreateCollection,
    useUpdateCollection,
    useDeleteCollection,
    useAddBookToCollection,
    useRemoveBookFromCollection,
} from "../hooks/useCollections";
import { useBooks } from "../hooks/useBooks";
import { useBookstore } from "../store/useBookstore";
import type { Collection } from "../types";
import SEO from "../components/SEO";

const PRESET_COLORS = [
    "#7A5C42",
    "#8B5E3C",
    "#A67B5B",
    "#5C4532",
    "#2F5233",
    "#7C2D12",
    "#1E3A5F",
];

const PRESET_ICONS = ["📚", "✨", "🌿", "🕰️", "🔖", "☕", "🏛️"];

export default function Collections() {
    const { t } = useTranslation();
    const { data: collections = [], isLoading } = useCollections();
    const { data: booksResponse } = useBooks({});
    const createCollection = useCreateCollection();
    const updateCollection = useUpdateCollection();
    const deleteCollection = useDeleteCollection();
    const addBookToCollection = useAddBookToCollection();
    const removeBookFromCollection = useRemoveBookFromCollection();
    const { setSelectedBookId, toggleBookDetail } = useBookstore();

    const allBooks = useMemo(
        () => booksResponse?.data?.data || [],
        [booksResponse],
    );

    const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
        null,
    );
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] =
        useState<Collection | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [icon, setIcon] = useState(PRESET_ICONS[0]);
    const [bookToAddId, setBookToAddId] = useState("");

    const activeCollection = useMemo(
        () => collections.find((c) => c.id === activeCollectionId) || null,
        [collections, activeCollectionId],
    );

    const booksInActiveCollection = useMemo(() => {
        if (!activeCollection) return [];
        if (activeCollection.books && activeCollection.books.length > 0) {
            return activeCollection.books;
        }
        return allBooks.filter((b) =>
            activeCollection.bookIds.includes(b.id),
        );
    }, [activeCollection, allBooks]);

    const candidateBooksForActive = useMemo(() => {
        if (!activeCollection) return [];
        const existingIds = new Set(
            booksInActiveCollection.map((b) => b.id),
        );
        return allBooks.filter((b) => !existingIds.has(b.id));
    }, [activeCollection, booksInActiveCollection, allBooks]);

    const openCreateModal = () => {
        setEditingCollection(null);
        setName("");
        setDescription("");
        setColor(PRESET_COLORS[0]);
        setIcon(PRESET_ICONS[0]);
        setIsFormModalOpen(true);
    };

    const openEditModal = (col: Collection) => {
        setEditingCollection(col);
        setName(col.name);
        setDescription(col.description || "");
        setColor(col.color || PRESET_COLORS[0]);
        setIcon(col.icon || PRESET_ICONS[0]);
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (editingCollection) {
            updateCollection.mutate(
                {
                    id: editingCollection.id,
                    updates: { name: name.trim(), description, color, icon },
                },
                {
                    onSuccess: () => {
                        toast.success(
                            t(
                                "collections.updated",
                                "Collection updated successfully.",
                            ),
                        );
                        setIsFormModalOpen(false);
                    },
                },
            );
        } else {
            createCollection.mutate(
                { name: name.trim(), description, color, icon },
                {
                    onSuccess: () => {
                        toast.success(
                            t(
                                "collections.created",
                                "Collection created successfully.",
                            ),
                        );
                        setIsFormModalOpen(false);
                    },
                },
            );
        }
    };

    const handleDelete = (col: Collection) => {
        deleteCollection.mutate(col.id, {
            onSuccess: () => {
                if (activeCollectionId === col.id) {
                    setActiveCollectionId(null);
                }
                toast.success(
                    t("collections.deleted", "Collection deleted."),
                );
            },
        });
    };

    const handleAttachBook = () => {
        if (!activeCollection || !bookToAddId) return;
        addBookToCollection.mutate(
            { collectionId: activeCollection.id, bookId: bookToAddId },
            {
                onSuccess: () => {
                    toast.success(
                        t("collections.book_added", "Book added to collection."),
                    );
                    setBookToAddId("");
                },
            },
        );
    };

    const handleDetachBook = (bookId: string) => {
        if (!activeCollection) return;
        removeBookFromCollection.mutate(
            { collectionId: activeCollection.id, bookId },
            {
                onSuccess: () => {
                    toast.success(
                        t(
                            "collections.book_removed",
                            "Book removed from collection.",
                        ),
                    );
                },
            },
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <SEO title={t("navigation.collections", "Collections")} />
                <p className="text-walnut">
                    {t("collections.loading", "Loading collections...")}
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
                title={t("navigation.collections", "Collections")}
                description={t(
                    "collections.seo_description",
                    "Curate custom reading lists and track thematic book collections.",
                )}
            />
            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-walnut/15 dark:bg-walnut/25 text-walnut dark:text-gold text-xs font-semibold tracking-wider uppercase mb-2">
                            <FolderKanban size={13} />
                            <span>
                                {t("collections.badge", "Daftar Kurasi")}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-darkBrown dark:text-cream tracking-tight mb-1">
                            {t("collections.title", "Collections")}
                        </h1>
                        <p className="text-xs sm:text-sm text-walnut/80 dark:text-cream/70">
                            {t(
                                "collections.subtitle",
                                "Group books by theme, series, or reading goals.",
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="px-4 py-2.5 bg-walnut hover:bg-darkBrown text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
                    >
                        <Plus size={16} />
                        <span>
                            {t("collections.new_button", "New Collection")}
                        </span>
                    </button>
                </div>

                {collections.length === 0 ? (
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-12 text-center backdrop-blur-sm">
                        <FolderKanban
                            size={36}
                            className="mx-auto mb-3 text-walnut/40 dark:text-gold/60"
                        />
                        <h3 className="font-serif text-lg font-semibold text-ink mb-1">
                            {t("collections.empty_title", "No collections yet")}
                        </h3>
                        <p className="text-sm text-walnut/75 dark:text-cream/65 mb-5">
                            {t(
                                "collections.empty_desc",
                                "Create your first thematic collection to organize related books.",
                            )}
                        </p>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-walnut hover:bg-darkBrown text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"
                        >
                            <Plus size={15} />
                            <span>
                                {t(
                                    "collections.create_first",
                                    "Create Collection",
                                )}
                            </span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collections.map((col) => (
                            <motion.div
                                key={col.id}
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
                                                    backgroundColor: `${col.color || "#7A5C42"}20`,
                                                    border: `1px solid ${col.color || "#7A5C42"}40`,
                                                }}
                                            >
                                                {col.icon || "📚"}
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="font-serif font-bold text-lg text-ink truncate">
                                                    {col.name}
                                                </h2>
                                                <p className="text-xs text-walnut/75 dark:text-cream/65">
                                                    {col.bookIds.length}{" "}
                                                    {t(
                                                        "collections.books_count",
                                                        "books",
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(col)}
                                                className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut/70 hover:text-walnut"
                                                title={t(
                                                    "common.edit",
                                                    "Edit",
                                                )}
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(col)}
                                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700"
                                                title={t(
                                                    "common.delete",
                                                    "Delete",
                                                )}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {col.description && (
                                        <p className="text-xs text-walnut/80 dark:text-cream/70 line-clamp-2 mb-3">
                                            {col.description}
                                        </p>
                                    )}

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-semibold text-walnut/80">
                                            <span>
                                                {t(
                                                    "collections.completion",
                                                    "Completion",
                                                )}
                                            </span>
                                            <span>
                                                {Math.round(col.progress)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-walnut/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(100, col.progress)}%`,
                                                    backgroundColor:
                                                        col.color || "#7A5C42",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveCollectionId(col.id);
                                        setBookToAddId("");
                                    }}
                                    className="w-full py-2 rounded-xl bg-walnut/10 hover:bg-walnut/20 text-darkBrown dark:text-cream text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <BookOpen size={14} />
                                    <span>
                                        {t(
                                            "collections.manage_books",
                                            "Manage Books",
                                        )}
                                    </span>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Collection Modal */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1712] rounded-2xl shadow-2xl w-full max-w-md border border-walnut/15 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
                            <h2 className="font-serif font-bold text-lg text-darkBrown dark:text-cream">
                                {editingCollection
                                    ? t(
                                          "collections.edit_title",
                                          "Edit Collection",
                                      )
                                    : t(
                                          "collections.create_title",
                                          "New Collection",
                                      )}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsFormModalOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleFormSubmit}
                            className="p-5 space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold text-walnut mb-1">
                                    {t("collections.name_label", "Name")}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t(
                                        "collections.name_placeholder",
                                        "e.g. Classic Sci-Fi",
                                    )}
                                    className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-walnut mb-1">
                                    {t(
                                        "collections.description_label",
                                        "Description",
                                    )}
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-walnut mb-1.5">
                                        {t("collections.icon_label", "Icon")}
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {PRESET_ICONS.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setIcon(emoji)}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base border ${
                                                    icon === emoji
                                                        ? "border-walnut bg-walnut/15"
                                                        : "border-walnut/15"
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-walnut mb-1.5">
                                        {t("collections.color_label", "Color")}
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {PRESET_COLORS.map((swatch) => (
                                            <button
                                                key={swatch}
                                                type="button"
                                                onClick={() => setColor(swatch)}
                                                className={`w-7 h-7 rounded-full border-2 ${
                                                    color === swatch
                                                        ? "border-darkBrown scale-110"
                                                        : "border-transparent"
                                                }`}
                                                style={{
                                                    backgroundColor: swatch,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-walnut/20 text-sm font-medium text-walnut hover:bg-walnut/5"
                                >
                                    {t("common.cancel", "Cancel")}
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        createCollection.isPending ||
                                        updateCollection.isPending
                                    }
                                    className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold disabled:opacity-50"
                                >
                                    {t("common.save", "Save")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Books inside Collection Modal */}
            {activeCollection && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1712] rounded-2xl shadow-2xl w-full max-w-lg border border-walnut/15 overflow-hidden max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">
                                    {activeCollection.icon || "📚"}
                                </span>
                                <h2 className="font-serif font-bold text-lg text-darkBrown dark:text-cream">
                                    {activeCollection.name}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveCollectionId(null)}
                                className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto space-y-4">
                            {/* Add book selector */}
                            {candidateBooksForActive.length > 0 && (
                                <div className="flex gap-2">
                                    <select
                                        value={bookToAddId}
                                        onChange={(e) =>
                                            setBookToAddId(e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                                    >
                                        <option value="">
                                            {t(
                                                "collections.pick_book",
                                                "Add a book to collection...",
                                            )}
                                        </option>
                                        {candidateBooksForActive.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.title} — {b.author}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        disabled={
                                            !bookToAddId ||
                                            addBookToCollection.isPending
                                        }
                                        onClick={handleAttachBook}
                                        className="px-3.5 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        <BookPlus size={14} />
                                        <span>{t("common.add", "Add")}</span>
                                    </button>
                                </div>
                            )}

                            {/* Book List */}
                            {booksInActiveCollection.length === 0 ? (
                                <p className="text-sm text-walnut/70 text-center py-6">
                                    {t(
                                        "collections.no_books_in_col",
                                        "No books in this collection yet.",
                                    )}
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {booksInActiveCollection.map((book) => (
                                        <div
                                            key={book.id}
                                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-walnut/10 bg-cream/40 dark:bg-black/20"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedBookId(book.id);
                                                    toggleBookDetail(book.id);
                                                }}
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
                                                onClick={() =>
                                                    handleDetachBook(book.id)
                                                }
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
            )}
        </div>
    );
}
