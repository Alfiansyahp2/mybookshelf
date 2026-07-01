import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Bookmark, BookOpen, Play, Square, Edit3, Send, Check } from 'lucide-react'
import { useBookstore } from '../store/useBookstore'
import { useBook, useUpdateProgress, useToggleFavorite, useUpdateBook, useStartReading, useUpdateNotes, useUpdateRating } from '../hooks/useBooks'
import { useReadAgain } from '../hooks/useReadingSessions'

export default function BookDetailDrawer() {
  const { selectedBookId, isBookDetailOpen, closeBookDetail } = useBookstore()
  const updateProgress = useUpdateProgress()
  const toggleFavorite = useToggleFavorite()
  const updateBook = useUpdateBook()
  const startReading = useStartReading()
  const updateNotes = useUpdateNotes()
  const updateRating = useUpdateRating()
  const readAgain = useReadAgain()

  // Fetch book details by ID
  const { data: selectedBook, isLoading } = useBook(selectedBookId || '')

  const [liveTime, setLiveTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isReadingSession, setIsReadingSession] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [startingPage, setStartingPage] = useState(0)

  // Notes and Rating state
  const [userRating, setUserRating] = useState(0)
  const [userNotes, setUserNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState('')

  // Borrow/Loan modals state
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false)
  const [borrowerName, setBorrowerName] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Update live timer every second for currently reading books
  useEffect(() => {
    if (!selectedBook || selectedBook.status !== 'reading') return

    const updateTime = () => {
      if (!selectedBook.startedDate) return
      const start = new Date(selectedBook.startedDate)
      const now = new Date()
      const diff = now.getTime() - start.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setLiveTime({ days, hours, minutes, seconds })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [selectedBook])

  // Reading session timer
  useEffect(() => {
    let interval: any
    if (isReadingSession) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isReadingSession])

  // Load user rating and notes when book changes
  useEffect(() => {
    if (selectedBook) {
      setUserRating(selectedBook.personalRating || 0)
      setUserNotes(selectedBook.personalNotes || '')
    }
  }, [selectedBook])

  // Format session duration
  const formatSessionDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartReading = () => {
    if (selectedBook) {
      setStartingPage(selectedBook.currentPage || 0)
      if (selectedBook.status === 'unread') {
        startReading.mutate(selectedBook.id)
      }
      setIsReadingSession(true)
    }
  }

  const handleStopReading = () => {
    setIsReadingSession(false)
    // Save session logic would go here
    if (selectedBook && sessionDuration > 0) {
      const newPage = startingPage + Math.floor(sessionDuration / 60) // Rough estimate
      updateProgress.mutate({
        id: selectedBook.id,
        currentPage: newPage
      })
    }
    setSessionDuration(0)
  }

  const handleToggleFavorite = () => {
    if (selectedBook) {
      toggleFavorite.mutate(selectedBook.id)
    }
  }

  const handleUpdateProgress = (currentPage: number) => {
    if (selectedBook) {
      updateProgress.mutate({
        id: selectedBook.id,
        currentPage: currentPage
      })
    }
  }

  const handleUpdateNotes = () => {
    if (selectedBook) {
      updateNotes.mutate({
        id: selectedBook.id,
        notes: tempNotes
      })
      setUserNotes(tempNotes)
      setIsEditingNotes(false)
    }
  }

  const handleUpdateRating = (rating: number) => {
    if (selectedBook) {
      updateRating.mutate({
        id: selectedBook.id,
        rating: rating
      })
      setUserRating(rating)
    }
  }

  const handleBorrowBook = () => {
    if (selectedBook && borrowerName && dueDate) {
      updateBook.mutate({
        id: selectedBook.id,
        updates: {
          status: 'borrowed',
          borrowedBy: borrowerName,
          borrowedDate: new Date().toISOString(),
          dueDate: dueDate
        }
      })
      setIsBorrowModalOpen(false)
      setBorrowerName('')
      setDueDate('')
    }
  }

  const handleReturnBook = () => {
    if (selectedBook) {
      updateBook.mutate({
        id: selectedBook.id,
        updates: { status: 'unread' }
      })
    }
  }

  if (isLoading || !selectedBook) return null

  const isReading = selectedBook.status === 'reading'
  const isFinished = selectedBook.status === 'finished'
  const isUnread = selectedBook.status === 'unread'
  const isBorrowed = selectedBook.status === 'borrowed'

  return (
    <AnimatePresence>
      {isBookDetailOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookDetail}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Open Book Drawer */}
          <motion.div
            initial={{ x: '100%', rotateY: 90 }}
            animate={{ x: 0, rotateY: 0 }}
            exit={{ x: '100%', rotateY: -90 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              rotateY: { type: "spring", damping: 15, stiffness: 100 }
            }}
            className="fixed top-0 right-0 h-full w-full md:w-[800px] bg-[#fdfbf7] z-50 shadow-2xl overflow-hidden flex relative"
            style={{
              perspective: "2000px",
              boxShadow: 'inset 0 0 0 1px rgba(139, 115, 85, 0.2)'
            }}
          >
            {/* Book Spine / Center Fold Shadow */}
            <div className="absolute top-0 bottom-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-30" />

            {/* Left Page - Book Cover & Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-1/2 bg-gradient-to-br from-[#fdfbf7] to-[#f4f1ea] border-r border-walnut/20 flex flex-col overflow-y-auto relative"
              style={{ boxShadow: 'inset -20px 0 30px -20px rgba(0,0,0,0.15)' }}
            >
              {/* Subtle page texture */}
              <div className="absolute inset-0 opacity-30 pointer-events-none z-0" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(139, 115, 85, 0.05) 24px, rgba(139, 115, 85, 0.05) 25px)'
              }} />
              
              <div className="relative z-10">
              {/* Book Cover */}
              <div className="p-8 bg-gradient-to-br from-cream to-beige flex-shrink-0">
                <motion.div
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="w-full h-72 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${selectedBook.spineColors?.[0] || '#8B7355'} 0%, ${selectedBook.spineColors?.[2] || '#5C4532'} 100%)`
                  }}
                >
                  <div className="text-white text-center p-4 z-10">
                    <div className="text-xl font-serif font-semibold mb-2">
                      {selectedBook.title}
                    </div>
                    <div className="text-sm opacity-90">{selectedBook.author}</div>
                  </div>

                  {/* Book texture */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="w-full h-full" style={{
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
                    }} />
                  </div>
                </motion.div>
              </div>

              {/* Book Metadata */}
              <div className="p-6 space-y-4 flex-1">
                <h3 className="text-2xl font-serif font-semibold text-darkBrown mb-4">
                  {selectedBook.title}
                </h3>

                {/* Favorite Button */}
                <button
                  onClick={handleToggleFavorite}
                  disabled={toggleFavorite.isPending}
                  className="mb-6 w-12 h-12 flex items-center justify-center rounded-lg transition-all hover:scale-110 disabled:opacity-50"
                  style={{
                    backgroundColor: selectedBook.isFavorite ? 'rgba(251, 191, 36, 0.1)' : 'rgba(122, 92, 66, 0.1)',
                    color: selectedBook.isFavorite ? '#D97706' : '#7A5C42'
                  }}
                  title={selectedBook.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  <Star
                    size={24}
                    fill={selectedBook.isFavorite ? 'currentColor' : 'none'}
                  />
                </button>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-walnut/60 text-xs uppercase tracking-wide mb-1">Author</div>
                    <div className="font-medium text-darkBrown">{selectedBook.author}</div>
                  </div>
                  <div>
                    <div className="text-walnut/60 text-xs uppercase tracking-wide mb-1">Genre</div>
                    <div className="font-medium text-darkBrown">{selectedBook.genre || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-walnut/60 text-xs uppercase tracking-wide mb-1">Year</div>
                    <div className="font-medium text-darkBrown">{selectedBook.publishedYear}</div>
                  </div>
                  <div>
                    <div className="text-walnut/60 text-xs uppercase tracking-wide mb-1">Pages</div>
                    <div className="font-medium text-darkBrown">{selectedBook.totalPages || selectedBook.pages || 'N/A'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-walnut/60 text-xs uppercase tracking-wide mb-1">ISBN</div>
                    <div className="font-medium text-darkBrown font-mono text-xs">{selectedBook.isbn || 'N/A'}</div>
                  </div>
                </div>

                {/* Personal Rating Section */}
                <div className="pt-4 border-t border-walnut/10">
                  <div className="text-xs text-walnut/60 uppercase tracking-wide mb-3">Your Rating</div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleUpdateRating(rating)}
                        disabled={updateBook.isPending}
                        className="transition-transform hover:scale-110 disabled:opacity-50"
                      >
                        <Star
                          size={20}
                          className={`${
                            rating <= userRating
                              ? 'text-yellow-400 fill="currentColor'
                              : 'text-walnut/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <div className="text-xs text-walnut/60 mt-1">
                      You rated this {userRating} star{userRating !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Personal Notes Section */}
                <div className="pt-4 border-t border-walnut/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-walnut/60 uppercase tracking-wide">Your Notes</div>
                    {!isEditingNotes ? (
                      <button
                        onClick={() => {
                          setTempNotes(userNotes)
                          setIsEditingNotes(true)
                        }}
                        className="text-xs text-walnut hover:text-darkBrown flex items-center gap-1 transition-colors"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleUpdateNotes}
                          disabled={updateBook.isPending}
                          className="text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingNotes(false)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingNotes ? (
                    <div className="p-3 bg-cream/30 rounded-xl border border-walnut/20 min-h-[80px] max-h-[200px] overflow-y-auto">
                      <p className="text-sm text-walnut/80 whitespace-pre-wrap">{userNotes || 'No notes yet. Click edit to add your thoughts about this book.'}</p>
                    </div>
                  ) : (
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      className="w-full h-24 p-3 bg-white border border-walnut/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 resize-none"
                      placeholder="Add your thoughts, quotes, or memories about this book..."
                    />
                  )}
                </div>
              </div>
              </div>
            </motion.div>

            {/* Right Page - Reading Progress & Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-1/2 flex flex-col overflow-y-auto bg-gradient-to-bl from-[#fdfbf7] to-[#f4f1ea] relative"
              style={{ boxShadow: 'inset 20px 0 30px -20px rgba(0,0,0,0.15)' }}
            >
              {/* Subtle page texture */}
              <div className="absolute inset-0 opacity-30 pointer-events-none z-0" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(139, 115, 85, 0.05) 24px, rgba(139, 115, 85, 0.05) 25px)'
              }} />
              
              <div className="p-8 h-full flex flex-col relative z-10">
                {/* Currently Reading Section */}
                {isReading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Bookmark className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-darkBrown">Currently Reading</div>
                        <div className="text-sm text-walnut/60">
                          Since {selectedBook.startedDate ? new Date(selectedBook.startedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                        </div>
                      </div>
                    </div>

                    {/* Live Reading Timer */}
                    <div className="bg-white rounded-2xl p-6 mb-6 border border-walnut/10 shadow-sm">
                      <div className="text-xs text-walnut/60 uppercase tracking-wide mb-3">Total Reading Time</div>
                      <div className="font-mono text-3xl font-bold text-darkBrown text-center mb-2">
                        {liveTime.days}d {String(liveTime.hours).padStart(2, '0')}h {String(liveTime.minutes).padStart(2, '0')}m {String(liveTime.seconds).padStart(2, '0')}s
                      </div>
                      <div className="text-xs text-walnut/60 text-center">Live Timer</div>
                    </div>

                    {/* Reading Session */}
                    <div className="bg-white rounded-2xl p-6 mb-6 border border-walnut/10 shadow-sm">
                      <div className="text-xs text-walnut/60 uppercase tracking-wide mb-4">Current Session</div>

                      {!isReadingSession ? (
                        <button
                          onClick={handleStartReading}
                          className="w-full py-4 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-all hover:scale-105 flex items-center justify-center mb-4"
                          title="Start Reading Session"
                        >
                          <Play size={24} />
                        </button>
                      ) : (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={handleStopReading}
                              className="w-12 h-12 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:scale-105 flex items-center justify-center"
                              title="Stop Reading Session"
                            >
                              <Square size={20} />
                            </button>
                            <div className="font-mono text-2xl font-bold text-darkBrown">
                              {formatSessionDuration(sessionDuration)}
                            </div>
                          </div>
                          <div className="text-xs text-walnut/60 text-center">
                            Session duration
                          </div>
                        </div>
                      )}

                      {/* Session Stats */}
                      {isReadingSession && (
                        <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-walnut/10">
                          <div>
                            <div className="text-walnut/60 text-xs">Starting Page</div>
                            <div className="font-medium text-darkBrown">{startingPage}</div>
                          </div>
                          <div>
                            <div className="text-walnut/60 text-xs">Current Page</div>
                            <div className="font-medium text-darkBrown">{selectedBook.currentPage || 0}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="bg-white rounded-2xl p-6 mb-6 border border-walnut/10 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-darkBrown">Reading Progress</span>
                        <span className="text-sm font-bold text-walnut">{Math.round((selectedBook.currentPage || 0) / (selectedBook.totalPages || selectedBook.pages || 1) * 100)}%</span>
                      </div>

                      <div className="h-3 bg-walnut/20 rounded-full overflow-hidden mb-3">
                        <motion.div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round((selectedBook.currentPage || 0) / (selectedBook.totalPages || selectedBook.pages || 1) * 100)}%`,
                            background: `linear-gradient(90deg, ${selectedBook.spineColors?.[0] || '#8B7355'}, ${selectedBook.spineColors?.[2] || '#5C4532'})`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round((selectedBook.currentPage || 0) / (selectedBook.totalPages || selectedBook.pages || 1) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-walnut/60">
                        <span>Page {selectedBook.currentPage || 0}</span>
                        <span>of {selectedBook.totalPages || selectedBook.pages || 'N/A'}</span>
                      </div>

                      {/* Progress Slider */}
                      <div className="mt-4 pt-4 border-t border-walnut/10">
                        <label className="text-xs text-walnut/60 block mb-2">Update Progress</label>
                        <input
                          type="range"
                          min="0"
                          max={selectedBook.totalPages || selectedBook.pages || 0}
                          value={selectedBook.currentPage || 0}
                          onChange={(e) => handleUpdateProgress(parseInt(e.target.value))}
                          disabled={updateProgress.isPending}
                          className="w-full disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full py-4 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-all hover:scale-105 flex items-center justify-center mt-auto" title="Continue Reading">
                      <BookOpen size={24} />
                    </button>
                  </motion.div>
                )}

                {/* Finished Section */}
                {isFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-8 border border-walnut/10 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-2xl"
                      >
                        ✓
                      </motion.div>
                      <div>
                        <div className="font-semibold text-xl text-darkBrown">Finished</div>
                        <div className="text-sm text-walnut/60">
                          {selectedBook.finishedDate ? new Date(selectedBook.finishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm text-walnut/70">
                        You completed this {selectedBook.totalPages || selectedBook.pages || 0}-page journey.
                      </div>

                      {/* Reading Time Summary */}
                      <div className="bg-cream rounded-xl p-4">
                        <div className="text-xs text-walnut/60 uppercase tracking-wide mb-2">Total Reading Time</div>
                        <div className="font-mono text-lg font-bold text-darkBrown">
                          {liveTime.days}d {liveTime.hours}h {liveTime.minutes}m
                        </div>
                        <div className="text-xs text-walnut/60 mt-1">
                          Time from start to finish
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => selectedBook && readAgain.mutate(selectedBook.id)}
                        disabled={readAgain.isPending}
                        className="flex-1 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Read Again"
                      >
                        <BookOpen size={24} />
                        <span className="text-sm font-medium">
                          {readAgain.isPending ? 'Starting...' : 'Read Again'}
                        </span>
                      </button>
                      <button
                        onClick={() => setIsBorrowModalOpen(true)}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center"
                        title="Borrow Book"
                      >
                        <Send size={22} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Unread Section */}
                {isUnread && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-8 border border-walnut/10 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-walnut/20 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-walnut" />
                      </div>
                      <div>
                        <div className="font-semibold text-xl text-darkBrown">Start Reading</div>
                        <div className="text-sm text-walnut/60">{selectedBook.totalPages || selectedBook.pages || 0} pages waiting</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleStartReading}
                        className="flex-1 py-4 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-all hover:scale-105 flex items-center justify-center"
                        title="Start Reading"
                      >
                        <Play size={24} />
                      </button>
                      <button
                        onClick={() => setIsBorrowModalOpen(true)}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center"
                        title="Borrow Book"
                      >
                        <Send size={22} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Borrowed Section */}
                {isBorrowed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-8 border border-walnut/10 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
                        📤
                      </div>
                      <div>
                        <div className="font-semibold text-xl text-darkBrown">Loaned Out</div>
                        <div className="text-sm text-walnut/60">With {selectedBook.borrowedBy}</div>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-walnut/60">Borrowed</span>
                        <span className="font-medium text-darkBrown">
                          {selectedBook.borrowedDate ? new Date(selectedBook.borrowedDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-walnut/60">Due Date</span>
                        <span className="font-medium text-darkBrown">
                          {selectedBook.dueDate ? new Date(selectedBook.dueDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button className="flex-1 py-4 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-all hover:scale-105 flex items-center justify-center" title="Send Reminder">
                        <Send size={22} />
                      </button>
                      <button
                        onClick={handleReturnBook}
                        disabled={updateBook.isPending}
                        className="flex-1 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all hover:scale-105 flex items-center justify-center disabled:opacity-50"
                        title="Mark Returned"
                      >
                        <Check size={22} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Close Button */}
            <button
              onClick={closeBookDetail}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
            >
              <X className="w-5 h-5 text-darkBrown" />
            </button>

            {/* Borrow Modal */}
            <AnimatePresence>
              {isBorrowModalOpen && (
                <>
                  {/* Modal Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20"
                    onClick={() => setIsBorrowModalOpen(false)}
                  />

                  {/* Modal Content */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-30 p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-darkBrown">Borrow Book</h3>
                      <button
                        onClick={() => setIsBorrowModalOpen(false)}
                        className="w-8 h-8 bg-walnut/10 hover:bg-walnut/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-darkBrown" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-2">Borrower Name</label>
                        <input
                          type="text"
                          value={borrowerName}
                          onChange={(e) => setBorrowerName(e.target.value)}
                          className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                          placeholder="Enter borrower's name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-walnut mb-2">Due Date</label>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setIsBorrowModalOpen(false)}
                          className="flex-1 py-3 bg-walnut/10 text-walnut rounded-xl font-medium hover:bg-walnut/20 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleBorrowBook}
                          disabled={!borrowerName || !dueDate || updateBook.isPending}
                          className="flex-1 py-3 bg-walnut text-white rounded-xl font-medium hover:bg-darkBrown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm Borrow
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
