import { useBooks } from '../hooks/useBooks'
import { useShelves } from '../hooks/useShelves'
import { useStartReading } from '../hooks/useBooks'
import { useNavigate } from 'react-router-dom'
import { useBookstore } from '../store/useBookstore'
import Bookshelf from '../components/Bookshelf'
import AddWishlistBookModal from '../components/AddWishlistBookModal'
import { useState } from 'react'
import type { Book } from '../types'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ShoppingCart,
  Heart,
  Clock,
  BookOpen,
  Target,
  Gift,
  Plus
} from 'lucide-react'

export default function Wishlist() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedBookId, isBookDetailOpen, toggleBookDetail, setSelectedBookId } = useBookstore()
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [addShelfId, setAddShelfId] = useState<string | undefined>()
  const [addShelfName, setAddShelfName] = useState<string | undefined>()

  // Fetch all books and shelves from API
  const { data: allBooksResponse, isLoading } = useBooks({})
  const { data: shelves = [], isLoading: shelvesLoading } = useShelves()
  const startReadingMutation = useStartReading()

  const allBooks = allBooksResponse?.data?.data || []
  const wishlistBooks = allBooks.filter((book: Book) => book.status === 'wishlist')

  // Calculate wishlist statistics
  const totalWishlist = wishlistBooks.length
  
  const genresCount = wishlistBooks.reduce((acc: any, book: Book) => {
    if (book.genre) {
       book.genre.split(',').map((g: string) => g.trim()).forEach((g: string) => {
         if (g) acc[g] = (acc[g] || 0) + 1;
       })
    }
    return acc;
  }, {});
  const topGenre = Object.keys(genresCount).sort((a, b) => genresCount[b] - genresCount[a])[0] || '-';

  const authorsCount = wishlistBooks.reduce((acc: any, book: Book) => {
    if (book.author) {
       acc[book.author] = (acc[book.author] || 0) + 1;
    }
    return acc;
  }, {});
  const topAuthor = Object.keys(authorsCount).sort((a, b) => authorsCount[b] - authorsCount[a])[0] || '-';

  const handleStartReading = (bookId: string) => {
    startReadingMutation.mutate(bookId)
  }

  const handleBookClick = (book: any) => {
    setSelectedBookId(book.id)
    toggleBookDetail(book.id)
  }

  const handleAddBook = (shelfId: string, shelfName?: string) => {
    setAddShelfId(shelfId)
    setAddShelfName(shelfName)
    setIsAddBookModalOpen(true)
  }

  // Loading state
  if (isLoading || shelvesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-walnut">{t('wishlist.loading', 'Loading wishlist...')}</div>
      </div>
    )
  }

  return (
    <div 
      className="p-4 md:p-8 flex flex-col h-full min-h-screen relative"
      style={{
        background: 'linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)',
      }}
    >
      {/* Plaster / linen wall texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', opacity:0.18,
        backgroundImage:`
          repeating-linear-gradient(0deg,  transparent, transparent 5px, rgba(0,0,0,0.02) 5px, rgba(0,0,0,0.02) 6px),
          repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px)
        `,
      }} />
      <div className="max-w-7xl mx-auto w-full relative z-10">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-darkBrown">
              {t('wishlist.title', 'Wishlist')}
            </h1>
            
            {/* Minimalist Count Badge */}
            {totalWishlist > 0 && (
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-walnut/10 shadow-sm text-sm">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span className="font-bold text-darkBrown">{totalWishlist}</span>
              </div>
            )}
          </div>
          
          <p className="text-walnut/70">
            {t('wishlist.subtitle', 'Books you are planning to acquire - {{count}} item{{s}}', { count: totalWishlist, s: totalWishlist !== 1 ? 's' : '' })}
          </p>
        </div>

        {/* Add to Wishlist Button */}
        <button
          onClick={() => setIsAddBookModalOpen(true)}
          className="px-6 py-2.5 bg-walnut text-white rounded-xl font-medium hover:bg-darkBrown transition-colors shadow-sm hover:shadow-md flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          {t('wishlist.add_to_wishlist', 'Add Book')}
        </button>
      </div>

      {/* Wishlist Books Grid */}
      {totalWishlist > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistBooks.map((book: Book, index: number) => {
              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleBookClick(book)}
                  className="group bg-white rounded-2xl p-5 border border-walnut/10 hover:border-walnut/30 hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
                >
                  {/* Book Cover Placeholder */}
                  <div className="w-full aspect-[2/3] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-walnut/5 to-walnut/10 border border-walnut/10 group-hover:shadow-inner transition-all">
                    <div className="text-center p-4 z-10 w-full">
                      <div className="text-lg font-serif font-bold text-darkBrown leading-tight mb-2 line-clamp-3">{book.title}</div>
                      <div className="text-sm font-medium text-walnut/80 line-clamp-2">{book.author}</div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/5 to-transparent"></div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-walnut/60">{t('wishlist.genre', 'Genre')}</span>
                        <span className="font-medium text-darkBrown bg-walnut/5 px-2 py-0.5 rounded-md truncate max-w-[120px]">{book.genre || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-walnut/60">{t('wishlist.pages', 'Pages')}</span>
                        <span className="font-medium text-darkBrown">{book.pages || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-walnut/60">{t('wishlist.format', 'Format')}</span>
                        <span className="font-medium text-darkBrown capitalize">{book.format || '-'}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-5 pt-4 border-t border-walnut/10">
                      <div className="w-full py-2.5 bg-cream group-hover:bg-walnut group-hover:text-white text-walnut rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4" />
                        {t('wishlist.view_details', 'View Details')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {totalWishlist === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-walnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-walnut/30" />
          </div>
          <h3 className="text-xl font-serif text-darkBrown mb-2">
            {t('wishlist.empty', 'Your wishlist is empty')}
          </h3>
          <p className="text-walnut/70 mb-6">
            {t('wishlist.empty_desc', 'Save books you want to read later')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-walnut text-white rounded-xl font-medium hover:bg-darkBrown transition-colors"
            >
              {t('wishlist.browse_library', 'Browse Library')}
            </button>
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="px-6 py-3 bg-white text-walnut rounded-xl font-medium hover:bg-walnut/10 transition-colors border border-walnut/20"
            >
              {t('wishlist.add_to_wishlist', 'Add to Wishlist')}
            </button>
          </div>
        </motion.div>
      )}
      
      <AddWishlistBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => {
          setIsAddBookModalOpen(false)
          setAddShelfId(undefined)
          setAddShelfName(undefined)
        }}
      />
      </div>
    </div>
  )
}
