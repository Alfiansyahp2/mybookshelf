import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLogin, useRegister, useAuthUser } from '../hooks/useAuth'
import { useNotifications } from '../hooks/useNotifications'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import AuthDecoration from '../components/auth/AuthDecoration'
import AuthLeftPage from '../components/auth/AuthLeftPage'

export default function Login() {
  const navigate = useNavigate()
  const login = useLogin()
  const register = useRegister()
  const { data: user } = useAuthUser()
  const addNotification = useNotifications(state => state.addNotification)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData && user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

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

    authFn.mutate(credentials as any, {
      onSuccess: () => {
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 100)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
        addNotification({
          title: `${isLogin ? 'Login' : 'Registration'} failed`,
          message: errorMessage,
          type: 'warning'
        })
      }
    })
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '', password_confirmation: '' })
  }

  const isLoading = login.isPending || register.isPending

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center p-4">
      
      {/* Extracted Decoration & Background */}
      <AuthDecoration isLogin={isLogin} />

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
              
              {/* Left Page (Welcome Art) */}
              <AuthLeftPage isLogin={isLogin} />

              {/* Right Page */}
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
                  
                  {isLogin ? (
                    <LoginForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      onSubmit={handleSubmit} 
                      isLoading={isLoading}
                    />
                  ) : (
                    <RegisterForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      onSubmit={handleSubmit} 
                      isLoading={isLoading}
                    />
                  )}

                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-walnut/70 hover:text-walnut text-sm font-medium transition-colors"
                    >
                      {isLogin ? "Don't have a library card? Create one" : 'Already have a library card? Sign in'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  )
}
