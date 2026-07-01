/**
 * Shelf Decoration System
 *
 * Types, storage helpers, and CSS-drawn decoration components
 * for placing ornamental items on bookshelves.
 */
import { motion } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────
export type DecorationKind =
  | 'candle'
  | 'candle_pair'
  | 'plant_pot'
  | 'plant_hanging'
  | 'vase_tall'
  | 'vase_round'
  | 'frame_photo'
  | 'bookend_L'
  | 'clock_small'
  | 'mug'
  | 'lantern'
  | 'succulent'

export interface ShelfDecoration {
  id: string
  kind: DecorationKind
  /** 0–100, left-to-right percentage position on shelf */
  slot: 'left' | 'right'
}

export interface DecorationStore {
  [shelfId: string]: ShelfDecoration[]
}

const STORAGE_KEY = 'mybookshelf_decorations'

export function loadDecorations(): DecorationStore {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

export function saveDecorations(store: DecorationStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function addDecoration(
  store: DecorationStore,
  shelfId: string,
  kind: DecorationKind,
  slot: 'left' | 'right',
): DecorationStore {
  const list = store[shelfId] || []
  // only one per slot
  const filtered = list.filter(d => d.slot !== slot)
  const next: ShelfDecoration = { id: `${Date.now()}`, kind, slot }
  return { ...store, [shelfId]: [...filtered, next] }
}

export function removeDecoration(
  store: DecorationStore,
  shelfId: string,
  slot: 'left' | 'right',
): DecorationStore {
  const list = (store[shelfId] || []).filter(d => d.slot !== slot)
  return { ...store, [shelfId]: list }
}

// ── Decoration catalogue (label + emoji) ─────────────────
export const DECORATION_CATALOGUE: { kind: DecorationKind; label: string; emoji: string; desc: string }[] = [
  { kind: 'candle',        label: 'Lilin',          emoji: '🕯️',  desc: 'Lilin hangat menyala' },
  { kind: 'candle_pair',   label: 'Duo Lilin',       emoji: '🕯️🕯️', desc: 'Dua lilin berdampingan' },
  { kind: 'plant_pot',     label: 'Tanaman Pot',     emoji: '🪴',  desc: 'Tanaman hijau dalam pot' },
  { kind: 'plant_hanging', label: 'Tanaman Gantung', emoji: '🌿',  desc: 'Tanaman rambat menggantung' },
  { kind: 'succulent',     label: 'Sukulen',         emoji: '🌵',  desc: 'Kaktus mini lucu' },
  { kind: 'vase_tall',     label: 'Vas Tinggi',      emoji: '🏺',  desc: 'Vas elegan dengan bunga kering' },
  { kind: 'vase_round',    label: 'Vas Bulat',       emoji: '⚱️',  desc: 'Vas keramik bulat' },
  { kind: 'frame_photo',   label: 'Bingkai Foto',    emoji: '🖼️',  desc: 'Bingkai foto kenangan' },
  { kind: 'bookend_L',     label: 'Bookend',         emoji: '📐',  desc: 'Penopang buku berbentuk L' },
  { kind: 'clock_small',   label: 'Jam Meja',        emoji: '🕰️',  desc: 'Jam meja klasik kecil' },
  { kind: 'mug',           label: 'Mug Kopi',        emoji: '☕',  desc: 'Mug kopi hangat' },
  { kind: 'lantern',       label: 'Lentera',         emoji: '🏮',  desc: 'Lentera hangat vintage' },
]

// ── Individual CSS decoration renderers ──────────────────

function Candle({ scale = 1 }: { scale?: number }) {
  return (
    <div style={{ position: 'relative', width: 16 * scale, height: 52 * scale, flexShrink: 0 }}>
      {/* glow */}
      <motion.div style={{
        position: 'absolute', top: -14 * scale, left: '50%', transform: 'translateX(-50%)',
        width: 32 * scale, height: 32 * scale, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,210,80,0.5) 0%, transparent 75%)',
        pointerEvents: 'none',
      }}
        animate={{ opacity: [0.8, 1, 0.7, 1], scale: [0.9, 1.1, 0.95, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* flame */}
      <motion.div style={{
        position: 'absolute', top: -10 * scale, left: '50%', transform: 'translateX(-50%)',
        width: 7 * scale, height: 12 * scale,
        background: 'linear-gradient(180deg,#fff8c0 0%,#ffd040 40%,#ff8020 100%)',
        borderRadius: '50% 50% 35% 35%',
        boxShadow: `0 0 6px 2px rgba(255,160,40,0.55)`,
      }}
        animate={{ scaleX: [1, 0.8, 1.1, 0.9, 1], skewX: [0, -3, 3, -2, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* wick */}
      <div style={{ position: 'absolute', top: 1 * scale, left: '50%', transform: 'translateX(-50%)', width: 1.5, height: 4 * scale, background: '#2a1608' }} />
      {/* body */}
      <div style={{
        position: 'absolute', top: 4 * scale, left: '50%', transform: 'translateX(-50%)',
        width: 14 * scale, height: 46 * scale,
        background: 'linear-gradient(to right,#f0e8d8,#fffdf5,#e8e0c8)',
        borderRadius: `${3 * scale}px ${3 * scale}px ${4 * scale}px ${4 * scale}px`,
        boxShadow: '1px 1px 4px rgba(0,0,0,0.2)',
      }} />
      {/* drip */}
      <div style={{ position: 'absolute', top: 6 * scale, left: 2 * scale, width: 3 * scale, height: 7 * scale, background: 'rgba(245,238,224,0.8)', borderRadius: '0 0 50% 50%' }} />
    </div>
  )
}

function PlantPot() {
  const leaves = [
    { r: -50, x: -18, y: -8,  s: 1.1 },
    { r: -20, x: -8,  y: -16, s: 0.95 },
    { r:  10, x:  2,  y: -18, s: 1.0 },
    { r:  35, x: 14,  y: -10, s: 0.9 },
    { r:  60, x: 18,  y: -2,  s: 0.82 },
  ]
  return (
    <div style={{ position: 'relative', width: 58, height: 76, flexShrink: 0 }}>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 40, height: 30, background: 'linear-gradient(180deg,#c4784a,#8a4a1e)', clipPath: 'polygon(8% 0%,92% 0%,84% 100%,16% 100%)', boxShadow: '2px 2px 6px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', bottom: 26, left: 'calc(50% - 23px)', width: 46, height: 7, borderRadius: 3, background: 'linear-gradient(180deg,#d4885a,#a05828)' }} />
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', width: 4, height: 20, borderRadius: 2, background: '#3a6a2a' }} />
      {leaves.map((l, i) => (
        <motion.div key={i} style={{
          position: 'absolute', bottom: 46, left: `calc(50% + ${l.x}px)`,
          width: 26, height: 20,
          background: `linear-gradient(135deg,#4a9a40,#5ab848,#2d6a2a)`,
          borderRadius: '50% 10% 50% 10%',
          transform: `rotate(${l.r}deg) scale(${l.s})`,
          transformOrigin: 'bottom center',
          boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        }}
          animate={{ rotate: [l.r - 1.5, l.r + 1.5, l.r] }}
          transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

function PlantHanging() {
  const vines = [
    { x: 6,  len: 44, delay: 0 },
    { x: 18, len: 32, delay: 0.3 },
    { x: 30, len: 50, delay: 0.6 },
    { x: 42, len: 38, delay: 0.9 },
    { x: 52, len: 28, delay: 1.2 },
  ]
  return (
    <div style={{ position: 'relative', width: 68, height: 70, flexShrink: 0 }}>
      {/* pot */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 44, height: 22, background: 'linear-gradient(180deg,#c4784a,#8a4a1e)', clipPath: 'polygon(8% 0%,92% 0%,88% 100%,12% 100%)', boxShadow: '2px 2px 6px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', top: 18, left: 'calc(50% - 24px)', width: 48, height: 6, borderRadius: 3, background: 'linear-gradient(180deg,#d4885a,#a05828)' }} />
      {/* soil */}
      <div style={{ position: 'absolute', top: 22, left: 'calc(50% - 18px)', width: 36, height: 5, borderRadius: '50%', background: '#3a2010' }} />
      {/* vines */}
      {vines.map((v, i) => (
        <motion.div key={i} style={{
          position: 'absolute', top: 26, left: v.x,
          width: 2, height: v.len, borderRadius: 2,
          background: 'linear-gradient(180deg,#3a7a2a,#4a9a35)',
          transformOrigin: 'top center',
        }}
          animate={{ rotate: [-2, 2, -1, 2, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: v.delay }}
        >
          {/* leaves on vine */}
          {[12, 24, 36].filter(y => y < v.len - 6).map(y => (
            <div key={y} style={{ position: 'absolute', top: y, left: -6, width: 12, height: 9, background: '#5ab848', borderRadius: '50% 10% 50% 10%', transform: 'rotate(-30deg)' }} />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

function VaseTall() {
  return (
    <div style={{ position: 'relative', width: 30, height: 62, flexShrink: 0 }}>
      {/* vase body */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 28, height: 56, background: 'linear-gradient(to right,#8a7060,#c4a888,#a08870)', clipPath: 'polygon(20% 0%,80% 0%,95% 40%,100% 100%,0% 100%,5% 40%)', boxShadow: '2px 3px 8px rgba(0,0,0,0.3)' }} />
      {/* neck highlight */}
      <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', width: 14, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
      {/* dried flowers */}
      {[0, 12, 24].map((x, i) => (
        <div key={i} style={{ position: 'absolute', bottom: 48, left: `calc(50% + ${x - 12}px)`, width: 2, height: 18, background: '#8a6030', borderRadius: 1, transform: `rotate(${(i - 1) * 12}deg)`, transformOrigin: 'bottom center' }}>
          <div style={{ position: 'absolute', top: 0, left: -4, width: 9, height: 7, background: i === 1 ? '#d4784a' : '#c4a030', borderRadius: '50%' }} />
        </div>
      ))}
    </div>
  )
}

function VaseRound() {
  return (
    <div style={{ position: 'relative', width: 38, height: 48, flexShrink: 0 }}>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 36, height: 40, background: 'linear-gradient(135deg,#5a8a9a,#3a6a7a,#2a5a6a)', borderRadius: '40% 40% 45% 45%', boxShadow: '2px 3px 8px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', bottom: 36, left: 'calc(50% - 10px)', width: 20, height: 8, background: 'linear-gradient(135deg,#6aaabc,#4a8a9c)', borderRadius: '50% 50% 0 0' }} />
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 24, height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
    </div>
  )
}

function FramePhoto() {
  return (
    <div style={{ position: 'relative', width: 52, height: 42, flexShrink: 0 }}>
      <div style={{ width: '100%', height: '100%', border: '4px solid #7a5020', borderRadius: 3, background: 'linear-gradient(135deg,#d4c0a0,#b8a080)', boxShadow: '2px 3px 10px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        {/* simple landscape scene */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%', background: 'linear-gradient(180deg,#4a7a3a,#2a5020)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(180deg,#7ab0e0,#b8d8f8)' }} />
        <div style={{ position: 'absolute', bottom: '32%', left: '40%', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '10px solid #e8e4cc' }} />
        <div style={{ position: 'absolute', bottom: '30%', left: '15%', width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }} />
      </div>
      {/* frame stand */}
      <div style={{ position: 'absolute', bottom: -4, left: '55%', width: 3, height: 8, background: '#5a3a10', transform: 'rotate(15deg)', borderRadius: 2 }} />
    </div>
  )
}

function BookendL({ flip = false }: { flip?: boolean }) {
  return (
    <div style={{ position: 'relative', width: 20, height: 50, flexShrink: 0, transform: flip ? 'scaleX(-1)' : undefined }}>
      {/* vertical */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 8, height: 46, background: 'linear-gradient(to right,#3a3a3a,#5a5a5a,#3a3a3a)', borderRadius: '2px 2px 0 0', boxShadow: '1px 0 4px rgba(0,0,0,0.4)' }} />
      {/* horizontal */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 8, background: 'linear-gradient(180deg,#5a5a5a,#2a2a2a)', borderRadius: '0 2px 2px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} />
    </div>
  )
}

function ClockSmall() {
  const now = new Date()
  const hDeg = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5
  const mDeg = now.getMinutes() * 6
  return (
    <div style={{ position: 'relative', width: 38, height: 52, flexShrink: 0 }}>
      {/* base */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 28, height: 8, background: 'linear-gradient(180deg,#a08060,#6a5030)', borderRadius: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
      {/* clock face */}
      <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 36, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#f5f0e8,#e8e0d0)', border: '3px solid #8a6030', boxShadow: '0 2px 8px rgba(0,0,0,0.35), inset 0 1px 3px rgba(0,0,0,0.1)' }}>
        {/* hour marks */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
          <div key={deg} style={{ position: 'absolute', top: '50%', left: '50%', width: 1.5, height: deg % 90 === 0 ? 6 : 4, background: '#4a3020', transformOrigin: `0 -${deg % 90 === 0 ? 12 : 13}px`, transform: `rotate(${deg}deg) translateY(-50%)` }} />
        ))}
        {/* hour hand */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 2, height: 10, background: '#2a1a08', transformOrigin: '50% 100%', transform: `rotate(${hDeg}deg) translateX(-50%)`, marginTop: -10, marginLeft: -1 }} />
        {/* minute hand */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1.5, height: 13, background: '#4a3020', transformOrigin: '50% 100%', transform: `rotate(${mDeg}deg) translateX(-50%)`, marginTop: -13, marginLeft: -0.75 }} />
        {/* center dot */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius: '50%', background: '#8a4020', transform: 'translate(-50%,-50%)' }} />
      </div>
    </div>
  )
}

function Mug() {
  return (
    <div style={{ position: 'relative', width: 40, height: 44, flexShrink: 0 }}>
      <div style={{ position: 'absolute', bottom: 0, left: 4, width: 32, height: 38, background: 'linear-gradient(to right,#4a6a8a,#6a8aaa,#4a6a8a)', borderRadius: '4px 4px 8px 8px', boxShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 8, background: 'rgba(255,255,255,0.07)', borderRadius: '2px 2px 6px 6px' }} />
      </div>
      {/* handle */}
      <div style={{ position: 'absolute', bottom: 10, right: 0, width: 10, height: 18, border: '3px solid #5a7a9a', borderRadius: '0 8px 8px 0', borderLeft: 'none' }} />
      {/* steam */}
      <motion.div style={{ position: 'absolute', bottom: 38, left: 12, width: 2, height: 8, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }}
        animate={{ opacity: [0.4, 0.8, 0.3], scaleY: [0.8, 1.2, 0.9], y: [0, -4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div style={{ position: 'absolute', bottom: 38, left: 20, width: 2, height: 6, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }}
        animate={{ opacity: [0.3, 0.7, 0.2], scaleY: [1, 1.3, 0.8], y: [0, -3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  )
}

function Lantern() {
  return (
    <div style={{ position: 'relative', width: 32, height: 58, flexShrink: 0 }}>
      {/* glow */}
      <motion.div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 50, height: 50, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,190,60,0.3) 0%,transparent 70%)', pointerEvents: 'none' }}
        animate={{ opacity: [0.7, 1, 0.6, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      {/* top hook */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 6, height: 8, border: '2px solid #8a6020', borderBottom: 'none', borderRadius: '3px 3px 0 0' }} />
      {/* body */}
      <div style={{ position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', width: 28, height: 44, background: 'rgba(255,190,60,0.12)', border: '2px solid #8a6020', borderRadius: 4, boxShadow: 'inset 0 0 12px rgba(255,160,40,0.25)' }}>
        {/* glass panels */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: 'absolute', top: 4, bottom: 4, left: `${4 + i * 6}px`, width: 4, background: 'rgba(255,200,80,0.15)', borderRadius: 1 }} />
        ))}
        {/* flame */}
        <motion.div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 7, height: 11, background: 'linear-gradient(180deg,#fff8c0,#ffd040,#ff8020)', borderRadius: '50% 50% 35% 35%' }}
          animate={{ scaleX: [1, 0.85, 1.1, 0.9, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>
      {/* base */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 26, height: 8, background: '#8a6020', borderRadius: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
    </div>
  )
}

function Succulent() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <div style={{ position: 'relative', width: 46, height: 44, flexShrink: 0 }}>
      {/* pot */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 36, height: 22, background: 'linear-gradient(180deg,#c48060,#8a4828)', clipPath: 'polygon(8% 0%,92% 0%,84% 100%,16% 100%)', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', bottom: 19, left: 'calc(50% - 20px)', width: 40, height: 6, borderRadius: 3, background: '#d4905a' }} />
      {/* soil */}
      <div style={{ position: 'absolute', bottom: 22, left: 'calc(50% - 14px)', width: 28, height: 4, borderRadius: '50%', background: '#2a1808' }} />
      {/* succulent rosette */}
      {petals.map((deg, i) => (
        <div key={i} style={{ position: 'absolute', bottom: 23, left: '50%', width: 14, height: 10, background: i % 2 === 0 ? '#5aaa48' : '#48923a', borderRadius: '50% 50% 30% 30%', transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${deg}deg)`, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)' }} />
      ))}
      {/* center */}
      <div style={{ position: 'absolute', bottom: 27, left: '50%', transform: 'translateX(-50%)', width: 10, height: 8, background: '#7aca62', borderRadius: '50%', boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

// ── Master render function ────────────────────────────────

export function renderDecoration(kind: DecorationKind, key?: string) {
  const map: Record<DecorationKind, JSX.Element> = {
    candle:        <Candle key={key} />,
    candle_pair:   <div key={key} style={{ display:'flex', gap:5, alignItems:'flex-end' }}><Candle /><Candle scale={0.8} /></div>,
    plant_pot:     <PlantPot key={key} />,
    plant_hanging: <PlantHanging key={key} />,
    succulent:     <Succulent key={key} />,
    vase_tall:     <VaseTall key={key} />,
    vase_round:    <VaseRound key={key} />,
    frame_photo:   <FramePhoto key={key} />,
    bookend_L:     <BookendL key={key} />,
    clock_small:   <ClockSmall key={key} />,
    mug:           <Mug key={key} />,
    lantern:       <Lantern key={key} />,
  }
  return map[kind] ?? null
}
