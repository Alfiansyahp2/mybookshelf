import { useEffect } from 'react'
import { useBooks } from './useBooks'
import { useShelves } from './useShelves'
import { useNotifications } from './useNotifications'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AchievementState {
  unlockedIds: string[]
  unlock: (id: string) => boolean // returns true if newly unlocked
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      unlock: (id: string) => {
        const { unlockedIds } = get()
        if (unlockedIds.includes(id)) return false
        set({ unlockedIds: [...unlockedIds, id] })
        return true
      }
    }),
    { name: 'mybookshelf_achievements' }
  )
)

export function useAchievementTracker() {
  const { data: booksResponse } = useBooks()
  const { data: shelves = [] } = useShelves()
  const { unlock } = useAchievementStore()
  const { addNotification } = useNotifications()

  const books = booksResponse?.data?.data || []

  useEffect(() => {
    if (!books.length && !shelves.length) return

    const checkAchievement = (id: string, title: string, message: string, condition: boolean) => {
      if (condition) {
        const isNew = unlock(id)
        if (isNew) {
          addNotification({
            title: 'Pencapaian Baru!',
            message: `${title} - ${message}`,
            type: 'achievement',
            link: '/achievements'
          })
        }
      }
    }

    const totalBooks = books.length
    const finishedBooks = books.filter(b => b.status === 'finished')
    const wishlistBooks = books.filter(b => b.status === 'wishlist')
    const favoriteBooks = books.filter(b => b.favorite || b.isFavorite)
    const ratedBooks = books.filter(b => b.personalRating > 0)
    const fiveStarBooks = books.filter(b => b.personalRating === 5)
    
    const pagesRead = finishedBooks.reduce((sum, b) => sum + (b.pages || b.totalPages || 0), 0)
    const genres = new Set(books.filter(b => b.genre).map(b => b.genre))

    // 1. Langkah Pertama (Add 1 book)
    checkAchievement('first-book', 'Langkah Pertama', 'Kamu telah menambahkan buku pertama ke perpustakaanmu!', totalBooks >= 1)
    
    // 2. Kutu Buku (Finish 5 books)
    checkAchievement('kutu-buku-1', 'Kutu Buku Pemula', 'Berhasil menyelesaikan 5 buku.', finishedBooks.length >= 5)
    checkAchievement('kutu-buku-2', 'Kutu Buku Pro', 'Berhasil menyelesaikan 20 buku!', finishedBooks.length >= 20)

    // 3. Kolektor (Add 20 books)
    checkAchievement('kolektor', 'Kolektor', 'Perpustakaanmu kini memiliki 20 buku.', totalBooks >= 20)
    checkAchievement('kolektor-master', 'Master Kolektor', 'Luar biasa, kamu memiliki 50 buku!', totalBooks >= 50)

    // 4. Ahli Genre (Read 3 different genres)
    checkAchievement('ahli-genre', 'Eksplorator Genre', 'Membaca buku dari 3 genre yang berbeda.', genres.size >= 3)
    checkAchievement('master-genre', 'Master Genre', 'Membaca buku dari 7 genre yang berbeda.', genres.size >= 7)

    // 5. Perpustakaan Pribadi (Create 3 shelves)
    checkAchievement('arsitek-rak', 'Arsitek Rak', 'Membuat 3 rak berbeda untuk koleksimu.', shelves.length >= 3)

    // 6. Pemilih Selektif (Give 5-star rating)
    checkAchievement('kurator', 'Kurator Sempurna', 'Memberikan rating bintang 5 pada sebuah buku.', fiveStarBooks.length >= 1)

    // 7. Kritikus (Review/Rate 5 books)
    checkAchievement('kritikus', 'Kritikus Sastra', 'Memberikan rating pada 5 buku.', ratedBooks.length >= 5)

    // 8. Marathon (Read 1000 pages)
    checkAchievement('marathon', 'Marathon Membaca', 'Telah membaca lebih dari 1.000 halaman.', pagesRead >= 1000)
    checkAchievement('marathon-ultra', 'Ultra Marathon', 'Telah membaca lebih dari 5.000 halaman!', pagesRead >= 5000)

    // 9. Penggemar (Add 5 favorites)
    checkAchievement('penggemar', 'Penggemar Setia', 'Menandai 5 buku sebagai favorit.', favoriteBooks.length >= 5)

    // 10. Daftar Keinginan
    checkAchievement('pemimpi', 'Sang Pemimpi', 'Menambahkan 5 buku ke Wishlist.', wishlistBooks.length >= 5)

  }, [books, shelves, unlock, addNotification])
}
