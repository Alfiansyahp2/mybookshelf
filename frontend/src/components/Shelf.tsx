import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [isDeleting, setIsDeleting] = useState(false)

  /* ── Lighting state ──────────────────────────── */
  const { on: lightOn, brightness, colorTemp } = useLighting()
  const ct = TEMP_COLORS[colorTemp]
  const ledOpacity = lightOn ? brightness / 100 : 0

  const myDecos: ShelfDecoration[] = decoStore[shelf.id] || []
  const leftDeco  = myDecos.find(d => d.slot === 'left')
  const rightDeco = myDecos.find(d => d.slot === 'right')

  useEffect(() => { saveDecorations(decoStore) }, [decoStore])

  const handleSelectDeco = (kind: DecorationKind, customData?: any) => {
    if (!pickerSlot) return
    setDecoStore(prev => addDecoration(prev, shelf.id, kind, pickerSlot, customData))
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0"
              style={{ background: 'rgba(10,5,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsDeleting(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative rounded-2xl shadow-2xl p-6 max-w-sm w-full"
              style={{ background: '#fef9ec', border: '1px solid #fcd34d66' }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2a1a08' }}>Hapus Rak?</h3>
              <p className="text-sm mb-6" style={{ color: '#6b4c2a' }}>
                Apakah Anda yakin ingin menghapus rak <strong>"{shelf.name}"</strong>? Buku-buku di dalamnya tidak akan terhapus, namun akan kehilangan posisi raknya.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-black/5"
                  style={{ color: '#6b4c2a' }}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setIsDeleting(false);
                    onDeleteShelf?.(shelf.id);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-md shadow-red-500/20"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              style={{ flexShrink:0, display:'flex', alignItems: leftDeco?.kind === 'plant_hanging' ? 'flex-start' : 'flex-end', height: '100%', paddingLeft:4, paddingRight:6, cursor:'pointer', position:'relative', minWidth:8 }}
              onClick={() => setPickerSlot('left')}
              title="Tambah hiasan kiri"
            >
              {leftDeco
                ? <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} style={{ paddingBottom: leftDeco.kind === 'plant_hanging' ? 0 : 2 }}>
                    {renderDecoration(leftDeco, leftDeco.id)}
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
            <div className="hide-scrollbar" style={{ flex:1, display:'flex', alignItems:'flex-end', gap:1, overflowX:'auto', overflowY:'visible', perspective:'500px', perspectiveOrigin:'50% 100%', paddingBottom: 2 }}>
              {books.map(book => {
                if (book.status === 'borrowed') {
                  return (
                    <div key={book.id} onClick={() => onBookClick(book)} className="cursor-pointer hover:border-white/40 transition-colors" style={{ width:22, height:BOOK_AREA_H*0.82, flexShrink:0, background:'repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 3px,transparent 3px,transparent 7px)', border:'1px dashed rgba(255,255,255,0.15)', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:11, opacity:0.4 }} title={`Dipinjam oleh ${book.borrowedBy || 'seseorang'}`}>📤</span>
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
              style={{ flexShrink:0, display:'flex', alignItems: rightDeco?.kind === 'plant_hanging' ? 'flex-start' : 'flex-end', height: '100%', paddingLeft:6, paddingRight:4, cursor:'pointer', position:'relative', minWidth:8 }}
              onClick={() => setPickerSlot('right')}
              title="Tambah hiasan kanan"
            >
              {rightDeco
                ? <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} style={{ paddingBottom: rightDeco.kind === 'plant_hanging' ? 0 : 2 }}>
                    {renderDecoration(rightDeco, rightDeco.id)}
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
          <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
            <ActionBtn icon={<Plus size={12} />}   title="Tambah Buku" onClick={() => onAddBook?.(shelf.id)}    color="#ffffff" />
            <ActionBtn icon={<Pencil size={11} />} title="Edit Rak"    onClick={() => onEditShelf?.(shelf.id)}  color="#60a5fa" />
            <ActionBtn icon={<Trash2 size={11} />} title="Hapus Rak"   onClick={() => setIsDeleting(true)} color="#f87171" />
          </div>
        </div>
      </motion.div>
    </>
  )
}

function ActionBtn({ icon, title, onClick, color }: { icon: React.ReactNode; title: string; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', width:22, height:22, borderRadius:5, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', color, cursor:'pointer', transition:'all 0.12s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
    >
      {icon}
    </button>
  )
}
