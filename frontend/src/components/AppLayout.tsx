import { Outlet, Link, useLocation, useNavigate, useOutlet } from 'react-router-dom'
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
  Award,
  LayoutDashboard,
  DollarSign,
  Menu,
  X
} from 'lucide-react'
import BookDetailModal from './modals/BookDetailModal'
import EditBookModal from './modals/EditBookModal'
import EditShelfModal from './modals/EditShelfModal'
import AddShelfModal from './modals/AddShelfModal'
import { useBookstore } from '../store/useBookstore'
import { useLogout, useAuthUser } from '../hooks/useAuth'
import { useBook, useDeleteBook, useBooks } from '../hooks/useBooks'
import { useDeleteShelf, useShelves } from '../hooks/useShelves'
import NotificationCenter from './NotificationCenter'
import { useAchievementTracker } from '../hooks/useAchievementTracker'

const navItems = [
  { path: '/library', icon: Library, label: 'My Library' },
  { path: '/reading', icon: BookOpen, label: 'Reading' },
  { path: '/wishlist', icon: ShoppingCart, label: 'Wishlist' },
  { path: '/accounting', icon: DollarSign, label: 'Accounting' },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentOutlet = useOutlet()
  const { selectedBookId, isBookDetailOpen, closeBookDetail } = useBookstore()
  const logout = useLogout()
  const deleteBook = useDeleteBook()
  const deleteShelf = useDeleteShelf()
  const { data: authData } = useAuthUser()
  const authUser = authData?.user || (authData as any)?.data
  const avatarLetter = authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'U'

  // Get shelves data for edit functionality
  const { data: shelves } = useShelves()

  // Get selected book details for animation
  const { data: selectedBook } = useBook(selectedBookId || '')

  // Initialize background achievement tracking
  useAchievementTracker()

  // Modal states
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false)
  const [isEditShelfModalOpen, setIsEditShelfModalOpen] = useState(false)
  const [selectedShelfForEdit, setSelectedShelfForEdit] = useState<any>(null)

  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  // Search results (only query when >= 2 chars)
  const { data: searchResults } = useBooks(
    searchQuery.trim().length >= 2 ? { search: searchQuery.trim() } : undefined
  )
  const searchBooks = searchQuery.trim().length >= 2
    ? (searchResults?.data?.data || []).slice(0, 6)
    : []

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
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
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl text-walnut/70 hover:bg-walnut/10 hover:text-walnut transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search - Live with dropdown */}
              <div 
                ref={searchRef}
                className={`
                  absolute sm:relative inset-x-4 top-14 sm:inset-auto sm:top-auto z-[70] sm:z-auto
                  ${isMobileSearchOpen ? 'block' : 'hidden'} sm:block
                `}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-walnut/50 pointer-events-none z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full sm:w-48 md:w-64 pl-10 pr-7 py-2.5 bg-white border border-walnut/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 shadow-lg sm:shadow-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); searchInputRef.current?.focus() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-walnut/40 hover:text-walnut/70 transition-colors leading-none"
                  >✕</button>
                )}

                <AnimatePresence>
                  {isSearchFocused && searchQuery.trim().length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-80 bg-white rounded-2xl shadow-2xl border border-walnut/10 overflow-hidden z-[80]"
                    >
                      {searchBooks.length === 0 ? (
                        <div className="p-5 text-center text-sm text-walnut/50">
                          <Search className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          Tidak ada hasil untuk <strong>"{searchQuery}"</strong>
                        </div>
                      ) : (
                        <>
                          <div className="px-3 py-2 border-b border-walnut/8">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-walnut/40">
                              {searchBooks.length} hasil ditemukan
                            </span>
                          </div>
                          <div className="max-h-72 overflow-y-auto">
                            {searchBooks.map((book: any) => {
                              const SC: Record<string, { bg: string; color: string; label: string }> = {
                                reading:  { bg: '#d1fae5', color: '#065f46', label: 'Dibaca' },
                                finished: { bg: '#dbeafe', color: '#1e40af', label: 'Selesai' },
                                unread:   { bg: '#f3f4f6', color: '#374151', label: 'Belum' },
                                wishlist: { bg: '#f3e8ff', color: '#6b21a8', label: 'Wishlist' },
                                borrowed: { bg: '#fef3c7', color: '#92400e', label: 'Pinjam' },
                              }
                              const sc = SC[book.status] || SC['unread']
                              const c0 = book.spineColors?.[0] || '#8B7355'
                              const c2 = book.spineColors?.[2] || '#5C4532'
                              return (
                                <button
                                  key={book.id}
                                  onClick={() => {
                                    setIsSearchFocused(false)
                                    setSearchQuery('')
                                    navigate('/library')
                                    setTimeout(() => {
                                      const store = useBookstore.getState()
                                      store.setSelectedBookId(book.id)
                                      store.toggleBookDetail(book.id)
                                    }, 200)
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-walnut/5 transition-colors text-left border-b border-walnut/5 last:border-0"
                                >
                                  <div
                                    className="flex-shrink-0 w-8 h-11 rounded-sm shadow-sm"
                                    style={{ background: `linear-gradient(150deg, ${c0}, ${c2})` }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-darkBrown truncate leading-tight">{book.title}</p>
                                    <p className="text-xs text-walnut/60 italic truncate">{book.author}</p>
                                    {book.genre && <p className="text-[10px] text-walnut/40 truncate mt-0.5">{book.genre}</p>}
                                  </div>
                                  <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                                    {sc.label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                          <div className="border-t border-walnut/8 p-2">
                            <button
                              onClick={() => {
                                navigate(`/library?search=${encodeURIComponent(searchQuery)}`)
                                setIsSearchFocused(false)
                                setSearchQuery('')
                              }}
                              className="w-full text-center text-xs text-walnut/60 hover:text-walnut py-1 transition-colors"
                            >
                              Lihat semua hasil di Library →
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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

              {/* Notification Center */}
              <div className="hidden sm:block mt-1.5">
                <NotificationCenter />
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <motion.button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-walnut to-darkBrown rounded-xl flex items-center justify-center text-white font-semibold text-xs md:text-sm relative shadow-lg"
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
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 relative overflow-hidden bg-black" style={{ perspective: '1200px' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ rotateY: -90, filter: 'brightness(0.2)' }}
            animate={{ rotateY: 0, filter: 'brightness(1)' }}
            exit={{ rotateY: 90, filter: 'brightness(0.2)' }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="w-full h-full absolute inset-0 overflow-auto bg-cream"
            style={{ 
              transformOrigin: '50% 50% 50vw',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
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
      <div className="md:hidden fixed bottom-6 right-6 z-[60]" ref={mobileMenuRef}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-16 right-0 mb-4 bg-cream/95 backdrop-blur-md rounded-full shadow-2xl border border-walnut/20 p-1.5 flex flex-col gap-1.5"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                      isActive ? 'bg-walnut/10 text-walnut' : 'text-walnut/70 hover:bg-walnut/5 hover:text-walnut'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'fill-walnut/10' : ''}`} />
                  </Link>
                )
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
            transition={{ type: 'spring', damping: 20 }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </div>
    </div>
  )
}
