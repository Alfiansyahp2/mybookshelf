import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

interface YearlyTargetCardsProps {
  yearlyStats: any[];
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
}

export default function YearlyTargetCards({ yearlyStats, selectedYear, setSelectedYear }: YearlyTargetCardsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef(0)
  const isScrolling = useRef(false)

  const startScrolling = () => {
    if (isScrolling.current) return
    isScrolling.current = true
    const scroll = () => {
      if (!isScrolling.current || !scrollContainerRef.current) return
      scrollContainerRef.current.scrollLeft += speedRef.current
      requestAnimationFrame(scroll)
    }
    requestAnimationFrame(scroll)
  }

  const stopScrolling = () => {
    isScrolling.current = false
    speedRef.current = 0
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return
    const { left, right } = scrollContainerRef.current.getBoundingClientRect()
    const x = e.clientX
    const edgeSize = 100 // Area on left/right edges to trigger scroll
    
    if (x < left + edgeSize) {
      speedRef.current = -((left + edgeSize - x) / edgeSize) * 15
      startScrolling()
    } else if (x > right - edgeSize) {
      speedRef.current = ((x - (right - edgeSize)) / edgeSize) * 15
      startScrolling()
    } else {
      stopScrolling()
    }
  }

  const handleMouseLeave = () => {
    stopScrolling()
  }

  if (yearlyStats.length === 0) return null;

  return (
    <div 
      ref={scrollContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="mb-8 flex flex-row gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar"
    >
      {yearlyStats.map((stat, idx) => {
        const isSelected = selectedYear === stat.year;
        return (
          <motion.div 
            key={stat.year}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedYear(isSelected ? null : stat.year)}
            className={`min-w-[320px] max-w-[400px] flex-1 snap-start cursor-pointer transition-transform ${isSelected ? 'scale-[1.02] ring-2 ring-walnut ring-offset-2' : 'hover:scale-[1.01]'}`}
          >
            <div className="bg-white rounded-2xl border border-walnut/10 shadow-sm overflow-hidden h-full">
              <div style={{ padding: '16px 18px', background: 'linear-gradient(135deg, #4A3320 0%, #6b4528 100%)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="m-0 text-sm font-bold text-amber-100/90 font-serif flex items-center gap-2">
                    <Target size={16} /> Target {stat.year}
                  </h3>
                  <span className="text-xl font-extrabold text-white">{stat.finished} / 12</span>
                </div>
                <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${stat.goalPct}%` }}
                    transition={{ duration: 1.2, delay: 0.6 + (idx * 0.1), ease: 'easeOut' }}
                    className={`h-full rounded-full ${stat.goalPct >= 100 ? 'bg-green-500' : 'bg-amber-200/85'}`}
                  />
                </div>
                <p className="mt-2 text-xs text-amber-100/60 m-0">
                  {stat.goalPct >= 100 ? '🎉 Target tercapai!' : `${12 - stat.finished} buku lagi untuk target tahun ini`}
                </p>
              </div>
              
              <div className="flex justify-between gap-2 p-4 bg-white">
                <div className="text-center flex-1">
                  <div className="text-xl font-extrabold text-darkBrown">{stat.pagesRead.toLocaleString()}</div>
                  <div className="text-xs text-walnut/60 mt-1">Halaman Dibaca</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-xl font-extrabold text-darkBrown">{stat.totalPages.toLocaleString()}</div>
                  <div className="text-xs text-walnut/60 mt-1">Total Halaman</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-xl font-extrabold text-darkBrown">{stat.readPct}%</div>
                  <div className="text-xs text-walnut/60 mt-1">% Terbaca</div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
