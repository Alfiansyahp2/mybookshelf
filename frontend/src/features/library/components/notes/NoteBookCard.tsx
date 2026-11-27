import { motion } from "framer-motion";
import { BookOpen, Edit3, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "@shared/types";

interface NoteBookCardProps {
    book: Book;
    onOpenDetail: (bookId: string) => void;
    onEditNote: (book: Book) => void;
}

export default function NoteBookCard({
    book,
    onOpenDetail,
    onEditNote,
}: NoteBookCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
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
                    onClick={() => onOpenDetail(book.id)}
                    className="px-3 py-1.5 rounded-xl bg-walnut/10 hover:bg-walnut/20 text-darkBrown dark:text-cream text-xs font-semibold flex items-center gap-1.5"
                >
                    <BookOpen size={13} />
                    <span>{t("notes.open_book", "Book Detail")}</span>
                </button>
                <button
                    type="button"
                    onClick={() => onEditNote(book)}
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
    );
}
