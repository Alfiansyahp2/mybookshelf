import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { useBooks } from "../../hooks/useBooks";
import { useBookstore } from "../../store/useBookstore";

export default function SearchBar({ isScrolled = false }: { isScrolled?: boolean }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Search results (only query when >= 2 chars)
    const { data: searchResults } = useBooks(
        searchQuery.trim().length >= 2
            ? { search: searchQuery.trim() }
            : undefined,
    );

    const searchBooks =
        searchQuery.trim().length >= 2
            ? (searchResults?.data?.data || []).slice(0, 6)
            : [];

    // Close search dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setIsSearchFocused(false);
                if (searchQuery.trim() === "") {
                    setIsExpanded(false);
                }
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [searchQuery]);

    const expandedWidth = window.innerWidth < 640 ? "180px" : "256px";

    return (
        <div ref={searchRef} className="relative flex items-center justify-end z-[70]">
            <motion.div
                initial={false}
                animate={{ width: isExpanded ? expandedWidth : "40px" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative h-10 flex items-center"
            >
                <motion.div 
                    whileHover={!isExpanded ? "hover" : ""}
                    whileTap={!isExpanded ? "tap" : ""}
                    variants={{
                        hover: { scale: 1.05 },
                        tap: { scale: 0.95 }
                    }}
                    className={`absolute inset-0 flex items-center rounded-full transition-all duration-300 ${
                        !isExpanded 
                            ? isScrolled 
                                ? "bg-cream hover:bg-walnut/10 border border-walnut/10 hover:border-walnut/20 cursor-pointer shadow-sm" 
                                : "bg-walnut/10 hover:bg-walnut/20 border border-transparent hover:border-walnut/20 cursor-pointer shadow-sm"
                            : isScrolled
                                ? "bg-white border border-walnut/10 shadow-inner"
                                : "bg-white border border-walnut/20 shadow-inner"
                    }`}
                    onClick={() => {
                        if (!isExpanded) {
                            setIsExpanded(true);
                            setTimeout(() => searchInputRef.current?.focus(), 100);
                        }
                    }}
                >
                    <div 
                        className={`absolute pointer-events-none transition-all duration-300 ${
                            isExpanded ? "left-3 top-1/2 -translate-y-1/2" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        }`}
                    >
                        <motion.div
                            variants={{
                                hover: { rotate: 360, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } }
                            }}
                        >
                            <Search className={`transition-colors duration-300 ${
                                isExpanded ? "w-4 h-4 text-walnut/50" : "w-5 h-5 text-walnut"
                            }`} />
                        </motion.div>
                    </div>
                    
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className={`w-full h-full pl-10 pr-8 bg-transparent text-sm text-darkBrown focus:outline-none rounded-full transition-opacity duration-300 ${
                            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                        placeholder=""
                    />

                    <AnimatePresence>
                        {isExpanded && searchQuery && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery("");
                                    searchInputRef.current?.focus();
                                }}
                                className="absolute right-3 text-walnut/40 hover:text-walnut/70 transition-colors leading-none"
                            >
                                ✕
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                    {isSearchFocused && searchQuery.trim().length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full mt-2 right-0 w-[85vw] sm:w-80 bg-white rounded-2xl shadow-2xl border border-walnut/10 overflow-hidden z-[80]"
                        >
                            {searchBooks.length === 0 ? (
                                <div className="p-5 text-center text-sm text-walnut/50">
                                    <Search className="w-6 h-6 mx-auto mb-2 opacity-30" />
                                    {t("search.no_results")}{" "}
                                    <strong>"{searchQuery}"</strong>
                                </div>
                            ) : (
                                <>
                                    <div className="px-3 py-2 border-b border-walnut/8">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-walnut/40">
                                            {searchBooks.length}{" "}
                                            {t("search.results_found")}
                                        </span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        {searchBooks.map((book: any) => {
                                            const SC: Record<
                                                string,
                                                {
                                                    bg: string;
                                                    color: string;
                                                    label: string;
                                                }
                                            > = {
                                                reading: {
                                                    bg: "#d1fae5",
                                                    color: "#065f46",
                                                    label: "Dibaca",
                                                },
                                                finished: {
                                                    bg: "#dbeafe",
                                                    color: "#1e40af",
                                                    label: "Selesai",
                                                },
                                                unread: {
                                                    bg: "#f3f4f6",
                                                    color: "#374151",
                                                    label: "Belum",
                                                },
                                                wishlist: {
                                                    bg: "#f3e8ff",
                                                    color: "#6b21a8",
                                                    label: "Wishlist",
                                                },
                                                borrowed: {
                                                    bg: "#fef3c7",
                                                    color: "#92400e",
                                                    label: "Pinjam",
                                                },
                                            };
                                            const sc =
                                                SC[book.status] || SC["unread"];
                                            const c0 =
                                                book.spineColors?.[0] ||
                                                "#8B7355";
                                            const c2 =
                                                book.spineColors?.[2] ||
                                                "#5C4532";
                                            return (
                                                <button
                                                    key={book.id}
                                                    onClick={() => {
                                                        setIsSearchFocused(
                                                            false,
                                                        );
                                                        setSearchQuery("");
                                                        setIsExpanded(
                                                            false,
                                                        );
                                                        navigate("/library");
                                                        setTimeout(() => {
                                                            const store =
                                                                useBookstore.getState();
                                                            store.setSelectedBookId(
                                                                book.id,
                                                            );
                                                            store.toggleBookDetail(
                                                                book.id,
                                                            );
                                                        }, 200);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-walnut/5 transition-colors text-left border-b border-walnut/5 last:border-0"
                                                >
                                                    <div
                                                        className="flex-shrink-0 w-8 h-11 rounded-sm shadow-sm"
                                                        style={{
                                                            background: `linear-gradient(150deg, ${c0}, ${c2})`,
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-darkBrown truncate leading-tight">
                                                            {book.title}
                                                        </p>
                                                        <p className="text-xs text-walnut/60 italic truncate">
                                                            {book.author}
                                                        </p>
                                                        {book.genre && (
                                                            <p className="text-[10px] text-walnut/40 truncate mt-0.5">
                                                                {book.genre}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span
                                                        className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                                        style={{
                                                            background: sc.bg,
                                                            color: sc.color,
                                                        }}
                                                    >
                                                        {sc.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="border-t border-walnut/8 p-2">
                                        <button
                                            onClick={() => {
                                                navigate(
                                                    `/library?search=${encodeURIComponent(searchQuery)}`,
                                                );
                                                setIsSearchFocused(false);
                                                setSearchQuery("");
                                                setIsExpanded(false);
                                            }}
                                            className="w-full text-center text-xs text-walnut/60 hover:text-walnut py-1 transition-colors"
                                        >
                                            {t("search.view_all")}
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
