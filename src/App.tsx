import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { PlaceholderView } from './components/PlaceholderView';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { RouteSkeleton } from './components/ui/RouteSkeleton';
import { mockFriends } from './data/mockData';

const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage').then((module) => ({ default: module.CourseDetailPage })));
const LessonPage = lazy(() => import('./pages/LessonPage').then((module) => ({ default: module.LessonPage })));
const TaskPage = lazy(() => import('./pages/TaskPage').then((module) => ({ default: module.TaskPage })));
const InboxPage = lazy(() => import('./pages/InboxPage').then((module) => ({ default: module.InboxPage })));
const GroupPage = lazy(() => import('./pages/GroupPage').then((module) => ({ default: module.GroupPage })));
const GroupDetailPage = lazy(() => import('./pages/GroupDetailPage').then((module) => ({ default: module.GroupDetailPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('coursue_auth');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-3 sm:p-5 lg:p-8 font-sans">
      {/* Outer Rounded App Container matching reference design */}
      <div className="w-full max-w-app bg-brand-card rounded-shell sm:rounded-shell-lg shadow-container border border-outline overflow-hidden flex flex-col md:flex-row min-h-app">
        {/* Column 1: Left Sidebar */}
        <Sidebar
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
          friends={mockFriends}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Column 2 & 3: Main Area (Center + Right) */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface">
          {/* Topbar spans center and right header */}
          <Topbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          {/* Body Content */}
          <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto no-scrollbar">
            <Routes>
              {/* Main Dashboard Route */}
              <Route
                path="/"
                element={<DashboardPage searchQuery={searchQuery} />}
              />

              {/* Secondary Dashboard Routes */}
              <Route
                path="/inbox"
                element={<InboxPage />}
              />
              <Route
                path="/lesson"
                element={<LessonPage />}
              />
              <Route
                path="/task"
                element={<TaskPage />}
              />
              <Route
                path="/group"
                element={<GroupPage />}
              />
              <Route path="/group/:id" element={<GroupDetailPage />} />
              <Route
                path="/settings"
                element={
                  <PlaceholderView
                    title="Account & Platform Settings"
                    description="Customize your profile preferences, notifications, theme appearance, and billing information."
                    onBackToDashboard={() => navigate('/')}
                  />
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

// Redirect authenticated users away from auth pages (e.g. /login -> /)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('coursue_auth') === 'true';
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <a href="#main-content" className="fixed left-4 top-4 z-toast -translate-y-24 rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-card transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300">Skip to content</a>
        <Suspense fallback={<div className="min-h-screen bg-brand-bg p-6"><RouteSkeleton /></div>}>
          <Routes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Course Detail Route */}
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
