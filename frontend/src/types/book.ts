// Book Types
export type BookStatus = 'unread' | 'reading' | 'finished' | 'wishlist' | 'borrowed'
export type BookHeight = 'short' | 'medium' | 'tall'
export type BookThickness = 'thin' | 'regular' | 'thick'
export type BookFormat = 'hardcover' | 'paperback' | 'ebook' | 'audiobook'

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  genre: string
  language: string
  publisher: string
  publishYear: number
  pages: number
  format: BookFormat

  // Visual properties
  spineColors: [string, string, string] // [light, medium, dark]
  height: BookHeight
  thickness: BookThickness
  coverImage?: string

  // Status & Progress
  status: BookStatus
  favorite: boolean
  isFavorite: boolean // Alias for favorite
  currentPage?: number
  progress?: number

  // Reading
  startedDate?: string
  finishedDate?: string
  estimatedStartDate?: string

  // Borrowing
  borrowedBy?: string
  borrowedDate?: string
  dueDate?: string
  isReturned?: boolean

  // Personal notes and rating
  personalNotes?: string
  personalRating?: number

  // Purchase info
  purchaseDate?: string
  purchasePrice?: number
  purchaseLocation?: string

  // Location on shelf
  shelfId?: string
  position?: number

  // Metadata
  dateAdded: string
  lastModified: string
}

// Reading Session
export interface ReadingSession {
  id: string
  bookId: string
  startTime: string
  endTime?: string
  startPage: number
  endPage?: number
  duration?: number // in seconds
  notes?: string
  mood?: 'great' | 'good' | 'okay' | 'difficult'
  location?: string
}

// Book Timeline Event
export interface TimelineEvent {
  id: string
  bookId: string
  type: 'added' | 'started' | 'progress' | 'finished' | 'favorited' | 'loaned' | 'returned'
  date: string
  description: string
  metadata?: Record<string, any>
}
