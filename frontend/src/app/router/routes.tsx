import { Suspense, lazy, type ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@features/auth";
import AppLayout from "../layout/AppLayout";
import CatchAll from "./CatchAll";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

const LandingPage = lazy(() => import("@features/landing/pages/LandingPage"));
const LandingBookDetailPage = lazy(
    () => import("@features/landing/pages/LandingBookDetailPage"),
);
const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const DashboardPage = lazy(
    () => import("@features/analytics/pages/DashboardPage"),
);
const LibraryPage = lazy(
    () => import("@features/library/pages/LibraryPage"),
);
const ExploreLibraryPage = lazy(
    () => import("@features/library/pages/ExploreLibraryPage"),
);
const ReadingPage = lazy(
    () => import("@features/reading/pages/ReadingPage"),
);
const WishlistPage = lazy(
    () => import("@features/library/pages/WishlistPage"),
);
const BorrowLoanPage = lazy(
    () => import("@features/library/pages/BorrowLoanPage"),
);
const StatisticsPage = lazy(
    () => import("@features/analytics/pages/StatisticsPage"),
);
const CollectionsPage = lazy(
    () => import("@features/library/pages/CollectionsPage"),
);
const AchievementsPage = lazy(
    () => import("@features/analytics/pages/AchievementsPage"),
);
const NotesPage = lazy(() => import("@features/library/pages/NotesPage"));
const AccountingPage = lazy(
    () => import("@features/accounting/pages/AccountingPage"),
);
const SettingsPage = lazy(
    () => import("@features/settings/pages/SettingsPage"),
);

function PageLoader() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-walnut/30 border-t-walnut rounded-full animate-spin" />
        </div>
    );
}

function wrapRoute(element: ReactNode) {
    return (
        <RouteErrorBoundary>
            <Suspense fallback={<PageLoader />}>{element}</Suspense>
        </RouteErrorBoundary>
    );
}

export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={wrapRoute(<LandingPage />)} />
            <Route path="/landing" element={wrapRoute(<LandingPage />)} />
            <Route
                path="/landing/book/:id"
                element={wrapRoute(<LandingBookDetailPage />)}
            />
            <Route
                path="/book/:id"
                element={wrapRoute(<LandingBookDetailPage />)}
            />
            <Route path="/login" element={wrapRoute(<LoginPage />)} />
            <Route path="/register" element={wrapRoute(<LoginPage />)} />

            {/* App / Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={wrapRoute(<DashboardPage />)} />
                <Route path="library" element={wrapRoute(<LibraryPage />)} />
                <Route
                    path="explore"
                    element={wrapRoute(<ExploreLibraryPage />)}
                />
                <Route path="reading" element={wrapRoute(<ReadingPage />)} />
                <Route path="wishlist" element={wrapRoute(<WishlistPage />)} />
                <Route
                    path="borrow-loan"
                    element={wrapRoute(<BorrowLoanPage />)}
                />
                <Route
                    path="statistics"
                    element={wrapRoute(<StatisticsPage />)}
                />
                <Route
                    path="collections"
                    element={wrapRoute(<CollectionsPage />)}
                />
                <Route
                    path="achievements"
                    element={wrapRoute(<AchievementsPage />)}
                />
                <Route path="notes" element={wrapRoute(<NotesPage />)} />
                <Route
                    path="accounting"
                    element={wrapRoute(<AccountingPage />)}
                />
                <Route path="settings" element={wrapRoute(<SettingsPage />)} />
            </Route>

            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<CatchAll />} />
        </Routes>
    );
}
