import { BarChart2, Clock, BookOpen, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDuration } from "./sessionUtils";

export interface SessionStats {
    total_sessions: number;
    total_duration_seconds: number;
    total_duration_formatted?: string;
    total_pages_read: number;
    average_reading_speed_pages_per_hour?: number;
}

interface SessionStatsSummaryProps {
    stats: SessionStats;
    completedCount: number;
}

export default function SessionStatsSummary({
    stats,
    completedCount,
}: SessionStatsSummaryProps) {
    const { t } = useTranslation();

    const items = [
        {
            icon: <BarChart2 className="w-3 h-3" />,
            label: t("bookDetail.session.total_sessions", "Total Sesi"),
            val: stats.total_sessions,
            sub: t("bookDetail.session.sessions_finished", "{{count}} selesai", {
                count: completedCount,
            }),
        },
        {
            icon: <Clock className="w-3 h-3" />,
            label: t("bookDetail.session.total_time", "Total Waktu"),
            val:
                stats.total_duration_formatted ||
                formatDuration(stats.total_duration_seconds),
            sub: t("bookDetail.session.reading_time", "waktu membaca"),
            mono: true,
        },
        {
            icon: <BookOpen className="w-3 h-3" />,
            label: t("bookDetail.session.total_pages_read", "Total Halaman"),
            val: stats.total_pages_read,
            sub: t("bookDetail.session.pages_read", "halaman dibaca"),
        },
        {
            icon: <TrendingUp className="w-3 h-3" />,
            label: t("bookDetail.session.avg_speed", "Kecepatan"),
            val:
                stats.average_reading_speed_pages_per_hour?.toFixed(1) ?? "—",
            sub: t("bookDetail.session.avg_speed_unit", "hlm/jam rata-rata"),
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-1.5 mb-2">
            {items.map((s, i) => (
                <div
                    key={i}
                    className="rounded-xl p-2.5 border"
                    style={{
                        background: "rgba(255,255,255,0.85)",
                        borderColor: "rgba(139,115,85,0.12)",
                    }}
                >
                    <div
                        className="flex items-center gap-1.5 mb-0.5"
                        style={{ color: "#8B7355" }}
                    >
                        {s.icon}
                        <span
                            className="text-[9px]"
                            style={{ color: "#9c6d3a" }}
                        >
                            {s.label}
                        </span>
                    </div>
                    <div
                        className={`text-base font-bold ${s.mono ? "font-mono" : ""}`}
                        style={{ color: "#2a1a08" }}
                    >
                        {s.val}
                    </div>
                    <div className="text-[8px]" style={{ color: "#9c6d3a" }}>
                        {s.sub}
                    </div>
                </div>
            ))}
        </div>
    );
}
