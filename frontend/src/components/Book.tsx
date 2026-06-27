import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Book } from '../types'

interface BookProps {
  book: Book
  onClick: () => void
  isDrawerOpen?: boolean
}

// Height mappings (in pixels)
const heights = {
  short: '160px',
  medium: '190px',
  tall: '220px'
}

// Width mappings (thickness in pixels)
const widths = {
  thin: '24px',
  regular: '28px',
  thick: '36px'
}

export default function Book({ book, onClick, isDrawerOpen }: BookProps) {
  console.log('Book rendered:', book.title, '- isDrawerOpen:', isDrawerOpen)

  const [isClicked, setIsClicked] = useState(false)
  const isReading = book.status === 'reading'
  const isFinished = book.status === 'finished'
  const isFavorite = book.favorite

  // Sync clicked state with drawer - only animate if THIS book is selected
  useEffect(() => {
    if (isDrawerOpen) {
      setIsClicked(true)
    } else {
      // Small delay to allow exit animation to play
      const timeout = setTimeout(() => {
        setIsClicked(false)
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [isDrawerOpen])

  return (
    <motion.div
      className="book relative cursor-pointer"
      style={{
        height: heights[book.height],
        width: widths[book.thickness]
      }}
      whileHover={{
        translateZ: 30,
        translateY: -8,
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        console.log('Book clicked:', book.title)
        onClick()
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isClicked ? {
        // SLIDE OUT dari rak
        opacity: 1,
        translateZ: 60,
        translateY: -30,
        translateX: 20,
        rotateY: 15,
        scale: 1.15,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.2)",
        zIndex: 50
      } : {
        // Normal position di rak
        opacity: 1,
        scale: 1,
        translateZ: 0,
        translateY: 0,
        translateX: 0,
        rotateY: 0,
        boxShadow: "none",
        zIndex: 1
      }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {/* Book Spine */}
      <motion.div
        className="book-spine w-full h-full rounded-sm flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[2]} 100%)`,
          boxShadow: `
            2px 0 4px rgba(0, 0, 0, 0.3),
            -1px 0 2px rgba(255, 255, 255, 0.1),
            inset 1px 0 2px rgba(255, 255, 255, 0.2)
          `
        }}
        whileHover={{
          boxShadow: `
            4px 8px 12px rgba(0, 0, 0, 0.4),
            -2px 0 4px rgba(255, 255, 255, 0.15),
            inset 1px 0 2px rgba(255, 255, 255, 0.2)
          `
        }}
        animate={isClicked ? {
          boxShadow: `
            0 30px 60px rgba(0, 0, 0, 0.5),
            0 15px 30px rgba(0, 0, 0, 0.3),
            inset 2px 0 4px rgba(255, 255, 255, 0.3),
            inset -2px 0 4px rgba(0, 0, 0, 0.15)
          `
        } : {}}
      >
        {/* Book texture overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(180deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px)'
          }}
        />

        {/* Book Title on Spine */}
        <div
          className="book-title text-white font-serif text-xs font-semibold text-center leading-tight px-1"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            maxHeight: '180px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            letterSpacing: '0.5px'
          }}
        >
          {book.title}
        </div>

        {/* Currently Reading - Red Ribbon Bookmark */}
        {isReading && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-5"
            style={{
              background: 'linear-gradient(180deg, #DC2626 0%, #B91C1C 100%)',
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Currently Reading - Glowing Effect */}
        {isReading && (
          <motion.div
            className="absolute inset-0 rounded-sm pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 8px rgba(220, 38, 38, 0.3)'
            }}
            animate={{
              boxShadow: [
                'inset 0 0 8px rgba(220, 38, 38, 0.3)',
                'inset 0 0 16px rgba(220, 38, 38, 0.5)',
                'inset 0 0 8px rgba(220, 38, 38, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Finished - Gold Ribbon */}
        {isFinished && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          />
        )}

        {/* Favorite - Gold Star */}
        {isFavorite && (
          <div className="absolute top-2 right-1 text-yellow-400"
            style={{
              fontSize: '10px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}
          >
            <Star size={12} fill="currentColor" />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
