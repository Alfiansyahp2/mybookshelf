// Collection Types
export interface Collection {
  id: string
  name: string
  description: string
  bookIds: string[]
  color: string
  icon?: string
  createdAt: string
  progress: number // percentage of books in this collection that are read
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: number
  current: number
  unlocked: boolean
  unlockedDate?: string
  category: 'books' | 'reading' | 'collections' | 'streaks' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// Reading Statistics
export interface ReadingStatistics {
  totalBooks: number
  booksRead: number
  currentlyReading: number
  unread: number
  wishlist: number
  loanedOut: number
  borrowed: number
  favorites: number

  // Time
  totalReadingTime: number // in seconds
  averageReadingTime: number // per book in seconds
  readingStreak: number // current streak in days
  longestStreak: number // in days

  // Pages
  totalPagesRead: number
  averagePagesPerDay: number

  // Finance
  totalSpent: number
  averageBookPrice: number

  // This month/year
  booksReadThisMonth: number
  booksReadThisYear: number
  pagesReadThisMonth: number
  pagesReadThisYear: number
  readingTimeThisMonth: number // in seconds
  readingTimeThisYear: number // in seconds

  // Genre distribution
  genreDistribution: Record<string, number>

  // Format distribution
  formatDistribution: Record<string, number>
}
