import { BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ReadingSession } from "../../../../lib/api/readingSessions";
import SessionCard from "./SessionCard";
import SessionStatsSummary, { type SessionStats } from "./SessionStatsSummary";

interface SessionHistorySectionProps {
    showHistory: boolean;
    selectedReadDate?: string | null;
    isFinished: boolean;
    stats: SessionStats;
    sessions: ReadingSession[];
    activeSession?: ReadingSession;
    completedSessions: ReadingSession[];
}

export default function SessionHistorySection({
    showHistory,
    selectedReadDate,
    isFinished,
    stats,
    sessions,
    activeSession,
    completedSessions,
}: SessionHistorySectionProps) {
    const { t } = useTranslation();
    const isVisible = showHistory || !!selectedReadDate || isFinished;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="history"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                >
                    {/* Stats summary row */}
                    {stats && (
                        <SessionStatsSummary
                            stats={stats}
                            completedCount={completedSessions.length}
                        />
                    )}

                    {/* Section heading */}
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="flex-1 h-px"
                            style={{ background: "rgba(139,115,85,0.15)" }}
                        />
                        <span
                            className="text-[9px] uppercase tracking-widest font-semibold"
                            style={{ color: "#9c6d3a" }}
                        >
                            {t(
                                "bookDetail.session.history_title",
                                "Riwayat Sesi",
                            )}
                        </span>
                        <div
                            className="flex-1 h-px"
                            style={{ background: "rgba(139,115,85,0.15)" }}
                        />
                    </div>

                    {/* Cards */}
                    {sessions.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-8 text-center rounded-xl border"
                            style={{
                                background: "rgba(255,255,255,0.7)",
                                borderColor: "rgba(139,115,85,0.1)",
                            }}
                        >
                            <BookOpen
                                className="w-8 h-8 mb-2"
                                style={{ color: "rgba(139,115,85,0.3)" }}
                            />
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9c6d3a" }}
                            >
                                {t(
                                    "bookDetail.session.no_sessions",
                                    "Belum ada sesi membaca",
                                )}
                            </p>
                            <p
                                className="text-[9px] mt-0.5"
                                style={{ color: "rgba(139,115,85,0.5)" }}
                            >
                                {t(
                                    "bookDetail.session.start_first",
                                    "Mulai sesi pertamamu!",
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {activeSession && (
                                <SessionCard
                                    key={activeSession.id}
                                    session={activeSession}
                                    index={sessions.length - 1}
                                />
                            )}
                            {[...completedSessions]
                                .sort(
                                    (a, b) =>
                                        new Date(b.start_time).getTime() -
                                        new Date(a.start_time).getTime(),
                                )
                                .map((s, i) => (
                                    <SessionCard
                                        key={s.id}
                                        session={s}
                                        index={completedSessions.length - 1 - i}
                                    />
                                ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
