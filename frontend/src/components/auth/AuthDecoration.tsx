import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

interface AuthDecorationProps {
  isLogin: boolean;
}

export default function AuthDecoration({ isLogin }: AuthDecorationProps) {
  return (
    <>
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

    </>
  )
}
