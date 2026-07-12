import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import { BRAND, Card, fadeUp } from './DashboardWidgets'

interface DashboardReadingSectionProps {
  currentlyReading: any[];
}

export default function DashboardReadingSection({ currentlyReading }: DashboardReadingSectionProps) {
  return (
    <motion.div {...fadeUp(0.35)}>
      <Card style={{ maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(139,99,56,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} color={BRAND.walnut} /> Sedang & Belum Dibaca
          </h2>
          <Link to="/reading" style={{ fontSize: 11, color: BRAND.walnut, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', opacity: 0.7 }}>
            Lihat semua <ChevronRight size={13} />
          </Link>
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
          {currentlyReading.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(122,92,66,0.45)' }}>
              <BookOpen size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
              <p style={{ fontSize: 12, margin: 0 }}>Belum ada buku</p>
            </div>
          ) : currentlyReading.map((b, i) => {
            const pct = b.pages > 0 ? Math.round((b.currentPage / b.pages) * 100) : 0
            const isUnread = b.status === 'unread'
            return (
              <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Spine mini */}
                  <div style={{ width: 10, height: 52, background: isUnread ? `${b.color}55` : `linear-gradient(to right,${b.color}99,${b.color},${b.color}cc)`, borderRadius: '1px 2px 2px 1px', flexShrink: 0, boxShadow: '1px 0 4px rgba(0,0,0,0.18)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: BRAND.darkBrown, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{b.title}</p>
                      {isUnread && (
                        <span style={{ fontSize: 8.5, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          Belum Dibaca
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 7px', fontSize: 11, color: BRAND.walnut, opacity: 0.65, fontStyle: 'italic' }}>{b.author}</p>
                    {isUnread ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(139,99,56,0.08)' }}>
                          <div style={{ width: 0, height: '100%', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 10, color: 'rgba(122,92,66,0.4)', whiteSpace: 'nowrap' }}>{b.pages ? `${b.pages} hal.` : '—'}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(139,99,56,0.1)', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, delay: 0.5 + i * 0.07, ease: 'easeOut' }}
                            style={{ height: '100%', borderRadius: 2, background: `linear-gradient(to right,${b.color},${b.color}cc)` }}
                          />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.walnut, whiteSpace: 'nowrap' }}>{pct}%</span>
                        <span style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)', whiteSpace: 'nowrap' }}>hal. {b.currentPage}/{b.pages}</span>
                      </div>
                    )}
                  </div>
                </div>
                {i < currentlyReading.length - 1 && (
                  <div style={{ height: 1, background: 'rgba(139,99,56,0.07)', marginTop: 12 }} />
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
