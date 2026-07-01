import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Trash2, AlertTriangle, Calendar, Hash, FileText, Globe, Package, Upload, Plus, Save } from 'lucide-react'
import { useCreateBook, useUpdateBook, useDeleteBook } from '../../hooks/useBooks'
import { useShelves } from '../../hooks/useShelves'
import type { Book, BookFormat, BookHeight, BookThickness } from '../../types'

interface BookModalProps {
  isOpen: boolean
  onClose: () => void
  book?: Book | null
  mode?: 'create' | 'update' | 'delete'
  defaultShelfId?: string
}

export default function BookModal({
  isOpen,
  onClose,
  book,
  mode = 'create',
  defaultShelfId
}: BookModalProps) {
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()
  const { data: shelves = [] } = useShelves()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    publisher: '',
    publishYear: new Date().getFullYear(),
    pages: 0,
    format: 'paperback' as BookFormat,
    height: 'medium' as BookHeight,
    thickness: 'regular' as BookThickness,
    color1: '#8B7355',
    color2: '#6B5344',
    color3: '#5C4532',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    notes: ''
  })

  // Reset form when modal opens or book changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'update' && book) {
        setFormData({
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          genre: book.genre || '',
          publisher: book.publisher || '',
          publishYear: book.publishYear || new Date().getFullYear(),
          pages: book.pages || 0,
          format: book.format || 'paperback',
          height: book.height || 'medium',
          thickness: book.thickness || 'regular',
          color1: book.spineColors?.[0] || '#8B7355',
          color2: book.spineColors?.[1] || '#6B5344',
          color3: book.spineColors?.[2] || '#5C4532',
          purchaseDate: book.purchaseDate || new Date().toISOString().split('T')[0],
          purchasePrice: book.purchasePrice?.toString() || '',
          notes: book.personalNotes || ''
        })
      } else {
        setFormData({
          title: '',
          author: '',
          isbn: '',
          genre: '',
          publisher: '',
          publishYear: new Date().getFullYear(),
          pages: 0,
          format: 'paperback',
          height: 'medium',
          thickness: 'regular',
          color1: '#8B7355',
          color2: '#6B5344',
          color3: '#5C4532',
          purchaseDate: new Date().toISOString().split('T')[0],
          purchasePrice: '',
          notes: ''
        })
      }
    }
  }, [isOpen, book, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'delete') {
      // Handle delete separately
      return
    }

    const bookData = {
      title: formData.title,
      author: formData.author,
      shelfId: defaultShelfId || shelves[0]?.id,
      isbn: formData.isbn,
      genre: formData.genre,
      publisher: formData.publisher,
      publishYear: formData.publishYear,
      pages: formData.pages,
      format: formData.format,
      height: formData.height,
      thickness: formData.thickness,
      spineColors: [formData.color1, formData.color2, formData.color3] as [string, string, string],
      purchaseDate: formData.purchaseDate,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
      personalNotes: formData.notes,
      status: 'unread' as const
    }

    if (mode === 'create') {
      createBook.mutate(bookData, {
        onSuccess: () => {
          onClose()
        }
      })
    } else if (mode === 'update' && book) {
      updateBook.mutate(
        { id: book.id, updates: bookData },
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    }
  }

  const handleDelete = () => {
    if (book) {
      deleteBook.mutate(book.id, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Book'
      case 'update': return 'Edit Book'
      case 'delete': return 'Delete Book'
    }
  }

  if (!isOpen) return null

  if (mode === 'delete') {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-walnut/10 bg-gradient-to-r from-red-50 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-semibold text-darkBrown">{getTitle()}</h2>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-walnut/10 hover:bg-walnut/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-walnut" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-1">
                          Are you sure you want to delete this book?
                        </h3>
                        <p className="text-sm text-red-700">
                          This will permanently delete "<strong>{book?.title}</strong>" by {book?.author}.
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>

                    {/* Book Info */}
                    {book && (
                      <div className="p-4 bg-walnut/10 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-16 rounded-xl flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[2]} 100%)`
                            }}
                          >
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-darkBrown">{book.title}</h4>
                            <p className="text-sm text-walnut/70">{book.author}</p>
                            {book.genre && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-walnut/20 rounded text-xs text-walnut/70">
                                {book.genre}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-walnut/10 bg-cream/30">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-white border border-walnut/20 rounded-xl text-sm font-medium text-walnut hover:bg-walnut/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteBook.isPending}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteBook.isPending ? 'Deleting...' : 'Delete Book'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-walnut/10 bg-gradient-to-r from-walnut/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-walnut/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-walnut" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-darkBrown">{getTitle()}</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-walnut/10 hover:bg-walnut/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-walnut" />
                </button>
              </div>

              {/* Form */}
              <form id="book-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter book title"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                      required
                    />
                  </div>

                  {/* Author */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Enter author name"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                      required
                    />
                  </div>

                  {/* ISBN */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      placeholder="978-0-123456-78-9"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    />
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="e.g., Fiction, Science"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    />
                  </div>

                  {/* Publisher */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Publisher
                    </label>
                    <input
                      type="text"
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      placeholder="Publisher name"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    />
                  </div>

                  {/* Publish Year */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Publish Year
                    </label>
                    <input
                      type="number"
                      value={formData.publishYear}
                      onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) || new Date().getFullYear() })}
                      min="1000"
                      max="2100"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    />
                  </div>

                  {/* Pages */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Pages
                    </label>
                    <input
                      type="number"
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    />
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Format
                    </label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value as BookFormat })}
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    >
                      <option value="paperback">Paperback</option>
                      <option value="hardcover">Hardcover</option>
                      <option value="ebook">Ebook</option>
                      <option value="audiobook">Audiobook</option>
                    </select>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Height
                    </label>
                    <select
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value as BookHeight })}
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="tall">Tall</option>
                    </select>
                  </div>

                  {/* Thickness */}
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Thickness
                    </label>
                    <select
                      value={formData.thickness}
                      onChange={(e) => setFormData({ ...formData, thickness: e.target.value as BookThickness })}
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    >
                      <option value="thin">Thin</option>
                      <option value="regular">Regular</option>
                      <option value="thick">Thick</option>
                    </select>
                  </div>
                </div>

                {/* Spine Colors */}
                <div>
                  <label className="block text-sm font-medium text-darkBrown mb-2">
                    Spine Colors
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'color1', label: 'Light' },
                      { key: 'color2', label: 'Medium' },
                      { key: 'color3', label: 'Dark' }
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData[key as keyof typeof formData] as string}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border-2 border-walnut/30"
                          />
                          <span className="text-xs text-walnut/70">{label}</span>
                        </div>
                        <input
                          type="text"
                          value={formData[key as keyof typeof formData] as string}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          placeholder="#8B7355"
                          className="w-full px-2 py-1 text-xs border border-walnut/30 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkBrown mb-2">
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-walnut/30 rounded-lg focus:ring-2 focus:ring-walnut/20 focus:border-walnut outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-darkBrown mb-2">
                    Personal Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add your personal notes about this book..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm resize-none"
                  />
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-walnut/10 bg-cream/30">
                  <button
                    type="button"
                    onClick={onClose}
                    title="Cancel"
                    className="px-4 py-2 bg-transparent text-walnut/60 hover:bg-walnut/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    form="book-form"
                    disabled={mode === 'create' ? createBook.isPending : updateBook.isPending}
                    title={mode === 'create' ? 'Add Book' : 'Update Book'}
                    className="px-4 py-2 bg-white text-darkBrown border border-walnut/20 rounded-xl hover:bg-cream transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {mode === 'create' ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
}
