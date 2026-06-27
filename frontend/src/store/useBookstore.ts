import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Book, ReadingSession, UIState, BookStatus, Shelf } from '../types'

interface BookStore extends UIState {
  // State
  books: Book[]
  readingSessions: ReadingSession[]
  selectedBook: Book | null
  shelves: Shelf[]

  // Actions
  setSelectedBookId: (id: string | null) => void
  toggleBookDetail: (bookId?: string) => void
  closeBookDetail: () => void

  // Book actions
  addBook: (book: Omit<Book, 'id' | 'dateAdded' | 'lastModified'>) => void
  updateBook: (id: string, updates: Partial<Book>) => void
  deleteBook: (id: string) => void
  toggleFavorite: (id: string) => void

  // Personal notes and ratings
  updatePersonalNotes: (bookId: string, notes: string) => void
  updatePersonalRating: (bookId: string, rating: number) => void

  // Borrow/Loan actions
  borrowBook: (bookId: string, borrowerName: string, dueDate: string) => void
  returnBook: (bookId: string) => void
  loanBook: (bookId: string) => void

  // Shelf actions
  addShelf: (shelf: Omit<Shelf, 'id'>) => void
  updateShelf: (id: string, updates: Partial<Shelf>) => void
  deleteShelf: (id: string) => void
  moveBookToShelf: (bookId: string, targetShelfId: string, newPosition?: number) => void

  // Reading actions
  startReading: (bookId: string) => void
  finishReading: (bookId: string) => void
  updateProgress: (bookId: string, currentPage: number) => void

  // Filter & search
  setSearchQuery: (query: string) => void
  setActiveFilter: (filter: UIState['activeFilter']) => void

  // Computed
  getFilteredBooks: () => Book[]
  getBooksByStatus: (status: BookStatus) => Book[]
  getReadingTime: (bookId: string) => { days: number; hours: number; minutes: number; seconds: number }
}

export const useBookstore = create<BookStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        selectedBookId: null,
        isBookDetailOpen: false,
        sidebarCollapsed: false,
        searchQuery: '',
        activeFilter: 'all',
        books: [],
        readingSessions: [],
        selectedBook: null,
        shelves: [],

        // Actions
        setSelectedBookId: (id) => set({ selectedBookId: id }),

        toggleBookDetail: (bookId) => set((state) => {
          if (bookId) {
            const book = state.books.find(b => b.id === bookId)
            return {
              selectedBookId: bookId,
              selectedBook: book || null,
              isBookDetailOpen: true
            }
          }
          return {
            isBookDetailOpen: !state.isBookDetailOpen
          }
        }),

        closeBookDetail: () => set({
          isBookDetailOpen: false,
          selectedBookId: null,
          selectedBook: null
        }),

        addBook: (bookData) => set((state) => {
          const newBook: Book = {
            ...bookData,
            id: crypto.randomUUID(),
            dateAdded: new Date().toISOString(),
            lastModified: new Date().toISOString()
          }
          return {
            books: [...state.books, newBook]
          }
        }),

        updateBook: (id, updates) => set((state) => ({
          books: state.books.map(book =>
            book.id === id
              ? { ...book, ...updates, lastModified: new Date().toISOString() }
              : book
          ),
          selectedBook: state.selectedBook?.id === id
            ? { ...state.selectedBook, ...updates, lastModified: new Date().toISOString() }
            : state.selectedBook
        })),

        deleteBook: (id) => set((state) => ({
          books: state.books.filter(book => book.id !== id)
        })),

        // Shelf actions
        addShelf: (shelfData) => set((state) => {
          const newShelf: Shelf = {
            ...shelfData,
            id: crypto.randomUUID(),
            order: state.shelves.length
          }
          return {
            shelves: [...state.shelves, newShelf]
          }
        }),

        updateShelf: (id, updates) => set((state) => ({
          shelves: state.shelves.map(shelf =>
            shelf.id === id
              ? { ...shelf, ...updates }
              : shelf
          )
        })),

        deleteShelf: (id) => set((state) => ({
          shelves: state.shelves.filter(shelf => shelf.id !== id)
        })),

        moveBookToShelf: (bookId, targetShelfId, newPosition) => set((state) => {
          // Get the book being moved
          const book = state.books.find(b => b.id === bookId)
          if (!book) return state

          // Get books in target shelf to determine position
          const targetShelfBooks = state.books.filter(b => b.shelfId === targetShelfId && b.id !== bookId)
          const position = newPosition !== undefined ? newPosition : targetShelfBooks.length

          return {
            books: state.books.map(b =>
              b.id === bookId
                ? {
                    ...b,
                    shelfId: targetShelfId,
                    position: position,
                    lastModified: new Date().toISOString()
                  }
                : b
            ),
            selectedBook: state.selectedBook?.id === bookId
              ? { ...state.selectedBook, shelfId: targetShelfId, position: position, lastModified: new Date().toISOString() }
              : state.selectedBook
          }
        }),

        toggleFavorite: (id) => set((state) => ({
          books: state.books.map(book =>
            book.id === id
              ? { ...book, favorite: !book.favorite, lastModified: new Date().toISOString() }
              : book
          ),
          selectedBook: state.selectedBook?.id === id
            ? { ...state.selectedBook, favorite: !state.selectedBook.favorite, lastModified: new Date().toISOString() }
            : state.selectedBook
        })),

        startReading: (bookId) => set((state) => ({
          books: state.books.map(book =>
            book.id === bookId
              ? {
                  ...book,
                  status: 'reading' as const,
                  startedDate: new Date().toISOString(),
                  lastModified: new Date().toISOString()
                }
              : book
          )
        })),

        finishReading: (bookId) => set((state) => ({
          books: state.books.map(book =>
            book.id === bookId
              ? {
                  ...book,
                  status: 'finished' as const,
                  finishedDate: new Date().toISOString(),
                  progress: 100,
                  currentPage: book.pages,
                  lastModified: new Date().toISOString()
                }
              : book
          )
        })),

        updateProgress: (bookId, currentPage) => set((state) => {
          const book = state.books.find(b => b.id === bookId)
          if (!book) return state

          const progress = Math.round((currentPage / book.pages) * 100)

          return {
            books: state.books.map(b =>
              b.id === bookId
                ? {
                    ...b,
                    currentPage,
                    progress,
                    lastModified: new Date().toISOString()
                  }
                : b
            )
          }
        }),

        // Personal notes and ratings
        updatePersonalNotes: (bookId, notes) => set((state) => ({
          books: state.books.map(book =>
            book.id === bookId
              ? { ...book, personalNotes: notes, lastModified: new Date().toISOString() }
              : book
          ),
          selectedBook: state.selectedBook?.id === bookId
            ? { ...state.selectedBook, personalNotes: notes, lastModified: new Date().toISOString() }
            : state.selectedBook
        })),

        updatePersonalRating: (bookId, rating) => set((state) => ({
          books: state.books.map(book =>
            book.id === bookId
              ? { ...book, personalRating: rating, lastModified: new Date().toISOString() }
              : book
          ),
          selectedBook: state.selectedBook?.id === bookId
            ? { ...state.selectedBook, personalRating: rating, lastModified: new Date().toISOString() }
            : state.selectedBook
        })),

        // Borrow/Loan actions
        borrowBook: (bookId, borrowerName, dueDate) => set((state) => ({
          books: state.books.map(book =>
            book.id === bookId
              ? {
                  ...book,
                  status: 'borrowed' as const,
                  borrowedBy: borrowerName,
                  borrowedDate: new Date().toISOString(),
                  dueDate: dueDate,
                  isReturned: false,
                  lastModified: new Date().toISOString()
                }
              : book
          ),
          selectedBook: state.selectedBook?.id === bookId
            ? {
                ...state.selectedBook,
                status: 'borrowed' as const,
                borrowedBy: borrowerName,
                borrowedDate: new Date().toISOString(),
                dueDate: dueDate,
                isReturned: false,
                lastModified: new Date().toISOString()
              }
            : state.selectedBook
        })),

        returnBook: (bookId) => set((state) => {
          const book = state.books.find(b => b.id === bookId)
          if (!book) return state

          return {
            books: state.books.map(b =>
              b.id === bookId
                ? {
                    ...b,
                    status: 'unread' as const,
                    isReturned: true,
                    borrowedBy: undefined,
                    borrowedDate: undefined,
                    dueDate: undefined,
                    lastModified: new Date().toISOString()
                  }
                : b
            ),
            selectedBook: state.selectedBook?.id === bookId
              ? {
                  ...state.selectedBook,
                  status: 'unread' as const,
                  isReturned: true,
                  borrowedBy: undefined,
                  borrowedDate: undefined,
                  dueDate: undefined,
                  lastModified: new Date().toISOString()
                }
              : state.selectedBook
          }
        }),

        loanBook: (bookId) => set((state) => ({
          books: state.books.map(book =>
            book.id === bookId
              ? {
                  ...book,
                  status: 'borrowed' as const,
                  borrowedDate: new Date().toISOString(),
                  lastModified: new Date().toISOString()
                }
              : book
          ),
          selectedBook: state.selectedBook?.id === bookId
            ? {
                ...state.selectedBook,
                status: 'borrowed' as const,
                borrowedDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
              }
            : state.selectedBook
        })),

        setSearchQuery: (query) => set({ searchQuery: query }),

        setActiveFilter: (filter) => set({ activeFilter: filter }),

        // Computed getters
        getFilteredBooks: () => {
          const state = get()
          let filtered = [...state.books]

          // Apply status filter
          if (state.activeFilter !== 'all') {
            filtered = filtered.filter(book => book.status === state.activeFilter)
          }

          // Apply search
          if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase()
            filtered = filtered.filter(book =>
              book.title.toLowerCase().includes(query) ||
              book.author.toLowerCase().includes(query) ||
              book.genre.toLowerCase().includes(query) ||
              book.isbn.includes(query)
            )
          }

          return filtered
        },

        getBooksByStatus: (status) => {
          return get().books.filter(book => book.status === status)
        },

        getReadingTime: (bookId) => {
          const book = get().books.find(b => b.id === bookId)
          if (!book?.startedDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

          const start = new Date(book.startedDate)
          const now = new Date()
          const diff = now.getTime() - start.getTime()

          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          return { days, hours, minutes, seconds }
        }
      }),
      {
        name: 'mybookshelf-storage',
        partialize: (state) => ({
          books: state.books,
          sidebarCollapsed: state.sidebarCollapsed
        })
      }
    )
  )
)
