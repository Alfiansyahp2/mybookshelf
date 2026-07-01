import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { useUpdateBook } from '../../hooks/useBooks'
import type { Book } from '../../types'
import { Save, Trash2, Edit3, X } from 'lucide-react'

interface EditBookModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (bookId: string) => void
}

export default function EditBookModal({
  book,
  isOpen,
  onClose,
  onDelete
}: EditBookModalProps) {
  const updateBook = useUpdateBook()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    language: '',
    publisher: '',
    publishYear: '',
    pages: '',
    format: 'paperback' as Book['format'],
    height: 'medium' as Book['height'],
    thickness: 'regular' as Book['thickness'],
    status: 'unread' as Book['status'],
  })

  // Reset form when book changes
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        genre: book.genre || '',
        language: book.language || '',
        publisher: book.publisher || '',
        publishYear: book.publishYear?.toString() || '',
        pages: book.pages?.toString() || '',
        format: book.format || 'paperback',
        height: book.height || 'medium',
        thickness: book.thickness || 'regular',
        status: book.status || 'unread',
      })
    }
  }, [book])

  // Early return if no book
  if (!book) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateBook.mutate(
      {
        id: book.id,
        updates: {
          ...formData,
          publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
          pages: formData.pages ? parseInt(formData.pages) : undefined,
        }
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id)
      onClose()
    }
  }

  // Safe colors
  const spineColor0 = book.spineColors?.[0] || '#8B7355'
  const spineColor1 = book.spineColors?.[1] || '#6B5344'
  const spineColor2 = book.spineColors?.[2] || '#5C4532'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Book Details"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="flex gap-6">
        {/* Left Side - Book Cover Preview */}
        <div className="w-1/3 flex-shrink-0">
          {/* 3D Book Cover Preview */}
          <div
            className="w-full aspect-[3/4] rounded-xl shadow-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${spineColor0} 0%, ${spineColor1} 50%, ${spineColor2} 100%)`
            }}
          >
            <div className="h-full p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-serif font-bold text-xl mb-2 leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  {formData.title || 'Book Title'}
                </h3>
                <p className="text-white/90 text-base" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  {formData.author || 'Author Name'}
                </p>
              </div>

              {formData.genre && (
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-white text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {formData.genre}
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

          {/* Book Stats Preview */}
          <div className="mt-4 space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-darkBrown">{formData.pages || book.pages || 0}</div>
              <div className="text-xs text-walnut/70">Pages</div>
            </div>

            {formData.publishYear && (
              <div className="text-center">
                <div className="text-3xl font-bold text-darkBrown">{formData.publishYear}</div>
                <div className="text-xs text-walnut/70">Year</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Edit Form */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-walnut/10">
            <Edit3 className="w-6 h-6 text-walnut" />
            <h2 className="text-2xl font-serif font-bold text-darkBrown">Edit Book Information</h2>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Author *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
              />
            </div>
          </div>

          {/* ISBN & Genre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Genre
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                placeholder="Fiction, Non-fiction, etc."
              />
            </div>
          </div>

          {/* Publisher & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Publisher
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                placeholder="English"
              />
            </div>
          </div>

          {/* Year & Pages */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Publish Year
              </label>
              <input
                type="number"
                value={formData.publishYear}
                onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                min="1000"
                max="2999"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Pages
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                min="1"
                placeholder="300"
              />
            </div>
          </div>

          {/* Format, Height, Thickness, Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Format
              </label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as Book['format'] })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
              >
                <option value="hardcover">Hardcover</option>
                <option value="paperback">Paperback</option>
                <option value="ebook">E-book</option>
                <option value="audiobook">Audiobook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Height
              </label>
              <select
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value as Book['height'] })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="tall">Tall</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Thickness
              </label>
              <select
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: e.target.value as Book['thickness'] })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
              >
                <option value="thin">Thin</option>
                <option value="regular">Regular</option>
                <option value="thick">Thick</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-darkBrown mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Book['status'] })}
                className="w-full px-3 py-2 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
              >
                <option value="unread">Unread</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
                <option value="wishlist">Wishlist</option>
                <option value="borrowed">Borrowed</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-walnut/10 bg-cream/30">
            <button
              type="button"
              onClick={handleDelete}
              className="w-10 h-10 bg-transparent text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors"
              title="Delete book"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="flex-1"></div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-walnut/60 hover:bg-walnut/10 rounded-xl transition-colors"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={updateBook.isPending}
              className="px-4 py-2 bg-white text-darkBrown border border-walnut/20 rounded-xl hover:bg-cream transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
              title="Save changes"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
