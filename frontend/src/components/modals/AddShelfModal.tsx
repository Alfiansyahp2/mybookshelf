import { useState } from 'react'
import Modal from '../ui/Modal'
import { useCreateShelf } from '../../hooks/useShelves'
import type { Shelf } from '../../types'
import { Plus, X } from 'lucide-react'

interface AddShelfModalProps {
  isOpen: boolean
  onClose: () => void
  onShelfAdded?: (shelf: Shelf) => void
}

export default function AddShelfModal({
  isOpen,
  onClose,
  onShelfAdded
}: AddShelfModalProps) {
  const createShelf = useCreateShelf()

  const [formData, setFormData] = useState({
    name: '',
    capacity: 10,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createShelf.mutate(formData, {
      onSuccess: (data) => {
        if (onShelfAdded && data) {
          onShelfAdded(data)
        }
        onClose()
        // Reset form
        setFormData({ name: '', capacity: 10 })
      },
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Shelf"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-darkBrown mb-1">
            Shelf Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30"
            placeholder="My Bookshelf"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-darkBrown mb-1">
            Capacity (max books)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-walnut/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut/30"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-walnut/10 justify-end">
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
            disabled={createShelf.isPending}
            title="Add Shelf"
            className="px-4 py-2 bg-white text-darkBrown border border-walnut/20 rounded-xl hover:bg-cream transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </Modal>
  )
}
