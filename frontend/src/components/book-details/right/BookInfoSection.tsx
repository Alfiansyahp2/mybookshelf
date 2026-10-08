import type { Book } from "../../../types";
import { useTranslation } from "react-i18next";
import { BookOpen, ShoppingBag, MapPin } from "lucide-react";

interface BookInfoSectionProps {
    book: Book;
    c0: string;
    c1: string;
}

export default function BookInfoSection({ book, c0, c1 }: BookInfoSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-2.5">
            {/* Publisher */}
            <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                    background: "rgba(255,255,255,0.7)",
                    border: `1px solid ${c0}22`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${c0}20`, color: c1 }}
                >
                    <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.info.publisher", "Penerbit")}
                    </div>
                    <div
                        className="text-sm font-medium truncate"
                        style={{ color: "#2a1a08" }}
                    >
                        {book.publisher || "—"}
                    </div>
                </div>
            </div>

            {/* ISBN */}
            <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                    background: "rgba(255,255,255,0.7)",
                    border: `1px solid ${c0}22`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${c0}20`, color: c1 }}
                >
                    <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.info.isbn", "ISBN")}
                    </div>
                    <div
                        className="text-sm font-medium truncate font-mono"
                        style={{ color: "#2a1a08" }}
                    >
                        {book.isbn || "—"}
                    </div>
                </div>
            </div>

            {/* Language */}
            <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                    background: "rgba(255,255,255,0.7)",
                    border: `1px solid ${c0}22`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${c0}20`, color: c1 }}
                >
                    <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.info.language", "Bahasa")}
                    </div>
                    <div
                        className="text-sm font-medium truncate"
                        style={{ color: "#2a1a08" }}
                    >
                        {book.language || "—"}
                    </div>
                </div>
            </div>

            {/* Purchase Info */}
            {(book.purchaseDate ||
                (book.purchasePrice !== undefined && book.purchasePrice !== null) ||
                book.purchaseLocation ||
                book.isGift) && (
                <div className="mt-3">
                    <p
                        className="text-[10px] uppercase tracking-widest px-1 mb-2"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.info.purchase_info", "Informasi Pembelian")}
                    </p>
                    <div
                        className="p-3 rounded-xl space-y-2"
                        style={{
                            background: "#fef9ec",
                            border: "1px solid #fcd34d66",
                        }}
                    >
                        {book.purchaseDate && (
                            <div className="flex justify-between items-center text-sm pb-1.5">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag
                                        className="w-3.5 h-3.5 flex-shrink-0"
                                        style={{ color: "#d97706" }}
                                    />
                                    <span style={{ color: "#9c6d3a" }}>
                                        {t("bookDetail.info.date", "Tanggal")}
                                    </span>
                                </div>
                                <span
                                    className="font-medium"
                                    style={{ color: "#2a1a08" }}
                                >
                                    {new Date(book.purchaseDate).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                        {book.purchaseLocation && (
                            <div className="flex justify-between items-center text-sm pb-1.5">
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        className="w-3.5 h-3.5 flex-shrink-0"
                                        style={{ color: "#d97706" }}
                                    />
                                    <span style={{ color: "#9c6d3a" }}>
                                        {t("bookDetail.info.location", "Tempat")}
                                    </span>
                                </div>
                                <span
                                    className="font-medium text-right max-w-[60%] truncate"
                                    style={{ color: "#2a1a08" }}
                                >
                                    {book.purchaseLocation}
                                </span>
                            </div>
                        )}
                        {book.isGift ? (
                            <div
                                className="flex justify-between items-center pt-1.5 border-t"
                                style={{ borderColor: "#fcd34d66" }}
                            >
                                <span className="text-xs" style={{ color: "#9c6d3a" }}>
                                    {t("bookDetail.info.status", "Status")}
                                </span>
                                <span
                                    className="font-bold px-2 py-0.5 rounded-full bg-[#fcd34d66]"
                                    style={{ color: "#d97706", fontSize: "10px" }}
                                >
                                    🎁 {t("bookDetail.badges.gift", "Hadiah")}
                                </span>
                            </div>
                        ) : (
                            book.purchasePrice !== undefined &&
                            book.purchasePrice !== null && (
                                <div
                                    className="flex justify-between items-center pt-1.5 border-t"
                                    style={{ borderColor: "#fcd34d66" }}
                                >
                                    <span className="text-xs" style={{ color: "#9c6d3a" }}>
                                        {t("bookDetail.info.price", "Harga")}
                                    </span>
                                    <span
                                        className="font-bold"
                                        style={{ color: "#2a1a08" }}
                                    >
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: book.purchaseCurrency || "IDR",
                                            minimumFractionDigits: 0,
                                        }).format(book.purchasePrice)}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Reading History */}
            {(book.startedDate || book.finishedDate) && (
                <div className="mt-2">
                    <p
                        className="text-[10px] uppercase tracking-widest px-1 mb-2"
                        style={{ color: "#9c6d3a" }}
                    >
                        {t("bookDetail.info.reading_history", "Riwayat Membaca")}
                    </p>
                    <div
                        className="p-3 rounded-xl space-y-1.5"
                        style={{
                            background: "rgba(255,255,255,0.7)",
                            border: `1px solid ${c0}22`,
                        }}
                    >
                        {book.startedDate && (
                            <div className="flex justify-between text-sm">
                                <span style={{ color: "#9c6d3a" }}>
                                    {t("bookDetail.info.started", "Mulai membaca")}
                                </span>
                                <span className="font-medium" style={{ color: "#2a1a08" }}>
                                    {new Date(book.startedDate).toLocaleDateString(
                                        t("locale", "id-ID")
                                    )}
                                </span>
                            </div>
                        )}
                        {book.finishedDate && (
                            <div className="flex justify-between text-sm">
                                <span style={{ color: "#9c6d3a" }}>
                                    {t("bookDetail.info.finished", "Selesai")}
                                </span>
                                <span className="font-medium" style={{ color: "#2a1a08" }}>
                                    {new Date(book.finishedDate).toLocaleDateString(
                                        t("locale", "id-ID")
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
