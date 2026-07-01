import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Heart, BookOpen } from 'lucide-react'
import type { Book } from '../types'

interface BookProps {
  book: Book
  onClick: () => void
  isDrawerOpen?: boolean
  bookAreaHeight: number
}

/* ── Realistic height variation by book.height ─── */
const HEIGHT_RATIO: Record<string, number> = {
  short:  0.72,   // ~72% of shelf height
  medium: 0.86,
  tall:   0.96,
}

/* ── Width (spine thickness) ──────────────────── */
const THICKNESS_PX: Record<string, number> = {
  thin:    18,
  regular: 26,
  thick:   38,
}

const STATUS_CFG: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  reading:  { dot: '#22c55e', bg: '#dcfce7', text: '#166534', label: 'Sedang Dibaca' },
  finished: { dot: '#3b82f6', bg: '#dbeafe', text: '#1e40af', label: 'Selesai' },
  unread:   { dot: '#94a3b8', bg: '#f1f5f9', text: '#475569', label: 'Belum Dibaca' },
  wishlist: { dot: '#a855f7', bg: '#f3e8ff', text: '#6b21a8', label: 'Wishlist' },
  borrowed: { dot: '#f59e0b', bg: '#fef3c7', text: '#92400e', label: 'Dipinjam' },
}

export default function RealisticBook({ book, onClick, isDrawerOpen, bookAreaHeight }: BookProps) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const c0 = book.spineColors?.[0] || '#8B7355'
  const c1 = book.spineColors?.[1] || '#6B5344'
  const c2 = book.spineColors?.[2] || '#5C4532'

  const ratio   = HEIGHT_RATIO[book.height]  ?? 0.86
  const bookH   = Math.round(bookAreaHeight * ratio)
  const bookW   = THICKNESS_PX[book.thickness] ?? 26
  const isThin  = bookW < 22
  const sCfg    = STATUS_CFG[book.status] ?? STATUS_CFG['unread']

  useEffect(() => {
    if (isDrawerOpen) { setClicked(true) }
    else { const t = setTimeout(() => setClicked(false), 400); return () => clearTimeout(t) }
  }, [isDrawerOpen])

  return (
    <div
      style={{ position: 'relative', flexShrink: 0, width: bookW, height: bookAreaHeight,
               display: 'flex', alignItems: 'flex-end' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Book body ──────────────────────────── */}
      <motion.div
        onClick={onClick}
        style={{ width: '100%', height: bookH, cursor: 'pointer', position: 'relative',
                 transformStyle: 'preserve-3d', transformOrigin: 'center bottom' }}
        animate={
          clicked  ? { y: -(bookAreaHeight * 0.14), rotateY: 10, scale: 1.06, zIndex: 60 } :
          hovered  ? { y: -(bookAreaHeight * 0.06), scale: 1.02, zIndex: 40 } :
                     { y: 0, rotateY: 0, scale: 1, zIndex: 1 }
        }
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Main spine — MATTE finish */}
        <div
          style={{
            position: 'absolute', inset: 0,
            /*
             * Matte spine: only subtle edge darkening, no harsh specular.
             * Left 10% = binding edge (slightly darker)
             * Center     = flat base color
             * Right 8%   = far edge (slight shadow)
             */
            background: `linear-gradient(to right,
              ${c2} 0%,
              rgba(0,0,0,0.14) 9%,
              ${c0} 18%,
              ${c1} 78%,
              rgba(0,0,0,0.10) 93%,
              ${c2} 100%)`,
            borderRadius: '1px 2px 2px 1px',
            /* Matte = no bright specular, only soft spread shadow */
            boxShadow: hovered || clicked
              ? `1px 0 10px rgba(0,0,0,0.45)`
              : `1px 0 4px rgba(0,0,0,0.28)`,
            overflow: 'hidden',
          }}
        >
          {/* Canvas / cloth weave texture — dominant for matte look */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.14,
            backgroundImage: `
              repeating-linear-gradient(0deg,
                transparent, transparent 1px,
                rgba(0,0,0,0.55) 1px, rgba(0,0,0,0.55) 2px),
              repeating-linear-gradient(90deg,
                transparent, transparent 1px,
                rgba(255,255,255,0.18) 1px, rgba(255,255,255,0.18) 2px)
            `,
          }} />

          {/* Very soft top/bottom edge — no bright rim highlight */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'rgba(255,255,255,0.12)' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'rgba(0,0,0,0.30)' }} />

          {/* Subtle decorative bands — toned way down */}
          <div style={{ position:'absolute', top: 6, left:1, right:3, height:1,
            background:'rgba(0,0,0,0.18)' }} />
          <div style={{ position:'absolute', bottom: 6, left:1, right:3, height:1,
            background:'rgba(0,0,0,0.18)' }} />

          {/* Page-edge right side */}
          <div style={{ position:'absolute', top:1, right:0, bottom:1, width:2,
            background:'linear-gradient(to left,#e8dcc8,#d4c5a9)', opacity:0.65 }} />

          {/* Title — only if wide enough */}
          {!isThin && (
            <div style={{
              position:'absolute', inset:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              padding:'14px 3px',
            }}>
              <span style={{
                writingMode:'vertical-rl',
                textOrientation:'mixed',
                transform:'rotate(180deg)',
                color:'rgba(255,255,255,0.88)',
                fontSize: bookW >= 34 ? 9 : 7.5,
                fontFamily:"'Georgia', 'Times New Roman', serif",
                fontWeight: 600,
                letterSpacing: '0.4px',
                textShadow:'0 1px 4px rgba(0,0,0,0.75)',
                maxHeight: bookH - 36,
                overflow:'hidden',
                display:'-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient:'vertical',
                lineHeight:1.25,
              }}>
                {book.title}
              </span>
            </div>
          )}

          {/* Reading ribbon */}
          {book.status === 'reading' && (
            <motion.div
              style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
                width:4, height:22, background:'linear-gradient(180deg,#ef4444,#b91c1c)',
                borderRadius:'0 0 2px 2px', boxShadow:'0 2px 5px rgba(0,0,0,0.5)' }}
              animate={{ scaleY:[1,1.07,1] }}
              transition={{ duration:2.5, repeat:Infinity }}
            />
          )}
          {book.status === 'reading' && (
            <motion.div style={{ position:'absolute', inset:0, pointerEvents:'none' }}
              animate={{ boxShadow:['inset 0 0 5px rgba(239,68,68,0.15)','inset 0 0 12px rgba(239,68,68,0.35)','inset 0 0 5px rgba(239,68,68,0.15)'] }}
              transition={{ duration:2.5, repeat:Infinity }}
            />
          )}

          {/* Finished diamond */}
          {book.status === 'finished' && (
            <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)',
              width:8, height:8, background:'linear-gradient(135deg,#fcd34d,#f59e0b)',
              clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
              boxShadow:'0 1px 4px rgba(0,0,0,0.5)' }}
            />
          )}

          {/* Favorite */}
          {(book.favorite || book.isFavorite) && (
            <div style={{ position:'absolute', top:9, left:'50%', transform:'translateX(-50%)' }}>
              <Star size={7} style={{ fill:'#fde68a', color:'#fde68a', filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
            </div>
          )}
        </div>

        {/* Cast shadow on board */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          height:10, transform:'translateY(100%) scaleY(0.5)',
          transformOrigin:'top',
          background:'radial-gradient(ellipse at center top,rgba(0,0,0,0.38) 0%,transparent 100%)',
          filter:'blur(2px)', zIndex:-1, pointerEvents:'none',
        }} />
      </motion.div>

      {/* ── Hover tooltip ──────────────────────── */}
      <AnimatePresence>
        {hovered && !clicked && (
          <motion.div
            initial={{ opacity:0, x:-4, scale:0.95 }}
            animate={{ opacity:1, x:0,  scale:1 }}
            exit={{    opacity:0, x:-4, scale:0.95 }}
            transition={{ duration:0.14 }}
            style={{
              position:'absolute', left:'100%', bottom: bookAreaHeight - bookH,
              marginLeft:10, zIndex:9999, pointerEvents:'none', width:168,
            }}
          >
            <div style={{
              background:'rgba(254,249,239,0.97)',
              backdropFilter:'blur(14px)',
              borderRadius:10,
              boxShadow:'0 10px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.12)',
              border:'1px solid rgba(139,99,56,0.18)',
              overflow:'hidden',
            }}>
              <div style={{ height:3, background:`linear-gradient(to right,${c0},${c2})` }} />
              <div style={{ padding:'10px 12px' }}>
                {/* Mini cover */}
                <div style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ position:'relative', width:24, height:36, flexShrink:0 }}>
                    <div style={{ position:'absolute', inset:0, borderRadius:'0 2px 2px 0',
                      background:`linear-gradient(150deg,${c0},${c1} 50%,${c2})`,
                      boxShadow:'2px 2px 5px rgba(0,0,0,0.35)' }} />
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4,
                      background:`linear-gradient(to right,${c2},${c1})`,
                      borderRadius:'1px 0 0 1px' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:'#1c0f05', fontSize:11, fontWeight:700,
                      fontFamily:"'Georgia',serif", lineHeight:1.3, margin:'0 0 2px',
                      display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {book.title}
                    </p>
                    <p style={{ color:'#7c5a3a', fontSize:9.5, margin:0, fontStyle:'italic',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {book.author}
                    </p>
                  </div>
                </div>

                {book.genre && (
                  <span style={{ display:'inline-block', fontSize:8, fontWeight:600,
                    padding:'1px 6px', borderRadius:10, marginBottom:6, letterSpacing:'0.12em',
                    textTransform:'uppercase', background:`${c0}22`, color:c2,
                    border:`1px solid ${c0}33` }}>
                    {book.genre}
                  </span>
                )}

                <div style={{ height:1, background:`rgba(139,99,56,0.12)`, margin:'4px 0' }} />

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4,
                    background:sCfg.bg, color:sCfg.text,
                    fontSize:8.5, fontWeight:600, padding:'2px 7px', borderRadius:10 }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:sCfg.dot, flexShrink:0, display:'inline-block' }} />
                    {sCfg.label}
                  </div>
                  {book.personalRating
                    ? <div style={{ display:'flex', alignItems:'center', gap:2 }}>
                        <Star size={10} style={{ fill:'#fbbf24', color:'#fbbf24' }} />
                        <span style={{ fontSize:9, fontWeight:700, color:'#7c5a3a' }}>{book.personalRating}</span>
                      </div>
                    : (book.favorite || book.isFavorite)
                      ? <Heart size={10} style={{ fill:'#f87171', color:'#f87171' }} />
                      : null
                  }
                </div>

                {book.status === 'reading' && book.pages && book.pages > 0 && (
                  <div style={{ marginTop:7 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:8, color:'#9c7a5a', marginBottom:3 }}>
                      <span><BookOpen size={9} style={{ display:'inline', verticalAlign:'middle', marginRight:2 }} />Hal. {book.currentPage || 0}</span>
                      <span>{Math.round(((book.currentPage||0)/book.pages)*100)}%</span>
                    </div>
                    <div style={{ height:3, borderRadius:2, overflow:'hidden', background:`${c0}25` }}>
                      <div style={{ height:'100%', borderRadius:2,
                        width:`${Math.round(((book.currentPage||0)/book.pages)*100)}%`,
                        background:`linear-gradient(to right,${c0},${c2})` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Arrow */}
            <div style={{ position:'absolute', left:-5, top:14, width:0, height:0,
              borderTop:'5px solid transparent', borderBottom:'5px solid transparent',
              borderRight:'5px solid rgba(254,249,239,0.97)',
              filter:'drop-shadow(-1px 0 1px rgba(0,0,0,0.08))' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
