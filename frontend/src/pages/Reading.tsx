import { useBookstore } from '../store/useBookstore'
import Bookshelf from '../components/Bookshelf'
import { motion } from 'framer-motion'
import {
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Bookmark
} from 'lucide-react'

export default function Reading() {
  const { getBooksByStatus, getReadingTime } = useBookstore()

  const readingBooks = getBooksByStatus('reading')

  // Calculate reading statistics
  const totalReadingBooks = readingBooks.length
  const totalPagesRead = readingBooks.reduce((sum, book) => sum + (book.currentPage || 0), 0)
  const totalPages = readingBooks.reduce((sum, book) => sum + (book.pages || 0), 0)
  const averageProgress = totalReadingBooks > 0
    ? Math.round(readingBooks.reduce((sum, book) => sum + (book.progress || 0), 0) / totalReadingBooks)
    : 0

  const handleAddBook = (shelfId: string) => {
    console.log('Add book to shelf:', shelfId)
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-darkBrown mb-2">
          Currently Reading
        </h1>
        <p className="text-walnut/70">
          Track your progress on {totalReadingBooks} book{totalReadingBooks !== 1 ? 's' : ''}
        </p>
      </div>

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

      {/* Reading Books Grid */}
      {totalReadingBooks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm mb-8"
        >
          <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Active Reading Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingBooks.map((book, index) => {
              const readingTime = getReadingTime(book.id)
              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-cream to-beige rounded-xl p-4 border border-walnut/10 hover:shadow-md transition-shadow"
                >
                  {/* Book Cover Preview */}
                  <div className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[2]} 100%)`
                    }}
                  >
                    <div className="text-white text-center p-2 z-10">
                      <div className="text-sm font-semibold">{book.title}</div>
                      <div className="text-xs opacity-90">{book.author}</div>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <h3 className="font-semibold text-darkBrown mb-2 truncate">{book.title}</h3>
                  <p className="text-sm text-walnut/70 mb-3">{book.author}</p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-walnut/60">Progress</span>
                      <span className="font-medium text-darkBrown">{book.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-walnut/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${book.progress || 0}%`,
                          background: `linear-gradient(90deg, ${book.spineColors[0]}, ${book.spineColors[2]})`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-walnut/60">
                      <span>Page {book.currentPage || 0}</span>
                      <span>of {book.pages}</span>
                    </div>
                  </div>

                  {/* Reading Time */}
                  {readingTime && (
                    <div className="bg-white/50 rounded-lg p-2 text-xs">
                      <div className="flex items-center gap-2 text-walnut/70">
                        <Clock className="w-3 h-3" />
                        <span>
                          {readingTime.days}d {readingTime.hours}h {readingTime.minutes}m
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Virtual Bookshelf */}
      <Bookshelf onAddBook={handleAddBook} filterStatus="reading" />

      {/* Empty State */}
      {totalReadingBooks === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-walnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-walnut/30" />
          </div>
          <h3 className="text-xl font-serif text-darkBrown mb-2">
            No books currently being read
          </h3>
          <p className="text-walnut/70 mb-6">
            Start a new reading journey from your library
          </p>
        </motion.div>
      )}
    </div>
  )
}
