import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { BOOK_GENRES } from '../constants/genres'
import {
  BookOpen, Library, Star, Bookmark, Users,
  TrendingUp, Target, Clock, Heart, Award,
  ChevronRight, BookMarked, Layers
} from 'lucide-react'
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, CartesianGrid
} from 'recharts'

/* ── colour palette matching the project ─────── */
const BRAND = {
  cream:     '#F8F5F0',
  walnut:    '#7A5C42',
  darkBrown: '#4A3B2F',
  gold:      '#D4A574',
  beige:     '#E8E0D5',
}

const STATUS_CFG = {
  reading:  { label: 'Dibaca',       color: '#10b981', bg: '#d1fae5', dark: '#065f46' },
  finished: { label: 'Selesai',      color: '#8b5cf6', bg: '#ede9fe', dark: '#4c1d95' },
  unread:   { label: 'Belum Dibaca', color: '#f59e0b', bg: '#fef3c7', dark: '#78350f' },
  wishlist: { label: 'Wishlist',     color: '#ec4899', bg: '#fce7f3', dark: '#831843' },
  borrowed: { label: 'Dipinjam',     color: '#ef4444', bg: '#fee2e2', dark: '#7f1d1d' },
}

/* ── fade-up helper ──────────────────────────── */
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: EASE_OUT_EXPO },
})

/* ── custom tooltip ──────────────────────────── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(255,251,245,0.97)', border: '1px solid rgba(139,99,56,0.15)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontSize: 12 }}>
      {label && <p style={{ color: BRAND.walnut, fontWeight: 600, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? BRAND.darkBrown, margin: '1px 0' }}>
          <span style={{ fontWeight: 600 }}>{p.name}: </span>{p.value}
        </p>
      ))}
    </div>
  )
}

/* ── section card wrapper ────────────────────── */
function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{
      background: 'white',
      borderRadius: 16,
      border: '1px solid rgba(139,99,56,0.1)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── reading progress ring ───────────────────── */
function ProgressRing({ pct, size = 88, strokeW = 8, color = '#8b5cf6' }: { pct: number; size?: number; strokeW?: number; color?: string }) {
  const r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * Math.min(pct / 100, 1)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(139,99,56,0.1)" strokeWidth={strokeW} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
      />
    </svg>
  )
}

/* ── mini book spine stack (decorative) ─────── */
function MiniSpines({ colors }: { colors: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
      {colors.slice(0, 5).map((c, i) => (
        <div key={i} style={{
          width: 10 + (i % 3) * 4,
          height: 38 + (i % 4) * 8,
          background: `linear-gradient(to right,${c}cc,${c},${c}99)`,
          borderRadius: '1px 2px 2px 1px',
          boxShadow: '1px 0 3px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,0,0,0.5) 1px,rgba(0,0,0,0.5) 2px)' }} />
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════
    MAIN DASHBOARD
   ══════════════════════════════════════════════ */
export default function Dashboard() {
  const { data: booksResponse, isLoading } = useBooks()
  const { data: shelves = [] } = useShelves()
  const books = useMemo(() => booksResponse?.data?.data || [], [booksResponse])
  const [genreFilter, setGenreFilter] = useState<string>('Semua')

  /* ── compute stats ─────────────────────────── */
  const stats = useMemo(() => {
    const byStatus = (s: string) => books.filter((b: any) => b.status === s)
    const reading  = byStatus('reading')
    const finished = byStatus('finished')
    const unread   = byStatus('unread')
    const wishlist = byStatus('wishlist')
    const borrowed = byStatus('borrowed')
    const favs     = books.filter((b: any) => b.isFavorite || b.favorite)

    const now = new Date()

    const booksReadThisYear = books.filter((b: any) => {
      let isThisYear = false
      if (b.finishedDate) isThisYear = new Date(b.finishedDate).getFullYear() === now.getFullYear()
      if (!isThisYear && b.startedDate) isThisYear = new Date(b.startedDate).getFullYear() === now.getFullYear()
      if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
        isThisYear = b.readDates.some((d: string) => new Date(d).getFullYear() === now.getFullYear())
      }
      // Include books that are actively being read and don't have explicit dates but were updated this year
      if (!isThisYear && b.status === 'reading') {
         isThisYear = new Date(b.lastModified || b.dateAdded).getFullYear() === now.getFullYear()
      }
      return isThisYear
    })

    const totalPages = booksReadThisYear.reduce((s: number, b: any) => s + (b.pages || b.totalPages || 0), 0)
    const pagesRead = booksReadThisYear.reduce((s: number, b: any) => {
      if (b.status === 'finished') return s + (b.pages || b.totalPages || 0)
      return s + (b.currentPage || 0)
    }, 0)

    const addedThisMonth = books.filter((b: any) => {
      const d = new Date(b.dateAdded)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const finishedThisYear = finished.filter((b: any) => {
      let isThisYear = false
      if (b.finishedDate) {
        isThisYear = new Date(b.finishedDate).getFullYear() === now.getFullYear()
      }
      if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
        isThisYear = b.readDates.some((d: string) => new Date(d).getFullYear() === now.getFullYear())
      }
      return isThisYear
    }).length

    const genreCounts: Record<string, number> = {}
    books.forEach((b: any) => {
      if (b.genre) {
        const genres = b.genre.split(',').map((g: string) => g.trim()).filter(Boolean)
        genres.forEach((g: string) => {
          genreCounts[g] = (genreCounts[g] || 0) + 1
        })
      }
    })
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    const rated = books.filter((b: any) => b.personalRating > 0)
    const avgRating = rated.length ? (rated.reduce((s: number, b: any) => s + b.personalRating, 0) / rated.length) : 0

    const currentlyReading = reading.map((b: any) => ({
      id: b.id, title: b.title, author: b.author,
      pages: b.pages || b.totalPages || 1,
      currentPage: b.currentPage || 0,
      color: b.spineColors?.[0] || BRAND.walnut,
    }))

    const recentBooks = [...books]
      .sort((a: any, b: any) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 5)

    const authorCounts: Record<string, number> = {}
    books.forEach((b: any) => { if (b.author) authorCounts[b.author] = (authorCounts[b.author] || 0) + 1 })

    return {
      total: books.length, reading: reading.length, finished: finished.length,
      unread: unread.length, wishlist: wishlist.length, borrowed: borrowed.length,
      favorites: favs.length, totalPages, pagesRead, addedThisMonth, topGenre,
      avgRating: Math.round(avgRating * 10) / 10,
      finishedThisYear, currentYear: now.getFullYear(),
      currentlyReading, recentBooks,
      genreChart: Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      authorChart: Object.entries(authorCounts)
        .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, count }))
        .sort((a, b) => b.count - a.count),
      statusPie: Object.entries(STATUS_CFG)
        .map(([k, v]) => ({ name: v.label, value: byStatus(k).length, color: v.color }))
        .filter(d => d.value > 0),
      bookColors: books.slice(0, 12).map((b: any) => b.spineColors?.[0] || '#8B7355'),
    }
  }, [books])

  const displayedGenres = useMemo(() => {
    let filtered = stats.genreChart;
    if (genreFilter !== 'Semua') {
      const category = BOOK_GENRES.find(c => c.category === genreFilter);
      if (category) {
        filtered = filtered.filter(g => category.genres.includes(g.name));
      }
    }
    return filtered.map(g => ({
      ...g,
      displayName: g.name.length > 15 ? g.name.slice(0, 15) + '…' : g.name
    }));
  }, [stats.genreChart, genreFilter]);

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

  const readPct = stats.totalPages > 0 ? Math.round((stats.pagesRead / stats.totalPages) * 100) : 0
  const goalPct = Math.min((stats.finishedThisYear / 12) * 100, 100)

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ─── Hero header ──────────────────────────── */}
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
            <MiniSpines colors={stats.bookColors} />
          </div>
        </div>
      </motion.div>

      {/* ─── KPI stat cards ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { icon: Library,   label: 'Total Buku',     val: stats.total,     sub: `+${stats.addedThisMonth} bulan ini`, color: '#6366f1', bg: '#eef2ff' },
          { icon: BookOpen,  label: 'Sedang Dibaca',  val: stats.reading,   sub: 'aktif dibaca',                       color: '#10b981', bg: '#d1fae5' },
          { icon: Bookmark,  label: 'Selesai Dibaca', val: stats.finished,  sub: `${stats.finishedThisYear} tahun ini`, color: '#8b5cf6', bg: '#ede9fe' },
          { icon: Heart,     label: 'Favorit',        val: stats.favorites, sub: 'buku favorit',                       color: '#ec4899', bg: '#fce7f3' },
          { icon: Users,     label: 'Dipinjam',       val: stats.borrowed,  sub: 'belum kembali',                      color: '#f59e0b', bg: '#fef3c7' },
          { icon: BookMarked,label: 'Belum Dibaca',   val: stats.unread,    sub: 'menunggu',                           color: '#64748b', bg: '#f1f5f9' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} {...fadeUp(i * 0.06)}>
              <Card style={{ padding: '16px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={s.color} />
                  </div>
                  <span style={{ fontSize: 11, color: BRAND.walnut, fontWeight: 500, lineHeight: 1.3 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.darkBrown, lineHeight: 1, marginBottom: 3 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>{s.sub}</div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* ─── Main content area ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>

        {/* LEFT — Currently reading */}
        <motion.div {...fadeUp(0.35)}>
          <Card style={{ height: '100%' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(139,99,56,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: 15, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={16} color={BRAND.walnut} /> Sedang Dibaca
              </h2>
              <Link to="/reading" style={{ fontSize: 11, color: BRAND.walnut, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', opacity: 0.7 }}>
                Lihat semua <ChevronRight size={13} />
              </Link>
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.currentlyReading.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(122,92,66,0.45)' }}>
                  <BookOpen size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  <p style={{ fontSize: 12, margin: 0 }}>Belum ada buku yang sedang dibaca</p>
                </div>
              ) : stats.currentlyReading.map((b, i) => {
                const pct = b.pages > 0 ? Math.round((b.currentPage / b.pages) * 100) : 0
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Spine mini */}
                      <div style={{ width: 10, height: 52, background: `linear-gradient(to right,${b.color}99,${b.color},${b.color}cc)`, borderRadius: '1px 2px 2px 1px', flexShrink: 0, boxShadow: '1px 0 4px rgba(0,0,0,0.18)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 1px', fontSize: 13, fontWeight: 700, color: BRAND.darkBrown, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</p>
                        <p style={{ margin: '0 0 7px', fontSize: 11, color: BRAND.walnut, opacity: 0.65, fontStyle: 'italic' }}>{b.author}</p>
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
                      </div>
                    </div>
                    {i < stats.currentlyReading.length - 1 && (
                      <div style={{ height: 1, background: 'rgba(139,99,56,0.07)', marginTop: 12 }} />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* RIGHT — Goals + Reading stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Reading Goal */}
          <motion.div {...fadeUp(0.4)}>
            <Card>
              <div style={{ padding: '16px 18px', background: `linear-gradient(135deg,${BRAND.darkBrown} 0%,#6b4528 100%)`, borderRadius: '16px 16px 0 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'rgba(255,210,140,0.9)', fontFamily: "'Georgia',serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Target size={14} /> Target {stats.currentYear}
                  </h3>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{stats.finishedThisYear} / 12</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${goalPct}%` }}
                    transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 3, background: goalPct >= 100 ? '#10b981' : 'rgba(255,210,140,0.85)' }}
                  />
                </div>
                <p style={{ margin: '8px 0 0', fontSize: 11, color: 'rgba(255,210,140,0.55)' }}>
                  {goalPct >= 100 ? '🎉 Target tercapai!' : `${12 - stats.finishedThisYear} buku lagi untuk target tahun ini`}
                </p>
              </div>

              {/* Page stats */}
              <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                {[
                  { label: 'Halaman Dibaca', val: stats.pagesRead.toLocaleString() },
                  { label: 'Total Halaman', val: stats.totalPages.toLocaleString() },
                  { label: '% Terbaca', val: `${readPct}%` },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: BRAND.darkBrown }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: BRAND.walnut, opacity: 0.55, marginTop: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick stats */}
          <motion.div {...fadeUp(0.45)}>
            <Card style={{ padding: '16px 18px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: BRAND.darkBrown, fontFamily: "'Georgia',serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={14} color={BRAND.walnut} /> Statistik Cepat
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Genre Favorit', val: stats.topGenre, icon: '📚' },
                  { label: 'Rating Rata-rata', val: stats.avgRating > 0 ? `⭐ ${stats.avgRating}` : '—', icon: '⭐' },
                  { label: 'Total Rak', val: `${shelves.length} rak`, icon: '🪵' },
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
        </div>
      </div>

      {/* ─── Charts row ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>

        {/* Status donut */}
        <motion.div {...fadeUp(0.5)}>
          <Card>
            <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Distribusi Status</h3>
            </div>
            <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={stats.statusPie} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={2}>
                    {stats.statusPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stats.statusPie.map(d => (
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

        {/* Genre bar chart */}
        <motion.div {...fadeUp(0.55)}>
          <Card>
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
                {BOOK_GENRES.map(g => (
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
            <div style={{ padding: '12px 16px 12px' }}>
              {displayedGenres.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Belum ada data genre</div>
              ) : (
                <div style={{ overflowY: 'auto', maxHeight: 150, paddingRight: 4 }} className="hide-scrollbar">
                  <ResponsiveContainer width="100%" height={Math.max(150, displayedGenres.length * 28)}>
                    <BarChart data={displayedGenres} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,99,56,0.08)" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="displayName" tick={{ fontSize: 10, fill: BRAND.walnut }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,99,56,0.05)' }} />
                      <Bar dataKey="count" name="Buku" fill={BRAND.walnut} radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Author bar chart */}
        <motion.div {...fadeUp(0.58)}>
          <Card>
            <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Penulis Terbanyak</h3>
            </div>
            <div style={{ padding: '12px 16px 12px' }}>
              {stats.authorChart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Belum ada data penulis</div>
              ) : (
                <div style={{ overflowY: 'auto', maxHeight: 150, paddingRight: 4 }} className="hide-scrollbar">
                  <ResponsiveContainer width="100%" height={Math.max(150, stats.authorChart.length * 28)}>
                    <BarChart data={stats.authorChart} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,99,56,0.08)" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: BRAND.walnut }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,99,56,0.05)' }} />
                      <Bar dataKey="count" name="Buku" fill={'#8b5cf6'} radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ─── Reading progress area chart + recent books ─ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Reading progress per book */}
        <motion.div {...fadeUp(0.6)}>
          <Card>
            <div style={{ padding: '16px 20px 8px', borderBottom: '1px solid rgba(139,99,56,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={15} color={BRAND.walnut} />
              <h3 style={{ margin: 0, fontSize: 14, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown }}>Progress Buku</h3>
            </div>
            <div style={{ padding: '12px 16px 12px' }}>
              {stats.currentlyReading.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(122,92,66,0.4)', fontSize: 12 }}>Tidak ada buku yang sedang dibaca</div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={stats.currentlyReading.map(b => ({
                    name: b.title.slice(0, 12) + (b.title.length > 12 ? '…' : ''),
                    Progres: b.pages > 0 ? Math.round((b.currentPage / b.pages) * 100) : 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,99,56,0.08)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: BRAND.walnut }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: BRAND.walnut }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="Progres" stroke={BRAND.walnut} fill={BRAND.beige} strokeWidth={2} dot={{ fill: BRAND.walnut, r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
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

      {/* ─── Empty state ──────────────────────────── */}
      {stats.total === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '48px 0' }}>
          <Library size={48} color="rgba(122,92,66,0.25)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: 18, fontFamily: "'Georgia',serif", color: BRAND.darkBrown, margin: '0 0 6px' }}>Koleksimu masih kosong</h3>
          <p style={{ fontSize: 13, color: BRAND.walnut, opacity: 0.6, margin: 0 }}>Mulai tambahkan buku ke perpustakaan</p>
          <Link to="/library" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '9px 20px', background: BRAND.darkBrown, color: 'white', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <Layers size={14} /> Pergi ke Library
          </Link>
        </motion.div>
      )}
    </div>
  )
}
