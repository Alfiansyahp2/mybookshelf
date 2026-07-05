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
      className="px-4 py-1.5 rounded-md flex items-center border border-[#3b2413]"
      style={{
        backgroundColor: '#4a2f1d',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 3px)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.2)'
      }}
    >
      <div 
        className="font-mono text-sm sm:text-base font-bold text-[#ffedcc] flex items-center gap-2 tracking-[0.1em]"
        style={{ 
          textShadow: '0 0 5px rgba(255,160,60,0.7), 0 0 12px rgba(255,120,30,0.4)',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        <span>
          {hh}<span style={{ opacity: isBlinking ? 1 : 0.3 }}>:</span>{mm}
        </span>
        <span className="text-[10px] sm:text-[11px] tracking-normal mt-0.5 text-[#ffdbb0]">26°C</span>
      </div>
    </div>
  )
}
