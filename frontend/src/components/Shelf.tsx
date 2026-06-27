import { motion } from 'framer-motion'
import Book from './Book'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Shelf, Book as BookType } from '../types'

interface ShelfProps {
  shelf: Shelf
  books: BookType[]
  onBookClick: (book: BookType) => void
  onAddBook?: (shelfId: string) => void
  onEditShelf?: (shelfId: string) => void
  onDeleteShelf?: (shelfId: string) => void
  isDrawerOpen?: boolean
  selectedBookId?: string | null
}

export default function Shelf({ shelf, books, onBookClick, onAddBook, onEditShelf, onDeleteShelf, isDrawerOpen, selectedBookId }: ShelfProps) {
  const occupied = books.filter(b => b.status !== 'borrowed').length
  const percentage = Math.min((occupied / shelf.capacity) * 100, 100)

  // Get occupancy color
  const getOccupancyColor = () => {
    if (percentage >= 90) return 'from-red-500 to-red-600'
    if (percentage >= 70) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  return (
    <motion.div
      className="bookshelf mb-4 md:mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        padding: '0',
        borderRadius: '16px',
        background: 'transparent',
        boxShadow: 'none'
      }}
    >
      {/* Wardrobe Frame */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #8B7355 0%, #6B5344 50%, #5C4532 100%)',
          borderRadius: '16px',
          padding: '8px',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.15),
            inset 0 -2px 4px rgba(0, 0, 0, 0.3)
          `,
          border: '3px solid #4A3B2F'
        }}
      >
        {/* Wood grain texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 4px),
              repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0, 0, 0, 0.015) 20px, rgba(0, 0, 0, 0.015) 22px)
            `,
            borderRadius: '13px'
          }}
        />

        {/* Inner Frame / Molding */}
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            pointerEvents: 'none',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        />

        {/* Corner Decorations */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderTopLeftRadius: '4px',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderTopRightRadius: '4px',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderBottomLeftRadius: '4px',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderBottomRightRadius: '4px',
            pointerEvents: 'none'
          }}
        />

        {/* Books Container */}
        <div
          className="flex items-end gap-0.5 px-1 pt-3 pb-0"
          style={{
            minHeight: '200px',
            perspective: '1000px',
            position: 'relative',
            zIndex: 1
          }}
        >
        {books.map((book, index) => {
          // Show borrowed placeholder if borrowed
          if (book.status === 'borrowed') {
            return (
              <motion.div
                key={book.id}
                className="borrowed-placeholder"
                style={{
                  width: '28px',
                  height: '180px',
                  background: 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 4px, transparent 4px, transparent 8px)',
                  border: '2px dashed rgba(0, 0, 0, 0.2)',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div className="text-2xl opacity-50">📤</div>
                <div className="absolute bottom-1 left-1 right-1 text-xs text-center opacity-40">
                  {book.borrowedBy}
                </div>
              </motion.div>
            )
          }

          return (
            <Book
              key={book.id}
              book={book}
              onClick={() => onBookClick(book)}
              isDrawerOpen={isDrawerOpen && selectedBookId === book.id}
            />
          )
        })}
        </div>

        {/* Shelf Surface */}
        <div
          className="shelf-surface"
          style={{
            background: 'linear-gradient(180deg, #8B7355 0%, #6B5344 50%, #5C4532 100%)',
            height: '18px',
            borderRadius: '0 0 4px 4px',
            boxShadow: `
              inset 0 2px 4px rgba(0, 0, 0, 0.4),
              inset 0 -1px 2px rgba(255, 255, 255, 0.1),
              0 4px 8px rgba(0, 0, 0, 0.2)
            `,
            position: 'relative',
            overflow: 'hidden',
            marginTop: '2px',
            border: '1px solid rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Enhanced wood grain texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0, 0, 0, 0.04) 3px, rgba(0, 0, 0, 0.04) 6px),
                repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0, 0, 0, 0.02) 8px, rgba(0, 0, 0, 0.02) 10px)
              `,
              borderRadius: '0 0 6px 6px'
            }}
          />
          {/* Top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Shelf Info */}
        <div
          className="flex items-center justify-between px-3 py-1.5 mt-2"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '0 0 8px 8px',
            minHeight: '32px'
          }}
        >
        {/* Shelf Name */}
        <div
          className="font-serif text-xs font-semibold truncate px-1"
          style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '120px' }}
        >
          {shelf.name}
        </div>

        {/* Right Section - Occupancy + Actions */}
        <div className="flex items-center gap-1.5">
          {/* Occupancy Indicator */}
          <div className="flex items-center gap-1.5">
          {/* Progress Bar */}
          <div
            className="w-16 h-1.5 rounded-full overflow-hidden flex-shrink-0"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${getOccupancyColor().replace('from-', '').replace(' to-', ', ')})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Percentage Text */}
          <div
            className="text-[10px] font-medium flex-shrink-0"
            style={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: '28px' }}
          >
            {Math.round(percentage)}%
          </div>
        </div>

        {/* Add Book Button */}
        <button
          onClick={() => onAddBook?.(shelf.id)}
          className="w-7 h-7 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/40 group flex-shrink-0"
          title={`Add book to ${shelf.name}`}
        >
          <Plus className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
        </button>

        {/* Edit Shelf Button */}
        <button
          onClick={() => onEditShelf?.(shelf.id)}
          className="w-7 h-7 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/40 group flex-shrink-0"
          title={`Edit ${shelf.name}`}
        >
          <Edit className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
        </button>

        {/* Delete Shelf Button */}
        <button
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${shelf.name}?`)) {
              onDeleteShelf?.(shelf.id)
            }
          }}
          className="w-7 h-7 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 border border-red-500/30 hover:border-red-500/50 group flex-shrink-0"
          title={`Delete ${shelf.name}`}
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300" />
        </button>
        </div>
        </div>
      </div>
    </motion.div>
  )
}
