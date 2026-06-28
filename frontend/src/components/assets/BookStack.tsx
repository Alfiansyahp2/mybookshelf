import { useState } from 'react'
import type { Book } from '../../types'

interface BookStackProps {
  books: Book[]
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onBookClick?: (book: Book) => void
}

export default function BookStack({
  books,
  maxVisible = 5,
  size = 'md',
  interactive = true,
  onBookClick
}: BookStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const sizeClasses = {
    sm: { width: 'w-16', height: 'h-20', spineWidth: 'w-3' },
    md: { width: 'w-24', height: 'h-32', spineWidth: 'w-4' },
    lg: { width: 'w-32', height: 'h-44', spineWidth: 'w-6' }
  }

  const visibleBooks = books.slice(0, maxVisible)
  const stackHeight = visibleBooks.length * 4 // 4px gap between books

  return (
    <div className="relative" style={{ height: `${stackHeight + 160}px` }}>
      {visibleBooks.map((book, index) => {
        const isVisible = index === visibleBooks.length - 1 || hoveredIndex === null || hoveredIndex >= index
        const isHovered = hoveredIndex === index

        return (
          <div
            key={book.id}
            className={`absolute left-0 transition-all duration-300 ease-out ${interactive ? 'cursor-pointer' : ''}`}
            style={{
              bottom: `${index * 4}px`,
              zIndex: index,
              transform: isVisible
                ? isHovered
                  ? 'translateX(30px) translateY(-10px) rotateZ(5deg)'
                  : 'translateX(0) translateY(0) rotateZ(0deg)'
                : 'translateX(-20px) translateY(0) rotateZ(0deg)',
              opacity: isVisible ? 1 : 0.5
            }}
            onMouseEnter={() => interactive && setHoveredIndex(index)}
            onMouseLeave={() => interactive && setHoveredIndex(null)}
            onClick={() => onBookClick?.(book)}
          >
            {/* Book Spine (Visible from stack) */}
            <div
              className={`rounded-l ${sizeClasses[size].height} ${sizeClasses[size].spineWidth} shadow-lg`}
              style={{
                background: `linear-gradient(to right, ${book.spineColors[2]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[0]} 100%)`,
                boxShadow: `2px 2px 8px ${book.spineColors[2]}40`
              }}
            >
              {/* Spine Title */}
              <div className="h-full flex items-center justify-center py-2">
                <div
                  className="text-white font-serif font-bold text-center leading-tight"
                  style={{
                    fontSize: size === 'lg' ? '0.5rem' : '0.4375rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    maxWidth: '80%',
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
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                }}
              />
            </div>

            {/* Hover Tooltip */}
            {isHovered && (
              <div
                className="absolute left-full ml-4 top-0 bg-white rounded-lg shadow-xl p-3 z-50 pointer-events-none"
                style={{ minWidth: '200px' }}
              >
                <div className="font-serif font-bold text-darkBrown truncate mb-1">
                  {book.title}
                </div>
                <div className="text-sm text-walnut/70">{book.author}</div>
                {book.genre && (
                  <div className="mt-2 inline-block px-2 py-1 bg-walnut/10 rounded-full text-xs text-walnut/70">
                    {book.genre}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Stack Shadow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 rounded-lg blur-sm opacity-30"
        style={{
          background: `linear-gradient(to top, ${visibleBooks[visibleBooks.length - 1]?.spineColors[2]}, transparent)`,
          transform: 'translateY(-8px)'
        }}
      />
    </div>
  )
}
