import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryProvider } from "./lib/ReactQueryProvider";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CatchAll from "./components/layout/CatchAll";
import ToastContainer from "./components/ui/ToastContainer";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LandingBookDetail = lazy(() => import("./pages/LandingBookDetail"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Library = lazy(() => import("./pages/Library"));
const ExploreLibrary = lazy(() => import("./pages/ExploreLibrary"));
const Reading = lazy(() => import("./pages/Reading"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const BorrowLoan = lazy(() => import("./pages/BorrowLoan"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Collections = lazy(() => import("./pages/Collections"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Notes = lazy(() => import("./pages/Notes"));
const Accounting = lazy(() => import("./pages/Accounting"));
const Settings = lazy(() => import("./pages/Settings"));

function PageLoader() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-walnut/30 border-t-walnut rounded-full animate-spin" />
        </div>
    );
}

function App() {
    return (
        <ReactQueryProvider>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/landing" element={<LandingPage />} />
                        <Route
                            path="/landing/book/:id"
                            element={<LandingBookDetail />}
                        />
                        <Route path="/book/:id" element={<LandingBookDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Login />} />

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
                            <Route
                                path="explore"
                                element={<ExploreLibrary />}
                            />
                            <Route path="reading" element={<Reading />} />
                            <Route path="wishlist" element={<Wishlist />} />
                            <Route
                                path="borrow-loan"
                                element={<BorrowLoan />}
                            />
                            <Route path="statistics" element={<Statistics />} />
                            <Route
                                path="collections"
                                element={<Collections />}
                            />
                            <Route
                                path="achievements"
                                element={<Achievements />}
                            />
                            <Route path="notes" element={<Notes />} />
                            <Route path="accounting" element={<Accounting />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        {/* Catch-all route for unmatched paths */}
                        <Route path="*" element={<CatchAll />} />
                    </Routes>
                </Suspense>
                <ToastContainer />
            </BrowserRouter>
        </ReactQueryProvider>
    );
}

export default App;
