import { BookOpen, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ReadingSession } from "../../../../lib/api/readingSessions";
import { formatDateTime, formatDuration, getMoodCfg } from "./sessionUtils";

interface SessionCardProps {
    session: ReadingSession;
    index: number;
}

export default function SessionCard({ session, index }: SessionCardProps) {
    const { t } = useTranslation();
    const isActive = session.end_time === null;
    const pagesRead =
        session.end_page != null ? session.end_page - session.start_page : null;
    const moodCfg = getMoodCfg(t);
    const mood = session.mood
        ? moodCfg[session.mood as keyof typeof moodCfg]
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.2 }}
            className="rounded-xl border p-3 space-y-2"
            style={
                isActive
                    ? {
                          borderColor: "#6ee7b7",
                          background: "#f0fdf4",
                          boxShadow: "0 1px 6px rgba(16,185,129,0.1)",
                      }
                    : {
                          borderColor: "rgba(139,115,85,0.12)",
                          background: "rgba(255,255,255,0.85)",
                      }
            }
        >
            {/* Header row */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                            background: isActive
                                ? "#d1fae5"
                                : "rgba(139,115,85,0.1)",
                        }}
                    >
                        <BookOpen
                            className="w-3.5 h-3.5"
                            style={{ color: isActive ? "#059669" : "#8B7355" }}
                        />
                    </div>
                    <span
                        className="text-xs font-semibold"
                        style={{ color: "#2a1a08" }}
                    >
                        {t(
                            "bookDetail.session.session_number",
                            "Sesi #{{index}}",
                            { index: index + 1 },
                        )}
                    </span>
                    {mood && (
                        <span
                            className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{ background: mood.bg, color: mood.color }}
                        >
                            {mood.emoji} {mood.label}
                        </span>
                    )}
                </div>

                {isActive ? (
                    <span
                        className="flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#d1fae5", color: "#065f46" }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {t("bookDetail.session.active", "Aktif")}
                    </span>
                ) : session.end_time ? (
                    <span className="text-[9px]" style={{ color: "#9c6d3a" }}>
                        {new Date(session.end_time).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                        )}
                    </span>
                ) : null}
            </div>

            {/* Date */}
            <div
                className="flex items-center gap-1 text-[9px]"
                style={{ color: "#9c6d3a" }}
            >
                <Calendar className="w-3 h-3" />
                {formatDateTime(session.start_time)}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1.5">
                <div
                    className="rounded-lg p-1.5 text-center"
                    style={{ background: "rgba(139,115,85,0.08)" }}
                >
                    <div
                        className="text-[8px] mb-0.5"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.session.pages", "Halaman")}
                    </div>
                    <div
                        className="text-xs font-bold"
                        style={{ color: "#2a1a08" }}
                    >
                        {session.start_page} → {session.end_page ?? "…"}
                    </div>
                    {pagesRead !== null && (
                        <div
                            className="text-[8px]"
                            style={{ color: "#9c6d3a" }}
                        >
                            +{pagesRead}
                        </div>
                    )}
                </div>

                <div
                    className="rounded-lg p-1.5 text-center"
                    style={{ background: "rgba(139,115,85,0.08)" }}
                >
                    <div
                        className="text-[8px] mb-0.5"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.session.duration", "Durasi")}
                    </div>
                    <div
                        className="text-xs font-bold font-mono"
                        style={{ color: "#2a1a08" }}
                    >
                        {formatDuration(session.duration)}
                    </div>
                </div>

                <div
                    className="rounded-lg p-1.5 text-center"
                    style={{ background: "rgba(139,115,85,0.08)" }}
                >
                    <div
                        className="text-[8px] mb-0.5"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.session.speed", "Kecepatan")}
                    </div>
                    <div
                        className="text-xs font-bold"
                        style={{ color: "#2a1a08" }}
                    >
                        {session.duration && pagesRead
                            ? (pagesRead / (session.duration / 3600)).toFixed(0)
                            : "—"}
                    </div>
                    <div className="text-[8px]" style={{ color: "#9c6d3a" }}>
                        {t("bookDetail.session.speed_unit", "hlm/j")}
                    </div>
                </div>
            </div>

            {/* Notes */}
            {session.notes && (
                <div
                    className="flex items-start gap-1.5 pt-1.5 border-t"
                    style={{ borderColor: "rgba(139,115,85,0.1)" }}
                >
                    <FileText
                        className="w-3 h-3 flex-shrink-0 mt-0.5"
                        style={{ color: "#9c6d3a" }}
                    />
                    <p
                        className="text-[9px] italic leading-relaxed line-clamp-2"
                        style={{ color: "#7c5c3a" }}
                    >
                        {session.notes}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
