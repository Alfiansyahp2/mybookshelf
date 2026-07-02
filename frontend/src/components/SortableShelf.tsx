import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripHorizontal } from 'lucide-react'
import LibraryShelf from './Shelf'
import type { Shelf as ShelfType, Book } from '../types'

interface SortableShelfProps {
  shelf: ShelfType
  books: Book[]
  isEditMode: boolean
  onBookClick?: (book: Book) => void
  onAddBook?: (shelfId: string) => void
  onEditShelf?: (shelfId: string) => void
  onDeleteShelf?: (shelfId: string) => void
  isDrawerOpen?: boolean
  selectedBookId?: string | null
  shelfIndex: number
  onResize?: (id: string, span: number) => void
}

export function SortableShelf({
  shelf,
  isEditMode,
  onResize,
  ...props
}: SortableShelfProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shelf.id })

  const span = shelf.span || 12
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 50, opacity: 0.8 } : {}),
    gridColumn: `span ${span}`,
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${isDragging ? '' : 'z-10 hover:z-40'}`}>
      {isEditMode && (
        <div className="absolute inset-0 z-20 border-2 border-dashed border-[#0078d4]/50 rounded-[14px] pointer-events-none transition-all group-hover:border-[#0078d4]" />
      )}

      {isEditMode && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <div
            {...attributes}
            {...listeners}
            className="p-1.5 text-white/70 hover:text-white cursor-grab active:cursor-grabbing rounded hover:bg-white/10"
            title="Tahan untuk memindah"
          >
            <GripHorizontal size={16} />
          </div>
          
          <div className="w-px h-4 bg-white/20 mx-1" />
          
          <button
            onClick={() => onResize?.(shelf.id, 12)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${span === 12 ? 'bg-[#0078d4] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            100%
          </button>
          <button
            onClick={() => onResize?.(shelf.id, 9)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${span === 9 ? 'bg-[#0078d4] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            75%
          </button>
          <button
            onClick={() => onResize?.(shelf.id, 6)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${span === 6 ? 'bg-[#0078d4] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            50%
          </button>
          <button
            onClick={() => onResize?.(shelf.id, 4)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${span === 4 ? 'bg-[#0078d4] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            33%
          </button>
          <button
            onClick={() => onResize?.(shelf.id, 3)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${span === 3 ? 'bg-[#0078d4] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            25%
          </button>
          <button
            onClick={() => onResize?.(shelf.id, 2)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${span === 2 ? 'bg-[#0078d4] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            16%
          </button>
        </div>
      )}

      <div className={isEditMode ? 'pointer-events-none' : ''}>
        <LibraryShelf shelf={shelf} {...props} />
      </div>
    </div>
  )
}
