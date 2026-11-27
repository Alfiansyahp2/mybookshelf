import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { StickyNote } from "lucide-react";
import SEO from "@shared/components/ui/SEO";
import type { Book } from "@shared/types";
import { useBooks, useUpdateNotes } from "../hooks/useBooks";
import { useBookstore } from "../store/useBookstore";
import NotesFilterBar, {
    type NotesFilter,
} from "../components/notes/NotesFilterBar";
import NoteBookCard from "../components/notes/NoteBookCard";
import NoteEditorModal from "../components/notes/NoteEditorModal";

export default function NotesPage() {
    const { t } = useTranslation();
    const { data: booksResponse, isLoading } = useBooks({});
    const updateNotes = useUpdateNotes();
    const { setSelectedBookId, toggleBookDetail } = useBookstore();

    const [filter, setFilter] = useState<NotesFilter>("with_notes");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [draftNotes, setDraftNotes] = useState("");

    const allBooks = useMemo(
        () => booksResponse?.data?.data || [],
        [booksResponse],
    );

    const booksWithNotes = useMemo(
        () =>
            allBooks.filter(
                (b) => b.personalNotes && b.personalNotes.trim().length > 0,
            ),
        [allBooks],
    );

    const booksWithoutNotes = useMemo(
        () =>
            allBooks.filter(
                (b) => !b.personalNotes || b.personalNotes.trim().length === 0,
            ),
        [allBooks],
    );

    const displayedBooks = useMemo(() => {
        const list =
            filter === "with_notes"
                ? booksWithNotes
                : filter === "without_notes"
                  ? booksWithoutNotes
                  : allBooks;

        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                (b.personalNotes || "").toLowerCase().includes(q),
        );
    }, [filter, booksWithNotes, booksWithoutNotes, allBooks, searchQuery]);

    const openEditor = (book: Book) => {
        setEditingBook(book);
        setDraftNotes(book.personalNotes || "");
    };

    const handleSaveNotes = (e: FormEvent) => {
        e.preventDefault();
        if (!editingBook) return;
        if (!draftNotes.trim()) {
            toast.error(
                t("notes.empty_validation", "Please enter note content."),
            );
            return;
        }

        updateNotes.mutate(
            { id: editingBook.id, notes: draftNotes.trim() },
            {
                onSuccess: () => {
                    toast.success(t("notes.saved", "Reading note saved."));
                    setEditingBook(null);
                },
                onError: () => {
                    toast.error(t("notes.save_failed", "Failed to save note."));
                },
            },
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <SEO title={t("navigation.notes", "Notes")} />
                <p className="text-walnut">
                    {t("notes.loading", "Loading reading notes...")}
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
                title={t("navigation.notes", "Notes")}
                description={t(
                    "notes.seo_description",
                    "Review and edit personal reading notes and reflections across your library.",
                )}
            />
            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-walnut/15 dark:bg-walnut/25 text-walnut dark:text-gold text-xs font-semibold tracking-wider uppercase mb-2">
                        <StickyNote size={13} />
                        <span>{t("notes.badge", "Catatan & Refleksi")}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-darkBrown dark:text-cream tracking-tight mb-1">
                        {t("notes.title", "Notes")}
                    </h1>
                    <p className="text-xs sm:text-sm text-walnut/80 dark:text-cream/70">
                        {t(
                            "notes.subtitle",
                            "{{noted}} of {{total}} books include personal reflections.",
                            {
                                noted: booksWithNotes.length,
                                total: allBooks.length,
                            },
                        )}
                    </p>
                </div>

                <NotesFilterBar
                    filter={filter}
                    searchQuery={searchQuery}
                    totalCount={allBooks.length}
                    withNotesCount={booksWithNotes.length}
                    withoutNotesCount={booksWithoutNotes.length}
                    onFilterChange={setFilter}
                    onSearchChange={setSearchQuery}
                />

                {displayedBooks.length === 0 ? (
                    <div className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-12 text-center backdrop-blur-sm">
                        <StickyNote
                            size={36}
                            className="mx-auto mb-3 text-walnut/40 dark:text-gold/60"
                        />
                        <h3 className="font-serif text-lg font-semibold text-ink mb-1">
                            {t("notes.empty_title", "No notes found")}
                        </h3>
                        <p className="text-sm text-walnut/75 dark:text-cream/65">
                            {t(
                                "notes.empty_desc",
                                "Switch to another tab or click any book to add your thoughts.",
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayedBooks.map((book) => (
                            <NoteBookCard
                                key={book.id}
                                book={book}
                                onOpenDetail={(bookId) => {
                                    setSelectedBookId(bookId);
                                    toggleBookDetail(bookId);
                                }}
                                onEditNote={openEditor}
                            />
                        ))}
                    </div>
                )}
            </div>

            <NoteEditorModal
                editingBook={editingBook}
                draftNotes={draftNotes}
                isSaving={updateNotes.isPending}
                onClose={() => setEditingBook(null)}
                onDraftChange={setDraftNotes}
                onSubmit={handleSaveNotes}
            />
        </div>
    );
}
