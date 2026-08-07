import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Book } from "../../../types";

interface BookProgressLeftProps {
    book: Book;
    progress: number;
    c0: string;
    c2: string;
}

export default function BookProgressLeft({
    book,
    progress,
    c0,
    c2,
}: BookProgressLeftProps) {
    const { t } = useTranslation();

    if (book.status !== "reading" && book.status !== "finished") return null;

    const displayProgress = book.status === "finished" ? 100 : progress;
    const displayPage =
        book.status === "finished"
            ? book.pages || 0
            : book.currentPage || 0;

    return (
        <div>
            <div
                className="flex justify-between text-xs mb-1"
                style={{ color: "#9c6d3a" }}
            >
                <span>
                    {t("bookDetail.progress.label", "Progress")}
                </span>
                <span
                    className="font-bold"
                    style={{ color: "#2a1a08" }}
                >
                    {displayProgress}%
                </span>
            </div>
            <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: `${c0}30` }}
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{
                        duration: 0.9,
                        delay: 0.4,
                        ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{
                        background:
                            book.status === "finished"
                                ? `linear-gradient(90deg, #10b981, #059669)`
                                : `linear-gradient(90deg, ${c0}, ${c2})`,
                    }}
                />
            </div>
            <div
                className="flex justify-between text-[10px] mt-0.5"
                style={{ color: "#9c6d3a" }}
            >
                <span>
                    {t("bookDetail.progress.page", "Hal.")}{" "}
                    {displayPage}
                </span>
                <span>
                    {t("bookDetail.progress.of", "dari")}{" "}
                    {book.pages || "?"}
                </span>
            </div>
        </div>
    );
}
