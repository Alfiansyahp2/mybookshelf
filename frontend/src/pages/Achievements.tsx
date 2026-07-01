import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useAchievementStore } from '../hooks/useAchievementTracker'
import {
  Trophy, BookOpen, Star, Crown, Heart, Sparkles, Layers,
  Bookmark, CheckCircle, Flame, Shield, Map
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  category: 'milestone' | 'collection' | 'special'
  target: number
  progress: number
  unlocked: boolean
  color: string
}

const BRAND = {
  cream:     '#F8F5F0',
  walnut:    '#7A5C42',
  darkBrown: '#4A3B2F',
  gold:      '#D4A574',
  beige:     '#E8E0D5',
}

export default function Achievements() {
  const { data: booksResponse, isLoading } = useBooks()
  const { data: shelves = [] } = useShelves()
  const { unlockedIds } = useAchievementStore()

  const books = booksResponse?.data?.data || []

  // Compute stats
  const stats = useMemo(() => {
    const finished = books.filter(b => b.status === 'finished')
    const wishlist = books.filter(b => b.status === 'wishlist')
    const favs = books.filter(b => b.favorite || b.isFavorite)
    const rated = books.filter(b => b.personalRating > 0)
    const fiveStar = books.filter(b => b.personalRating === 5)
    const pages = finished.reduce((sum, b) => sum + (b.pages || b.totalPages || 0), 0)
    const genres = new Set(books.filter(b => b.genre).map(b => b.genre))

    return {
      total: books.length,
      finished: finished.length,
      wishlist: wishlist.length,
      favs: favs.length,
      rated: rated.length,
      fiveStar: fiveStar.length,
      pages,
      genres: genres.size,
      shelves: shelves.length
    }
  }, [books, shelves])

  // Define achievements matching useAchievementTracker
  const achievementsList: Achievement[] = useMemo(() => [
    {
      id: 'first-book', title: 'Langkah Pertama',
      description: 'Menambahkan buku pertama ke perpustakaan.',
      icon: BookOpen, category: 'milestone', target: 1, progress: stats.total,
      unlocked: unlockedIds.includes('first-book'), color: '#3b82f6'
    },
    {
      id: 'kutu-buku-1', title: 'Kutu Buku Pemula',
      description: 'Menyelesaikan 5 buku.',
      icon: CheckCircle, category: 'milestone', target: 5, progress: stats.finished,
      unlocked: unlockedIds.includes('kutu-buku-1'), color: '#10b981'
    },
    {
      id: 'kutu-buku-2', title: 'Kutu Buku Pro',
      description: 'Menyelesaikan 20 buku.',
      icon: Trophy, category: 'milestone', target: 20, progress: stats.finished,
      unlocked: unlockedIds.includes('kutu-buku-2'), color: '#8b5cf6'
    },
    {
      id: 'marathon', title: 'Marathon Membaca',
      description: 'Membaca lebih dari 1.000 halaman.',
      icon: Flame, category: 'milestone', target: 1000, progress: stats.pages,
      unlocked: unlockedIds.includes('marathon'), color: '#ef4444'
    },
    {
      id: 'marathon-ultra', title: 'Ultra Marathon',
      description: 'Membaca lebih dari 5.000 halaman!',
      icon: Shield, category: 'milestone', target: 5000, progress: stats.pages,
      unlocked: unlockedIds.includes('marathon-ultra'), color: '#dc2626'
    },
    {
      id: 'kolektor', title: 'Kolektor',
      description: 'Perpustakaanmu memiliki 20 buku.',
      icon: Bookmark, category: 'collection', target: 20, progress: stats.total,
      unlocked: unlockedIds.includes('kolektor'), color: '#f59e0b'
    },
    {
      id: 'kolektor-master', title: 'Master Kolektor',
      description: 'Luar biasa, kamu memiliki 50 buku!',
      icon: Crown, category: 'collection', target: 50, progress: stats.total,
      unlocked: unlockedIds.includes('kolektor-master'), color: '#d97706'
    },
    {
      id: 'arsitek-rak', title: 'Arsitek Rak',
      description: 'Membuat 3 rak berbeda untuk koleksimu.',
      icon: Layers, category: 'collection', target: 3, progress: stats.shelves,
      unlocked: unlockedIds.includes('arsitek-rak'), color: '#6366f1'
    },
    {
      id: 'ahli-genre', title: 'Eksplorator Genre',
      description: 'Membaca buku dari 3 genre berbeda.',
      icon: Map, category: 'special', target: 3, progress: stats.genres,
      unlocked: unlockedIds.includes('ahli-genre'), color: '#ec4899'
    },
    {
      id: 'kurator', title: 'Kurator Sempurna',
      description: 'Memberikan rating bintang 5 pada sebuah buku.',
      icon: Star, category: 'special', target: 1, progress: stats.fiveStar,
      unlocked: unlockedIds.includes('kurator'), color: '#eab308'
    },
    {
      id: 'penggemar', title: 'Penggemar Setia',
      description: 'Menandai 5 buku sebagai favorit.',
      icon: Heart, category: 'special', target: 5, progress: stats.favs,
      unlocked: unlockedIds.includes('penggemar'), color: '#f43f5e'
    },
    {
      id: 'pemimpi', title: 'Sang Pemimpi',
      description: 'Menambahkan 5 buku ke Wishlist.',
      icon: Sparkles, category: 'special', target: 5, progress: stats.wishlist,
      unlocked: unlockedIds.includes('pemimpi'), color: '#8b5cf6'
    }
  ], [stats, unlockedIds])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p style={{ color: BRAND.walnut, fontSize: 13 }}>Memuat pencapaian…</p>
      </div>
    )
  }

  const unlockedCount = achievementsList.filter(a => a.unlocked).length
  const completionPct = Math.round((unlockedCount / achievementsList.length) * 100)

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontFamily: "'Georgia',serif", fontWeight: 700, color: BRAND.darkBrown, margin: '0 0 8px' }}>
          Pencapaian
        </h1>
        <p style={{ margin: 0, color: BRAND.walnut, opacity: 0.8 }}>
          Lacak progres dan koleksi medali membaca kamu.
        </p>

        {/* Progress Overview */}
        <div style={{ marginTop: 20, padding: 20, background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: BRAND.beige, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Trophy size={32} color={BRAND.walnut} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.darkBrown }}>Total Pencapaian</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.walnut }}>{unlockedCount} / {achievementsList.length}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(139,99,56,0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 1, delay: 0.2 }}
                style={{ height: '100%', background: BRAND.walnut, borderRadius: 4 }} 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {achievementsList.map((ach, i) => {
          const Icon = ach.icon
          const progressPct = Math.min((ach.progress / ach.target) * 100, 100)
          
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: ach.unlocked ? 'white' : 'rgba(255,255,255,0.4)',
                borderRadius: 16,
                border: `1px solid ${ach.unlocked ? 'rgba(139,99,56,0.15)' : 'rgba(139,99,56,0.05)'}`,
                padding: 16,
                display: 'flex',
                gap: 16,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: ach.unlocked ? `${ach.color}15` : 'rgba(139,99,56,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={24} color={ach.unlocked ? ach.color : 'rgba(139,99,56,0.3)'} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: ach.unlocked ? BRAND.darkBrown : 'rgba(74,59,47,0.5)' }}>
                  {ach.title}
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: 11, color: ach.unlocked ? BRAND.walnut : 'rgba(122,92,66,0.5)', lineHeight: 1.4 }}>
                  {ach.description}
                </p>

                {/* Progress Bar (only if not unlocked) */}
                {!ach.unlocked && (
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: 'rgba(122,92,66,0.5)' }}>Progres</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(122,92,66,0.7)' }}>{ach.progress} / {ach.target}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(139,99,56,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progressPct}%`, background: 'rgba(139,99,56,0.3)', borderRadius: 2 }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Unlocked Badge / Date */}
              {ach.unlocked && (
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <CheckCircle size={16} color={BRAND.gold} />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}
