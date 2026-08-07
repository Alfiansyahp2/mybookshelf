import type { Book } from "../../../types";
import { useTranslation } from "react-i18next";

interface BookMetadataSectionProps {
    book: Book;
    c1: string;
    cfg: any;
}

export default function BookMetadataSection({ book, c1, cfg }: BookMetadataSectionProps) {
    const { t } = useTranslation();
    
    return (
        <div className="flex-1 min-w-0 flex flex-col justify-start pt-1 gap-1.5">
            {/* Title */}
            <h1
                className="font-bold leading-tight"
                style={{
                    color: "#2a1a08",
                    fontFamily: "'Georgia', serif",
                    fontSize: 14,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {book.title}
            </h1>

            {/* Author */}
            <p
                className="text-xs italic truncate"
                style={{
                    color: "#7c5c3a",
                    fontFamily: "'Georgia', serif",
                }}
            >
                {book.author}
            </p>

            {/* Genre */}
            {book.genre && (
                <p
                    className="text-[9px] uppercase font-semibold tracking-widest truncate"
                    style={{ color: c1, letterSpacing: "0.18em" }}
                >
                    {book.genre}
                </p>
            )}

            {/* Status badge */}
            <div className="flex flex-wrap gap-1.5 mt-0.5">
                <div
                    className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
                    style={{
                        background: cfg.bg,
                        color: cfg.color,
                        border: `1px solid ${cfg.border}`,
                    }}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${book.status === "reading" ? "animate-pulse" : ""}`}
                        style={{ background: cfg.dot }}
                    />
                    {cfg.label}
                </div>

                {/* Gift badge */}
                {book.isGift && (
                    <div
                        className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
                        style={{
                            background: "#fce7f3",
                            color: "#9d174d",
                            border: "1px solid #fbcfe8",
                        }}
                    >
                        🎁 {t("bookDetail.badges.gift", "Hadiah")}
                    </div>
                )}

                {/* Purchased badge */}
                {!book.isGift && book.purchaseDate && (
                    <div
                        className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
                        style={{
                            background: "#d1fae5",
                            color: "#065f46",
                            border: "1px solid #6ee7b7",
                        }}
                    >
                        🛒{" "}
                        {t("bookDetail.badges.purchased", "Dibeli")}
                    </div>
                )}

                {/* Borrowed from someone badge */}
                {book.borrowedBy && (
                    <div
                        className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
                        style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fcd34d",
                        }}
                    >
                        📚{" "}
                        {t(
                            "bookDetail.badges.borrowed",
                            "Pinjaman",
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
