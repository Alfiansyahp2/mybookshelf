/**
 * useLighting — global shelf lighting state
 * Persisted in localStorage.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ColorTemp = 'warm' | 'neutral' | 'cool' | 'rose' | 'mint'

export interface LightingState {
  on: boolean
  brightness: number          // 10–100
  colorTemp: ColorTemp
  toggle: () => void
  setBrightness: (v: number) => void
  setColorTemp: (t: ColorTemp) => void
}

/** Colour temperature presets → hex */
export const TEMP_COLORS: Record<ColorTemp, { strip: string; glow: string; label: string; emoji: string }> = {
  warm:    { strip: '#FFB020', glow: 'rgba(255,176,32,',    label: 'Warm',    emoji: '🌙' },
  neutral: { strip: '#FFD878', glow: 'rgba(255,216,120,',   label: 'Netral',  emoji: '☀️' },
  cool:    { strip: '#E8F4FF', glow: 'rgba(220,240,255,',   label: 'Sejuk',   emoji: '❄️' },
  rose:    { strip: '#FFB0C0', glow: 'rgba(255,176,192,',   label: 'Rose',    emoji: '🌸' },
  mint:    { strip: '#A0FFD0', glow: 'rgba(160,255,208,',   label: 'Mint',    emoji: '🍃' },
}

export const useLighting = create<LightingState>()(
  persist(
    (set) => ({
      on:         true,
      brightness: 80,
      colorTemp:  'warm',
      toggle:         () => set(s => ({ on: !s.on })),
      setBrightness:  (v) => set({ brightness: Math.max(10, Math.min(100, v)) }),
      setColorTemp:   (t) => set({ colorTemp: t }),
    }),
    { name: 'mybookshelf_lighting' }
  )
)
