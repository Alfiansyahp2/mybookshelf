import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { BRAND, Card, ContributionGraph, fadeUp } from './DashboardWidgets'

interface DashboardActivitySectionProps {
  dailyActivity: any[];
  books: any[];
  stats: any;
  setIsCalendarModalOpen: (val: boolean) => void;
}

export default function DashboardActivitySection({ dailyActivity, books, setIsCalendarModalOpen }: DashboardActivitySectionProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  const toggleMonth = (month: string) => {
    setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }));
  };

  const getBookDate = (b: any) => {
    if (b.status === 'finished') {
      if (b.finishedDate) return new Date(b.finishedDate);
      if (b.readDates && Array.isArray(b.readDates) && b.readDates.length > 0) {
        const sorted = [...b.readDates].map((rd: any) => new Date(rd).getTime()).sort();
        return new Date(sorted[sorted.length - 1]);
      }
    }
    return b.created_at ? new Date(b.created_at) : new Date();
  };

  const booksInYear = books.filter(b => {
    return getBookDate(b).getFullYear() === selectedYear;
  }).sort((a, b) => {
     return getBookDate(b).getTime() - getBookDate(a).getTime();
  });

  const totalPagesInYear = dailyActivity
    .filter(d => new Date(d.date).getFullYear() === selectedYear)
    .reduce((sum, d) => sum + (d.pages || 0), 0);

  const groupedByMonth = booksInYear.reduce((acc: any, book: any) => {
    const d = getBookDate(book);
    // Use Indonesian month names
    const month = d.toLocaleString('id-ID', { month: 'long' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(book);
    return acc;
  }, {});

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 60px', gap: 30, paddingBottom: 40 }}>
      {/* Left Column: Graph + Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
        
        {/* Heatmap Card */}
        <motion.div {...fadeUp(0.6)}>
          <div style={{ fontSize: 14, color: BRAND.darkBrown, marginBottom: 12, paddingLeft: 4, fontWeight: 500 }}>
            {totalPagesInYear} halaman dibaca pada {selectedYear}
          </div>
          <Card style={{ padding: '16px 20px', border: '1px solid rgba(139,99,56,0.15)' }}>
            {dailyActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Tidak ada aktivitas membaca tahun ini</div>
            ) : (
              <ContributionGraph data={dailyActivity} books={books} selectedYear={selectedYear} onClick={() => setIsCalendarModalOpen(true)} />
            )}
          </Card>
        </motion.div>

        {/* Read Activity Timeline */}
        <motion.div {...fadeUp(0.65)}>
          <div style={{ fontSize: 14, color: BRAND.darkBrown, marginBottom: 24, paddingLeft: 4, fontWeight: 500 }}>
            Read activity
          </div>
          
          <div style={{ paddingLeft: 36, borderLeft: '1px solid rgba(139,99,56,0.15)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.keys(groupedByMonth).length === 0 ? (
               <div style={{ fontSize: 12, color: 'rgba(122,92,66,0.5)', padding: '10px 0' }}>Tidak ada riwayat buku pada tahun ini.</div>
            ) : (
              Object.entries(groupedByMonth).map(([month, monthBooks]: any) => {
                const isExpanded = expandedMonths[month];
                return (
                  <div key={month} style={{ position: 'relative', marginBottom: 24 }}>
                    {/* Month Header with line */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: -36, marginBottom: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.darkBrown, background: BRAND.cream, padding: '4px 0', minWidth: 70 }}>{month} {selectedYear}</span>
                      <div style={{ flex: 1, height: 1, background: 'rgba(139,99,56,0.1)' }}></div>
                    </div>
                    
                    {/* Event block */}
                    <div style={{ position: 'relative' }}>
                       {/* Timeline Icon */}
                       <div style={{ position: 'absolute', left: -53, top: 0, width: 32, height: 32, borderRadius: '50%', background: BRAND.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                         <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,99,56,0.08)', border: '1px solid rgba(139,99,56,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={12} color={BRAND.walnut} />
                         </div>
                       </div>
                       <div style={{ flex: 1, paddingTop: 4 }}>
                         <div 
                           onClick={() => toggleMonth(month)}
                           style={{ 
                             fontSize: 13, 
                             fontWeight: 700, 
                             color: BRAND.darkBrown, 
                             cursor: 'pointer', 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'space-between',
                             userSelect: 'none'
                           }}
                         >
                           <span>Terdapat {monthBooks.length} aktivitas buku</span>
                           <span style={{ color: 'rgba(139,99,56,0.6)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                             ▼
                           </span>
                         </div>
                         
                         <AnimatePresence>
                           {isExpanded && (
                             <motion.div
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               style={{ overflow: 'hidden' }}
                             >
                               <div style={{ border: '1px solid rgba(139,99,56,0.15)', borderRadius: 8, overflow: 'hidden', background: 'white', marginTop: 16 }}>
                                 {monthBooks.map((b: any, i: number) => {
                                   const isFinished = b.status === 'finished' && getBookDate(b).getFullYear() === selectedYear;
                                   return (
                                     <div key={b.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderTop: i > 0 ? '1px solid rgba(139,99,56,0.06)' : 'none' }}>
                                        <div style={{ width: 8, height: 32, background: b.spineColors?.[0] ?? BRAND.walnut, borderRadius: '1px' }} />
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#1e40af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</span>
                                            <span style={{ fontSize: 10, color: 'rgba(122,92,66,0.6)' }}>{b.author}</span>
                                          </div>
                                          <span style={{ fontSize: 10, fontWeight: 600, color: isFinished ? '#10b981' : '#6b7280', flexShrink: 0, paddingLeft: 12 }}>
                                            {isFinished ? 'Selesai dibaca' : 'Ditambahkan'}
                                          </span>
                                        </div>
                                     </div>
                                   );
                                 })}
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Right Column: Year Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 30 }}>
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
