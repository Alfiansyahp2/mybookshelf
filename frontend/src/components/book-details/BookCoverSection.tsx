import { BookOpen } from 'lucide-react'
import type { Book } from '../../types'

interface BookCoverSectionProps {
  book: Book
}

export default function BookCoverSection({ book }: BookCoverSectionProps) {
  // Safe colors
  const spineColor0 = book.spineColors?.[0] || '#8B7355'
  const spineColor1 = book.spineColors?.[1] || '#6B5344'
  const spineColor2 = book.spineColors?.[2] || '#5C4532'

  return (
    <div className="w-1/3 flex-shrink-0">
      {/* 3D Book Cover */}
      <div
        className="w-full aspect-[3/4] rounded-xl shadow-2xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${spineColor0} 0%, ${spineColor1} 50%, ${spineColor2} 100%)`
        }}
      >
        <div className="h-full p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-2 leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              {book.title}
            </h3>
            <p className="text-white/90 text-base" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              {book.author}
            </p>
          </div>

          {book.genre && (
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-white text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                {book.genre}
              </span>
            </div>
          )}

          {/* Shine Effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)'
            }}
          />
        </div>

        {/* Spine Effect */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 rounded-l-xl"
          style={{
            background: `linear-gradient(to right, ${spineColor2} 0%, ${spineColor1} 50%, ${spineColor0} 100%)`,
            boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      {/* Book Stats */}
      <div className="mt-4 space-y-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-darkBrown">{book.pages || 0}</div>
          <div className="text-xs text-walnut/70">Pages</div>
        </div>

        {book.publishYear && (
          <div className="text-center">
            <div className="text-3xl font-bold text-darkBrown">{book.publishYear}</div>
            <div className="text-xs text-walnut/70">Year</div>
          </div>
        )}
      </div>
    </div>
  )
}
