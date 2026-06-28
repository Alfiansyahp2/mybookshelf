import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Trash2, AlertTriangle, FileText, Package } from 'lucide-react'
import { useCreateShelf, useUpdateShelf, useDeleteShelf } from '../../hooks/useShelves'
import type { Shelf } from '../../types'

interface ShelfModalProps {
  isOpen: boolean
  onClose: () => void
  shelf?: Shelf | null
  mode?: 'create' | 'update' | 'delete'
}

export default function ShelfModal({
  isOpen,
  onClose,
  shelf,
  mode = 'create'
}: ShelfModalProps) {
  const createShelf = useCreateShelf()
  const updateShelf = useUpdateShelf()
  const deleteShelf = useDeleteShelf()

  const [formData, setFormData] = useState({
    name: '',
    capacity: 10
  })

  // Reset form when modal opens or shelf changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'update' && shelf) {
        setFormData({
          name: shelf.name || '',
          capacity: shelf.capacity || 10
        })
      } else {
        setFormData({
          name: '',
          capacity: 10
        })
      }
    }
  }, [isOpen, shelf, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'delete') {
      // Handle delete separately
      return
    }

    const shelfData = {
      name: formData.name,
      capacity: formData.capacity
    }

    if (mode === 'create') {
      createShelf.mutate(shelfData, {
        onSuccess: () => {
          onClose()
        }
      })
    } else if (mode === 'update' && shelf) {
      updateShelf.mutate(
        { id: shelf.id, updates: shelfData },
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    }
  }

  const handleDelete = () => {
    if (shelf) {
      deleteShelf.mutate(shelf.id, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Shelf'
      case 'update': return 'Edit Shelf'
      case 'delete': return 'Delete Shelf'
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
                          Are you sure you want to delete this shelf?
                        </h3>
                        <p className="text-sm text-red-700">
                          This will permanently delete "<strong>{shelf?.name}</strong>".
                          All books on this shelf will need to be moved to another shelf.
                        </p>
                      </div>
                    </div>

                    {/* Shelf Info */}
                    {shelf && (
                      <div className="p-4 bg-walnut/10 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-walnut/20 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-walnut" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-darkBrown">{shelf.name}</h4>
                            <p className="text-sm text-walnut/70">
                              Capacity: {shelf.capacity} books
                            </p>
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
                    disabled={deleteShelf.isPending}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteShelf.isPending ? 'Deleting...' : 'Delete Shelf'}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
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
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shelf Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Shelf Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Shelf Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          Shelf Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Main Library, Office Shelf"
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          required
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
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                          min="1"
                          max="100"
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          required
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
                  disabled={mode === 'create' ? createShelf.isPending : updateShelf.isPending}
                  className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === 'create' ? (
                    createShelf.isPending ? 'Creating...' : 'Create Shelf'
                  ) : (
                    updateShelf.isPending ? 'Updating...' : 'Update Shelf'
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
