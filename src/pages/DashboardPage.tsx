import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import { ContinueWatchingSection } from '../components/ContinueWatchingSection';
import { CourseProgressCard } from '../components/CourseProgressCard';
import { HeroBanner } from '../components/HeroBanner';
import { LessonTable } from '../components/LessonTable';
import { DashboardAnnouncementsCard } from '../components/dashboard/DashboardAnnouncementsCard';
import { StatisticCard } from '../components/StatisticCard';
import { Button } from '../components/ui/Button';
import { mockStatistics } from '../data/mockData';
import type { Course, Lesson, ProgressSummary } from '../types';
import { courseService } from '../services/courseService';

interface DashboardPageProps {
  searchQuery: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ searchQuery }) => {
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [progressSummaries, setProgressSummaries] = useState<ProgressSummary[]>([]);
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [myCourses, summaries, lessons] = await Promise.all([
          courseService.getMyEnrollments(),
          courseService.getMyProgressSummaries(),
          courseService.getRecentLessonsForUser(),
        ]);

        if (isMounted) {
          setEnrolledCourses(myCourses);
          setProgressSummaries(summaries);
          setRecentLessons(lessons);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const openProgressCourse = (summary: ProgressSummary) => {
    navigate(`/course/${summary.id}`);
  };

  const openLesson = (lesson: Lesson) => {
    if (lesson.courseId) {
      navigate(`/course/${lesson.courseId}`);
    } else {
      navigate('/lesson');
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:gap-7 xl:grid-cols-12">
      <div className="space-y-6 lg:space-y-7 xl:col-span-8">
        {/* Banner with CTA pointing to courses catalog */}
        <HeroBanner onJoinClick={() => navigate('/lesson')} />

        {/* 3 Top Cards: Progress Summaries */}
        {isLoading ? (
          <div className="p-6 rounded-card bg-surface border border-outline flex items-center justify-center gap-3 text-xs text-slateText-muted">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
            <span>Memuat progres kursus Anda...</span>
          </div>
        ) : progressSummaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-4">
            {progressSummaries.map((summary) => (
              <CourseProgressCard
                key={summary.id}
                progress={summary}
                onClick={() => openProgressCourse(summary)}
              />
            ))}
          </div>
        ) : (
          /* Empty State for Progress Summaries when not enrolled yet */
          <div className="p-5 rounded-card bg-surface border border-outline-subtle shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slateText-primary">
                  Mulai Perjalanan Belajarmu 🚀
                </h3>
                <p className="text-xs text-slateText-muted mt-0.5">
                  Daftar kursus gratis untuk mulai melacak progres dan sertifikatmu di sini.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/lesson')}
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              className="rounded-full shrink-0"
            >
              Lihat Katalog
            </Button>
          </div>
        )}

        {/* Continue Watching Section */}
        <ContinueWatchingSection
          courses={enrolledCourses}
          searchQuery={searchQuery}
          onToggleFavorite={(courseId) =>
            setEnrolledCourses((current) =>
              current.map((c) =>
                c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c
              )
            )
          }
          onCourseClick={(course) => navigate(`/course/${course.slug || course.id}`)}
        />

        {/* Lesson Table */}
        <LessonTable
          lessons={recentLessons}
          onActionClick={openLesson}
          onSeeAllClick={() => navigate('/lesson')}
        />
      </div>

      <div className="space-y-6 lg:space-y-7 xl:col-span-4">
        <StatisticCard data={mockStatistics} />
        <DashboardAnnouncementsCard />
      </div>
    </div>
  );
};
