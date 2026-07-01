import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trash2 } from 'lucide-react'
import {
  DECORATION_CATALOGUE,
  renderDecoration,
  type DecorationKind,
  type ShelfDecoration,
} from './DecorationSystem'

interface DecorationPickerProps {
  isOpen: boolean
  onClose: () => void
  slot: 'left' | 'right'
  current?: ShelfDecoration
  onSelect: (kind: DecorationKind) => void
  onRemove: () => void
}

export default function DecorationPicker({
  isOpen, onClose, slot, current, onSelect, onRemove,
}: DecorationPickerProps) {
  const [preview, setPreview] = useState<DecorationKind | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            style={{
              position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: 520,
              background: '#faf7f2',
              borderRadius: '20px 20px 0 0',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
              zIndex: 1001,
              overflow: 'hidden',
            }}
          >
            {/* Handle bar */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.12)' }} />
            </div>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#c4956a,#7a5028)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Georgia',serif", color: '#2a1a08' }}>
                    Hiasan Rak
                  </h3>
                  <p style={{ margin: 0, fontSize: 11, color: '#9c7a5a' }}>
                    Pilih hiasan untuk sisi {slot === 'left' ? 'kiri' : 'kanan'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {current && (
                  <button
                    onClick={() => { onRemove(); onClose() }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                )}
                <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} color="#4a3020" />
                </button>
              </div>
            </div>

            {/* Preview */}
            <div style={{ margin: '0 20px 12px', padding: '12px 16px', background: 'rgba(139,99,56,0.06)', borderRadius: 12, border: '1px solid rgba(139,99,56,0.12)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 80, gap: 8 }}>
              {preview ? (
                <motion.div key={preview} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  {renderDecoration(preview)}
                </motion.div>
              ) : current ? (
                renderDecoration(current.kind)
              ) : (
                <p style={{ color: 'rgba(139,99,56,0.4)', fontSize: 12, margin: 0 }}>Arahkan kursor untuk melihat pratinjau</p>
              )}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '0 20px 24px', maxHeight: 280, overflowY: 'auto' }}>
              {DECORATION_CATALOGUE.map(item => {
                const isActive = current?.kind === item.kind
                return (
                  <button
                    key={item.kind}
                    onMouseEnter={() => setPreview(item.kind)}
                    onMouseLeave={() => setPreview(null)}
                    onClick={() => { onSelect(item.kind); onClose() }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: '10px 8px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                      background: isActive ? 'rgba(139,99,56,0.12)' : 'white',
                      border: isActive ? '1.5px solid rgba(139,99,56,0.4)' : '1.5px solid rgba(139,99,56,0.1)',
                      boxShadow: isActive ? '0 2px 8px rgba(139,99,56,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)' }}
                    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{item.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#4a3020', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
                    <span style={{ fontSize: 9, color: '#9c7a5a', textAlign: 'center', lineHeight: 1.2 }}>{item.desc}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
