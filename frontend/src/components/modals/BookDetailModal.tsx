import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, BookOpen, Edit, Trash2, Star, Calendar, Heart, Play, Check,
  Hash, Globe, Package, ShoppingBag, MapPin, Clock, ChevronRight, ChevronLeft
} from 'lucide-react'
import {
  useUpdateProgress, useToggleFavorite, useUpdateNotes,
  useUpdateRating, useStartReading, useFinishReading
} from '../../hooks/useBooks'
import type { Book } from '../../types'
import ReadingProgressSection from '../book-details/ReadingProgressSection'
import ReadingSessionTimer from '../book-details/ReadingSessionTimer'
import BookNotesSection from '../book-details/BookNotesSection'

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

// ─── Paper page background ────────────────────────────────
const PAPER_BG = '#f5ecd7'
const PAPER_LINES = 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,100,60,0.09) 28px)'

export default function BookDetailModal({
  book, isOpen, onClose, onEdit, onDelete
}: BookDetailModalProps) {
  const updateProgress = useUpdateProgress()
  const toggleFavorite = useToggleFavorite()
  const updateNotes    = useUpdateNotes()
  const updateRating   = useUpdateRating()
  const startReading   = useStartReading()
  const finishReading  = useFinishReading()

  const [userRating,     setUserRating]     = useState(0)
  const [userNotes,      setUserNotes]      = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes,      setTempNotes]      = useState('')
  const [activeTab,      setActiveTab]      = useState<RightTab>('progress')

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
  const handleFinish   = () => { if (book.status === 'reading') finishReading.mutate(book.id) }

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

            {/* ── Perspective container ───────────────────────
                perspectiveOrigin at the center = spine        */}
            <div
              className="pointer-events-auto w-full max-w-5xl"
              style={{ perspective: '1800px', perspectiveOrigin: '50% 50%' }}
            >
              {/* Outer book drop shadow */}
              <motion.div
                key="outer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22 }}
                className="flex relative"
                style={{
                  boxShadow: '0 48px 96px rgba(0,0,0,0.7), 0 12px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(139, 115, 85, 0.2)',
                  borderRadius: '3px 6px 6px 3px',
                  minHeight: '580px',
                  maxHeight: '88vh',
                  background: '#fdfbf7', // Hardcover inner background
                }}
              >
                {/* Book Spine / Center Fold Shadow */}
                <div className="absolute top-0 bottom-0 left-[42%] -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-30" />

                {/* ══════════════════════════════════════════════
                    LEFT PAGE  — swings in from the spine
                    origin: right edge
                    rotateY: 90° → 0°  (page unfolds to the left)
                    ══════════════════════════════════════════════ */}
                <motion.div
                  key="left"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0,  opacity: 1 }}
                  exit={{    rotateY: 90, opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 130, delay: 0.06 }}
                  style={{
                    transformOrigin: 'right center',
                    width: '42%',
                    flexShrink: 0,
                    background: PAPER_BG,
                    backgroundImage: PAPER_LINES,
                    /* right edge shadow simulates page curl into binding */
                    boxShadow: 'inset -18px 0 28px rgba(0,0,0,0.18)',
                    borderRadius: '3px 0 0 3px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* ── colour accent strip at top (book colour) ── */}
                  <div
                    className="flex-shrink-0 h-2"
                    style={{ background: `linear-gradient(to right, ${c2}, ${c0})` }}
                  />

                  {/* ── scrollable content ─────────────────────── */}
                  <div className="flex-1 overflow-y-auto flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>

                    {/* ── Cover + Info side-by-side ──────────────── */}
                    <div className="flex items-start gap-4 px-6 pt-6 pb-4">
                      {/* Mini 3-D book cover */}
                      <div className="relative flex-shrink-0" style={{ width: 78, height: 110 }}>
                        {/* front face */}
                        <div
                          className="absolute inset-0 rounded-r-sm flex flex-col items-center justify-center p-2 overflow-hidden"
                          style={{
                            background: `linear-gradient(150deg, ${c0} 0%, ${c1} 55%, ${c2} 100%)`,
                            boxShadow: '4px 6px 16px rgba(0,0,0,0.45)',
                          }}
                        >
                          <div className="absolute inset-0 opacity-10"
                            style={{ background: 'repeating-linear-gradient(180deg,transparent,transparent 3px,rgba(0,0,0,0.2) 4px)' }}
                          />
                          <p className="text-white text-center font-bold leading-tight relative z-10"
                            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)', fontSize: 8 }}
                          >
                            {book.title}
                          </p>
                        </div>
                        {/* spine left edge */}
                        <div
                          className="absolute left-0 top-0 bottom-0 rounded-l-sm"
                          style={{
                            width: 10,
                            background: `linear-gradient(to right, ${c2}, ${c1})`,
                            boxShadow: 'inset -1px 0 4px rgba(0,0,0,0.3)',
                            transform: 'translateX(-10px) rotateY(-90deg)',
                            transformOrigin: 'right center',
                          }}
                        />
                        {/* reflection */}
                        <div className="absolute inset-0 pointer-events-none"
                          style={{ background: 'linear-gradient(130deg,rgba(255,255,255,0.18) 0%,transparent 60%)' }}
                        />
                      </div>

                      {/* Info labels to the right of the cover */}
                      <div className="flex-1 min-w-0 flex flex-col justify-start pt-1 gap-1.5">
                        {/* Title */}
                        <h1
                          className="font-bold leading-tight"
                          style={{
                            color: '#2a1a08',
                            fontFamily: "'Georgia', serif",
                            fontSize: 14,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {book.title}
                        </h1>

                        {/* Author */}
                        <p
                          className="text-xs italic truncate"
                          style={{ color: '#7c5c3a', fontFamily: "'Georgia', serif" }}
                        >
                          {book.author}
                        </p>

                        {/* Genre */}
                        {book.genre && (
                          <p
                            className="text-[9px] uppercase font-semibold tracking-widest truncate"
                            style={{ color: c1, letterSpacing: '0.18em' }}
                          >
                            {book.genre}
                          </p>
                        )}

                        {/* Status badge */}
                        <div
                          className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold mt-0.5"
                          style={{
                            background: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.border}`,
                          }}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${book.status === 'reading' ? 'animate-pulse' : ''}`}
                            style={{ background: cfg.dot }}
                          />
                          {cfg.label}
                        </div>
                      </div>
                    </div>

                    {/* divider */}
                    <div className="flex items-center gap-2 px-6">
                      <div className="flex-1 h-px" style={{ background: `${c1}30` }} />
                      <span style={{ color: `${c1}60`, fontSize: 10 }}>◆</span>
                      <div className="flex-1 h-px" style={{ background: `${c1}30` }} />
                    </div>

                    {/* stats 2×2 grid + rest of content */}
                    <div className="px-6 pb-5 flex flex-col gap-3 flex-1">
                      {/* stats 2×2 grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: '📖', label: 'Halaman', val: book.pages || '—' },
                          { icon: '📅', label: 'Tahun',   val: book.publishYear || '—' },
                          { icon: '🌐', label: 'Bahasa',  val: book.language || '—' },
                          { icon: '📦', label: 'Format',  val: book.format ? book.format.charAt(0).toUpperCase() + book.format.slice(1) : '—' },
                        ].map((s, i) => (
                          <div key={i}
                            className="flex flex-col items-center justify-center py-2.5 rounded-lg"
                            style={{ background: `${c0}15`, border: `1px solid ${c0}22` }}
                          >
                            <span className="text-base">{s.icon}</span>
                            <span className="font-bold text-xs mt-0.5" style={{ color: '#2a1a08' }}>{s.val}</span>
                            <span className="text-[10px]" style={{ color: '#9c6d3a' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Reading progress bar (only if reading) */}
                      {book.status === 'reading' && (
                        <div>
                          <div className="flex justify-between text-xs mb-1" style={{ color: '#9c6d3a' }}>
                            <span>Progress</span>
                            <span className="font-bold" style={{ color: '#2a1a08' }}>{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: `${c0}30` }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${c0}, ${c2})` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] mt-0.5" style={{ color: '#9c6d3a' }}>
                            <span>Hal. {book.currentPage || 0}</span>
                            <span>dari {book.pages || '?'}</span>
                          </div>
                        </div>
                      )}

                      {/* Star rating */}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest mb-1.5 text-center" style={{ color: '#9c6d3a' }}>
                          Rating Kamu
                        </p>
                        <div className="flex justify-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} onClick={() => handleRating(s)}
                              className="transition-transform hover:scale-115 active:scale-95"
                            >
                              <Star className={`w-5 h-5 ${s <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Fav + start/finish */}
                      <div className="flex gap-2 mt-auto pt-2">
                        <button
                          onClick={handleFav}
                          disabled={toggleFavorite.isPending}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                          style={{
                            background: book.isFavorite || book.favorite ? '#fee2e2' : `${c0}18`,
                            color: book.isFavorite || book.favorite ? '#b91c1c' : '#6b4c2a',
                            border: `1px solid ${book.isFavorite || book.favorite ? '#fca5a5' : `${c0}30`}`,
                          }}
                        >
                          <Heart className={`w-3.5 h-3.5 ${book.isFavorite || book.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                          Favorit
                        </button>

                        {book.status === 'unread' && (
                          <button onClick={handleStart} disabled={startReading.isPending}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            style={{ background: `linear-gradient(135deg, ${c0}, ${c2})`, color: 'white' }}
                          >
                            <Play className="w-3.5 h-3.5" />
                            Mulai Baca
                          </button>
                        )}
                        {book.status === 'reading' && (
                          <button onClick={handleFinish} disabled={finishReading.isPending}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white' }}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Page number ─────────────────────────────── */}
                  <div className="flex-shrink-0 py-2 text-center border-t" style={{ borderColor: `${c1}20` }}>
                    <span className="text-xs italic" style={{ color: `${c1}70`, fontFamily: 'Georgia, serif' }}>i</span>
                  </div>
                </motion.div>

                {/* ══════════════════════════════════════════════
                    RIGHT PAGE — swings in from the spine
                    origin: left edge
                    rotateY: -90° → 0°  (page unfolds to the right)
                    ══════════════════════════════════════════════ */}
                <motion.div
                  key="right"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0,   opacity: 1 }}
                  exit={{    rotateY: -90, opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 130, delay: 0.14 }}
                  style={{
                    transformOrigin: 'left center',
                    flex: 1,
                    background: '#faf3e6',
                    backgroundImage: PAPER_LINES,
                    /* left edge shadow — deeper near binding */
                    boxShadow: 'inset 18px 0 28px rgba(0,0,0,0.13)',
                    borderRadius: '0 6px 6px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* top accent strip */}
                  <div className="flex-shrink-0 h-2"
                    style={{ background: `linear-gradient(to right, ${c0}, ${c2})` }}
                  />

                  {/* ── Tab bar ─────────────────────────────────── */}
                  <div
                    className="flex-shrink-0 flex items-center gap-0.5 px-4 pt-3 pb-0 border-b"
                    style={{ borderColor: `${c1}22` }}
                  >
                    {tabs.map(tab => (
                      <button key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all border-b-2"
                        style={
                          activeTab === tab.id
                            ? { color: '#2a1a08', borderBottomColor: c1,
                                background: 'rgba(255,255,255,0.85)',
                                boxShadow: '0 -2px 6px rgba(0,0,0,0.06)' }
                            : { color: '#9c6d3a', borderBottomColor: 'transparent',
                                background: 'transparent' }
                        }
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}

                    <div className="flex-1" />

                    {/* action icons */}
                    <div className="flex items-center gap-0.5 pb-1">
                      {onEdit && (
                        <button onClick={() => onEdit(book)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
                          title="Edit" style={{ color: '#3b82f6' }}
                        ><Edit className="w-4 h-4" /></button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => { if (window.confirm(`Hapus "${book.title}"?`)) { onDelete(book.id); onClose() } }}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                          title="Hapus" style={{ color: '#ef4444' }}
                        ><Trash2 className="w-4 h-4" /></button>
                      )}
                      <button onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
                        title="Tutup" style={{ color: '#9ca3af' }}
                      ><X className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* ── Tab content ─────────────────────────────── */}
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <AnimatePresence mode="wait">
                      {activeTab === 'progress' && (
                        <motion.div key="tp"
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
                          className="space-y-4"
                        >
                          {book.status === 'reading' ? (
                            <ReadingProgressSection book={book} onProgressChange={handleProgress} />
                          ) : (
                            <div className="flex flex-col items-center justify-center py-14 text-center">
                              <BookOpen className="w-12 h-12 mb-3" style={{ color: `${c1}40` }} />
                              <p className="text-sm" style={{ color: '#9c6d3a' }}>
                                {book.status === 'finished' ? 'Buku ini sudah selesai dibaca 🎉' : 'Mulai membaca untuk melihat progress'}
                              </p>
                              {book.status === 'unread' && (
                                <button onClick={handleStart} disabled={startReading.isPending}
                                  className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                                  style={{ background: `linear-gradient(135deg, ${c0}, ${c2})` }}
                                >
                                  Mulai Membaca
                                </button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'session' && (
                        <motion.div key="ts"
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
                        >
                          <ReadingSessionTimer book={book} updateProgress={updateProgress} />
                        </motion.div>
                      )}

                      {activeTab === 'notes' && (
                        <motion.div key="tn"
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
                        >
                          <BookNotesSection
                            userNotes={userNotes} tempNotes={tempNotes}
                            isEditingNotes={isEditingNotes} updateNotes={updateNotes}
                            onEdit={() => { setTempNotes(userNotes); setIsEditingNotes(true) }}
                            onSave={handleNotes}
                            onCancel={() => setIsEditingNotes(false)}
                            onTempNotesChange={setTempNotes}
                          />
                        </motion.div>
                      )}

                      {activeTab === 'info' && (
                        <motion.div key="ti"
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
                          className="space-y-2.5"
                        >
                          {[
                            { icon: <Package  className="w-4 h-4" />, label: 'Penerbit',    val: book.publisher },
                            { icon: <Hash     className="w-4 h-4" />, label: 'ISBN',        val: book.isbn, mono: true },
                            { icon: <Globe    className="w-4 h-4" />, label: 'Bahasa',      val: book.language },
                            { icon: <BookOpen className="w-4 h-4" />, label: 'Format',      val: book.format ? book.format.charAt(0).toUpperCase() + book.format.slice(1) : undefined },
                            { icon: <Calendar className="w-4 h-4" />, label: 'Tahun Terbit',val: book.publishYear?.toString() },
                          ].filter(r => !!r.val).map((row, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                              style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${c0}22`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                            >
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: `${c0}20`, color: c1 }}
                              >{row.icon}</div>
                              <div className="min-w-0">
                                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#9c6d3a' }}>{row.label}</div>
                                <div className={`text-sm font-medium truncate ${(row as any).mono ? 'font-mono' : ''}`} style={{ color: '#2a1a08' }}>{row.val}</div>
                              </div>
                            </div>
                          ))}

                          {(book.purchaseDate || book.purchasePrice || book.purchaseLocation) && (
                            <div className="mt-3">
                              <p className="text-[10px] uppercase tracking-widest px-1 mb-2" style={{ color: '#9c6d3a' }}>Informasi Pembelian</p>
                              <div className="p-3 rounded-xl space-y-2"
                                style={{ background: '#fef9ec', border: '1px solid #fcd34d66' }}
                              >
                                {book.purchaseDate && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d97706' }} />
                                    <span style={{ color: '#9c6d3a' }}>Tanggal:</span>
                                    <span className="font-medium" style={{ color: '#2a1a08' }}>
                                      {new Date(book.purchaseDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                  </div>
                                )}
                                {book.purchaseLocation && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d97706' }} />
                                    <span style={{ color: '#9c6d3a' }}>Tempat:</span>
                                    <span className="font-medium" style={{ color: '#2a1a08' }}>{book.purchaseLocation}</span>
                                  </div>
                                )}
                                {book.purchasePrice && (
                                  <div className="flex justify-between items-center pt-1.5 border-t" style={{ borderColor: '#fcd34d66' }}>
                                    <span className="text-xs" style={{ color: '#9c6d3a' }}>Harga</span>
                                    <span className="font-bold" style={{ color: '#2a1a08' }}>Rp {book.purchasePrice.toLocaleString('id-ID')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {(book.startedDate || book.finishedDate) && (
                            <div className="mt-2">
                              <p className="text-[10px] uppercase tracking-widest px-1 mb-2" style={{ color: '#9c6d3a' }}>Riwayat Membaca</p>
                              <div className="p-3 rounded-xl space-y-1.5"
                                style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${c0}22` }}
                              >
                                {book.startedDate && (
                                  <div className="flex justify-between text-sm">
                                    <span style={{ color: '#9c6d3a' }}>Mulai membaca</span>
                                    <span className="font-medium" style={{ color: '#2a1a08' }}>{new Date(book.startedDate).toLocaleDateString('id-ID')}</span>
                                  </div>
                                )}
                                {book.finishedDate && (
                                  <div className="flex justify-between text-sm">
                                    <span style={{ color: '#9c6d3a' }}>Selesai</span>
                                    <span className="font-medium" style={{ color: '#2a1a08' }}>{new Date(book.finishedDate).toLocaleDateString('id-ID')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Page footer with navigator ───────────────── */}
                  <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-t"
                    style={{ borderColor: `${c1}18` }}
                  >
                    <button
                      onClick={() => { if (tabIdx > 0) setActiveTab(tabs[tabIdx - 1].id) }}
                      disabled={tabIdx === 0}
                      className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0"
                    >
                      <ChevronLeft className="w-4 h-4" style={{ color: '#9c6d3a' }} />
                    </button>
                    <span className="text-xs italic" style={{ color: `${c1}60`, fontFamily: 'Georgia, serif' }}>
                      {tabIdx + 1} / {tabs.length}
                    </span>
                    <button
                      onClick={() => { if (tabIdx < tabs.length - 1) setActiveTab(tabs[tabIdx + 1].id) }}
                      disabled={tabIdx === tabs.length - 1}
                      className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0"
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: '#9c6d3a' }} />
                    </button>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
