import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, ArrowRight } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { CourseHeader } from '../components/course/CourseHeader';
import { VideoPlayer } from '../components/course/VideoPlayer';
import { CourseTabs } from '../components/course/CourseTabs';
import { CourseProgressPanel } from '../components/course/CourseProgressPanel';
import { CourseInfoCard } from '../components/course/CourseInfoCard';
import { CourseMentorCard } from '../components/course/CourseMentorCard';
import { CourseCard } from '../components/CourseCard';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { mockCoursesDetail } from '../data/courses';
import { mockCourses, mockFriends } from '../data/mockData';
import type { CourseDetail, CurriculumLesson } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

const firstAvailableLesson = (course: CourseDetail | null): CurriculumLesson | null => {
  if (!course) return null;
  for (const section of course.sections) {
    const lesson = section.lessons.find((item) => !item.isCompleted && !item.isLocked);
    if (lesson) return lesson;
  }
  return course.sections[0]?.lessons[0] ?? null;
};

const CourseDetailContent: React.FC<{ courseId?: string }> = ({ courseId }) => {
  const navigate = useNavigate();
  const initialCourse = courseId ? mockCoursesDetail[courseId] ?? null : null;
  const [courseData, setCourseData] = useState<CourseDetail | null>(initialCourse);
  const [activeLesson, setActiveLesson] = useState<CurriculumLesson | null>(() => firstAvailableLesson(initialCourse));
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { logout } = useAuth();
  const { conversations } = useChat();
  const unreadMessages = conversations.reduce((total, item) => total + item.unreadCount, 0);

  // Mark lesson as complete & update state
  const handleMarkAsComplete = (lessonId: string) => {
    if (!courseData) return;

    setCourseData((prev) => {
      if (!prev) return null;
      const updatedSections = prev.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, isCompleted: !lesson.isCompleted }
            : lesson
        ),
      }));
      return {
        ...prev,
        sections: updatedSections,
      };
    });

    setActiveLesson((prev) =>
      prev && prev.id === lessonId ? { ...prev, isCompleted: !prev.isCompleted } : prev
    );
  };

  // Continue Learning CTA: finds next uncompleted lesson
  const handleContinueLearning = () => {
    if (!courseData) return;

    let nextLesson: CurriculumLesson | null = null;
    for (const section of courseData.sections) {
      for (const lesson of section.lessons) {
        if (!lesson.isCompleted && !lesson.isLocked) {
          nextLesson = lesson;
          break;
        }
      }
      if (nextLesson) break;
    }

    if (nextLesson) {
      setActiveLesson(nextLesson);
    }
    // Scroll smoothly to video player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = () => {
    if (!courseData) return;
    setCourseData((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
  };

  const handleToggleMentorFollow = () => {
    if (!courseData) return;
    setCourseData((prev) =>
      prev
        ? {
            ...prev,
            mentor: { ...prev.mentor, isFollowing: !prev.mentor.isFollowing },
          }
        : null
    );
  };

  const handleLogout = () => {
    logout();
    sessionStorage.setItem('coursue_flash', 'You have been logged out.');
    navigate('/login', { replace: true });
  };

  // If Course Not Found
  if (!courseData) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-lg bg-surface rounded-4xl p-8 sm:p-12 text-center shadow-container border border-slate-200/80 space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto shadow-purple-glow">
            <Compass className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slateText-primary tracking-tight">
              Course Not Found
            </h1>
            <p className="text-sm text-slateText-secondary leading-relaxed">
              We couldn't find the course you're looking for. It may have been relocated or unpublished.
            </p>
          </div>

          <div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="rounded-full shadow-purple-glow"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate completed lessons
  const totalLessons = courseData.sections.reduce(
    (acc, s) => acc + s.lessons.length,
    0
  );
  const completedLessons = courseData.sections.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.isCompleted).length,
    0
  );

  // 3 Related Courses (excluding current course)
  const relatedCourses = mockCourses
    .filter((c) => c.id !== courseData.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-3 sm:p-5 lg:p-8 font-sans">
      {/* Outer Shell matching Dashboard design */}
      <div className="w-full max-w-app bg-brand-card rounded-shell sm:rounded-shell-lg shadow-container border border-outline overflow-hidden flex flex-col md:flex-row min-h-app">
        
        {/* Column 1: Left Sidebar */}
        <Sidebar
          currentPath="/lesson"
          onNavigate={(path) => navigate(path)}
          friends={mockFriends}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={() => setLogoutOpen(true)}
          unreadMessages={unreadMessages}
        />

        {/* Column 2 & 3: Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface">
          {/* Topbar */}
          <Topbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onRequestLogout={() => setLogoutOpen(true)}
          />

          {/* Main Course Content */}
          <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar space-y-10">
            {/* Top Grid: Video & Tabs (Col 1-8) vs Right Info Panel (Col 9-12) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left Main Column */}
              <div className="xl:col-span-8 space-y-6">
                {/* Header with Breadcrumb */}
                <CourseHeader course={courseData} />

                {/* Video Player */}
                <VideoPlayer
                  lesson={activeLesson}
                  thumbnail={courseData.thumbnail}
                  onMarkAsComplete={handleMarkAsComplete}
                />

                {/* Tabs: Overview, Lessons Curriculum, Reviews */}
                <CourseTabs
                  course={courseData}
                  activeLessonId={activeLesson?.id || ''}
                  onSelectLesson={(lesson) => setActiveLesson(lesson)}
                />
              </div>

              {/* Right Sidebar Panel */}
              <div className="xl:col-span-4 space-y-6">
                {/* Progress Card */}
                <CourseProgressPanel
                  completedLessons={completedLessons}
                  totalLessons={totalLessons}
                  isFavorite={courseData.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onContinueLearning={handleContinueLearning}
                />

                {/* Course Info Card */}
                <CourseInfoCard course={courseData} />

                {/* Mentor Instructor Card */}
                <CourseMentorCard
                  mentor={courseData.mentor}
                  onToggleFollow={handleToggleMentorFollow}
                />
              </div>
            </div>

            {/* Bottom: Related Courses Section */}
            <div className="pt-6 border-t border-slate-100 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slateText-primary tracking-tight">
                    Related Courses
                  </h2>
                  <p className="text-xs text-slateText-muted mt-0.5">
                    Expand your skillset with curated complementary courses
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedCourses.map((relCourse) => (
                  <CourseCard
                    key={relCourse.id}
                    course={relCourse}
                    onToggleFavorite={() => {}}
                    onClick={() => navigate(`/course/${relCourse.id}`)}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA (<768px) */}
      <div className="fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md p-3 px-4 border-t border-slate-200/80 flex items-center justify-between gap-4 z-sticky md:hidden shadow-lg">
        <div>
          <p className="text-xs font-bold text-slateText-primary leading-tight">
            {completedLessons} of {totalLessons} Lessons
          </p>
          <p className="text-meta text-slateText-muted">
            {Math.round((completedLessons / totalLessons) * 100)}% completed
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleContinueLearning}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="rounded-full shadow-purple-glow"
        >
          Continue Learning
        </Button>
      </div>
      <ConfirmDialog isOpen={logoutOpen} title="Log out" message="Are you sure you want to log out?" confirmLabel="Logout" onCancel={() => setLogoutOpen(false)} onConfirm={handleLogout} />
    </div>
  );
};

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <CourseDetailContent key={id ?? 'missing'} courseId={id} />;
};
