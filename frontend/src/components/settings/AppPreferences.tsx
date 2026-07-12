import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sun, Moon, Palette, Bell, Mail, Database, Clock } from 'lucide-react';

interface AppPreferencesProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export default function AppPreferences({ settings, setSettings }: AppPreferencesProps) {
  const preferencesItems = [
    {
      label: 'Theme',
      description: 'Choose your preferred appearance',
      icon: Palette,
      type: 'toggle',
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
      label: 'AutoSave',
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
  ];

  return (
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
          {preferencesItems.map((item) => (
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
                    setSettings({ ...settings, theme: item.value ? 'light' : 'dark' });
                  } else {
                    setSettings({ ...settings, [item.label.toLowerCase()]: !item.value });
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
  );
}
