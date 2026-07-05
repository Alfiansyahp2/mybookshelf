import { useState, useRef } from 'react'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useNavigate } from 'react-router-dom'
import { useBookstore } from '../store/useBookstore'
import Bookshelf from '../components/Bookshelf'
import type { Book } from '../types'
import { motion } from 'framer-motion'
import {
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Bookmark,
  Plus
} from 'lucide-react'

export default function Reading() {
  const navigate = useNavigate()
  const { selectedBookId, isBookDetailOpen, toggleBookDetail, setSelectedBookId } = useBookstore()
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  // Fetch all books and shelves from API
  const { data: allBooksResponse, isLoading } = useBooks({})
  const { data: shelves = [], isLoading: shelvesLoading } = useShelves()

  const allBooks = allBooksResponse?.data?.data || []
  const readingBooks = allBooks.filter((book: Book) => book.status === 'reading')
  const unreadBooks = allBooks.filter((book: Book) => book.status === 'unread')

  // Calculate reading statistics
  const totalReadingBooks = readingBooks.length
  const totalUnreadBooks = unreadBooks.length
  const totalPagesRead = readingBooks.reduce((sum: number, book: Book) => sum + (book.currentPage || 0), 0)
  const totalPages = readingBooks.reduce((sum: number, book: Book) => sum + (book.pages || 0), 0)
  const averageProgress = totalReadingBooks > 0
    ? Math.round(readingBooks.reduce((sum: number, book: Book) => sum + (book.progress || 0), 0) / totalReadingBooks)
    : 0
  // Calculate yearly statistics
  const getBookYears = (b: any): number[] => {
    const years = new Set<number>()
    if (b.finishedDate) years.add(new Date(b.finishedDate).getFullYear())
    if (b.startedDate) years.add(new Date(b.startedDate).getFullYear())
    if (b.readDates && Array.isArray(b.readDates)) {
      b.readDates.forEach((d: string) => years.add(new Date(d).getFullYear()))
    }
    if (years.size === 0 && (b.status === 'reading' || b.status === 'finished')) {
      years.add(new Date(b.lastModified || b.dateAdded).getFullYear())
    }
    return Array.from(years)
  }

  const activeYears = Array.from(new Set(allBooks.flatMap(getBookYears))) as number[]
  activeYears.sort((a, b) => b - a)

  const yearlyStats = activeYears.map(year => {
    const booksThisYear = allBooks.filter((b: Book) => getBookYears(b).includes(year))
    const finishedThisYear = booksThisYear.filter((b: Book) => {
      if (b.status === 'finished' && b.finishedDate) {
        return new Date(b.finishedDate).getFullYear() === year
      }
      if (b.status === 'finished' && !b.finishedDate) {
        if (b.readDates && Array.isArray(b.readDates)) {
          return b.readDates.some((d: string) => new Date(d).getFullYear() === year)
        }
        return new Date(b.lastModified || b.dateAdded).getFullYear() === year
      }
      return false
    }).length

    const totalPages = booksThisYear.reduce((s: number, b: any) => s + (b.pages || b.totalPages || 0), 0)
    const pagesRead = booksThisYear.reduce((s: number, b: any) => {
      if (b.status === 'finished') return s + (b.pages || b.totalPages || 0)
      return s + (b.currentPage || 0)
    }, 0)
    const readPct = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0
    const goalPct = Math.min((finishedThisYear / 12) * 100, 100)

    return { year, finished: finishedThisYear, totalPages, pagesRead, readPct, goalPct }
  })

  // Edge Scrolling logic for Yearly Target Cards
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef(0)
  const isScrolling = useRef(false)

  const startScrolling = () => {
    if (isScrolling.current) return
    isScrolling.current = true
    const scroll = () => {
      if (!isScrolling.current || !scrollContainerRef.current) return
      scrollContainerRef.current.scrollLeft += speedRef.current
      requestAnimationFrame(scroll)
    }
    requestAnimationFrame(scroll)
  }

  const stopScrolling = () => {
    isScrolling.current = false
    speedRef.current = 0
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return
    const { left, right } = scrollContainerRef.current.getBoundingClientRect()
    const x = e.clientX
    const edgeSize = 100 // Area on left/right edges to trigger scroll
    
    if (x < left + edgeSize) {
      // Scale speed based on how close to the edge
      speedRef.current = -((left + edgeSize - x) / edgeSize) * 15
      startScrolling()
    } else if (x > right - edgeSize) {
      speedRef.current = ((x - (right - edgeSize)) / edgeSize) * 15
      startScrolling()
    } else {
      stopScrolling()
    }
  }

  const handleMouseLeave = () => {
    stopScrolling()
  }

  const handleBookClick = (book: any) => {
    setSelectedBookId(book.id)
    toggleBookDetail(book.id)
  }

  const handleAddBook = (shelfId: string, shelfName?: string) => {
    console.log('Add book to shelf:', shelfId, shelfName)
    // TODO: Implement add book functionality
  }

  // Loading state
  if (isLoading || shelvesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-walnut">Loading reading progress...</div>
      </div>
    )
  }

  return (
    <div 
      className="p-4 md:p-8 flex flex-col min-h-full relative"
      style={{
        background: 'linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)',
      }}
    >
      {/* Plaster / linen wall texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', opacity:0.18,
        backgroundImage:`
          repeating-linear-gradient(0deg,  transparent, transparent 5px, rgba(0,0,0,0.02) 5px, rgba(0,0,0,0.02) 6px),
          repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px)
        `,
      }} />
      <div className="max-w-7xl mx-auto w-full relative z-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-darkBrown mb-2">
          Currently Reading
        </h1>
        <p className="text-walnut/70">
          Track your progress on {totalReadingBooks} book{totalReadingBooks !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Yearly Target Cards */}
      {yearlyStats.length > 0 && (
        <div 
          ref={scrollContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="mb-8 flex flex-row gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar"
        >
          {yearlyStats.map((stat, idx) => {
            const isSelected = selectedYear === stat.year;
            return (
              <motion.div 
                key={stat.year}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedYear(isSelected ? null : stat.year)}
                className={`min-w-[320px] max-w-[400px] flex-1 snap-start cursor-pointer transition-transform ${isSelected ? 'scale-[1.02] ring-2 ring-walnut ring-offset-2' : 'hover:scale-[1.01]'}`}
              >
                <div className="bg-white rounded-2xl border border-walnut/10 shadow-sm overflow-hidden h-full">
                  <div style={{ padding: '16px 18px', background: 'linear-gradient(135deg, #4A3320 0%, #6b4528 100%)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="m-0 text-sm font-bold text-amber-100/90 font-serif flex items-center gap-2">
                        <Target size={16} /> Target {stat.year}
                      </h3>
                      <span className="text-xl font-extrabold text-white">{stat.finished} / 12</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${stat.goalPct}%` }}
                        transition={{ duration: 1.2, delay: 0.6 + (idx * 0.1), ease: 'easeOut' }}
                        className={`h-full rounded-full ${stat.goalPct >= 100 ? 'bg-green-500' : 'bg-amber-200/85'}`}
                      />
                    </div>
                    <p className="mt-2 text-xs text-amber-100/60 m-0">
                      {stat.goalPct >= 100 ? '🎉 Target tercapai!' : `${12 - stat.finished} buku lagi untuk target tahun ini`}
                    </p>
                  </div>
                  
                  <div className="flex justify-between gap-2 p-4 bg-white">
                    <div className="text-center flex-1">
                      <div className="text-xl font-extrabold text-darkBrown">{stat.pagesRead.toLocaleString()}</div>
                      <div className="text-xs text-walnut/60 mt-1">Halaman Dibaca</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xl font-extrabold text-darkBrown">{stat.totalPages.toLocaleString()}</div>
                      <div className="text-xs text-walnut/60 mt-1">Total Halaman</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xl font-extrabold text-darkBrown">{stat.readPct}%</div>
                      <div className="text-xs text-walnut/60 mt-1">% Terbaca</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Selected Year Books */}
      {selectedYear && (
        <div className="mb-12">
          <Bookshelf
            books={allBooks
              .filter((b: Book) => getBookYears(b).includes(selectedYear))
              .map((b: Book) => ({ ...b, shelfId: 'year-shelf' }))
            }
            shelves={[{ id: 'year-shelf', name: `Buku yang Dibaca Tahun ${selectedYear}`, order: 0, span: 12, capacity: 100 }]}
            onBookClick={handleBookClick}
          />
        </div>
      )}

      {/* Statistics Cards */}
      {totalReadingBooks > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">{totalReadingBooks}</div>
                <div className="text-sm text-walnut/70">Reading</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">{averageProgress}%</div>
                <div className="text-sm text-walnut/70">Avg Progress</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">
                  {totalPagesRead.toLocaleString()}
                </div>
                <div className="text-sm text-walnut/70">Pages Read</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">
                  {totalPages > 0 ? Math.round((totalPagesRead / totalPages) * 100) : 0}%
                </div>
                <div className="text-sm text-walnut/70">Total Progress</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Unified Reading & Unread Bookshelf */}
      {(totalReadingBooks > 0 || totalUnreadBooks > 0) && (
        <div className="mb-12">
          <Bookshelf
            books={[
              ...readingBooks.map((b: Book) => ({ ...b, shelfId: 'reading-shelf' })),
              ...unreadBooks.map((b: Book) => ({ ...b, shelfId: 'unread-shelf' }))
            ]}
            shelves={[
              ...(totalReadingBooks > 0 ? [{ id: 'reading-shelf', name: 'Sedang Dibaca', order: 0, span: 12, capacity: 100 }] : []),
              ...(totalUnreadBooks > 0 ? [{ id: 'unread-shelf', name: 'Belum Dibaca', order: 1, span: 12, capacity: 100 }] : [])
            ]}
            onAddBook={handleAddBook}
            selectedBookId={selectedBookId}
            isDrawerOpen={isBookDetailOpen}
            onBookClick={handleBookClick}
          />
        </div>
      )}

      {/* Action Buttons */}
      {totalReadingBooks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 bg-walnut text-white rounded-xl font-medium hover:bg-darkBrown transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Browse Library
          </button>
        </motion.div>
      )}

      {/* Empty State - only if truly nothing to show */}
      {totalReadingBooks === 0 && totalUnreadBooks === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-walnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-walnut/30" />
          </div>
          <h3 className="text-xl font-serif text-darkBrown mb-2">
            Belum ada buku
          </h3>
          <p className="text-walnut/70 mb-6">
            Mulai perjalanan membaca dari perpustakaan kamu
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-walnut text-white rounded-xl font-medium hover:bg-darkBrown transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Browse Library
            </button>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  )
}
