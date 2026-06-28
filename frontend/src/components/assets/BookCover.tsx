import { useState } from 'react'
import { BookOpen, Star, Heart, Share2 } from 'lucide-react'
import type { Book } from '../../types'

interface BookCoverProps {
  book: Book
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSpine?: boolean
  interactive?: boolean
  onClick?: () => void
}

export default function BookCover({
  book,
  size = 'md',
  showSpine = true,
  interactive = true,
  onClick
}: BookCoverProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTilted, setIsTilted] = useState(false)

  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-32 h-44',
    lg: 'w-48 h-64',
    xl: 'w-64 h-80'
  }

  const spineWidth = {
    sm: 'w-6',
    md: 'w-8',
    lg: 'w-12',
    xl: 'w-16'
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setIsTilted(true)
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setIsTilted(false)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    if (!interactive) return
    setIsHovered(true)
  }

  return (
    <div
      className={`relative ${interactive ? 'cursor-pointer' : ''}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`${sizeClasses[size]} relative transition-transform duration-300 ease-out`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isTilted ? 'scale3d(1.05, 1.05, 1.05)' : 'scale3d(1, 1, 1)'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
      >
        {/* Book Cover */}
        <div
          className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[2]} 100%)`,
            transform: 'translateZ(20px)',
            boxShadow: isHovered
              ? `0 25px 50px -12px ${book.spineColors[2]}80, 0 0 30px ${book.spineColors[0]}40`
              : `0 10px 30px -5px ${book.spineColors[2]}60`
          }}
        >
          {/* Cover Content */}
          <div className="relative h-full p-4 flex flex-col justify-between">
            {/* Top Section */}
            <div className="space-y-2">
              {/* Title */}
              <div
                className="text-white font-serif font-bold leading-tight"
                style={{
                  fontSize: size === 'xl' ? '1.5rem' : size === 'lg' ? '1.25rem' : size === 'md' ? '1rem' : '0.875rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {book.title}
              </div>

              {/* Author */}
              <div
                className="text-white/90 font-medium"
                style={{
                  fontSize: size === 'xl' ? '1rem' : size === 'lg' ? '0.875rem' : '0.75rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {book.author}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-2">
              {/* Genre Badge */}
              {book.genre && (
                <div className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <span
                    className="text-white text-xs font-medium"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                  >
                    {book.genre}
                  </span>
                </div>
              )}

              {/* Publisher */}
              {book.publisher && size !== 'sm' && (
                <div
                  className="text-white/70 text-xs"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {book.publisher}
                </div>
              )}
            </div>

            {/* Shine Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(
                  105deg,
                  transparent 40%,
                  rgba(255, 255, 255, 0.1) 45%,
                  rgba(255, 255, 255, 0.2) 50%,
                  rgba(255, 255, 255, 0.1) 55%,
                  transparent 60%
                )`
              }}
            />
          </div>
        </div>

        {/* Book Spine */}
        {showSpine && (
          <div
            className={`absolute left-0 top-0 bottom-0 ${spineWidth[size]} rounded-l-lg`}
            style={{
              background: `linear-gradient(to right, ${book.spineColors[2]} 0%, ${book.spineColors[1]} 50%, ${book.spineColors[0]} 100%)`,
              transform: 'translateZ(0px) rotateY(-90deg) translateX(-10px)',
              boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)'
            }}
          >
            {/* Spine Text */}
            <div className="h-full flex items-center justify-center py-4">
              <div
                className="text-white font-serif font-bold text-center leading-tight"
                style={{
                  fontSize: size === 'xl' ? '0.75rem' : '0.625rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)'
                }}
              >
                {book.title}
              </div>
            </div>
          </div>
        )}

        {/* Book Pages (Side View) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-white to-gray-200 rounded-r-lg"
          style={{
            transform: 'translateZ(0px) translateX(10px)',
            boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.1)'
          }}
        />

        {/* Bottom Shadow */}
        <div
          className="absolute -bottom-4 left-4 right-4 h-4 rounded-lg opacity-30 blur-sm"
          style={{
            background: `linear-gradient(to bottom, ${book.spineColors[2]}, transparent)`,
            transform: 'translateZ(-10px)'
          }}
        />
      </div>

      {/* Quick Actions (on Hover) */}
      {interactive && isHovered && (
        <div
          className="absolute -right-12 top-0 flex flex-col gap-2"
          style={{ transform: 'translateZ(40px)' }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle favorite
            }}
            className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className="w-4 h-4 text-walnut" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle share
            }}
            className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Share2 className="w-4 h-4 text-walnut" />
          </button>
        </div>
      )}
    </div>
  )
}
