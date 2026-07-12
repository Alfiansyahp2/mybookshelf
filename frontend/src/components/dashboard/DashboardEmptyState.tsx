import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { BRAND } from './DashboardWidgets'

interface DashboardEmptyStateProps {
  total: number;
}

export default function DashboardEmptyState({ total }: DashboardEmptyStateProps) {
  if (total > 0) return null;
  
  return (
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
  )
}
