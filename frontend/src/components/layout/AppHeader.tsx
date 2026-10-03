import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookOpen, Layers, Award, Settings, LogOut, Moon, Sun, Globe } from "lucide-react";
import SearchBar from "./SearchBar";
import NotificationCenter from "./NotificationCenter";
import { useLogout, useAuthUser } from "../../hooks/useAuth";

interface NavItem {
    path: string;
    icon: any;
    labelKey: string;
}

interface AppHeaderProps {
    isHeaderVisible: boolean;
    isScrolled: boolean;
    navItems: NavItem[];
    onAddShelfClick: () => void;
    isDarkMode?: boolean;
    toggleDarkMode?: () => void;
}

export default function AppHeader({
    isHeaderVisible,
    isScrolled,
    navItems,
    onAddShelfClick,
    isDarkMode = false,
    toggleDarkMode = () => {},
}: AppHeaderProps) {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const logout = useLogout();
    const { data: authData } = useAuthUser();
    const authUser = authData?.user || (authData as any)?.data;
    const avatarLetter = authUser?.name
        ? authUser.name.charAt(0).toUpperCase()
        : "U";

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    
    console.log("[DarkMode] AppHeader rendered. Current isDarkMode prop:", isDarkMode);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout.mutate(undefined, {
            onSuccess: () => {
                navigate("/login", { replace: true });
            },
        });
    };

    return (
        <header
            className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out pt-1.5 pb-1.5 ${
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            } ${
                isScrolled 
                    ? "px-2 sm:px-4 md:px-8 mt-1 sm:mt-2" 
                    : "px-0 mt-0"
            }`}
        >
            <div 
                className={`transition-all duration-500 ease-in-out mx-auto ${
                    isScrolled 
                        ? "bg-white/95 dark:bg-[#1a1612]/95 backdrop-blur-md rounded-2xl md:rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-walnut/10 dark:border-walnut/20 py-1.5 sm:py-2 px-3 sm:px-6 max-w-6xl" 
                        : "bg-transparent py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-8 w-full max-w-none"
                }`}
            >
                <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
                    {/* Logo & Brand */}
                    <Link to="/dashboard" className="flex items-center gap-2 md:gap-3 shrink-0 group">
                        <motion.div
                            className="w-8 h-8 md:w-10 md:h-10 bg-walnut rounded-lg md:rounded-xl flex items-center justify-center transition-colors duration-300 shadow-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.34, 1.56, 0.64, 1],
                                }}
                            >
                                <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </motion.div>
                        </motion.div>
                        <h1 className="text-sm sm:text-base md:text-xl font-serif font-bold text-darkBrown dark:text-cream transition-colors duration-300 tracking-tight">
                            A'Bookshelf
                        </h1>
                    </Link>

                    {/* Icon Navigation - Desktop only */}
                    <nav className="hidden md:flex items-center gap-1 md:gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <motion.div
                                    key={item.path}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`
                                            w-10 h-10 flex items-center justify-center transition-all duration-300
                                            ${
                                                isScrolled
                                                    ? isActive 
                                                        ? "bg-walnut text-white shadow-md rounded-full" 
                                                        : "text-walnut/70 hover:text-walnut hover:bg-walnut/10 rounded-full"
                                                    : isActive
                                                        ? "bg-walnut text-white shadow-md rounded-xl"
                                                        : "text-walnut/70 hover:bg-walnut/10 hover:text-walnut rounded-xl"
                                            }
                                        `}
                                        title={t(item.labelKey as any)}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{
                                                duration: 0.6,
                                                ease: [0.34, 1.56, 0.64, 1],
                                            }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Right Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
                        {/* SearchBar */}
                        <SearchBar isScrolled={isScrolled} />

                        {/* Language Switcher - visible on tablet/desktop, in menu on mobile */}
                        <motion.button
                            onClick={() =>
                                i18n.changeLanguage(
                                    i18n.language.startsWith("en")
                                        ? "id"
                                        : "en",
                                )
                            }
                            className={`hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl items-center justify-center font-bold text-xs md:text-sm transition-colors border shadow-xs ${
                                isScrolled 
                                    ? "bg-cream hover:bg-walnut/10 text-walnut border-walnut/10 hover:border-walnut/20 rounded-full" 
                                    : "bg-walnut/10 hover:bg-walnut/20 text-walnut border-transparent hover:border-walnut/20"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            title={
                                i18n.language.startsWith("en")
                                    ? "Ganti ke Bahasa Indonesia"
                                    : "Switch to English"
                            }
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.34, 1.56, 0.64, 1],
                                }}
                            >
                                {i18n.language.startsWith("en") ? "EN" : "ID"}
                            </motion.div>
                        </motion.button>

                        {/* Add Bookshelf Button - visible on tablet/desktop, in menu on mobile */}
                        <motion.button
                            onClick={onAddShelfClick}
                            className={`hidden sm:flex w-8 h-8 md:w-10 md:h-10 backdrop-blur-md items-center justify-center text-white shadow-xs border transition-all duration-300 ${
                                isScrolled ? "bg-walnut hover:bg-darkBrown rounded-full border-walnut/20" : "bg-walnut/80 border-walnut/20 hover:bg-walnut rounded-lg md:rounded-xl"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            title={t("shelf.add_shelf", "Tambah Rak")}
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.34, 1.56, 0.64, 1],
                                }}
                            >
                                <Layers className="w-4 h-4 md:w-5 md:h-5" />
                            </motion.div>
                        </motion.button>

                        {/* Dark Mode Toggle */}
                        <motion.button
                            onClick={toggleDarkMode}
                            className={`header-icon-btn w-8 h-8 md:w-10 md:h-10 backdrop-blur-md flex items-center justify-center shadow-xs border transition-all duration-300 ${
                                isScrolled 
                                    ? "bg-cream hover:bg-walnut/10 text-walnut border-walnut/10 hover:border-walnut/20 rounded-full" 
                                    : "bg-walnut/10 hover:bg-walnut/20 text-walnut border-transparent hover:border-walnut/20 rounded-lg md:rounded-xl"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
                        >
                            <motion.div
                                animate={{ rotate: isDarkMode ? 360 : 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {isDarkMode ? (
                                    <Sun className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                                ) : (
                                    <Moon className="w-4 h-4 md:w-5 md:h-5" />
                                )}
                            </motion.div>
                        </motion.button>

                        {/* Notification Center */}
                        <div className="flex items-center">
                            <NotificationCenter isScrolled={isScrolled} />
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <motion.button
                                onClick={() =>
                                    setIsProfileDropdownOpen(
                                        !isProfileDropdownOpen,
                                    )
                                }
                                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white font-semibold text-xs md:text-sm relative shadow-md transition-all duration-300 bg-gradient-to-br from-walnut to-darkBrown ${
                                    isScrolled ? "rounded-full border border-walnut/20 hover:shadow-lg" : "rounded-lg md:rounded-xl"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    scale: isProfileDropdownOpen ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.34, 1.56, 0.64, 1],
                                    }}
                                >
                                    {avatarLetter}
                                </motion.div>
                            </motion.button>

                            {/* Profile Dropdown Menu - Rich Card */}
                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 top-full mt-2.5 w-64 sm:w-72 bg-white/95 dark:bg-[#201a14]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-walnut/15 dark:border-walnut/30 p-3 z-50 overflow-hidden flex flex-col text-darkBrown dark:text-cream"
                                    >
                                        {/* User Info Header */}
                                        <div className="flex items-center gap-3 p-2 rounded-xl bg-walnut/5 dark:bg-walnut/15 mb-1">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-walnut to-darkBrown text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                                                {avatarLetter}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-serif font-bold text-sm text-darkBrown dark:text-cream truncate leading-tight">
                                                    {authUser?.name || "Pembaca"}
                                                </p>
                                                <p className="text-xs text-walnut/60 dark:text-cream/50 truncate">
                                                    {authUser?.email || "Akun Buku"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Actions (especially for mobile where tucked from top bar) */}
                                        <div className="flex flex-col gap-1 py-1">
                                            {/* Language Switch */}
                                            <button
                                                onClick={() => {
                                                    i18n.changeLanguage(
                                                        i18n.language.startsWith("en") ? "id" : "en"
                                                    );
                                                }}
                                                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-walnut/10 dark:hover:bg-walnut/20 transition-colors text-xs sm:text-sm font-medium"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Globe className="w-4 h-4 text-walnut dark:text-cream" />
                                                    <span>{t("nav.language", "Bahasa")}</span>
                                                </div>
                                                <span className="px-2 py-0.5 rounded-md bg-walnut/15 dark:bg-walnut/30 text-xs font-bold text-walnut dark:text-cream">
                                                    {i18n.language.startsWith("en") ? "English" : "Indonesia"}
                                                </span>
                                            </button>

                                            {/* Add Shelf */}
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    onAddShelfClick();
                                                }}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-walnut/10 dark:hover:bg-walnut/20 transition-colors text-xs sm:text-sm font-medium text-left"
                                            >
                                                <Layers className="w-4 h-4 text-walnut dark:text-cream" />
                                                <span>{t("shelf.add_shelf", "Tambah Rak Baru")}</span>
                                            </button>
                                        </div>

                                        <div className="h-px bg-walnut/10 dark:bg-walnut/20 my-1" />

                                        {/* Navigation Links */}
                                        <div className="flex flex-col gap-1">
                                            <Link
                                                to="/achievements"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-walnut/10 dark:hover:bg-walnut/20 transition-colors text-xs sm:text-sm font-medium"
                                            >
                                                <Award className="w-4 h-4 text-walnut dark:text-cream" />
                                                <span>{t("achievements.title", "Pencapaian")}</span>
                                            </Link>

                                            <Link
                                                to="/settings"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-walnut/10 dark:hover:bg-walnut/20 transition-colors text-xs sm:text-sm font-medium"
                                            >
                                                <Settings className="w-4 h-4 text-walnut dark:text-cream" />
                                                <span>{t("settings.title", "Pengaturan")}</span>
                                            </Link>
                                        </div>

                                        <div className="h-px bg-walnut/10 dark:bg-walnut/20 my-1" />

                                        {/* Logout Button */}
                                        <button
                                            onClick={handleLogout}
                                            disabled={logout.isPending}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors text-xs sm:text-sm font-semibold disabled:opacity-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>{logout.isPending ? "Keluar..." : t("auth.logout", "Keluar")}</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
