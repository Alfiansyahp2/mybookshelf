import { Heart, Play, Check } from 'lucide-react'

interface BookActionsSectionProps {
  book: any
  toggleFavorite: { isPending: boolean; mutate: (id: string) => void }
  startReading: { isPending: boolean; mutate: (id: string) => void }
  finishReading: { isPending: boolean; mutate: (id: string) => void }
  onToggleFavorite: () => void
  onStartReading: () => void
  onFinishReading: () => void
}

export default function BookActionsSection({
  book,
  toggleFavorite,
  startReading,
  finishReading,
  onToggleFavorite,
  onStartReading,
  onFinishReading
}: BookActionsSectionProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onToggleFavorite}
        disabled={toggleFavorite.isPending}
        className="flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:scale-105 bg-walnut/20 text-walnut hover:bg-walnut/30"
      >
        <Heart className={`w-5 h-5 ${(book.favorite || book.isFavorite) ? 'fill-red-500' : ''}`} />
        {(book.favorite || book.isFavorite) ? 'Favorited' : 'Favorite'}
      </button>

      {book.status === 'unread' && (
        <button
          onClick={onStartReading}
          disabled={startReading.isPending}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Reading
        </button>
      )}

      {book.status === 'reading' && (
        <button
          onClick={onFinishReading}
          disabled={finishReading.isPending}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Finish
        </button>
      )}
    </div>
  )
}
