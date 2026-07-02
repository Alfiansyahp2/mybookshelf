import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useStartReading } from '../hooks/useBooks'
import { useNavigate } from 'react-router-dom'
import { useBookstore } from '../store/useBookstore'
import Bookshelf from '../components/Bookshelf'
import type { Book } from '../types'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Clock,
  BookOpen,
  Target,
  Gift,
  Plus
} from 'lucide-react'

export default function Wishlist() {
  const navigate = useNavigate()
  const { selectedBookId, isBookDetailOpen, toggleBookDetail, setSelectedBookId } = useBookstore()

  // Fetch all books and shelves from API
  const { data: allBooksResponse, isLoading } = useBooks({})
  const { data: shelves = [], isLoading: shelvesLoading } = useShelves()
  const startReadingMutation = useStartReading()

  const allBooks = allBooksResponse?.data?.data || []
  const wishlistBooks = allBooks.filter((book: Book) => book.status === 'wishlist')

  // Calculate wishlist statistics
  const totalWishlist = wishlistBooks.length
  const estimatedPages = wishlistBooks.reduce((sum: number, book: Book) => sum + (book.pages || 0), 0)
  const estimatedHours = Math.round(estimatedPages / 30) // Assuming 30 pages per hour

  const handleStartReading = (bookId: string) => {
    startReadingMutation.mutate(bookId)
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
        <div className="text-walnut">Loading wishlist...</div>
      </div>
    )
  }

  return (
    <div 
      className="p-4 md:p-8 flex flex-col h-full min-h-screen relative"
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
          Wishlist
        </h1>
        <p className="text-walnut/70">
          Your reading queue - {totalWishlist} book{totalWishlist !== 1 ? 's' : ''} waiting to be read
        </p>
      </div>

      {/* Statistics Cards */}
      {totalWishlist > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">{totalWishlist}</div>
                <div className="text-sm text-walnut/70">Wishlist</div>
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
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">
                  {estimatedPages.toLocaleString()}
                </div>
                <div className="text-sm text-walnut/70">Total Pages</div>
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">{estimatedHours}h</div>
                <div className="text-sm text-walnut/70">Est. Reading</div>
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-darkBrown">
                  {totalWishlist > 0 ? Math.round(estimatedPages / totalWishlist) : 0}
                </div>
                <div className="text-sm text-walnut/70">Avg Pages</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Wishlist Books Grid */}
      {totalWishlist > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm mb-8"
        >
          <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Reading Queue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistBooks.map((book: Book, index: number) => {
              const estimatedTime = Math.round((book.pages || 0) / 30)
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
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>

                  {/* Book Info */}
                  <h3 className="font-semibold text-darkBrown mb-2 truncate">{book.title}</h3>
                  <p className="text-sm text-walnut/70 mb-3">{book.author}</p>

                  {/* Book Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-walnut/60">
                      <span>Genre:</span>
                      <span className="font-medium text-darkBrown">{book.genre}</span>
                    </div>
                    <div className="flex justify-between text-xs text-walnut/60">
                      <span>Pages:</span>
                      <span className="font-medium text-darkBrown">{book.pages}</span>
                    </div>
                    <div className="flex justify-between text-xs text-walnut/60">
                      <span>Est. Time:</span>
                      <span className="font-medium text-darkBrown">{estimatedTime}h</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartReading(book.id)}
                    className="w-full py-2 bg-walnut text-white rounded-lg font-medium hover:bg-darkBrown transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    Start Reading
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Wishlist Bookshelf - Only show if there are wishlist books */}
      {totalWishlist > 0 && (
        <Bookshelf
          books={allBooks}
          shelves={shelves}
          onAddBook={handleAddBook}
          filterStatus="wishlist"
          selectedBookId={selectedBookId}
          isDrawerOpen={isBookDetailOpen}
          onBookClick={handleBookClick}
        />
      )}

      {/* Action Buttons */}
      {totalWishlist > 0 && (
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

      {/* Empty State */}
      {totalWishlist === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-walnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-walnut/30" />
          </div>
          <h3 className="text-xl font-serif text-darkBrown mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-walnut/70 mb-6">
            Save books you want to read later
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-walnut text-white rounded-xl font-medium hover:bg-darkBrown transition-colors"
            >
              Browse Library
            </button>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-white text-walnut rounded-xl font-medium hover:bg-walnut/10 transition-colors border border-walnut/20"
            >
              Add to Wishlist
            </button>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  )
}
