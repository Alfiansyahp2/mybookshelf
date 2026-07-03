import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: PaginationProps) {
  // Prevent rendering if there's only 1 page or less
  if (totalPages <= 1) return null

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Complex pagination with ellipses
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span 
            key={`ellipsis-${index}`} 
            className="w-10 h-10 flex items-center justify-center text-walnut/60"
          >
            <MoreHorizontal size={16} />
          </span>
        )
      }

      const isCurrent = page === currentPage
      return (
        <motion.button
          key={`page-${page}`}
          whileHover={{ scale: isCurrent ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page as number)}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-colors duration-200
            ${isCurrent 
              ? 'bg-gradient-to-br from-walnut to-darkBrown text-white shadow-md border-transparent' 
              : 'bg-white border border-walnut/20 text-darkBrown hover:bg-beige/50 hover:border-walnut/40'
            }
          `}
          aria-current={isCurrent ? 'page' : undefined}
        >
          {page}
        </motion.button>
      )
    })
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <motion.button
        whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200
          ${currentPage === 1 
            ? 'opacity-50 cursor-not-allowed bg-transparent text-walnut/40 border border-walnut/10' 
            : 'bg-white border border-walnut/20 text-darkBrown hover:bg-beige/50 hover:border-walnut/40'
          }
        `}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </motion.button>

      <div className="flex items-center gap-1.5">
        {renderPageNumbers()}
      </div>

      <motion.button
        whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200
          ${currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed bg-transparent text-walnut/40 border border-walnut/10' 
            : 'bg-white border border-walnut/20 text-darkBrown hover:bg-beige/50 hover:border-walnut/40'
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </motion.button>
    </div>
  )
}
