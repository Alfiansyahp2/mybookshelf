import type { Book } from '../../types'

interface BookMetadataSectionProps {
  book: Book
}

export default function BookMetadataSection({ book }: BookMetadataSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      {book.publisher && (
        <div className="p-3 bg-walnut/10 rounded-lg">
          <div className="text-xs text-walnut/60 mb-1">Publisher</div>
          <div className="font-medium text-darkBrown">{book.publisher}</div>
        </div>
      )}

      {book.isbn && (
        <div className="p-3 bg-walnut/10 rounded-lg">
          <div className="text-xs text-walnut/60 mb-1">ISBN</div>
          <div className="font-medium text-darkBrown font-mono text-xs">{book.isbn}</div>
        </div>
      )}

      {book.format && (
        <div className="p-3 bg-walnut/10 rounded-lg">
          <div className="text-xs text-walnut/60 mb-1">Format</div>
          <div className="font-medium text-darkBrown capitalize">{book.format}</div>
        </div>
      )}

      {book.language && (
        <div className="p-3 bg-walnut/10 rounded-lg">
          <div className="text-xs text-walnut/60 mb-1">Language</div>
          <div className="font-medium text-darkBrown capitalize">{book.language}</div>
        </div>
      )}
    </div>
  )
}
