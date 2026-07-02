import { BookOpen, Clock, Plus } from 'lucide-react'
import type { Book } from '../../types'

interface ReadingProgressSectionProps {
  book: Book
  onProgressChange: (currentPage: number) => void
  onAddReadDate?: (date: string) => void
}

export default function ReadingProgressSection({ book, onProgressChange, onAddReadDate }: ReadingProgressSectionProps) {
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
        <div className="flex items-center gap-2 p-2 bg-walnut/10 rounded-lg text-xs mb-3">
          <Clock className="w-4 h-4 text-walnut" />
          <span className="text-walnut/70">
            Reading since {new Date(book.startedDate).toLocaleDateString()}
          </span>
        </div>
      )}

      {book.status === 'finished' && (
        <div className="mt-4 pt-4 border-t border-walnut/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-darkBrown flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-walnut" />
              Reading History
            </h4>
            <div className="relative">
              <input 
                type="date" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.value && onAddReadDate) {
                    onAddReadDate(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button className="text-xs px-2 py-1 bg-walnut/10 hover:bg-walnut/20 text-darkBrown font-medium rounded transition-colors flex items-center gap-1 pointer-events-none">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {book.readDates && book.readDates.length > 0 && (
            <ul className="space-y-2">
              {book.readDates.map((date, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-walnut/80 bg-walnut/5 p-2 rounded border border-walnut/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-walnut/40" />
                  {new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
