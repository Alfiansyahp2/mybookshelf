import { useEffect, useState } from 'react'
import { useBookstore } from '../store/useBookstore'
import Bookshelf from '../components/Bookshelf'
import AddBookModal from '../components/AddBookModal'
import { mockBooks } from '../utils/mockData'

export default function Library() {
  console.log('Library component rendering...')

  const { books, addBook, activeFilter, getFilteredBooks } = useBookstore()
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [selectedShelfId, setSelectedShelfId] = useState<string | undefined>()
  const [selectedShelfName, setSelectedShelfName] = useState<string | undefined>()

  console.log('Books:', books.length)
  console.log('Active filter:', activeFilter)

  const handleAddBook = (shelfId: string, shelfName?: string) => {
    setSelectedShelfId(shelfId)
    setSelectedShelfName(shelfName)
    setIsAddBookModalOpen(true)
  }

  // Initialize mock data on first load
  useEffect(() => {
    console.log('useEffect running, books.length:', books.length)
    if (books.length === 0) {
      console.log('Adding mock books...')
      // Add all mock books
      mockBooks.forEach(book => {
        addBook(book)
      })
    }
  }, [books.length, addBook])

  const filteredBooks = getFilteredBooks()

  // Calculate counts for each status
  const readingCount = books.filter(b => b.status === 'reading').length
  const finishedCount = books.filter(b => b.status === 'finished').length
  const unreadCount = books.filter(b => b.status === 'unread').length
  const borrowedCount = books.filter(b => b.status === 'borrowed').length

  console.log('Filtered books:', filteredBooks.length)

  return (
    <div className="p-2 md:p-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => useBookstore.getState().setActiveFilter('all')}
          className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-walnut text-white shadow'
              : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
          }`}
        >
          All ({books.length})
        </button>

        {/* Reading Filter - Always show */}
        <button
          onClick={() => useBookstore.getState().setActiveFilter('reading')}
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
          onClick={() => useBookstore.getState().setActiveFilter('finished')}
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
          onClick={() => useBookstore.getState().setActiveFilter('unread')}
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
            onClick={() => useBookstore.getState().setActiveFilter('borrowed')}
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
      <Bookshelf onAddBook={handleAddBook} />

      {/* Empty State */}
      {filteredBooks.length === 0 && (
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
