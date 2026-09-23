import type { Book } from "../../../types";
import { useTranslation } from "react-i18next";

interface BookStatsSectionProps {
    book: Book;
    c0: string;
}

export default function BookStatsSection({ book, c0 }: BookStatsSectionProps) {
    const { t } = useTranslation();

    const formatLanguage = (lang?: string) => {
        if (!lang) return "—";
        if (lang === "Bahasa Indonesia") return t("bookDetail.stats.lang_id", "Bahasa Indonesia");
        if (lang === "English") return t("bookDetail.stats.lang_en", "English");
        if (lang === "Korean") return t("bookDetail.stats.lang_ko", "Korean");
        return lang;
    };

    const formatFormat = (fmt?: string) => {
        if (!fmt) return "—";
        const lower = fmt.toLowerCase();
        if (lower === "paperback") return t("bookDetail.stats.format_paperback", "Paperback");
        if (lower === "hardcover") return t("bookDetail.stats.format_hardcover", "Hardcover");
        if (lower === "ebook") return t("bookDetail.stats.format_ebook", "E-Book");
        return fmt.charAt(0).toUpperCase() + fmt.slice(1);
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            {[
                {
                    icon: "📖",
                    label: t("bookDetail.stats.pages", "Halaman"),
                    val: book.pages || "—",
                },
                {
                    icon: "📅",
                    label: t("bookDetail.stats.year", "Tahun"),
                    val: book.publishYear || "—",
                },
                {
                    icon: "🌐",
                    label: t("bookDetail.stats.language", "Bahasa"),
                    val: formatLanguage(book.language),
                },
                {
                    icon: "📦",
                    label: t("bookDetail.stats.format", "Format"),
                    val: formatFormat(book.format),
                },
            ].map((s, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center justify-center py-2.5 rounded-lg"
                    style={{
                        background: `${c0}15`,
                        border: `1px solid ${c0}22`,
                    }}
                >
                    <span className="text-base">{s.icon}</span>
                    <span
                        className="font-bold text-xs mt-0.5"
                        style={{ color: "#2a1a08" }}
                    >
                        {s.val}
                    </span>
                    <span
                        className="text-[10px]"
                        style={{ color: "#9c6d3a" }}
                    >
                        {s.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
