import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SessionDateBannerProps {
    selectedReadDate: string;
    onClearSelectedReadDate?: () => void;
}

export default function SessionDateBanner({
    selectedReadDate,
    onClearSelectedReadDate,
}: SessionDateBannerProps) {
    const { t } = useTranslation();

    return (
        <div
            className="rounded-xl border p-3 flex justify-between items-center"
            style={{
                background: "rgba(255,255,255,0.85)",
                borderColor: "rgba(139,115,85,0.12)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
        >
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: "#8B7355" }} />
                <span
                    className="text-sm font-semibold"
                    style={{ color: "#2a1a08" }}
                >
                    {t(
                        "bookDetail.session.journey_for",
                        "Riwayat Perjalanan:",
                    )}{" "}
                    {new Date(selectedReadDate).toLocaleDateString(
                        t("locale", "id-ID"),
                        { day: "numeric", month: "long", year: "numeric" },
                    )}
                </span>
            </div>
            {onClearSelectedReadDate && (
                <button
                    onClick={onClearSelectedReadDate}
                    className="text-xs px-3 py-1 rounded transition-colors hover:bg-black/5"
                    style={{ color: "#2a1a08" }}
                >
                    {t("bookDetail.session.back_to_current", "Kembali")}
                </button>
            )}
        </div>
    );
}
