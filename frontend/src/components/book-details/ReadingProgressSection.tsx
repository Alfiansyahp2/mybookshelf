import { BookOpen, Clock } from 'lucide-react'
import type { Book } from '../../types'

interface ReadingProgressSectionProps {
  book: Book
  onProgressChange: (currentPage: number) => void
}

export default function ReadingProgressSection({ book, onProgressChange }: ReadingProgressSectionProps) {
  const progress = book.pages && book.pages > 0
    ? Math.round(((book.currentPage || 0) / book.pages) * 100)
    : 0

  // Safe colors
  const spineColor0 = book.spineColors?.[0] || '#8B7355'
  const spineColor2 = book.spineColors?.[2] || '#5C4532'

  return (
    <div className="p-4 bg-white rounded-xl border border-walnut/10 shadow-sm">
      <h3 className="font-semibold text-darkBrown mb-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-walnut" />
        Reading Progress
      </h3>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-walnut/60">Progress</span>
          <span className="font-medium text-darkBrown">{progress}%</span>
        </div>
        <div className="h-2 bg-walnut/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${spineColor0}, ${spineColor2})`
            }}
          />
        </div>
        {book.currentPage && book.pages && (
          <div className="flex justify-between text-xs mt-1 text-walnut/60">
            <span>Page {book.currentPage}</span>
            <span>of {book.pages}</span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="text-xs text-walnut/60 block mb-1">Update Progress</label>
        <input
          type="range"
          min="0"
          max={book.pages || 0}
          value={book.currentPage || 0}
          onChange={(e) => onProgressChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {book.startedDate && (
        <div className="flex items-center gap-2 p-2 bg-walnut/10 rounded-lg text-xs">
          <Clock className="w-4 h-4 text-walnut" />
          <span className="text-walnut/70">
            Reading since {new Date(book.startedDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  )
}
