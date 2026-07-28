import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BookOpen, Layers, Award, Settings, LogOut } from 'lucide-react'
import SearchBar from './SearchBar'
import NotificationCenter from '../NotificationCenter'
import { useLogout, useAuthUser } from '../../hooks/useAuth'

interface NavItem {
  path: string
  icon: any
  labelKey: string
}

interface AppHeaderProps {
  isHeaderVisible: boolean
  navItems: NavItem[]
  onAddShelfClick: () => void
}

export default function AppHeader({ isHeaderVisible, navItems, onAddShelfClick }: AppHeaderProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  
  const logout = useLogout()
  const { data: authData } = useAuthUser()
  const authUser = authData?.user || (authData as any)?.data
  const avatarLetter = authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'U'

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true })
      }
    })
  }

  return (
    <header
      className={`bg-cream/95 backdrop-blur-sm border-b border-walnut/10 sticky top-0 z-10 transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <motion.div 
              className="w-8 h-8 md:w-10 md:h-10 bg-walnut rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </motion.div>
            </motion.div>
            <h1 className="text-base md:text-xl font-serif font-semibold text-darkBrown hidden sm:block">
              MyBookshelf
            </h1>
          </Link>

          {/* Icon Navigation - Hide on smallest screens, show icons on larger */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-walnut text-white shadow-lg'
                        : 'text-walnut/70 hover:bg-walnut/10 hover:text-walnut'
                      }
                    `}
                    title={t(item.labelKey as any)}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* SearchBar */}
            <SearchBar />

            {/* Language Switcher */}
            <motion.button
              onClick={() => i18n.changeLanguage(i18n.language.startsWith('en') ? 'id' : 'en')}
              className="w-8 h-8 md:w-10 md:h-10 bg-walnut/10 hover:bg-walnut/20 rounded-lg md:rounded-xl flex items-center justify-center text-walnut font-bold text-xs md:text-sm transition-colors border border-transparent hover:border-walnut/20 shadow-sm mr-1"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              title={i18n.language.startsWith('en') ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {i18n.language.startsWith('en') ? 'EN' : 'ID'}
              </motion.div>
            </motion.button>

            {/* Add Bookshelf Button - Icon Only */}
            <motion.button
              onClick={onAddShelfClick}
              className="w-8 h-8 md:w-10 md:h-10 bg-walnut/80 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg border border-walnut/20"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <Layers className="w-4 h-4 md:w-5 md:h-5" />
              </motion.div>
            </motion.button>

            {/* Notification Center */}
            <div className="hidden sm:block mt-1.5">
              <NotificationCenter />
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <motion.button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-walnut to-darkBrown rounded-lg md:rounded-xl flex items-center justify-center text-white font-semibold text-xs md:text-sm relative shadow-lg"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isProfileDropdownOpen ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {avatarLetter}
                </motion.div>
              </motion.button>

              {/* Profile Dropdown Menu - Rolling Wheel Animation */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, rotate: -180, scale: 0, y: -20 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                    exit={{ opacity: 0, rotate: 180, scale: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute right-0 top-12 mt-2 w-16 bg-white rounded-3xl shadow-2xl border border-walnut/10 py-3 z-50 overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 items-center">
                      <Link
                        to="/achievements"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-walnut/70 hover:bg-walnut/10 hover:text-walnut transition-all duration-200"
                      >
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                          <Award className="w-5 h-5" />
                        </motion.div>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-walnut/70 hover:bg-walnut/10 hover:text-walnut transition-all duration-200"
                      >
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
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
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
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
  )
}
