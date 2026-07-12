import { motion } from 'framer-motion'
import { BRAND, MiniSpines, fadeUp } from './DashboardWidgets'

interface DashboardHeroSectionProps {
  bookColors: string[];
}

export default function DashboardHeroSection({ bookColors }: DashboardHeroSectionProps) {
  return (
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
          <MiniSpines colors={bookColors} />
        </div>
      </div>
    </motion.div>
  )
}
