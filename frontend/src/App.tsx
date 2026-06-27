import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from './components/AppLayout'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
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
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
