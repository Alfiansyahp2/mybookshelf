import { motion } from 'framer-motion'
import { CheckCircle, Circle, Heart, BookOpen, ArrowRight } from 'lucide-react'
import type { TimelineEvent } from '../types'

interface TimelineProps {
  events: TimelineEvent[]
  compact?: boolean
}

export default function Timeline({ events, compact = false }: TimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'added':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">📚</div>
      case 'started':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><BookOpen size={16} /></div>
      case 'progress':
        return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><ArrowRight size={16} /></div>
      case 'finished':
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"><CheckCircle size={16} /></div>
      case 'favorited':
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Heart size={16} /></div>
      case 'loaned':
        return <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">📤</div>
      case 'returned':
        return <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">📥</div>
      default:
        return <Circle size={32} className="text-walnut/30" />
    }
  }

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'added': return 'border-blue-300'
      case 'started': return 'border-green-300'
      case 'progress': return 'border-purple-300'
      case 'finished': return 'border-yellow-300'
      case 'favorited': return 'border-red-300'
      case 'loaned': return 'border-orange-300'
      case 'returned': return 'border-teal-300'
      default: return 'border-walnut/30'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-walnut/20" />

      {/* Events */}
      <div className="space-y-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-12"
          >
            {/* Icon */}
            <div
              className="absolute left-0 z-10"
              style={{
                transform: 'translateX(-50%)'
              }}
            >
              {getEventIcon(event.type)}
            </div>

            {/* Dot on Line */}
            <div
              className="absolute left-4 w-3 h-3 rounded-full border-2 bg-white"
              style={{
                transform: 'translateX(-50%)',
                borderColor: getEventColor(event.type)
              }}
            />

            {/* Content */}
            <div
              className={`bg-white rounded-xl p-4 border shadow-sm transition-all hover:shadow-md ${compact ? '' : 'p-6'}`}
              style={{ borderColor: `rgba(122, 92, 66, ${compact ? '0.1' : '0.15'})` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-darkBrown capitalize">{event.type}</div>
                  <div className="text-sm text-walnut/70 mt-1">{event.description}</div>
                </div>
                <div className="text-xs text-walnut/50 whitespace-nowrap">
                  {formatDate(event.date)}
                  {!compact && (
                    <>
                      <div className="text-walnut/30">·</div>
                      <div>{formatTime(event.date)}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Metadata */}
              {event.metadata && (
                <div className="mt-3 pt-3 border-t border-walnut/10">
                  {event.metadata.duration && (
                    <div className="text-sm text-walnut/70">
                      Duration: {event.metadata.duration}
                    </div>
                  )}
                  {event.metadata.pagesRead && (
                    <div className="text-sm text-walnut/70">
                      Pages: {event.metadata.pagesRead.from} → {event.metadata.pagesRead.to}
                    </div>
                  )}
                  {event.metadata.sessionCount && (
                    <div className="text-sm text-walnut/70">
                      Sessions: {event.metadata.sessionCount}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
