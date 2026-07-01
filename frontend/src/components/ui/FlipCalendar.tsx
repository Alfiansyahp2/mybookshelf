import { useState, useEffect } from 'react'

export default function FlipCalendar() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    // Update daily at midnight
    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    
    const timeout = setTimeout(() => {
      setDate(new Date())
      // After first midnight, set a 24h interval
      setInterval(() => setDate(new Date()), 24 * 60 * 60 * 1000)
    }, msUntilMidnight)

    return () => clearTimeout(timeout)
  }, [])

  const dayStr = date.getDate().toString().padStart(2, '0')
  const digit1 = dayStr[0]
  const digit2 = dayStr[1]
  const monthStr = date.toLocaleString('default', { month: 'short' }).toUpperCase()

  return (
    <div className="relative flex flex-col items-center justify-end w-32 h-16 ml-2" style={{ transform: 'scale(0.85)', transformOrigin: 'bottom' }}>
      {/* Base */}
      <div className="absolute bottom-0 w-full h-3 bg-[#2a1a10] rounded-sm shadow-md" style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)' }} />
      
      {/* Golden Posts */}
      <div className="absolute bottom-3 left-10 w-1 h-12 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-700" />
      <div className="absolute bottom-3 right-10 w-1 h-12 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-700" />

      {/* Top bar */}
      <div className="absolute top-0 w-full h-3 bg-[#2a1a10] rounded-full shadow-md z-10" />

      {/* Cards container */}
      <div className="absolute top-2 left-0 w-full flex justify-between px-2 gap-1 z-0">
        <FlipCard text={digit1} />
        <FlipCard text={digit2} />
        <FlipCard text={monthStr} isText />
      </div>
    </div>
  )
}

function FlipCard({ text, isText = false }: { text: string; isText?: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Ring */}
      <div className="absolute -top-3 w-3 h-4 border-2 border-gray-300 rounded-full z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 70%)' }} />
      <div className="absolute -top-3 w-3 h-4 border-2 border-gray-400 rounded-full z-0" style={{ clipPath: 'polygon(0 30%, 100% 30%, 100% 100%, 0 100%)' }} />
      
      {/* Card */}
      <div className="relative w-8 h-11 bg-[#f0eee4] rounded shadow-sm flex items-center justify-center border border-[#dcd8c6] overflow-hidden mt-1">
        {/* Horizontal split line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-black/10" />
        
        {isText ? (
          <div className="flex flex-col items-center justify-center leading-[0.85] font-bold text-[#1a1a1a] text-[10px]" style={{ fontFamily: 'sans-serif' }}>
            <span>{text[0]}</span>
            <span>{text[1]}</span>
            <span>{text[2]}</span>
          </div>
        ) : (
          <span 
            className="font-bold text-[#1a1a1a] text-2xl"
            style={{ fontFamily: 'sans-serif' }}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  )
}
