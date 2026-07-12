import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'

interface RegisterFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function RegisterForm({ formData, setFormData, onSubmit, isLoading }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold tracking-wider text-walnut uppercase mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-4 h-4" />
          <input
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:border-walnut focus:ring-1 focus:ring-walnut transition-all text-sm"
            placeholder="John Doe"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-bold tracking-wider text-walnut uppercase mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-4 h-4" />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:border-walnut focus:ring-1 focus:ring-walnut transition-all text-sm"
            placeholder="your@email.com"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-bold tracking-wider text-walnut uppercase mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-4 h-4" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:border-walnut focus:ring-1 focus:ring-walnut transition-all text-sm"
            placeholder="••••••••"
            style={{ fontFamily: 'Georgia, serif' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-walnut/40 hover:text-walnut/60 transition-colors z-10"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-bold tracking-wider text-walnut uppercase mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-4 h-4" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.password_confirmation || ''}
            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:border-walnut focus:ring-1 focus:ring-walnut transition-all text-sm"
            placeholder="••••••••"
            style={{ fontFamily: 'Georgia, serif' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-walnut/40 hover:text-walnut/60 transition-colors z-10"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-walnut text-white rounded-lg font-medium shadow-md hover:bg-darkBrown transition-colors hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Create Library Card'
          )}
        </button>
      </div>
    </form>
  )
}
