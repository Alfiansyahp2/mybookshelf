import { useState, useEffect, useRef } from 'react'
import Modal from '../ui/Modal'
import { useUpdateBook, useUploadCover } from '../../hooks/useBooks'
import type { Book } from '../../types'
import { Save, Trash2, Edit3, Camera, Upload, X } from 'lucide-react'
import { BOOK_GENRES } from '../../constants/genres'
import BookBasicInfoInput from '../book-form/BookBasicInfoInput'
import BookAppearanceInput from '../book-form/BookAppearanceInput'
import BookPurchaseInput from '../book-form/BookPurchaseInput'
import BookStatusInput from '../book-form/BookStatusInput'

interface EditBookModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (bookId: string) => void
}

const colorPalettes = [
  { name: 'Classic Brown', colors: ['#8B7355', '#6B5344', '#5C4532'] },
  { name: 'Navy Blue', colors: ['#1E3A5F', '#2A4A7F', '#3D5A8F'] },
  { name: 'Forest Green', colors: ['#2D5A3D', '#3A7B4F', '#4A8B5F'] },
  { name: 'Burgundy Red', colors: ['#7A1C1C', '#9B2C2C', '#BF3E3E'] },
  { name: 'Royal Purple', colors: ['#4A2374', '#6B3491', '#8B45AB'] },
  { name: 'Charcoal Gray', colors: ['#2C3E50', '#34495E', '#4A5A6A'] },
  { name: 'Ocean Blue', colors: ['#1A5F7A', '#2E86AB', '#4793AF'] },
  { name: 'Sunset Orange', colors: ['#D4621A', '#E67E22', '#F39C12'] },
  { name: 'Emerald Green', colors: ['#27AE60', '#2ECC71', '#58D68D'] },
  { name: 'Pure White', colors: ['#F5F5F5', '#E0E0E0', '#CCCCCC'] },
  { name: 'Midnight Black', colors: ['#2A2A2A', '#1A1A1A', '#0D0D0D'] },
  { name: 'Vibrant Yellow', colors: ['#F4D03F', '#F1C40F', '#D4AC0D'] },
  { name: 'Soft Pink', colors: ['#FADBD8', '#F5B7B1', '#F1948A'] },
  { name: 'Custom', colors: ['#8B7355', '#6B5344', '#5C4532'] }
]

export default function EditBookModal({
  book,
  isOpen,
  onClose,
  onDelete
}: EditBookModalProps) {
  const updateBook = useUpdateBook()
  const uploadCover = useUploadCover()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genres: [] as string[],
    language: 'Indonesian',
    publisher: '',
    publishYear: '',
    pages: '',
    format: 'paperback' as Book['format'],
    height: 'medium' as Book['height'],
    thickness: 'regular' as Book['thickness'],
    status: 'unread' as Book['status'],
    color1: '#8B7355',
    color2: '#6B5344',
    color3: '#5C4532',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    purchaseCurrency: 'IDR',
    acquisitionType: 'purchased' as 'purchased' | 'gift' | 'borrowed',
    giftFrom: '',
    borrowedFrom: '',
    borrowedBy: '',
    borrowedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    purchaseLocation: '',
  })

  // Reset form when book changes
  useEffect(() => {
    if (book) {
      setCoverPreview(book.coverImage || null)
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        genres: book.genre ? book.genre.split(',').map(s => s.trim()).filter(Boolean) : [],
        language: book.language || 'Indonesian',
        publisher: book.publisher || '',
        publishYear: book.publishYear?.toString() || '',
        pages: book.pages?.toString() || '',
        format: book.format || 'paperback',
        height: book.height || 'medium',
        thickness: book.thickness || 'regular',
        status: book.status || 'unread',
        color1: book.spineColors?.[0] || '#8B7355',
        color2: book.spineColors?.[1] || '#6B5344',
        color3: book.spineColors?.[2] || '#5C4532',
        purchaseDate: book.purchaseDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        purchasePrice: book.purchasePrice?.toString() || '',
        purchaseCurrency: book.purchaseCurrency || 'IDR',
        acquisitionType: book.personalNotes?.startsWith('Borrowed from: ') ? 'borrowed' : (book.isGift ? 'gift' : 'purchased'),
        giftFrom: book.personalNotes?.startsWith('Gift from: ') ? book.personalNotes.replace('Gift from: ', '') : '',
        borrowedFrom: book.personalNotes?.startsWith('Borrowed from: ') ? book.personalNotes.replace('Borrowed from: ', '') : '',
        borrowedBy: book.borrowedBy || '',
        borrowedDate: book.borrowedDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        dueDate: book.dueDate?.split('T')[0] || '',
        purchaseLocation: book.purchaseLocation || '',
      })
    }
  }, [book])

  // Early return if no book
  if (!book) return null

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate size before upload (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 5MB.');
      return;
    }

    // Save previous preview to revert if failed
    const previousPreview = coverPreview;

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploading(true)
    uploadCover.mutate({ id: book.id, file }, {
      onSuccess: (data) => {
        setCoverPreview(data.cover_image)
        setIsUploading(false)
      },
      onError: (err: any) => {
        console.error('Upload error:', err);
        const backendMsg = err.response?.data?.message || err.message || '';
        alert(`Gagal mengupload cover. Pesan dari server: ${backendMsg}`);
        setCoverPreview(previousPreview); // revert
        setIsUploading(false)
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateBook.mutate(
      {
        id: book.id,
        updates: {
          ...formData,
          genre: formData.genres.join(', '),
          publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
          pages: formData.pages ? parseInt(formData.pages) : undefined,
          spineColors: [formData.color1, formData.color2, formData.color3],
          purchaseDate: formData.purchaseDate,
          purchasePrice: formData.acquisitionType !== 'purchased' ? undefined : (formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined),
          purchaseCurrency: formData.purchaseCurrency,
          purchaseLocation: formData.acquisitionType === 'purchased' ? formData.purchaseLocation : undefined,
          isGift: formData.acquisitionType === 'gift',
          status: formData.status,
          personalNotes: formData.acquisitionType === 'gift' && formData.giftFrom ? `Gift from: ${formData.giftFrom}` : (formData.acquisitionType === 'borrowed' && formData.borrowedFrom ? `Borrowed from: ${formData.borrowedFrom}` : ''),
          borrowedBy: formData.status === 'borrowed' ? formData.borrowedBy : '',
          borrowedDate: formData.status === 'borrowed' ? formData.borrowedDate : '',
          dueDate: formData.status === 'borrowed' && formData.dueDate ? formData.dueDate : '',
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
  const spineColor0 = formData.color1
  const spineColor1 = formData.color2
  const spineColor2 = formData.color3

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Book Details"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="flex gap-6">
        {/* Left Side - Book Cover */}
        <div className="w-1/3 flex-shrink-0">
          {/* Cover Image with Upload Overlay */}
          <div
            className="w-full aspect-[3/4] rounded-xl shadow-2xl relative overflow-hidden group cursor-pointer"
            style={{
              background: coverPreview
                ? undefined
                : `linear-gradient(135deg, ${spineColor0} 0%, ${spineColor1} 50%, ${spineColor2} 100%)`
            }}
            onClick={() => coverInputRef.current?.click()}
          >
            {/* Actual cover image */}
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Book cover"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Fallback text when no cover */}
            {!coverPreview && (
              <div className="h-full p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-serif font-bold text-xl mb-2 leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {formData.title || 'Book Title'}
                  </h3>
                  <p className="text-white/90 text-base" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {formData.author || 'Author Name'}
                  </p>
                </div>
                {/* Shine Effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)' }}
                />
                {/* Spine Effect */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-12 rounded-l-xl"
                  style={{ background: `linear-gradient(to right, ${spineColor2} 0%, ${spineColor1} 50%, ${spineColor0} 100%)`, boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)' }}
                />
              </div>
            )}

            {/* Upload overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center text-white">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium">Mengupload...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-8 h-8" />
                    <span className="text-xs font-medium">{coverPreview ? 'Ganti Cover' : 'Upload Cover'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Remove cover button */}
            {coverPreview && !isUploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCoverPreview(null) }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleCoverSelect}
          />

          {/* Upload hint */}
          <p className="text-center text-xs text-walnut/40 mt-2">
            Klik cover untuk {coverPreview ? 'mengganti' : 'upload'} foto
          </p>

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
          <BookBasicInfoInput formData={formData} setFormData={setFormData} />

          {/* Status Info */}
          <BookStatusInput formData={formData} setFormData={setFormData} />

          {/* Appearance Info */}
          <BookAppearanceInput formData={formData} setFormData={setFormData} />

          {/* Purchase Info */}
          <BookPurchaseInput formData={formData} setFormData={setFormData} />

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
