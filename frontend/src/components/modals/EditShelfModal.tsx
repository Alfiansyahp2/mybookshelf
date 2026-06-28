import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Layers, Package, FileText } from 'lucide-react'
import { useUpdateShelf } from '../../hooks/useShelves'
import type { Shelf } from '../../types'

interface EditShelfModalProps {
  shelf: Shelf | null
  isOpen: boolean
  onClose: () => void
}

export default function EditShelfModal({
  shelf,
  isOpen,
  onClose,
}: EditShelfModalProps) {
  const updateShelf = useUpdateShelf()

  const [formData, setFormData] = useState({
    name: '',
    capacity: 10,
  })

  // Reset form when shelf changes
  useEffect(() => {
    if (shelf) {
      setFormData({
        name: shelf.name || '',
        capacity: shelf.capacity || 10,
      })
    }
  }, [shelf])

  // Early return if no shelf
  if (!shelf) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateShelf.mutate(
      {
        id: shelf.id,
        updates: {
          name: formData.name,
          capacity: formData.capacity,
        }
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-walnut/10 bg-gradient-to-r from-walnut/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-walnut/10 rounded-xl flex items-center justify-center">
                    <Layers className="w-5 h-5 text-walnut" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-darkBrown">Edit Shelf</h2>
                    <p className="text-sm text-walnut/60">{shelf.name}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Shelf Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Layers className="w-4 h-4 inline mr-1" />
                          Shelf Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          placeholder="My Bookshelf"
                        />
                      </div>

                      {/* Capacity */}
                      <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Package className="w-4 h-4 inline mr-1" />
                          Capacity (books) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                        />
                        <p className="text-xs text-walnut/60 mt-1">
                          Maximum number of books this shelf can hold
                        </p>
                      </div>
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
                  disabled={updateShelf.isPending}
                  className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateShelf.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
