import { motion, AnimatePresence } from 'framer-motion'
import { X, Layers, Hash, Package } from 'lucide-react'
import { useState } from 'react'

interface AddShelfModalProps {
  isOpen: boolean
  onClose: () => void
  onShelfAdded?: (shelf: any) => void
}

export default function AddShelfModal({ isOpen, onClose, onShelfAdded }: AddShelfModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 20,
    color: '#8B7355'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newShelf = {
      id: `shelf-${Date.now()}`,
      name: formData.name,
      capacity: formData.capacity,
      color: formData.color
    }

    console.log('New shelf:', newShelf)
    onShelfAdded?.(newShelf)

    // Reset form
    setFormData({
      name: '',
      capacity: 20,
      color: '#8B7355'
    })

    onClose()
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-walnut/10 bg-gradient-to-r from-walnut/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-walnut/10 rounded-xl flex items-center justify-center">
                    <Layers className="w-5 h-5 text-walnut" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-darkBrown">Add New Bookshelf</h2>
                    <p className="text-sm text-walnut/60">Create a new shelf for your books</p>
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
                  {/* Shelf Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Shelf Information</h3>

                    {/* Shelf Name */}
                    <div>
                      <label className="block text-sm font-medium text-walnut mb-1.5">
                        <Hash className="w-4 h-4 inline mr-1" />
                        Shelf Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        placeholder="e.g., My Favorites, Science Books"
                      />
                    </div>

                    {/* Capacity */}
                    <div>
                      <label className="block text-sm font-medium text-walnut mb-1.5">
                        <Package className="w-4 h-4 inline mr-1" />
                        Capacity (books)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        placeholder="20"
                      />
                      <p className="text-xs text-walnut/50 mt-1">Maximum number of books this shelf can hold</p>
                    </div>

                    {/* Shelf Color */}
                    <div>
                      <label className="block text-sm font-medium text-walnut mb-1.5">Shelf Color Theme</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { name: 'Classic Brown', color: '#8B7355' },
                          { name: 'Navy', color: '#1E3A5F' },
                          { name: 'Forest', color: '#2D5A3D' },
                          { name: 'Burgundy', color: '#7A1C1C' },
                          { name: 'Charcoal', color: '#2C3E50' },
                          { name: 'Royal Purple', color: '#4A2374' },
                          { name: 'Ocean Blue', color: '#1A5F7A' },
                          { name: 'Sunset Orange', color: '#D4621A' },
                          { name: 'Slate Gray', color: '#6B7280' },
                          { name: 'Emerald', color: '#27AE60' }
                        ].map((theme) => (
                          <button
                            key={theme.color}
                            type="button"
                            onClick={() => setFormData({ ...formData, color: theme.color })}
                            className={`h-12 rounded-lg border-2 transition-all ${
                              formData.color === theme.color
                                ? 'border-walnut shadow-md scale-105'
                                : 'border-walnut/20 hover:border-walnut/40'
                            }`}
                            style={{ backgroundColor: theme.color }}
                            title={theme.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-cream rounded-xl border border-walnut/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-walnut/60 uppercase tracking-wider">Preview</span>
                        <span className="text-xs text-walnut/50">Capacity: {formData.capacity} books</span>
                      </div>
                      <div
                        className="h-8 rounded"
                        style={{
                          background: `linear-gradient(135deg, ${formData.color} 0%, ${formData.color}dd 50%, ${formData.color}bb 100%)`,
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
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
                  className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Add Shelf
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
