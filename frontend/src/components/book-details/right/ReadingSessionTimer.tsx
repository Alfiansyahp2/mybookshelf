import type { Book } from "../../../types";
import SessionDateBanner from "./session/SessionDateBanner";
import SessionTimerCard from "./session/SessionTimerCard";
import SessionHistorySection from "./session/SessionHistorySection";
import { useReadingSessionTimer } from "./session/useReadingSessionTimer";

interface ReadingSessionTimerProps {
    book: Book;
    updateProgress: {
        mutate: (params: { id: string; currentPage: number }) => void;
    };
    selectedReadDate?: string | null;
    onClearSelectedReadDate?: () => void;
}

export default function ReadingSessionTimer({
    book,
    updateProgress,
    selectedReadDate,
    onClearSelectedReadDate,
}: ReadingSessionTimerProps) {
    const {
        isReadingSession,
        sessionDuration,
        targetMinutes,
        startingPage,
        endPage,
        setEndPage,
        notes,
        setNotes,
        isEndingSession,
        showHistory,
        sessions,
        stats,
        completedSessions,
        activeSession,
        isStartPending,
        isPausePending,
        isEndPending,
        hasError,
        handleStart,
        handleStop,
        handleCancelEnd,
        handleSaveEnd,
        handleTogglePause,
        handleSelectTargetMinutes,
        handleToggleHistory,
    } = useReadingSessionTimer({
        book,
        updateProgress,
        selectedReadDate,
    });

    return (
        <div className="space-y-2">
            {/* Selected Read Date Banner */}
            {selectedReadDate ? (
                <SessionDateBanner
                    selectedReadDate={selectedReadDate}
                    onClearSelectedReadDate={onClearSelectedReadDate}
                />
            ) : book.status === "finished" ? null : (
                /* Timer Card */
                <SessionTimerCard
                    book={book}
                    isReadingSession={isReadingSession}
                    sessionDuration={sessionDuration}
                    targetMinutes={targetMinutes}
                    startingPage={startingPage}
                    endPage={endPage}
                    notes={notes}
                    isEndingSession={isEndingSession}
                    showHistory={showHistory}
                    activeSession={activeSession}
                    isStartPending={isStartPending}
                    isPausePending={isPausePending}
                    isEndPending={isEndPending}
                    hasError={hasError}
                    onToggleHistory={handleToggleHistory}
                    onSelectTargetMinutes={handleSelectTargetMinutes}
                    onStart={handleStart}
                    onTogglePause={handleTogglePause}
                    onStop={handleStop}
                    onCancelEnd={handleCancelEnd}
                    onSaveEnd={handleSaveEnd}
                    onEndPageChange={setEndPage}
                    onNotesChange={setNotes}
                />
            )}

            {/* Riwayat Sesi Section */}
            <SessionHistorySection
                showHistory={showHistory}
                selectedReadDate={selectedReadDate}
                isFinished={book.status === "finished"}
                stats={stats}
                sessions={sessions}
                activeSession={activeSession}
                completedSessions={completedSessions}
            />
        </div>
    );
}
