import type { Book } from "../../../types";
import { Play, Check, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookActionsSectionProps {
    book: Book;
    c0: string;
    c2: string;
    handleFav: () => void;
    toggleFavoritePending: boolean;
    handleStart: () => void;
    startReadingPending: boolean;
    setActiveTab: (tab: any) => void;
    setShowMarkAsReadDatePicker: (val: boolean) => void;
    updateBookPending: boolean;
    handleFinish: () => void;
    finishReadingPending: boolean;
    updateBookMutate: (args: any) => void;
}

export default function BookActionsSection({
    book,
    c0,
    c2,
    handleFav,
    toggleFavoritePending,
    handleStart,
    startReadingPending,
    setActiveTab,
    setShowMarkAsReadDatePicker,
    updateBookPending,
    handleFinish,
    finishReadingPending,
    updateBookMutate,
}: BookActionsSectionProps) {
    const { t } = useTranslation();
    return (
        <div className="flex gap-2 mt-auto pt-2">
            <button
                onClick={handleFav}
                disabled={toggleFavoritePending}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                    background:
                        book.isFavorite || book.favorite
                            ? "#fee2e2"
                            : `${c0}18`,
                    color:
                        book.isFavorite || book.favorite
                            ? "#b91c1c"
                            : "#6b4c2a",
                    border: `1px solid ${book.isFavorite || book.favorite ? "#fca5a5" : `${c0}30`}`,
                }}
            >
                <Heart
                    className={`w-3.5 h-3.5 ${book.isFavorite || book.favorite ? "fill-red-500 text-red-500" : ""}`}
                />
                {t("bookDetail.actions.favorite", "Favorit")}
            </button>

            {book.status === "unread" && (
                <div className="flex-1 flex gap-1.5">
                    <button
                        onClick={handleStart}
                        disabled={startReadingPending}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        style={{
                            background: `linear-gradient(135deg, ${c0}, ${c2})`,
                            color: "white",
                        }}
                        title={t(
                            "bookDetail.actions.start_reading",
                            "Mulai Membaca",
                        )}
                    >
                        <Play className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                            {t("bookDetail.actions.start", "Mulai")}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("progress");
                            setShowMarkAsReadDatePicker(true);
                        }}
                        disabled={updateBookPending}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-transparent"
                        style={{
                            background: `${c0}15`,
                            color: "#6b4c2a",
                        }}
                        title={t(
                            "bookDetail.actions.mark_finished",
                            "Tandai Sudah Dibaca",
                        )}
                    >
                        <Check className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                            {t(
                                "bookDetail.actions.finish",
                                "Selesai",
                            )}
                        </span>
                    </button>
                </div>
            )}
            {book.status === "reading" && (
                <button
                    onClick={handleFinish}
                    disabled={finishReadingPending}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{
                        background:
                            "linear-gradient(135deg, #059669, #047857)",
                        color: "white",
                    }}
                >
                    <Check className="w-3.5 h-3.5" />
                    {t("bookDetail.actions.finish", "Selesai")}
                </button>
            )}
            {book.status === "finished" && (
                <button
                    onClick={() =>
                        updateBookMutate({
                            id: book.id,
                            updates: {
                                status: "reading",
                                currentPage: 0,
                            },
                        })
                    }
                    disabled={updateBookPending}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{
                        background: `linear-gradient(135deg, ${c0}, ${c2})`,
                        color: "white",
                    }}
                >
                    <Play className="w-3.5 h-3.5" />
                    {t("bookDetail.actions.reread", "Baca Ulang")}
                </button>
            )}
        </div>
    );
}
