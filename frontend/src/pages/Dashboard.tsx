import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useBooks } from '../hooks/useBooks'
import {
  BookOpen,
  Library,
  TrendingUp,
  Star,
  Bookmark,
  Users,
  Calendar,
  Award,
  Target,
  Activity,
  BookMarked,
  ArrowUp
} from 'lucide-react'
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function Dashboard() {
  const { data: booksResponse, isLoading } = useBooks()
  const books = booksResponse?.data?.data || []

  const [stats, setStats] = useState({
    totalBooks: 0,
    reading: 0,
    finished: 0,
    unread: 0,
    wishlist: 0,
    borrowed: 0,
    favorites: 0,
    totalPages: 0,
    pagesRead: 0,
    booksThisMonth: 0,
    mostReadGenre: '',
    averageRating: 0
  })

  const [chartData, setChartData] = useState({
    statusDistribution: [] as Array<{ name: string; value: number; color: string }>,
    monthlyReading: [] as Array<{ month: string; booksRead: number; pagesRead: number }>,
    genreDistribution: [] as Array<{ name: string; count: number }>,
    readingProgress: [] as Array<{ name: string; progress: number; pages: number; currentPage: number }>,
    pageVsRating: [] as Array<{ pages: number; rating: number | undefined; title: string }>,
    priceVsPages: [] as Array<{ name: string; high: number; low: number; open: number; close: number; volume: number }>
  })

  useEffect(() => {
    if (!books.length) return

    // Calculate all statistics
    const readingBooks = books.filter(b => b.status === 'reading')
    const finishedBooks = books.filter(b => b.status === 'finished')
    const unreadBooks = books.filter(b => b.status === 'unread')
    const wishlistBooks = books.filter(b => b.status === 'wishlist')
    const borrowedBooks = books.filter(b => b.status === 'borrowed')
    const favoriteBooks = books.filter(b => b.isFavorite)

    // Calculate total pages and pages read
    const totalPages = books.reduce((sum, book) => sum + (book.totalPages || book.pages || 0), 0)
    const pagesRead = finishedBooks.reduce((sum, book) => sum + (book.totalPages || book.pages || 0), 0) +
                      readingBooks.reduce((sum, book) => sum + (book.currentPage || 0), 0)

    // Calculate books added this month
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const booksThisMonth = books.filter(book => {
      const date = new Date(book.dateAdded)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    }).length

    // Calculate most read genre
    const genreCounts: Record<string, number> = {}
    finishedBooks.forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1
    })
    const mostReadGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    // Calculate average personal rating
    const ratedBooks = books.filter(b => b.personalRating && b.personalRating > 0)
    const averageRating = ratedBooks.length > 0
      ? ratedBooks.reduce((sum, book) => sum + (book.personalRating || 0), 0) / ratedBooks.length
      : 0

    setStats({
      totalBooks: books.length,
      reading: readingBooks.length,
      finished: finishedBooks.length,
      unread: unreadBooks.length,
      wishlist: wishlistBooks.length,
      borrowed: borrowedBooks.length,
      favorites: favoriteBooks.length,
      totalPages,
      pagesRead,
      booksThisMonth,
      mostReadGenre,
      averageRating: Math.round(averageRating * 10) / 10
    })

    // Prepare chart data
    setChartData({
      // Pie Chart Data - Book Status Distribution
      statusDistribution: [
        { name: 'Reading', value: readingBooks.length, color: '#10b981' },
        { name: 'Finished', value: finishedBooks.length, color: '#8b5cf6' },
        { name: 'Unread', value: unreadBooks.length, color: '#f59e0b' },
        { name: 'Wishlist', value: wishlistBooks.length, color: '#ec4899' },
        { name: 'Borrowed', value: borrowedBooks.length, color: '#ef4444' }
      ].filter(item => item.value > 0),

      // Line Chart Data - Monthly Reading Progress (Mock data for demo)
      monthlyReading: [
        { month: 'Jan', booksRead: 3, pagesRead: 450 },
        { month: 'Feb', booksRead: 5, pagesRead: 720 },
        { month: 'Mar', booksRead: 4, pagesRead: 580 },
        { month: 'Apr', booksRead: 6, pagesRead: 890 },
        { month: 'May', booksRead: 4, pagesRead: 620 },
        { month: 'Jun', booksRead: finishedBooks.length, pagesRead: pagesRead }
      ],

      // Bar Chart Data - Genre Distribution
      genreDistribution: Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),

      // Area Chart Data - Reading Progress Over Time
      readingProgress: books.slice(0, 8).map((book) => {
        const totalPages = book.totalPages || book.pages || 1
        const currentPage = book.currentPage || 0
        const progress = Math.round((currentPage / totalPages) * 100)
        return {
          name: book.title.substring(0, 10) + '...',
          progress,
          pages: totalPages,
          currentPage
        }
      }),

      // Scatter Plot Data - Pages vs Rating
      pageVsRating: books.filter(b => b.personalRating).map(book => ({
        pages: book.totalPages || book.pages || 0,
        rating: book.personalRating,
        title: book.title.substring(0, 15)
      })),

      // Candlestick Data - Price vs Pages (Mock trading-like data)
      priceVsPages: books.slice(0, 6).map((book) => {
        const pages = book.totalPages || book.pages || 0
        return {
          name: book.title.substring(0, 8),
          high: pages * 1.2,
          low: pages * 0.8,
          open: pages * 0.9,
          close: pages,
          volume: Math.floor(Math.random() * 100)
        }
      })
    })
  }, [books])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-walnut">Loading dashboard...</div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: Library,
      color: 'from-blue-500 to-blue-600',
      change: stats.booksThisMonth,
      changeType: 'increase'
    },
    {
      title: 'Currently Reading',
      value: stats.reading,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      change: null
    },
    {
      title: 'Finished',
      value: stats.finished,
      icon: Bookmark,
      color: 'from-purple-500 to-purple-600',
      change: null
    },
    {
      title: 'Borrowed Out',
      value: stats.borrowed,
      icon: Users,
      color: 'from-red-500 to-red-600',
      change: null
    },
    {
      title: 'Favorites',
      value: stats.favorites,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      change: null
    }
  ]

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-darkBrown mb-2">
          Dashboard
        </h1>
        <p className="text-walnut/70">
          Comprehensive analytics of your reading journey
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 md:p-6 border border-walnut/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-darkBrown mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-walnut/70">
                {stat.title}
              </div>
              {stat.change !== null && (
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <ArrowUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">+{stat.change}</span>
                  <span className="text-walnut/60">this month</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Pie Chart - Book Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <h3 className="text-lg font-serif font-semibold text-darkBrown mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Book Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.statusDistribution.map((entry, index) => (
                  <circle key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line Chart - Monthly Reading Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <h3 className="text-lg font-serif font-semibold text-darkBrown mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Reading Progress
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.monthlyReading}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#7A5C42" />
              <YAxis stroke="#7A5C42" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="booksRead" stroke="#8b5cf6" strokeWidth={2} name="Books Read" />
              <Line type="monotone" dataKey="pagesRead" stroke="#10b981" strokeWidth={2} name="Pages Read" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <h3 className="text-lg font-serif font-semibold text-darkBrown mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Genres
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.genreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#7A5C42" />
              <YAxis stroke="#7A5C42" />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" name="Books" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Area Chart - Reading Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <h3 className="text-lg font-serif font-semibold text-darkBrown mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Reading Progress
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData.readingProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#7A5C42" />
              <YAxis stroke="#7A5C42" />
              <Tooltip />
              <Area type="monotone" dataKey="progress" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Progress %" />
              <Area type="monotone" dataKey="pages" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Total Pages" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Scatter Plot - Pages vs Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <h3 className="text-lg font-serif font-semibold text-darkBrown mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Pages vs Rating
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" dataKey="pages" name="Pages" stroke="#7A5C42" />
              <YAxis type="number" dataKey="rating" name="Rating" stroke="#7A5C42" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={chartData.pageVsRating} fill="#ec4899" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Candlestick-style Chart - Pages Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <h3 className="text-lg font-serif font-semibold text-darkBrown mb-4 flex items-center gap-2">
            <BookMarked className="w-5 h-5" />
            Pages Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.priceVsPages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#7A5C42" />
              <YAxis stroke="#7A5C42" />
              <Tooltip />
              <Legend />
              <Bar dataKey="high" fill="#10b981" name="Max Pages" />
              <Bar dataKey="low" fill="#ef4444" name="Min Pages" />
              <Bar dataKey="close" fill="#8b5cf6" name="Actual Pages" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm"
        >
          <h2 className="text-xl font-serif font-semibold text-darkBrown mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Month
          </h2>
          <div className="text-center py-6">
            <div className="text-3xl font-bold text-darkBrown mb-2">
              {stats.booksThisMonth}
            </div>
            <p className="text-sm text-walnut/70">
              Books added
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-gradient-to-r from-walnut to-darkBrown rounded-2xl p-6 text-white"
        >
          <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Reading Goal
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-walnut/80">Books Read This Year</span>
            <span className="text-2xl font-bold">{stats.finished} / 12</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.finished / 12) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 1.4 }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <p className="text-sm text-walnut/80 mt-3">
            {stats.finished >= 12 ? '🎉 Goal achieved!' : `${12 - stats.finished} more books to reach your goal`}
          </p>
        </motion.div>
      </div>

      {/* Empty State */}
      {stats.totalBooks === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Library className="w-16 h-16 text-walnut/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-darkBrown mb-2">
            No books yet
          </h3>
          <p className="text-walnut/70 mb-6">
            Start building your library by adding your first book
          </p>
        </motion.div>
      )}
    </div>
  )
}
