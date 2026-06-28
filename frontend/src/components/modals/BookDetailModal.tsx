import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Edit, Trash2, Star, Calendar, Heart, Play, Check } from 'lucide-react'
import { useUpdateProgress, useToggleFavorite, useUpdateNotes, useUpdateRating, useStartReading, useFinishReading } from '../../hooks/useBooks'
import type { Book } from '../../types'
import ReadingProgressSection from '../book-details/ReadingProgressSection'
import ReadingSessionTimer from '../book-details/ReadingSessionTimer'
import BookNotesSection from '../book-details/BookNotesSection'
import BookPurchaseInfo from '../book-details/BookPurchaseInfo'
import BookStatusBadge from '../book-details/BookStatusBadge'

interface BookDetailModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (book: Book) => void
  onDelete?: (bookId: string) => void
}

export default function BookDetailModal({
  book,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: BookDetailModalProps) {
  const updateProgress = useUpdateProgress()
  const toggleFavorite = useToggleFavorite()
  const updateNotes = useUpdateNotes()
  const updateRating = useUpdateRating()
  const startReading = useStartReading()
  const finishReading = useFinishReading()

  const [userRating, setUserRating] = useState(0)
  const [userNotes, setUserNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState('')

  // Reset form when book changes
  useEffect(() => {
    if (book) {
      setUserRating(book.personalRating || 0)
      setUserNotes(book.personalNotes || '')
      setTempNotes(book.personalNotes || '')
      setIsEditingNotes(false)
    }
  }, [book])

  // Early return if no book
  if (!book) return null

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(book.id)
  }

  const handleUpdateRating = (rating: number) => {
    setUserRating(rating)
    updateRating.mutate({
      id: book.id,
      rating: rating
    })
  }

  const handleUpdateNotes = () => {
    updateNotes.mutate({
      id: book.id,
      notes: tempNotes
    })
    setUserNotes(tempNotes)
    setIsEditingNotes(false)
  }

  const handleProgressChange = (currentPage: number) => {
    updateProgress.mutate({
      id: book.id,
      currentPage: currentPage
    })
  }

  const handleStartReading = () => {
    if (book.status === 'unread') {
      startReading.mutate(book.id)
    }
  }

  const handleFinishReading = () => {
    if (book.status === 'reading') {
      finishReading.mutate(book.id)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-walnut/10 bg-gradient-to-r from-walnut/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-walnut/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-walnut" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-darkBrown">Book Details</h2>
                    <p className="text-sm text-walnut/60">{book.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(book)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
                          onDelete(book.id)
                          onClose()
                        }
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-walnut/10 hover:bg-walnut/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-walnut" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex gap-6">
                  {/* Left Side - Book Cover + All Actions */}
                  <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                    {/* Book Cover */}
                    <div className="w-full aspect-[3/4] rounded-xl shadow-2xl relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${book.spineColors?.[0] || '#8B7355'} 0%, ${book.spineColors?.[1] || '#6B5344'} 50%, ${book.spineColors?.[2] || '#5C4532'} 100%)`
                      }}
                    >
                      <div className="h-full p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-serif font-bold text-lg mb-1 leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                            {book.title}
                          </h3>
                          <p className="text-white/90 text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                            {book.author}
                          </p>
                        </div>

                        {book.genre && (
                          <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                            <span className="text-white text-xs font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
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

                      {/* Spine Effect */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-8 rounded-l-xl"
                        style={{
                          background: `linear-gradient(to right, ${book.spineColors?.[2] || '#5C4532'} 0%, ${book.spineColors?.[1] || '#6B5344'} 50%, ${book.spineColors?.[0] || '#8B7355'} 100%)`,
                          boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Favorite */}
                      <button
                        onClick={handleToggleFavorite}
                        disabled={toggleFavorite.isPending}
                        className={`p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:scale-105 ${
                          (book.favorite || book.isFavorite)
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-walnut/20 text-walnut hover:bg-walnut/30'
                        }`}
                        title={(book.favorite || book.isFavorite) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-5 h-5 ${(book.favorite || book.isFavorite) ? 'fill-red-500' : ''}`} />
                      </button>

                      {/* Start/Finish Reading */}
                      {book.status === 'unread' && (
                        <button
                          onClick={handleStartReading}
                          disabled={startReading.isPending}
                          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:scale-105 flex items-center justify-center"
                          title="Start reading this book"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}

                      {book.status === 'reading' && (
                        <button
                          onClick={handleFinishReading}
                          disabled={finishReading.isPending}
                          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center"
                          title="Finish reading this book"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Your Rating Section */}
                    <div className="p-4 bg-white rounded-xl border border-walnut/10 shadow-sm">
                      <div className="text-center mb-3">
                        <div className="text-sm font-semibold text-darkBrown mb-2 flex items-center justify-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          Your Rating
                        </div>
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleUpdateRating(star)}
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= userRating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {userRating > 0 && (
                        <div className="text-xs text-center text-walnut/60">
                          {userRating} star{userRating !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {/* Metadata - Compact */}
                    <div className="space-y-2">
                      {book.publisher && (
                        <div className="p-2 bg-walnut/10 rounded-lg">
                          <div className="text-xs text-walnut/60 mb-0.5">Publisher</div>
                          <div className="text-sm font-medium text-darkBrown">{book.publisher}</div>
                        </div>
                      )}

                      {book.isbn && (
                        <div className="p-2 bg-walnut/10 rounded-lg">
                          <div className="text-xs text-walnut/60 mb-0.5">ISBN</div>
                          <div className="text-sm font-medium text-darkBrown font-mono">{book.isbn}</div>
                        </div>
                      )}

                      {book.format && (
                        <div className="p-2 bg-walnut/10 rounded-lg">
                          <div className="text-xs text-walnut/60 mb-0.5">Format</div>
                          <div className="text-sm font-medium text-darkBrown capitalize">{book.format}</div>
                        </div>
                      )}

                      {book.language && (
                        <div className="p-2 bg-walnut/10 rounded-lg">
                          <div className="text-xs text-walnut/60 mb-0.5">Language</div>
                          <div className="text-sm font-medium text-darkBrown capitalize">{book.language}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Book Details */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-darkBrown mb-1">{book.title}</h2>
                      <p className="text-lg text-walnut/80">{book.author}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {book.pages && (
                        <div className="text-center p-3 bg-walnut/10 rounded-lg">
                          <BookOpen className="w-6 h-6 text-walnut mx-auto mb-1" />
                          <div className="text-lg font-bold text-darkBrown">{book.pages}</div>
                          <div className="text-xs text-walnut/70">Pages</div>
                        </div>
                      )}

                      {book.publishYear && (
                        <div className="text-center p-3 bg-walnut/10 rounded-lg">
                          <Calendar className="w-6 h-6 text-walnut mx-auto mb-1" />
                          <div className="text-lg font-bold text-darkBrown">{book.publishYear}</div>
                          <div className="text-xs text-walnut/70">Year</div>
                        </div>
                      )}

                      {book.genre && (
                        <div className="text-center p-3 bg-walnut/10 rounded-lg">
                          <div className="w-6 h-6 bg-walnut/20 rounded-full flex items-center justify-center mx-auto mb-1">
                            <span className="text-xs font-bold text-walnut">{book.genre[0] || '?'}</span>
                          </div>
                          <div className="text-sm font-medium text-darkBrown truncate">{book.genre}</div>
                        </div>
                      )}

                      {/* Rating Display */}
                      {book.personalRating && (
                        <div className="text-center p-3 bg-walnut/10 rounded-lg">
                          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 mx-auto mb-1" />
                          <div className="text-lg font-bold text-darkBrown">{book.personalRating}/5</div>
                          <div className="text-xs text-walnut/70">Rating</div>
                        </div>
                      )}
                    </div>

                    {/* Reading Progress */}
                    {book.status === 'reading' && (
                      <ReadingProgressSection
                        book={book}
                        onProgressChange={handleProgressChange}
                      />
                    )}

                    {/* Reading Session Timer */}
                    <ReadingSessionTimer
                      book={book}
                      updateProgress={updateProgress}
                    />

                    {/* Personal Notes */}
                    <BookNotesSection
                      userNotes={userNotes}
                      tempNotes={tempNotes}
                      isEditingNotes={isEditingNotes}
                      updateNotes={updateNotes}
                      onEdit={() => {
                        setTempNotes(userNotes)
                        setIsEditingNotes(true)
                      }}
                      onSave={handleUpdateNotes}
                      onCancel={() => setIsEditingNotes(false)}
                      onTempNotesChange={setTempNotes}
                    />

                    {/* Status Badge */}
                    <BookStatusBadge book={book} />

                    {/* Purchase Info */}
                    <BookPurchaseInfo book={book} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
