import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Trash2, X, BookOpen, ShoppingBag, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Book } from '../../types'
import ReadingProgressSection from './ReadingProgressSection'
import ReadingSessionTimer from './ReadingSessionTimer'
import BookNotesSection from './BookNotesSection'

interface BookDetailRightPageProps {
  book: Book;
  c0: string;
  c1: string;
  c2: string;
  tabs: any[];
  activeTab: string;
  setActiveTab: (id: any) => void;
  tabIdx: number;
  onEdit?: (book: Book) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  showMarkAsReadDatePicker: boolean;
  setShowMarkAsReadDatePicker: (val: boolean) => void;
  markAsReadDate: string;
  setMarkAsReadDate: (val: string) => void;
  handleStart: () => void;
  handleMarkAsReadNow: () => void;
  handleProgress: (p: number) => void;
  handleAddReadDate: (d: string) => void;
  userNotes: string;
  tempNotes: string;
  isEditingNotes: boolean;
  setTempNotes: (val: string) => void;
  setIsEditingNotes: (val: boolean) => void;
  handleNotes: () => void;
  startReadingPending: boolean;
  updateBookPending: boolean;
  updateNotes: any;
  updateProgress: any;
}

const PAPER_BG = '#f5ecd7'
const PAPER_LINES = 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,100,60,0.09) 28px)'

export default function BookDetailRightPage({
  book, c0, c1, c2, tabs, activeTab, setActiveTab, tabIdx,
  onEdit, onDelete, onClose,
  showMarkAsReadDatePicker, setShowMarkAsReadDatePicker,
  markAsReadDate, setMarkAsReadDate,
  handleStart, handleMarkAsReadNow,
  handleProgress, handleAddReadDate,
  userNotes, tempNotes, isEditingNotes, setTempNotes, setIsEditingNotes, handleNotes,
  startReadingPending, updateBookPending, updateNotes, updateProgress
}: BookDetailRightPageProps) {
  return (
    <motion.div
      key="right"
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0,   opacity: 1 }}
      exit={{    rotateY: -90, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 130, delay: 0.12 }}
      className="w-full md:flex-1 relative flex flex-col min-h-[500px] overflow-hidden"
      style={{
        transformOrigin: 'left center',
        background: PAPER_BG,
        backgroundImage: PAPER_LINES,
        boxShadow: 'inset 18px 0 28px rgba(0,0,0,0.13)',
        borderRadius: '0 6px 6px 0',
      }}
    >
      {/* top accent strip */}
      <div className="flex-shrink-0 h-2"
        style={{ background: `linear-gradient(to right, ${c0}, ${c2})` }}
      />

      {/* ── Tab bar ─────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center gap-0.5 px-4 pt-3 pb-0 border-b"
        style={{ borderColor: `${c1}22` }}
      >
        {tabs.map(tab => (
          <button key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all border-b-2"
            style={
              activeTab === tab.id
                ? { color: '#2a1a08', borderBottomColor: c1,
                    background: 'rgba(255,255,255,0.85)',
                    boxShadow: '0 -2px 6px rgba(0,0,0,0.06)' }
                : { color: '#9c6d3a', borderBottomColor: 'transparent',
                    background: 'transparent' }
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        <div className="flex-1" />

        {/* action icons */}
        <div className="flex items-center gap-0.5 pb-1">
          {onEdit && (
            <button onClick={() => onEdit(book)}
              className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
              title="Edit" style={{ color: '#3b82f6' }}
            ><Edit className="w-4 h-4" /></button>
          )}
          {onDelete && (
            <button
              onClick={() => { if (window.confirm(`Hapus "${book.title}"?`)) { onDelete(book.id); onClose() } }}
              className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
              title="Hapus" style={{ color: '#ef4444' }}
            ><Trash2 className="w-4 h-4" /></button>
          )}
          <button onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
            title="Tutup" style={{ color: '#9ca3af' }}
          ><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'progress' && (
            <motion.div key="tp"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
              className="space-y-4"
            >
              {book.status === 'reading' || book.status === 'finished' ? (
                <ReadingProgressSection book={book} onProgressChange={handleProgress} onAddReadDate={handleAddReadDate} />
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <BookOpen className="w-12 h-12 mb-3" style={{ color: `${c1}40` }} />
                  <p className="text-sm" style={{ color: '#9c6d3a' }}>
                    Mulai membaca untuk melihat progress
                  </p>
                  {book.status === 'unread' && !showMarkAsReadDatePicker && (
                    <div className="flex gap-3 mt-5">
                      <button onClick={handleStart} disabled={startReadingPending}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: `linear-gradient(135deg, ${c0}, ${c2})` }}
                      >
                        Mulai Membaca
                      </button>
                      <button onClick={() => setShowMarkAsReadDatePicker(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 border-2"
                        style={{ color: c0, borderColor: c0, background: 'transparent' }}
                      >
                        Sudah Baca
                      </button>
                    </div>
                  )}
                  {book.status === 'unread' && showMarkAsReadDatePicker && (
                    <div className="flex flex-col items-center gap-3 mt-5 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid ${c0}30` }}>
                      <label className="text-sm font-medium" style={{ color: '#2a1a08' }}>Pilih Tanggal Selesai Dibaca:</label>
                      <input 
                        type="date" 
                        value={markAsReadDate}
                        onChange={(e) => setMarkAsReadDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: `${c0}40`, color: '#2a1a08' }}
                      />
                      <div className="flex gap-2 w-full mt-1">
                        <button onClick={handleMarkAsReadNow} disabled={updateBookPending}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                          style={{ background: `linear-gradient(135deg, ${c0}, ${c2})` }}
                        >
                          Simpan
                        </button>
                        <button onClick={() => setShowMarkAsReadDatePicker(false)}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 border border-transparent"
                          style={{ color: c0, background: `${c0}15` }}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'session' && (
            <motion.div key="ts"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
            >
              <ReadingSessionTimer book={book} updateProgress={updateProgress} />
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div key="tn"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
              className="h-full flex flex-col"
            >
              <BookNotesSection
                userNotes={userNotes} tempNotes={tempNotes}
                isEditingNotes={isEditingNotes} updateNotes={updateNotes}
                onEdit={() => { setTempNotes(userNotes); setIsEditingNotes(true) }}
                onSave={handleNotes}
                onCancel={() => setIsEditingNotes(false)}
                onTempNotesChange={setTempNotes}
              />
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div key="ti"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}
              className="space-y-2.5"
            >
              {/* Note: I removed the lucide-react icons from the array definition to prevent JSX in object literal type issues if not careful, passing them directly here or letting them be defined in parent if needed. For simplicity, we inline them. */}
              
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${c0}22`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c0}20`, color: c1 }}><BookOpen className="w-4 h-4" /></div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: '#9c6d3a' }}>Penerbit</div>
                  <div className="text-sm font-medium truncate" style={{ color: '#2a1a08' }}>{book.publisher || '—'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${c0}22`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c0}20`, color: c1 }}><BookOpen className="w-4 h-4" /></div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: '#9c6d3a' }}>ISBN</div>
                  <div className="text-sm font-medium truncate font-mono" style={{ color: '#2a1a08' }}>{book.isbn || '—'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${c0}22`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c0}20`, color: c1 }}><BookOpen className="w-4 h-4" /></div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: '#9c6d3a' }}>Bahasa</div>
                  <div className="text-sm font-medium truncate" style={{ color: '#2a1a08' }}>{book.language || '—'}</div>
                </div>
              </div>

              {(book.purchaseDate || (book.purchasePrice !== undefined && book.purchasePrice !== null) || book.purchaseLocation || book.isGift) && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-widest px-1 mb-2" style={{ color: '#9c6d3a' }}>Informasi Pembelian</p>
                  <div className="p-3 rounded-xl space-y-2"
                    style={{ background: '#fef9ec', border: '1px solid #fcd34d66' }}
                  >
                    {book.purchaseDate && (
                      <div className="flex justify-between items-center text-sm pb-1.5">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d97706' }} />
                          <span style={{ color: '#9c6d3a' }}>Tanggal</span>
                        </div>
                        <span className="font-medium" style={{ color: '#2a1a08' }}>
                          {new Date(book.purchaseDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    {book.purchaseLocation && (
                      <div className="flex justify-between items-center text-sm pb-1.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d97706' }} />
                          <span style={{ color: '#9c6d3a' }}>Tempat</span>
                        </div>
                        <span className="font-medium text-right max-w-[60%] truncate" style={{ color: '#2a1a08' }}>
                          {book.purchaseLocation}
                        </span>
                      </div>
                    )}
                    {book.isGift ? (
                      <div className="flex justify-between items-center pt-1.5 border-t" style={{ borderColor: '#fcd34d66' }}>
                        <span className="text-xs" style={{ color: '#9c6d3a' }}>Status</span>
                        <span className="font-bold px-2 py-0.5 rounded-full bg-[#fcd34d66]" style={{ color: '#d97706', fontSize: '10px' }}>🎁 Hadiah / Gift</span>
                      </div>
                    ) : (
                      (book.purchasePrice !== undefined && book.purchasePrice !== null) && (
                        <div className="flex justify-between items-center pt-1.5 border-t" style={{ borderColor: '#fcd34d66' }}>
                          <span className="text-xs" style={{ color: '#9c6d3a' }}>Harga</span>
                          <span className="font-bold" style={{ color: '#2a1a08' }}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: book.purchaseCurrency || 'IDR', minimumFractionDigits: 0 }).format(book.purchasePrice)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {(book.startedDate || book.finishedDate) && (
                <div className="mt-2">
                  <p className="text-[10px] uppercase tracking-widest px-1 mb-2" style={{ color: '#9c6d3a' }}>Riwayat Membaca</p>
                  <div className="p-3 rounded-xl space-y-1.5"
                    style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${c0}22` }}
                  >
                    {book.startedDate && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#9c6d3a' }}>Mulai membaca</span>
                        <span className="font-medium" style={{ color: '#2a1a08' }}>{new Date(book.startedDate).toLocaleDateString('id-ID')}</span>
                      </div>
                    )}
                    {book.finishedDate && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#9c6d3a' }}>Selesai</span>
                        <span className="font-medium" style={{ color: '#2a1a08' }}>{new Date(book.finishedDate).toLocaleDateString('id-ID')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Page footer with navigator ───────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-t"
        style={{ borderColor: `${c1}18` }}
      >
        <button
          onClick={() => { if (tabIdx > 0) setActiveTab(tabs[tabIdx - 1].id) }}
          disabled={tabIdx === 0}
          className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0"
        >
          <ChevronLeft className="w-4 h-4" style={{ color: '#9c6d3a' }} />
        </button>
        <span className="text-xs italic" style={{ color: `${c1}60`, fontFamily: 'Georgia, serif' }}>
          {tabIdx + 1} / {tabs.length}
        </span>
        <button
          onClick={() => { if (tabIdx < tabs.length - 1) setActiveTab(tabs[tabIdx + 1].id) }}
          disabled={tabIdx === tabs.length - 1}
          className="p-1 rounded transition-colors hover:bg-black/5 disabled:opacity-0"
        >
          <ChevronRight className="w-4 h-4" style={{ color: '#9c6d3a' }} />
        </button>
      </div>
    </motion.div>
  )
}
