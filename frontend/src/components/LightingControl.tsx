/**
 * LightingControl — floating panel to control bookshelf LED lighting
 *
 * Features:
 *  - On/Off toggle with animated bulb icon
 *  - Brightness slider (10–100%)
 *  - 5 colour-temperature swatches
 *  - Smooth open/close animation
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, LightbulbOff, X, Sun, Moon } from 'lucide-react'
import { useLighting, TEMP_COLORS, type ColorTemp } from '../hooks/useLighting'

const TEMPS: ColorTemp[] = ['warm', 'neutral', 'cool', 'rose', 'mint']

export default function LightingControl() {
  const [open, setOpen] = useState(false)
  const { on, brightness, colorTemp, toggle, setBrightness, setColorTemp } = useLighting()

  const ct = TEMP_COLORS[colorTemp]

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* ── Toggle button ──────────────────────────── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        title="Kontrol Pencahayaan Rak"
        style={{
          position: 'relative',
          width: 40, height: 40, borderRadius: 12,
          border: 'none', cursor: 'pointer',
          background: on
            ? `linear-gradient(135deg, ${ct.strip}55, ${ct.strip}22)`
            : 'rgba(0,0,0,0.06)',
          boxShadow: on
            ? `0 0 0 1px ${ct.strip}44, 0 2px 8px ${ct.glow}0.25)`
            : '0 0 0 1px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Glow ring when on */}
        {on && (
          <motion.div
            style={{
              position: 'absolute', inset: -3, borderRadius: 15,
              border: `1.5px solid ${ct.strip}50`,
              pointerEvents: 'none',
            }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}
        <motion.div animate={{ rotate: on ? 0 : 15 }} transition={{ duration: 0.3 }}>
          {on
            ? <Lightbulb size={18} color={ct.strip} fill={`${ct.strip}44`} />
            : <LightbulbOff size={18} color="#94a3b8" />
          }
        </motion.div>
      </motion.button>

      {/* ── Control panel ──────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -8 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            style={{
              position: 'absolute', top: 48, right: 0,
              width: 240, zIndex: 9999,
              background: 'rgba(255,251,245,0.98)',
              backdropFilter: 'blur(16px)',
              borderRadius: 16,
              border: '1px solid rgba(139,99,56,0.14)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px 10px',
              borderBottom: '1px solid rgba(139,99,56,0.08)',
              background: on
                ? `linear-gradient(135deg, ${ct.strip}18, transparent)`
                : 'transparent',
              transition: 'background 0.4s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: on ? ct.strip : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.3s',
                  boxShadow: on ? `0 0 10px ${ct.glow}0.5)` : 'none',
                }}>
                  <Lightbulb size={14} color={on ? '#fff' : '#94a3b8'} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#2a1a08', fontFamily: "'Georgia',serif" }}>
                    LED Rak
                  </p>
                  <p style={{ margin: 0, fontSize: 9.5, color: 'rgba(122,92,66,0.6)' }}>
                    {on ? `${brightness}% · ${ct.label}` : 'Mati'}
                  </p>
                </div>
              </div>

              {/* Power toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={toggle}
                  style={{
                    width: 42, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                    background: on ? ct.strip : '#cbd5e1',
                    position: 'relative', transition: 'background 0.3s',
                    boxShadow: on ? `0 0 8px ${ct.glow}0.4)` : 'none',
                  }}
                >
                  <motion.div
                    animate={{ x: on ? 20 : 2 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                      position: 'absolute', top: 2, left: 0,
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'white',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{ width: 22, height: 22, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={12} color="#9c7a5a" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '12px 14px 14px', opacity: on ? 1 : 0.4, transition: 'opacity 0.3s', pointerEvents: on ? 'auto' : 'none' }}>

              {/* Brightness */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Moon size={11} color="rgba(122,92,66,0.5)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#4a3020' }}>Kecerahan</span>
                    <Sun size={11} color="rgba(122,92,66,0.5)" />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: ct.strip,
                    background: `${ct.strip}18`, padding: '2px 8px', borderRadius: 8,
                  }}>{brightness}%</span>
                </div>

                {/* Custom slider */}
                <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
                  {/* Track background */}
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 3,
                    background: 'rgba(139,99,56,0.1)',
                  }} />
                  {/* Track fill */}
                  <div style={{
                    position: 'absolute', left: 0, height: 6, borderRadius: 3,
                    width: `${brightness}%`,
                    background: `linear-gradient(to right, ${ct.strip}88, ${ct.strip})`,
                    boxShadow: `0 0 6px ${ct.glow}0.4)`,
                    transition: 'width 0.05s, background 0.3s, box-shadow 0.3s',
                  }} />
                  <input
                    type="range" min={10} max={100} step={5}
                    value={brightness}
                    onChange={e => setBrightness(Number(e.target.value))}
                    style={{
                      position: 'absolute', left: 0, right: 0, width: '100%',
                      opacity: 0, cursor: 'pointer', height: 20, margin: 0,
                    }}
                  />
                  {/* Thumb indicator */}
                  <motion.div
                    style={{
                      position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)',
                      left: `${brightness}%`,
                      width: 16, height: 16, borderRadius: '50%', background: 'white',
                      boxShadow: `0 1px 6px rgba(0,0,0,0.25), 0 0 0 2.5px ${ct.strip}`,
                      pointerEvents: 'none',
                      transition: 'left 0.05s, box-shadow 0.3s',
                    }}
                  />
                </div>

                {/* Brightness presets */}
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[25, 50, 75, 100].map(v => (
                    <button key={v} onClick={() => setBrightness(v)}
                      style={{
                        flex: 1, padding: '3px 0', borderRadius: 5, border: 'none',
                        fontSize: 9.5, fontWeight: 600, cursor: 'pointer',
                        background: brightness === v ? ct.strip : 'rgba(139,99,56,0.08)',
                        color: brightness === v ? 'white' : 'rgba(122,92,66,0.7)',
                        transition: 'all 0.15s',
                      }}
                    >{v}%</button>
                  ))}
                </div>
              </div>

              {/* Colour temperature */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#4a3020' }}>Warna Cahaya</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
                  {TEMPS.map(t => {
                    const tc = TEMP_COLORS[t]
                    const isActive = colorTemp === t
                    return (
                      <button key={t} onClick={() => setColorTemp(t)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                          padding: '7px 3px', borderRadius: 10, border: 'none', cursor: 'pointer',
                          background: isActive ? `${tc.strip}22` : 'rgba(0,0,0,0.03)',
                          boxShadow: isActive ? `inset 0 0 0 1.5px ${tc.strip}, 0 0 8px ${tc.glow}0.3)` : 'inset 0 0 0 1px rgba(0,0,0,0.07)',
                          transition: 'all 0.18s',
                        }}
                      >
                        {/* Colour swatch */}
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: tc.strip,
                          boxShadow: isActive ? `0 0 10px ${tc.glow}0.7)` : '0 1px 3px rgba(0,0,0,0.2)',
                          transition: 'box-shadow 0.3s',
                        }} />
                        <span style={{ fontSize: 8.5, color: isActive ? '#2a1a08' : 'rgba(122,92,66,0.5)', fontWeight: isActive ? 700 : 400 }}>
                          {tc.label}
                        </span>
                        <span style={{ fontSize: 11 }}>{tc.emoji}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Preview strip */}
            <motion.div
              style={{
                height: 6,
                background: on
                  ? `linear-gradient(to right, ${ct.strip}66, ${ct.strip}, ${ct.strip}66)`
                  : 'rgba(0,0,0,0.05)',
                boxShadow: on ? `0 0 12px ${ct.glow}${(brightness / 100).toFixed(2)})` : 'none',
                transition: 'background 0.4s, box-shadow 0.4s',
              }}
              animate={on ? { opacity: [0.8, 1, 0.8] } : { opacity: 0.3 }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
