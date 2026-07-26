import { motion } from 'framer-motion'
import { Library, Bookmark, Heart, Users, BookMarked, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BRAND, Card, fadeUp } from './DashboardWidgets'
import { useAccountingOverview } from '../../hooks/accounting/useAccountingReports'

interface DashboardStatCardsSectionProps {
  stats: any;
}

export default function DashboardStatCardsSection({ stats }: DashboardStatCardsSectionProps) {
  const navigate = useNavigate();
  const { data: accountingOverview } = useAccountingOverview({ period: 'month' });
  const totalExpenses = accountingOverview?.data?.summary?.formatted_total || 'Rp 0';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
      {[
        { icon: Library,   label: 'Total Buku',     val: stats.total,     sub: `+${stats.addedThisMonth} bulan ini`, color: '#6366f1', bg: '#eef2ff' },
        { icon: Heart,     label: 'Favorit',        val: stats.favorites, sub: 'buku favorit',                       color: '#ec4899', bg: '#fce7f3' },
        { icon: Bookmark,  label: 'Selesai Dibaca', val: stats.finished,  sub: `${stats.finishedThisYear} tahun ini`, color: '#8b5cf6', bg: '#ede9fe' },
        { icon: BookMarked,label: 'Belum Dibaca',   val: stats.unread,    sub: 'menunggu',                           color: '#64748b', bg: '#f1f5f9' },
        { icon: Users,     label: 'Dipinjam',       val: stats.borrowed,  sub: 'belum kembali',                      color: '#f59e0b', bg: '#fef3c7' },
        { icon: DollarSign,label: 'Accounting',     val: totalExpenses,   sub: 'total expenses',                     color: '#f59e0b', bg: '#fef3c7', valSize: 18, route: '/accounting' },
      ].map((s, i) => {
        const Icon = s.icon
        return (
          <motion.div 
            key={s.label} 
            {...fadeUp(i * 0.06)} 
            onClick={() => s.route && navigate(s.route)}
            style={{ cursor: s.route ? 'pointer' : 'default' }}
          >
            <Card style={{ padding: '16px 14px', height: '100%', transition: 'all 0.2s ease-in-out', ...(s.route ? { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } : {}) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={s.color} />
                </div>
                <span style={{ fontSize: 11, color: BRAND.walnut, fontWeight: 500, lineHeight: 1.3 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: s.valSize || 28, fontWeight: 800, color: BRAND.darkBrown, lineHeight: 1, marginBottom: 3, wordBreak: 'break-word' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>{s.sub}</div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
