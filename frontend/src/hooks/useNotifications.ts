import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'achievement' | 'info' | 'success' | 'warning'

export interface AppNotification {
  id: string
  title: string
  message: string
  type: NotificationType
  icon?: string
  date: string
  read: boolean
  link?: string
}

interface NotificationState {
  notifications: AppNotification[]
  addNotification: (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  removeNotification: (id: string) => void
}

export const useNotifications = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (notif) => set((state) => {
        const newNotif: AppNotification = {
          ...notif,
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          read: false
        }
        return { notifications: [newNotif, ...state.notifications] }
      }),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      clearAll: () => set({ notifications: [] }),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }),
    { name: 'mybookshelf_notifications' }
  )
)
