import { Clock, BookOpen, Activity, ChevronUp, ChevronDown, Play, Pause, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Book } from "../../../../types";
import type { ReadingSession } from "../../../../lib/api/readingSessions";
import { formatHHMMSS } from "./sessionUtils";

interface SessionTimerCardProps {
    book: Book;
    isReadingSession: boolean;
    sessionDuration: number;
    targetMinutes: number | null;
    startingPage: number;
    endPage: number;
    notes: string;
    isEndingSession: boolean;
    showHistory: boolean;
    activeSession?: ReadingSession;
    isStartPending: boolean;
    isPausePending: boolean;
    isEndPending: boolean;
    hasError: boolean;
    onToggleHistory: () => void;
    onSelectTargetMinutes: (min: number) => void;
    onStart: () => void;
    onTogglePause: () => void;
    onStop: () => void;
    onCancelEnd: () => void;
    onSaveEnd: () => void;
    onEndPageChange: (val: number) => void;
    onNotesChange: (val: string) => void;
}

export default function SessionTimerCard({
    book,
    isReadingSession,
    sessionDuration,
    targetMinutes,
    startingPage,
    endPage,
    notes,
    isEndingSession,
    showHistory,
    activeSession,
    isStartPending,
    isPausePending,
    isEndPending,
    hasError,
    onToggleHistory,
    onSelectTargetMinutes,
    onStart,
    onTogglePause,
    onStop,
    onCancelEnd,
    onSaveEnd,
    onEndPageChange,
    onNotesChange,
}: SessionTimerCardProps) {
    const { t } = useTranslation();

    const pagesRead = Math.max(
        0,
        (isEndingSession ? endPage : book.currentPage || 0) - startingPage,
    );
    const readingSpeed =
        sessionDuration > 0
            ? (pagesRead / (sessionDuration / 3600)).toFixed(1)
            : "0.0";

    return (
        <div
            className="rounded-xl border p-3"
            style={{
                background: "rgba(255,255,255,0.85)",
                borderColor: "rgba(139,115,85,0.12)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: "#2a1a08" }}
                >
                    <Clock className="w-4 h-4" style={{ color: "#8B7355" }} />
                    Reading Session
                    {activeSession?.is_paused && (
                        <span
                            className="ml-1 text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider"
                            style={{
                                background: "#fef3c7",
                                color: "#92400e",
                            }}
                        >
                            {t("bookDetail.session.paused", "Dijeda")}
                        </span>
                    )}
                </h3>

                <div className="flex items-center gap-2">
                    {isReadingSession && (
                        <span className="text-xs" style={{ color: "#9c6d3a" }}>
                            <BookOpen className="w-3 h-3 inline mr-1" />
                            {pagesRead}{" "}
                            {t("bookDetail.session.pages_short", "hlm")}
                        </span>
                    )}

                    {/* Toggle riwayat — inline */}
                    <button
                        onClick={onToggleHistory}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all"
                        style={{
                            color: showHistory ? "#2a1a08" : "#9c6d3a",
                            background: showHistory
                                ? "rgba(139,115,85,0.12)"
                                : "transparent",
                        }}
                    >
                        <Activity className="w-3.5 h-3.5" />
                        {t("bookDetail.session.history", "Riwayat")}
                        {showHistory ? (
                            <ChevronUp className="w-3 h-3" />
                        ) : (
                            <ChevronDown className="w-3 h-3" />
                        )}
                    </button>
                </div>
            </div>

            {/* Timer display */}
            <div className="text-center mb-2">
                {targetMinutes ? (
                    <div
                        className="text-2xl font-mono font-bold tracking-widest"
                        style={{
                            color:
                                targetMinutes * 60 - sessionDuration > 0
                                    ? isReadingSession
                                        ? "#065f46"
                                        : "#2a1a08"
                                    : "#dc2626",
                        }}
                    >
                        <span className="text-[10px] mr-1 opacity-60">
                            {targetMinutes * 60 - sessionDuration > 0
                                ? ""
                                : "+"}
                        </span>
                        {formatHHMMSS(
                            Math.abs(targetMinutes * 60 - sessionDuration),
                        )}
                        <span className="text-[10px] ml-1 opacity-60">
                            {targetMinutes * 60 - sessionDuration > 0
                                ? "sisa"
                                : "lewat"}
                        </span>
                    </div>
                ) : (
                    <div
                        className="text-2xl font-mono font-bold tracking-widest"
                        style={{
                            color: isReadingSession ? "#065f46" : "#2a1a08",
                        }}
                    >
                        {formatHHMMSS(sessionDuration)}
                    </div>
                )}

                {isReadingSession && sessionDuration > 60 && (
                    <div
                        className="text-xs mt-0.5"
                        style={{ color: "#9c6d3a" }}
                    >
                        {readingSpeed}{" "}
                        {t("bookDetail.session.speed_unit", "hlm/j")}
                    </div>
                )}
            </div>

            {/* Start / Stop / Save flow */}
            {!isReadingSession ? (
                <>
                    {/* Target Time Selection */}
                    <div className="flex justify-center gap-1.5 mb-3">
                        {[15, 30, 45, 60].map((min) => (
                            <button
                                key={min}
                                onClick={() => onSelectTargetMinutes(min)}
                                className={`px-2 py-1 text-[10px] font-semibold rounded border transition-all ${
                                    targetMinutes === min
                                        ? "bg-[#8B7355] text-white border-[#8B7355]"
                                        : "bg-white text-[#8B7355] border-[#8B7355]/30 hover:bg-[#8B7355]/10"
                                }`}
                            >
                                {min}m
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onStart}
                        disabled={isStartPending}
                        className="w-full py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                        style={{
                            background:
                                "linear-gradient(135deg, #16a34a, #15803d)",
                        }}
                    >
                        <Play className="w-4 h-4" />
                        {isStartPending
                            ? t("bookDetail.session.starting", "Memulai...")
                            : t("bookDetail.session.start", "Start Session")}
                    </button>
                </>
            ) : !isEndingSession ? (
                <>
                    <div className="flex gap-2">
                        <button
                            onClick={onTogglePause}
                            disabled={isPausePending}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                            style={{
                                background: activeSession?.is_paused
                                    ? "linear-gradient(135deg, #16a34a, #15803d)"
                                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                                color: "white",
                            }}
                        >
                            {activeSession?.is_paused ? (
                                <Play className="w-4 h-4" />
                            ) : (
                                <Pause className="w-4 h-4" />
                            )}
                            {activeSession?.is_paused
                                ? t("bookDetail.session.resume", "Lanjutkan")
                                : t("bookDetail.session.pause", "Jeda")}
                        </button>
                        <button
                            onClick={onStop}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                            style={{
                                background:
                                    "linear-gradient(135deg, #dc2626, #b91c1c)",
                            }}
                        >
                            <Check className="w-4 h-4" />
                            {t("bookDetail.session.finish", "Selesai")}
                        </button>
                    </div>

                    <div
                        className="mt-2 text-center text-[10px]"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t(
                            "bookDetail.session.from_page",
                            "Dari hal. {{start}} · {{count}} halaman dibaca",
                            { start: startingPage, count: pagesRead },
                        )}
                    </div>
                </>
            ) : (
                <div
                    className="rounded-lg p-3 space-y-2.5"
                    style={{
                        background: "rgba(139,115,85,0.06)",
                        border: "1px solid rgba(139,115,85,0.12)",
                    }}
                >
                    <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t(
                            "bookDetail.session.finish_session",
                            "Selesaikan Sesi",
                        )}
                    </p>

                    <div>
                        <label
                            className="text-xs block mb-1"
                            style={{ color: "#9c6d3a" }}
                        >
                            {t(
                                "bookDetail.session.end_page",
                                "Halaman Akhir (mulai: {{start}} / maks: {{max}})",
                                { start: startingPage, max: book.pages },
                            )}
                        </label>
                        <input
                            type="number"
                            min={startingPage}
                            max={book.pages || 9999}
                            value={endPage}
                            onChange={(e) =>
                                onEndPageChange(
                                    parseInt(e.target.value) || startingPage,
                                )
                            }
                            className="w-full px-2 py-1 text-sm rounded-lg border focus:outline-none"
                            style={{
                                borderColor: "rgba(139,115,85,0.25)",
                                background: "white",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            className="text-xs block mb-1"
                            style={{ color: "#9c6d3a" }}
                        >
                            {t(
                                "bookDetail.session.notes_optional",
                                "Catatan (opsional)",
                            )}
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder={t(
                                "bookDetail.session.notes_placeholder",
                                "Bagaimana sesi membacamu?",
                            )}
                            rows={2}
                            className="w-full px-2 py-1 text-xs rounded-lg border resize-none focus:outline-none"
                            style={{
                                borderColor: "rgba(139,115,85,0.25)",
                                background: "white",
                            }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onSaveEnd}
                            disabled={isEndPending}
                            className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                            style={{
                                background:
                                    "linear-gradient(135deg, #16a34a, #15803d)",
                            }}
                        >
                            <Check className="w-3.5 h-3.5" />
                            {isEndPending
                                ? t("bookDetail.session.saving", "Menyimpan...")
                                : t("bookDetail.session.save", "Simpan")}
                        </button>
                        <button
                            onClick={onCancelEnd}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                            style={{
                                background: "rgba(107,83,68,0.12)",
                                color: "#6b4c2a",
                            }}
                        >
                            <X className="w-3.5 h-3.5" />
                            {t("bookDetail.session.cancel", "Batal")}
                        </button>
                    </div>
                </div>
            )}

            {/* Error */}
            {hasError && (
                <div
                    className="mt-2 p-2 rounded-lg text-xs text-red-700"
                    style={{ background: "#fee2e2" }}
                >
                    {t(
                        "bookDetail.session.error",
                        "Gagal menyimpan sesi. Coba lagi.",
                    )}
                </div>
            )}
        </div>
    );
}
