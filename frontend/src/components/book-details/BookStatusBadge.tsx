import type { Book } from '../../types'

interface BookStatusBadgeProps {
  book: Book
}

export default function BookStatusBadge({ book }: BookStatusBadgeProps) {
  const getStatusColor = () => {
    switch (book.status) {
      case 'reading':
        return 'bg-green-100 text-green-800'
      case 'finished':
        return 'bg-blue-100 text-blue-800'
      case 'wishlist':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = () => {
    if (!book.status) return 'Unknown'
    return book.status.charAt(0).toUpperCase() + book.status.slice(1)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-walnut/70">Status:</span>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </div>
    </div>
  )
}
