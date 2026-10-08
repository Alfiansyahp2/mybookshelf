import type { Book } from "../../../types";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";

interface UnreadStartSectionProps {
    book: Book;
    c0: string;
    c1: string;
    handleStart: () => void;
    showMarkAsReadDatePicker: boolean;
    setShowMarkAsReadDatePicker: (val: boolean) => void;
    markAsReadDate: string;
    setMarkAsReadDate: (val: string) => void;
    handleMarkAsReadNow: () => void;
    startReadingPending: boolean;
    updateBookPending: boolean;
}

export default function UnreadStartSection({
    book,
    c0,
    c1,
    handleStart,
    showMarkAsReadDatePicker,
    setShowMarkAsReadDatePicker,
    markAsReadDate,
    setMarkAsReadDate,
    handleMarkAsReadNow,
    startReadingPending,
    updateBookPending,
}: UnreadStartSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            <BookOpen
                className="w-12 h-12 mb-3"
                style={{ color: `${c1}40` }}
            />
            <p
                className="text-sm"
                style={{ color: "#9c6d3a" }}
            >
                {t(
                    "bookDetail.progress.start_to_see",
                    "Mulai membaca untuk melihat progress"
                )}
            </p>

            {book.status === "unread" && !showMarkAsReadDatePicker && (
                <div className="flex gap-3 mt-5">
                    <button
                        onClick={handleStart}
                        disabled={startReadingPending}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 bg-walnut cursor-pointer shadow-sm"
                    >
                        {t(
                            "bookDetail.actions.start_reading",
                            "Mulai Membaca"
                        )}
                    </button>
                    <button
                        onClick={() => setShowMarkAsReadDatePicker(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 border-2 cursor-pointer"
                        style={{
                            color: c0,
                            borderColor: c0,
                            background: "transparent",
                        }}
                    >
                        {t(
                            "bookDetail.actions.already_read",
                            "Sudah Baca"
                        )}
                    </button>
                </div>
            )}

            {book.status === "unread" && showMarkAsReadDatePicker && (
                <div
                    className="flex flex-col items-center gap-3 mt-5 p-4 rounded-xl max-w-sm w-full"
                    style={{
                        background: "rgba(255,255,255,0.6)",
                        border: `1px solid ${c0}30`,
                    }}
                >
                    <label
                        className="text-sm font-medium"
                        style={{ color: "#2a1a08" }}
                    >
                        {t(
                            "bookDetail.progress.choose_finish_date",
                            "Pilih Tanggal Selesai Dibaca:"
                        )}
                    </label>
                    <input
                        type="date"
                        value={markAsReadDate}
                        onChange={(e) => setMarkAsReadDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2"
                        style={{
                            borderColor: `${c0}40`,
                            color: "#2a1a08",
                        }}
                    />
                    <div className="flex gap-2 w-full mt-1">
                        <button
                            onClick={handleMarkAsReadNow}
                            disabled={updateBookPending}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 bg-walnut cursor-pointer shadow-sm"
                        >
                            {t("bookDetail.actions.save", "Simpan")}
                        </button>
                        <button
                            onClick={() => setShowMarkAsReadDatePicker(false)}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 border border-transparent cursor-pointer"
                            style={{
                                color: c0,
                                background: `${c0}15`,
                            }}
                        >
                            {t("bookDetail.actions.cancel", "Batal")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
