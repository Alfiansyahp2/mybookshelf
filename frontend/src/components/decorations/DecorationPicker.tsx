import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trash2, Upload } from 'lucide-react'
import {
  DECORATION_CATALOGUE,
  renderDecoration,
  type DecorationKind,
  type ShelfDecoration,
} from './DecorationSystem'
import Modal from '../ui/Modal'

interface DecorationPickerProps {
  isOpen: boolean
  onClose: () => void
  slot: 'left' | 'right'
  current?: ShelfDecoration
  onSelect: (kind: DecorationKind, customData?: any) => void
  onRemove: () => void
}

export default function DecorationPicker({
  isOpen, onClose, slot, current, onSelect, onRemove,
}: DecorationPickerProps) {
  const [preview, setPreview] = useState<DecorationKind | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      onSelect('frame_photo', { imageUrl: dataUrl })
      onClose()
    }
    reader.readAsDataURL(file)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hiasan Rak (Sisi ${slot === 'left' ? 'Kiri' : 'Kanan'})`}
      size="md"
    >
      <div className="flex flex-col h-full max-h-[60vh]">
        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-walnut/70">
            Pilih dekorasi untuk mempercantik rakmu
          </p>
          {current && (
            <button
              onClick={() => { onRemove(); onClose() }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} /> Hapus Hiasan
            </button>
          )}
        </div>

        {/* Preview */}
        <div className="mb-6 p-6 bg-walnut/5 border border-walnut/10 rounded-xl flex items-end justify-center min-h-[100px]">
          {preview ? (
            <motion.div key={preview} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              {renderDecoration(preview)}
            </motion.div>
          ) : current ? (
            renderDecoration(current)
          ) : (
            <p className="text-sm text-walnut/40">Arahkan kursor untuk melihat pratinjau</p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-2 pb-2">
          {DECORATION_CATALOGUE.map(item => {
            const isActive = current?.kind === item.kind
            return (
              <button
                key={item.kind}
                onMouseEnter={() => setPreview(item.kind)}
                onMouseLeave={() => setPreview(null)}
                onClick={() => { 
                  if (item.kind === 'frame_photo') {
                    fileInputRef.current?.click()
                  } else {
                    onSelect(item.kind)
                    onClose()
                  }
                }}
                className={`
                  relative flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all border text-center
                  ${isActive 
                    ? 'bg-cream border-walnut/40 shadow-sm' 
                    : 'bg-white border-walnut/10 hover:border-walnut/30 hover:shadow-sm'
                  }
                `}
                onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
              >
                <span className="text-2xl leading-none mb-1">{item.emoji}</span>
                <span className="text-[11px] font-bold text-darkBrown leading-tight">{item.label}</span>
                <span className="text-[9px] text-walnut/70 leading-tight">{item.desc}</span>
                {item.kind === 'frame_photo' && (
                  <div className="absolute top-2 right-2 bg-cream text-walnut rounded-full p-1 border border-walnut/10">
                    <Upload size={10} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
