import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { UIState } from '../types'

interface BookStore extends UIState {
  // UI-only state (no data persistence)
  selectedBookId: string | null
  isBookDetailOpen: boolean
  sidebarCollapsed: boolean
  searchQuery: string
  activeFilter: UIState['activeFilter']

  // UI Actions
  setSelectedBookId: (id: string | null) => void
  toggleBookDetail: (bookId?: string) => void
  closeBookDetail: () => void
  setSearchQuery: (query: string) => void
  setActiveFilter: (filter: UIState['activeFilter']) => void
  toggleSidebar: () => void
}

export const useBookstore = create<BookStore>()(
  devtools(
    (set) => ({
      // Initial UI state
      selectedBookId: null,
      isBookDetailOpen: false,
      sidebarCollapsed: false,
      searchQuery: '',
      activeFilter: 'all',

      // UI Actions
      setSelectedBookId: (id) => set({ selectedBookId: id }),

      toggleBookDetail: (bookId) => set((state) => {
        if (bookId) {
          return {
            selectedBookId: bookId,
            isBookDetailOpen: true
          }
        }
        return {
          isBookDetailOpen: !state.isBookDetailOpen
        }
      }),

      closeBookDetail: () => set({
        isBookDetailOpen: false,
        selectedBookId: null
      }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setActiveFilter: (filter) => set({ activeFilter: filter }),

      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      }))
    }),
    {
      name: 'mybookshelf-ui-store'
    }
  )
)
