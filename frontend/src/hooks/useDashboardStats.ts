import { useMemo } from 'react';
import { BRAND, STATUS_CFG } from '../components/dashboard/DashboardWidgets';
import { BOOK_GENRES } from '../constants/genres';

export function useDashboardStats(books: any[]) {
  return useMemo(() => {
    const byStatus = (s: string) => books.filter((b: any) => b.status === s)
    const reading  = byStatus('reading')
    const finished = byStatus('finished')
    const unread   = byStatus('unread')
    const wishlist = byStatus('wishlist')
    const borrowed = byStatus('borrowed')
    const favs     = books.filter((b: any) => b.isFavorite || b.favorite)

    const now = new Date()

    const booksReadThisYear = books.filter((b: any) => {
      let isThisYear = false
      if (b.finishedDate) isThisYear = new Date(b.finishedDate).getFullYear() === now.getFullYear()
      if (!isThisYear && b.startedDate) isThisYear = new Date(b.startedDate).getFullYear() === now.getFullYear()
      if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
        isThisYear = b.readDates.some((d: string) => new Date(d).getFullYear() === now.getFullYear())
      }
      // Include books that are actively being read and don't have explicit dates but were updated this year
      if (!isThisYear && b.status === 'reading') {
         isThisYear = new Date(b.lastModified || b.dateAdded).getFullYear() === now.getFullYear()
      }
      return isThisYear
    })

    const totalPages = booksReadThisYear.reduce((s: number, b: any) => s + (b.pages || b.totalPages || 0), 0)
    const pagesRead = booksReadThisYear.reduce((s: number, b: any) => {
      if (b.status === 'finished') return s + (b.pages || b.totalPages || 0)
      return s + (b.currentPage || 0)
    }, 0)

    const addedThisMonth = books.filter((b: any) => {
      const d = new Date(b.dateAdded)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const finishedThisYear = finished.filter((b: any) => {
      let isThisYear = false
      if (b.finishedDate) {
        isThisYear = new Date(b.finishedDate).getFullYear() === now.getFullYear()
      }
      if (!isThisYear && b.readDates && Array.isArray(b.readDates)) {
        isThisYear = b.readDates.some((d: string) => new Date(d).getFullYear() === now.getFullYear())
      }
      return isThisYear
    }).length

    const genreCounts: Record<string, number> = {}
    books.forEach((b: any) => {
      if (b.genre) {
        const genres = b.genre.split(',').map((g: string) => g.trim()).filter(Boolean)
        genres.forEach((g: string) => {
          genreCounts[g] = (genreCounts[g] || 0) + 1
        })
      }
    })
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    const rated = books.filter((b: any) => Number(b.personalRating) > 0)
    const avgRating = rated.length ? (rated.reduce((s: number, b: any) => s + Number(b.personalRating), 0) / rated.length) : 0

    const currentlyReading = [
      ...reading.map((b: any) => ({
        id: b.id, title: b.title, author: b.author,
        pages: b.pages || b.totalPages || 1,
        currentPage: b.currentPage || 0,
        color: b.spineColors?.[0] || BRAND.walnut,
        status: 'reading' as const,
      })),
      ...unread.map((b: any) => ({
        id: b.id, title: b.title, author: b.author,
        pages: b.pages || b.totalPages || 0,
        currentPage: 0,
        color: b.spineColors?.[0] || BRAND.walnut,
        status: 'unread' as const,
      })),
    ]

    const recentBooks = [...books]
      .sort((a: any, b: any) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 3)

    const recentlyFinished = finished
      .sort((a: any, b: any) => new Date(b.finishedDate || 0).getTime() - new Date(a.finishedDate || 0).getTime())
      .slice(0, 4)

    const authorCounts: Record<string, number> = {}
    books.forEach((b: any) => { if (b.author) authorCounts[b.author] = (authorCounts[b.author] || 0) + 1 })

    return {
      total: books.length, reading: reading.length, finished: finished.length,
      unread: unread.length, wishlist: wishlist.length, borrowed: borrowed.length,
      favorites: favs.length, totalPages, pagesRead, addedThisMonth, topGenre,
      avgRating: Math.round(avgRating * 10) / 10,
      finishedThisYear, currentYear: now.getFullYear(),
      target: 12, // Annual reading target
      currentlyReading, recentBooks, recentlyFinished,
      genreChart: Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      authorChart: Object.entries(authorCounts)
        .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, count }))
        .sort((a, b) => b.count - a.count),
      statusPie: Object.entries(STATUS_CFG)
        .map(([k, v]) => ({ name: v.label, value: byStatus(k).length, color: v.color }))
        .filter(d => d.value > 0),
      bookColors: books.slice(0, 12).map((b: any) => b.spineColors?.[0] || '#8B7355'),
    }
  }, [books])
}
