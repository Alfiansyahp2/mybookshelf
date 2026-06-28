import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Mail, Lock, Eye, EyeOff, User, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLogin, useRegister, useAuthUser } from '../hooks/useAuth'
import { authApi } from '../lib/api/auth'

// Debug: expose authApi to window for testing
declare global {
  interface Window {
    testLogin?: () => void;
    authApi?: typeof authApi;
  }
}

export default function Login() {
  const navigate = useNavigate()
  const login = useLogin()
  const register = useRegister()
  const { data: user } = useAuthUser()

  // Debug: make authApi available in browser console
  useEffect(() => {
    window.authApi = authApi;
    window.testLogin = async () => {
      try {
        console.log('Testing login API directly...');
        const result = await authApi.login({
          email: 'test@example.com',
          password: 'password'
        });
        console.log('Direct login test result:', result);
        alert('Login test successful! Check console for details.');
      } catch (error) {
        console.error('Direct login test error:', error);
        alert('Login test failed! Check console for details.');
      }
    };
    console.log('Debug functions available: window.testLogin() and window.authApi');
  }, [])

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData && user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const authFn = isLogin ? login : register
    const credentials = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        }

    console.log('Submitting credentials:', { isLogin, credentials })

    authFn.mutate(credentials as any, {
      onSuccess: (data) => {
        console.log(`${isLogin ? 'Login' : 'Registration'} successful:`, data)
        console.log('Session established, navigating to dashboard...')

        // Add small delay to ensure session is established and queries are updated
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 100)
      },
      onError: (error: any) => {
        console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error)
        console.error('Error response:', error.response)
        console.error('Error message:', error.message)

        // Show more detailed error message
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
        alert(`${isLogin ? 'Login' : 'Registration'} failed: ${errorMessage}`)
      }
    })
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '', password_confirmation: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(139, 115, 85, 0.03) 50px, rgba(139, 115, 85, 0.03) 51px),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(139, 115, 85, 0.03) 50px, rgba(139, 115, 85, 0.03) 51px)
          `
        }}
      />

      {/* Library-themed Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Books */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] text-6xl opacity-20"
        >
          📚
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] text-4xl opacity-15"
        >
          📖
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[30%] left-[15%] text-5xl opacity-10"
        >
          📕
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md relative z-10"
          >
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{
                border: '2px solid rgba(139, 115, 85, 0.2)',
                boxShadow: `
                  0 20px 60px rgba(139, 115, 85, 0.3),
                  0 0 0 1px rgba(139, 115, 85, 0.1) inset
                `
              }}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 p-8 text-center">
                {/* Book Icon */}
                <motion.div
                  initial={{ rotate: -12 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <BookOpen className="w-full h-full text-white" />
                </motion.div>

                <h1 className="text-3xl font-serif font-bold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Join Library'}
                </h1>
                <p className="text-amber-100 text-sm">
                  {isLogin
                    ? 'Sign in to access your book collection'
                    : 'Create your personal library'}
                </p>

                {/* Decorative Element */}
                <div className="mt-4 flex justify-center gap-2">
                  <div className="w-8 h-1 bg-white/30 rounded-full" />
                  <div className="w-2 h-1 bg-white/30 rounded-full" />
                  <div className="w-8 h-1 bg-white/30 rounded-full" />
                </div>
              </div>

              {/* Form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-darkBrown mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-amber-50/30 border-2 border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-walnut transition-all text-sm"
                        placeholder="your@email.com"
                        style={{ fontFamily: 'Georgia, serif' }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-darkBrown mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 bg-amber-50/30 border-2 border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-walnut transition-all text-sm"
                        placeholder="•••••••••"
                        style={{ fontFamily: 'Georgia, serif' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-walnut/40 hover:text-walnut/60 transition-colors z-10"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Register Additional Fields */}
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-darkBrown mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-5 h-5" />
                          <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-amber-50/30 border-2 border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-walnut transition-all text-sm"
                            placeholder="John Doe"
                            style={{ fontFamily: 'Georgia, serif' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-darkBrown mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-5 h-5" />
                          <input
                            type="password"
                            required
                            value={formData.password_confirmation || ''}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-amber-50/30 border-2 border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-walnut transition-all text-sm"
                            placeholder="•••••••••"
                            style={{ fontFamily: 'Georgia, serif' }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={login.isPending || register.isPending}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {(login.isPending || register.isPending) ? (
                      <>{isLogin ? 'Signing in...' : 'Creating account...'}</>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  {/* Toggle Mode */}
                  <div className="text-center mt-6">
                    <p className="text-walnut/70 text-sm">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-amber-700 font-semibold hover:text-amber-800 hover:underline ml-1 transition-colors"
                      >
                        {isLogin ? 'Create one' : 'Sign in'}
                      </button>
                    </p>
                  </div>

                  {/* Demo Credentials - Only show for login */}
                  {isLogin && (
                    <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-walnut/20">
                      <p className="text-xs text-walnut/60 text-center mb-2">
                        Demo Credentials:
                      </p>
                      <div className="text-xs text-walnut/80 text-center space-y-1">
                        <p><strong>Email:</strong> test@example.com</p>
                        <p><strong>Password:</strong> password</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

      {/* Footer */}
      <div className="text-center mt-8 text-walnut/60 text-sm">
        <p>© 2024 MyBookshelf - Your Personal Library</p>
      </div>
    </div>
  )
}
