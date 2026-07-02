import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReactQueryProvider } from './lib/ReactQueryProvider'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import CatchAll from './components/CatchAll'
import ToastContainer from './components/ui/ToastContainer'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import ExploreLibrary from './pages/ExploreLibrary'
import Reading from './pages/Reading'
import Wishlist from './pages/Wishlist'
import BorrowLoan from './pages/BorrowLoan'
import Statistics from './pages/Statistics'
import Collections from './pages/Collections'
import Achievements from './pages/Achievements'
import Notes from './pages/Notes'

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="explore" element={<ExploreLibrary />} />
            <Route path="reading" element={<Reading />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="borrow-loan" element={<BorrowLoan />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="collections" element={<Collections />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="notes" element={<Notes />} />
          </Route>

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<CatchAll />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ReactQueryProvider>
  )
}

export default App
