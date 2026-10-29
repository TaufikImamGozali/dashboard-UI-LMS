import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, RefreshCw, CreditCard } from 'lucide-react';
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
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { mockFriends } from '../data/mockData';
import type { CourseDetail, CurriculumLesson, Course } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { courseService } from '../services/courseService';

const firstAvailableLesson = (course: CourseDetail | null): CurriculumLesson | null => {
  if (!course) return null;
  for (const section of course.sections) {
    const lesson = section.lessons.find((item) => !item.isCompleted && !item.isLocked);
    if (lesson) return lesson;
  }
  return course.sections[0]?.lessons[0] ?? null;
};

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { conversations } = useChat();
  const { toasts, showToast, dismissToast } = useToast();

  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [activeLesson, setActiveLesson] = useState<CurriculumLesson | null>(null);
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const unreadMessages = conversations.reduce((total, item) => total + item.unreadCount, 0);

  // Load course details from Supabase on mount or id change
  useEffect(() => {
    let isMounted = true;
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const [detail, allCourses] = await Promise.all([
          courseService.getCourseBySlugOrId(id),
          courseService.getPublishedCourses(),
        ]);

        if (isMounted) {
          if (!detail) {
            setErrorMessage('Kursus tidak ditemukan.');
          } else {
            setCourseData(detail);
            setActiveLesson(firstAvailableLesson(detail));
          }
          setPublishedCourses(allCourses);
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Terjadi kesalahan saat memuat materi kursus.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const refetchCourse = useCallback(async () => {
    if (!id) return;
    try {
      const detail = await courseService.getCourseBySlugOrId(id);
      if (detail) {
        setCourseData(detail);
        setActiveLesson(firstAvailableLesson(detail));
      }
    } catch (err) {
      console.error('Failed to reload course:', err);
    }
  }, [id]);

  // Flatten all lessons across sections for sequential navigation
  const allLessons = useMemo(() => {
    if (!courseData) return [];
    return courseData.sections.flatMap((s) => s.lessons);
  }, [courseData]);

  const activeLessonIndex = useMemo(() => {
    if (!activeLesson) return -1;
    return allLessons.findIndex((l) => l.id === activeLesson.id);
  }, [allLessons, activeLesson]);

  const hasPrevious = activeLessonIndex > 0;
  const hasNext = activeLessonIndex >= 0 && activeLessonIndex < allLessons.length - 1;

  const handlePreviousLesson = () => {
    if (hasPrevious) {
      setActiveLesson(allLessons[activeLessonIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      setActiveLesson(allLessons[activeLessonIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle mark lesson as complete & persist to Supabase
  const handleMarkAsComplete = async (lessonId: string) => {
    if (!courseData) return;

    const currentLesson = allLessons.find((l) => l.id === lessonId);
    const targetStatus = !(currentLesson?.isCompleted ?? false);

    // Optimistic UI update
    setCourseData((prev) => {
      if (!prev) return null;
      const updatedSections = prev.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, isCompleted: targetStatus } : lesson
        ),
      }));
      return {
        ...prev,
        sections: updatedSections,
      };
    });

    setActiveLesson((prev) =>
      prev && prev.id === lessonId ? { ...prev, isCompleted: targetStatus } : prev
    );

    // Persist to Supabase lesson_progress table
    const res = await courseService.markLessonCompleted(lessonId, targetStatus);
    if (!res.success) {
      showToast(res.error || 'Gagal memperbarui progres materi', 'error');
    } else {
      showToast(
        targetStatus ? 'Materi ditandai sebagai selesai! 🎉' : 'Materi ditandai belum selesai',
        'success'
      );
    }
  };

  // Free enrollment handler
  const handleEnrollFree = async () => {
    if (!courseData) return;
    setIsEnrolling(true);

    const res = await courseService.enrollFreeCourse(courseData.id);
    setIsEnrolling(false);

    if (res.success) {
      showToast('Berhasil mendaftar ke kelas gratis ini! Selamat belajar 🎉', 'success');
      // Reload course details to refresh unlocked lessons
      await refetchCourse();
    } else {
      showToast(res.error || 'Gagal mendaftar kelas', 'error');
    }
  };

  // Paid course handler
  const handlePaidClick = () => {
    showToast(
      'Sistem pembayaran kelas berbayar saat ini belum tersedia. Nantikan update segera!',
      'info'
    );
  };

  const handleContinueLearning = () => {
    if (!courseData) return;

    const nextUncompleted = allLessons.find((l) => !l.isCompleted && !l.isLocked);
    if (nextUncompleted) {
      setActiveLesson(nextUncompleted);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleFavorite = () => {
    if (!courseData) return;
    setCourseData((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    showToast(
      courseData.isFavorite ? 'Dihapus dari daftar favorit' : 'Ditambahkan ke daftar favorit',
      'info'
    );
  };

  const handleToggleMentorFollow = () => {
    if (!courseData) return;
    const isNowFollowing = !courseData.mentor.isFollowing;
    setCourseData((prev) =>
      prev
        ? {
            ...prev,
            mentor: { ...prev.mentor, isFollowing: isNowFollowing },
          }
        : null
    );
    showToast(
      isNowFollowing ? `Mengikuti ${courseData.mentor.name}` : `Berhenti mengikuti ${courseData.mentor.name}`,
      'info'
    );
  };

  const handleLogout = () => {
    logout();
    sessionStorage.setItem('coursue_flash', 'You have been logged out.');
    navigate('/login', { replace: true });
  };

  // State 1: Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-3 sm:p-5 lg:p-8 font-sans">
        <div className="w-full max-w-app bg-brand-card rounded-shell sm:rounded-shell-lg shadow-container border border-outline overflow-hidden flex flex-col md:flex-row min-h-app">
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center animate-spin">
              <RefreshCw className="w-6 h-6 stroke-[2]" />
            </div>
            <p className="text-sm font-semibold text-slateText-secondary">
              Memuat data kelas dan materi pembelajaran...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Course Not Found or Error
  if (!courseData || errorMessage) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-lg bg-surface rounded-4xl p-8 sm:p-12 text-center shadow-container border border-outline space-y-5 animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slateText-primary tracking-tight">
              {errorMessage || 'Kursus Tidak Ditemukan'}
            </h1>
            <p className="text-sm text-slateText-secondary leading-relaxed">
              Kursus yang Anda cari tidak tersedia atau belum dipublikasikan oleh administrator.
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
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate completed lessons
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => l.isCompleted).length;
  const isEnrolled = courseData.status === 'in-progress' || courseData.access === 'Akses Penuh Aktif';
  const relatedCourses = publishedCourses.filter((c) => c.id !== courseData.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-3 sm:p-5 lg:p-8 font-sans">
      <div className="w-full max-w-app bg-brand-card rounded-shell sm:rounded-shell-lg shadow-container border border-outline overflow-hidden flex flex-col md:flex-row min-h-app">
        {/* Left Sidebar */}
        <Sidebar
          currentPath="/lesson"
          onNavigate={(path) => navigate(path)}
          friends={mockFriends}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={() => setLogoutOpen(true)}
          unreadMessages={unreadMessages}
        />

        {/* Content Area */}
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
              {/* Left Column */}
              <div className="xl:col-span-8 space-y-6">
                <CourseHeader course={courseData} />

                {/* Paid Course Announcement Banner */}
                {!isEnrolled && Boolean(courseData.price && courseData.price > 0) && (
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-scale-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-900">
                            Kelas Premium Berbayar
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-meta font-extrabold bg-purple-200 text-purple-800">
                            ${courseData.price}
                          </span>
                        </div>
                        <p className="text-xs text-purple-700 mt-0.5">
                          Materi awal tersedia sebagai preview gratis. Beli kelas untuk membuka semua {totalLessons} materi.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handlePaidClick}
                      className="rounded-full shrink-0 shadow-purple-glow bg-purple-600 hover:bg-purple-700"
                    >
                      Beli Kelas (${courseData.price})
                    </Button>
                  </div>
                )}

                {/* Video Player */}
                <VideoPlayer
                  lesson={activeLesson}
                  thumbnail={courseData.thumbnail}
                  isEnrolled={isEnrolled}
                  isPaid={Boolean(courseData.price && courseData.price > 0)}
                  price={courseData.price}
                  isEnrolling={isEnrolling}
                  onMarkAsComplete={handleMarkAsComplete}
                  onPreviousLesson={handlePreviousLesson}
                  onNextLesson={handleNextLesson}
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                  onEnrollFree={handleEnrollFree}
                  onPaidClick={handlePaidClick}
                />

                {/* Tabs: Overview, Lessons Curriculum, Reviews */}
                <CourseTabs
                  course={courseData}
                  activeLessonId={activeLesson?.id || ''}
                  onSelectLesson={(lesson) => {
                    setActiveLesson(lesson);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>

              {/* Right Sidebar Panel */}
              <div className="xl:col-span-4 space-y-6">
                {/* Progress or Enrollment Purchase Card */}
                <CourseProgressPanel
                  completedLessons={completedLessons}
                  totalLessons={totalLessons}
                  isFavorite={courseData.isFavorite}
                  isEnrolled={isEnrolled}
                  price={courseData.price}
                  isEnrolling={isEnrolling}
                  onToggleFavorite={handleToggleFavorite}
                  onContinueLearning={handleContinueLearning}
                  onEnrollFree={handleEnrollFree}
                  onPaidClick={handlePaidClick}
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

            {/* Related Courses Section */}
            {relatedCourses.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slateText-primary tracking-tight">
                    Kursus Terkait Lainnya
                  </h2>
                  <p className="text-xs text-slateText-muted mt-0.5">
                    Tingkatkan keahlian dengan kurikulum pilihan lainnya
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedCourses.map((relCourse) => (
                    <CourseCard
                      key={relCourse.id}
                      course={relCourse}
                      onToggleFavorite={() => {}}
                      onClick={() => navigate(`/course/${relCourse.slug || relCourse.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <ConfirmDialog
        isOpen={logoutOpen}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
