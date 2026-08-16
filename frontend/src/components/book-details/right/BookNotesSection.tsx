import { MessageSquare, Edit3, Gift, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "../../../types";

interface BookNotesSectionProps {
    book: Book;
    userNotes: string;
    tempNotes: string;
    isEditingNotes: boolean;
    updateNotes: { isPending: boolean };
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onTempNotesChange: (notes: string) => void;
}

export default function BookNotesSection({
    book,
    userNotes,
    tempNotes,
    isEditingNotes,
    updateNotes,
    onEdit,
    onSave,
    onCancel,
    onTempNotesChange,
}: BookNotesSectionProps) {
    const { t } = useTranslation();

    const isGift = book.isGift || book.purchaseLocation?.startsWith("Gift from:");
    const isBorrowed = book.purchaseLocation?.startsWith("Borrowed from:");
    
    let acquisitionHeader = null;
    let Icon = null;
    if (isGift) {
        acquisitionHeader = book.purchaseLocation?.startsWith("Gift from:") 
            ? book.purchaseLocation 
            : t("bookDetail.info.gift", "Gift");
        Icon = Gift;
    } else if (isBorrowed) {
        acquisitionHeader = book.purchaseLocation;
        Icon = UserCircle;
    }

    return (
        <div className="flex-1 flex flex-col p-4 bg-white rounded-xl border border-walnut/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-darkBrown flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-walnut" />
                    {t("bookDetail.notes.personal_notes", "Personal Notes")}
                </h3>
                {!isEditingNotes ? (
                    <button
                        onClick={onEdit}
                        className="text-xs text-walnut hover:text-darkBrown flex items-center gap-1 transition-colors"
                    >
                        <Edit3 size={14} />
                        {t("bookDetail.actions.edit", "Edit")}
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSave}
                            disabled={updateNotes.isPending}
                            className="text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                        >
                            {t("bookDetail.actions.save", "Save")}
                        </button>
                        <button
                            onClick={onCancel}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            {t("bookDetail.actions.cancel", "Cancel")}
                        </button>
                    </div>
                )}
            </div>

            {acquisitionHeader && (
                <div className="mb-3 px-3 py-2 bg-[#fef9ec] border border-[#fcd34d66] rounded-lg flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-[#d97706]" />}
                    <span className="text-sm font-medium text-[#9c6d3a]">{acquisitionHeader}</span>
                </div>
            )}

            {!isEditingNotes ? (
                <div className="flex-1 p-3 bg-walnut/10 rounded-lg overflow-y-auto min-h-0">
                    <p className="text-sm text-darkBrown whitespace-pre-wrap">
                        {userNotes ||
                            t(
                                "bookDetail.notes.no_notes",
                                "No notes yet. Add your thoughts about this book...",
                            )}
                    </p>
                </div>
            ) : (
                <textarea
                    value={tempNotes}
                    onChange={(e) => onTempNotesChange(e.target.value)}
                    className="flex-1 w-full p-3 bg-white border border-walnut/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 resize-none min-h-0"
                    placeholder={t(
                        "bookDetail.notes.placeholder",
                        "Add your thoughts, quotes, or memories...",
                    )}
                />
            )}
        </div>
    );
}
