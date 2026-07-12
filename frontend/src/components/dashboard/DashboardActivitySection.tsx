import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, Clock, ChevronRight } from 'lucide-react'
import { BRAND, Card, STATUS_CFG, ContributionGraph, fadeUp } from './DashboardWidgets'

interface DashboardActivitySectionProps {
  dailyActivity: any[];
  books: any[];
  stats: any;
  setIsCalendarModalOpen: (val: boolean) => void;
}

export default function DashboardActivitySection({ dailyActivity, books, stats, setIsCalendarModalOpen }: DashboardActivitySectionProps) {
  return (
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
  )
}
