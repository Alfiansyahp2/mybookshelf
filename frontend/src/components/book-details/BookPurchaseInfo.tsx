import type { Book } from '../../types'

interface BookPurchaseInfoProps {
  book: Book
}

export default function BookPurchaseInfo({ book }: BookPurchaseInfoProps) {
  if (!book.purchaseDate && !book.purchasePrice) return null

  return (
    <div className="p-4 bg-walnut/10 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-walnut/70">Purchased</div>
          <div className="text-sm font-medium text-darkBrown">
            {book.purchaseDate && new Date(book.purchaseDate).toLocaleDateString()}
          </div>
        </div>
        {book.purchasePrice && (
          <div className="text-right">
            <div className="text-lg font-semibold text-darkBrown">
              ${book.purchasePrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
