import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'

export type ShelfLayoutType = 
  | 'single' 
  | 'half' 
  | 'left-heavy' 
  | 'left-split-right' 
  | 'thirds' 
  | 'grid'
  | 'top-heavy'

interface LayoutPickerProps {
  currentLayout: ShelfLayoutType
  onChange: (layout: ShelfLayoutType) => void
}

const layouts = [
  {
    id: 'single',
    render: (active: boolean) => (
      <div className="w-full h-full bg-white/20 rounded-[3px]" />
    )
  },
  {
    id: 'half',
    render: (active: boolean) => (
      <div className="w-full h-full flex gap-[2px]">
        <div className={`flex-1 rounded-[3px] ${active ? 'bg-[#0078d4]' : 'bg-white/20'}`} />
        <div className="flex-1 bg-white/20 rounded-[3px]" />
      </div>
    )
  },
  {
    id: 'left-heavy',
    render: (active: boolean) => (
      <div className="w-full h-full flex gap-[2px]">
        <div className={`w-[60%] rounded-[3px] ${active ? 'bg-[#0078d4]' : 'bg-white/20'}`} />
        <div className="w-[40%] bg-white/20 rounded-[3px]" />
      </div>
    )
  },
  {
    id: 'left-split-right',
    render: (active: boolean) => (
      <div className="w-full h-full flex gap-[2px]">
        <div className={`flex-1 rounded-[3px] ${active ? 'bg-[#0078d4]' : 'bg-white/20'}`} />
        <div className="flex-1 flex flex-col gap-[2px]">
          <div className="flex-1 bg-white/20 rounded-[3px]" />
          <div className="flex-1 bg-white/20 rounded-[3px]" />
        </div>
      </div>
    )
  },
  {
    id: 'thirds',
    render: (active: boolean) => (
      <div className="w-full h-full flex gap-[2px]">
        <div className={`flex-1 rounded-[3px] ${active ? 'bg-[#0078d4]' : 'bg-white/20'}`} />
        <div className="flex-1 bg-white/20 rounded-[3px]" />
        <div className="flex-1 bg-white/20 rounded-[3px]" />
      </div>
    )
  },
  {
    id: 'grid',
    render: (active: boolean) => (
      <div className="w-full h-full flex flex-col gap-[2px]">
        <div className="flex-1 flex gap-[2px]">
          <div className={`flex-1 rounded-[3px] ${active ? 'bg-[#0078d4]' : 'bg-white/20'}`} />
          <div className="flex-1 bg-white/20 rounded-[3px]" />
        </div>
        <div className="flex-1 flex gap-[2px]">
          <div className="flex-1 bg-white/20 rounded-[3px]" />
          <div className="flex-1 bg-white/20 rounded-[3px]" />
        </div>
      </div>
    )
  },
  {
    id: 'top-heavy',
    render: (active: boolean) => (
      <div className="w-full h-full flex flex-col gap-[2px]">
        <div className={`flex-1 rounded-[3px] ${active ? 'bg-[#0078d4]' : 'bg-white/20'}`} />
        <div className="flex-1 flex gap-[2px]">
          <div className="flex-1 bg-white/20 rounded-[3px]" />
          <div className="flex-1 bg-white/20 rounded-[3px]" />
        </div>
      </div>
    )
  }
]

export default function LayoutPicker({ currentLayout, onChange }: LayoutPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative z-50" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm border border-walnut/10 flex items-center justify-center text-walnut transition-all hover:bg-white hover:shadow-sm"
        title="Ubah Layout Rak"
      >
        <LayoutGrid size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 p-3 rounded-xl shadow-2xl border border-white/10"
            style={{ width: 260, backgroundColor: '#202020' }}
          >
            <div className="grid grid-cols-2 gap-2">
              {layouts.map((layout) => {
                const isActive = currentLayout === layout.id
                return (
                  <button
                    key={layout.id}
                    onClick={() => {
                      onChange(layout.id as ShelfLayoutType)
                      setIsOpen(false)
                    }}
                    className={`h-16 rounded-md p-[6px] transition-all group ${
                      isActive ? 'bg-white/10 ring-1 ring-white/30' : 'hover:bg-white/5'
                    }`}
                  >
                    {layout.render(isActive)}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
