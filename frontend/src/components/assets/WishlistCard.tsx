import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import type { Book } from '../../types'

interface WishlistCardProps {
  book: Book
  index: number
  onClick: (book: Book) => void
  t: (key: string, defaultText: string) => string
}

export default function WishlistCard({ book, index, onClick, t }: WishlistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onClick(book)}
      className="group bg-white rounded-2xl p-5 border border-walnut/10 hover:border-walnut/30 hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Book Cover Placeholder */}
      <div className="w-full aspect-video rounded-xl mb-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-walnut/5 to-walnut/10 border border-walnut/10 group-hover:shadow-inner transition-all">
        <div className="text-center p-4 z-10 w-full">
          <div className="text-lg font-serif font-bold text-darkBrown leading-tight mb-2 line-clamp-3">{book.title}</div>
          <div className="text-sm font-medium text-walnut/80 line-clamp-2">{book.author}</div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

      {/* Book Info */}
      <div className="flex-1 flex flex-col">
        <div className="space-y-3 mt-auto">
          <div className="flex items-start justify-between text-sm gap-2">
            <span className="text-walnut/60 shrink-0">{t('wishlist.genre', 'Genre')}</span>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {book.genre ? book.genre.split(',').map((g: string, i: number) => (
                <span key={i} className="font-medium text-[11px] text-darkBrown bg-walnut/10 px-2 py-0.5 rounded-full">
                  {g.trim()}
                </span>
              )) : (
                <span className="font-medium text-darkBrown">-</span>
              )}
            </div>
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
}
