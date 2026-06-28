import { MessageSquare, Edit3 } from 'lucide-react'

interface BookNotesSectionProps {
  userNotes: string
  tempNotes: string
  isEditingNotes: boolean
  updateNotes: { isPending: boolean }
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onTempNotesChange: (notes: string) => void
}

export default function BookNotesSection({
  userNotes,
  tempNotes,
  isEditingNotes,
  updateNotes,
  onEdit,
  onSave,
  onCancel,
  onTempNotesChange
}: BookNotesSectionProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-walnut/10 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-darkBrown flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-walnut" />
          Personal Notes
        </h3>
        {!isEditingNotes ? (
          <button
            onClick={onEdit}
            className="text-xs text-walnut hover:text-darkBrown flex items-center gap-1 transition-colors"
          >
            <Edit3 size={14} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              disabled={updateNotes.isPending}
              className="text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {!isEditingNotes ? (
        <div className="p-3 bg-walnut/10 rounded-lg min-h-[80px] max-h-[150px] overflow-y-auto">
          <p className="text-sm text-darkBrown whitespace-pre-wrap">
            {userNotes || 'No notes yet. Add your thoughts about this book...'}
          </p>
        </div>
      ) : (
        <textarea
          value={tempNotes}
          onChange={(e) => onTempNotesChange(e.target.value)}
          className="w-full h-24 p-3 bg-white border border-walnut/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 resize-none"
          placeholder="Add your thoughts, quotes, or memories..."
        />
      )}
    </div>
  )
}
