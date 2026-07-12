import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useStatistics } from '../hooks/useStatistics'
import { useDashboardStats } from '../hooks/useDashboardStats'

import DashboardHeroSection from '../components/dashboard/DashboardHeroSection'
import DashboardStatCardsSection from '../components/dashboard/DashboardStatCardsSection'
import DashboardReadingSection from '../components/dashboard/DashboardReadingSection'
import DashboardChartsSection from '../components/dashboard/DashboardChartsSection'
import DashboardGoalsSection from '../components/dashboard/DashboardGoalsSection'
import DashboardAuthorsSection from '../components/dashboard/DashboardAuthorsSection'
import DashboardActivitySection from '../components/dashboard/DashboardActivitySection'
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState'
import DashboardAccountingSection from '../components/accounting/DashboardAccountingSection'
import ReadingCalendarModal from '../components/modals/ReadingCalendarModal'
import { fadeUp, BRAND } from '../components/dashboard/DashboardWidgets'

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

  const stats = useDashboardStats(books)

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

  return (
    <div className="px-4 md:px-5 py-5 pb-10 max-w-[1200px] mx-auto">

      {/* ─── Hero header ──────────────────────────── */}
      <DashboardHeroSection bookColors={stats.bookColors} />

      {/* ─── KPI stat cards ───────────────────────── */}
      <DashboardStatCardsSection stats={stats} />

      {/* ─── Main content area ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-5">
        
        {/* LEFT — Currently reading + unread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <DashboardReadingSection currentlyReading={stats.currentlyReading} />
          
          <motion.div {...fadeUp(0.4)}>
            <DashboardAccountingSection />
          </motion.div>

          <DashboardChartsSection stats={stats} genreFilter={genreFilter} setGenreFilter={setGenreFilter} />
        </div>

        {/* RIGHT — Goals & Authors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <DashboardGoalsSection stats={stats} shelvesLength={shelves.length} />
          <DashboardAuthorsSection stats={stats} />
        </div>
      </div>

      {/* ─── Reading progress area chart + recent books ─ */}
      <DashboardActivitySection 
        dailyActivity={dailyActivity} 
        books={books} 
        stats={stats} 
        setIsCalendarModalOpen={setIsCalendarModalOpen} 
      />

      {/* ─── Empty state ──────────────────────────── */}
      <DashboardEmptyState total={stats.total} />

      {/* Reading Calendar Modal */}
      <ReadingCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        books={books}
      />
    </div>
  )
}
