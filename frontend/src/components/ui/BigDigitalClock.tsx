import { useState, useEffect } from 'react'

export default function BigDigitalClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hh = time.getHours().toString().padStart(2, '0')
  const mm = time.getMinutes().toString().padStart(2, '0')
  const isBlinking = time.getSeconds() % 2 === 0

  return (
    <div 
      className="px-4 py-1.5 rounded-md flex items-center border border-[#d4a87a]"
      style={{
        backgroundColor: '#e6c39e',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(180,120,60,0.08) 1px, rgba(180,120,60,0.08) 3px)',
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05), 0 4px 6px -1px rgba(0,0,0,0.1)'
      }}
    >
      <div 
        className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2 tracking-[0.1em]"
        style={{ 
          textShadow: '0 0 6px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.4)',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        <span>
          {hh}<span style={{ opacity: isBlinking ? 1 : 0.3 }}>:</span>{mm}
        </span>
        <span className="text-[10px] sm:text-[11px] tracking-normal mt-0.5">26°C</span>
      </div>
    </div>
  )
}
