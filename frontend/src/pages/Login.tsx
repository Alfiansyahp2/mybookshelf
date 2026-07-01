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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center p-4">
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
            key="login-book"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6, type: 'spring', damping: 20 }}
            className="w-full max-w-4xl h-[600px] relative z-10 mx-auto"
            style={{ perspective: '2000px' }}
          >
            {/* Hardcover Backing */}
            <div className="absolute inset-[-12px] bg-[#5C4532] rounded-xl shadow-2xl" style={{
              boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 2px 10px rgba(0,0,0,0.5)',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")'
            }} />
            
            {/* Pages Container */}
            <div className="absolute inset-0 flex bg-[#fdfbf7] rounded-md shadow-inner overflow-hidden" style={{
              boxShadow: 'inset 0 0 0 1px rgba(139, 115, 85, 0.2)'
            }}>
              
              {/* Book Spine / Center Fold Shadow */}
              <div className="absolute top-0 bottom-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-20" />
              
              {/* Left Page - Welcome & Art */}
              <div className="w-1/2 bg-gradient-to-br from-[#fdfbf7] to-[#f4f1ea] border-r border-walnut/20 p-10 flex flex-col justify-center relative overflow-hidden" style={{
                boxShadow: 'inset -20px 0 30px -20px rgba(0,0,0,0.15)'
              }}>
              {/* Subtle page texture */}
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(139, 115, 85, 0.05) 24px, rgba(139, 115, 85, 0.05) 25px)'
              }} />
              
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 bg-walnut text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3"
                >
                  <BookOpen size={48} />
                </motion.div>
                
                <h1 className="text-4xl font-serif font-bold text-darkBrown mb-4 leading-tight">
                  {isLogin ? 'Welcome Back\nto Your Library' : 'Begin Your\nReading Journey'}
                </h1>
                <p className="text-walnut/80 text-sm leading-relaxed max-w-xs mx-auto">
                  {isLogin
                    ? 'Open the pages of your collection and continue exactly where you left off.'
                    : 'Create your personal catalog and organize your reading life beautifully.'}
                </p>

                {/* Decorative Element */}
                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-10 h-1 bg-walnut/20 rounded-full" />
                  <div className="w-3 h-1 bg-walnut/20 rounded-full" />
                  <div className="w-10 h-1 bg-walnut/20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right Page - Form */}
            <div className="w-1/2 bg-gradient-to-bl from-[#fdfbf7] to-[#f4f1ea] p-10 flex flex-col justify-center relative" style={{
              boxShadow: 'inset 20px 0 30px -20px rgba(0,0,0,0.15)'
            }}>
              {/* Subtle page texture */}
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(139, 115, 85, 0.05) 24px, rgba(139, 115, 85, 0.05) 25px)'
              }} />

              <div className="relative z-10 w-full max-w-sm mx-auto">
                <h2 className="text-2xl font-serif font-bold text-darkBrown mb-6 text-center">
                  {isLogin ? 'Sign In' : 'Register'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Register Fields */}
                  <AnimatePresence mode="popLayout">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-5"
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                  <AnimatePresence mode="popLayout">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div>
                          <label className="block text-xs font-bold tracking-wider text-walnut uppercase mb-1">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 w-4 h-4" />
                            <input
                              type="password"
                              required
                              value={formData.password_confirmation || ''}
                              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-walnut/20 rounded-lg focus:outline-none focus:border-walnut focus:ring-1 focus:ring-walnut transition-all text-sm"
                              placeholder="••••••••"
                              style={{ fontFamily: 'Georgia, serif' }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={login.isPending || register.isPending}
                    className="w-full py-3 mt-4 bg-walnut text-white rounded-lg font-serif font-bold tracking-wide shadow-md hover:bg-darkBrown transition-all flex items-center justify-center gap-2"
                  >
                    {(login.isPending || register.isPending) ? (
                      <span className="animate-pulse">{isLogin ? 'Opening Book...' : 'Signing Card...'}</span>
                    ) : (
                      <>
                        {isLogin ? 'Open Book' : 'Register'}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Toggle Mode */}
                  <div className="text-center mt-6">
                    <p className="text-walnut/70 text-xs font-medium">
                      {isLogin ? "Don't have a library card? " : "Already have a card? "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-darkBrown font-bold hover:underline ml-1 transition-colors"
                      >
                        {isLogin ? 'Register' : 'Sign in'}
                      </button>
                    </p>
                  </div>

                  {/* Demo Credentials */}
                  {isLogin && (
                    <div className="mt-4 p-3 bg-walnut/5 rounded-lg border border-walnut/10">
                      <p className="text-[10px] text-walnut/60 text-center uppercase tracking-wider mb-1 font-bold">
                        Demo Credentials
                      </p>
                      <div className="text-xs text-walnut/80 text-center flex justify-center gap-4">
                        <span><strong>Email:</strong> test@example.com</span>
                        <span><strong>Pass:</strong> password</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            </div>
          </motion.div>
        </AnimatePresence>

      {/* Footer */}
      <div className="text-center mt-8 text-walnut/60 text-sm">
        <p>© 2026 MyBookshelf - Your Personal Library</p>
      </div>
    </div>
  )
}
