import type { Book } from './book'

// Shelf Types
export interface Shelf {
  id: string
  name: string
  capacity: number
  order: number
  span: number
  roomId?: string
  decorations?: any[]
}

export interface Room {
  id: string
  name: string
  description: string
  shelves: Shelf[]
  order: number
  unlocked: boolean // Unlock when collection reaches certain size
}

export interface ShelfOccupancy {
  shelfId: string
  total: number
  occupied: number
  available: number
  percentage: number
}

// Book with shelf position
export interface BookOnShelf extends Book {
  shelfId: string
  position: number
  isBorrowedSlot?: boolean // If borrowed, shows empty slot
}
