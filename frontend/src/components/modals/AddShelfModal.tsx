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
            className="px-4 py-2 bg-walnut/20 text-walnut rounded-lg hover:bg-walnut/30 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createShelf.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Shelf
          </button>
        </div>
      </form>
    </Modal>
  )
}
