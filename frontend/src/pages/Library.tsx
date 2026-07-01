import { useState } from 'react'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useBookstore } from '../store/useBookstore'
import type { Book } from '../types'
import Bookshelf from '../components/Bookshelf'
import AddBookModal from '../components/AddBookModal'
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

  const [activeFilter, setActiveFilter]     = useState<string>('all')
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
    <div className="p-3 md:p-5 flex flex-col h-full">
      {/* Filter tabs + Widgets on top of shelf */}
      <div style={{ position: 'relative', zIndex: 50, display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 0, paddingTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 10, flex: 1 }}>
          {FILTER_TABS.filter(t => t.key === 'all' || counts[t.key as keyof typeof counts] > 0).map(tab => {
            const count = counts[tab.key as keyof typeof counts]
            const active = activeFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-walnut text-white border-walnut shadow-sm'
                    : 'bg-white/70 text-walnut/70 border-walnut/15 hover:border-walnut/30 hover:text-walnut'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  active ? 'bg-white/20 text-white' : 'bg-walnut/10 text-walnut/60'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-end', gap: '20px', paddingRight: '24px', position: 'relative', zIndex: 10 }}>
          <FlipCalendar onClick={() => setIsCalendarModalOpen(true)} />
          <div style={{ paddingBottom: '4px' }}>
            <BigDigitalClock />
          </div>
          <div style={{ paddingBottom: '2px' }}>
            <LightingControl />
          </div>
        </div>
      </div>

      {/* Bookshelf */}
      <div style={{ flex: 1, marginTop: '-2px' }}>
        <Bookshelf
          books={books}
          shelves={shelves}
          onAddBook={handleAddBook}
          filterStatus={activeFilter === 'all' ? undefined : activeFilter}
          selectedBookId={selectedBookId}
          isDrawerOpen={isBookDetailOpen}
          onBookClick={handleBookClick}
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
