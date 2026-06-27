import type { Book } from './book'
import type { Shelf, Room } from './shelf'
import type { Collection, Achievement, ReadingStatistics } from './collection'
import type { ReadingSession } from './book'

// App State Types
export interface AppState {
  books: Book[]
  shelves: Shelf[]
  rooms: Room[]
  collections: Collection[]
  achievements: Achievement[]
  readingSessions: ReadingSession[]
  statistics: ReadingStatistics | null
}

// UI State Types
export interface UIState {
  selectedBookId: string | null
  isBookDetailOpen: boolean
  sidebarCollapsed: boolean
  searchQuery: string
  activeFilter: 'all' | 'unread' | 'reading' | 'finished' | 'wishlist' | 'borrowed'
}
