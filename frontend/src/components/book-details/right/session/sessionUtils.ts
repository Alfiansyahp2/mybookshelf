export function formatDuration(seconds: number | null): string {
    if (!seconds) return "—";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}j ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}d`;
    return `${secs}d`;
}

export function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatHHMMSS(secs: number): string {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function getMoodCfg(t: any) {
    return {
        great: {
            label: t("bookDetail.session.mood.great", "Luar Biasa"),
            emoji: "🤩",
            color: "#065f46",
            bg: "#d1fae5",
        },
        good: {
            label: t("bookDetail.session.mood.good", "Baik"),
            emoji: "😊",
            color: "#1e40af",
            bg: "#dbeafe",
        },
        okay: {
            label: t("bookDetail.session.mood.okay", "Biasa"),
            emoji: "😐",
            color: "#92400e",
            bg: "#fef3c7",
        },
        difficult: {
            label: t("bookDetail.session.mood.difficult", "Berat"),
            emoji: "😓",
            color: "#7f1d1d",
            bg: "#fee2e2",
        },
    };
}
