import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, BookOpen, TrendingUp, Calendar, FileText, Activity, BarChart2 } from 'lucide-react'
import type { BookReadingSessionsResponse, ReadingSession } from '../../lib/api/readingSessions'

interface ReadingSessionsModalProps {
  isOpen: boolean
  onClose: () => void
  sessionData: BookReadingSessionsResponse | undefined
  bookTitle: string
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hrs > 0) return `${hrs}j ${mins}m ${secs}d`
  if (mins > 0) return `${mins}m ${secs}d`
  return `${secs}d`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const moodConfig = {
  great: { label: 'Luar Biasa', emoji: '🤩', color: 'text-green-600', bg: 'bg-green-50' },
  good: { label: 'Baik', emoji: '😊', color: 'text-blue-600', bg: 'bg-blue-50' },
  okay: { label: 'Biasa', emoji: '😐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  difficult: { label: 'Berat', emoji: '😓', color: 'text-red-600', bg: 'bg-red-50' },
}

function SessionCard({ session, index }: { session: ReadingSession; index: number }) {
  const isActive = session.end_time === null
  const pagesRead = session.end_page != null ? session.end_page - session.start_page : null
  const mood = session.mood ? moodConfig[session.mood] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative rounded-xl border p-4 space-y-3 ${
        isActive
          ? 'border-green-400 bg-green-50/60 shadow-md shadow-green-100'
          : 'border-walnut/10 bg-white shadow-sm'
      }`}
    >
      {/* Active badge */}
      {isActive && (
        <span className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-200/70 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Aktif
        </span>
      )}

      {/* Session header */}
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-green-100' : 'bg-walnut/10'}`}>
          <BookOpen className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-walnut'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-darkBrown">
              Sesi #{index + 1}
            </span>
            {mood && (
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${mood.bg} ${mood.color}`}>
                {mood.emoji} {mood.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-walnut/60">
            <Calendar className="w-3 h-3" />
            {formatDate(session.start_time)}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Pages */}
        <div className="bg-cream/60 rounded-lg p-2 text-center">
          <div className="text-xs text-walnut/50 mb-0.5">Halaman</div>
          <div className="text-sm font-bold text-darkBrown">
            {session.start_page} → {session.end_page ?? '…'}
          </div>
          {pagesRead !== null && (
            <div className="text-xs text-walnut/60">+{pagesRead} hlm</div>
          )}
        </div>

        {/* Duration */}
        <div className="bg-cream/60 rounded-lg p-2 text-center">
          <div className="text-xs text-walnut/50 mb-0.5">Durasi</div>
          <div className="text-sm font-bold text-darkBrown font-mono">
            {formatDuration(session.duration)}
          </div>
        </div>

        {/* End time */}
        <div className="bg-cream/60 rounded-lg p-2 text-center">
          <div className="text-xs text-walnut/50 mb-0.5">Selesai</div>
          <div className="text-xs font-medium text-darkBrown">
            {session.end_time
              ? new Date(session.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              : isActive ? '—' : 'N/A'}
          </div>
        </div>
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="flex items-start gap-2 pt-1 border-t border-walnut/10">
          <FileText className="w-3.5 h-3.5 text-walnut/40 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-walnut/70 italic leading-relaxed line-clamp-3">
            {session.notes}
          </p>
        </div>
      )}

      {/* Location */}
      {session.location && (
        <div className="flex items-center gap-1.5 text-xs text-walnut/60">
          <span>📍</span>
          <span>{session.location}</span>
        </div>
      )}
    </motion.div>
  )
}

export default function ReadingSessionsModal({
  isOpen,
  onClose,
  sessionData,
  bookTitle,
}: ReadingSessionsModalProps) {
  const stats = sessionData?.statistics
  const sessions = sessionData?.sessions ?? []
  const completedSessions = sessions.filter(s => s.end_time !== null)
  const activeSession = sessions.find(s => s.end_time === null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-cream w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="px-5 pt-5 pb-4 border-b border-walnut/10 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-walnut/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-walnut" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-darkBrown leading-tight">
                        Riwayat Sesi Membaca
                      </h2>
                      <p className="text-xs text-walnut/60 mt-0.5 line-clamp-1">{bookTitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-walnut/10 hover:bg-walnut/20 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-darkBrown" />
                  </button>
                </div>

                {/* Statistics Overview */}
                {stats && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-xl p-3 border border-walnut/10">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart2 className="w-3.5 h-3.5 text-walnut" />
                        <span className="text-xs text-walnut/60">Total Sesi</span>
                      </div>
                      <div className="text-xl font-bold text-darkBrown">{stats.total_sessions}</div>
                      <div className="text-xs text-walnut/50">{completedSessions.length} selesai</div>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-walnut/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-walnut" />
                        <span className="text-xs text-walnut/60">Total Waktu</span>
                      </div>
                      <div className="text-xl font-bold text-darkBrown font-mono">
                        {stats.total_duration_formatted || formatDuration(stats.total_duration_seconds)}
                      </div>
                      <div className="text-xs text-walnut/50">waktu membaca</div>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-walnut/10">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-walnut" />
                        <span className="text-xs text-walnut/60">Total Halaman</span>
                      </div>
                      <div className="text-xl font-bold text-darkBrown">{stats.total_pages_read}</div>
                      <div className="text-xs text-walnut/50">halaman dibaca</div>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-walnut/10">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-walnut" />
                        <span className="text-xs text-walnut/60">Kecepatan</span>
                      </div>
                      <div className="text-xl font-bold text-darkBrown">
                        {stats.average_reading_speed_pages_per_hour?.toFixed(1) ?? '—'}
                      </div>
                      <div className="text-xs text-walnut/50">hlm/jam rata-rata</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-walnut/10 flex items-center justify-center mb-3">
                      <BookOpen className="w-7 h-7 text-walnut/40" />
                    </div>
                    <p className="text-sm font-medium text-walnut/60">Belum ada sesi membaca</p>
                    <p className="text-xs text-walnut/40 mt-1">
                      Mulai sesi pertamamu dengan menekan tombol Start Session
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Active session first */}
                    {activeSession && (
                      <SessionCard key={activeSession.id} session={activeSession} index={0} />
                    )}
                    {/* Completed sessions, newest first */}
                    {[...completedSessions]
                      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
                      .map((session, i) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          index={activeSession ? i + 1 : i}
                        />
                      ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-walnut/10 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-walnut text-white rounded-xl text-sm font-medium hover:bg-darkBrown transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
