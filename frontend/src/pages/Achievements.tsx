import { useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useAchievements, useUnlockAchievement } from '../hooks/useAchievements'
import {
  Trophy, BookOpen, Star, Crown, Heart, Sparkles, Layers,
  Bookmark, CheckCircle, Flame, Shield, Map, Icon
} from 'lucide-react'

const BRAND = {
  cream:     '#F8F5F0',
  walnut:    '#7A5C42',
  darkBrown: '#4A3B2F',
  gold:      '#D4A574',
  beige:     '#E8E0D5',
}

const iconMap: Record<string, any> = {
  BookOpen, CheckCircle, Trophy, Flame, Shield, Bookmark, Crown, Layers, Map, Star, Heart, Sparkles
}

const colorMap: Record<string, string> = {
  common: '#3b82f6', // blue
  rare: '#10b981', // green
  epic: '#8b5cf6', // purple
  legendary: '#f59e0b', // gold
}

export default function Achievements() {
  const { data: booksResponse } = useBooks()
  const { data: shelves = [] } = useShelves()
  
  // API Fetch
  const { data: apiAchievements = [], isLoading } = useAchievements()
  const unlockMutation = useUnlockAchievement()

  const books = booksResponse?.data?.data || []

  // Compute stats for progress
  const stats = useMemo(() => {
    const finished = books.filter((b: any) => b.status === 'finished')
    const wishlist = books.filter((b: any) => b.status === 'wishlist')
    const favs = books.filter((b: any) => b.favorite || b.isFavorite)
    const rated = books.filter((b: any) => b.personalRating > 0)
    const fiveStar = books.filter((b: any) => b.personalRating === 5)
    const pages = finished.reduce((sum: number, b: any) => sum + (b.pages || b.totalPages || 0), 0)
    const genres = new Set(books.filter((b: any) => b.genre).map((b: any) => b.genre))

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

  // Combine API data with computed progress and UI mapping
  const achievementsList = useMemo(() => {
    return apiAchievements.map(ach => {
      let progress = 0;
      if (ach.category === 'reading' && ach.title.includes('Marathon')) progress = stats.pages;
      else if (ach.category === 'reading') progress = stats.finished;
      else if (ach.category === 'collections' && ach.title.includes('Rak')) progress = stats.shelves;
      else if (ach.category === 'collections') progress = stats.total;
      else if (ach.title.includes('Genre')) progress = stats.genres;
      else if (ach.title.includes('Bintang') || ach.title.includes('Sempurna')) progress = stats.fiveStar;
      else if (ach.title.includes('Favorit') || ach.title.includes('Setia')) progress = stats.favs;
      else if (ach.title.includes('Wishlist') || ach.title.includes('Pemimpi')) progress = stats.wishlist;
      else if (ach.title.includes('Kritikus')) progress = stats.rated;
      else if (ach.category === 'books') progress = stats.total;
      
      const isUnlocked = ach.user_progress?.unlocked || false;

      return {
        id: ach.id,
        title: ach.title,
        description: ach.description,
        icon: iconMap[ach.icon] || Trophy,
        category: ach.category === 'special' ? 'special' : ach.category === 'collections' ? 'collection' : 'milestone',
        target: ach.requirement,
        progress,
        unlocked: isUnlocked,
        color: colorMap[ach.rarity] || colorMap.common
      }
    })
  }, [apiAchievements, stats])

  // Optional: Auto-unlock achievements if progress >= target
  useEffect(() => {
    achievementsList.forEach(ach => {
      if (!ach.unlocked && ach.progress >= ach.target) {
        unlockMutation.mutate(ach.id);
      }
    })
  }, [achievementsList])

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
