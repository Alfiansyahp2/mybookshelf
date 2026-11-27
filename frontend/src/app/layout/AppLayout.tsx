import { useLocation, useOutlet } from "react-router-dom";
import { useState, type UIEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Library, DollarSign } from "lucide-react";
import {
    BookDetailModal,
    EditBookModal,
    EditShelfModal,
    AddShelfModal,
    useBookstore,
    useBook,
    useDeleteBook,
} from "@features/library";
import { ReadingSessionTimer } from "@features/reading";
import BookmarkHeart from "@shared/components/icons/BookmarkHeart";
import { useThemeStore } from "@shared/store/useThemeStore";
import { getAppPaletteVars } from "@shared/constants/appPalettes";
import type { Shelf } from "@shared/types";
import MobileMenu from "./MobileMenu";
import AppHeader from "./AppHeader";

const navItems = [
    { path: "/library", icon: Library, labelKey: "nav.library" },
    { path: "/reading", icon: BookOpen, labelKey: "nav.reading" },
    { path: "/wishlist", icon: BookmarkHeart, labelKey: "nav.wishlist" },
    { path: "/accounting", icon: DollarSign, labelKey: "nav.accounting" },
];

export default function AppLayout() {
    const location = useLocation();
    const currentOutlet = useOutlet();
    const {
        selectedBookId,
        isBookDetailOpen,
        closeBookDetail,
        editingShelf,
        closeEditShelf,
    } = useBookstore();
    const deleteBook = useDeleteBook();

    const { isDarkMode, lightPalette, darkPalette, toggleDarkMode } =
        useThemeStore();
    const appPaletteVars = getAppPaletteVars(
        isDarkMode,
        lightPalette,
        darkPalette,
    );

    const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
    const { data: selectedBook } = useBook(selectedBookId || "", {
        enabled: (isBookDetailOpen || isEditBookModalOpen) && !!selectedBookId,
    });

    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false);

    const handleEditBook = () => {
        setIsEditBookModalOpen(true);
    };

    const handleDeleteBook = (bookId: string) => {
        deleteBook.mutate(bookId, {
            onSuccess: () => {
                closeBookDetail();
            },
        });
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setIsHeaderVisible(false);
        } else {
            setIsHeaderVisible(true);
        }

        setIsScrolled(currentScrollY > 20);
        setLastScrollY(currentScrollY);
    };

    const handleAddShelf = (_shelf: Shelf) => {
        setIsAddShelfModalOpen(false);
    };

    return (
        <div
            className="app-layout-bg min-h-screen transition-colors duration-500 flex flex-col"
            style={appPaletteVars}
        >
            {/* Top Navigation */}
            <AppHeader
                isHeaderVisible={isHeaderVisible}
                isScrolled={isScrolled}
                navItems={navItems}
                onAddShelfClick={() => setIsAddShelfModalOpen(true)}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />

            {/* Page Content */}
            <main
                className="flex-1 relative overflow-hidden transition-colors duration-500"
                style={{ perspective: "1200px" }}
            >
                <AnimatePresence initial={false}>
                    <motion.div
                        key={location.pathname}
                        initial={{ rotateY: -90, filter: "brightness(0.2)" }}
                        animate={{ rotateY: 0, filter: "brightness(1)" }}
                        exit={{ rotateY: 90, filter: "brightness(0.2)" }}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        id="main-scroll-container"
                        onScroll={handleScroll}
                        className="w-full h-full absolute inset-0 overflow-auto"
                        style={{
                            backgroundColor: "var(--app-canvas-bg)",
                            transformOrigin: "50% 50% 50vw",
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden",
                        }}
                    >
                        {currentOutlet}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Book Detail Modal */}
            <BookDetailModal
                book={selectedBook || null}
                isOpen={isBookDetailOpen}
                onClose={closeBookDetail}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                renderSessionTab={(sessionProps) => (
                    <ReadingSessionTimer {...sessionProps} />
                )}
            />

            {/* Edit Book Modal */}
            <EditBookModal
                book={selectedBook || null}
                isOpen={isEditBookModalOpen}
                onClose={() => setIsEditBookModalOpen(false)}
                onDelete={handleDeleteBook}
            />

            {/* Edit Shelf Modal */}
            <EditShelfModal
                shelf={editingShelf}
                isOpen={!!editingShelf}
                onClose={closeEditShelf}
            />

            {isAddShelfModalOpen && (
                <AddShelfModal
                    isOpen={isAddShelfModalOpen}
                    onClose={() => setIsAddShelfModalOpen(false)}
                    onShelfAdded={handleAddShelf}
                />
            )}

            {/* Mobile Floating Action Button (FAB) Nav */}
            <MobileMenu navItems={navItems} />
        </div>
    );
}
