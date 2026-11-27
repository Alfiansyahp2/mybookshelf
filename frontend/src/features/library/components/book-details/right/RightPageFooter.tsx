import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RightPageFooterProps {
    tabIdx: number;
    totalPages: number;
    direction: number;
    c1: string;
    onPrevPage: () => void;
    onNextPage: () => void;
}

export default function RightPageFooter({
    tabIdx,
    totalPages,
    direction,
    c1,
    onPrevPage,
    onNextPage,
}: RightPageFooterProps) {
    const { t } = useTranslation();

    return (
        <div
            className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-t select-none"
            style={{ borderColor: `${c1}18` }}
        >
            <motion.button
                whileHover={{ scale: 1.15, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPrevPage}
                disabled={tabIdx === 0}
                className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0 cursor-pointer"
                title={t("bookDetail.actions.prev_page", "Halaman Sebelumnya")}
            >
                <ChevronLeft
                    className="w-4 h-4"
                    style={{ color: "#9c6d3a" }}
                />
            </motion.button>

            <span
                className="text-xs italic inline-flex items-center gap-1.5"
                style={{ color: `${c1}80`, fontFamily: "Georgia, serif" }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={tabIdx}
                        initial={{ y: direction > 0 ? 6 : -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: direction > 0 ? -6 : 6, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="font-bold inline-block"
                        style={{ color: "#2a1a08" }}
                    >
                        {tabIdx + 1}
                    </motion.span>
                </AnimatePresence>
                <span>/</span>
                <span>{totalPages}</span>
            </span>

            <motion.button
                whileHover={{ scale: 1.15, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNextPage}
                disabled={tabIdx === totalPages - 1}
                className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0 cursor-pointer"
                title={t("bookDetail.actions.next_page", "Halaman Selanjutnya")}
            >
                <ChevronRight
                    className="w-4 h-4"
                    style={{ color: "#9c6d3a" }}
                />
            </motion.button>
        </div>
    );
}
