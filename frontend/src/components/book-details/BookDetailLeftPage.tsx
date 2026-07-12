import { motion } from 'framer-motion'
import { Play, Check, Heart, Star } from 'lucide-react'
import type { Book } from '../../types'

interface BookDetailLeftPageProps {
  book: Book;
  c0: string;
  c1: string;
  c2: string;
  cfg: any;
  progress: number;
  userRating: number;
  handleRating: (r: number) => void;
  handleFav: () => void;
  handleStart: () => void;
  handleFinish: () => void;
  toggleFavoritePending: boolean;
  startReadingPending: boolean;
  finishReadingPending: boolean;
  updateBookPending: boolean;
  setActiveTab: (tab: any) => void;
  setShowMarkAsReadDatePicker: (val: boolean) => void;
  updateBookMutate: (args: any) => void;
}

const PAPER_BG = '#f5ecd7'
const PAPER_LINES = 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,100,60,0.09) 28px)'

export default function BookDetailLeftPage({
  book, c0, c1, c2, cfg, progress, userRating,
  handleRating, handleFav, handleStart, handleFinish,
  toggleFavoritePending, startReadingPending, finishReadingPending, updateBookPending,
  setActiveTab, setShowMarkAsReadDatePicker, updateBookMutate
}: BookDetailLeftPageProps) {
  return (
    <motion.div
      key="left"
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0,  opacity: 1 }}
      exit={{    rotateY: 90, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 130, delay: 0.06 }}
      className="w-full md:w-[42%] flex-shrink-0 relative overflow-hidden flex flex-col"
      style={{
        transformOrigin: 'right center',
        background: PAPER_BG,
        backgroundImage: PAPER_LINES,
        boxShadow: 'inset -18px 0 28px rgba(0,0,0,0.18)',
        borderRadius: '3px 0 0 3px',
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
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-r-sm"
                />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10"
                    style={{ background: 'repeating-linear-gradient(180deg,transparent,transparent 3px,rgba(0,0,0,0.2) 4px)' }}
                  />
                  <p className="text-white text-center font-bold leading-tight relative z-10"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)', fontSize: 8 }}
                  >
                    {book.title}
                  </p>
                </>
              )}
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
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              <div
                className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
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

              {/* Gift badge */}
              {book.isGift && (
                <div
                  className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={{ background: '#fce7f3', color: '#9d174d', border: '1px solid #fbcfe8' }}
                >
                  🎁 Hadiah
                </div>
              )}

              {/* Purchased badge */}
              {(!book.isGift && book.purchaseDate) && (
                <div
                  className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }}
                >
                  🛒 Dibeli
                </div>
              )}

              {/* Borrowed from someone badge */}
              {book.borrowedBy && (
                <div
                  className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}
                >
                  📚 Pinjaman
                </div>
              )}
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

          {/* Reading progress bar (for reading and finished) */}
          {(book.status === 'reading' || book.status === 'finished') && (() => {
            const displayProgress = book.status === 'finished' ? 100 : progress;
            const displayPage = book.status === 'finished' ? (book.pages || 0) : (book.currentPage || 0);
            return (
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: '#9c6d3a' }}>
                  <span>Progress</span>
                  <span className="font-bold" style={{ color: '#2a1a08' }}>{displayProgress}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: `${c0}30` }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: book.status === 'finished' ? `linear-gradient(90deg, #10b981, #059669)` : `linear-gradient(90deg, ${c0}, ${c2})` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] mt-0.5" style={{ color: '#9c6d3a' }}>
                  <span>Hal. {displayPage}</span>
                  <span>dari {book.pages || '?'}</span>
                </div>
              </div>
            );
          })()}

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
              disabled={toggleFavoritePending}
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
              <div className="flex-1 flex gap-1.5">
                <button onClick={handleStart} disabled={startReadingPending}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${c0}, ${c2})`, color: 'white' }}
                  title="Mulai Membaca"
                >
                  <Play className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Mulai</span>
                </button>
                <button onClick={() => { setActiveTab('progress'); setShowMarkAsReadDatePicker(true); }} disabled={updateBookPending}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-transparent"
                  style={{ background: `${c0}15`, color: '#6b4c2a' }}
                  title="Tandai Sudah Dibaca"
                >
                  <Check className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Selesai</span>
                </button>
              </div>
            )}
            {book.status === 'reading' && (
              <button onClick={handleFinish} disabled={finishReadingPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white' }}
              >
                <Check className="w-3.5 h-3.5" />
                Selesai
              </button>
            )}
            {book.status === 'finished' && (
              <button onClick={() => updateBookMutate({ id: book.id, updates: { status: 'reading', currentPage: 0 } })} disabled={updateBookPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${c0}, ${c2})`, color: 'white' }}
              >
                <Play className="w-3.5 h-3.5" />
                Baca Ulang
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
  )
}
