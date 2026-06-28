import { useState } from 'react'
import { BookOpen, Star, Heart, Edit, Trash2 } from 'lucide-react'
import type { Book } from '../../types'

interface BookshelfViewProps {
  books: Book[]
  shelfName?: string
  shelfColor?: string
  onBookClick?: (book: Book) => void
  onBookEdit?: (book: Book) => void
  onBookDelete?: (book: Book) => void
}

export default function BookshelfView({
  books,
  shelfName = 'My Bookshelf',
  shelfColor = '#8B7355',
  onBookClick,
  onBookEdit,
  onBookDelete
}: BookshelfViewProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)

  return (
    <div className="relative">
      {/* Wooden Shelf Structure */}
      <div className="relative" style={{ perspective: '1000px' }}>
        {/* Shelf Board */}
        <div
          className="relative h-8 rounded-lg shadow-xl mb-0"
          style={{
            background: `linear-gradient(to bottom, ${shelfColor} 0%, ${shadeColor(shelfColor, -20)} 100%)`,
            boxShadow: `0 4px 20px ${shadeColor(shelfColor, -40)}, inset 0 2px 4px ${shadeColor(shelfColor, 30)}`,
            border: `1px solid ${shadeColor(shelfColor, -10)}`
          }}
        >
          {/* Wood Grain Texture */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                ${shadeColor(shelfColor, -10)} 2px,
                ${shadeColor(shelfColor, -10)} 4px
              )`
            }}
          />

          {/* Shelf Name Plate */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <div
              className="px-4 py-1 rounded shadow-md"
              style={{ backgroundColor: shelfColor }}
            >
              <span className="text-white text-sm font-serif font-semibold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                {shelfName}
              </span>
            </div>
          </div>
        </div>

        {/* Books on Shelf */}
        <div
          className="flex items-end gap-1 px-4 -mt-12 pb-2"
          style={{
            minHeight: '180px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 100%)'
          }}
        >
          {books.map((book, index) => {
            const isHovered = hoveredBook === book.id
            const bookHeight = 140 + (book.height === 'tall' ? 20 : book.height === 'short' ? -20 : 0)
            const bookWidth = 20 + (book.thickness === 'thick' ? 15 : book.thickness === 'thin' ? -5 : 5)

            return (
              <div
                key={book.id}
                className="relative group"
                style={{ height: `${bookHeight}px` }}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                {/* Book Spine */}
                <div
                  className={`h-full rounded shadow-md transition-all duration-300 ${
                    onBookClick ? 'cursor-pointer' : ''
                  }`}
                  style={{
                    width: `${bookWidth}px`,
                    background: `linear-gradient(to right, ${book.spineColors[2]} 0%, ${book.spineColors[1]} 40%, ${book.spineColors[0]} 100%)`,
                    transform: isHovered ? 'translateY(-10px) rotateX(5deg)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? `0 10px 25px ${book.spineColors[2]}60, 0 0 15px ${book.spineColors[0]}40`
                      : `2px 0 8px ${shadeColor(shelfColor, -50)}`,
                    borderLeft: `1px solid ${shadeColor(book.spineColors[2], 20)}`,
                    borderRight: `1px solid ${shadeColor(book.spineColors[0], -20)}`
                  }}
                  onClick={() => onBookClick?.(book)}
                >
                  {/* Spine Title */}
                  <div className="h-full flex items-center justify-center py-2 px-1">
                    <div
                      className="text-white font-serif font-bold text-center leading-tight"
                      style={{
                        fontSize: '0.5rem',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {book.title}
                    </div>
                  </div>

                  {/* Spine Shine */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)'
                    }}
                  />

                  {/* Status Indicator */}
                  {book.status === 'reading' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full shadow-sm" />
                  )}
                  {book.status === 'finished' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
                  )}
                  {book.favorite && (
                    <div className="absolute top-3 right-1">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    </div>
                  )}
                </div>

                {/* Hover Actions */}
                {isHovered && (
                  <div
                    className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-1 z-10"
                    style={{ transform: 'translate(-50%, 0)' }}
                  >
                    {onBookEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onBookEdit(book)
                        }}
                        className="w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Edit className="w-3 h-3 text-walnut" />
                      </button>
                    )}
                    {onBookDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onBookDelete(book)
                        }}
                        className="w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                )}

                {/* Quick Info Tooltip */}
                {isHovered && (
                  <div
                    className="absolute left-full ml-4 top-0 bg-white rounded-lg shadow-xl p-3 z-10 pointer-events-none min-w-[180px]"
                  >
                    <div className="font-serif font-bold text-darkBrown text-sm line-clamp-1 mb-1">
                      {book.title}
                    </div>
                    <div className="text-xs text-walnut/70 mb-2">{book.author}</div>

                    {book.progress !== undefined && book.progress > 0 && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-walnut/60">Progress</span>
                          <span className="font-medium text-darkBrown">{book.progress}%</span>
                        </div>
                        <div className="h-1 bg-walnut/20 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${book.progress}%`,
                              background: `linear-gradient(90deg, ${book.spineColors[0]}, ${book.spineColors[2]})`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {book.personalRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-darkBrown">{book.personalRating}/5</span>
                      </div>
                  )}
                </div>
                )}
              </div>
            )
          })}

          {/* Empty Slots (for visual balance) */}
          {books.length < 10 && Array.from({ length: Math.min(5, 10 - books.length) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-32 w-3 rounded opacity-10"
              style={{
                background: `linear-gradient(to bottom, ${shadeColor(shelfColor, -30)} 0%, ${shadeColor(shelfColor, -40)} 100%)`
              }}
            />
          ))}
        </div>

        {/* Shelf Shadow */}
        <div
          className="h-2 rounded-lg blur-sm opacity-20"
          style={{
            background: `linear-gradient(to bottom, ${shadeColor(shelfColor, -50)}, transparent)`
          }}
        />
      </div>
    </div>
  )
}

// Helper function to shade colors
function shadeColor(color: string, percent: number) {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
}
