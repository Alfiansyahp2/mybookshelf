import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Info, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { useNotifications, type NotificationType } from '../../hooks/useNotifications'

const ICONS: Record<NotificationType, any> = {
  achievement: Trophy,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle
}

const COLORS: Record<NotificationType, { icon: string, bg: string }> = {
  achievement: { icon: '#d97706', bg: '#fef3c7' }, // amber
  info:        { icon: '#3b82f6', bg: '#eff6ff' }, // blue
  success:     { icon: '#10b981', bg: '#d1fae5' }, // green
  warning:     { icon: '#ef4444', bg: '#fee2e2' }, // red
}

// Automatically removes toasts after 5 seconds
export default function ToastContainer() {
  const { notifications, markAsRead } = useNotifications()

  // Only show unread notifications that were created in the last 10 seconds as toasts
  const recentUnread = notifications.filter(n => {
    if (n.read) return false
    const ageMs = new Date().getTime() - new Date(n.date).getTime()
    return ageMs < 10000 // 10 seconds
  }).slice(0, 3) // max 3 toasts at a time

  useEffect(() => {
    // Auto mark as read after 5 seconds
    const timers = recentUnread.map(n => 
      setTimeout(() => markAsRead(n.id), 5000)
    )
    return () => timers.forEach(clearTimeout)
  }, [recentUnread, markAsRead])

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {recentUnread.map((notif) => {
          const Icon = ICONS[notif.type] || Info
          const style = COLORS[notif.type]

          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-start gap-3 w-80 bg-white rounded-xl shadow-xl border border-walnut/10 p-3 overflow-hidden"
              style={{
                background: `linear-gradient(to right, white, ${style.bg}33)`
              }}
            >
              {/* Left indicator line */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1" 
                style={{ backgroundColor: style.icon }} 
              />
              
              <div className="flex-shrink-0 ml-1">
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full mt-0.5"
                  style={{ backgroundColor: style.bg }}
                >
                  <Icon size={16} color={style.icon} />
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-sm font-bold text-darkBrown truncate">
                  {notif.title}
                </h4>
                <p className="text-xs text-walnut/80 mt-0.5 leading-snug">
                  {notif.message}
                </p>
              </div>

              <button
                onClick={() => markAsRead(notif.id)}
                className="absolute top-2 right-2 p-1.5 rounded-md text-walnut/40 hover:bg-black/5 hover:text-darkBrown transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
