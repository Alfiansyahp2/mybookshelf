import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Shelf from '../components/Shelf'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useState, useEffect } from 'react'
import type { Book } from '../types'

export default function ExploreLibrary() {
  const { data: booksResponse } = useBooks()
  const books = booksResponse?.data?.data || []
  const { data: shelves = [], isLoading } = useShelves()
  const [currentShelf, setCurrentShelf] = useState(0)

  // Distribute books across shelves
  const distributeBooksAcrossShelves = (): Map<string, Book[]> => {
    const distribution = new Map<string, Book[]>()

    shelves.forEach((shelf) => {
      distribution.set(shelf.id, [])
    })

    // Sort books: borrowed first, then by status
    const sortedBooks = [...books].sort((a, b) => {
      if (a.status === 'borrowed' && b.status !== 'borrowed') return -1
      if (a.status !== 'borrowed' && b.status === 'borrowed') return 1
      return 0
    })

    // Distribute books to their assigned shelves
    sortedBooks.forEach((book) => {
      if (book.shelfId && distribution.has(book.shelfId)) {
        distribution.get(book.shelfId)!.push(book)
      }
    })

    return distribution
  }

  const booksDistribution = distributeBooksAcrossShelves()

  const handleBookClick = (book: Book) => {
    // Navigate to book detail
    window.location.href = `/library?book=${book.id}`
  }

  const goToNextShelf = () => {
    if (currentShelf < shelves.length - 1) {
      setCurrentShelf(currentShelf + 1)
    }
  }

  const goToPrevShelf = () => {
    if (currentShelf > 0) {
      setCurrentShelf(currentShelf - 1)
    }
  }

  const currentShelfData = shelves[currentShelf]
  const currentBooks = booksDistribution.get(currentShelfData?.id) || []

  if (isLoading) {
    return <div className="p-8">Memuat rak...</div>
  }

  if (shelves.length === 0) {
    return <div className="p-8 text-center text-walnut/60">Tidak ada rak. Silakan tambahkan rak di perpustakaan.</div>
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-darkBrown mb-2">Explore Library</h1>
        <p className="text-walnut/70 text-lg">
          Walk through your personal collection. Use arrow keys or buttons to navigate between shelves.
        </p>
      </div>

      {/* Room Info */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-walnut/10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-darkBrown mb-1">Main Library Room</h2>
            <p className="text-walnut/70">{shelves.length} Shelves · {books.length} Books</p>
          </div>
          <div className="flex gap-2">
            {shelves.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentShelf(index)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-all ${
                  currentShelf === index
                    ? 'bg-walnut text-white shadow-lg scale-110'
                    : 'bg-walnut/10 text-walnut/70 hover:bg-walnut/20'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Shelf Display */}
      <motion.div
        key={currentShelf}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="mb-8"
      >
        {/* Shelf Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevShelf}
            disabled={currentShelf === 0}
            className="px-4 py-2 bg-white border border-walnut/20 rounded-xl flex items-center gap-2 hover:bg-walnut/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
            Previous Shelf
          </button>

          <h3 className="text-xl font-serif text-darkBrown">
            {currentShelfData?.name}
          </h3>

          <button
            onClick={goToNextShelf}
            disabled={currentShelf === shelves.length - 1}
            className="px-4 py-2 bg-white border border-walnut/20 rounded-xl flex items-center gap-2 hover:bg-walnut/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Shelf
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Shelf */}
        {currentShelfData && (
          <Shelf
            shelf={currentShelfData}
            books={currentBooks}
            onBookClick={handleBookClick}
          />
        )}
      </motion.div>

      {/* Keyboard Instructions */}
      <div className="mt-8 bg-walnut/5 rounded-xl p-4 text-center text-sm text-walnut/60">
        <p>💡 Tip: Use <kbd className="px-2 py-1 bg-white rounded">←</kbd> and <kbd className="px-2 py-1 bg-white rounded">→</kbd> arrow keys to navigate between shelves</p>
      </div>

      {/* Keyboard Navigation Hook */}
      <KeyboardNavigation
        onNext={goToNextShelf}
        onPrev={goToPrevShelf}
        canNext={currentShelf < shelves.length - 1}
        canPrev={currentShelf > 0}
      />
    </div>
  )
}

// Keyboard Navigation Component
function KeyboardNavigation({ onNext, onPrev, canNext, canPrev }: {
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && canPrev) {
        onPrev()
      } else if (e.key === 'ArrowRight' && canNext) {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrev, canNext, canPrev])

  return null
}
