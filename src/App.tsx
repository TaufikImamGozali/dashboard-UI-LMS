import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { HeroBanner } from './components/HeroBanner';
import { CourseProgressCard } from './components/CourseProgressCard';
import { ContinueWatchingSection } from './components/ContinueWatchingSection';
import { LessonTable } from './components/LessonTable';
import { StatisticCard } from './components/StatisticCard';
import { MentorList } from './components/MentorList';
import { PlaceholderView } from './components/PlaceholderView';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LessonPage } from './pages/LessonPage';
import { TaskPage } from './pages/TaskPage';
import { InboxPage } from './pages/InboxPage';
import {
  mockFriends,
  mockProgressSummaries,
  mockCourses,
  mockLessons,
  mockMentors,
  mockStatistics,
} from './data/mockData';
import type { Course, Lesson, ProgressSummary } from './types';

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [mentors, setMentors] = useState(mockMentors);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handlers
  const handleToggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  };

  const handleToggleFollow = (mentorId: string) => {
    setMentors((prev) =>
      prev.map((m) =>
        m.id === mentorId ? { ...m, isFollowing: !m.isFollowing } : m
      )
    );
  };

  const handleCourseClick = (course: Course) => {
    navigate(`/course/${course.id}`);
  };

  const handleProgressCardClick = (summary: ProgressSummary) => {
    if (summary.category === 'design') navigate('/course/c2');
    else if (summary.category === 'branding') navigate('/course/c3');
    else if (summary.category === 'frontend') navigate('/course/c1');
    else navigate('/course/c1');
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.type === 'design') navigate('/course/c2');
    else if (lesson.type === 'branding') navigate('/course/c3');
    else if (lesson.type === 'frontend') navigate('/course/c1');
    else navigate('/course/c1');
  };

  const handleLogout = () => {
    localStorage.removeItem('coursue_auth');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-3 sm:p-5 lg:p-8 font-sans">
      {/* Outer Rounded App Container matching reference design */}
      <div className="w-full max-w-[1440px] bg-brand-card rounded-[28px] sm:rounded-[36px] shadow-container border border-[#E6E8F0] overflow-hidden flex flex-col md:flex-row min-h-[920px]">
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
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Topbar spans center and right header */}
          <Topbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          {/* Body Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto no-scrollbar">
            <Routes>
              {/* Main Dashboard Route */}
              <Route
                path="/"
                element={
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-7 items-start">
                    {/* Center Column: 8 cols on xl */}
                    <div className="xl:col-span-8 space-y-6 lg:space-y-7">
                      {/* Hero Gradient Banner */}
                      <HeroBanner
                        onJoinClick={() => navigate('/course/c1')}
                      />

                      {/* Three Progress Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                        {mockProgressSummaries.map((summary) => (
                          <CourseProgressCard
                            key={summary.id}
                            progress={summary}
                            onClick={() => handleProgressCardClick(summary)}
                          />
                        ))}
                      </div>

                      {/* Continue Watching Section */}
                      <ContinueWatchingSection
                        courses={courses}
                        searchQuery={searchQuery}
                        onToggleFavorite={handleToggleFavorite}
                        onCourseClick={handleCourseClick}
                      />

                      {/* Your Lesson Table */}
                      <LessonTable
                        lessons={mockLessons}
                        onActionClick={handleLessonClick}
                        onSeeAllClick={() => navigate('/lesson')}
                      />
                    </div>

                    {/* Column 3: Right Panel (~320px, 4 cols on xl) */}
                    <div className="xl:col-span-4 space-y-6 lg:space-y-7">
                      {/* Statistic Card with circular progress ring & Recharts bar chart */}
                      <StatisticCard data={mockStatistics} />

                      {/* Your Mentor Card with follow toggle and See All */}
                      <MentorList
                        mentors={mentors}
                        onToggleFollow={handleToggleFollow}
                        onAddMentor={() =>
                          alert('Mentor discovery directory opening...')
                        }
                        onSeeAllMentors={() =>
                          alert('All 24 active mentors displayed')
                        }
                      />
                    </div>
                  </div>
                }
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
                element={
                  <PlaceholderView
                    title="Study Groups & Community"
                    description="Collaborate with peers, participate in hackathons, and share design feedback."
                    onBackToDashboard={() => navigate('/')}
                  />
                }
              />
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
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
