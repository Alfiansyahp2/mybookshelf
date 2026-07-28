import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { useBooks } from '../../hooks/useBooks'
import { useBookstore } from '../../store/useBookstore'

export default function SearchBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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
        // Also close mobile search if they click outside
        setIsMobileSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      {/* Mobile Search Toggle */}
      <button
        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-walnut/70 hover:bg-walnut/10 hover:text-walnut transition-all"
      >
        <Search className="w-4 h-4" />
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
                  {t('search.no_results')} <strong>"{searchQuery}"</strong>
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 border-b border-walnut/8">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-walnut/40">
                      {searchBooks.length} {t('search.results_found')}
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
                            setIsMobileSearchOpen(false)
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
                        setIsMobileSearchOpen(false)
                      }}
                      className="w-full text-center text-xs text-walnut/60 hover:text-walnut py-1 transition-colors"
                    >
                      {t('search.view_all')}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
