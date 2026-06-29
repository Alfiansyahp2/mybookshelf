import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, BookOpen, Edit, Trash2, Star, Calendar, Heart, Play, Check,
  Hash, Globe, Package, ShoppingBag, MapPin, Clock, ChevronRight, ChevronLeft
} from 'lucide-react'
import { useUpdateProgress, useToggleFavorite, useUpdateNotes, useUpdateRating, useStartReading, useFinishReading } from '../../hooks/useBooks'
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

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  reading:  { label: 'Sedang Dibaca', color: 'text-emerald-700', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
  finished: { label: 'Selesai',       color: 'text-blue-700',    bg: 'bg-blue-100',    dot: 'bg-blue-500'    },
  unread:   { label: 'Belum Dibaca',  color: 'text-gray-600',    bg: 'bg-gray-100',    dot: 'bg-gray-400'    },
  wishlist: { label: 'Wishlist',      color: 'text-purple-700',  bg: 'bg-purple-100',  dot: 'bg-purple-500'  },
  borrowed: { label: 'Dipinjam',      color: 'text-orange-700',  bg: 'bg-orange-100',  dot: 'bg-orange-500'  },
}

/** Tab pages on the right side of the open book */
type RightTab = 'progress' | 'session' | 'notes' | 'info'

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
  const [activeTab, setActiveTab] = useState<RightTab>('progress')

  useEffect(() => {
    if (book) {
      setUserRating(book.personalRating || 0)
      setUserNotes(book.personalNotes || '')
      setTempNotes(book.personalNotes || '')
      setIsEditingNotes(false)
      // Auto-select best default tab
      if (book.status === 'reading') setActiveTab('progress')
      else if (book.status === 'finished') setActiveTab('notes')
      else setActiveTab('info')
    }
  }, [book])

  if (!book) return null

  const statusCfg = statusConfig[book.status] ?? statusConfig['unread']
  const progress = book.pages && book.pages > 0
    ? Math.round(((book.currentPage || 0) / book.pages) * 100)
    : 0

  const spineLight  = book.spineColors?.[0] || '#8B7355'
  const spineMid    = book.spineColors?.[1] || '#6B5344'
  const spineDark   = book.spineColors?.[2] || '#5C4532'

  // ── handlers ──────────────────────────────────────────────
  const handleToggleFavorite = () => toggleFavorite.mutate(book.id)
  const handleUpdateRating   = (r: number) => { setUserRating(r); updateRating.mutate({ id: book.id, rating: r }) }
  const handleProgressChange = (p: number) => updateProgress.mutate({ id: book.id, currentPage: p })
  const handleUpdateNotes    = () => { updateNotes.mutate({ id: book.id, notes: tempNotes }); setUserNotes(tempNotes); setIsEditingNotes(false) }
  const handleStartReading   = () => { if (book.status === 'unread') startReading.mutate(book.id) }
  const handleFinishReading  = () => { if (book.status === 'reading') finishReading.mutate(book.id) }

  const tabs: { id: RightTab; label: string; icon: React.ReactNode }[] = [
    { id: 'progress', label: 'Progress', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'session',  label: 'Sesi',     icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'notes',    label: 'Catatan',  icon: <Edit className="w-3.5 h-3.5" /> },
    { id: 'info',     label: 'Info',     icon: <Hash className="w-3.5 h-3.5" /> },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* ── Modal wrapper ─────────────────────────────────── */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="book"
              initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotateY: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 180, duration: 0.5 }}
              style={{ perspective: '2000px', pointerEvents: 'auto' }}
              className="w-full max-w-5xl"
            >

              {/* ══ OPEN-BOOK SHELL ══════════════════════════════ */}
              <div
                className="relative flex rounded-[4px] overflow-hidden"
                style={{
                  boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.35)',
                  minHeight: '600px',
                  maxHeight: '88vh',
                }}
              >

                {/* ── LEFT PAGE — Book cover & metadata ─────────── */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="relative w-[42%] flex flex-col overflow-hidden flex-shrink-0"
                  style={{
                    background: `linear-gradient(160deg, ${spineLight} 0%, ${spineMid} 55%, ${spineDark} 100%)`,
                  }}
                >
                  {/* Page texture overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(0,0,0,0.04) 29px)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                  {/* Shine */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(120deg,rgba(255,255,255,0.22) 0%,transparent 50%,rgba(0,0,0,0.12) 100%)',
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full p-7">
                    {/* Top: action buttons */}
                    <div className="flex items-center justify-between mb-5">
                      {/* Favorite */}
                      <button
                        onClick={handleToggleFavorite}
                        disabled={toggleFavorite.isPending}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 backdrop-blur-sm ${
                          (book.favorite || book.isFavorite)
                            ? 'bg-red-400/30 ring-2 ring-red-400/60'
                            : 'bg-white/15 hover:bg-white/25'
                        }`}
                        title={book.isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                      >
                        <Heart className={`w-4 h-4 ${book.isFavorite || book.favorite ? 'fill-red-300 text-red-300' : 'text-white/70'}`} />
                      </button>

                      {/* Status badge */}
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${statusCfg.bg} ${statusCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${book.status === 'reading' ? 'animate-pulse' : ''}`} />
                        {statusCfg.label}
                      </div>
                    </div>

                    {/* Book title & author */}
                    <div className="mb-6">
                      <h1 className="text-2xl font-serif font-bold text-white leading-tight mb-1.5" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                        {book.title}
                      </h1>
                      <p className="text-white/75 text-sm font-medium">
                        {book.author}
                      </p>
                      {book.genre && (
                        <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
                          {book.genre}
                        </span>
                      )}
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {[
                        { icon: <BookOpen className="w-3.5 h-3.5" />, val: book.pages || '—', label: 'Halaman' },
                        { icon: <Calendar className="w-3.5 h-3.5" />, val: book.publishYear || '—', label: 'Tahun' },
                        { icon: <Globe className="w-3.5 h-3.5" />, val: book.language || '—', label: 'Bahasa' },
                        { icon: <Package className="w-3.5 h-3.5" />, val: book.format ? book.format.charAt(0).toUpperCase() + book.format.slice(1) : '—', label: 'Format' },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                          <span className="text-white/60">{s.icon}</span>
                          <div>
                            <div className="text-white font-semibold text-xs leading-tight">{s.val}</div>
                            <div className="text-white/50 text-[10px]">{s.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress arc (if reading) */}
                    {book.status === 'reading' && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
                          <span>Progres Membaca</span>
                          <span className="font-bold text-white">{progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-full rounded-full bg-white/80"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-white/50 mt-1">
                          <span>Halaman {book.currentPage || 0}</span>
                          <span>dari {book.pages || '?'}</span>
                        </div>
                      </div>
                    )}

                    {/* Star rating */}
                    <div className="mb-6">
                      <div className="text-xs text-white/50 mb-2 uppercase tracking-wider">Rating Kamu</div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => handleUpdateRating(star)} className="transition-transform hover:scale-110 active:scale-95">
                            <Star className={`w-6 h-6 ${star <= userRating ? 'fill-yellow-300 text-yellow-300' : 'text-white/25'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Start / Finish reading */}
                    <div className="mt-auto flex gap-2">
                      {book.status === 'unread' && (
                        <button
                          onClick={handleStartReading}
                          disabled={startReading.isPending}
                          className="flex-1 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                        >
                          <Play className="w-4 h-4" />
                          Mulai Baca
                        </button>
                      )}
                      {book.status === 'reading' && (
                        <button
                          onClick={handleFinishReading}
                          disabled={finishReading.isPending}
                          className="flex-1 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          Selesai
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* ── SPINE / BINDING ───────────────────────────── */}
                <div
                  className="relative w-8 flex-shrink-0 flex flex-col items-center"
                  style={{
                    background: `linear-gradient(to right, ${spineDark}, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.45) 50%, ${spineDark} 100%)`,
                    boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.3), inset 4px 0 8px rgba(0,0,0,0.3)',
                    zIndex: 10,
                  }}
                >
                  {/* binding stitches */}
                  {[20, 33, 46, 59, 72, 85].map(pct => (
                    <div
                      key={pct}
                      className="absolute w-5 h-0.5 rounded-full bg-white/10"
                      style={{ top: `${pct}%` }}
                    />
                  ))}
                </div>

                {/* ── RIGHT PAGE — Details & tabs ───────────────── */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="flex-1 flex flex-col overflow-hidden"
                  style={{
                    background: 'linear-gradient(to right, #faf6f0, #fdf9f4)',
                    backgroundImage: `
                      linear-gradient(to right, #faf6f0, #fdf9f4),
                      repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139,115,85,0.07) 29px)
                    `,
                  }}
                >
                  {/* Page top decoration */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${spineDark}, ${spineLight})` }} />

                  {/* Tab bar */}
                  <div className="flex items-center gap-1 px-5 pt-4 pb-0 border-b border-walnut/10">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold transition-all border-b-2 ${
                          activeTab === tab.id
                            ? 'text-darkBrown border-walnut bg-white shadow-sm'
                            : 'text-walnut/50 border-transparent hover:text-walnut/80 hover:bg-white/50'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}

                    {/* spacer */}
                    <div className="flex-1" />

                    {/* Edit / Delete / Close */}
                    <div className="flex items-center gap-1 pb-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(book)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit buku"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus "${book.title}"?`)) { onDelete(book.id); onClose() }
                          }}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus buku"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="p-1.5 text-walnut/50 hover:bg-walnut/10 rounded-lg transition-colors"
                        title="Tutup"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <AnimatePresence mode="wait">
                      {activeTab === 'progress' && (
                        <motion.div
                          key="progress"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-4"
                        >
                          {book.status === 'reading' ? (
                            <ReadingProgressSection book={book} onProgressChange={handleProgressChange} />
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                              <BookOpen className="w-10 h-10 text-walnut/20 mb-3" />
                              <p className="text-sm text-walnut/50">
                                {book.status === 'finished' ? 'Buku ini sudah selesai dibaca 🎉' : 'Mulai membaca untuk melihat progress'}
                              </p>
                              {book.status === 'unread' && (
                                <button
                                  onClick={handleStartReading}
                                  disabled={startReading.isPending}
                                  className="mt-4 px-5 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors disabled:opacity-50"
                                >
                                  Mulai Membaca
                                </button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'session' && (
                        <motion.div
                          key="session"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                        >
                          <ReadingSessionTimer book={book} updateProgress={updateProgress} />
                        </motion.div>
                      )}

                      {activeTab === 'notes' && (
                        <motion.div
                          key="notes"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                        >
                          <BookNotesSection
                            userNotes={userNotes}
                            tempNotes={tempNotes}
                            isEditingNotes={isEditingNotes}
                            updateNotes={updateNotes}
                            onEdit={() => { setTempNotes(userNotes); setIsEditingNotes(true) }}
                            onSave={handleUpdateNotes}
                            onCancel={() => setIsEditingNotes(false)}
                            onTempNotesChange={setTempNotes}
                          />
                        </motion.div>
                      )}

                      {activeTab === 'info' && (
                        <motion.div
                          key="info"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-3"
                        >
                          {/* Info rows */}
                          {[
                            { icon: <Package className="w-4 h-4" />,  label: 'Penerbit',   val: book.publisher },
                            { icon: <Hash className="w-4 h-4" />,     label: 'ISBN',       val: book.isbn, mono: true },
                            { icon: <Globe className="w-4 h-4" />,    label: 'Bahasa',     val: book.language },
                            { icon: <BookOpen className="w-4 h-4" />, label: 'Format',     val: book.format ? book.format.charAt(0).toUpperCase() + book.format.slice(1) : undefined },
                            { icon: <Calendar className="w-4 h-4" />, label: 'Tahun Terbit', val: book.publishYear?.toString() },
                          ].filter(r => !!r.val).map((row, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-walnut/8 shadow-sm">
                              <div className="w-8 h-8 rounded-lg bg-walnut/10 flex items-center justify-center text-walnut flex-shrink-0">
                                {row.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] text-walnut/50 uppercase tracking-wider">{row.label}</div>
                                <div className={`text-sm font-medium text-darkBrown truncate ${row.mono ? 'font-mono' : ''}`}>{row.val}</div>
                              </div>
                            </div>
                          ))}

                          {/* Purchase info */}
                          {(book.purchaseDate || book.purchasePrice || book.purchaseLocation) && (
                            <div className="mt-4">
                              <div className="text-xs text-walnut/50 uppercase tracking-wider mb-2 px-1">Informasi Pembelian</div>
                              <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl space-y-2">
                                {book.purchaseDate && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-walnut/60">Tanggal:</span>
                                    <span className="font-medium text-darkBrown">{new Date(book.purchaseDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                  </div>
                                )}
                                {book.purchaseLocation && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-walnut/60">Tempat:</span>
                                    <span className="font-medium text-darkBrown">{book.purchaseLocation}</span>
                                  </div>
                                )}
                                {book.purchasePrice && (
                                  <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
                                    <span className="text-xs text-walnut/60">Harga</span>
                                    <span className="font-bold text-darkBrown">Rp {book.purchasePrice.toLocaleString('id-ID')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Reading dates */}
                          {(book.startedDate || book.finishedDate) && (
                            <div className="mt-2">
                              <div className="text-xs text-walnut/50 uppercase tracking-wider mb-2 px-1">Riwayat Membaca</div>
                              <div className="p-3 bg-white rounded-xl border border-walnut/10 space-y-2">
                                {book.startedDate && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-walnut/60">Mulai membaca</span>
                                    <span className="font-medium text-darkBrown">{new Date(book.startedDate).toLocaleDateString('id-ID')}</span>
                                  </div>
                                )}
                                {book.finishedDate && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-walnut/60">Selesai</span>
                                    <span className="font-medium text-darkBrown">{new Date(book.finishedDate).toLocaleDateString('id-ID')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Page number footer */}
                  <div className="px-5 py-2 border-t border-walnut/8 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const idx = tabs.findIndex(t => t.id === activeTab)
                        if (idx > 0) setActiveTab(tabs[idx - 1].id)
                      }}
                      className="p-1 text-walnut/30 hover:text-walnut/60 transition-colors disabled:opacity-0"
                      disabled={tabs.findIndex(t => t.id === activeTab) === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-walnut/30 font-serif italic">
                      {tabs.findIndex(t => t.id === activeTab) + 1} / {tabs.length}
                    </span>
                    <button
                      onClick={() => {
                        const idx = tabs.findIndex(t => t.id === activeTab)
                        if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id)
                      }}
                      className="p-1 text-walnut/30 hover:text-walnut/60 transition-colors disabled:opacity-0"
                      disabled={tabs.findIndex(t => t.id === activeTab) === tabs.length - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>

              </div>{/* end book shell */}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
