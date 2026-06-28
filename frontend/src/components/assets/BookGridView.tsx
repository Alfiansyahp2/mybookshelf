import { useState } from 'react'
import { BookOpen, Star, Heart, TrendingUp, Clock } from 'lucide-react'
import type { Book, BookStatus } from '../../types'

interface BookGridViewProps {
  books: Book[]
  filterStatus?: BookStatus
  columns?: 2 | 3 | 4 | 5
  onBookClick?: (book: Book) => void
  showProgress?: boolean
}

export default function BookGridView({
  books,
  filterStatus,
  columns = 4,
  onBookClick,
  showProgress = true
}: BookGridViewProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5'
  }

  const filteredBooks = filterStatus
    ? books.filter(book => book.status === filterStatus)
    : books

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {filteredBooks.map((book) => {
        const isHovered = hoveredBook === book.id

        return (
          <div
            key={book.id}
            className="group relative"
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
          >
            {/* Book Card */}
            <div
              className={`relative transition-all duration-300 ${onBookClick ? 'cursor-pointer' : ''}`}
              style={{
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)'
              }}
              onClick={() => onBookClick?.(book)}
            >
              {/* 3D Book Effect */}
              <div
                className="w-full aspect-[2/3] rounded-lg shadow-xl relative overflow-hidden transition-shadow duration-300"
                style={{
                  background: `linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[2]} 100%)`,
                  boxShadow: isHovered
                    ? `0 20px 40px -5px ${book.spineColors[2]}80, 0 0 20px ${book.spineColors[0]}40`
                    : `0 10px 30px -5px ${book.spineColors[2]}60`
                }}
              >
                {/* Cover Content */}
                <div className="relative h-full p-4 flex flex-col justify-between">
                  {/* Top */}
                  <div className="space-y-2">
                    <h3 className="text-white font-serif font-bold leading-tight line-clamp-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                      {book.title}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                      {book.author}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className="space-y-2">
                    {book.genre && (
                      <div className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-white text-xs font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                          {book.genre}
                        </span>
                      </div>
                    )}

                    {book.personalRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                          {book.personalRating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Shine Effect */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)'
                    }}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        book.status === 'reading'
                          ? 'bg-green-500/80 text-white'
                          : book.status === 'finished'
                          ? 'bg-blue-500/80 text-white'
                          : book.status === 'wishlist'
                          ? 'bg-purple-500/80 text-white'
                          : 'bg-walnut/80 text-white'
                      }`}
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                    >
                      {book.status}
                    </div>
                  </div>
                </div>

                {/* Spine Effect */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-8 rounded-l-lg"
                  style={{
                    background: `linear-gradient(to right, ${book.spineColors[2]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[0]} 100%)`,
                    transform: 'translateZ(-20px)',
                    boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)'
                  }}
                />
              </div>

              {/* Hover Info Card */}
              {isHovered && (
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-2xl p-4 z-10"
                  style={{ transform: 'translate(-50%, -100%)' }}
                >
                  {/* Progress Bar (if reading) */}
                  {showProgress && book.status === 'reading' && book.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-walnut/60">Progress</span>
                        <span className="font-medium text-darkBrown">{book.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-walnut/20 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${book.progress}%`,
                            background: `linear-gradient(90deg, ${book.spineColors[0]}, ${book.spineColors[2]})`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {book.pages && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-walnut/70" />
                        <span className="text-walnut/60">{book.pages} pages</span>
                      </div>
                    )}

                    {book.publishYear && (
                      <div className="flex items-center gap-1">
                        <span className="text-walnut/60">{book.publishYear}</span>
                      </div>
                    )}

                    {book.favorite && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        <span className="text-walnut/60">Favorite</span>
                      </div>
                    )}

                    {book.status === 'reading' && book.startedDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-walnut/70" />
                        <span className="text-walnut/60">
                          {Math.ceil((Date.now() - new Date(book.startedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Publisher */}
                  {book.publisher && (
                    <div className="mt-2 pt-2 border-t border-walnut/10">
                      <div className="text-xs text-walnut/60">{book.publisher}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Title (always visible) */}
            <div className="mt-3 text-center">
              <h4 className="font-semibold text-darkBrown text-sm line-clamp-1">{book.title}</h4>
              <p className="text-xs text-walnut/70 line-clamp-1">{book.author}</p>
            </div>

            {/* Favorite Heart (always visible if favorite) */}
            {book.favorite && (
              <div className="absolute top-2 right-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
