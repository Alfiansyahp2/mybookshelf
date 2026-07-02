import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import type { Book } from '../../types'

interface ReadingCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  books: Book[]
}

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function ReadingCalendarModal({ isOpen, onClose, books }: ReadingCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedBook, setSelectedBook] = useState<{ book: Book, rect: DOMRect } | null>(null)

  const { daysInMonth, startDayOfWeek, previousMonthDays } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    const prevLastDay = new Date(year, month, 0).getDate()
    
    return { daysInMonth, startDayOfWeek, previousMonthDays: prevLastDay }
  }, [currentDate])

  const calendarCells = useMemo(() => {
    const cells = []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Previous month filler days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, previousMonthDays - i),
        isCurrentMonth: false
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }

    // Next month filler days (to complete the 6x7 grid = 42 cells)
    const remainingCells = 42 - cells.length
    for (let i = 1; i <= remainingCells; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }

    return cells
  }, [daysInMonth, startDayOfWeek, previousMonthDays, currentDate])

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    setSelectedBook(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    setSelectedBook(null)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedBook(null)
  }

  // Get books for a specific date (both finished and read dates)
  const getBooksForDate = (date: Date) => {
    const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    return books.filter(book => {
      let isMatch = false
      
      if (book.finishedDate) {
        const finishDateStr = book.finishedDate.split('T')[0]
        if (finishDateStr === localDateStr) isMatch = true
      }
      
      if (book.readDates && Array.isArray(book.readDates)) {
        if (book.readDates.some(rd => rd.split('T')[0] === localDateStr)) {
          isMatch = true
        }
      }
      
      return isMatch
    })
  }

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative flex flex-col bg-[#faf9f6] text-[#2a1a08] font-sans w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden border border-[#8B7355]/30 z-10"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-[#8B7355]/20 bg-[#fdfbf7] gap-3 md:gap-0">
            <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#8B7355]/10 rounded-full transition-colors text-[#8B7355]"
              >
                <X size={20} />
              </button>
              <h1 className="text-xl font-serif font-bold text-[#2a1a08] flex items-center gap-3">
                <div className="w-8 h-8 bg-[#8B7355] rounded-md flex items-center justify-center text-white shadow-sm">
                  <span className="font-bold text-lg font-sans">{currentDate.getDate()}</span>
                </div>
                Calendar
              </h1>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-6 w-full md:w-auto">
              <button 
                onClick={handleToday}
                className="px-3 md:px-4 py-1.5 md:py-2 border border-[#8B7355]/30 rounded-lg hover:bg-[#8B7355]/10 transition-colors text-xs md:text-sm font-semibold text-[#8B7355]"
              >
                Today
              </button>
              
              <div className="flex items-center gap-4">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-[#8B7355]/10 rounded-full text-[#8B7355]">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-[#8B7355]/10 rounded-full text-[#8B7355]">
                  <ChevronRight size={20} />
                </button>
                <h2 className="text-lg md:text-[22px] text-[#2a1a08] w-40 md:w-48 font-serif font-bold text-right md:text-left">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#faf9f6]">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-[#8B7355]/20 bg-[#fdfbf7]">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div key={day} className="text-center py-2 text-[11px] font-bold text-[#8B7355] tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid cells */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6">
              {calendarCells.map((cell, idx) => {
                const booksOnDay = getBooksForDate(cell.date)
                const isToday = 
                  cell.date.getDate() === new Date().getDate() && 
                  cell.date.getMonth() === new Date().getMonth() && 
                  cell.date.getFullYear() === new Date().getFullYear()

                return (
                  <div 
                    key={idx} 
                    className={`border-b border-r border-[#8B7355]/10 p-1 flex flex-col min-h-0 ${!cell.isCurrentMonth ? 'bg-[#faf9f6] opacity-50' : 'bg-white'}`}
                  >
                    <div className="flex justify-center mb-1">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${isToday ? 'bg-[#8B7355] text-white shadow-sm' : 'text-[#5C4532]'}`}>
                        {cell.date.getDate() === 1 ? `${MONTHS[cell.date.getMonth()].slice(0,3)} ${cell.date.getDate()}` : cell.date.getDate()}
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar pb-1">
                      {booksOnDay.map(book => (
                        <button
                          key={book.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook({ book, rect: e.currentTarget.getBoundingClientRect() })
                          }}
                          className="w-full text-left px-2 py-0.5 rounded text-xs truncate bg-[#8B7355]/10 border border-[#8B7355]/20 text-[#2a1a08] font-medium hover:bg-[#8B7355]/20 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7355] flex-shrink-0" />
                          <span className="truncate">{book.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Popover */}
          <AnimatePresence>
            {selectedBook && (
              <>
                {/* Invisible backdrop to catch outside clicks */}
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setSelectedBook(null)}
                />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="fixed z-[70] w-80 bg-white rounded-xl shadow-2xl border border-[#8B7355]/20 overflow-hidden"
                  style={{
                    // Position roughly near the click
                    top: Math.min(selectedBook.rect.bottom + 10, window.innerHeight - 300),
                    left: Math.min(selectedBook.rect.left, window.innerWidth - 350)
                  }}
                >
                  {/* Top colored bar */}
                  <div className="h-14 bg-gradient-to-r from-[#8B7355] to-[#5C4532] flex justify-end p-2 relative">
                    <button 
                      onClick={() => setSelectedBook(null)}
                      className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors z-10"
                    >
                      <X size={18} />
                    </button>
                    {selectedBook.book.coverImage && (
                      <div className="absolute -bottom-10 left-6 border-4 border-white rounded overflow-hidden shadow-lg bg-white">
                        <img 
                          src={selectedBook.book.coverImage} 
                          alt="Cover" 
                          className="w-16 h-24 object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 pt-12">
                    <h3 className="text-xl text-[#2a1a08] font-serif font-bold mb-1 leading-tight">
                      {selectedBook.book.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-[#5C4532] text-sm mb-4 italic font-serif">
                      <span>{selectedBook.book.author}</span>
                      {selectedBook.book.finishedDate && (
                        <span>
                          {new Date(selectedBook.book.finishedDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                      <div className="pt-0.5">
                        <BookOpen size={18} className="text-[#8B7355]/60" />
                      </div>
                      <div className="text-[#2a1a08]">
                        <div className="font-medium">Finished reading</div>
                        <div className="text-[#8B7355]/80">{selectedBook.book.pages} pages • {selectedBook.book.genre}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
