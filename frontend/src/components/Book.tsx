import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Book } from '../types'

interface BookProps {
  book: Book
  onClick: () => void
  isDrawerOpen?: boolean
  shelfHeight: number
}

const STATUS_LABEL: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  reading:  { dot: '#10b981', bg: '#d1fae5', text: '#065f46', label: 'Sedang Dibaca' },
  finished: { dot: '#3b82f6', bg: '#dbeafe', text: '#1e40af', label: 'Selesai' },
  unread:   { dot: '#9ca3af', bg: '#f3f4f6', text: '#374151', label: 'Belum Dibaca' },
  wishlist: { dot: '#a855f7', bg: '#f3e8ff', text: '#6b21a8', label: 'Wishlist' },
  borrowed: { dot: '#f59e0b', bg: '#fef3c7', text: '#92400e', label: 'Dipinjam' },
}

const THICKNESS: Record<string, number> = { thin: 24, regular: 32, thick: 44 }

export default function RealisticBook({ book, onClick, isDrawerOpen, shelfHeight }: BookProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const c0 = book.spineColors?.[0] || '#8B7355'
  const c1 = book.spineColors?.[1] || '#6B5344'
  const c2 = book.spineColors?.[2] || '#5C4532'

  const bookH = shelfHeight - 6   // almost full height — 6px gap for drop shadow at bottom
  const bookW = THICKNESS[book.thickness] ?? 32
  const statusCfg = STATUS_LABEL[book.status] ?? STATUS_LABEL['unread']


  useEffect(() => {
    if (isDrawerOpen) { setIsClicked(true) }
    else { const t = setTimeout(() => setIsClicked(false), 400); return () => clearTimeout(t) }
  }, [isDrawerOpen])

  return (
    <div
      className="relative flex-shrink-0"
      style={{ height: bookH, width: bookW, flexShrink: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Book spine ────────────────────────────── */}
      <motion.div
        className="w-full h-full cursor-pointer relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={isClicked
          ? { y: -28, rotateY: 12, scale: 1.08, zIndex: 50 }
          : isHovered
          ? { y: -10, scale: 1.02, zIndex: 30 }
          : { y: 0, rotateY: 0, scale: 1, zIndex: 1 }
        }
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={onClick}
        whileTap={{ scale: 0.96 }}
      >
        {/* Main spine face */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: '1px 2px 2px 1px',
            background: `linear-gradient(to right,
              ${c2} 0%, ${c2} 8%,
              rgba(0,0,0,0.25) 10%,
              ${c0} 20%, ${c1} 65%, ${c2} 100%)`,
            boxShadow: isHovered || isClicked
              ? `2px 0 12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)`
              : `1px 0 5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        >
          {/* Paper-page texture on right edge (pages) */}
          <div className="absolute right-0 top-0 bottom-0 w-1"
            style={{ background: 'linear-gradient(to left, #e8dcc8, #d4c5a9)', opacity: 0.7 }}
          />

          {/* Top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'rgba(255,255,255,0.35)' }}
          />
          {/* Bottom shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />

          {/* Fabric/cloth texture */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 3px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)`,
            }}
          />

          {/* Decorative top/bottom bands */}
          <div className="absolute top-2.5 left-0 right-1 h-0.5"
            style={{ background: `linear-gradient(to right, rgba(0,0,0,0.4), rgba(255,255,255,0.2), rgba(0,0,0,0.4))` }}
          />
          <div className="absolute bottom-2.5 left-0 right-1 h-0.5"
            style={{ background: `linear-gradient(to right, rgba(0,0,0,0.4), rgba(255,255,255,0.2), rgba(0,0,0,0.4))` }}
          />

          {/* Title text on spine */}
          {bookW >= 20 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ padding: '12px 3px' }}
            >
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: bookW >= 36 ? 9 : 7,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                  maxHeight: bookH - 40,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.3,
                }}
              >
                {book.title}
              </span>
            </div>
          )}

          {/* Reading bookmark ribbon */}
          {book.status === 'reading' && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: -8, width: 4, height: 20,
                background: 'linear-gradient(180deg,#ef4444,#b91c1c)',
                borderRadius: '0 0 2px 2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              }}
              animate={{ scaleY: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {/* Reading glow */}
          {book.status === 'reading' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ boxShadow: ['inset 0 0 6px rgba(239,68,68,0.2)', 'inset 0 0 14px rgba(239,68,68,0.4)', 'inset 0 0 6px rgba(239,68,68,0.2)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}

          {/* Finished badge */}
          {book.status === 'finished' && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3 h-3"
              style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            />
          )}

          {/* Favorite star */}
          {(book.favorite || book.isFavorite) && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2">
              <Star size={8} className="fill-yellow-300 text-yellow-300" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
            </div>
          )}
        </div>

        {/* Cast shadow on the shelf below the book */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 8,
            background: `radial-gradient(ellipse at center top, rgba(0,0,0,0.35) 0%, transparent 100%)`,
            transform: 'translateY(100%) scaleY(0.4)',
            transformOrigin: 'top',
            filter: 'blur(2px)',
            zIndex: -1,
          }}
        />
      </motion.div>

      {/* ── Hover tooltip card ─────────────────────── */}
      <AnimatePresence>
        {isHovered && !isClicked && (
          <motion.div
            initial={{ opacity: 0, x: -4, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: '100%',
              top: 0,
              marginLeft: 10,
              zIndex: 9999,
              pointerEvents: 'none',
              width: 172,
            }}
          >
            <div style={{
              background: 'rgba(255,251,245,0.97)',
              backdropFilter: 'blur(12px)',
              borderRadius: 10,
              boxShadow: '0 10px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14)',
              border: '1px solid rgba(139,115,85,0.18)',
              overflow: 'hidden',
            }}>
              <div style={{ height: 3, background: `linear-gradient(to right, ${c0}, ${c2})` }} />
              <div className="p-2.5">
                <div className="flex items-start gap-2 mb-2">
                  {/* Tiny book */}
                  <div className="flex-shrink-0 relative" style={{ width: 24, height: 36 }}>
                    <div className="absolute inset-0 rounded-r-sm" style={{ background: `linear-gradient(160deg,${c0},${c1} 50%,${c2})`, boxShadow: '2px 2px 5px rgba(0,0,0,0.35)' }} />
                    <div className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: `linear-gradient(to right,${c2},${c1})`, borderRadius: '1px 0 0 1px' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold leading-tight"
                      style={{ color: '#1a0e05', fontSize: 11, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >{book.title}</p>
                    <p className="text-[9px] mt-0.5 truncate italic" style={{ color: '#7c5c3a' }}>{book.author}</p>
                  </div>
                </div>

                {book.genre && (
                  <span className="inline-block text-[8px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider mb-1.5"
                    style={{ background: `${c0}22`, color: c2, border: `1px solid ${c0}33` }}
                  >{book.genre}</span>
                )}

                <div style={{ height: 1, background: `${c0}18`, margin: '4px 0' }} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: statusCfg.bg, color: statusCfg.text }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                    {statusCfg.label}
                  </div>
                  {book.personalRating ? (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-[8px] font-bold" style={{ color: '#7c5c3a' }}>{book.personalRating}</span>
                    </div>
                  ) : null}
                </div>

                {book.status === 'reading' && book.pages && book.pages > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[8px] mb-0.5" style={{ color: '#9c7a5a' }}>
                      <span>Hal. {book.currentPage || 0}</span>
                      <span>{Math.round(((book.currentPage || 0) / book.pages) * 100)}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: `${c0}25` }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.round(((book.currentPage || 0) / book.pages) * 100)}%`, background: `linear-gradient(to right,${c0},${c2})` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Arrow */}
            <div style={{
              position: 'absolute', left: -5, top: 16,
              width: 0, height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '5px solid rgba(255,251,245,0.97)',
              filter: 'drop-shadow(-1px 0 1px rgba(0,0,0,0.1))',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
