import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthUser } from '../hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import {
  User,
  Bell,
  Palette,
  Database,
  Shield,
  Info,
  Mail,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react'

// Import extracted components
import AccountSettings from '../components/settings/AccountSettings'
import AppPreferences from '../components/settings/AppPreferences'
import DataManagement from '../components/settings/DataManagement'
import AboutSettings from '../components/settings/AboutSettings'

export default function Settings() {
  const { data: authData } = useAuthUser()
  const authUser = authData?.user || authData?.data
  
  const queryClient = useQueryClient()

  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailUpdates: false,
    autoSave: true,
    readingReminders: true
  })

  const [user, setUser] = useState({
    name: 'User Name',
    email: 'booklover@email.com',
    avatar: 'U',
    memberSince: '2024'
  })

  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.name.charAt(0).toUpperCase(),
        memberSince: authUser.created_at ? new Date(authUser.created_at).getFullYear().toString() : '2024'
      })
    }
  }, [authUser])

  const [activeSection, setActiveSection] = useState('account')

  const handleLogout = async () => {
    console.log('Logging out...')
    localStorage.removeItem('user')
    queryClient.clear()
    window.location.href = '/login'
  }

  const handleExportData = () => {
    const data = {
      settings,
      user,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mybookshelf-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const sections = {
    account: {
      title: 'Account Settings',
      icon: User
    },
    preferences: {
      title: 'App Preferences',
      icon: SettingsIcon
    },
    data: {
      title: 'Data Management',
      icon: Database
    },
    about: {
      title: 'About',
      icon: Info
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-darkBrown mb-2">
          Settings
        </h1>
        <p className="text-walnut/70">
          Manage your account and app preferences
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-walnut/10 shadow-sm overflow-hidden">
            {/* User Profile Card */}
            <div className="p-6 border-b border-walnut/10 bg-gradient-to-br from-walnut to-darkBrown">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <p className="text-sm text-walnut/70">{user.email}</p>
                  <p className="text-xs text-walnut/60 mt-1">Member since {user.memberSince}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-2">
              {Object.entries(sections).map(([key, section]) => {
                const Icon = section.icon
                const isActive = activeSection === key

                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-walnut text-white shadow-md'
                        : 'text-walnut/70 hover:bg-walnut/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {activeSection === 'account' && <AccountSettings />}
          {activeSection === 'preferences' && (
            <AppPreferences settings={settings} setSettings={setSettings} />
          )}
          {activeSection === 'data' && (
            <DataManagement handleExportData={handleExportData} handleClearData={handleClearData} />
          )}
          {activeSection === 'about' && <AboutSettings />}
        </div>
      </div>
    </div>
  )
}
