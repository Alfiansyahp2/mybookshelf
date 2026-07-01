/**
 * LibraryRoom — Vintage reading room background
 *
 * Purely CSS-drawn:
 *  - Brick wall with mortar lines
 *  - Warm wood plank floor
 *  - Desk lamp with glow effect
 *  - Potted plant (monstera-style)
 *  - Floating dust particles
 *  - Ambient candlelight vignette
 */

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/* ── tiny dust particle ──────────────────────── */
function DustParticle({ x, delay, size }: { x: number; delay: number; size: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,220,150,0.55)',
        pointerEvents: 'none',
      }}
      animate={{
        y: [0, -320, -600],
        x: [0, 18, -10, 22, 0],
        opacity: [0, 0.7, 0.4, 0],
        scale: [0.8, 1.2, 0.6],
      }}
      transition={{
        duration: 9 + delay,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ── desk lamp SVG-in-CSS ────────────────────── */
function DeskLamp() {
  return (
    <div style={{ position: 'relative', width: 90, height: 130, flexShrink: 0 }}>
      {/* Lamp glow on wall */}
      <div style={{
        position: 'absolute',
        top: -30, left: -60, width: 210, height: 200,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,210,100,0.22) 0%, rgba(255,180,60,0.06) 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Base */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 50, height: 8, borderRadius: '50%',
        background: 'linear-gradient(180deg,#6b4520,#3a2010)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      }} />
      {/* Stem lower */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 5, height: 55, borderRadius: 3,
        background: 'linear-gradient(to right,#8b6030,#c49060,#8b6030)',
        boxShadow: '1px 0 4px rgba(0,0,0,0.3)',
      }} />
      {/* Arm pivot ball */}
      <div style={{
        position: 'absolute', bottom: 60, left: 'calc(50% - 6px)',
        width: 12, height: 12, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%,#d4a060,#7a4820)',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.5)',
      }} />
      {/* Arm diagonal */}
      <div style={{
        position: 'absolute', bottom: 66, left: '50%',
        width: 5, height: 45, borderRadius: 3,
        background: 'linear-gradient(to right,#8b6030,#c49060,#8b6030)',
        transform: 'rotate(-35deg)',
        transformOrigin: 'bottom center',
        boxShadow: '1px 0 4px rgba(0,0,0,0.3)',
      }} />

      {/* Shade */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-60%)',
        width: 0, height: 0,
        borderLeft: '26px solid transparent',
        borderRight: '26px solid transparent',
        borderTop: '42px solid transparent', // invisible top
        filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))',
      }} />
      {/* Shade filled */}
      <div style={{
        position: 'absolute', top: 6, left: 'calc(50% - 44px)',
        width: 88, height: 36,
        background: 'linear-gradient(180deg,#d4954a 0%,#b87030 60%,#8b5020 100%)',
        clipPath: 'polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
      }} />
      {/* Shade inner glow */}
      <div style={{
        position: 'absolute', top: 10, left: 'calc(50% - 32px)',
        width: 64, height: 24,
        background: 'linear-gradient(180deg,rgba(255,220,120,0.6),rgba(255,180,60,0.2))',
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
      }} />

      {/* Bulb glow */}
      <motion.div
        style={{
          position: 'absolute', top: 40, left: 'calc(50% - 8px)',
          width: 16, height: 16, borderRadius: '50%',
          background: 'radial-gradient(circle,#fff8e0,#ffd060)',
          boxShadow: '0 0 20px 10px rgba(255,200,80,0.45)',
        }}
        animate={{ opacity: [1, 0.85, 1], scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Light cone below shade */}
      <div style={{
        position: 'absolute', top: 42, left: 'calc(50% - 55px)',
        width: 110, height: 80,
        background: 'linear-gradient(180deg,rgba(255,210,100,0.18) 0%,transparent 100%)',
        clipPath: 'polygon(30% 0%,70% 0%,100% 100%,0% 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ── potted plant (monstera leaves) ─────────── */
function PottedPlant() {
  const leaves = [
    { rotate: -50, x: -18, y: -10, scale: 1.1 },
    { rotate: -20, x: -8,  y: -18, scale: 0.95 },
    { rotate:  10, x:  4,  y: -20, scale: 1.0 },
    { rotate:  35, x: 14,  y: -12, scale: 0.9 },
    { rotate:  60, x: 20,  y: -4,  scale: 0.85 },
    { rotate: -70, x: -22, y:  2,  scale: 0.8 },
  ]

  return (
    <div style={{ position: 'relative', width: 70, height: 110, flexShrink: 0 }}>
      {/* Pot */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 50, height: 36,
        background: 'linear-gradient(180deg,#c4784a 0%,#a05830 50%,#7a3e18 100%)',
        clipPath: 'polygon(8% 0%,92% 0%,82% 100%,18% 100%)',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
      }} />
      {/* Pot rim */}
      <div style={{
        position: 'absolute', bottom: 32, left: 'calc(50% - 28px)',
        width: 56, height: 8, borderRadius: 3,
        background: 'linear-gradient(180deg,#d4885a,#a86035)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }} />
      {/* Soil */}
      <div style={{
        position: 'absolute', bottom: 36, left: 'calc(50% - 22px)',
        width: 44, height: 6, borderRadius: '50%',
        background: '#3a2210',
      }} />

      {/* Stem */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        width: 4, height: 30, borderRadius: 2,
        background: 'linear-gradient(to right,#2d6a2a,#4a9a44,#2d6a2a)',
      }} />

      {/* Leaves */}
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            bottom: 60,
            left: `calc(50% + ${l.x}px)`,
            width: 28,
            height: 22,
            background: `linear-gradient(135deg,#3a8a35 0%,#52a848 40%,#2d6a2a 100%)`,
            borderRadius: '50% 10% 50% 10%',
            transform: `rotate(${l.rotate}deg) scale(${l.scale})`,
            transformOrigin: 'bottom center',
            boxShadow: '1px 1px 4px rgba(0,0,0,0.25)',
          }}
          animate={{
            rotate: [l.rotate - 2, l.rotate + 2, l.rotate - 1, l.rotate],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {/* Leaf vein */}
          <div style={{
            position: 'absolute', top: '40%', left: '10%', right: '30%', height: 1,
            background: 'rgba(255,255,255,0.2)',
            transform: 'rotate(-10deg)',
          }} />
        </motion.div>
      ))}
    </div>
  )
}

/* ── small stack of books on the floor ──────── */
function FloorBookStack() {
  const books = [
    { w: 52, h: 12, color: '#8b2020' },
    { w: 48, h: 10, color: '#1a4a8a' },
    { w: 55, h: 11, color: '#2a6a2a' },
    { w: 46, h: 9,  color: '#7a5a20' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 1, alignItems: 'flex-start' }}>
      {books.map((b, i) => (
        <div key={i} style={{
          width: b.w, height: b.h,
          background: `linear-gradient(to right,${b.color}dd,${b.color},${b.color}aa)`,
          borderRadius: 2,
          boxShadow: '1px 1px 3px rgba(0,0,0,0.4)',
          transform: `rotate(${i === books.length-1 ? 0 : (Math.random() > 0.5 ? 1.5 : -1)}deg)`,
          position: 'relative',
        }}>
          <div style={{ position:'absolute', top:2, bottom:2, left:4, width:1, background:'rgba(255,255,255,0.2)' }} />
        </div>
      ))}
    </div>
  )
}

/* ── hanging picture frame ───────────────────── */
function PictureFrame({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 64, height: 50,
      border: '4px solid #7a5020',
      borderRadius: 3,
      background: 'linear-gradient(135deg,#c8a878,#a08050)',
      boxShadow: '2px 4px 12px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(255,255,255,0.08)',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Painting content — abstract landscape */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'35%',
        background:'linear-gradient(180deg,#3a6a3a,#2a5028)' }} />
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)',
        width:16, height:20,
        background:'linear-gradient(180deg,#e8c070,#c4a050)',
        clipPath:'polygon(50% 0%,100% 100%,0% 100%)' }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%',
        background:'linear-gradient(180deg,#6ab0e0,#a8d4f0)' }} />
      {/* Wire */}
      <div style={{ position:'absolute', top:-10, left:'30%', right:'30%', height:10,
        borderTop:'1.5px solid rgba(120,80,30,0.5)',
        borderRadius:'0 0 50% 50%' }} />
    </div>
  )
}

/* ── candle ─────────────────────────────────── */
function Candle() {
  return (
    <div style={{ position:'relative', width:14, height:50 }}>
      {/* Flame glow */}
      <motion.div
        style={{ position:'absolute', top:-22, left:-14, width:42, height:42,
          background:'radial-gradient(circle,rgba(255,200,60,0.35) 0%,transparent 75%)',
          pointerEvents:'none' }}
        animate={{ opacity:[0.8,1,0.7,1], scale:[0.9,1.1,0.95,1] }}
        transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
      />
      {/* Flame */}
      <motion.div
        style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)',
          width:8, height:14,
          background:'linear-gradient(180deg,#fff8c0 0%,#ffd040 40%,#ff8020 100%)',
          borderRadius:'50% 50% 30% 30%',
          boxShadow:'0 0 8px 3px rgba(255,160,40,0.5)' }}
        animate={{ scaleX:[1,0.8,1.1,0.9,1], skewX:[0,-3,3,-2,0] }}
        transition={{ duration:0.8, repeat:Infinity, ease:'easeInOut' }}
      />
      {/* Wick */}
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
        width:1.5, height:5, background:'#2a1a08', borderRadius:1 }} />
      {/* Wax body */}
      <div style={{ position:'absolute', top:4, left:'50%', transform:'translateX(-50%)',
        width:14, height:42,
        background:'linear-gradient(to right,#e8dcc8,#f5efe0,#e0d4b8)',
        borderRadius:'3px 3px 4px 4px',
        boxShadow:'1px 1px 5px rgba(0,0,0,0.3)' }} />
      {/* Drip */}
      <div style={{ position:'absolute', top:8, left:2, width:4, height:8,
        background:'rgba(245,239,224,0.8)', borderRadius:'0 0 50% 50%' }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════
    MAIN EXPORT — Library Room wrapper
   ══════════════════════════════════════════════════ */
interface LibraryRoomProps {
  children: React.ReactNode
}

export default function LibraryRoom({ children }: LibraryRoomProps) {
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 2.5 + 1,
    }))
  )

  return (
    <div style={{
      position: 'relative',
      minHeight: '100%',
      overflow: 'hidden',
      /* Warm amber reading-room base color */
      background: 'linear-gradient(180deg,#2a1a0e 0%,#1e1208 100%)',
    }}>

      {/* ══════════════════════════════════════════
          BRICK WALL — CSS-drawn
          Each "brick" layer is a repeating gradient
          ══════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        /* Alternating offset brickwork */
        backgroundImage: `
          /* Mortar (grey base) */
          linear-gradient(180deg,#5a3820 0%,#4a2e16 100%),

          /* Brick rows — even rows */
          repeating-linear-gradient(180deg,
            transparent 0px, transparent 22px,
            rgba(0,0,0,0.35) 22px, rgba(0,0,0,0.35) 26px),

          /* Brick vertical lines — even rows */
          repeating-linear-gradient(90deg,
            transparent 0px, transparent 54px,
            rgba(0,0,0,0.3) 54px, rgba(0,0,0,0.3) 57px)
        `,
        backgroundSize: '100% 100%, 100% 26px, 57px 52px',
        backgroundPosition: '0 0, 0 0, 0 0',
        zIndex: 0,
      }} />

      {/* Brick color variation overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          repeating-linear-gradient(180deg,
            rgba(180,80,40,0.28) 0px, rgba(160,65,30,0.22) 22px,
            transparent 22px, transparent 26px),
          repeating-linear-gradient(180deg,
            rgba(200,100,50,0.12) 26px, rgba(170,70,35,0.18) 48px,
            transparent 48px, transparent 52px)
        `,
        backgroundSize: '100% 26px, 100% 52px',
      }} />

      {/* Individual brick highlights — stagger offset */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        backgroundImage: `
          repeating-linear-gradient(90deg,
            rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 54px,
            transparent 54px, transparent 57px)
        `,
        backgroundSize: '57px 52px',
        backgroundPosition: '28px 26px',  /* offset for odd rows */
        maskImage: `repeating-linear-gradient(180deg,
          transparent 0px, transparent 22px,
          black 22px, black 26px)`,
        WebkitMaskImage: `repeating-linear-gradient(180deg,
          transparent 0px, transparent 22px,
          black 22px, black 26px)`,
      }} />

      {/* Warm wall paint wash over bricks */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(180deg,rgba(180,100,40,0.45) 0%,rgba(120,60,20,0.35) 100%)',
      }} />

      {/* Ambient warm vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(255,180,60,0.18) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(255,160,40,0.10) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.55) 0%, transparent 65%),
          radial-gradient(ellipse at 0% 50%, rgba(0,0,0,0.3) 0%, transparent 40%),
          radial-gradient(ellipse at 100% 50%, rgba(0,0,0,0.3) 0%, transparent 40%)
        `,
      }} />

      {/* Dust particles */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }}>
        {particles.map(p => (
          <DustParticle key={p.id} x={p.x} delay={p.delay} size={p.size} />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          DECORATIVE ASSETS — top bar
          ══════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 6,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        paddingLeft: 24, paddingRight: 24, paddingTop: 16,
        pointerEvents: 'none',
      }}>
        {/* Left side: lamp + candles */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <DeskLamp />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', paddingBottom: 4 }}>
            <Candle />
            <div style={{ transform: 'scaleX(0.75) translateY(6px)' }}><Candle /></div>
          </div>
        </div>

        {/* Center: title plaque */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          paddingBottom: 8,
        }}>
          <PictureFrame />
          <div style={{
            background: 'linear-gradient(135deg,rgba(60,35,12,0.85),rgba(40,22,6,0.9))',
            border: '1px solid rgba(200,150,80,0.25)',
            borderRadius: 8, padding: '5px 18px',
            backdropFilter: 'blur(4px)',
          }}>
            <p style={{
              color: 'rgba(255,210,140,0.9)',
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: "'Georgia',serif", margin: 0,
            }}>
              My Library
            </p>
          </div>
        </div>

        {/* Right side: plant + book stack */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ paddingBottom: 2 }}><FloorBookStack /></div>
          <PottedPlant />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT — children (filter + bookshelf)
          ══════════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 6, padding: '0 16px 20px' }}>
        {children}
      </div>

      {/* ══════════════════════════════════════════
          WOODEN FLOOR
          ══════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, zIndex: 5,
        background: 'linear-gradient(180deg,#6a3c14 0%,#4e2c0a 50%,#3a1e04 100%)',
        backgroundImage: `
          linear-gradient(180deg,#6a3c14 0%,#4e2c0a 50%,#3a1e04 100%),
          repeating-linear-gradient(90deg,
            transparent 0px, transparent 88px,
            rgba(0,0,0,0.18) 88px, rgba(0,0,0,0.18) 90px)
        `,
        boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)',
      }}>
        {/* Floor highlight */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
          background:'rgba(255,255,255,0.06)' }} />
      </div>
    </div>
  )
}
