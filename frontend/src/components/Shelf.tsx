import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react'
import RealisticBook from './Book'
import DecorationPicker from './decorations/DecorationPicker'
import {
  renderDecoration,
  loadDecorations, saveDecorations,
  addDecoration, removeDecoration,
  type DecorationKind, type ShelfDecoration,
} from './decorations/DecorationSystem'
import { useLighting, TEMP_COLORS } from '../hooks/useLighting'
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

/* ── Dimensions ─────────────────────────────────── */
const BOOK_AREA_H = 200   // book cavity height
const BOARD_H     = 14    // shelf board thickness
const INFO_H      = 32    // info strip below board

/* ── Wood palette (warm teak, like the photo ref) ─ */
const WOOD = {
  // Back wall: visible warm teak grain — NOT black
  back:    'linear-gradient(180deg, #b8844a 0%, #a87038 50%, #926030 100%)',
  backDark:'linear-gradient(180deg, #9a6e3a 0%, #8a5e2c 50%, #7a5025 100%)',
  // Shelf board top face
  board:   'linear-gradient(180deg, #d4a464 0%, #bc8c48 30%, #a07030 65%, #845020 100%)',
  // Side panels
  side:    'linear-gradient(to right, #6a4018 0%, #8a5a28 45%, #7a4e20 70%, #5a3410 100%)',
  sideR:   'linear-gradient(to left,  #6a4018 0%, #8a5a28 45%, #7a4e20 70%, #5a3410 100%)',
  // Info strip
  info:    'linear-gradient(180deg, #3a2008 0%, #2c1606 100%)',
}

export default function LibraryShelf({
  shelf, books, onBookClick, onAddBook, onEditShelf, onDeleteShelf,
  isDrawerOpen, selectedBookId, shelfIndex = 0,
}: ShelfProps) {
  /* ── Decoration state ─────────────────────────── */
  const [decoStore, setDecoStore] = useState(() => loadDecorations())
  const [pickerSlot, setPickerSlot] = useState<'left' | 'right' | null>(null)

  /* ── Lighting state ──────────────────────────── */
  const { on: lightOn, brightness, colorTemp } = useLighting()
  const ct = TEMP_COLORS[colorTemp]
  const ledOpacity = lightOn ? brightness / 100 : 0

  const myDecos: ShelfDecoration[] = decoStore[shelf.id] || []
  const leftDeco  = myDecos.find(d => d.slot === 'left')
  const rightDeco = myDecos.find(d => d.slot === 'right')

  useEffect(() => { saveDecorations(decoStore) }, [decoStore])

  const handleSelectDeco = (kind: DecorationKind) => {
    if (!pickerSlot) return
    setDecoStore(prev => addDecoration(prev, shelf.id, kind, pickerSlot))
  }
  const handleRemoveDeco = () => {
    if (!pickerSlot) return
    setDecoStore(prev => removeDecoration(prev, shelf.id, pickerSlot))
  }

  /* ── Capacity ──────────────────────────────────── */
  const occupied   = books.filter(b => b.status !== 'borrowed').length
  const percentage = Math.min((occupied / shelf.capacity) * 100, 100)
  const pctColor   = percentage >= 90 ? '#f87171' : percentage >= 70 ? '#fbbf24' : '#34d399'

  /* ── Wood grain helper ─────────────────────────── */
  const grainY = [14, 32, 52, 80, 115, 154, 186]

  return (
    <>
      {/* DecorationPicker bottom sheet */}
      <DecorationPicker
        isOpen={pickerSlot !== null}
        onClose={() => setPickerSlot(null)}
        slot={pickerSlot ?? 'left'}
        current={pickerSlot === 'left' ? leftDeco : rightDeco}
        onSelect={handleSelectDeco}
        onRemove={handleRemoveDeco}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: shelfIndex * 0.06 }}
        style={{ position: 'relative', overflow: 'visible' }}
      >
        {/* ═══════════════════════════════════════════
            SHELF CAVITY
            ═══════════════════════════════════════════ */}
        <div style={{ position: 'relative', height: BOOK_AREA_H + BOARD_H, overflow: 'visible' }}>

          {/* Left panel */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:20, zIndex:10, background:WOOD.side, boxShadow:'inset -4px 0 8px rgba(0,0,0,0.25), 2px 0 4px rgba(0,0,0,0.15)' }}>
            {grainY.map(y => <div key={y} style={{ position:'absolute', left:3, right:3, top:y, height:1, background:'rgba(0,0,0,0.1)', borderRadius:1 }} />)}
          </div>

          {/* Right panel */}
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:20, zIndex:10, background:WOOD.sideR, boxShadow:'inset 4px 0 8px rgba(0,0,0,0.25), -2px 0 4px rgba(0,0,0,0.15)' }}>
            {grainY.map(y => <div key={y} style={{ position:'absolute', left:3, right:3, top:y, height:1, background:'rgba(0,0,0,0.1)', borderRadius:1 }} />)}
          </div>

          {/* Back wall — warm visible teak */}
          <div style={{ position:'absolute', left:20, right:20, top:0, bottom:BOARD_H, zIndex:0, background:WOOD.back, overflow:'hidden', transition:'filter 0.5s' }}>
            {/* Teak vertical grain lines */}
            {[8,16,24,33,42,51,60,69,78,87,94].map(p => (
              <div key={p} style={{ position:'absolute', top:0, bottom:0, left:`${p}%`, width:1, background:'rgba(0,0,0,0.055)' }} />
            ))}
            {/* Horizontal variation */}
            {[30, 80, 130, 170].map(y => (
              <div key={y} style={{ position:'absolute', left:0, right:0, top:y, height:20, background:'rgba(0,0,0,0.04)' }} />
            ))}

            {/* ── LED glow spreading downward — driven by lighting state ── */}
            <motion.div
              animate={{ opacity: ledOpacity * 0.85 }}
              transition={{ duration: 0.5 }}
              style={{
                position:'absolute', top:0, left:0, right:0, height:120,
                background:`linear-gradient(180deg,${ct.glow}1) 0%,${ct.glow}0.1) 60%,transparent 100%)`,
                zIndex:1, pointerEvents:'none',
              }}
            />
            {/* Ambient dimming overlay — darker when brightness is low */}
            <motion.div
              animate={{ opacity: (1 - ledOpacity) * 0.85 }}
              transition={{ duration: 0.5 }}
              style={{ position:'absolute', inset:0, background:'rgba(0,0,0,1)', zIndex:2, pointerEvents:'none' }}
            />

            {/* ── LED strip physical bar ── */}
            <motion.div
              animate={{ opacity: ledOpacity, boxShadow: ledOpacity > 0 ? `0 0 ${25 * ledOpacity}px ${8 * ledOpacity}px ${ct.glow}${(ledOpacity * 0.9).toFixed(2)}), 0 0 6px ${ct.strip}` : 'none' }}
              transition={{ duration: 0.4 }}
              style={{
                position:'absolute', top:0, left:0, right:0, height:3, zIndex:3,
                background:`linear-gradient(to right,${ct.strip}aa,${ct.strip},${ct.strip}aa)`,
              }}
            />
          </div>

          {/* ── Content row: left deco + books + right deco ── */}
          <div style={{
            position:'absolute', left:20, right:20, top:0, bottom:BOARD_H,
            zIndex:5, display:'flex', alignItems:'flex-end', overflow:'visible',
          }}>

            {/* Left decoration slot */}
            <div
              style={{ flexShrink:0, display:'flex', alignItems:'flex-end', paddingLeft:4, paddingRight:6, cursor:'pointer', position:'relative', minWidth:8 }}
              onClick={() => setPickerSlot('left')}
              title="Tambah hiasan kiri"
            >
              {leftDeco
                ? <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} style={{ paddingBottom:2 }}>
                    {renderDecoration(leftDeco.kind, leftDeco.id)}
                  </motion.div>
                : <div style={{
                    width:22, height:40, border:'1.5px dashed rgba(255,210,100,0.3)', borderRadius:4,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(255,200,80,0.06)', transition:'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,200,80,0.14)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,210,100,0.5)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,200,80,0.06)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,210,100,0.3)' }}
                  >
                    <Sparkles size={10} color="rgba(255,210,100,0.5)" />
                  </div>
              }
            </div>

            {/* Books */}
            <div style={{ flex:1, display:'flex', alignItems:'flex-end', gap:1, overflow:'visible', perspective:'500px', perspectiveOrigin:'50% 100%' }}>
              {books.map(book => {
                if (book.status === 'borrowed') {
                  return (
                    <div key={book.id} style={{ width:22, height:BOOK_AREA_H*0.82, flexShrink:0, background:'repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 3px,transparent 3px,transparent 7px)', border:'1px dashed rgba(255,255,255,0.15)', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:11, opacity:0.4 }}>📤</span>
                    </div>
                  )
                }
                return (
                  <RealisticBook
                    key={book.id}
                    book={book}
                    onClick={() => onBookClick(book)}
                    isDrawerOpen={isDrawerOpen && selectedBookId === book.id}
                    bookAreaHeight={BOOK_AREA_H}
                  />
                )
              })}
            </div>

            {/* Right decoration slot */}
            <div
              style={{ flexShrink:0, display:'flex', alignItems:'flex-end', paddingLeft:6, paddingRight:4, cursor:'pointer', position:'relative', minWidth:8 }}
              onClick={() => setPickerSlot('right')}
              title="Tambah hiasan kanan"
            >
              {rightDeco
                ? <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} style={{ paddingBottom:2 }}>
                    {renderDecoration(rightDeco.kind, rightDeco.id)}
                  </motion.div>
                : <div style={{
                    width:22, height:40, border:'1.5px dashed rgba(255,210,100,0.3)', borderRadius:4,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(255,200,80,0.06)', transition:'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,200,80,0.14)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,210,100,0.5)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,200,80,0.06)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,210,100,0.3)' }}
                  >
                    <Sparkles size={10} color="rgba(255,210,100,0.5)" />
                  </div>
              }
            </div>
          </div>

          {/* Shelf board */}
          <div style={{ position:'absolute', left:0, right:0, bottom:0, height:BOARD_H, zIndex:8, background:WOOD.board, boxShadow:'inset 0 3px 4px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.35)' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.2)' }} />
            {[6,18,32,48,65,82,93].map(p => (
              <div key={p} style={{ position:'absolute', top:2, bottom:2, left:`${p}%`, width:1, background:'rgba(0,0,0,0.06)' }} />
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            INFO STRIP
            ═══════════════════════════════════════════ */}
        <div style={{ height:INFO_H, background:WOOD.info, borderTop:'1px solid rgba(0,0,0,0.3)', display:'flex', alignItems:'center', paddingLeft:24, paddingRight:10, gap:10, overflow:'hidden' }}>

          {/* Shelf name */}
          <span style={{ color:'rgba(255,210,140,0.85)', fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:"'Georgia',serif", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', flex:'0 0 auto', maxWidth:120 }}>
            {shelf.name}
          </span>

          {/* Progress bar */}
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
            <div style={{ flex:1, height:3, borderRadius:2, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
              <motion.div
                initial={{ width:0 }}
                animate={{ width:`${percentage}%` }}
                transition={{ duration:0.9, ease:'easeOut', delay: shelfIndex*0.07+0.3 }}
                style={{ height:'100%', borderRadius:2, background:pctColor }}
              />
            </div>
            <span style={{ fontSize:9, color:'rgba(255,195,110,0.5)', whiteSpace:'nowrap', flexShrink:0 }}>
              {occupied}/{shelf.capacity}
            </span>
          </div>

          <div style={{ width:1, height:14, background:'rgba(255,255,255,0.1)', flexShrink:0 }} />

          {/* Action buttons */}
          <div style={{ display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>
            <ActionBtn icon={<Plus size={11} />}   label="Tambah" onClick={() => onAddBook?.(shelf.id)}    color="#34d399" />
            <ActionBtn icon={<Pencil size={11} />} label="Edit"   onClick={() => onEditShelf?.(shelf.id)}  color="#60a5fa" />
            <ActionBtn icon={<Trash2 size={11} />} label="Hapus"  onClick={() => { if (confirm(`Hapus rak "${shelf.name}"?`)) onDeleteShelf?.(shelf.id) }} color="#f87171" />
          </div>
        </div>
      </motion.div>
    </>
  )
}

function ActionBtn({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{ display:'flex', alignItems:'center', gap:3, padding:'3px 8px', borderRadius:5, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', color, cursor:'pointer', transition:'all 0.12s', fontSize:9.5, fontWeight:600, whiteSpace:'nowrap' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
    >
      {icon} {label}
    </button>
  )
}
