import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FolderOpen, Trash2, AlertTriangle, FileText, Palette } from 'lucide-react'
import { useCreateCollection, useUpdateCollection, useDeleteCollection } from '../../hooks/useCollections'
import type { Collection } from '../../types'

interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
  collection?: Collection | null
  mode?: 'create' | 'update' | 'delete'
}

export default function CollectionModal({
  isOpen,
  onClose,
  collection,
  mode = 'create'
}: CollectionModalProps) {
  const createCollection = useCreateCollection()
  const updateCollection = useUpdateCollection()
  const deleteCollection = useDeleteCollection()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#8B7355'
  })

  // Reset form when modal opens or collection changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'update' && collection) {
        setFormData({
          name: collection.name || '',
          description: collection.description || '',
          color: collection.color || '#8B7355'
        })
      } else {
        setFormData({
          name: '',
          description: '',
          color: '#8B7355'
        })
      }
    }
  }, [isOpen, collection, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'delete') {
      // Handle delete separately
      return
    }

    const collectionData = {
      name: formData.name,
      description: formData.description,
      color: formData.color
    }

    if (mode === 'create') {
      createCollection.mutate(collectionData, {
        onSuccess: () => {
          onClose()
        }
      })
    } else if (mode === 'update' && collection) {
      updateCollection.mutate(
        { id: collection.id, updates: collectionData },
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    }
  }

  const handleDelete = () => {
    if (collection) {
      deleteCollection.mutate(collection.id, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Collection'
      case 'update': return 'Edit Collection'
      case 'delete': return 'Delete Collection'
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
                          Are you sure you want to delete this collection?
                        </h3>
                        <p className="text-sm text-red-700">
                          This will permanently delete "<strong>{collection?.name}</strong>".
                          Books in this collection will not be deleted, but will be removed from the collection.
                        </p>
                      </div>
                    </div>

                    {/* Collection Info */}
                    {collection && (
                      <div className="p-4 bg-walnut/10 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: collection.color }}
                          >
                            <FolderOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-darkBrown">{collection.name}</h4>
                            <p className="text-sm text-walnut/70">
                              {collection.bookIds?.length || 0} books
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
                    disabled={deleteCollection.isPending}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteCollection.isPending ? 'Deleting...' : 'Delete Collection'}
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
                    <FolderOpen className="w-5 h-5 text-walnut" />
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
                  {/* Collection Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Collection Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Collection Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <FolderOpen className="w-4 h-4 inline mr-1" />
                          Collection Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Science Fiction, Best of 2024, Summer Reads"
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          required
                        />
                      </div>

                      {/* Color */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Palette className="w-4 h-4 inline mr-1" />
                          Collection Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-12 h-12 rounded-xl cursor-pointer border-2 border-walnut/30"
                          />
                          <input
                            type="text"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            placeholder="#8B7355"
                            className="flex-1 px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          />
                        </div>
                        <p className="text-xs text-walnut/60 mt-1">
                          Choose a color to represent this collection
                        </p>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <FileText className="w-4 h-4 inline mr-1" />
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Optional description for this collection..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm resize-none"
                        />
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
                  disabled={mode === 'create' ? createCollection.isPending : updateCollection.isPending}
                  className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === 'create' ? (
                    createCollection.isPending ? 'Creating...' : 'Create Collection'
                  ) : (
                    updateCollection.isPending ? 'Updating...' : 'Update Collection'
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
