import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, Trash2, AlertTriangle, FileText } from 'lucide-react'
import { useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../hooks/useRooms'
import type { Room } from '../../types'

interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  room?: Room | null
  mode?: 'create' | 'update' | 'delete'
}

export default function RoomModal({
  isOpen,
  onClose,
  room,
  mode = 'create'
}: RoomModalProps) {
  const createRoom = useCreateRoom()
  const updateRoom = useUpdateRoom()
  const deleteRoom = useDeleteRoom()

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  // Reset form when modal opens or room changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'update' && room) {
        setFormData({
          name: room.name || '',
          description: room.description || ''
        })
      } else {
        setFormData({
          name: '',
          description: ''
        })
      }
    }
  }, [isOpen, room, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'delete') {
      // Handle delete separately
      return
    }

    const roomData = {
      name: formData.name,
      description: formData.description
    }

    if (mode === 'create') {
      createRoom.mutate(roomData, {
        onSuccess: () => {
          onClose()
        }
      })
    } else if (mode === 'update' && room) {
      updateRoom.mutate(
        { id: room.id, updates: roomData },
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    }
  }

  const handleDelete = () => {
    if (room) {
      deleteRoom.mutate(room.id, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Room'
      case 'update': return 'Edit Room'
      case 'delete': return 'Delete Room'
    }
  }

  const getIcon = () => {
    return Home
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
                          Are you sure you want to delete this room?
                        </h3>
                        <p className="text-sm text-red-700">
                          This will permanently delete "<strong>{room?.name}</strong>".
                          All shelves and books in this room will also be deleted.
                        </p>
                      </div>
                    </div>

                    {/* Room Info */}
                    {room && (
                      <div className="p-4 bg-walnut/10 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-walnut/20 rounded-xl flex items-center justify-center">
                            <Home className="w-6 h-6 text-walnut" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-darkBrown">{room.name}</h4>
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
                    disabled={deleteRoom.isPending}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteRoom.isPending ? 'Deleting...' : 'Delete Room'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }

  const Icon = getIcon()

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
                    <Icon className="w-5 h-5 text-walnut" />
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
                  {/* Room Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">Room Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Room Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                          <Home className="w-4 h-4 inline mr-1" />
                          Room Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Living Room, Office, Bedroom"
                          className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                          required
                        />
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
                          placeholder="Optional description for this room..."
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
                  disabled={mode === 'create' ? createRoom.isPending : updateRoom.isPending}
                  className="px-6 py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === 'create' ? (
                    createRoom.isPending ? 'Creating...' : 'Create Room'
                  ) : (
                    updateRoom.isPending ? 'Updating...' : 'Update Room'
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
