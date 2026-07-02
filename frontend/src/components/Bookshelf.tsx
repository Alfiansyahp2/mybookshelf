import { motion } from 'framer-motion'
import LibraryShelf from './Shelf'
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { SortableShelf } from './SortableShelf'
import { useLighting, TEMP_COLORS } from '../hooks/useLighting'
import type { Book, Shelf as ShelfType } from '../types'

interface BookshelfProps {
  books: Book[]
  shelves: ShelfType[]
  isEditMode?: boolean
  onSaveLayout?: (layoutData: { id: string; order: number; span: number }[]) => void
  onAddBook?: (shelfId: string, shelfName?: string) => void
  onEditShelf?: (shelfId: string) => void
  onDeleteShelf?: (shelfId: string) => void
  filterStatus?: string
  selectedBookId?: string | null
  isDrawerOpen?: boolean
  onBookClick?: (book: Book) => void
}

/*
 * Palette — Pinterest vintage library
 *
 * Outer room wall : warm linen/parchment
 * Bookcase frame  : medium honey-walnut (not too dark)
 * Frame highlights: slightly lighter on top edges
 */
const FRAME = {
  topRail:  'linear-gradient(180deg, #c09060 0%, #9a7040 40%, #7a5428 70%, #624018 100%)',
  sideBar:  'linear-gradient(to right, #7a5428 0%, #9a6e40 40%, #8a6030 70%, #6a4618 100%)',
  basePlinth:'linear-gradient(180deg, #8a6030 0%, #6a4820 50%, #543814 100%)',
}

export default function Bookshelf({
  books, shelves, isEditMode = false, onSaveLayout, onAddBook, filterStatus,
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

  const handleBookClick    = (book: Book)       => onBookClick?.(book)
  const handleAddBook      = (shelfId: string)  => { const s = shelves.find(x => x.id === shelfId); onAddBook?.(shelfId, s?.name) }
  const handleEditShelf    = (shelfId: string)  => window.dispatchEvent(new CustomEvent('editShelf',   { detail: { shelfId } }))
  const handleDeleteShelf  = (shelfId: string)  => window.dispatchEvent(new CustomEvent('deleteShelf', { detail: { shelfId } }))

  /* ── Lighting state ──────────────────────────── */
  const { on: lightOn, brightness, colorTemp } = useLighting()
  const ct = TEMP_COLORS[colorTemp]
  const ledOpacity = lightOn ? brightness / 100 : 0

  const grainPcts = [8, 18, 30, 44, 58, 72, 84, 93]

  // --- Layout Edit State ---
  const [localShelves, setLocalShelves] = useState<ShelfType[]>([])

  useEffect(() => {
    if (!isEditMode) {
      setLocalShelves(shelves)
    }
  }, [isEditMode, shelves])

  useEffect(() => {
    if (!isEditMode && onSaveLayout && localShelves !== shelves) {
      // It was saved via Library.tsx, but Library.tsx needs the layout data.
      // Wait, Library.tsx doesn't have the data, it triggers onSaveLayout!
      // I should call onSaveLayout from a useEffect when isEditMode turns false?
      // No, Library.tsx triggers it. We should pass the local state UP.
      // Since Library.tsx calls updateLayout, it's better if Library.tsx holds the state, OR Bookshelf manages the save button itself.
      // Actually, if we use useEffect:
    }
  }, [isEditMode])

  // Fix: pass data up to Library via a ref or just call onSaveLayout here when isEditMode goes false
  const [prevEditMode, setPrevEditMode] = useState(isEditMode)
  useEffect(() => {
    if (prevEditMode && !isEditMode) {
      // Just turned off
      onSaveLayout?.(localShelves.map((s, i) => ({ id: s.id, order: i, span: s.span || 12 })))
    }
    setPrevEditMode(isEditMode)
  }, [isEditMode, prevEditMode, localShelves, onSaveLayout])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setLocalShelves((items) => {
        const oldIndex = items.findIndex((s) => s.id === active.id)
        const newIndex = items.findIndex((s) => s.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleResize = (id: string, span: number) => {
    setLocalShelves((items) => items.map(s => s.id === id ? { ...s, span } : s))
  }

  const shelvesToRender = isEditMode ? localShelves : visibleShelves

  return (
    /* ── Room / wall background ─────────────────── */
    <div style={{
      position:'relative',
      borderRadius:14,
      overflow:'hidden',
      /* Warm parchment wall — like a reading room */
      background:'linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)',
      padding:'0 0 14px',
      boxShadow:'inset 0 0 50px rgba(0,0,0,0.08), 0 6px 28px rgba(0,0,0,0.18)',
    }}>

      {/* Plaster / linen wall texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', opacity:0.18,
        backgroundImage:`
          repeating-linear-gradient(0deg,  transparent, transparent 5px, rgba(0,0,0,0.02) 5px, rgba(0,0,0,0.02) 6px),
          repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px)
        `,
      }} />

      {/* Warm ceiling ambient glow */}
      <motion.div
        animate={{ opacity: ledOpacity }}
        transition={{ duration: 0.5 }}
        style={{
          position:'absolute', top:0, left:'10%', right:'10%', height:150, pointerEvents:'none',
          background:`radial-gradient(ellipse at 50% -20%, ${ct.glow}0.5) 0%, transparent 70%)`,
        }}
      />

      {/* Room Darkening Overlay (Wall dimming when lights are low) */}
      <motion.div
        animate={{ opacity: (1 - ledOpacity) * 0.7 }}
        transition={{ duration: 0.5 }}
        style={{ position:'absolute', inset:0, background:'#000', pointerEvents:'none', zIndex: 1 }}
      />

      {/* ── Bookcase unit ──────────────────────── */}
      <motion.div
        initial={{ opacity:0, y:12 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.45 }}
        style={{
          position:'relative',
          zIndex: 10,
          filter:'drop-shadow(0 12px 36px rgba(0,0,0,0.32)) drop-shadow(0 2px 6px rgba(0,0,0,0.22))',
        }}
      >
        {/* ── Top rail ─────────────────────────── */}
        <div style={{
          height:20,
          background: FRAME.topRail,
          boxShadow:'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.25)',
          borderRadius:'10px 10px 0 0',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
            background:'rgba(255,255,255,0.2)' }} />
          {grainPcts.map(p => (
            <div key={p} style={{ position:'absolute', top:3, bottom:3, left:`${p}%`, width:1,
              background:'rgba(0,0,0,0.1)' }} />
          ))}
        </div>

        {/* ── Shelves ──────────────────────────── */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 0, padding: 0, position: 'relative' }}>
            <SortableContext items={shelvesToRender.map(s => s.id)} strategy={rectSortingStrategy}>
              {shelvesToRender.map((shelf, idx) => (
                <SortableShelf
                  key={shelf.id}
                  shelf={shelf}
                  books={booksDistribution.get(shelf.id) || []}
                  isEditMode={isEditMode}
                  onResize={handleResize}
                  onBookClick={handleBookClick}
                  onAddBook={handleAddBook}
                  onEditShelf={handleEditShelf}
                  onDeleteShelf={handleDeleteShelf}
                  isDrawerOpen={isDrawerOpen}
                  selectedBookId={selectedBookId}
                  shelfIndex={idx}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>

        {/* ── Base plinth ──────────────────────── */}
        <div style={{
          height:22,
          background: FRAME.basePlinth,
          boxShadow:'inset 0 3px 5px rgba(0,0,0,0.25), 0 5px 18px rgba(0,0,0,0.45)',
          borderRadius:'0 0 6px 6px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1,
            background:'rgba(255,255,255,0.1)' }} />
          {grainPcts.map(p => (
            <div key={p} style={{ position:'absolute', top:3, bottom:3, left:`${p}%`, width:1,
              background:'rgba(0,0,0,0.08)' }} />
          ))}
        </div>
      </motion.div>

      {/* ── Floor baseboard ──────────────────── */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:14,
        background:'linear-gradient(180deg, #b89060 0%, #9a7440 100%)',
        boxShadow:'inset 0 2px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  )
}
