import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

interface AuthLeftPageProps {
  isLogin: boolean;
}

export default function AuthLeftPage({ isLogin }: AuthLeftPageProps) {
  return (
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
  )
}
