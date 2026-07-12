import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useBookstore } from '../store/useBookstore'
import type { Book } from '../types'
import Bookshelf from '../components/Bookshelf'
import AddBookModal from '../components/AddBookModal'
import { LayoutGrid, Save } from 'lucide-react'
import { useUpdateShelfLayout } from '../hooks/useShelves'
import ReadingCalendarModal from '../components/modals/ReadingCalendarModal'
import LightingControl from '../components/LightingControl'
import BigDigitalClock from '../components/ui/BigDigitalClock'
import FlipCalendar from '../components/ui/FlipCalendar'

const FILTER_TABS = [
  { key: 'all',      label: 'Semua' },
  { key: 'reading',  label: 'Dibaca' },
  { key: 'finished', label: 'Selesai' },
  { key: 'unread',   label: 'Belum Dibaca' },
  { key: 'borrowed', label: 'Dipinjam' },
]

export default function Library() {
  const { selectedBookId, isBookDetailOpen, toggleBookDetail, setSelectedBookId } = useBookstore()
  const { mutate: updateLayout } = useUpdateShelfLayout()

  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [selectedShelfId, setSelectedShelfId]   = useState<string | undefined>()
  const [selectedShelfName, setSelectedShelfName] = useState<string | undefined>()

  const filterParams = activeFilter === 'all' ? {} : { status: activeFilter as any }
  const { data: booksResponse, isLoading, error } = useBooks(filterParams)
  const { data: shelves = [], isLoading: shelvesLoading } = useShelves()

  if (isLoading || shelvesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-walnut/30 border-t-walnut rounded-full animate-spin" />
          <p className="text-sm text-walnut/60">Memuat perpustakaan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-serif text-darkBrown mb-1">Gagal memuat perpustakaan</h3>
        <p className="text-sm text-walnut/60">Periksa koneksi dan coba lagi.</p>
      </div>
    )
  }

  const books: Book[] = booksResponse?.data?.data || []
  const counts = {
    all:      books.length,
    reading:  books.filter((b: Book) => b.status === 'reading').length,
    finished: books.filter((b: Book) => b.status === 'finished').length,
    unread:   books.filter((b: Book) => b.status === 'unread').length,
    borrowed: books.filter((b: Book) => b.status === 'borrowed').length,
  }

  const handleAddBook = (shelfId: string, shelfName?: string) => {
    setSelectedShelfId(shelfId)
    setSelectedShelfName(shelfName)
    setIsAddBookModalOpen(true)
  }

  const handleBookClick = (book: any) => {
    setSelectedBookId(book.id)
    toggleBookDetail(book.id)
  }

  return (
    <div 
      className="p-3 md:p-5 flex flex-col h-full min-h-screen relative"
      style={{
        background: 'linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)',
      }}
    >
      {/* Plaster / linen wall texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', opacity:0.18,
        backgroundImage:`
          repeating-linear-gradient(0deg,  transparent, transparent 5px, rgba(0,0,0,0.02) 5px, rgba(0,0,0,0.02) 6px),
          repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px)
        `,
      }} />

      {/* Filter tabs + Widgets on top of shelf */}
      <div className="relative z-50 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-0 pt-1 md:pt-4 px-1 md:px-0">
        
        {/* Left Side (Filters & Layout) */}
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar mb-2 md:mb-6">
          {/* Edit Layout Button */}
          <div className="flex gap-2">
            {isEditMode ? (
              <button
                onClick={() => setIsEditMode(false)}
                className="h-12 px-5 rounded-xl bg-green-600/90 text-white backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:bg-green-500 shadow-xl transition-all"
              >
                <Save size={18} />
                <span className="text-sm font-bold">Selesai</span>
              </button>
            ) : (
              <motion.button
                onClick={() => setIsEditMode(true)}
                className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-center text-[#5a3410] transition-all hover:bg-white/60"
                title="Edit Layout"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <LayoutGrid size={20} />
                </motion.div>
              </motion.button>
            )}
          </div>

          {/* Filter Tabs (Glassmorphism Plaque) */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 p-1.5 rounded-2xl shadow-lg">
            {FILTER_TABS.filter(t => t.key === 'all' || counts[t.key as keyof typeof counts] > 0).map(tab => {
              const count = counts[tab.key as keyof typeof counts]
              const active = activeFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-white/90 text-[#5a3410] shadow-sm'
                      : 'bg-transparent text-[#5a3410]/70 hover:bg-white/40 hover:text-[#5a3410]'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    active ? 'bg-[#5a3410]/10' : 'bg-black/5'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Widgets sitting exactly on the bookshelf rail */}
        <div className="flex flex-shrink-0 items-end justify-between md:justify-end gap-3 md:gap-5 relative z-10 w-full md:w-auto scale-90 md:scale-100 origin-bottom-right mb-[-2px]">
          <FlipCalendar onClick={() => setIsCalendarModalOpen(true)} />
          <div className="hidden sm:block pb-1">
            <BigDigitalClock />
          </div>
          <div className="pb-0.5">
            <LightingControl />
          </div>
        </div>
      </div>

      {/* Bookshelf */}
      <div className="relative z-0" style={{ flex: 1, opacity: isEditMode ? 0.95 : 1 }}>
        <Bookshelf
          books={books}
          shelves={shelves}
          isEditMode={isEditMode}
          onSaveLayout={(layoutData) => {
            updateLayout(layoutData)
          }}
          onAddBook={isEditMode ? undefined : handleAddBook}
          filterStatus={activeFilter === 'all' ? undefined : activeFilter}
          selectedBookId={selectedBookId}
          isDrawerOpen={isBookDetailOpen}
          onBookClick={isEditMode ? undefined : handleBookClick}
        />
      </div>

      {/* Empty state */}
      {books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-3">📚</div>
          <h3 className="text-lg font-serif text-darkBrown mb-1">
            {activeFilter === 'all' ? 'Koleksimu masih kosong' : 'Tidak ada buku'}
          </h3>
          <p className="text-sm text-walnut/50">
            {activeFilter === 'all'
              ? 'Mulai bangun perpustakaan pribadimu'
              : `Tidak ada buku dengan status "${activeFilter}"`}
          </p>
        </div>
      )}

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        shelfId={selectedShelfId}
        shelfName={selectedShelfName}
      />
      
      <ReadingCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        books={books}
      />
    </div>
  )
}
