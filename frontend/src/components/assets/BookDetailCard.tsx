import { useState } from 'react'
import { Calendar, BookOpen, Star, Heart, Share2, MessageSquare, TrendingUp } from 'lucide-react'
import type { Book } from '../../types'

interface BookDetailCardProps {
  book: Book
  showActions?: boolean
  onFavorite?: () => void
  onShare?: () => void
  onRate?: (rating: number) => void
}

export default function BookDetailCard({
  book,
  showActions = true,
  onFavorite,
  onShare,
  onRate
}: BookDetailCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedRating, setSelectedRating] = useState(book.personalRating || 0)

  const handleRate = (rating: number) => {
    setSelectedRating(rating)
    onRate?.(rating)
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hero Section with Book Cover */}
      <div className="relative p-8 bg-gradient-to-br from-cream to-beige">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              ${book.spineColors[0]},
              ${book.spineColors[0]} 1px,
              transparent 1px,
              transparent 10px
            )`
          }}
        />

        <div className="relative flex gap-8">
          {/* 3D Book Cover */}
          <div className="relative flex-shrink-0">
            <div
              className="w-48 h-64 rounded-lg shadow-2xl relative overflow-hidden transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[2]} 100%)`,
                transform: isHovered ? 'translateY(-8px) rotateX(5deg)' : 'translateY(0) rotateX(0deg)',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Cover Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-serif font-bold text-2xl mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {book.title}
                  </h3>
                  <p className="text-white/90 text-base" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {book.author}
                  </p>
                </div>

                {book.genre && (
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-white text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                      {book.genre}
                    </span>
                  </div>
                )}

                {/* Shine Effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)'
                  }}
                />
              </div>

              {/* Spine */}
              <div
                className="absolute left-0 top-0 bottom-0 w-12 rounded-l-lg"
                style={{
                  background: `linear-gradient(to right, ${book.spineColors[2]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[0]} 100%)`,
                  transform: 'translateZ(-20px) rotateY(-90deg)',
                  boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)'
                }}
              >
                <div className="h-full flex items-center justify-center py-4">
                  <div
                    className="text-white font-serif font-bold text-center leading-tight text-sm"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {book.title}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-darkBrown mb-2">
                {book.title}
              </h2>
              <p className="text-xl text-walnut/80">{book.author}</p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-walnut/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-walnut" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-darkBrown">{book.pages}</div>
                  <div className="text-xs text-walnut/70">Pages</div>
                </div>
              </div>

              {book.publishYear && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-walnut/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-walnut" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-darkBrown">{book.publishYear}</div>
                    <div className="text-xs text-walnut/70">Year</div>
                  </div>
                </div>
              )}

              {book.personalRating && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-walnut/10 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-walnut fill-walnut" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-darkBrown">{book.personalRating}/5</div>
                    <div className="text-xs text-walnut/70">Rating</div>
                  </div>
                </div>
              )}
            </div>

            {/* Rating Stars */}
            {onRate && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-walnut/70">Your rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= selectedRating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={onFavorite}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  book.favorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-walnut hover:scale-110'
                } shadow-lg`}
              >
                <Heart className={`w-5 h-5 ${book.favorite ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={onShare}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
              >
                <Share2 className="w-5 h-5 text-walnut" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 space-y-6">
        {/* Progress Bar (if reading) */}
        {book.status === 'reading' && book.progress !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-darkBrown">Reading Progress</span>
              <span className="text-walnut/70">{book.progress}%</span>
            </div>
            <div className="h-2 bg-walnut/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${book.progress}%`,
                  background: `linear-gradient(90deg, ${book.spineColors[0]}, ${book.spineColors[2]})`
                }}
              />
            </div>
            {book.currentPage && book.pages && (
              <div className="flex justify-between text-xs mt-1 text-walnut/60">
                <span>Page {book.currentPage}</span>
                <span>of {book.pages}</span>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          {book.publisher && (
            <div>
              <div className="text-xs text-walnut/60 mb-1">Publisher</div>
              <div className="text-sm font-medium text-darkBrown">{book.publisher}</div>
            </div>
          )}
          {book.isbn && (
            <div>
              <div className="text-xs text-walnut/60 mb-1">ISBN</div>
              <div className="text-sm font-medium text-darkBrown">{book.isbn}</div>
            </div>
          )}
          {book.format && (
            <div>
              <div className="text-xs text-walnut/60 mb-1">Format</div>
              <div className="text-sm font-medium text-darkBrown capitalize">{book.format}</div>
            </div>
          )}
          {book.language && (
            <div>
              <div className="text-xs text-walnut/60 mb-1">Language</div>
              <div className="text-sm font-medium text-darkBrown capitalize">{book.language}</div>
            </div>
          )}
        </div>

        {/* Personal Notes */}
        {book.personalNotes && (
          <div>
            <div className="text-xs text-walnut/60 mb-2">Personal Notes</div>
            <div className="p-4 bg-walnut/10 rounded-lg">
              <p className="text-sm text-darkBrown whitespace-pre-wrap">{book.personalNotes}</p>
            </div>
          </div>
        )}

        {/* Purchase Info */}
        {book.purchaseDate && (
          <div className="flex items-center gap-4 p-3 bg-walnut/10 rounded-lg">
            <Calendar className="w-5 h-5 text-walnut/70" />
            <div>
              <div className="text-xs text-walnut/60">Purchased</div>
              <div className="text-sm font-medium text-darkBrown">
                {new Date(book.purchaseDate).toLocaleDateString()}
              </div>
            </div>
            {book.purchasePrice && (
              <div className="ml-auto">
                <div className="text-lg font-semibold text-darkBrown">
                  ${book.purchasePrice.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
