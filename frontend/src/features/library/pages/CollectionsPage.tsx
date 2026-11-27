import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FolderKanban, Plus } from "lucide-react";
import SEO from "@shared/components/ui/SEO";
import type { Collection } from "@shared/types";
import {
    useAddBookToCollection,
    useCollections,
    useCreateCollection,
    useDeleteCollection,
    useRemoveBookFromCollection,
    useUpdateCollection,
} from "../hooks/useCollections";
import { useBooks } from "../hooks/useBooks";
import { useBookstore } from "../store/useBookstore";
import CollectionCard from "../components/collections/CollectionCard";
import CollectionFormModal from "../components/collections/CollectionFormModal";
import {
    COLLECTION_PRESET_COLORS,
    COLLECTION_PRESET_ICONS,
} from "../components/collections/presets";
import CollectionBooksModal from "../components/collections/CollectionBooksModal";

export default function CollectionsPage() {
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
    const [color, setColor] = useState(COLLECTION_PRESET_COLORS[0]);
    const [icon, setIcon] = useState(COLLECTION_PRESET_ICONS[0]);
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
        const existingIds = new Set(booksInActiveCollection.map((b) => b.id));
        return allBooks.filter((b) => !existingIds.has(b.id));
    }, [activeCollection, booksInActiveCollection, allBooks]);

    const openCreateModal = () => {
        setEditingCollection(null);
        setName("");
        setDescription("");
        setColor(COLLECTION_PRESET_COLORS[0]);
        setIcon(COLLECTION_PRESET_ICONS[0]);
        setIsFormModalOpen(true);
    };

    const openEditModal = (col: Collection) => {
        setEditingCollection(col);
        setName(col.name);
        setDescription(col.description || "");
        setColor(col.color || COLLECTION_PRESET_COLORS[0]);
        setIcon(col.icon || COLLECTION_PRESET_ICONS[0]);
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = (e: FormEvent) => {
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
                toast.success(t("collections.deleted", "Collection deleted."));
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
                            <CollectionCard
                                key={col.id}
                                collection={col}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                onManageBooks={(selected) => {
                                    setActiveCollectionId(selected.id);
                                    setBookToAddId("");
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CollectionFormModal
                isOpen={isFormModalOpen}
                isEditing={!!editingCollection}
                name={name}
                description={description}
                icon={icon}
                color={color}
                isSubmitting={
                    createCollection.isPending || updateCollection.isPending
                }
                onClose={() => setIsFormModalOpen(false)}
                onNameChange={setName}
                onDescriptionChange={setDescription}
                onIconChange={setIcon}
                onColorChange={setColor}
                onSubmit={handleFormSubmit}
            />

            <CollectionBooksModal
                collection={activeCollection}
                booksInCollection={booksInActiveCollection}
                candidateBooks={candidateBooksForActive}
                bookToAddId={bookToAddId}
                isAdding={addBookToCollection.isPending}
                onClose={() => setActiveCollectionId(null)}
                onBookToAddChange={setBookToAddId}
                onAttachBook={handleAttachBook}
                onDetachBook={handleDetachBook}
                onOpenBookDetail={(bookId) => {
                    setSelectedBookId(bookId);
                    toggleBookDetail(bookId);
                }}
            />
        </div>
    );
}
