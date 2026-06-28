import { useState, useEffect } from 'react'
import { Play, Pause, Clock, BookOpen, Check, X } from 'lucide-react'
import type { Book } from '../../types'
import { useStartReadingSession, useEndReadingSession, useBookReadingSessions } from '../../hooks/useReadingSessions'

interface ReadingSessionTimerProps {
  book: Book
  updateProgress: { mutate: (params: { id: string; currentPage: number }) => void }
}

export default function ReadingSessionTimer({ book, updateProgress }: ReadingSessionTimerProps) {
  const [isReadingSession, setIsReadingSession] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [startingPage, setStartingPage] = useState(0)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  
  // State for ending session input
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [endPage, setEndPage] = useState<number>(book.currentPage || 0)
  const [notes, setNotes] = useState<string>('')
  
  const [hasInitializedSession, setHasInitializedSession] = useState(false)

  // Mutations/Queries
  const startSessionMutation = useStartReadingSession()
  const endSessionMutation = useEndReadingSession()
  const { data: sessionData } = useBookReadingSessions(book.id)

  // Resume active session from database on mount/first load
  useEffect(() => {
    if (sessionData?.sessions && !hasInitializedSession) {
      const activeSession = sessionData.sessions.find(s => s.end_time === null);
      if (activeSession) {
        setIsReadingSession(true);
        setActiveSessionId(activeSession.id);
        setStartingPage(activeSession.start_page);
        setEndPage(book.currentPage || activeSession.start_page);
        
        // Calculate current duration
        const startTime = new Date(activeSession.start_time).getTime();
        const durationSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        setSessionDuration(durationSeconds);
      }
      setHasInitializedSession(true);
    }
  }, [sessionData, hasInitializedSession, book.currentPage]);

  // Reading session timer (pauses when showing the stop/save form)
  useEffect(() => {
    let interval: number
    if (isReadingSession && !isEndingSession) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isReadingSession, isEndingSession])

  // Format session duration
  const formatSessionDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartReading = async () => {
    const currentPage = book.currentPage || 0
    setStartingPage(currentPage)
    setEndPage(currentPage)

    try {
      // Start session on backend
      const result = await startSessionMutation.mutateAsync({
        bookId: book.id,
        data: {
          start_page: currentPage,
          mood: 'good', // Default mood
        }
      })

      // Store session ID and start local timer
      setActiveSessionId(result.id)
      setIsReadingSession(true)
      setIsEndingSession(false)

      console.log('Reading session started successfully:', result)
    } catch (error) {
      console.error('Failed to start reading session:', error)
      // Fallback to local-only session if backend fails
      setIsReadingSession(true)
    }
  }

  const handleStopClick = () => {
    setIsEndingSession(true)
    setEndPage(Math.max(startingPage, book.currentPage || 0))
  }

  const handleCancelEnd = () => {
    setIsEndingSession(false)
  }

  const handleSaveSession = async () => {
    if (endPage < startingPage) {
      alert(`End page (${endPage}) cannot be less than start page (${startingPage})`)
      return
    }

    try {
      if (activeSessionId) {
        // End session on backend
        await endSessionMutation.mutateAsync({
          bookId: book.id,
          sessionId: activeSessionId,
          data: {
            end_page: endPage,
            notes: notes || `Session duration: ${formatSessionDuration(sessionDuration)}`
          }
        })
      } else {
        // Fallback: update progress locally
        if (endPage > startingPage) {
          updateProgress.mutate({
            id: book.id,
            currentPage: endPage
          })
        }
      }

      // Reset session state
      setIsReadingSession(false)
      setIsEndingSession(false)
      setSessionDuration(0)
      setActiveSessionId(null)
      setNotes('')
    } catch (error) {
      console.error('Failed to end reading session:', error)
    }
  }

  // Calculate reading statistics
  const pagesRead = Math.max(0, (isEndingSession ? endPage : (book.currentPage || 0)) - startingPage)
  const readingSpeed = sessionDuration > 0 ? (pagesRead / (sessionDuration / 3600)).toFixed(2) : '0.00'

  return (
    <div className="p-3 bg-white rounded-xl border border-walnut/10 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-darkBrown flex items-center gap-2">
          <Clock className="w-4 h-4 text-walnut" />
          Reading Session
        </h3>
        {isReadingSession && (
          <div className="text-xs text-walnut/70">
            <BookOpen className="w-3 h-3 inline mr-1" />
            {pagesRead} pages
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Live Timer Display */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-darkBrown">
            {formatSessionDuration(sessionDuration)}
          </div>
          {isReadingSession && sessionDuration > 60 && (
            <div className="text-xs text-walnut/70 mt-1">
              {readingSpeed} pages/hour
            </div>
          )}
        </div>

        {/* Start/Stop/Save Flow */}
        {!isReadingSession ? (
          <button
            onClick={handleStartReading}
            disabled={startSessionMutation.isPending}
            className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Start Reading Session"
          >
            <Play className="w-4 h-4" />
            {startSessionMutation.isPending ? 'Starting...' : 'Start Session'}
          </button>
        ) : !isEndingSession ? (
          <button
            onClick={handleStopClick}
            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
            title="Stop Reading Session"
          >
            <Pause className="w-4 h-4" />
            Stop Session
          </button>
        ) : (
          <div className="p-3 bg-walnut/5 rounded-lg border border-walnut/10 space-y-3">
            <div className="text-xs font-semibold text-darkBrown uppercase tracking-wider">
              Complete Reading Session
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="text-xs text-walnut/60 block mb-1">
                  Ended Page (Start: {startingPage} / Max: {book.pages})
                </label>
                <input
                  type="number"
                  min={startingPage}
                  max={book.pages || 9999}
                  value={endPage}
                  onChange={(e) => setEndPage(parseInt(e.target.value) || startingPage)}
                  className="w-full px-2 py-1 text-sm bg-white border border-walnut/20 rounded-md focus:outline-none focus:ring-1 focus:ring-walnut"
                />
              </div>

              <div>
                <label className="text-xs text-walnut/60 block mb-1">
                  Session Notes (Optional)
                </label>
                <textarea
                  placeholder="What did you think of this section?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-white border border-walnut/20 rounded-md focus:outline-none focus:ring-1 focus:ring-walnut h-12 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveSession}
                disabled={endSessionMutation.isPending}
                className="flex-1 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {endSessionMutation.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEnd}
                className="px-3 py-1.5 bg-gray-500 text-white text-xs font-semibold rounded-md hover:bg-gray-600 transition-all flex items-center justify-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Session Info - Compact */}
        {isReadingSession && !isEndingSession && (
          <div className="p-2 bg-walnut/10 rounded-lg text-xs text-walnut/70 text-center">
            From page {startingPage} • {pagesRead} pages read
          </div>
        )}

        {/* Error Display */}
        {(startSessionMutation.error || endSessionMutation.error) && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            Failed to save session. Changes saved locally.
          </div>
        )}
      </div>
    </div>
  )
}
