import { useEffect, useState } from 'react'
import { useBookstore } from '../store/useBookstore'
import { motion } from 'framer-motion'
import {
  Trophy,
  Target,
  BookOpen,
  Star,
  Award,
  Flame,
  Zap,
  Heart,
  Bookmark,
  BookMarked,
  Medal,
  Crown,
  Sparkles
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  color: string
  unlocked: boolean
  progress?: number
  target?: number
  category: 'milestone' | 'streak' | 'special' | 'goal'
  unlockedDate?: string
}

export default function Achievements() {
  const { books, getBooksByStatus } = useBookstore()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    totalPagesRead: 0,
    favoriteBooks: 0,
    readingStreak: 0,
    genresRead: new Set<string>()
  })

  useEffect(() => {
    // Calculate statistics
    const finishedBooks = getBooksByStatus('finished')
    const totalBooks = books.length
    const totalPagesRead = finishedBooks.reduce((sum, book) => sum + (book.pages || 0), 0)
    const favoriteBooks = books.filter(b => b.favorite).length
    const genresRead = new Set(books.map(b => b.genre))

    setStats({
      totalBooks,
      booksRead: finishedBooks.length,
      totalPagesRead,
      favoriteBooks,
      readingStreak: 0, // TODO: Calculate from reading sessions
      genresRead
    })

    // Generate achievements based on stats
    const generateAchievements = (): Achievement[] => {
      const achievementsList: Achievement[] = []

      // Milestone Achievements
      achievementsList.push({
        id: 'first-book',
        title: 'First Book',
        description: 'Add your first book to the library',
        icon: BookOpen,
        color: 'from-green-500 to-green-600',
        unlocked: totalBooks >= 1,
        category: 'milestone'
      })

      achievementsList.push({
        id: 'book-collector-10',
        title: 'Book Collector',
        description: 'Collect 10 books in your library',
        icon: Trophy,
        color: 'from-blue-500 to-blue-600',
        unlocked: totalBooks >= 10,
        progress: totalBooks,
        target: 10,
        category: 'milestone'
      })

      achievementsList.push({
        id: 'book-collector-50',
        title: 'Serious Collector',
        description: 'Collect 50 books in your library',
        icon: Crown,
        color: 'from-purple-500 to-purple-600',
        unlocked: totalBooks >= 50,
        progress: totalBooks,
        target: 50,
        category: 'milestone'
      })

      achievementsList.push({
        id: 'first-finish',
        title: 'First Completion',
        description: 'Finish reading your first book',
        icon: Target,
        color: 'from-green-500 to-green-600',
        unlocked: finishedBooks.length >= 1,
        category: 'milestone'
      })

      achievementsList.push({
        id: 'page-master-1000',
        title: 'Page Master',
        description: 'Read 1,000 pages total',
        icon: BookMarked,
        color: 'from-indigo-500 to-indigo-600',
        unlocked: totalPagesRead >= 1000,
        progress: totalPagesRead,
        target: 1000,
        category: 'milestone'
      })

      achievementsList.push({
        id: 'page-master-10000',
        title: 'Reading Marathon',
        description: 'Read 10,000 pages total',
        icon: Zap,
        color: 'from-red-500 to-red-600',
        unlocked: totalPagesRead >= 10000,
        progress: totalPagesRead,
        target: 10000,
        category: 'milestone'
      })

      // Special Achievements
      achievementsList.push({
        id: 'fan-favorite',
        title: 'Fan Favorite',
        description: 'Have 5 books marked as favorites',
        icon: Heart,
        color: 'from-pink-500 to-pink-600',
        unlocked: favoriteBooks >= 5,
        progress: favoriteBooks,
        target: 5,
        category: 'special'
      })

      achievementsList.push({
        id: 'genre-explorer',
        title: 'Genre Explorer',
        description: 'Read books from 5 different genres',
        icon: Sparkles,
        color: 'from-amber-500 to-amber-600',
        unlocked: genresRead.size >= 5,
        progress: genresRead.size,
        target: 5,
        category: 'special'
      })

      // Reading Streaks (placeholder for future implementation)
      achievementsList.push({
        id: 'reading-streak-7',
        title: 'Week Warrior',
        description: 'Read for 7 days in a row',
        icon: Flame,
        color: 'from-orange-500 to-orange-600',
        unlocked: false,
        progress: stats.readingStreak,
        target: 7,
        category: 'streak'
      })

      achievementsList.push({
        id: 'reading-streak-30',
        title: 'Monthly Master',
        description: 'Read for 30 days in a row',
        icon: Medal,
        color: 'from-yellow-500 to-yellow-600',
        unlocked: false,
        progress: stats.readingStreak,
        target: 30,
        category: 'streak'
      })

      return achievementsList
    }

    setAchievements(generateAchievements())
  }, [books, getBooksByStatus])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const lockedCount = achievements.length - unlockedCount

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-darkBrown mb-2">
          Achievements
        </h1>
        <p className="text-walnut/70">
          Track your reading milestones and celebrate your progress
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-darkBrown">{unlockedCount}</div>
              <div className="text-sm text-walnut/70">Unlocked</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-walnut to-darkBrown flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-darkBrown">{lockedCount}</div>
              <div className="text-sm text-walnut/70">Locked</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-darkBrown">
                {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
              </div>
              <div className="text-sm text-walnut/70">Complete</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-darkBrown">{stats.totalBooks}</div>
              <div className="text-sm text-walnut/70">Total Books</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon
          const progress = achievement.target && achievement.progress
            ? Math.min((achievement.progress / achievement.target) * 100, 100)
            : 0

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-6 border shadow-sm relative overflow-hidden ${
                achievement.unlocked
                  ? 'border-walnut/10 shadow-md'
                  : 'border-walnut/20 opacity-75'
              }`}
            >
              {/* Background Gradient for Unlocked */}
              {achievement.unlocked && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-10`}
                />
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative z-10 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color}`
                  : 'bg-walnut/20'
              }`}>
                <Icon
                  className={`w-8 h-8 ${
                    achievement.unlocked ? 'text-white' : 'text-walnut/40'
                  }`}
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-lg font-semibold ${
                    achievement.unlocked ? 'text-darkBrown' : 'text-walnut/70'
                  }`}>
                    {achievement.title}
                  </h3>
                  {achievement.unlocked && (
                    <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Unlocked
                    </div>
                  )}
                </div>

                <p className={`text-sm mb-4 ${
                  achievement.unlocked ? 'text-walnut/80' : 'text-walnut/60'
                }`}>
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {achievement.target && !achievement.unlocked && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-walnut/60">Progress</span>
                      <span className="font-medium text-darkBrown">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <div className="h-2 bg-walnut/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          achievement.unlocked
                            ? 'bg-green-500'
                            : `bg-gradient-to-r ${achievement.color}`
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-walnut/10 rounded-full text-xs text-walnut/70">
                  <span className="capitalize">{achievement.category}</span>
                </div>

                {/* Unlocked Date */}
                {achievement.unlockedDate && (
                  <div className="mt-3 text-xs text-walnut/60">
                    Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Locked Overlay */}
              {!achievement.unlocked && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="w-12 h-12 rounded-full bg-walnut/10 flex items-center justify-center">
                    <Bookmark className="w-6 h-6 text-walnut/40" />
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {achievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-walnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-walnut/30" />
          </div>
          <h3 className="text-xl font-serif text-darkBrown mb-2">
            No achievements yet
          </h3>
          <p className="text-walnut/70">
            Start reading to unlock achievements and track your progress
          </p>
        </motion.div>
      )}
    </div>
  )
}
