import type { FormEvent } from "react";
import { Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "@shared/types";

interface NoteEditorModalProps {
    editingBook: Book | null;
    draftNotes: string;
    isSaving: boolean;
    onClose: () => void;
    onDraftChange: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
}

export default function NoteEditorModal({
    editingBook,
    draftNotes,
    isSaving,
    onClose,
    onDraftChange,
    onSubmit,
}: NoteEditorModalProps) {
    const { t } = useTranslation();

    if (!editingBook) return null;

    return (
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
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-5 space-y-4">
                    <textarea
                        rows={7}
                        value={draftNotes}
                        onChange={(e) => onDraftChange(e.target.value)}
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
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-walnut/20 text-sm font-medium text-walnut hover:bg-walnut/5"
                        >
                            {t("common.cancel", "Cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <Save size={14} />
                            <span>{t("common.save", "Save")}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
