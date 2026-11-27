import { useState, useRef, useEffect, type ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavItem {
    path: string;
    icon: ComponentType<{ className?: string }>;
    labelKey: string;
}

interface MobileMenuProps {
    navItems: NavItem[];
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="md:hidden fixed bottom-6 right-6 z-[60]"
            ref={mobileMenuRef}
        >
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="absolute bottom-16 right-0 mb-4 bg-surface/95 backdrop-blur-md rounded-full shadow-2xl border border-walnut/20 p-1.5 flex flex-col gap-1.5"
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                                        isActive
                                            ? "bg-walnut/15 text-walnut dark:text-gold"
                                            : "text-walnut/75 dark:text-cream/75 hover:bg-walnut/10 hover:text-walnut dark:hover:text-gold"
                                    }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${isActive ? "fill-walnut/10" : ""}`}
                                    />
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-14 h-14 bg-walnut text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-darkBrown transition-colors"
            >
                <motion.div
                    animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                    transition={{ type: "spring", damping: 20 }}
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </motion.div>
            </motion.button>
        </div>
    );
}
