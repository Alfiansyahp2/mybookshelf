import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function CatchAll() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Redirect unmatched routes to dashboard
    console.log(`No route found for: ${location.pathname}. Redirecting to dashboard...`)
    navigate('/', { replace: true })
  }, [navigate, location.pathname])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-walnut">Redirecting...</div>
    </div>
  )
}
