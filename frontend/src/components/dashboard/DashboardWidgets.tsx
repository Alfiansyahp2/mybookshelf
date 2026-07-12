import { useEffect, useMemo, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useBooks } from '../../hooks/useBooks'
import { useShelves } from '../../hooks/useShelves'
import { useStatistics } from '../../hooks/useStatistics'
import { BOOK_GENRES } from '../../constants/genres'
import {
  BookOpen, Library, Star, Bookmark, Users,
  TrendingUp, Target, Clock, Heart, Award,
  ChevronRight, BookMarked, Layers
} from 'lucide-react'
import DashboardAccountingSection from '../../components/accounting/DashboardAccountingSection'
import ReadingCalendarModal from '../../components/modals/ReadingCalendarModal'
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, CartesianGrid
} from 'recharts'

/* ── colour palette matching the project ─────── */
export const BRAND = {
  cream:     '#F8F5F0',
  walnut:    '#7A5C42',
  darkBrown: '#4A3B2F',
  gold:      '#D4A574',
  beige:     '#E8E0D5',
}

export const STATUS_CFG = {
  reading:  { label: 'Dibaca',       color: '#10b981', bg: '#d1fae5', dark: '#065f46' },
  finished: { label: 'Selesai',      color: '#8b5cf6', bg: '#ede9fe', dark: '#4c1d95' },
  unread:   { label: 'Belum Dibaca', color: '#f59e0b', bg: '#fef3c7', dark: '#78350f' },
  wishlist: { label: 'Wishlist',     color: '#ec4899', bg: '#fce7f3', dark: '#831843' },
  borrowed: { label: 'Dipinjam',     color: '#ef4444', bg: '#fee2e2', dark: '#7f1d1d' },
}

/* ── fade-up helper ──────────────────────────── */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const
export const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: EASE_OUT_EXPO },
})

/* ── custom tooltip ──────────────────────────── */
export const ChartTooltip = ({ active, payload, label }: any) => {
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
export function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
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
export function ProgressRing({ pct, size = 88, strokeW = 8, color = '#8b5cf6' }: { pct: number; size?: number; strokeW?: number; color?: string }) {
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
export function MiniSpines({ colors }: { colors: string[] }) {
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
export function ContributionGraph({ data, books, onClick }: { data: any[], books?: any[], onClick?: () => void }) {
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
