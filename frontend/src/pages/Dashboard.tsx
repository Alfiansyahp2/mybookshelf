import { useEffect, useMemo, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useStatistics } from '../hooks/useStatistics'
import { BOOK_GENRES } from '../constants/genres'
import {
  BookOpen, Library, Star, Bookmark, Users,
  TrendingUp, Target, Clock, Heart, Award,
  ChevronRight, BookMarked, Layers
} from 'lucide-react'
import DashboardAccountingSection from '../components/accounting/DashboardAccountingSection'
import ReadingCalendarModal from '../components/modals/ReadingCalendarModal'
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, CartesianGrid
} from 'recharts'

/* ── colour palette matching the project ─────── */
const BRAND = {
  cream:     '#F8F5F0',
  walnut:    '#7A5C42',
  darkBrown: '#4A3B2F',
  gold:      '#D4A574',
  beige:     '#E8E0D5',
}

const STATUS_CFG = {
  reading:  { label: 'Dibaca',       color: '#10b981', bg: '#d1fae5', dark: '#065f46' },
  finished: { label: 'Selesai',      color: '#8b5cf6', bg: '#ede9fe', dark: '#4c1d95' },
  unread:   { label: 'Belum Dibaca', color: '#f59e0b', bg: '#fef3c7', dark: '#78350f' },
  wishlist: { label: 'Wishlist',     color: '#ec4899', bg: '#fce7f3', dark: '#831843' },
  borrowed: { label: 'Dipinjam',     color: '#ef4444', bg: '#fee2e2', dark: '#7f1d1d' },
}

/* ── fade-up helper ──────────────────────────── */
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: EASE_OUT_EXPO },
})

/* ── custom tooltip ──────────────────────────── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(255,251,245,0.97)', border: '1px solid rgba(139,99,56,0.15)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontSize: 12 }}>
      {label && <p style={{ color: BRAND.walnut, fontWeight: 600, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? BRAND.darkBrown, margin: '1px 0' }}>
          <span style={{ fontWeight: 600 }}>{p.name}: </span>{p.value}
        </p>
      ))}
    </div>
  )
}

/* ── section card wrapper ────────────────────── */
function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{
      background: 'white',
      borderRadius: 16,
      border: '1px solid rgba(139,99,56,0.1)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── reading progress ring ───────────────────── */
function ProgressRing({ pct, size = 88, strokeW = 8, color = '#8b5cf6' }: { pct: number; size?: number; strokeW?: number; color?: string }) {
  const r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * Math.min(pct / 100, 1)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(139,99,56,0.1)" strokeWidth={strokeW} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
      />
    </svg>
  )
}

/* ── mini book spine stack (decorative) ─────── */
function MiniSpines({ colors }: { colors: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
      {colors.slice(0, 5).map((c, i) => (
        <div key={i} style={{
          width: 10 + (i % 3) * 4,
          height: 38 + (i % 4) * 8,
          background: `linear-gradient(to right,${c}cc,${c},${c}99)`,
          borderRadius: '1px 2px 2px 1px',
          boxShadow: '1px 0 3px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,0,0,0.5) 1px,rgba(0,0,0,0.5) 2px)' }} />
        </div>
      ))}
    </div>
  )
}

/* ── Github-style contribution graph ────────── */
function ContributionGraph({ data, books, onClick }: { data: any[], books?: any[], onClick?: () => void }) {
  const activityMap = new Map();
  data.forEach(d => {
    activityMap.set(d.date, { pages: d.pages || 0, finished: 0, finishedTitles: [] });
  });

  if (books) {
    books.forEach(b => {
      if (b.status === 'finished') {
        let finalDateStr = null;
        if (b.finishedDate) {
          const d = new Date(b.finishedDate);
          finalDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        } else if (b.readDates && Array.isArray(b.readDates) && b.readDates.length > 0) {
          const sorted = [...b.readDates].map(rd => new Date(rd).getTime()).sort();
          const d = new Date(sorted[sorted.length - 1]);
          finalDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
        
        if (finalDateStr) {
          const existing = activityMap.get(finalDateStr) || { pages: 0, finished: 0, finishedBooks: [] };
          existing.finished += 1;
          if (!existing.finishedBooks) existing.finishedBooks = [];
          existing.finishedBooks.push(b);
          activityMap.set(finalDateStr, existing);
        }
      }
    });
  }

  const getColor = (pages: number, finished: number) => {
    if (finished > 0) return '#4A3B2F'; // Dark Brown for finished book
    if (pages === 0) return 'rgba(139,99,56,0.05)';
    if (pages < 10) return '#d4b797';
    if (pages < 30) return '#c29b71';
    if (pages < 60) return '#ab7d4c';
    return '#8b5a2b';
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const targetEndDate = selectedYear === currentYear ? new Date(today) : new Date(selectedYear, 11, 31);
  
  const allSquares = [];
  const startDate = new Date(targetEndDate);
  startDate.setDate(startDate.getDate() - 364);
  const startDay = startDate.getDay();

  // Pad the start of the first week
  for (let i = 0; i < startDay; i++) {
    allSquares.push(null);
  }

  for (let i = 364; i >= 0; i--) {
    const d = new Date(targetEndDate);
    d.setDate(d.getDate() - i);
    // Format YYYY-MM-DD
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const activity = activityMap.get(dateStr) || { pages: 0, finished: 0, finishedBooks: [] };
    allSquares.push({ date: dateStr, pages: activity.pages, finished: activity.finished, finishedBooks: activity.finishedBooks || [], rawDate: d });
  }

  const monthLabels: { month: string; x: number }[] = [];
  let currentMonth = -1;
  const columnsCount = Math.ceil(allSquares.length / 7);
  for (let col = 0; col < columnsCount; col++) {
    const firstSquareInCol = allSquares[col * 7] || allSquares[col * 7 + 1] || allSquares[col * 7 + 2] || allSquares[col * 7 + 3] || allSquares[col * 7 + 4] || allSquares[col * 7 + 5] || allSquares[col * 7 + 6];
    if (firstSquareInCol && firstSquareInCol.rawDate) {
      const m = firstSquareInCol.rawDate.getMonth();
      if (m !== currentMonth) {
        monthLabels.push({
          month: firstSquareInCol.rawDate.toLocaleString('en-US', { month: 'short' }),
          x: col * 16 // 12px width + 4px gap
        });
        currentMonth = m;
      }
    }
  }

  const [hoveredSquare, setHoveredSquare] = useState<{ day: any, rect: DOMRect } | null>(null);

  const TooltipPortal = () => {
    if (!hoveredSquare) return null;
    const top = hoveredSquare.rect.top - 8;
    const left = hoveredSquare.rect.left + 6;
    const day = hoveredSquare.day;
    return createPortal(
      <AnimatePresence>
        <div style={{
          position: 'fixed', bottom: window.innerHeight - top, left: left,
          transform: 'translateX(-50%)', zIndex: 9999, pointerEvents: 'none',
          width: day.finished > 0 ? 200 : 160
        }}>
          <motion.div
             initial={{ opacity:0, y:4, scale:0.95 }}
             animate={{ opacity:1, y:0, scale:1 }}
             exit={{ opacity:0, y:4, scale:0.95 }}
             transition={{ duration:0.14 }}
          >
             <div style={{ background:'rgba(254,249,239,0.97)', backdropFilter:'blur(14px)', borderRadius:12, boxShadow:'0 10px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.12)', border:'1px solid rgba(139,99,56,0.18)', padding:'12px', position: 'relative' }}>
               {/* Tooltip Arrow pointing down */}
               <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 10, height: 10, background: 'rgba(254,249,239,0.97)', borderRight: '1px solid rgba(139,99,56,0.18)', borderBottom: '1px solid rgba(139,99,56,0.18)' }} />
             
             <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.8)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em' }}>{day.date}</div>
             {day.finishedBooks.map((book: any, idx: number) => {
               const c0 = book.spineColors?.[0] || '#8B7355';
               const c1 = book.spineColors?.[1] || '#655038';
               const c2 = book.spineColors?.[2] || '#4A3B2F';
               return (
                 <div key={book.id || idx} style={{ marginBottom: 8, borderBottom: idx < day.finishedBooks.length - 1 ? '1px solid rgba(139,99,56,0.1)' : 'none', paddingBottom: idx < day.finishedBooks.length - 1 ? 8 : 0 }}>
                    <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <div style={{ position:'relative', width:28, height:40, flexShrink:0 }}>
                         <div style={{ position:'absolute', inset:0, borderRadius:'0 2px 2px 0', background:`linear-gradient(150deg,${c0},${c1} 50%,${c2})`, boxShadow:'2px 2px 5px rgba(0,0,0,0.35)' }} />
                         <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:`linear-gradient(to right,${c2},${c1})`, borderRadius:'1px 0 0 1px' }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                         <p style={{ color:'#1c0f05', fontSize:12, fontWeight:700, fontFamily:"'Georgia',serif", lineHeight:1.3, margin:'0 0 3px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{book.title}</p>
                         <p style={{ color:'#7c5a3a', fontSize:10, margin:0, fontStyle:'italic', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{book.author}</p>
                      </div>
                    </div>
                    {book.genre && (
                      <div style={{ marginTop: 8 }}>
                        <span style={{ display:'inline-block', fontSize:8.5, fontWeight:600, padding:'2px 8px', borderRadius:10, letterSpacing:'0.05em', textTransform:'uppercase', background:`${c0}22`, color:c2, border:`1px solid ${c0}33` }}>
                          {book.genre.split(',')[0]}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, borderTop: '1px solid rgba(139,99,56,0.08)', paddingTop: 8 }}>
                       <span style={{ fontSize: 9.5, padding: '3px 8px', borderRadius: 12, background: '#dbeafe', color: '#1e40af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                         <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6' }} /> Selesai
                       </span>
                       {book.personalRating && Number(book.personalRating) > 0 && (
                         <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: 3 }}>
                           <Star size={11} fill="#f59e0b" color="#f59e0b" /> {Number(book.personalRating).toFixed(1)}
                         </span>
                       )}
                    </div>
                 </div>
               );
             })}
             <div style={{ marginTop: day.finished > 0 ? 8 : 0, paddingTop: day.finished > 0 ? 8 : 0, borderTop: day.finished > 0 ? '1px dashed rgba(139,99,56,0.2)' : 'none', fontSize: 11.5, color: '#4A3B2F', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
               <BookOpen size={13} color="#7A5C42" /> {day.pages} Halaman Dibaca
             </div>
           </div>
          </motion.div>
        </div>
      </AnimatePresence>,
      document.body
    );
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data, selectedYear]);

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <TooltipPortal />
      {/* Left section: Heatmap */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Left fixed column (Day labels) */}
          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 20, paddingBottom: 8, fontSize: 10, color: 'rgba(122,92,66,0.8)' }}>
            <div style={{ height: 12 }}></div>
            <div style={{ height: 12, display: 'flex', alignItems: 'center' }}>Sen</div>
            <div style={{ height: 12 }}></div>
            <div style={{ height: 12, display: 'flex', alignItems: 'center' }}>Rab</div>
            <div style={{ height: 12 }}></div>
            <div style={{ height: 12, display: 'flex', alignItems: 'center' }}>Jum</div>
            <div style={{ height: 12 }}></div>
          </div>
          
          {/* Scrollable area (Months + Grid) */}
          <div 
            ref={scrollRef}
            style={{ flex: 1, overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 8 }}
          >
            {/* Months header */}
            <div style={{ position: 'relative', height: 16, minWidth: columnsCount * 16 }}>
              {monthLabels.map((label, idx) => (
                <span key={idx} style={{ position: 'absolute', left: label.x, fontSize: 10, color: 'rgba(122,92,66,0.8)' }}>
                  {label.month}
                </span>
              ))}
            </div>
            
            {/* Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateRows: 'repeat(7, 12px)', 
              gridAutoFlow: 'column', 
              gap: 4
            }}>
              {allSquares.map((day, i) => (
                day ? (
                  <div 
                    key={i} 
                    style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: 2,
                      background: getColor(day.pages, day.finished),
                      cursor: 'pointer',
                      transition: 'transform 0.1s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      setHoveredSquare({ day, rect: e.currentTarget.getBoundingClientRect() });
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      setHoveredSquare(null);
                    }}
                    onClick={onClick}
                  />
                ) : (
                  <div key={`offset-${i}`} style={{ width: 12, height: 12, background: 'transparent' }} />
                )
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(139,99,56,0.6)', marginTop: 4, paddingRight: 8 }}>
          <span>Sedikit</span>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(139,99,56,0.05)' }} />
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#d4b797' }} />
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#c29b71' }} />
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#ab7d4c' }} />
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#8b5a2b' }} />
          <span>Banyak</span>
        </div>
      </div>

      {/* Right section: Years filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16, borderLeft: '1px solid rgba(139,99,56,0.1)', minWidth: 60 }}>
        {[0, 1, 2, 3].map(offset => {
          const year = currentYear - offset;
          const isActive = selectedYear === year;
          return (
            <div 
              key={year} 
              onClick={() => setSelectedYear(year)}
              style={{ 
                background: isActive ? '#7A5C42' : 'transparent', 
                color: isActive ? 'white' : 'rgba(122,92,66,0.7)', 
                padding: '6px 12px', 
                borderRadius: 6, 
                fontSize: 12, 
                fontWeight: 600, 
                cursor: 'pointer', 
                textAlign: 'center', 
                transition: 'all 0.2s' 
              }} 
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(139,99,56,0.05)' }} 
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {year}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
    MAIN DASHBOARD
   ══════════════════════════════════════════════ */
export default function Dashboard() {
  const { data: booksResponse, isLoading } = useBooks()
  const { data: shelves = [] } = useShelves()
  const { data: statisticsResponse } = useStatistics()
  const backendStats = statisticsResponse?.data;
  const dailyActivity = backendStats?.daily_activity || [];
  
  const books = useMemo(() => booksResponse?.data?.data || [], [booksResponse])
  const [genreFilter, setGenreFilter] = useState<string>('Semua')
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

  /* ── compute stats ─────────────────────────── */
  const stats = useMemo(() => {
    const byStatus = (s: string) => books.filter((b: any) => b.status === s)
    const reading  = byStatus('reading')
    const finished = byStatus('finished')
    const unread   = byStatus('unread')
    const wishlist = byStatus('wishlist')
    const borrowed = byStatus('borrowed')
    const favs     = books.filter((b: any) => b.isFavorite || b.favorite)

    const now = new Date()

    const booksReadThisYear = books.filter((b: any) => {
      let isThisYear = false
      if (b.finishedDate) isThisYear = new Date(b.finishedDate).getFullYear() === now.getFullYear()
      if (!isThisYear && b.startedDate) isThisYear = new Date(b.startedDate).getFullYear() === now.getFullYear()
      if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
        isThisYear = b.readDates.some((d: string) => new Date(d).getFullYear() === now.getFullYear())
      }
      // Include books that are actively being read and don't have explicit dates but were updated this year
      if (!isThisYear && b.status === 'reading') {
         isThisYear = new Date(b.lastModified || b.dateAdded).getFullYear() === now.getFullYear()
      }
      return isThisYear
    })

    const totalPages = booksReadThisYear.reduce((s: number, b: any) => s + (b.pages || b.totalPages || 0), 0)
    const pagesRead = booksReadThisYear.reduce((s: number, b: any) => {
      if (b.status === 'finished') return s + (b.pages || b.totalPages || 0)
      return s + (b.currentPage || 0)
    }, 0)

    const addedThisMonth = books.filter((b: any) => {
      const d = new Date(b.dateAdded)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const finishedThisYear = finished.filter((b: any) => {
      let isThisYear = false
      if (b.finishedDate) {
        isThisYear = new Date(b.finishedDate).getFullYear() === now.getFullYear()
      }
      if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
        isThisYear = b.readDates.some((d: string) => new Date(d).getFullYear() === now.getFullYear())
      }
      return isThisYear
    }).length

    const genreCounts: Record<string, number> = {}
    books.forEach((b: any) => {
      if (b.genre) {
        const genres = b.genre.split(',').map((g: string) => g.trim()).filter(Boolean)
        genres.forEach((g: string) => {
          genreCounts[g] = (genreCounts[g] || 0) + 1
        })
      }
    })
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    const rated = books.filter((b: any) => Number(b.personalRating) > 0)
    const avgRating = rated.length ? (rated.reduce((s: number, b: any) => s + Number(b.personalRating), 0) / rated.length) : 0

    const currentlyReading = [
      ...reading.map((b: any) => ({
        id: b.id, title: b.title, author: b.author,
        pages: b.pages || b.totalPages || 1,
        currentPage: b.currentPage || 0,
        color: b.spineColors?.[0] || BRAND.walnut,
        status: 'reading' as const,
      })),
      ...unread.map((b: any) => ({
        id: b.id, title: b.title, author: b.author,
        pages: b.pages || b.totalPages || 0,
        currentPage: 0,
        color: b.spineColors?.[0] || BRAND.walnut,
        status: 'unread' as const,
      })),
    ]

    const recentBooks = [...books]
      .sort((a: any, b: any) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 3)

    const recentlyFinished = finished
      .sort((a: any, b: any) => new Date(b.finishedDate || 0).getTime() - new Date(a.finishedDate || 0).getTime())
      .slice(0, 4)

    const authorCounts: Record<string, number> = {}
    books.forEach((b: any) => { if (b.author) authorCounts[b.author] = (authorCounts[b.author] || 0) + 1 })

    return {
      total: books.length, reading: reading.length, finished: finished.length,
      unread: unread.length, wishlist: wishlist.length, borrowed: borrowed.length,
      favorites: favs.length, totalPages, pagesRead, addedThisMonth, topGenre,
      avgRating: Math.round(avgRating * 10) / 10,
      finishedThisYear, currentYear: now.getFullYear(),
      currentlyReading, recentBooks, recentlyFinished,
      genreChart: Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      authorChart: Object.entries(authorCounts)
        .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, count }))
        .sort((a, b) => b.count - a.count),
      statusPie: Object.entries(STATUS_CFG)
        .map(([k, v]) => ({ name: v.label, value: byStatus(k).length, color: v.color }))
        .filter(d => d.value > 0),
      bookColors: books.slice(0, 12).map((b: any) => b.spineColors?.[0] || '#8B7355'),
    }
  }, [books])

  const displayedGenres = useMemo(() => {
    let filtered = stats.genreChart;
    if (genreFilter !== 'Semua') {
      const category = BOOK_GENRES.find(c => c.category === genreFilter);
      if (category) {
        filtered = filtered.filter(g => category.genres.includes(g.name));
      }
    }
    return filtered.map(g => ({
      ...g,
      displayName: g.name.length > 15 ? g.name.slice(0, 15) + '…' : g.name
    }));
  }, [stats.genreChart, genreFilter]);

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          style={{ width: 28, height: 28, border: '3px solid rgba(122,92,66,0.2)', borderTopColor: BRAND.walnut, borderRadius: '50%' }}
        />
        <p style={{ color: BRAND.walnut, fontSize: 13 }}>Memuat dashboard…</p>
      </div>
    </div>
  )

  const readPct = stats.totalPages > 0 ? Math.round((stats.pagesRead / stats.totalPages) * 100) : 0
  const goalPct = Math.min((stats.finishedThisYear / 12) * 100, 100)

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ─── Hero header ──────────────────────────── */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.walnut, opacity: 0.6, margin: '0 0 4px' }}>
              Perpustakaan Pribadi
            </p>
            <h1 style={{ fontSize: 28, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown, margin: 0, lineHeight: 1.2 }}>
              Dashboard
            </h1>
          </div>
          {/* Decorative mini spines */}
          <div style={{ opacity: 0.7 }}>
            <MiniSpines colors={stats.bookColors} />
          </div>
        </div>
      </motion.div>

      {/* ─── KPI stat cards ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { icon: Library,   label: 'Total Buku',     val: stats.total,     sub: `+${stats.addedThisMonth} bulan ini`, color: '#6366f1', bg: '#eef2ff' },
          { icon: BookOpen,  label: 'Sedang Dibaca',  val: stats.reading,   sub: 'aktif dibaca',                       color: '#10b981', bg: '#d1fae5' },
          { icon: Bookmark,  label: 'Selesai Dibaca', val: stats.finished,  sub: `${stats.finishedThisYear} tahun ini`, color: '#8b5cf6', bg: '#ede9fe' },
          { icon: Heart,     label: 'Favorit',        val: stats.favorites, sub: 'buku favorit',                       color: '#ec4899', bg: '#fce7f3' },
          { icon: Users,     label: 'Dipinjam',       val: stats.borrowed,  sub: 'belum kembali',                      color: '#f59e0b', bg: '#fef3c7' },
          { icon: BookMarked,label: 'Belum Dibaca',   val: stats.unread,    sub: 'menunggu',                           color: '#64748b', bg: '#f1f5f9' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} {...fadeUp(i * 0.06)}>
              <Card style={{ padding: '16px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={s.color} />
                  </div>
                  <span style={{ fontSize: 11, color: BRAND.walnut, fontWeight: 500, lineHeight: 1.3 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.darkBrown, lineHeight: 1, marginBottom: 3 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>{s.sub}</div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* ─── Main content area ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>

        {/* LEFT — Currently reading + unread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div {...fadeUp(0.35)}>
            <Card style={{ maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(139,99,56,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: 15, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={16} color={BRAND.walnut} /> Sedang & Belum Dibaca
              </h2>
              <Link to="/reading" style={{ fontSize: 11, color: BRAND.walnut, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', opacity: 0.7 }}>
                Lihat semua <ChevronRight size={13} />
              </Link>
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
              {stats.currentlyReading.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(122,92,66,0.45)' }}>
                  <BookOpen size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  <p style={{ fontSize: 12, margin: 0 }}>Belum ada buku</p>
                </div>
              ) : stats.currentlyReading.map((b, i) => {
                const pct = b.pages > 0 ? Math.round((b.currentPage / b.pages) * 100) : 0
                const isUnread = b.status === 'unread'
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Spine mini */}
                      <div style={{ width: 10, height: 52, background: isUnread ? `${b.color}55` : `linear-gradient(to right,${b.color}99,${b.color},${b.color}cc)`, borderRadius: '1px 2px 2px 1px', flexShrink: 0, boxShadow: '1px 0 4px rgba(0,0,0,0.18)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: BRAND.darkBrown, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{b.title}</p>
                          {isUnread && (
                            <span style={{ fontSize: 8.5, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', flexShrink: 0, whiteSpace: 'nowrap' }}>
                              Belum Dibaca
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '0 0 7px', fontSize: 11, color: BRAND.walnut, opacity: 0.65, fontStyle: 'italic' }}>{b.author}</p>
                        {isUnread ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(139,99,56,0.08)' }}>
                              <div style={{ width: 0, height: '100%', borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'rgba(122,92,66,0.4)', whiteSpace: 'nowrap' }}>{b.pages ? `${b.pages} hal.` : '—'}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(139,99,56,0.1)', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.9, delay: 0.5 + i * 0.07, ease: 'easeOut' }}
                                style={{ height: '100%', borderRadius: 2, background: `linear-gradient(to right,${b.color},${b.color}cc)` }}
                              />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.walnut, whiteSpace: 'nowrap' }}>{pct}%</span>
                            <span style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)', whiteSpace: 'nowrap' }}>hal. {b.currentPage}/{b.pages}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {i < stats.currentlyReading.length - 1 && (
                      <div style={{ height: 1, background: 'rgba(139,99,56,0.07)', marginTop: 12 }} />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeUp(0.4)}>
          <DashboardAccountingSection />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <motion.div {...fadeUp(0.5)} style={{ height: '100%' }}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Distribusi Status</h3>
              </div>
              <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={stats.statusPie} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={2}>
                      {stats.statusPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                  {stats.statusPie.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: BRAND.walnut, flex: 1 }}>{d.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.darkBrown }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeUp(0.55)} style={{ height: '100%' }}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Genre Terbanyak</h3>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                  <button
                    onClick={() => setGenreFilter('Semua')}
                    style={{
                      padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: genreFilter === 'Semua' ? BRAND.walnut : 'rgba(139,99,56,0.1)',
                      color: genreFilter === 'Semua' ? 'white' : BRAND.walnut,
                      transition: 'all 0.2s'
                    }}
                  >
                    Semua
                  </button>
                  {BOOK_GENRES.map(g => (
                    <button
                      key={g.category}
                      onClick={() => setGenreFilter(g.category)}
                      style={{
                        padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer',
                        background: genreFilter === g.category ? BRAND.walnut : 'rgba(139,99,56,0.1)',
                        color: genreFilter === g.category ? 'white' : BRAND.walnut,
                        transition: 'all 0.2s'
                      }}
                      title={g.category}
                    >
                      {g.category.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '12px 16px 12px' }}>
                {displayedGenres.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Belum ada data genre</div>
                ) : (
                  <div style={{ overflowY: 'auto', maxHeight: 150, paddingRight: 4 }} className="hide-scrollbar">
                    <ResponsiveContainer width="100%" height={Math.max(150, displayedGenres.length * 28)}>
                      <BarChart data={displayedGenres} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,99,56,0.08)" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="displayName" tick={{ fontSize: 10, fill: BRAND.walnut }} axisLine={false} tickLine={false} width={80} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,99,56,0.05)' }} />
                        <Bar dataKey="count" name="Buku" fill={BRAND.walnut} radius={[0, 4, 4, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>

          <motion.div {...fadeUp(0.4)}>
            <Card>
              <div style={{ padding: '16px 18px', background: `linear-gradient(135deg,${BRAND.darkBrown} 0%,#6b4528 100%)`, borderRadius: '16px 16px 0 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'rgba(255,210,140,0.9)', fontFamily: "'Georgia',serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Target size={14} /> Target {stats.currentYear}
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,251,245,0.7)' }}>{goalPct}% Tercapai</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${goalPct}%` }}
                    transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#ffbd59', borderRadius: 3, boxShadow: '0 0 10px rgba(212,165,116,0.5)' }}
                  />
                </div>
              </div>
              <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(139,99,56,0.03)' }}>
                <div>
                  <span style={{ fontSize: 24, fontWeight: 800, color: BRAND.darkBrown, lineHeight: 1 }}>{stats.finishedThisYear}</span>
                  <span style={{ fontSize: 11, color: BRAND.walnut, marginLeft: 6, fontWeight: 600 }}>/ {stats.target} buku</span>
                </div>
                <div style={{ fontSize: 10, color: BRAND.walnut, opacity: 0.7, textAlign: 'right', lineHeight: 1.3 }}>
                  Sisa {Math.max(0, stats.target - stats.finishedThisYear)} buku
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeUp(0.45)}>
            <Card style={{ padding: '16px 18px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: BRAND.darkBrown, fontFamily: "'Georgia',serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={14} color={BRAND.walnut} /> Statistik Cepat
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Genre Favorit', val: stats.topGenre, icon: '📚' },
                  { label: 'Rating Rata-rata', val: stats.avgRating > 0 ? `⭐ ${stats.avgRating}` : '—', icon: '⭐' },
                  { label: 'Total Rak', val: `${shelves.length} rak`, icon: '🪵' },
                  { label: 'Wishlist', val: `${stats.wishlist} buku`, icon: '🛒' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(139,99,56,0.07)' }}>
                    <span style={{ fontSize: 11, color: BRAND.walnut, opacity: 0.7 }}>{s.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.darkBrown }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeUp(0.58)}>
            <Card>
              <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Penulis Terbanyak</h3>
                </div>
                {/* Spacer to match the height of Genre Terbanyak filter buttons */}
                <div style={{ height: 26, marginBottom: 4 }} />
              </div>
              <div style={{ padding: '12px 16px 12px' }}>
                {stats.authorChart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Belum ada data penulis</div>
                ) : (
                  <div style={{ overflowY: 'auto', height: 150, paddingRight: 4 }} className="hide-scrollbar">
                    <ResponsiveContainer width="100%" height={Math.max(150, stats.authorChart.length * 28)}>
                      <BarChart data={stats.authorChart} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,99,56,0.08)" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: BRAND.walnut }} axisLine={false} tickLine={false} width={80} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,99,56,0.05)' }} />
                        <Bar dataKey="count" name="Buku" fill={'#8b5cf6'} radius={[0, 4, 4, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ─── Reading progress area chart + recent books ─ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 20 }}>

        {/* Reading progress per book */}
        <motion.div {...fadeUp(0.6)} style={{ minWidth: 0 }}>
          <Card>
            <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={15} color={BRAND.walnut} />
              <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Aktivitas Membaca</h3>
            </div>
            <div style={{ padding: '16px' }}>
              {dailyActivity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Tidak ada aktivitas membaca tahun ini</div>
              ) : (
                <ContributionGraph data={dailyActivity} books={books} onClick={() => setIsCalendarModalOpen(true)} />
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent books */}
        <motion.div {...fadeUp(0.65)}>
          <Card style={{ height: '100%' }}>
            <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(139,99,56,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} color={BRAND.walnut} /> Baru Ditambahkan
              </h3>
              <Link to="/library" style={{ fontSize: 10, color: BRAND.walnut, display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', opacity: 0.6 }}>
                Lihat semua <ChevronRight size={12} />
              </Link>
            </div>
            <div style={{ padding: '10px 0' }}>
              {stats.recentBooks.map((b: any, i: number) => {
                const c = STATUS_CFG[b.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.unread
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.06 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderBottom: i < stats.recentBooks.length - 1 ? '1px solid rgba(139,99,56,0.06)' : 'none' }}
                  >
                    {/* Spine */}
                    <div style={{ width: 8, height: 44, background: b.spineColors?.[0] ?? BRAND.walnut, borderRadius: '1px 2px 2px 1px', flexShrink: 0, boxShadow: '1px 0 3px rgba(0,0,0,0.15)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 1px', fontSize: 12, fontWeight: 700, color: BRAND.darkBrown, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</p>
                      <p style={{ margin: 0, fontSize: 10, color: BRAND.walnut, opacity: 0.6, fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.author}</p>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: c.bg, color: c.dark, flexShrink: 0 }}>
                      {c.label}
                    </span>
                  </motion.div>
                )
              })}
              {stats.recentBooks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Belum ada buku</div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ─── Empty state ──────────────────────────── */}
      {stats.total === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(139,99,56,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BookOpen size={32} color={BRAND.walnut} />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 18, fontFamily: "'Georgia',serif", color: BRAND.darkBrown }}>Belum ada buku</h2>
          <p style={{ margin: '0 0 24px', color: BRAND.walnut, opacity: 0.8, fontSize: 14 }}>Mulai tambahkan koleksi buku pertama Anda.</p>
          <Link to="/library" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: BRAND.walnut, color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(139,99,56,0.2)' }}>
            <BookOpen size={16} /> Ke Perpustakaan
          </Link>
        </motion.div>
      )}

      {/* Reading Calendar Modal */}
      <ReadingCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        books={books}
      />
    </div>
  )
}
