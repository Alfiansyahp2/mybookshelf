import { motion } from 'framer-motion'
import LibraryShelf from './Shelf'
import type { Book, Shelf as ShelfType } from '../types'

interface BookshelfProps {
  books: Book[]
  shelves: ShelfType[]
  onAddBook?: (shelfId: string, shelfName?: string) => void
  onEditShelf?: (shelfId: string) => void
  onDeleteShelf?: (shelfId: string) => void
  filterStatus?: string
  selectedBookId?: string | null
  isDrawerOpen?: boolean
  onBookClick?: (book: Book) => void
}

export default function Bookshelf({
  books, shelves, onAddBook, filterStatus,
  selectedBookId, isDrawerOpen = false, onBookClick,
}: BookshelfProps) {

  const distributeBooksAcrossShelves = (): Map<string, Book[]> => {
    const dist = new Map<string, Book[]>()
    shelves.forEach(s => dist.set(s.id, []))
    const filtered = filterStatus ? books.filter(b => b.status === filterStatus) : books
    const sorted = [...filtered].sort((a, b) => {
      if (a.status === 'borrowed' && b.status !== 'borrowed') return -1
      if (a.status !== 'borrowed' && b.status === 'borrowed') return 1
      return 0
    })
    sorted.forEach(book => {
      if (book.shelfId && dist.has(book.shelfId)) dist.get(book.shelfId)!.push(book)
    })
    return dist
  }

  const booksDistribution = distributeBooksAcrossShelves()

  const visibleShelves = filterStatus
    ? shelves.filter(s => (booksDistribution.get(s.id) || []).length > 0)
    : shelves

  const handleBookClick   = (book: Book)      => onBookClick?.(book)
  const handleAddBook     = (shelfId: string) => { const s = shelves.find(x => x.id === shelfId); onAddBook?.(shelfId, s?.name) }
  const handleEditShelf   = (shelfId: string) => window.dispatchEvent(new CustomEvent('editShelf',   { detail: { shelfId } }))
  const handleDeleteShelf = (shelfId: string) => window.dispatchEvent(new CustomEvent('deleteShelf', { detail: { shelfId } }))

  /* Wood grain positions for the outer frame */
  const frameGrain = [10, 22, 38, 55, 72, 88]

  return (
    /* ── Room wall ──────────────────────────────────── */
    <div
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        /* Warm cream/linen wall */
        background: 'linear-gradient(155deg, #e8d5b4 0%, #d4be96 40%, #c9b082 100%)',
        padding: '0 0 16px',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.2)',
      }}
    >
      {/* Subtle wall texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', opacity:0.25,
        backgroundImage:`
          repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.015) 4px,rgba(0,0,0,0.015) 5px),
          repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,0.01) 6px,rgba(0,0,0,0.01) 7px)
        `,
      }} />

      {/* Warm ambient ceiling glow */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:80, pointerEvents:'none',
        background:'radial-gradient(ellipse at 50% 0%, rgba(255,220,150,0.2) 0%, transparent 80%)',
      }} />

      {/* ── Bookcase unit ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          position: 'relative',
          /* Outer bookcase shadow */
          filter: 'drop-shadow(0 14px 40px rgba(0,0,0,0.38)) drop-shadow(0 3px 8px rgba(0,0,0,0.25))',
        }}
      >
        {/* ── Top rail of bookcase ─────────────────── */}
        <div
          style={{
            height: 22,
            background: 'linear-gradient(180deg, #c4956a 0%, #a07040 40%, #7a5028 70%, #6b4020 100%)',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -3px 6px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.18)' }} />
          {frameGrain.map(p => (
            <div key={p} style={{ position:'absolute', top:3, bottom:3, left:`${p}%`, width:1, background:'rgba(0,0,0,0.09)' }} />
          ))}
        </div>

        {/* ── Shelves stacked ──────────────────────── */}
        <div style={{ overflow: 'visible' }}>
          {visibleShelves.map((shelf, idx) => (
            <LibraryShelf
              key={shelf.id}
              shelf={shelf}
              books={booksDistribution.get(shelf.id) || []}
              onBookClick={handleBookClick}
              onAddBook={handleAddBook}
              onEditShelf={handleEditShelf}
              onDeleteShelf={handleDeleteShelf}
              isDrawerOpen={isDrawerOpen}
              selectedBookId={selectedBookId}
              shelfIndex={idx}
            />
          ))}
        </div>

        {/* ── Bottom base plinth ───────────────────── */}
        <div
          style={{
            height: 24,
            background: 'linear-gradient(180deg, #7a5028 0%, #5c3818 50%, #4a2c10 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'rgba(255,255,255,0.1)' }} />
          {frameGrain.map(p => (
            <div key={p} style={{ position:'absolute', top:3, bottom:3, left:`${p}%`, width:1, background:'rgba(0,0,0,0.08)' }} />
          ))}
        </div>
      </motion.div>

      {/* ── Floor baseboard ─────────────────────────── */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 16,
          background: 'linear-gradient(180deg, #b8956a 0%, #9a7550 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}
