import { useState, useEffect } from 'react'
import Modal from './Modal'

const TIMEZONES = [
  { id: 'local', label: 'Waktu Lokal (Perangkat)', tz: '' },
  { id: 'id-wib', label: 'Indonesia (WIB)', tz: 'Asia/Jakarta' },
  { id: 'jp', label: 'Jepang (JST)', tz: 'Asia/Tokyo' },
  { id: 'kr', label: 'Korea Selatan (KST)', tz: 'Asia/Seoul' },
  { id: 'uk', label: 'Inggris (GMT/BST)', tz: 'Europe/London' },
  { id: 'us-ny', label: 'Amerika Serikat (EST/EDT)', tz: 'America/New_York' },
  { id: 'au-syd', label: 'Australia (AEST/AEDT)', tz: 'Australia/Sydney' },
]

export default function BigDigitalClock() {
  const [time, setTime] = useState(new Date())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [format, setFormat] = useState<'24h' | '12h'>(
    (localStorage.getItem('clock_format') as '24h' | '12h') || '24h'
  )
  const [timezone, setTimezone] = useState<string>(
    localStorage.getItem('clock_timezone') || 'local'
  )

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleFormatChange = (newFormat: '24h' | '12h') => {
    setFormat(newFormat)
    localStorage.setItem('clock_format', newFormat)
  }

  const handleTimezoneChange = (newTz: string) => {
    setTimezone(newTz)
    localStorage.setItem('clock_timezone', newTz)
  }

  // Get time in selected timezone
  const getDisplayTime = () => {
    if (timezone === 'local') return time;
    const tzData = TIMEZONES.find(t => t.id === timezone);
    if (!tzData || !tzData.tz) return time;
    
    try {
      // Trick to convert JS Date to specific timezone
      const tzString = time.toLocaleString('en-US', { timeZone: tzData.tz });
      return new Date(tzString);
    } catch (e) {
      return time;
    }
  }

  const displayTime = getDisplayTime();
  let hhNum = displayTime.getHours()
  const ampm = hhNum >= 12 ? 'PM' : 'AM'
  
  if (format === '12h') {
    hhNum = hhNum % 12 || 12
  }

  const hh = hhNum.toString().padStart(2, '0')
  const mm = displayTime.getMinutes().toString().padStart(2, '0')
  const isBlinking = displayTime.getSeconds() % 2 === 0

  return (
    <>
      <div 
        onClick={() => setIsSettingsOpen(true)}
        className="px-4 py-1.5 rounded-md flex items-center border border-[#3b2413] cursor-pointer hover:brightness-110 transition-all group"
        title="Klik untuk mengubah pengaturan jam"
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
          <div className="flex flex-col items-center justify-center -mt-0.5">
            <span className="text-[10px] sm:text-[11px] tracking-normal text-[#ffdbb0]">26°C</span>
            {format === '12h' && (
              <span className="text-[8px] leading-none tracking-normal text-[#ffdbb0] mt-0.5 opacity-80">{ampm}</span>
            )}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        title="Pengaturan Jam" 
        size="md"
      >
        <div className="p-4 space-y-6">
          
          {/* Negara / Zona Waktu */}
          <div className="space-y-3">
            <h3 className="font-semibold text-darkBrown flex items-center gap-2">
              🌍 Negara / Zona Waktu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIMEZONES.map((tz) => (
                <label key={tz.id} className="flex items-center gap-3 p-3 rounded-xl border border-walnut/10 hover:bg-cream/40 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="clockTimezone" 
                    value={tz.id} 
                    checked={timezone === tz.id}
                    onChange={() => handleTimezoneChange(tz.id)}
                    className="w-4 h-4 text-walnut focus:ring-walnut border-gray-300"
                  />
                  <div className="font-medium text-darkBrown text-sm">{tz.label}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-walnut/10 w-full" />

          {/* Format Waktu */}
          <div className="space-y-3">
            <h3 className="font-semibold text-darkBrown flex items-center gap-2">
              ⏱️ Format Waktu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-walnut/10 hover:bg-cream/40 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="clockFormat" 
                  value="24h" 
                  checked={format === '24h'}
                  onChange={() => handleFormatChange('24h')}
                  className="w-4 h-4 text-walnut focus:ring-walnut border-gray-300"
                />
                <div>
                  <div className="font-semibold text-darkBrown text-sm">Format 24 Jam</div>
                  <div className="text-xs text-walnut/60">Contoh: 14:30</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-walnut/10 hover:bg-cream/40 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="clockFormat" 
                  value="12h" 
                  checked={format === '12h'}
                  onChange={() => handleFormatChange('12h')}
                  className="w-4 h-4 text-walnut focus:ring-walnut border-gray-300"
                />
                <div>
                  <div className="font-semibold text-darkBrown text-sm">Format 12 Jam</div>
                  <div className="text-xs text-walnut/60">Contoh: 02:30 PM</div>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end pt-4">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="px-6 py-2.5 bg-walnut text-white rounded-lg text-sm font-medium hover:bg-darkBrown transition-colors"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
