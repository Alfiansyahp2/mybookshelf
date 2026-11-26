import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    StickyNote,
    Search,
    Edit3,
    Star,
    BookOpen,
    X,
    Save,
} from "lucide-react";
import { useBooks, useUpdateNotes } from "../hooks/useBooks";
import { useBookstore } from "../store/useBookstore";
import type { Book } from "../types";
import SEO from "../components/SEO";

type NotesFilter = "with_notes" | "all" | "without_notes";

export default function Notes() {
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

    const handleSaveNotes = (e: React.FormEvent) => {
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
                    toast.error(
                        t("notes.save_failed", "Failed to save note."),
                    );
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

                {/* Filter + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div className="inline-flex p-1 rounded-xl bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-walnut/15 self-start">
                        {(
                            [
                                {
                                    key: "with_notes",
                                    label: `${t("notes.tab_noted", "Ada Catatan")} (${booksWithNotes.length})`,
                                },
                                {
                                    key: "without_notes",
                                    label: `${t("notes.tab_unnoted", "Belum Ada")} (${booksWithoutNotes.length})`,
                                },
                                {
                                    key: "all",
                                    label: `${t("notes.tab_all", "Semua")} (${allBooks.length})`,
                                },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setFilter(tab.key)}
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t(
                                "notes.search_placeholder",
                                "Search notes or book titles...",
                            )}
                            className="w-full pl-9 pr-3 py-2 bg-surface/95 border border-walnut/20 dark:border-walnut/35 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-walnut/30"
                        />
                    </div>
                </div>

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
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-surface/95 border border-walnut/15 dark:border-walnut/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 backdrop-blur-sm"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="min-w-0">
                                            <h2 className="font-serif font-bold text-lg text-ink truncate">
                                                {book.title}
                                            </h2>
                                            <p className="text-xs text-walnut/75 dark:text-cream/65">
                                                {book.author}
                                            </p>
                                        </div>
                                        {book.personalRating ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold shrink-0">
                                                <Star
                                                    size={11}
                                                    className="fill-amber-500 text-amber-500"
                                                />
                                                {book.personalRating}
                                            </span>
                                        ) : null}
                                    </div>

                                    {book.personalNotes ? (
                                        <p className="text-sm text-ink/85 whitespace-pre-line bg-surfaceAlt/85 p-3.5 rounded-xl border border-walnut/15 dark:border-walnut/25 line-clamp-5">
                                            {book.personalNotes}
                                        </p>
                                    ) : (
                                        <p className="text-xs italic text-walnut/60 dark:text-cream/50 py-3">
                                            {t(
                                                "notes.no_note_yet",
                                                "No personal notes recorded yet.",
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-walnut/10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedBookId(book.id);
                                            toggleBookDetail(book.id);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-walnut/10 hover:bg-walnut/20 text-darkBrown dark:text-cream text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <BookOpen size={13} />
                                        <span>
                                            {t("notes.open_book", "Book Detail")}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openEditor(book)}
                                        className="px-3 py-1.5 rounded-xl bg-walnut hover:bg-darkBrown text-white text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <Edit3 size={13} />
                                        <span>
                                            {book.personalNotes
                                                ? t("notes.edit", "Edit Note")
                                                : t("notes.add", "Add Note")}
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {editingBook && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1712] rounded-2xl shadow-2xl w-full max-w-lg border border-walnut/15 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
                            <div className="min-w-0">
                                <h2 className="font-serif font-bold text-lg text-darkBrown dark:text-cream truncate">
                                    {editingBook.title}
                                </h2>
                                <p className="text-xs text-walnut/70">
                                    {t(
                                        "notes.editor_subtitle",
                                        "Personal reading notes",
                                    )}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingBook(null)}
                                className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveNotes}
                            className="p-5 space-y-4"
                        >
                            <textarea
                                rows={7}
                                value={draftNotes}
                                onChange={(e) => setDraftNotes(e.target.value)}
                                placeholder={t(
                                    "notes.placeholder",
                                    "Write quotes, summaries, or thoughts about this book...",
                                )}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream focus:outline-none focus:ring-2 focus:ring-walnut/30"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingBook(null)}
                                    className="px-4 py-2 rounded-xl border border-walnut/20 text-sm font-medium text-walnut hover:bg-walnut/5"
                                >
                                    {t("common.cancel", "Cancel")}
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateNotes.isPending}
                                    className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    <span>{t("common.save", "Save")}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
