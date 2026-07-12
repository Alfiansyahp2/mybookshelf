import { motion } from 'framer-motion'
import { Target, Award } from 'lucide-react'
import { BRAND, Card, fadeUp } from './DashboardWidgets'

interface DashboardGoalsSectionProps {
  stats: any;
  shelvesLength: number;
}

export default function DashboardGoalsSection({ stats, shelvesLength }: DashboardGoalsSectionProps) {
  const goalPct = Math.min((stats.finishedThisYear / stats.target) * 100, 100)

  return (
    <>
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
              { label: 'Total Rak', val: `${shelvesLength} rak`, icon: '🪵' },
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
    </>
  )
}
