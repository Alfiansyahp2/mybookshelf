import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, BookOpen, Calendar, Hash, FileText, Globe, Package } from 'lucide-react'
import { useState } from 'react'
import { useCreateBook } from '../hooks/useBooks'
import { BOOK_GENRES } from '../constants/genres'

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
    purchaseCurrency: 'IDR',
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
      pages: formData.pages,
      currentPage: 0,
      isbn: formData.isbn,
      genre: formData.genres.join(', '),
      language: formData.language,
      publisher: formData.publisher,
      publishYear: formData.publishYear,
      format: formData.format as any,
      height: formData.height as any,
      thickness: formData.thickness as any,
      spineColors: [formData.color1, formData.color2, formData.color3] as [string, string, string],
      purchaseDate: formData.purchaseDate,
      purchasePrice: formData.acquisitionType !== 'purchased' ? undefined : (formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined),
      purchaseCurrency: formData.purchaseCurrency,
      isGift: formData.acquisitionType === 'gift',
      personalNotes: formData.acquisitionType === 'gift' && formData.giftFrom ? `Gift from: ${formData.giftFrom}` : (formData.acquisitionType === 'borrowed' && formData.borrowedFrom ? `Borrowed from: ${formData.borrowedFrom}` : ''),
    }

    createBook.mutate(bookData)
    console.log('Book added successfully')
    onClose()
    // Reset form
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genres: [],
      language: 'Indonesian',
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
      purchaseCurrency: 'IDR',
      isGift: false,
      giftFrom: ''
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
                    <h2 className="text-xl font-serif font-semibold text-darkBrown">Add New Book</h2>
                    {shelfName && (
                      <p className="text-sm text-walnut/60">to {shelfName}</p>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Book Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Book Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          placeholder="Enter book title"
                        />
                      </div>

                      {/* Author */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <FileText className="w-4 h-4 inline mr-1" />
                          Author *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          placeholder="Enter author name"
                        />
                      </div>

                      {/* ISBN */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Hash className="w-4 h-4 inline mr-1" />
                          ISBN
                        </label>
                        <input
                          type="text"
                          value={formData.isbn}
                          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          placeholder="978-0-123456-78-9"
                        />
                      </div>

                      {/* Genre */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Globe className="w-4 h-4 inline mr-1" />
                          Genres *
                        </label>
                        <div className="space-y-4">
                          {BOOK_GENRES.map((group) => (
                            <div key={group.category}>
                              <h4 className="text-xs font-bold text-walnut/60 mb-2 uppercase tracking-wider">{group.category}</h4>
                              <div className="flex flex-wrap gap-2">
                                {group.genres.map(g => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => {
                                      if (formData.genres.includes(g)) {
                                        setFormData({ ...formData, genres: formData.genres.filter(x => x !== g) })
                                      } else {
                                        setFormData({ ...formData, genres: [...formData.genres, g] })
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                      formData.genres.includes(g) ? 'bg-walnut text-white' : 'bg-walnut/10 text-walnut/80 hover:bg-walnut/20'
                                    }`}
                                  >
                                    {g}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          <div className="flex gap-2 pt-2 border-t border-walnut/10">
                            <input
                              type="text"
                              placeholder="Or type a custom genre and press Enter"
                              className="flex-1 px-4 py-2 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = e.currentTarget.value.trim();
                                  if (val && !formData.genres.includes(val)) {
                                    setFormData({ ...formData, genres: [...formData.genres, val] });
                                  }
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Publisher */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          Publisher
                        </label>
                        <input
                          type="text"
                          value={formData.publisher}
                          onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          placeholder="Publisher name"
                        />
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          Language
                        </label>
                        <select
                          value={formData.language}
                          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        >
                          <option value="Indonesian">Indonesian</option>
                          <option value="English">English</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Korean">Korean</option>
                          <option value="Chinese">Chinese</option>
                          <option value="Arabic">Arabic</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Dutch">Dutch</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Publish Year */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Year *
                        </label>
                        <input
                          type="number"
                          required
                          min="1000"
                          max={new Date().getFullYear() + 1}
                          value={formData.publishYear}
                          onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        />
                      </div>

                      {/* Pages */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          Pages *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.pages}
                          onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          placeholder="Number of pages"
                        />
                      </div>

                      {/* Format */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Package className="w-4 h-4 inline mr-1" />
                          Format
                        </label>
                        <select
                          value={formData.format}
                          onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        >
                          <option value="hardcover">Hardcover</option>
                          <option value="paperback">Paperback</option>
                          <option value="ebook">E-book</option>
                          <option value="audiobook">Audiobook</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Book Appearance</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Height */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">Height</label>
                        <select
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        >
                          <option value="short">Short</option>
                          <option value="medium">Medium</option>
                          <option value="tall">Tall</option>
                        </select>
                      </div>

                      {/* Thickness */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">Thickness</label>
                        <select
                          value={formData.thickness}
                          onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        >
                          <option value="thin">Thin</option>
                          <option value="regular">Regular</option>
                          <option value="thick">Thick</option>
                        </select>
                      </div>

                      {/* Color Palette Picker */}
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-walnut mb-1.5">Spine Color Palette</label>
                        <div className="space-y-3">
                          {/* Predefined Palettes */}
                          <div className="flex flex-wrap gap-2">
                            {colorPalettes.map((palette) => (
                              <button
                                key={palette.name}
                                type="button"
                                onClick={() => setFormData({ ...formData, color1: palette.colors[0], color2: palette.colors[1], color3: palette.colors[2] })}
                                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                                  formData.color1 === palette.colors[0] && formData.color2 === palette.colors[1] && formData.color3 === palette.colors[2]
                                    ? 'border-walnut bg-walnut/10 shadow-md'
                                    : 'border-walnut/20 hover:border-walnut/40 bg-cream'
                                }`}
                                title={palette.name}
                              >
                                <div className="flex gap-1">
                                  {palette.colors.map((color, i) => (
                                    <div
                                      key={i}
                                      className="w-4 h-4 rounded-full border border-white/20"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-walnut/70 ml-1">{palette.name}</span>
                              </button>
                            ))}
                          </div>

                          {/* Custom Color Preview */}
                          <div className="flex items-center gap-2 p-3 bg-cream rounded-xl border border-walnut/20">
                            <span className="text-sm text-walnut/60">Current:</span>
                            <div className="flex gap-1">
                              <div
                                className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: formData.color1 }}
                                title="Light shade"
                              />
                              <div
                                className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: formData.color2 }}
                                title="Medium shade"
                              />
                              <div
                                className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: formData.color3 }}
                                title="Dark shade"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Purchase Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Purchase/Gift Toggle */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">Acquisition Type</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, acquisitionType: 'purchased' })}
                            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              formData.acquisitionType === 'purchased'
                                ? 'bg-walnut text-white shadow'
                                : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
                            }`}
                          >
                            Purchased
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, acquisitionType: 'gift' })}
                            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              formData.acquisitionType === 'gift'
                                ? 'bg-walnut text-white shadow'
                                : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
                            }`}
                          >
                            Gift
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, acquisitionType: 'borrowed' })}
                            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              formData.acquisitionType === 'borrowed'
                                ? 'bg-walnut text-white shadow'
                                : 'bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20'
                            }`}
                          >
                            Minjam
                          </button>
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formData.acquisitionType === 'gift' ? 'Received Date' : formData.acquisitionType === 'borrowed' ? 'Borrowed Date' : 'Purchase Date'}
                        </label>
                        <input
                          type="date"
                          value={formData.purchaseDate}
                          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        />
                      </div>

                      {/* Price - Only show if purchased */}
                      {formData.acquisitionType === 'purchased' && (
                        <div>
                          <label className="block text-sm font-medium text-walnut mb-1.5">
                            💰 Purchase Price
                          </label>
                          <div className="flex relative">
                            <select
                              value={formData.purchaseCurrency}
                              onChange={(e) => setFormData({ ...formData, purchaseCurrency: e.target.value })}
                              className="absolute left-1 top-1.5 bottom-1.5 bg-transparent border-r border-walnut/20 text-walnut/80 text-sm focus:outline-none px-2 rounded-l-lg z-10"
                            >
                              <option value="IDR">Rp</option>
                              <option value="USD">$</option>
                              <option value="EUR">€</option>
                              <option value="GBP">£</option>
                              <option value="JPY">¥</option>
                            </select>
                            <input
                              type="number"
                              step={formData.purchaseCurrency === 'IDR' || formData.purchaseCurrency === 'JPY' ? '1' : '0.01'}
                              min="0"
                              value={formData.purchasePrice}
                              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                              className="w-full pl-16 pr-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      )}

                      {/* Gift From */}
                      {formData.acquisitionType === 'gift' && (
                        <div>
                          <label className="block text-sm font-medium text-walnut mb-1.5">🎁 Gift From</label>
                          <input
                            type="text"
                            value={formData.giftFrom}
                            onChange={(e) => setFormData({ ...formData, giftFrom: e.target.value })}
                            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                            placeholder="Name of the person"
                          />
                        </div>
                      )}

                      {/* Borrowed From */}
                      {formData.acquisitionType === 'borrowed' && (
                        <div>
                          <label className="block text-sm font-medium text-walnut mb-1.5">👤 Pinjam Dari</label>
                          <input
                            type="text"
                            value={formData.borrowedFrom}
                            onChange={(e) => setFormData({ ...formData, borrowedFrom: e.target.value })}
                            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                            placeholder="Nama teman atau perpustakaan"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Cover Image</h3>

                    <div className="border-2 border-dashed border-walnut/30 rounded-xl p-8 text-center hover:border-walnut/50 transition-colors">
                      <Upload className="w-8 h-8 text-walnut/40 mx-auto mb-2" />
                      <p className="text-sm text-walnut/60 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-walnut/40">PNG, JPG or GIF (max. 5MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-walnut/10 bg-cream/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border border-walnut/20 rounded-xl text-sm font-medium text-walnut hover:bg-walnut/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={createBook.isPending}
                  className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createBook.isPending ? (
                    <>Adding...</>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Add Book
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

// Predefined color palettes
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
