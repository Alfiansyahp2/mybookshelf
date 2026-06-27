import { useState, useEffect } from 'react'
import { useBookstore } from '../store/useBookstore'
import Shelf from './Shelf'
import type { Book } from '../types'
import { mockShelves } from '../utils/mockData'

// Get the type from the component props
type ShelfType = React.ComponentProps<typeof Shelf>['shelf']

interface BookshelfProps {
  onAddBook?: (shelfId: string, shelfName?: string) => void
  filterStatus?: string
}

export default function Bookshelf({ onAddBook, filterStatus }: BookshelfProps) {
  const { books, toggleBookDetail, isBookDetailOpen, selectedBookId, shelves, moveBookToShelf } = useBookstore()
  const [localShelves, setLocalShelves] = useState(shelves.length > 0 ? shelves : mockShelves)

  // Update local shelves when store shelves change
  useEffect(() => {
    if (shelves.length > 0) {
      setLocalShelves(shelves)
    }
  }, [shelves])

  // Distribute books across shelves
  const distributeBooksAcrossShelves = (): Map<string, Book[]> => {
    const distribution = new Map<string, Book[]>()

    localShelves.forEach((shelf) => {
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

  console.log('Bookshelf rendered - Total books:', books.length)
  console.log('Books distribution:', Array.from(booksDistribution.entries()))

  const handleBookClick = (book: Book) => {
    console.log('Book clicked:', book.title)
    toggleBookDetail(book.id)
  }

  const handleAddBook = (shelfId: string) => {
    const shelf = shelves.find(s => s.id === shelfId)
    onAddBook?.(shelfId, shelf?.name)
  }

  const handleEditShelf = (shelfId: string) => {
    console.log('Edit shelf:', shelfId)
    // TODO: Implement edit shelf functionality
    alert(`Edit shelf: ${shelfId}\n\nThis will open the edit shelf form.`)
  }

  const handleDeleteShelf = (shelfId: string) => {
    console.log('Delete shelf:', shelfId)
    // TODO: Implement delete shelf functionality
    alert(`Delete shelf: ${shelfId}\n\nThis will delete the shelf and move all books to another shelf.`)
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

      {localShelves.map((shelf) => (
        <Shelf
          key={shelf.id}
          shelf={shelf}
          books={booksDistribution.get(shelf.id) || []}
          onBookClick={handleBookClick}
          onAddBook={handleAddBook}
          onEditShelf={handleEditShelf}
          onDeleteShelf={handleDeleteShelf}
          isDrawerOpen={isBookDetailOpen}
          selectedBookId={selectedBookId}
        />
      ))}
    </div>
  )
}
