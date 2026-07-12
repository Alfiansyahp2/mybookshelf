import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useCreateBook } from '../hooks/useBooks'
import BookBasicInfoInput from './book-form/BookBasicInfoInput'
import BookAppearanceInput from './book-form/BookAppearanceInput'
import BookPurchaseInput from './book-form/BookPurchaseInput'

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  shelfId?: string
  shelfName?: string
}

export default function AddBookModal({ isOpen, onClose, shelfId, shelfName }: AddBookModalProps) {
  const createBook = useCreateBook()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genres: [] as string[],
    language: 'Indonesian',
    publisher: '',
    publishYear: new Date().getFullYear().toString(),
    pages: '0',
    format: 'paperback',
    height: 'medium',
    thickness: 'regular',
    color1: '#8B7355',
    color2: '#6B5344',
    color3: '#5C4532',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    purchaseCurrency: 'IDR',
    purchaseLocation: '',
    acquisitionType: 'purchased' as 'purchased' | 'gift' | 'borrowed',
    giftFrom: '',
    borrowedFrom: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!shelfId) {
      alert('Please select a shelf first')
      return
    }

    // Create book object for API
    const bookData = {
      title: formData.title,
      author: formData.author,
      shelfId: shelfId,
      status: 'unread' as const,
      pages: formData.pages ? parseInt(formData.pages) : 0,
      currentPage: 0,
      isbn: formData.isbn,
      genre: formData.genres.join(', '),
      language: formData.language,
      publisher: formData.publisher,
      publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
      format: formData.format as any,
      height: formData.height as any,
      thickness: formData.thickness as any,
      spineColors: [formData.color1, formData.color2, formData.color3] as [string, string, string],
      purchaseDate: formData.purchaseDate,
      purchasePrice: formData.acquisitionType !== 'purchased' ? undefined : (formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined),
      purchaseCurrency: formData.purchaseCurrency,
      purchaseLocation: formData.acquisitionType === 'purchased' ? formData.purchaseLocation : undefined,
      isGift: formData.acquisitionType === 'gift',
      personalNotes: formData.acquisitionType === 'gift' && formData.giftFrom ? `Gift from: ${formData.giftFrom}` : (formData.acquisitionType === 'borrowed' && formData.borrowedFrom ? `Borrowed from: ${formData.borrowedFrom}` : ''),
    }

    createBook.mutate(bookData)
    onClose()
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genres: [],
      language: 'Indonesian',
      publisher: '',
      publishYear: new Date().getFullYear().toString(),
      pages: '0',
      format: 'paperback',
      height: 'medium',
      thickness: 'regular',
      color1: '#8B7355',
      color2: '#6B5344',
      color3: '#5C4532',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: '',
      purchaseCurrency: 'IDR',
      purchaseLocation: '',
      acquisitionType: 'purchased',
      giftFrom: '',
      borrowedFrom: ''
    })
  }

  if (!isOpen) return null

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-walnut/10 bg-gradient-to-r from-walnut/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-walnut/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-walnut" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-darkBrown">Tambah Buku Baru</h2>
                    {shelfName && (
                      <p className="text-sm text-walnut/60">ke {shelfName}</p>
                    )}
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
              <div className="flex-1 overflow-y-auto p-6">
                <form id="add-book-form" onSubmit={handleSubmit} className="space-y-6">
                  <BookBasicInfoInput formData={formData} setFormData={setFormData} />
                  <BookAppearanceInput formData={formData} setFormData={setFormData} />
                  <BookPurchaseInput formData={formData} setFormData={setFormData} />
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-walnut/10 bg-cream/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border border-walnut/20 rounded-xl text-sm font-medium text-walnut hover:bg-walnut/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  form="add-book-form"
                  type="submit"
                  disabled={createBook.isPending}
                  className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createBook.isPending ? (
                    <>Menyimpan...</>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Simpan Buku
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
