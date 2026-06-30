import { useState, useEffect } from 'react'
import { Play, Pause, Clock, BookOpen, Check, X, ChevronDown, ChevronUp, Calendar, FileText, TrendingUp, BarChart2, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Book } from '../../types'
import { useStartReadingSession, useEndReadingSession, useBookReadingSessions } from '../../hooks/useReadingSessions'
import type { ReadingSession } from '../../lib/api/readingSessions'

interface ReadingSessionTimerProps {
  book: Book
  updateProgress: { mutate: (params: { id: string; currentPage: number }) => void }
}

// ── helpers ────────────────────────────────────────────────
function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
  const hrs  = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hrs > 0)  return `${hrs}j ${mins}m`
  if (mins > 0) return `${mins}m ${secs}d`
  return `${secs}d`
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const MOOD_CFG = {
  great:    { label: 'Luar Biasa', emoji: '🤩', color: '#065f46', bg: '#d1fae5' },
  good:     { label: 'Baik',       emoji: '😊', color: '#1e40af', bg: '#dbeafe' },
  okay:     { label: 'Biasa',      emoji: '😐', color: '#92400e', bg: '#fef3c7' },
  difficult:{ label: 'Berat',      emoji: '😓', color: '#7f1d1d', bg: '#fee2e2' },
}

// ── SessionCard (inline, compact) ─────────────────────────
function SessionCard({ session, index }: { session: ReadingSession; index: number }) {
  const isActive   = session.end_time === null
  const pagesRead  = session.end_page != null ? session.end_page - session.start_page : null
  const mood       = session.mood ? MOOD_CFG[session.mood as keyof typeof MOOD_CFG] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="rounded-xl border p-3 space-y-2"
      style={
        isActive
          ? { borderColor: '#6ee7b7', background: '#f0fdf4', boxShadow: '0 1px 6px rgba(16,185,129,0.1)' }
          : { borderColor: 'rgba(139,115,85,0.12)', background: 'rgba(255,255,255,0.85)' }
      }
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: isActive ? '#d1fae5' : 'rgba(139,115,85,0.1)' }}
          >
            <BookOpen className="w-3.5 h-3.5" style={{ color: isActive ? '#059669' : '#8B7355' }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: '#2a1a08' }}>
            Sesi #{index + 1}
          </span>
          {mood && (
            <span
              className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: mood.bg, color: mood.color }}
            >
              {mood.emoji} {mood.label}
            </span>
          )}
        </div>

        {isActive ? (
          <span className="flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: '#d1fae5', color: '#065f46' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Aktif
          </span>
        ) : session.end_time ? (
          <span className="text-[9px]" style={{ color: '#9c6d3a' }}>
            {new Date(session.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ) : null}
      </div>

      {/* Date */}
      <div className="flex items-center gap-1 text-[9px]" style={{ color: '#9c6d3a' }}>
        <Calendar className="w-3 h-3" />
        {formatDateTime(session.start_time)}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="rounded-lg p-1.5 text-center" style={{ background: 'rgba(139,115,85,0.08)' }}>
          <div className="text-[8px] mb-0.5" style={{ color: '#9c6d3a' }}>Halaman</div>
          <div className="text-xs font-bold" style={{ color: '#2a1a08' }}>
            {session.start_page} → {session.end_page ?? '…'}
          </div>
          {pagesRead !== null && (
            <div className="text-[8px]" style={{ color: '#9c6d3a' }}>+{pagesRead}</div>
          )}
        </div>

        <div className="rounded-lg p-1.5 text-center" style={{ background: 'rgba(139,115,85,0.08)' }}>
          <div className="text-[8px] mb-0.5" style={{ color: '#9c6d3a' }}>Durasi</div>
          <div className="text-xs font-bold font-mono" style={{ color: '#2a1a08' }}>
            {formatDuration(session.duration)}
          </div>
        </div>

        <div className="rounded-lg p-1.5 text-center" style={{ background: 'rgba(139,115,85,0.08)' }}>
          <div className="text-[8px] mb-0.5" style={{ color: '#9c6d3a' }}>Kecepatan</div>
          <div className="text-xs font-bold" style={{ color: '#2a1a08' }}>
            {session.duration && pagesRead
              ? ((pagesRead / (session.duration / 3600)).toFixed(0))
              : '—'}
          </div>
          <div className="text-[8px]" style={{ color: '#9c6d3a' }}>hlm/j</div>
        </div>
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="flex items-start gap-1.5 pt-1.5 border-t" style={{ borderColor: 'rgba(139,115,85,0.1)' }}>
          <FileText className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#9c6d3a' }} />
          <p className="text-[9px] italic leading-relaxed line-clamp-2" style={{ color: '#7c5c3a' }}>
            {session.notes}
          </p>
        </div>
      )}
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function ReadingSessionTimer({ book, updateProgress }: ReadingSessionTimerProps) {
  const [isReadingSession,    setIsReadingSession]    = useState(false)
  const [sessionDuration,     setSessionDuration]     = useState(0)
  const [startingPage,        setStartingPage]        = useState(0)
  const [activeSessionId,     setActiveSessionId]     = useState<string | null>(null)
  const [isEndingSession,     setIsEndingSession]     = useState(false)
  const [endPage,             setEndPage]             = useState<number>(book.currentPage || 0)
  const [notes,               setNotes]               = useState<string>('')
  const [hasInitializedSession, setHasInitializedSession] = useState(false)
  // ← replaced modal with inline expand
  const [showHistory,         setShowHistory]         = useState(false)

  const startSessionMutation = useStartReadingSession()
  const endSessionMutation   = useEndReadingSession()
  const { data: sessionData } = useBookReadingSessions(book.id)

  const sessions         = sessionData?.sessions ?? []
  const stats            = sessionData?.statistics
  const completedSessions = sessions.filter(s => s.end_time !== null)
  const activeSession     = sessions.find(s => s.end_time === null)

  // Resume active session from database on mount
  useEffect(() => {
    if (sessionData?.sessions && !hasInitializedSession) {
      const active = sessionData.sessions.find(s => s.end_time === null)
      if (active) {
        setIsReadingSession(true)
        setActiveSessionId(active.id)
        setStartingPage(active.start_page)
        setEndPage(book.currentPage || active.start_page)
        const durationSeconds = Math.max(0, Math.floor((Date.now() - new Date(active.start_time).getTime()) / 1000))
        setSessionDuration(durationSeconds)
      }
      setHasInitializedSession(true)
    }
  }, [sessionData, hasInitializedSession, book.currentPage])

  // Live timer
  useEffect(() => {
    let interval: number
    if (isReadingSession && !isEndingSession) {
      interval = setInterval(() => setSessionDuration(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isReadingSession, isEndingSession])

  // Format HH:MM:SS
  const fmt = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }

  const pagesRead    = Math.max(0, (isEndingSession ? endPage : (book.currentPage || 0)) - startingPage)
  const readingSpeed = sessionDuration > 0 ? (pagesRead / (sessionDuration / 3600)).toFixed(1) : '0.0'

  const handleStart = async () => {
    const cur = book.currentPage || 0
    setStartingPage(cur); setEndPage(cur)
    try {
      const result = await startSessionMutation.mutateAsync({
        bookId: book.id,
        data: { start_page: cur, mood: 'good' }
      })
      setActiveSessionId(result.id)
      setIsReadingSession(true)
      setIsEndingSession(false)
    } catch {
      setIsReadingSession(true)
    }
  }

  const handleStop   = () => { setIsEndingSession(true); setEndPage(Math.max(startingPage, book.currentPage || 0)) }
  const handleCancel = () => setIsEndingSession(false)

  const handleSave = async () => {
    if (endPage < startingPage) { alert(`Halaman akhir tidak boleh lebih kecil dari halaman awal (${startingPage})`); return }
    try {
      if (activeSessionId) {
        await endSessionMutation.mutateAsync({
          bookId: book.id, sessionId: activeSessionId,
          data: { end_page: endPage, notes: notes || `Durasi: ${fmt(sessionDuration)}` }
        })
      } else if (endPage > startingPage) {
        updateProgress.mutate({ id: book.id, currentPage: endPage })
      }
      setIsReadingSession(false); setIsEndingSession(false)
      setSessionDuration(0); setActiveSessionId(null); setNotes('')
    } catch (err) {
      console.error('Failed to end session:', err)
    }
  }

  return (
    <div className="space-y-2">
      {/* ── Timer Card ──────────────────────────────── */}
      <div
        className="rounded-xl border p-3"
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderColor: 'rgba(139,115,85,0.12)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#2a1a08' }}>
            <Clock className="w-4 h-4" style={{ color: '#8B7355' }} />
            Reading Session
          </h3>

          <div className="flex items-center gap-2">
            {isReadingSession && (
              <span className="text-xs" style={{ color: '#9c6d3a' }}>
                <BookOpen className="w-3 h-3 inline mr-1" />
                {pagesRead} hlm
              </span>
            )}

            {/* Toggle riwayat — inline */}
            <button
              onClick={() => setShowHistory(v => !v)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all"
              style={{
                color: showHistory ? '#2a1a08' : '#9c6d3a',
                background: showHistory ? 'rgba(139,115,85,0.12)' : 'transparent',
              }}
            >
              <Activity className="w-3.5 h-3.5" />
              Riwayat
              {showHistory
                ? <ChevronUp className="w-3 h-3" />
                : <ChevronDown className="w-3 h-3" />
              }
            </button>
          </div>
        </div>

        {/* Timer display */}
        <div className="text-center mb-2">
          <div
            className="text-2xl font-mono font-bold tracking-widest"
            style={{ color: isReadingSession ? '#065f46' : '#2a1a08' }}
          >
            {fmt(sessionDuration)}
          </div>
          {isReadingSession && sessionDuration > 60 && (
            <div className="text-xs mt-0.5" style={{ color: '#9c6d3a' }}>
              {readingSpeed} hlm/jam
            </div>
          )}
        </div>

        {/* Start / Stop / Save flow */}
        {!isReadingSession ? (
          <button
            onClick={handleStart}
            disabled={startSessionMutation.isPending}
            className="w-full py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            <Play className="w-4 h-4" />
            {startSessionMutation.isPending ? 'Memulai...' : 'Start Session'}
          </button>
        ) : !isEndingSession ? (
          <>
            <button
              onClick={handleStop}
              className="w-full py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
            >
              <Pause className="w-4 h-4" />
              Stop Session
            </button>
            <div className="mt-2 text-center text-[10px]" style={{ color: '#9c6d3a' }}>
              Dari hal. {startingPage} · {pagesRead} halaman dibaca
            </div>
          </>
        ) : (
          <div className="rounded-lg p-3 space-y-2.5" style={{ background: 'rgba(139,115,85,0.06)', border: '1px solid rgba(139,115,85,0.12)' }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9c6d3a' }}>
              Selesaikan Sesi
            </p>

            <div>
              <label className="text-xs block mb-1" style={{ color: '#9c6d3a' }}>
                Halaman Akhir (mulai: {startingPage} / maks: {book.pages})
              </label>
              <input
                type="number"
                min={startingPage}
                max={book.pages || 9999}
                value={endPage}
                onChange={e => setEndPage(parseInt(e.target.value) || startingPage)}
                className="w-full px-2 py-1 text-sm rounded-lg border focus:outline-none"
                style={{ borderColor: 'rgba(139,115,85,0.25)', background: 'white' }}
              />
            </div>

            <div>
              <label className="text-xs block mb-1" style={{ color: '#9c6d3a' }}>Catatan (opsional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Bagaimana sesi membacamu?"
                rows={2}
                className="w-full px-2 py-1 text-xs rounded-lg border resize-none focus:outline-none"
                style={{ borderColor: 'rgba(139,115,85,0.25)', background: 'white' }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={endSessionMutation.isPending}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                <Check className="w-3.5 h-3.5" />
                {endSessionMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                style={{ background: 'rgba(107,83,68,0.12)', color: '#6b4c2a' }}
              >
                <X className="w-3.5 h-3.5" />
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {(startSessionMutation.error || endSessionMutation.error) && (
          <div className="mt-2 p-2 rounded-lg text-xs text-red-700" style={{ background: '#fee2e2' }}>
            Gagal menyimpan sesi. Coba lagi.
          </div>
        )}
      </div>

      {/* ── Riwayat — inline expand below the timer card ── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            key="history"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {/* Stats summary row */}
            {stats && (
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {[
                  { icon: <BarChart2 className="w-3 h-3" />, label: 'Total Sesi',   val: stats.total_sessions,           sub: `${completedSessions.length} selesai` },
                  { icon: <Clock     className="w-3 h-3" />, label: 'Total Waktu',  val: stats.total_duration_formatted || formatDuration(stats.total_duration_seconds), sub: 'waktu membaca', mono: true },
                  { icon: <BookOpen  className="w-3 h-3" />, label: 'Total Halaman',val: stats.total_pages_read,          sub: 'halaman dibaca' },
                  { icon: <TrendingUp className="w-3 h-3" />,label: 'Kecepatan',   val: (stats.average_reading_speed_pages_per_hour?.toFixed(1) ?? '—'), sub: 'hlm/jam rata-rata' },
                ].map((s, i) => (
                  <div key={i}
                    className="rounded-xl p-2.5 border"
                    style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(139,115,85,0.12)' }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5" style={{ color: '#8B7355' }}>
                      {s.icon}
                      <span className="text-[9px]" style={{ color: '#9c6d3a' }}>{s.label}</span>
                    </div>
                    <div className={`text-base font-bold ${s.mono ? 'font-mono' : ''}`} style={{ color: '#2a1a08' }}>{s.val}</div>
                    <div className="text-[8px]" style={{ color: '#9c6d3a' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Section heading */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-px" style={{ background: 'rgba(139,115,85,0.15)' }} />
              <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#9c6d3a' }}>
                Riwayat Sesi
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(139,115,85,0.15)' }} />
            </div>

            {/* Cards */}
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border"
                style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(139,115,85,0.1)' }}
              >
                <BookOpen className="w-8 h-8 mb-2" style={{ color: 'rgba(139,115,85,0.3)' }} />
                <p className="text-xs font-medium" style={{ color: '#9c6d3a' }}>Belum ada sesi membaca</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'rgba(139,115,85,0.5)' }}>Mulai sesi pertamamu!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeSession && (
                  <SessionCard key={activeSession.id} session={activeSession} index={0} />
                )}
                {[...completedSessions]
                  .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
                  .map((s, i) => (
                    <SessionCard key={s.id} session={s} index={activeSession ? i + 1 : i} />
                  ))
                }
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
