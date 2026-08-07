import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookOpen, Layers, Award, Settings, LogOut, Moon, Sun } from "lucide-react";
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
            className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out pt-2 pb-2 ${
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            } ${
                isScrolled 
                    ? "px-4 md:px-8 mt-2" 
                    : "px-0 mt-0"
            }`}
        >
            <div 
                className={`transition-all duration-500 ease-in-out mx-auto ${
                    isScrolled 
                        ? "bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-walnut/10 py-2 px-6 max-w-6xl" 
                        : "bg-transparent py-3 md:py-4 px-4 md:px-8 w-full max-w-none"
                }`}
            >
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 md:gap-3">
                        <motion.div
                            className="w-8 h-8 md:w-10 md:h-10 bg-walnut rounded-lg flex items-center justify-center transition-colors duration-300"
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
                                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
                            </motion.div>
                        </motion.div>
                        <h1 className="text-base md:text-xl font-serif font-semibold text-darkBrown hidden sm:block transition-colors duration-300">
                            MyBookshelf
                        </h1>
                    </Link>

                    {/* Icon Navigation - Hide on smallest screens, show icons on larger */}
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
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* SearchBar */}
                        <SearchBar isScrolled={isScrolled} />

                        {/* Language Switcher */}
                        <motion.button
                            onClick={() =>
                                i18n.changeLanguage(
                                    i18n.language.startsWith("en")
                                        ? "id"
                                        : "en",
                                )
                            }
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-xs md:text-sm transition-colors border shadow-sm mr-1 ${
                                isScrolled 
                                    ? "bg-cream hover:bg-walnut/10 text-walnut border-walnut/10 hover:border-walnut/20 rounded-full" 
                                    : "bg-walnut/10 hover:bg-walnut/20 text-walnut border-transparent hover:border-walnut/20"
                            }`}
                            whileHover={{ scale: 1.15 }}
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

                        {/* Add Bookshelf Button - Icon Only */}
                        <motion.button
                            onClick={onAddShelfClick}
                            className={`w-8 h-8 md:w-10 md:h-10 backdrop-blur-md flex items-center justify-center text-white shadow-lg border transition-all duration-300 ${
                                isScrolled ? "bg-walnut hover:bg-darkBrown rounded-full border-walnut/20" : "bg-walnut/80 border-walnut/20 hover:bg-walnut rounded-lg md:rounded-xl"
                            }`}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            title="Add Shelf"
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
                            onClick={() => {
                                console.log("[DarkMode] Toggle clicked! Triggering toggleDarkMode()...");
                                toggleDarkMode();
                            }}
                            className={`header-icon-btn w-8 h-8 md:w-10 md:h-10 backdrop-blur-md flex items-center justify-center shadow-sm border transition-all duration-300 ${
                                isScrolled 
                                    ? "bg-cream hover:bg-walnut/10 text-walnut border-walnut/10 hover:border-walnut/20 rounded-full" 
                                    : "bg-walnut/10 hover:bg-walnut/20 text-walnut border-transparent hover:border-walnut/20 rounded-lg md:rounded-xl"
                            }`}
                            whileHover={{ scale: 1.15 }}
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
                        <div className="mt-1.5">
                            <NotificationCenter />
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <motion.button
                                onClick={() =>
                                    setIsProfileDropdownOpen(
                                        !isProfileDropdownOpen,
                                    )
                                }
                                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white font-semibold text-xs md:text-sm relative shadow-lg transition-all duration-300 bg-gradient-to-br from-walnut to-darkBrown ${
                                    isScrolled ? "rounded-full border border-walnut/20 hover:shadow-xl" : "rounded-lg md:rounded-xl"
                                }`}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    scale: isProfileDropdownOpen ? 1.1 : 1,
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

                            {/* Profile Dropdown Menu - Rolling Wheel Animation */}
                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            rotate: -180,
                                            scale: 0,
                                            y: -20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            rotate: 0,
                                            scale: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            rotate: 180,
                                            scale: 0,
                                            y: -20,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.34, 1.56, 0.64, 1],
                                        }}
                                        className="absolute right-0 top-12 mt-2 w-16 bg-white rounded-3xl shadow-2xl border border-walnut/10 py-3 z-50 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1 items-center">
                                            <Link
                                                to="/achievements"
                                                onClick={() =>
                                                    setIsProfileDropdownOpen(
                                                        false,
                                                    )
                                                }
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-walnut/70 hover:bg-walnut/10 hover:text-walnut transition-all duration-200"
                                            >
                                                <motion.div
                                                    whileHover={{
                                                        rotate: 360,
                                                        scale: 1.1,
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        ease: [
                                                            0.34, 1.56, 0.64, 1,
                                                        ],
                                                    }}
                                                >
                                                    <Award className="w-5 h-5" />
                                                </motion.div>
                                            </Link>

                                            <Link
                                                to="/settings"
                                                onClick={() =>
                                                    setIsProfileDropdownOpen(
                                                        false,
                                                    )
                                                }
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-walnut/70 hover:bg-walnut/10 hover:text-walnut transition-all duration-200"
                                            >
                                                <motion.div
                                                    whileHover={{
                                                        rotate: 360,
                                                        scale: 1.1,
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        ease: [
                                                            0.34, 1.56, 0.64, 1,
                                                        ],
                                                    }}
                                                >
                                                    <Settings className="w-5 h-5" />
                                                </motion.div>
                                            </Link>

                                            <div className="w-12 h-px bg-walnut/20 my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                disabled={logout.isPending}
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                                            >
                                                <motion.div
                                                    whileHover={{
                                                        rotate: 360,
                                                        scale: 1.1,
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        ease: [
                                                            0.34, 1.56, 0.64, 1,
                                                        ],
                                                    }}
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                </motion.div>
                                            </button>
                                        </div>
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
