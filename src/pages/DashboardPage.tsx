import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContinueWatchingSection } from '../components/ContinueWatchingSection';
import { CourseProgressCard } from '../components/CourseProgressCard';
import { HeroBanner } from '../components/HeroBanner';
import { LessonTable } from '../components/LessonTable';
import { MentorList } from '../components/MentorList';
import { StatisticCard } from '../components/StatisticCard';
import { mockCourses, mockLessons, mockMentors, mockProgressSummaries, mockStatistics } from '../data/mockData';
import type { Course, Lesson, ProgressSummary } from '../types';

interface DashboardPageProps { searchQuery: string }

export const DashboardPage: React.FC<DashboardPageProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [mentors, setMentors] = useState(mockMentors);

  const openProgressCourse = (summary: ProgressSummary) => {
    const courseId = summary.category === 'design' ? 'c2' : summary.category === 'branding' ? 'c3' : 'c1';
    navigate(`/course/${courseId}`);
  };
  const openLesson = (lesson: Lesson) => {
    const courseId = lesson.type === 'design' ? 'c2' : lesson.type === 'branding' ? 'c3' : 'c1';
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:gap-7 xl:grid-cols-12">
      <div className="space-y-6 lg:space-y-7 xl:col-span-8">
        <HeroBanner onJoinClick={() => navigate('/course/c1')} />
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-4">
          {mockProgressSummaries.map((summary) => <CourseProgressCard key={summary.id} progress={summary} onClick={() => openProgressCourse(summary)} />)}
        </div>
        <ContinueWatchingSection courses={courses} searchQuery={searchQuery} onToggleFavorite={(courseId) => setCourses((current) => current.map((course) => course.id === courseId ? { ...course, isFavorite: !course.isFavorite } : course))} onCourseClick={(course) => navigate(`/course/${course.id}`)} />
        <LessonTable lessons={mockLessons} onActionClick={openLesson} onSeeAllClick={() => navigate('/lesson')} />
      </div>
      <div className="space-y-6 lg:space-y-7 xl:col-span-4">
        <StatisticCard data={mockStatistics} />
        <MentorList mentors={mentors} onToggleFollow={(mentorId) => setMentors((current) => current.map((mentor) => mentor.id === mentorId ? { ...mentor, isFollowing: !mentor.isFollowing } : mentor))} onAddMentor={() => alert('Mentor discovery directory opening...')} onSeeAllMentors={() => alert('All 24 active mentors displayed')} />
      </div>
    </div>
  );
};
