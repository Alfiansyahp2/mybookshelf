import { motion } from 'framer-motion'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'
import { BRAND, Card, ChartTooltip, fadeUp } from './DashboardWidgets'
import { BOOK_GENRES } from '../../constants/genres'
import { useMemo } from 'react'

interface DashboardChartsSectionProps {
  stats: any;
  genreFilter: string;
  setGenreFilter: (genre: string) => void;
}

export default function DashboardChartsSection({ stats, genreFilter, setGenreFilter }: DashboardChartsSectionProps) {
  
  const displayedGenres = useMemo(() => {
    let filtered = stats.genreChart;
    if (genreFilter !== 'Semua') {
      const category = BOOK_GENRES.find((c: any) => c.category === genreFilter);
      if (category) {
        filtered = filtered.filter((g: any) => category.genres.includes(g.name));
      }
    }
    return filtered.map((g: any) => ({
      ...g,
      displayName: g.name.length > 15 ? g.name.slice(0, 15) + '…' : g.name
    }));
  }, [stats.genreChart, genreFilter]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
      <motion.div {...fadeUp(0.5)} style={{ height: '100%' }}>
        <Card style={{ height: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Distribusi Status</h3>
          </div>
          <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={stats.statusPie} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={2}>
                  {stats.statusPie.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
              {stats.statusPie.map((d: any) => (
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
        <Card style={{ height: 280, display: 'flex', flexDirection: 'column' }}>
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
              {BOOK_GENRES.map((g: any) => (
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
          <div style={{ padding: '12px 16px 12px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {displayedGenres.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Belum ada data genre</div>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4, display: 'flex', flexDirection: 'column' }} className="hide-scrollbar">
                <div style={{ minHeight: Math.max(150, displayedGenres.length * 28), flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayedGenres} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,99,56,0.08)" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="displayName" tick={{ fontSize: 10, fill: BRAND.walnut }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,99,56,0.05)' }} />
                    <Bar dataKey="count" name="Buku" fill={BRAND.walnut} radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
