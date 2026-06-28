import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Library,
  ShoppingCart,
  Settings,
  Search,
  Bell,
  Layers,
  LogOut,
  Award
} from 'lucide-react'
import BookDetailModal from './modals/BookDetailModal'
import EditBookModal from './modals/EditBookModal'
import EditShelfModal from './modals/EditShelfModal'
import AddShelfModal from './modals/AddShelfModal'
import { useBookstore } from '../store/useBookstore'
import { useLogout } from '../hooks/useAuth'
import { useBook, useDeleteBook } from '../hooks/useBooks'
import { useDeleteShelf, useShelves } from '../hooks/useShelves'

const navItems = [
  { path: '/library', icon: Library, label: 'My Library' },
  { path: '/reading', icon: BookOpen, label: 'Reading' },
  { path: '/wishlist', icon: ShoppingCart, label: 'Wishlist' },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { selectedBookId, isBookDetailOpen, closeBookDetail } = useBookstore()
  const logout = useLogout()
  const deleteBook = useDeleteBook()
  const deleteShelf = useDeleteShelf()

  // Get shelves data for edit functionality
  const { data: shelves } = useShelves()

  // Get selected book details for animation
  const { data: selectedBook } = useBook(selectedBookId || '')

  // Modal states
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false)
  const [isEditShelfModalOpen, setIsEditShelfModalOpen] = useState(false)
  const [selectedShelfForEdit, setSelectedShelfForEdit] = useState<any>(null)

  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Handlers
  const handleEditBook = () => {
    setIsEditBookModalOpen(true)
  }

  const handleDeleteBook = (bookId: string) => {
    deleteBook.mutate(bookId, {
      onSuccess: () => {
        closeBookDetail()
      }
    })
  }

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddShelf = (shelf: any) => {
    console.log('New shelf added:', shelf)
    setIsAddShelfModalOpen(false)
  }

  const handleEditShelf = (shelfId: string) => {
    const shelf = shelves?.find(s => s.id === shelfId)
    if (shelf) {
      setSelectedShelfForEdit(shelf)
      setIsEditShelfModalOpen(true)
    }
  }

  const handleDeleteShelf = (shelfId: string) => {
    deleteShelf.mutate(shelfId)
  }

  // Listen for custom edit shelf event from child components
  useEffect(() => {
    const handleEditShelfEvent = (event: any) => {
      handleEditShelf(event.detail.shelfId)
    }

    const handleDeleteShelfEvent = (event: any) => {
      handleDeleteShelf(event.detail.shelfId)
    }

    window.addEventListener('editShelf', handleEditShelfEvent)
    window.addEventListener('deleteShelf', handleDeleteShelfEvent)

    return () => {
      window.removeEventListener('editShelf', handleEditShelfEvent)
      window.removeEventListener('deleteShelf', handleDeleteShelfEvent)
    }
  }, [handleEditShelf, handleDeleteShelf])

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true })
      }
    })
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top Navigation */}
      <header
        className={`bg-cream/95 backdrop-blur-sm border-b border-walnut/10 sticky top-0 z-10 transition-transform duration-300 ease-in-out ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-walnut rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
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
                      title={item.label}
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
              {/* Search - Hide on small screens */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-walnut/50" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 md:w-64 pl-10 pr-4 py-2 md:py-2.5 bg-white border border-walnut/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                />
              </div>

              {/* Add Bookshelf Button - Icon Only */}
              <motion.button
                onClick={() => setIsAddShelfModalOpen(true)}
                className="w-10 h-10 bg-walnut text-white rounded-xl flex items-center justify-center hover:bg-darkBrown transition-colors relative shadow-lg"
                title="Add Bookshelf"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Layers className="w-5 h-5" />
                </motion.div>
              </motion.button>

              {/* Notifications - Hide on smallest screens */}
              <motion.button
                className="hidden sm:flex relative w-10 h-10 bg-white border border-walnut/20 rounded-xl items-center justify-center hover:border-walnut/40 transition-colors shadow-sm"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Bell className="w-5 h-5 text-walnut" />
                </motion.div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <motion.button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-walnut to-darkBrown rounded-xl flex items-center justify-center text-white font-semibold text-xs md:text-sm relative shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    rotate: isProfileDropdownOpen ? 360 : 0,
                    scale: isProfileDropdownOpen ? 1.1 : 1
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: isProfileDropdownOpen ? -360 : 0
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                  >
                    U
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
                        y: -20
                      }}
                      animate={{
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                        y: 0
                      }}
                      exit={{
                        opacity: 0,
                        rotate: 180,
                        scale: 0,
                        y: -20
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="absolute right-0 top-12 mt-2 w-16 bg-white rounded-3xl shadow-2xl border border-walnut/10 py-3 z-50 overflow-hidden"
                    >
                      {/* Icon-only circular menu items */}
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

          {/* Mobile Navigation - Show only on small screens */}
          <nav className="flex md:hidden items-center justify-between mt-3 pt-3 border-t border-walnut/10 overflow-x-auto">
            {navItems.slice(0, 6).map((item) => {
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
                      min-w-[60px] flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-walnut/10 text-walnut'
                        : 'text-walnut/60 hover:bg-walnut/5 hover:text-walnut'
                      }
                    `}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
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

      {/* Add Shelf Modal */}
      <AddShelfModal
        isOpen={isAddShelfModalOpen}
        onClose={() => setIsAddShelfModalOpen(false)}
        onShelfAdded={handleAddShelf}
      />
    </div>
  )
}
