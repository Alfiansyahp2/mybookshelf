import { useState } from 'react'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useBookstore } from '../store/useBookstore'
import type { Book } from '../types'
import Bookshelf from '../components/Bookshelf'
import AddBookModal from '../components/AddBookModal'

export default function Library() {
  // Zustand - UI state only
  const { selectedBookId, isBookDetailOpen, toggleBookDetail, setSelectedBookId } = useBookstore()

  // API hooks - data fetching
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [selectedShelfId, setSelectedShelfId] = useState<string | undefined>()
  const [selectedShelfName, setSelectedShelfName] = useState<string | undefined>()

  // Fetch books from API based on filter
  const filterParams = activeFilter === 'all'
    ? {}
    : { status: activeFilter as any }

  const { data: booksResponse, isLoading, error } = useBooks(filterParams)
  const { data: shelves = [], isLoading: shelvesLoading } = useShelves()

  if (isLoading || shelvesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-walnut">Loading library...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-serif text-darkBrown mb-2">Error loading library</h3>
        <p className="text-walnut/70">Failed to connect to the library. Please try again.</p>
      </div>
    )
  }

  const books = booksResponse?.data?.data || []

  // Calculate counts for each status
  const allCount = books.length
  const readingCount = books.filter((b: Book) => b.status === 'reading').length
  const finishedCount = books.filter((b: Book) => b.status === 'finished').length
  const unreadCount = books.filter((b: Book) => b.status === 'unread').length
  const borrowedCount = books.filter((b: Book) => b.status === 'borrowed').length

  const handleAddBook = (shelfId: string, shelfName?: string) => {
    setSelectedShelfId(shelfId)
    setSelectedShelfName(shelfName)
    setIsAddBookModalOpen(true)
  }

  // Shelf edit and delete handlers - these will be handled by Bookshelf component
  const handleEditShelf = (shelfId: string) => {
    // Bookshelf component will dispatch the event
    console.log('Edit shelf triggered from Library:', shelfId)
  }

  const handleDeleteShelf = (shelfId: string) => {
    // Bookshelf component will dispatch the event
    console.log('Delete shelf triggered from Library:', shelfId)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
  }

  const handleBookClick = (book: any) => {
    setSelectedBookId(book.id)
    toggleBookDetail(book.id)
  }

  return (
    <div className="p-2 md:p-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-walnut text-white shadow'
              : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
          }`}
        >
          All ({allCount})
        </button>

        {/* Reading Filter - Always show */}
        <button
          onClick={() => handleFilterChange('reading')}
          className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
            activeFilter === 'reading'
              ? 'bg-walnut text-white shadow'
              : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
          }`}
        >
          Reading ({readingCount})
        </button>

        {/* Finished Filter - Always show */}
        <button
          onClick={() => handleFilterChange('finished')}
          className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
            activeFilter === 'finished'
              ? 'bg-walnut text-white shadow'
              : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
          }`}
        >
          Finished ({finishedCount})
        </button>

        {/* Unread Filter - Always show */}
        <button
          onClick={() => handleFilterChange('unread')}
          className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
            activeFilter === 'unread'
              ? 'bg-walnut text-white shadow'
              : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
          }`}
        >
          Unread ({unreadCount})
        </button>

        {/* Borrowed Filter - Only show if there are borrowed books */}
        {borrowedCount > 0 && (
          <button
            onClick={() => handleFilterChange('borrowed')}
            className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
              activeFilter === 'borrowed'
                ? 'bg-red-500 text-white shadow'
                : 'bg-white text-red-500/70 hover:bg-red-50 border border-red-200'
            }`}
          >
            Borrowed ({borrowedCount})
          </button>
        )}
      </div>

      {/* Virtual Bookshelf */}
      <Bookshelf
        books={books}
        shelves={shelves}
        onAddBook={handleAddBook}
        onEditShelf={handleEditShelf}
        onDeleteShelf={handleDeleteShelf}
        filterStatus={activeFilter === 'all' ? undefined : activeFilter}
        selectedBookId={selectedBookId}
        isDrawerOpen={isBookDetailOpen}
        onBookClick={handleBookClick}
      />

      {/* Empty State */}
      {books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-serif text-darkBrown mb-2">No books found</h3>
          <p className="text-walnut/70">
            {activeFilter === 'all'
              ? 'Start building your personal library'
              : activeFilter === 'borrowed'
              ? 'No borrowed books in your collection'
              : `No ${activeFilter} books in your collection`}
          </p>
        </div>
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        shelfId={selectedShelfId}
        shelfName={selectedShelfName}
      />
    </div>
  )
}
