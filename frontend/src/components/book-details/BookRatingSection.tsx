import { Star } from 'lucide-react'

interface BookRatingSectionProps {
  userRating: number
  onUpdateRating: (rating: number) => void
}

export default function BookRatingSection({ userRating, onUpdateRating }: BookRatingSectionProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-walnut/10 shadow-sm">
      <h3 className="font-semibold text-darkBrown mb-3 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        Your Rating
      </h3>
      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onUpdateRating(star)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-8 h-8 ${
                star <= userRating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {userRating > 0 && (
        <div className="text-xs text-walnut/60">
          You rated this {userRating} star{userRating !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
