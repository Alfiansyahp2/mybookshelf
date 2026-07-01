import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Trophy, Info, CheckCircle, AlertTriangle, X, Check, Trash2, ExternalLink } from 'lucide-react'
import { useNotifications, type NotificationType } from '../hooks/useNotifications'
import { Link } from 'react-router-dom'

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

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { notifications, markAsRead, markAllAsRead, clearAll, removeNotification } = useNotifications()

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (isoStr: string) => {
    const date = new Date(isoStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} mnt lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays === 1) return 'Kemarin'
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full transition-colors hover:bg-walnut/10 text-darkBrown focus:outline-none"
        title="Notifikasi"
      >
        <Bell size={20} className={unreadCount > 0 ? 'fill-current opacity-20' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-cream">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-cream border border-walnut/15 shadow-xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-walnut/10 bg-white/50">
              <h3 className="font-serif font-bold text-darkBrown text-lg">Notifikasi</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="p-1.5 rounded-md hover:bg-walnut/10 text-walnut transition-colors" title="Tandai semua dibaca">
                    <Check size={16} />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors" title="Hapus semua">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-2" style={{ maxHeight: 400 }}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-walnut/50">
                  <Bell size={32} className="mb-2 opacity-50" />
                  <p className="text-sm font-medium">Belum ada notifikasi</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {notifications.map((notif) => {
                    const Icon = ICONS[notif.type] || Info
                    const style = COLORS[notif.type]
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className={`group relative flex gap-3 p-3 rounded-xl transition-all ${
                          notif.read ? 'bg-transparent hover:bg-white/40' : 'bg-white shadow-sm border border-walnut/5'
                        }`}
                        onClick={() => !notif.read && markAsRead(notif.id)}
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: style.bg }}>
                            <Icon size={18} color={style.icon} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className={`text-sm font-bold truncate pr-4 ${notif.read ? 'text-darkBrown/70' : 'text-darkBrown'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-walnut/50 whitespace-nowrap flex-shrink-0">
                              {formatDate(notif.date)}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${notif.read ? 'text-walnut/60' : 'text-walnut/90'}`}>
                            {notif.message}
                          </p>

                          {notif.link && (
                            <Link
                              to={notif.link}
                              onClick={() => { setIsOpen(false); markAsRead(notif.id) }}
                              className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-walnut hover:text-darkBrown transition-colors"
                            >
                              Lihat detail <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>

                        {/* Unread dot */}
                        {!notif.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
                        )}

                        {/* Delete single button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeNotification(notif.id) }}
                          className="absolute bottom-2 right-2 p-1.5 rounded-md text-walnut/30 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
