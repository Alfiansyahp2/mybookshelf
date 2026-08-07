import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCreateBook } from "../../hooks/useBooks";
import BookBasicInfoInput from "../book-form/BookBasicInfoInput";
import { useTranslation } from "react-i18next";

interface AddWishlistBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddWishlistBookModal({
    isOpen,
    onClose,
}: AddWishlistBookModalProps) {
    const { t } = useTranslation();
    const createBook = useCreateBook();

    useEffect(() => {
        const mainContainer = document.getElementById("main-scroll-container");
        if (!mainContainer) return;

        if (isOpen) {
            mainContainer.style.overflow = "hidden";
        } else {
            mainContainer.style.overflow = "auto";
        }
        return () => {
            mainContainer.style.overflow = "auto";
        };
    }, [isOpen]);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        genres: [] as string[],
        language: "Indonesian",
        publisher: "",
        publishYear: new Date().getFullYear().toString(),
        pages: "0",
        format: "paperback",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create book object for API
        const bookData = {
            title: formData.title,
            author: formData.author,
            shelfId: undefined, // Wishlist books typically don't have a shelf
            status: "wishlist" as const,
            pages: formData.pages ? parseInt(formData.pages) : 0,
            currentPage: 0,
            isbn: formData.isbn,
            genre: formData.genres.join(", "),
            language: formData.language,
            publisher: formData.publisher,
            publishYear: formData.publishYear
                ? parseInt(formData.publishYear)
                : undefined,
            format: formData.format as any,

            // Default appearance since wishlist doesn't require complex customization initially
            height: "medium" as any,
            thickness: "regular" as any,
            spineColors: ["#8B7355", "#6B5344", "#5C4532"] as [
                string,
                string,
                string,
            ],
        };

        createBook.mutate(bookData);
        onClose();

        // Reset form
        setFormData({
            title: "",
            author: "",
            isbn: "",
            genres: [],
            language: "Indonesian",
            publisher: "",
            publishYear: new Date().getFullYear().toString(),
            pages: "0",
            format: "paperback",
        });
    };

    if (!isOpen) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 20,
                                stiffness: 300,
                            }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-walnut/10 bg-gradient-to-r from-walnut/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-walnut/10 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-walnut" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-serif font-semibold text-darkBrown">
                                            {t("add_book.title")} to Wishlist
                                        </h2>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 bg-walnut/10 hover:bg-walnut/20 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-walnut" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <form
                                    id="add-wishlist-book-form"
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <BookBasicInfoInput
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-walnut/10 bg-cream/30">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-white border border-walnut/20 rounded-xl text-sm font-medium text-walnut hover:bg-walnut/5 transition-colors"
                                >
                                    {t("add_book.cancel")}
                                </button>
                                <button
                                    form="add-wishlist-book-form"
                                    type="submit"
                                    disabled={createBook.isPending}
                                    className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createBook.isPending ? (
                                        <>{t("add_book.saving")}</>
                                    ) : (
                                        <>
                                            <BookOpen className="w-4 h-4" />
                                            {t("add_book.save")}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
