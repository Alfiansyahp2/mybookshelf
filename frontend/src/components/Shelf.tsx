import { motion } from 'framer-motion'
import RealisticBook from './Book'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Shelf, Book as BookType } from '../types'

interface ShelfProps {
  shelf: Shelf
  books: BookType[]
  onBookClick: (book: BookType) => void
  onAddBook?: (shelfId: string) => void
  onEditShelf?: (shelfId: string) => void
  onDeleteShelf?: (shelfId: string) => void
  isDrawerOpen?: boolean
  selectedBookId?: string | null
  shelfIndex?: number
}

const BOOK_AREA_H = 195   // height of the book standing area
const BOARD_H     = 20    // shelf board thickness
const INFO_H      = 34    // label + actions bar height
const TOTAL_H     = BOOK_AREA_H + BOARD_H + INFO_H

export default function LibraryShelf({
  shelf, books, onBookClick, onAddBook, onEditShelf, onDeleteShelf,
  isDrawerOpen, selectedBookId, shelfIndex = 0,
}: ShelfProps) {
  const occupied   = books.filter(b => b.status !== 'borrowed').length
  const percentage = Math.round(Math.min((occupied / shelf.capacity) * 100, 100))

  /* wood grain lines helper */
  const grainOffsets = [18, 42, 68, 100, 138, 172]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: shelfIndex * 0.07 }}
      style={{ position: 'relative', overflow: 'visible' }}
    >
      {/* ══════════════════════════════════════════════════
          SHELF ROW  — side panels + back wall + books + board
          ══════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', height: BOOK_AREA_H + BOARD_H, overflow: 'visible' }}>

        {/* ── Left side panel ───────────────────── */}
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, zIndex: 10,
            background: 'linear-gradient(to right, #5a3318 0%, #7a4e2a 40%, #6b4320 70%, #5a3318 100%)',
            boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.3), 2px 0 4px rgba(0,0,0,0.2)',
          }}
        >
          {grainOffsets.map(y => (
            <div key={y} style={{ position:'absolute', left:2, right:2, top:y, height:1, background:'rgba(0,0,0,0.15)' }} />
          ))}
          <div style={{ position:'absolute', top:0, right:0, bottom:0, width:2, background:'linear-gradient(to right,transparent,rgba(255,255,255,0.08))' }} />
        </div>

        {/* ── Right side panel ──────────────────── */}
        <div
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 20, zIndex: 10,
            background: 'linear-gradient(to left, #5a3318 0%, #7a4e2a 40%, #6b4320 70%, #5a3318 100%)',
            boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.3), -2px 0 4px rgba(0,0,0,0.2)',
          }}
        >
          {grainOffsets.map(y => (
            <div key={y} style={{ position:'absolute', left:2, right:2, top:y, height:1, background:'rgba(0,0,0,0.15)' }} />
          ))}
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:2, background:'linear-gradient(to left,transparent,rgba(255,255,255,0.08))' }} />
        </div>

        {/* ── Back wall — warm medium brown ─────── */}
        <div
          style={{
            position: 'absolute', inset: '0 20px', bottom: BOARD_H, zIndex: 0,
            background: 'linear-gradient(180deg, #7a5235 0%, #6b4828 50%, #5f3f22 100%)',
          }}
        >
          {/* Vertical wood planks on back wall */}
          {[12, 25, 38, 51, 64, 77, 90].map(p => (
            <div key={p} style={{
              position:'absolute', top:0, bottom:0,
              left:`${p}%`, width:1,
              background:'rgba(0,0,0,0.08)',
            }} />
          ))}
          {/* Ambient top light */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:60,
            background:'linear-gradient(180deg, rgba(255,210,140,0.12) 0%, transparent 100%)',
          }} />
          {/* Floor shadow at bottom */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:40,
            background:'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)',
          }} />
        </div>

        {/* ── Books container ───────────────────── */}
        <div
          style={{
            position: 'absolute', left: 20, right: 20, top: 0, bottom: BOARD_H,
            zIndex: 5,
            display: 'flex', alignItems: 'flex-end',
            gap: 1, paddingLeft: 4, paddingRight: 4,
            overflow: 'visible',
            perspective: '600px',
            perspectiveOrigin: '50% 100%',
          }}
        >
          {books.map((book, idx) => {
            if (book.status === 'borrowed') {
              return (
                <div key={book.id} style={{
                  width: 26, height: BOOK_AREA_H - 12, flexShrink: 0,
                  background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 3px,transparent 3px,transparent 8px)',
                  border: '1px dashed rgba(255,255,255,0.18)', borderRadius: 2,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <span style={{ fontSize:14, opacity:0.5 }}>📤</span>
                </div>
              )
            }
            return (
              <RealisticBook
                key={book.id}
                book={book}
                onClick={() => onBookClick(book)}
                isDrawerOpen={isDrawerOpen && selectedBookId === book.id}
                shelfHeight={BOOK_AREA_H + BOARD_H}
              />
            )
          })}
          <div style={{ flex: 1 }} />
        </div>

        {/* ── Shelf board ───────────────────────── */}
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: BOARD_H, zIndex: 8,
            background: 'linear-gradient(180deg, #c4956a 0%, #a87848 35%, #8b5e32 70%, #7a4e24 100%)',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2), 0 5px 16px rgba(0,0,0,0.45)',
          }}
        >
          {/* Top sheen */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.2)' }} />
          {/* Grain */}
          {[8, 20, 35, 55, 78].map(p => (
            <div key={p} style={{
              position:'absolute', top:2, bottom:2, left:`${p}%`, width:1,
              background:'rgba(0,0,0,0.07)',
            }} />
          ))}
          {/* Under-board drop shadow */}
          <div style={{
            position:'absolute', bottom:-8, left:4, right:4, height:10,
            background:'linear-gradient(180deg,rgba(0,0,0,0.35) 0%,transparent 100%)',
            pointerEvents:'none',
          }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          INFO BAR — label + capacity + actions
          sits BELOW the shelf board, inside the wood frame
          ══════════════════════════════════════════════════ */}
      <div
        style={{
          height: INFO_H,
          background: 'linear-gradient(180deg, #3d2210 0%, #2e1a0c 100%)',
          borderTop: '1px solid rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center',
          paddingLeft: 24, paddingRight: 12,
          gap: 12,
          overflow: 'hidden',
        }}
      >
        {/* Shelf name */}
        <span
          style={{
            color: 'rgba(255,220,160,0.85)',
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: "'Georgia', serif",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            flex: '0 1 160px',
          }}
        >
          {shelf.name}
        </span>

        {/* Capacity bar */}
        <div style={{ flex: 1, display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ flex:1, height:4, borderRadius:2, background:'rgba(255,255,255,0.1)', overflow:'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: shelfIndex * 0.07 + 0.3 }}
              style={{
                height: '100%', borderRadius: 2,
                background: percentage >= 90 ? '#ef4444' : percentage >= 70 ? '#f59e0b' : '#34d399',
              }}
            />
          </div>
          <span style={{ fontSize:10, color:'rgba(255,200,120,0.6)', whiteSpace:'nowrap', flexShrink:0 }}>
            {occupied} / {shelf.capacity}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width:1, height:16, background:'rgba(255,255,255,0.1)', flexShrink:0 }} />

        {/* Action buttons */}
        <div style={{ display:'flex', alignItems:'center', gap:2, flexShrink:0 }}>
          <ActionBtn
            icon={<Plus  className="w-3.5 h-3.5" />}
            label="Tambah"
            onClick={() => onAddBook?.(shelf.id)}
            color="#34d399"
          />
          <ActionBtn
            icon={<Edit  className="w-3.5 h-3.5" />}
            label="Edit"
            onClick={() => onEditShelf?.(shelf.id)}
            color="#60a5fa"
          />
          <ActionBtn
            icon={<Trash2 className="w-3.5 h-3.5" />}
            label="Hapus"
            onClick={() => { if (confirm(`Hapus rak "${shelf.name}"?`)) onDeleteShelf?.(shelf.id) }}
            color="#f87171"
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ── Tiny labelled action button ───────────────────── */
function ActionBtn({ icon, label, onClick, color }: {
  icon: React.ReactNode; label: string; onClick: () => void; color: string
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 3,
        padding: '3px 7px', borderRadius: 6,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color, cursor: 'pointer', transition: 'all 0.15s',
        fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)' }}
    >
      {icon}
      <span style={{ display:'inline' }}>{label}</span>
    </button>
  )
}
