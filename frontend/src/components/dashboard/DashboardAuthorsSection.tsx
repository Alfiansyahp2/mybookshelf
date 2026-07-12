import { motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { BRAND, Card, ChartTooltip, fadeUp } from './DashboardWidgets'

interface DashboardAuthorsSectionProps {
  stats: any;
}

export default function DashboardAuthorsSection({ stats }: DashboardAuthorsSectionProps) {
  return (
    <motion.div {...fadeUp(0.58)}>
      <Card style={{ height: 280, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Penulis Terbanyak</h3>
          </div>
        </div>
        <div style={{ padding: '12px 16px 12px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {stats.authorChart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Belum ada data penulis</div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4, display: 'flex', flexDirection: 'column' }} className="hide-scrollbar">
              <div style={{ minHeight: Math.max(150, stats.authorChart.length * 28), flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.authorChart} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,99,56,0.08)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: BRAND.walnut }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,99,56,0.05)' }} />
                  <Bar dataKey="count" name="Buku" fill={'#8b5cf6'} radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
