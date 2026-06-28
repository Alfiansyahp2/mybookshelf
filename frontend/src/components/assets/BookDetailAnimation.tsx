import { useState, useEffect } from 'react'
import { X, Star, Heart, Share2, BookOpen, Calendar, TrendingUp, Clock, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Book } from '../../types'

interface BookDetailAnimationProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onFavorite?: () => void
  onRate?: (rating: number) => void
}

export default function BookDetailAnimation({
  book,
  isOpen,
  onClose,
  onFavorite,
  onRate
}: BookDetailAnimationProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedRating, setSelectedRating] = useState(book?.personalRating || 0)

  useEffect(() => {
    if (book) {
      setSelectedRating(book.personalRating || 0)
      setCurrentPage(0)
    }
  }, [book])

  if (!book) return null

  const handleRate = (rating: number) => {
    setSelectedRating(rating)
    onRate?.(rating)
  }

  const handleNextPage = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + 1, 2))
      setTimeout(() => setIsAnimating(false), 300)
    }, 150)
  }

  const handlePrevPage = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - 1, 0))
      setTimeout(() => setIsAnimating(false), 300)
    }, 150)
  }

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Book Animation Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative"
              style={{ perspective: '2000px' }}
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onClose}
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-50"
              >
                <X className="w-6 h-6 text-walnut" />
              </motion.button>

              {/* Open Book */}
              <div className="relative flex" style={{ width: '800px', height: '600px' }}>
                {/* Left Page - Book Cover Back */}
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: isOpen ? -30 : 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="relative w-1/2 h-full"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
                >
                  {/* Book Back Cover */}
                  <div
                    className="absolute inset-0 rounded-l-lg shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${book.spineColors[2]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[0]} 100%)`,
                      transform: 'translateZ(-20px)'
                    }}
                  >
                    <div className="h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <div
                          className="text-white font-serif font-bold text-2xl mb-4"
                          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                        >
                          {book.title}
                        </div>
                        <div
                          className="text-white/90 text-lg"
                          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                        >
                          {book.author}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Page Content */}
                  <motion.div
                    initial={{ rotateY: 0, opacity: 0 }}
                    animate={{ rotateY: isOpen ? 180 : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
                    className="absolute inset-0 bg-white rounded-l-lg shadow-xl"
                    style={{ transformOrigin: 'right center', backfaceVisibility: 'hidden' }}
                  >
                    <div className="h-full p-8 overflow-y-auto">
                      {/* Page 1 Content - Book Info */}
                      {currentPage === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-6"
                        >
                          {/* Title & Author */}
                          <div className="border-b-2 border-walnut/20 pb-4">
                            <h2 className="text-3xl font-serif font-bold text-darkBrown mb-2">
                              {book.title}
                            </h2>
                            <p className="text-xl text-walnut/80">{book.author}</p>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-walnut/10 rounded-lg">
                              <BookOpen className="w-8 h-8 text-walnut" />
                              <div>
                                <div className="text-2xl font-bold text-darkBrown">{book.pages}</div>
                                <div className="text-xs text-walnut/70">Pages</div>
                              </div>
                            </div>

                            {book.publishYear && (
                              <div className="flex items-center gap-3 p-3 bg-walnut/10 rounded-lg">
                                <Calendar className="w-8 h-8 text-walnut" />
                                <div>
                                  <div className="text-2xl font-bold text-darkBrown">{book.publishYear}</div>
                                  <div className="text-xs text-walnut/70">Year</div>
                                </div>
                              </div>
                            )}

                            {book.personalRating && (
                              <div className="flex items-center gap-3 p-3 bg-walnut/10 rounded-lg">
                                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                                <div>
                                  <div className="text-2xl font-bold text-darkBrown">{book.personalRating}/5</div>
                                  <div className="text-xs text-walnut/70">Rating</div>
                                </div>
                              </div>
                            )}

                            {book.genre && (
                              <div className="flex items-center gap-3 p-3 bg-walnut/10 rounded-lg">
                                <div className="w-8 h-8 bg-walnut/20 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-walnut">{book.genre[0]}</span>
                                </div>
                                <div>
                                  <div className="text-lg font-bold text-darkBrown truncate">{book.genre}</div>
                                  <div className="text-xs text-walnut/70">Genre</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Rating System */}
                          {onRate && (
                            <div>
                              <div className="text-sm text-walnut/70 mb-2">Rate this book:</div>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <motion.button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="transition-transform"
                                  >
                                    <Star
                                      className={`w-8 h-8 ${
                                        star <= selectedRating
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={onFavorite}
                              className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                                book.favorite
                                  ? 'bg-red-500 text-white'
                                  : 'bg-walnut/20 text-walnut hover:bg-walnut/30'
                              }`}
                            >
                              <Heart className={`w-5 h-5 ${book.favorite ? 'fill-white' : ''}`} />
                              {book.favorite ? 'Favorited' : 'Favorite'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 px-4 py-3 bg-walnut/20 text-walnut rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-walnut/30"
                            >
                              <Share2 className="w-5 h-5" />
                              Share
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Page 2 Content - Reading Progress */}
                      {currentPage === 1 && book.status === 'reading' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-6"
                        >
                          <h3 className="text-2xl font-serif font-bold text-darkBrown mb-4">
                            Reading Progress
                          </h3>

                          {book.progress !== undefined && (
                            <div>
                              <div className="flex justify-between text-lg mb-3">
                                <span className="font-medium text-darkBrown">Progress</span>
                                <span className="text-walnut/70">{book.progress}%</span>
                              </div>
                              <div className="h-4 bg-walnut/20 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${book.progress}%` }}
                                  transition={{ duration: 1, delay: 0.8 }}
                                  className="h-full rounded-full"
                                  style={{
                                    background: `linear-gradient(90deg, ${book.spineColors[0]}, ${book.spineColors[2]})`
                                  }}
                                />
                              </div>
                              {book.currentPage && book.pages && (
                                <div className="flex justify-between text-sm mt-2 text-walnut/60">
                                  <span>Page {book.currentPage}</span>
                                  <span>of {book.pages}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {book.startedDate && (
                            <div className="flex items-center gap-3 p-4 bg-walnut/10 rounded-lg">
                              <Clock className="w-8 h-8 text-walnut" />
                              <div>
                                <div className="text-sm text-walnut/70">Reading since</div>
                                <div className="text-lg font-medium text-darkBrown">
                                  {new Date(book.startedDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-walnut/60">
                                  {Math.ceil((Date.now() - new Date(book.startedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                </div>
                              </div>
                            </div>
                          )}

                          {book.status === 'reading' && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-900">Currently Reading</span>
                              </div>
                              <p className="text-sm text-green-700">
                                Keep track of your reading journey!
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Page 2 Content - Details (if not reading) */}
                      {currentPage === 1 && book.status !== 'reading' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-4"
                        >
                          <h3 className="text-2xl font-serif font-bold text-darkBrown mb-4">
                            Book Details
                          </h3>

                          <div className="space-y-3">
                            {book.publisher && (
                              <div className="flex justify-between p-3 bg-walnut/10 rounded-lg">
                                <span className="text-walnut/70">Publisher</span>
                                <span className="font-medium text-darkBrown">{book.publisher}</span>
                              </div>
                            )}

                            {book.isbn && (
                              <div className="flex justify-between p-3 bg-walnut/10 rounded-lg">
                                <span className="text-walnut/70">ISBN</span>
                                <span className="font-medium text-darkBrown font-mono text-sm">{book.isbn}</span>
                              </div>
                            )}

                            {book.format && (
                              <div className="flex justify-between p-3 bg-walnut/10 rounded-lg">
                                <span className="text-walnut/70">Format</span>
                                <span className="font-medium text-darkBrown capitalize">{book.format}</span>
                              </div>
                            )}

                            {book.language && (
                              <div className="flex justify-between p-3 bg-walnut/10 rounded-lg">
                                <span className="text-walnut/70">Language</span>
                                <span className="font-medium text-darkBrown capitalize">{book.language}</span>
                              </div>
                            )}

                            {book.purchaseDate && (
                              <div className="flex justify-between p-3 bg-walnut/10 rounded-lg">
                                <span className="text-walnut/70">Purchased</span>
                                <span className="font-medium text-darkBrown">
                                  {new Date(book.purchaseDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            {book.purchasePrice && (
                              <div className="flex justify-between p-3 bg-walnut/10 rounded-lg">
                                <span className="text-walnut/70">Price</span>
                                <span className="font-medium text-darkBrown">${book.purchasePrice.toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex justify-center mt-4">
                            <div
                              className={`px-4 py-2 rounded-full font-medium ${
                                book.status === 'reading'
                          ? 'bg-green-100 text-green-800'
                          : book.status === 'finished'
                          ? 'bg-blue-100 text-blue-800'
                          : book.status === 'wishlist'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                            >
                              {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Page - Book Cover Front */}
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: isOpen ? 30 : 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="relative w-1/2 h-full"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
                >
                  {/* Book Front Cover */}
                  <div
                    className="absolute inset-0 rounded-r-lg shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[2]} 100%)`,
                      transform: 'translateZ(20px)'
                    }}
                  >
                    <div className="h-full flex flex-col justify-between p-8">
                      <div>
                        <div
                          className="text-white font-serif font-bold text-3xl mb-3 leading-tight"
                          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                        >
                          {book.title}
                        </div>
                        <div
                          className="text-white/90 text-xl"
                          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                        >
                          {book.author}
                        </div>
                      </div>

                      {book.genre && (
                        <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                          <span
                            className="text-white font-medium"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                          >
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
                  </div>

                  {/* Right Page Content */}
                  <motion.div
                    initial={{ rotateY: 0, opacity: 0 }}
                    animate={{ rotateY: isOpen ? -180 : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
                    className="absolute inset-0 bg-white rounded-r-lg shadow-xl"
                    style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden' }}
                  >
                    <div className="h-full p-8 overflow-y-auto">
                      {/* Page 1 Content - Notes & Timeline */}
                      {currentPage === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-6"
                        >
                          {/* Personal Notes */}
                          {book.personalNotes ? (
                            <div>
                              <h3 className="text-lg font-serif font-bold text-darkBrown mb-3 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Personal Notes
                              </h3>
                              <div className="p-4 bg-walnut/10 rounded-lg">
                                <p className="text-sm text-darkBrown whitespace-pre-wrap leading-relaxed">
                                  {book.personalNotes}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <MessageSquare className="w-12 h-12 text-walnut/30 mx-auto mb-3" />
                              <p className="text-walnut/60 text-sm">No personal notes yet</p>
                              <button className="mt-3 text-sm text-walnut/70 hover:text-darkBrown transition-colors">
                                + Add notes
                              </button>
                            </div>
                          )}

                          {/* Reading Timeline */}
                          <div>
                            <h3 className="text-lg font-serif font-bold text-darkBrown mb-3">Timeline</h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 p-3 bg-walnut/10 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <div className="flex-1">
                                  <div className="text-sm text-darkBrown">Added to library</div>
                                  <div className="text-xs text-walnut/60">
                                    {new Date(book.dateAdded).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              {book.startedDate && (
                                <div className="flex items-center gap-3 p-3 bg-walnut/10 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <div className="flex-1">
                                    <div className="text-sm text-darkBrown">Started reading</div>
                                    <div className="text-xs text-walnut/60">
                                      {new Date(book.startedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {book.finishedDate && (
                                <div className="flex items-center gap-3 p-3 bg-walnut/10 rounded-lg">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                  <div className="flex-1">
                                    <div className="text-sm text-darkBrown">Finished reading</div>
                                    <div className="text-xs text-walnut/60">
                                      {new Date(book.finishedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Page 2 Content - Collections & More */}
                      {currentPage === 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-6"
                        >
                          <h3 className="text-2xl font-serif font-bold text-darkBrown mb-4">
                            More Information
                          </h3>

                          {/* Physical Attributes */}
                          <div>
                            <h4 className="text-lg font-semibold text-darkBrown mb-3">Physical Attributes</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-walnut/10 rounded-lg">
                                <div className="text-xs text-walnut/70">Height</div>
                                <div className="text-sm font-medium text-darkBrown capitalize">{book.height}</div>
                              </div>
                              <div className="p-3 bg-walnut/10 rounded-lg">
                                <div className="text-xs text-walnut/70">Thickness</div>
                                <div className="text-sm font-medium text-darkBrown Capitalize">{book.thickness}</div>
                              </div>
                              <div className="p-3 bg-walnut/10 rounded-lg">
                                <div className="text-xs text-walnut/70">Format</div>
                                <div className="text-sm font-medium text-darkBrown Capitalize">{book.format}</div>
                              </div>
                              <div className="p-3 bg-walnut/10 rounded-lg">
                                <div className="text-xs text-walnut/70">Pages</div>
                                <div className="text-sm font-medium text-darkBrown">{book.pages}</div>
                              </div>
                            </div>
                          </div>

                          {/* Color Palette */}
                          <div>
                            <h4 className="text-lg font-semibold text-darkBrown mb-3">Spine Colors</h4>
                            <div className="flex gap-3">
                              {book.spineColors.map((color, index) => (
                                <div key={index} className="flex-1">
                                  <div
                                    className="h-16 rounded-lg shadow-md"
                                    style={{ backgroundColor: color }}
                                  />
                                  <div className="text-xs text-center mt-1 text-walnut/60 font-mono">
                                    {index === 0 ? 'Light' : index === 1 ? 'Medium' : 'Dark'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Collections */}
                          <div>
                            <h4 className="text-lg font-semibold text-darkBrown mb-3">Collections</h4>
                            <div className="text-center py-4">
                              <div className="text-walnut/60 text-sm">No collections yet</div>
                              <button className="mt-2 text-sm text-walnut/70 hover:text-darkBrown transition-colors">
                                + Add to collection
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Book Spine (Center) */}
                <div
                  className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-8 shadow-2xl"
                  style={{
                    background: `linear-gradient(to right, ${book.spineColors[2]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[0]} 100%)`,
                    transform: 'translateZ(0)',
                    zIndex: 10
                  }}
                >
                  <div className="h-full flex items-center justify-center py-4">
                    <div
                      className="text-white font-serif font-bold text-center leading-tight text-sm"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {book.title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center gap-4 mt-6"
              >
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || isAnimating}
                  className="px-6 py-3 bg-walnut text-white rounded-lg font-medium hover:bg-darkBrown transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  ← Previous
                </button>
                <div className="px-4 py-3 bg-white rounded-lg font-medium text-darkBrown">
                  Page {currentPage + 1} of 2
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === 1 || isAnimating}
                  className="px-6 py-3 bg-walnut text-white rounded-lg font-medium hover:bg-darkBrown transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next →
                </button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
