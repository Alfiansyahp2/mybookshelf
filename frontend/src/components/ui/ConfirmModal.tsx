import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    isDanger = true,
}: ConfirmModalProps) {
    const { t } = useTranslation();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <div className="flex flex-col items-center text-center px-2 py-4">
                <div 
                    className={`p-4 rounded-full mb-5 ${
                        isDanger ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}
                >
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-darkBrown mb-3">
                    {title}
                </h3>
                <p className="text-sm text-walnut/80 mb-8 px-4 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors bg-walnut/10 hover:bg-walnut/20 text-darkBrown"
                    >
                        {cancelText || t("common.cancel", "Batal")}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors text-white ${
                            isDanger 
                                ? "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20" 
                                : "bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                        }`}
                    >
                        {confirmText || t("common.confirm", "Ya")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
