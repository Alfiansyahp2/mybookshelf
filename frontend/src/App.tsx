import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryProvider } from "./lib/ReactQueryProvider";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CatchAll from "./components/layout/CatchAll";
import ToastContainer from "./components/ui/ToastContainer";
import LandingPage from "./pages/LandingPage";
import LandingBookDetail from "./pages/LandingBookDetail";
import Login from "./pages/Login";
import RegisterComingSoon from "./pages/RegisterComingSoon";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import ExploreLibrary from "./pages/ExploreLibrary";
import Reading from "./pages/Reading";
import Wishlist from "./pages/Wishlist";
import BorrowLoan from "./pages/BorrowLoan";
import Statistics from "./pages/Statistics";
import Collections from "./pages/Collections";
import Achievements from "./pages/Achievements";
import Notes from "./pages/Notes";
import Accounting from "./pages/Accounting";
import Settings from "./pages/Settings";

function App() {
    return (
        <ReactQueryProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/landing/book/:id" element={<LandingBookDetail />} />
                    <Route path="/book/:id" element={<LandingBookDetail />} />
                    <Route path="/login" element={<Login />} />

                    {/* Route ke Register (dinonaktifkan sementara dan diganti ke halaman Coming Soon) */}
                    {/* <Route path="/register" element={<Register />} /> */}
                    <Route path="/register" element={<RegisterComingSoon />} />

                    {/* App / Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="library" element={<Library />} />
                        <Route path="explore" element={<ExploreLibrary />} />
                        <Route path="reading" element={<Reading />} />
                        <Route path="wishlist" element={<Wishlist />} />
                        <Route path="borrow-loan" element={<BorrowLoan />} />
                        <Route path="statistics" element={<Statistics />} />
                        <Route path="collections" element={<Collections />} />
                        <Route path="achievements" element={<Achievements />} />
                        <Route path="notes" element={<Notes />} />
                        <Route path="accounting" element={<Accounting />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Catch-all route for unmatched paths */}
                    <Route path="*" element={<CatchAll />} />
                </Routes>
                <ToastContainer />
            </BrowserRouter>
        </ReactQueryProvider>
    );
}

export default App;
