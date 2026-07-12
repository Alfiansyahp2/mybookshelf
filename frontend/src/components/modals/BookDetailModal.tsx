import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Edit, Clock, Hash } from 'lucide-react'
import {
  useUpdateProgress, useToggleFavorite, useUpdateNotes,
  useUpdateRating, useStartReading, useFinishReading, useUpdateBook
} from '../../hooks/useBooks'
import type { Book } from '../../types'
import BookDetailLeftPage from '../book-details/BookDetailLeftPage'
import BookDetailRightPage from '../book-details/BookDetailRightPage'

interface BookDetailModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (book: Book) => void
  onDelete?: (bookId: string) => void
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  reading:  { label: 'Sedang Dibaca', color: '#065f46', bg: '#d1fae5', border: '#6ee7b7', dot: '#10b981' },
  finished: { label: 'Selesai',       color: '#1e40af', bg: '#dbeafe', border: '#93c5fd', dot: '#3b82f6' },
  unread:   { label: 'Belum Dibaca',  color: '#374151', bg: '#f3f4f6', border: '#d1d5db', dot: '#9ca3af' },
  wishlist: { label: 'Wishlist',      color: '#6b21a8', bg: '#f3e8ff', border: '#c4b5fd', dot: '#a855f7' },
  borrowed: { label: 'Dipinjam',      color: '#92400e', bg: '#fef3c7', border: '#fcd34d', dot: '#f59e0b' },
}

type RightTab = 'progress' | 'session' | 'notes' | 'info'

export default function BookDetailModal({
  book, isOpen, onClose, onEdit, onDelete
}: BookDetailModalProps) {
  const updateProgress = useUpdateProgress()
  const toggleFavorite = useToggleFavorite()
  const updateNotes    = useUpdateNotes()
  const updateRating   = useUpdateRating()
  const startReading   = useStartReading()
  const finishReading  = useFinishReading()
  const updateBook     = useUpdateBook()

  const [userRating,     setUserRating]     = useState(0)
  const [userNotes,      setUserNotes]      = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes,      setTempNotes]      = useState('')
  const [activeTab,      setActiveTab]      = useState<RightTab>('progress')
  const [showMarkAsReadDatePicker, setShowMarkAsReadDatePicker] = useState(false)
  const [markAsReadDate, setMarkAsReadDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (book) {
      setUserRating(book.personalRating || 0)
      setUserNotes(book.personalNotes || '')
      setTempNotes(book.personalNotes || '')
      setIsEditingNotes(false)
      if      (book.status === 'reading')  setActiveTab('progress')
      else if (book.status === 'finished') setActiveTab('notes')
      else                                 setActiveTab('info')
    }
  }, [book])

  if (!book) return null

  const cfg      = STATUS_CFG[book.status] ?? STATUS_CFG['unread']
  const progress = book.pages && book.pages > 0
    ? Math.round(((book.currentPage || 0) / book.pages) * 100) : 0
  const c0 = book.spineColors?.[0] || '#8B7355'
  const c1 = book.spineColors?.[1] || '#6B5344'
  const c2 = book.spineColors?.[2] || '#5C4532'

  const tabs: { id: RightTab; label: string; icon: React.ReactNode }[] = [
    { id: 'progress', label: 'Progress', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'session',  label: 'Sesi',     icon: <Clock    className="w-3.5 h-3.5" /> },
    { id: 'notes',    label: 'Catatan',  icon: <Edit     className="w-3.5 h-3.5" /> },
    { id: 'info',     label: 'Info',     icon: <Hash     className="w-3.5 h-3.5" /> },
  ]
  const tabIdx = tabs.findIndex(t => t.id === activeTab)

  // ── handlers ───────────────────────────────────────────────
  const handleFav      = () => toggleFavorite.mutate(book.id)
  const handleRating   = (r: number) => { setUserRating(r); updateRating.mutate({ id: book.id, rating: r }) }
  const handleProgress = (p: number) => updateProgress.mutate({ id: book.id, currentPage: p })
  const handleNotes    = () => { updateNotes.mutate({ id: book.id, notes: tempNotes }); setUserNotes(tempNotes); setIsEditingNotes(false) }
  const handleStart    = () => { if (book.status === 'unread')   startReading.mutate(book.id) }
  const handleFinish   = () => {
    if (book.status === 'reading') {
      const today = new Date().toISOString().split('T')[0]
      const dates = book.readDates ? [...book.readDates] : []
      if (!dates.includes(today)) {
        dates.push(today)
        dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      }
      finishReading.mutate(book.id, {
        onSuccess: () => {
          updateBook.mutate({
            id: book.id,
            updates: {
              readDates: dates,
              finishedDate: new Date().toISOString(),
            }
          })
        }
      })
    }
  }
  
  const handleAddReadDate = (date: string) => {
    const dates = book.readDates ? [...book.readDates] : []
    if (!dates.includes(date)) {
      dates.push(date)
      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      updateBook.mutate({ 
        id: book.id, 
        updates: { 
          readDates: dates,
          progress: 100,
          status: 'finished',
          finishedDate: new Date(date).toISOString()
        } 
      })
    }
  }

  const handleMarkAsReadNow = () => {
    const dates = book.readDates ? [...book.readDates] : [];
    if (!dates.includes(markAsReadDate)) {
      dates.push(markAsReadDate);
      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    }
    updateBook.mutate({
      id: book.id,
      updates: {
        status: 'finished',
        progress: 100,
        finishedDate: new Date(markAsReadDate).toISOString(),
        readDates: dates
      }
    });
    setShowMarkAsReadDatePicker(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ───────────────────────────────────── */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(10,5,0,0.82)', backdropFilter: 'blur(6px)' }}
          />

          {/* ── Outer centering wrapper ─────────────────────── */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pointer-events-none">

            {/* ── Perspective container ─────────────────────── */}
            <div
              className="pointer-events-auto w-full max-w-5xl"
              style={{ perspective: '1800px', perspectiveOrigin: '50% 50%' }}
            >
              <motion.div
                key="outer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col md:flex-row relative"
                style={{
                  boxShadow: '0 48px 96px rgba(0,0,0,0.7), 0 12px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(139, 115, 85, 0.2)',
                  borderRadius: '3px 6px 6px 3px',
                  minHeight: '580px',
                  maxHeight: '88vh',
                  background: '#fdfbf7', // Hardcover inner background
                  overflowY: 'auto'
                }}
              >
                {/* Book Spine / Center Fold Shadow */}
                <div className="hidden md:block absolute top-0 bottom-0 left-[42%] -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-30" />

                <BookDetailLeftPage
                  book={book} c0={c0} c1={c1} c2={c2} cfg={cfg}
                  progress={progress} userRating={userRating}
                  handleRating={handleRating} handleFav={handleFav}
                  handleStart={handleStart} handleFinish={handleFinish}
                  toggleFavoritePending={toggleFavorite.isPending}
                  startReadingPending={startReading.isPending}
                  finishReadingPending={finishReading.isPending}
                  updateBookPending={updateBook.isPending}
                  setActiveTab={setActiveTab}
                  setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker}
                  updateBookMutate={updateBook.mutate}
                />

                <BookDetailRightPage
                  book={book} c0={c0} c1={c1} c2={c2}
                  tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} tabIdx={tabIdx}
                  onEdit={onEdit} onDelete={onDelete} onClose={onClose}
                  showMarkAsReadDatePicker={showMarkAsReadDatePicker}
                  setShowMarkAsReadDatePicker={setShowMarkAsReadDatePicker}
                  markAsReadDate={markAsReadDate} setMarkAsReadDate={setMarkAsReadDate}
                  handleStart={handleStart} handleMarkAsReadNow={handleMarkAsReadNow}
                  handleProgress={handleProgress} handleAddReadDate={handleAddReadDate}
                  userNotes={userNotes} tempNotes={tempNotes} isEditingNotes={isEditingNotes}
                  setTempNotes={setTempNotes} setIsEditingNotes={setIsEditingNotes} handleNotes={handleNotes}
                  startReadingPending={startReading.isPending} updateBookPending={updateBook.isPending}
                  updateNotes={updateNotes} updateProgress={updateProgress}
                />
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
