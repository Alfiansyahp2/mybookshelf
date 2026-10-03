import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface DeleteShelfModalProps {
    isOpen: boolean;
    shelfName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteShelfModal: React.FC<DeleteShelfModalProps> = React.memo(
    function DeleteShelfModal({ isOpen, shelfName, onClose, onConfirm }) {
        const { t } = useTranslation();

        return (
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                            style={{
                                background: "rgba(10,5,0,0.6)",
                                backdropFilter: "blur(4px)",
                            }}
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -10 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                            className="relative rounded-2xl shadow-2xl p-6 max-w-sm w-full"
                            style={{
                                background: "#fef9ec",
                                border: "1px solid #fcd34d66",
                            }}
                        >
                            <h3
                                className="text-lg font-bold mb-2"
                                style={{ color: "#2a1a08" }}
                            >
                                {t("shelf.delete_title")}
                            </h3>
                            <p
                                className="text-sm mb-6"
                                style={{ color: "#6b4c2a" }}
                            >
                                {t("shelf.delete_confirm_1")}{" "}
                                <strong>"{shelfName}"</strong>?{" "}
                                {t("shelf.delete_confirm_2")}
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-black/5"
                                    style={{ color: "#6b4c2a" }}
                                >
                                    {t("shelf.cancel")}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-md shadow-red-500/20"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #ef4444, #dc2626)",
                                    }}
                                >
                                    {t("shelf.delete")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    }
);
