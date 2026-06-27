import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Palette,
  Database,
  Shield,
  Info,
  Moon,
  Sun,
  Mail,
  BookOpen,
  Download,
  Trash2,
  Settings as SettingsIcon,
  LogOut,
  Clock,
  Award,
  GitBranch,
  TrendingUp
} from 'lucide-react'

export default function Settings() {
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

  const [activeSection, setActiveSection] = useState('account')

  const handleLogout = () => {
    console.log('Logging out...')
    // TODO: Implement logout logic
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
      icon: User,
      items: [
        {
          label: 'Profile Information',
          description: 'Update your personal information',
          icon: User,
          action: 'edit-profile'
        },
        {
          label: 'Change Password',
          description: 'Update your security credentials',
          icon: Shield,
          action: 'change-password'
        },
        {
          label: 'Email Preferences',
          description: 'Manage email notifications',
          icon: Mail,
          action: 'email-preferences'
        }
      ]
    },
    preferences: {
      title: 'App Preferences',
      icon: SettingsIcon,
      items: [
        {
          label: 'Theme',
          description: 'Choose your preferred appearance',
          icon: Palette,
          type: 'toggle',
          options: ['Light', 'Dark'],
          value: settings.theme === 'dark'
        },
        {
          label: 'Notifications',
          description: 'Enable push notifications',
          icon: Bell,
          type: 'toggle',
          value: settings.notifications
        },
        {
          label: 'Email Updates',
          description: 'Receive weekly reading summaries',
          icon: Mail,
          type: 'toggle',
          value: settings.emailUpdates
        },
        {
          label: 'Auto-save',
          description: 'Automatically save changes',
          icon: Database,
          type: 'toggle',
          value: settings.autoSave
        },
        {
          label: 'Reading Reminders',
          description: 'Get reminded to read daily',
          icon: Clock,
          type: 'toggle',
          value: settings.readingReminders
        }
      ]
    },
    data: {
      title: 'Data Management',
      icon: Database,
      items: [
        {
          label: 'Export Data',
          description: 'Download your library data',
          icon: Download,
          action: 'export'
        },
        {
          label: 'Clear All Data',
          description: 'Delete all books and settings',
          icon: Trash2,
          action: 'clear',
          danger: true
        }
      ]
    },
    about: {
      title: 'About',
      icon: Info,
      items: [
        {
          label: 'Version',
          description: 'MyBookshelf v1.0.0',
          icon: Info,
          static: true
        },
        {
          label: 'Website',
          description: 'Visit our official website',
          icon: BookOpen,
          action: 'website',
          external: true
        },
        {
          label: 'GitHub',
          description: 'View source code on GitHub',
          icon: GitBranch,
          action: 'github',
          external: true
        }
      ]
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
          {/* Account Section */}
          {activeSection === 'account' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
                <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-walnut mb-2">Display Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-walnut mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-cream/30 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-walnut font-semibold text-lg">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-sm text-walnut/60">Avatar</p>
                      <p className="text-xs text-walnut/50">First letter of your name</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
                <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  App Preferences
                </h2>
                <div className="space-y-4">
                  {sections.preferences.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-4 bg-cream/30 rounded-xl hover:bg-cream/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.value ? 'bg-walnut text-white' : 'bg-walnut/20 text-walnut'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-darkBrown">{item.label}</p>
                          <p className="text-sm text-walnut/70">{item.description}</p>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => {
                          if (item.label === 'Theme') {
                            setSettings({ ...settings, theme: item.value ? 'light' : 'dark' })
                          } else {
                            setSettings({ ...settings, [item.label.toLowerCase()]: !item.value })
                          }
                        }}
                        className={`w-14 h-8 rounded-full transition-all duration-300 ${
                          item.value ? 'bg-walnut' : 'bg-walnut/30'
                        } relative`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
                            item.value ? 'translate-x-3' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme Preview */}
              <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
                <h3 className="text-lg font-semibold text-darkBrown mb-4">Theme Preview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border-2 border-walnut/20 rounded-xl">
                    <Sun className="w-5 h-5 text-yellow-500 mb-2" />
                    <p className="text-sm text-walnut/70">Light Mode</p>
                  </div>
                  <div className="p-4 bg-darkBrown border-2 border-walnut/30 rounded-xl">
                    <Moon className="w-5 h-5 text-walnut/70 mb-2" />
                    <p className="text-sm text-walnut/70">Dark Mode</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Data Section */}
          {activeSection === 'data' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
                <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center gap-3 px-4 py-4 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Export All Data</span>
                  </button>

                  <div className="bg-cream/30 rounded-xl p-4">
                    <p className="text-sm text-walnut/80 mb-2">
                      This will download all your books, settings, and reading progress as a JSON file that you can import later.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-walnut/60">
                      <Database className="w-4 h-4" />
                      <span>File size: ~50KB</span>
                    </div>
                  </div>

                  <button
                    onClick={handleClearData}
                    className="w-full flex items-center gap-3 px-4 py-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border-2 border-red-200"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-medium">Clear All Data</span>
                  </button>

                  <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>Warning:</strong> This will permanently delete all your books, settings, and reading progress. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
                <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About MyBookshelf
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-cream/30 rounded-xl">
                    <p className="text-sm text-walnut/80 mb-3">
                      MyBookshelf is a beautiful and intuitive digital library management system designed for book lovers.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-walnut" />
                        <span className="text-walnut/80">Organize your personal library</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-walnut" />
                        <span className="text-walnut/80">Track reading progress</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-walnut" />
                        <span className="text-walnut/80">Achieve reading goals</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-walnut/20 hover:border-walnut/40 transition-colors">
                      <div>
                        <p className="font-medium text-darkBrown">Version</p>
                        <p className="text-sm text-walnut/70">1.0.0</p>
                      </div>
                      <Info className="w-5 h-5 text-walnut/40" />
                    </div>

                    <a
                      href="https://mybookshelf.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-walnut/20 hover:border-walnut/40 hover:bg-walnut/5 transition-colors group"
                    >
                      <div>
                        <p className="font-medium text-darkBrown group-hover:text-walnut transition-colors">Website</p>
                        <p className="text-sm text-walnut/70">Visit our official website</p>
                      </div>
                      <BookOpen className="w-5 h-5 text-walnut/40 group-hover:text-walnut transition-colors" />
                    </a>

                    <a
                      href="https://github.com/mybookshelf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-walnut/20 hover:border-walnut/40 hover:bg-walnut/5 transition-colors group"
                    >
                      <div>
                        <p className="font-medium text-darkBrown group-hover:text-walnut transition-colors">GitHub</p>
                        <p className="text-sm text-walnut/70">View source code</p>
                      </div>
                      <GitBranch className="w-5 h-5 text-walnut/40 group-hover:text-walnut transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
