import Shelf from './Shelf'
import type { Book, Shelf as ShelfType } from '../types'

interface BookshelfProps {
  books: Book[]
  shelves: ShelfType[]
  onAddBook?: (shelfId: string, shelfName?: string) => void
  onEditShelf?: (shelfId: string) => void
  onDeleteShelf?: (shelfId: string) => void
  filterStatus?: string
  selectedBookId?: string | null
  isDrawerOpen?: boolean
  onBookClick?: (book: Book) => void
}

export default function Bookshelf({
  books,
  shelves,
  onAddBook,
  filterStatus,
  selectedBookId,
  isDrawerOpen = false,
  onBookClick
}: BookshelfProps) {

  // Distribute books across shelves
  const distributeBooksAcrossShelves = (): Map<string, Book[]> => {
    const distribution = new Map<string, Book[]>()

    shelves.forEach((shelf) => {
      distribution.set(shelf.id, [])
    })

    // Filter books by status if filterStatus is provided
    const filteredBooks = filterStatus
      ? books.filter(book => book.status === filterStatus)
      : books

    // Sort books: borrowed first, then by status
    const sortedBooks = [...filteredBooks].sort((a, b) => {
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

  // Filter shelves to only show those with books when filterStatus is active
  const visibleShelves = filterStatus
    ? shelves.filter((shelf) => {
        const booksOnShelf = booksDistribution.get(shelf.id) || []
        return booksOnShelf.length > 0
      })
    : shelves

  const handleBookClick = (book: Book) => {
    console.log('Book clicked:', book.title)
    onBookClick?.(book)
  }

  const handleAddBook = (shelfId: string) => {
    const shelf = shelves.find(s => s.id === shelfId)
    onAddBook?.(shelfId, shelf?.name)
  }

  const handleEditShelf = (shelfId: string) => {
    // Dispatch custom event for AppLayout to handle
    window.dispatchEvent(new CustomEvent('editShelf', { detail: { shelfId } }))
  }

  const handleDeleteShelf = (shelfId: string) => {
    // Dispatch custom event for AppLayout to handle
    window.dispatchEvent(new CustomEvent('deleteShelf', { detail: { shelfId } }))
  }

  return (
    <div
      className="space-y-3 md:space-y-4 p-2 md:p-4 rounded-xl"
      style={{
        background: 'linear-gradient(135deg, #F8F5F0 0%, #E8E0D5 100%)',
        boxShadow: `
          inset 0 2px 8px rgba(0, 0, 0, 0.05),
          0 8px 32px rgba(0, 0, 0, 0.1)
        `,
        border: '1px solid rgba(139, 115, 85, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Wall texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(139, 115, 85, 0.02) 50px, rgba(139, 115, 85, 0.02) 51px),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(139, 115, 85, 0.02) 50px, rgba(139, 115, 85, 0.02) 51px)
          `
        }}
      />

      {visibleShelves.map((shelf) => (
        <Shelf
          key={shelf.id}
          shelf={shelf}
          books={booksDistribution.get(shelf.id) || []}
          onBookClick={handleBookClick}
          onAddBook={handleAddBook}
          onEditShelf={handleEditShelf}
          onDeleteShelf={handleDeleteShelf}
          isDrawerOpen={isDrawerOpen}
          selectedBookId={selectedBookId}
        />
      ))}
    </div>
  )
}
