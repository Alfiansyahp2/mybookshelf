import { useState, useRef } from 'react'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useNavigate } from 'react-router-dom'
import { useBookstore } from '../store/useBookstore'
import Bookshelf from '../components/Bookshelf'
import YearlyTargetCards from '../components/reading/YearlyTargetCards'
import { useYearlyStats, getBookYears } from '../hooks/useYearlyStats'
import type { Book } from '../types'
import { motion } from 'framer-motion'
import {
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Plus
} from 'lucide-react'

export default function Reading() {
  const navigate = useNavigate()
  const { selectedBookId, isBookDetailOpen, toggleBookDetail, setSelectedBookId } = useBookstore()
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  // Fetch all books from API
  const { data: allBooksResponse, isLoading } = useBooks({})

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
  // Calculate yearly statistics using custom hook
  const { yearlyStats } = useYearlyStats(allBooks);

  const handleBookClick = (book: any) => {
    setSelectedBookId(book.id)
    toggleBookDetail(book.id)
  }

  const handleAddBook = (shelfId: string, shelfName?: string) => {
    console.log('Add book to shelf:', shelfId, shelfName)
    // TODO: Implement add book functionality
  }

  // Loading state
  if (isLoading) {
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

      <YearlyTargetCards 
        yearlyStats={yearlyStats}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

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
