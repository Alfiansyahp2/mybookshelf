import {
    Outlet,
    Link,
    useLocation,
    useNavigate,
    useOutlet,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    BookOpen,
    Library,
    ShoppingCart,
    Settings,
    Search,
    Bell,
    Layers,
    LogOut,
    Award,
    LayoutDashboard,
    DollarSign,
    Menu,
    X,
} from "lucide-react";
import BookDetailModal from "./modals/BookDetailModal";
import EditBookModal from "./modals/EditBookModal";
import EditShelfModal from "./modals/EditShelfModal";
import AddShelfModal from "./modals/AddShelfModal";
import { useBookstore } from "../store/useBookstore";
import { useBook, useDeleteBook, useBooks } from "../hooks/useBooks";
import { useDeleteShelf, useShelves } from "../hooks/useShelves";
import BookmarkHeart from "./icons/BookmarkHeart";
import MobileMenu from "./layout/MobileMenu";
import AppHeader from "./layout/AppHeader";

const navItems = [
    { path: "/library", icon: Library, labelKey: "nav.library" },
    { path: "/reading", icon: BookOpen, labelKey: "nav.reading" },
    { path: "/wishlist", icon: BookmarkHeart, labelKey: "nav.wishlist" },
    { path: "/accounting", icon: DollarSign, labelKey: "nav.accounting" },
];

export default function AppLayout() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const currentOutlet = useOutlet();
    const { selectedBookId, isBookDetailOpen, closeBookDetail } =
        useBookstore();
    const deleteBook = useDeleteBook();
    const deleteShelf = useDeleteShelf();

    // Get shelves data for edit functionality
    const { data: shelves } = useShelves();

    // Get selected book details for animation
    const { data: selectedBook } = useBook(selectedBookId || "");

    // Initialize background achievement tracking
    useAchievementTracker();

    // Modal states
    const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
    const [isEditShelfModalOpen, setIsEditShelfModalOpen] = useState(false);
    const [selectedShelfForEdit, setSelectedShelfForEdit] = useState<any>(null);

    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false);

    // Handlers
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

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide header when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsHeaderVisible(false);
            } else {
                setIsHeaderVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleAddShelf = (shelf: any) => {
        console.log("New shelf added:", shelf);
        setIsAddShelfModalOpen(false);
    };

    const handleEditShelf = (shelfId: string) => {
        const shelf = shelves?.find((s) => s.id === shelfId);
        if (shelf) {
            setSelectedShelfForEdit(shelf);
            setIsEditShelfModalOpen(true);
        }
    };

    const handleDeleteShelf = (shelfId: string) => {
        deleteShelf.mutate(shelfId);
    };

    // Listen for custom edit shelf event from child components
    useEffect(() => {
        const handleEditShelfEvent = (event: any) => {
            handleEditShelf(event.detail.shelfId);
        };

        const handleDeleteShelfEvent = (event: any) => {
            handleDeleteShelf(event.detail.shelfId);
        };

        window.addEventListener("editShelf", handleEditShelfEvent);
        window.addEventListener("deleteShelf", handleDeleteShelfEvent);

        return () => {
            window.removeEventListener("editShelf", handleEditShelfEvent);
            window.removeEventListener("deleteShelf", handleDeleteShelfEvent);
        };
    }, [handleEditShelf, handleDeleteShelf]);

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Top Navigation */}
            <AppHeader
                isHeaderVisible={isHeaderVisible}
                navItems={navItems}
                onAddShelfClick={() => setIsAddShelfModalOpen(true)}
            />

            {/* Page Content */}
            <main
                className="flex-1 relative overflow-hidden bg-black"
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
                        className="w-full h-full absolute inset-0 overflow-auto bg-cream"
                        style={{
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
                shelf={selectedShelfForEdit}
                isOpen={isEditShelfModalOpen}
                onClose={() => setIsEditShelfModalOpen(false)}
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
