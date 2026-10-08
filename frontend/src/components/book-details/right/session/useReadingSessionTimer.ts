import { useState, useEffect } from "react";
import type { Book } from "../../../../types";
import {
    useStartReadingSession,
    useEndReadingSession,
    useBookReadingSessions,
    usePauseReadingSession,
} from "../../../../hooks/useReadingSessions";
import { formatHHMMSS } from "./sessionUtils";
import type { SessionStats } from "./SessionStatsSummary";

interface UseReadingSessionTimerProps {
    book: Book;
    updateProgress: {
        mutate: (params: { id: string; currentPage: number }) => void;
    };
    selectedReadDate?: string | null;
}

export function useReadingSessionTimer({
    book,
    updateProgress,
    selectedReadDate,
}: UseReadingSessionTimerProps) {
    const [isReadingSession, setIsReadingSession] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [targetMinutes, setTargetMinutes] = useState<number | null>(null);
    const [startingPage, setStartingPage] = useState(0);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isEndingSession, setIsEndingSession] = useState(false);
    const [endPage, setEndPage] = useState<number>(book.currentPage || 0);
    const [notes, setNotes] = useState<string>("");
    const [hasInitializedSession, setHasInitializedSession] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const startSessionMutation = useStartReadingSession();
    const endSessionMutation = useEndReadingSession();
    const pauseSessionMutation = usePauseReadingSession();
    const { data: sessionData } = useBookReadingSessions(book.id);

    // If selectedReadDate is present, filter sessions within that date interval
    let sessions = sessionData?.sessions ?? [];

    if (selectedReadDate && book.readDates) {
        const sortedDates = [...book.readDates].sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        );
        const dateIdx = sortedDates.indexOf(selectedReadDate);
        if (dateIdx !== -1) {
            const endDate = new Date(selectedReadDate);
            endDate.setHours(23, 59, 59, 999);
            const endMs = endDate.getTime();

            let startMs = 0;
            if (dateIdx > 0) {
                const prevDate = new Date(sortedDates[dateIdx - 1]);
                prevDate.setHours(23, 59, 59, 999);
                startMs = prevDate.getTime();
            }

            sessions = sessions.filter((s) => {
                const sessionTime = new Date(s.start_time).getTime();
                return sessionTime > startMs && sessionTime <= endMs;
            });
        }
    }

    // Stats calculations
    const stats: SessionStats = {
        total_sessions: sessions.length,
        total_duration_seconds: sessions.reduce(
            (acc, s) => acc + (s.duration || 0),
            0,
        ),
        total_pages_read: sessions.reduce((acc, s) => {
            const pages = s.end_page != null ? s.end_page - s.start_page : 0;
            return acc + Math.max(0, pages);
        }, 0),
        average_reading_speed_pages_per_hour: 0,
    };

    if (stats.total_sessions > 0 && stats.total_duration_seconds > 0) {
        stats.average_reading_speed_pages_per_hour =
            stats.total_pages_read / (stats.total_duration_seconds / 3600);
    }

    const completedSessions = sessions.filter((s) => s.end_time !== null);
    const activeSession = sessions.find((s) => s.end_time === null);

    // Resume active session from database on mount
    useEffect(() => {
        if (sessionData?.sessions && !hasInitializedSession) {
            const active = sessionData.sessions.find(
                (s) => s.end_time === null,
            );
            if (active) {
                setIsReadingSession(true);
                setActiveSessionId(active.id);
                setStartingPage(active.start_page);
                setEndPage(book.currentPage || active.start_page);

                let durationSeconds = 0;
                if (active.is_paused && active.last_paused_at) {
                    durationSeconds =
                        Math.max(
                            0,
                            Math.floor(
                                (new Date(active.last_paused_at).getTime() -
                                    new Date(active.start_time).getTime()) /
                                    1000,
                            ),
                        ) - (active.paused_seconds || 0);
                } else {
                    durationSeconds =
                        Math.max(
                            0,
                            Math.floor(
                                (Date.now() -
                                    new Date(active.start_time).getTime()) /
                                    1000,
                            ),
                        ) - (active.paused_seconds || 0);
                }
                setSessionDuration(durationSeconds);
            }
            setHasInitializedSession(true);
        }
    }, [sessionData, hasInitializedSession, book.currentPage]);

    // Live timer tick
    useEffect(() => {
        let interval: number;
        const isPaused = activeSession?.is_paused || false;
        if (isReadingSession && !isEndingSession && !isPaused) {
            interval = setInterval(
                () => setSessionDuration((prev) => prev + 1),
                1000,
            );
        }
        return () => clearInterval(interval);
    }, [isReadingSession, isEndingSession, activeSession?.is_paused]);

    const handleStart = async () => {
        const cur = book.currentPage || 0;
        setStartingPage(cur);
        setEndPage(cur);
        try {
            const result = await startSessionMutation.mutateAsync({
                bookId: book.id,
                data: { start_page: cur, mood: "good" },
            });
            setActiveSessionId(result.id);
            setIsReadingSession(true);
            setIsEndingSession(false);
        } catch {
            setIsReadingSession(true);
        }
    };

    const handleStop = () => {
        setIsEndingSession(true);
        setEndPage(Math.max(startingPage, book.currentPage || 0));
    };

    const handleCancelEnd = () => setIsEndingSession(false);

    const handleSaveEnd = async () => {
        if (endPage < startingPage) {
            alert(
                `Halaman akhir tidak boleh lebih kecil dari halaman awal (${startingPage})`,
            );
            return;
        }
        try {
            if (activeSessionId) {
                await endSessionMutation.mutateAsync({
                    bookId: book.id,
                    sessionId: activeSessionId,
                    data: {
                        end_page: endPage,
                        notes: notes || `Durasi: ${formatHHMMSS(sessionDuration)}`,
                    },
                });
            } else if (endPage > startingPage) {
                updateProgress.mutate({ id: book.id, currentPage: endPage });
            }
            setIsReadingSession(false);
            setIsEndingSession(false);
            setSessionDuration(0);
            setActiveSessionId(null);
            setNotes("");
            setTargetMinutes(null);
        } catch (err) {
            console.error("Failed to end session:", err);
        }
    };

    const handleTogglePause = () => {
        if (activeSessionId) {
            pauseSessionMutation.mutate({
                bookId: book.id,
                sessionId: activeSessionId,
                isPaused: !activeSession?.is_paused,
            });
        }
    };

    const handleSelectTargetMinutes = (min: number) => {
        setTargetMinutes(targetMinutes === min ? null : min);
    };

    const handleToggleHistory = () => {
        setShowHistory((v) => !v);
    };

    return {
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
        isStartPending: startSessionMutation.isPending,
        isPausePending: pauseSessionMutation.isPending,
        isEndPending: endSessionMutation.isPending,
        hasError: !!startSessionMutation.error || !!endSessionMutation.error,
        handleStart,
        handleStop,
        handleCancelEnd,
        handleSaveEnd,
        handleTogglePause,
        handleSelectTargetMinutes,
        handleToggleHistory,
    };
}
