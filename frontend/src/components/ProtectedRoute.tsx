import { Navigate } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError, isFetching } = useAuthUser()
  const userData = localStorage.getItem('user')

  console.log('ProtectedRoute state:', { userData: !!userData, user: !!user, isLoading, isFetching, isError })

  // If no user data at all, redirect to login immediately
  if (!userData) {
    console.log('ProtectedRoute: No user data, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // If we have user data, show loading while fetching fresh user data
  if (isLoading || isFetching) {
    console.log('ProtectedRoute: Loading user data...')
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-serif">Loading...</p>
        </div>
      </div>
    )
  }

  // If we have an error fetching user data, redirect to login
  if (isError) {
    console.log('ProtectedRoute: Error fetching user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // If we have user data, allow access
  console.log('ProtectedRoute: Allowing access')
  return <>{children}</>
}
