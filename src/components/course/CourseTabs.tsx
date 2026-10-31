import React, { useState } from 'react';
import { Check, Star, FileCode2 } from 'lucide-react';
import type { CourseDetail, CurriculumLesson } from '../../types';
import { CurriculumAccordion } from './CurriculumAccordion';
import { ReviewCard } from './ReviewCard';
import { CourseAssignmentTab } from './CourseAssignmentTab';

export type CourseTabId = 'overview' | 'lessons' | 'reviews' | 'assignment';

interface CourseTabsProps {
  course: CourseDetail;
  activeLessonId: string;
  onSelectLesson: (lesson: CurriculumLesson) => void;
  isEnrolled?: boolean;
  isAllLessonsCompleted?: boolean;
  activeTab?: CourseTabId;
  onTabChange?: (tab: CourseTabId) => void;
}

export const CourseTabs: React.FC<CourseTabsProps> = ({
  course,
  activeLessonId,
  onSelectLesson,
  isEnrolled = false,
  isAllLessonsCompleted = false,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<CourseTabId>('overview');
  const currentTab = controlledTab ?? internalTab;

  const handleTabClick = (tab: CourseTabId) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const tabs: Array<{ id: CourseTabId; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    {
      id: 'lessons',
      label: 'Lessons',
      count: course.sections.reduce((acc, s) => acc + s.lessons.length, 0),
    },
    { id: 'reviews', label: 'Reviews', count: course.reviews.length },
    { id: 'assignment', label: 'Tugas & Proyek' },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Tab Navigation Headers */}
      <div
        role="tablist"
        aria-label="Course content tabs"
        className="flex items-center gap-2 border-b border-slate-200/80 dark:border-darkBorder overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`pb-3.5 px-4 font-bold text-sm tracking-tight transition-all duration-200 relative whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-t-lg cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'text-brand-500'
                  : 'text-slateText-muted hover:text-slateText-primary'
              }`}
            >
              {tab.id === 'assignment' && <FileCode2 className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1.5 px-2 py-0.5 rounded-full text-meta font-semibold ${
                    isActive
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-950/50 dark:text-brand-400'
                      : 'bg-slate-100 text-slateText-muted dark:bg-darkBorder/60'
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {/* Active Tab Underline Indicator */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div>
        {/* OVERVIEW PANEL */}
        {currentTab === 'overview' && (
          <div
            role="tabpanel"
            id="tabpanel-overview"
            aria-labelledby="tab-overview"
            className="space-y-6 animate-fadeIn"
          >
            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slateText-primary">
                About this Course
              </h2>
              <p className="text-sm text-slateText-secondary leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* What you will learn */}
            <div className="p-5 sm:p-6 rounded-card bg-brand-surface border border-slate-200/70 space-y-3">
              <h2 className="text-sm font-bold text-slateText-primary uppercase tracking-wider">
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slateText-secondary leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2.5">
              <h2 className="text-base font-bold text-slateText-primary">
                Requirements
              </h2>
              <ul className="space-y-2 pl-1">
                {course.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-slateText-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* LESSONS PANEL */}
        {currentTab === 'lessons' && (
          <div
            role="tabpanel"
            id="tabpanel-lessons"
            aria-labelledby="tab-lessons"
            className="space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base font-bold text-slateText-primary">
                Course Curriculum
              </h2>
              <span className="text-xs text-slateText-muted">
                {course.sections.length} sections
              </span>
            </div>

            <CurriculumAccordion
              sections={course.sections}
              activeLessonId={activeLessonId}
              onSelectLesson={onSelectLesson}
            />
          </div>
        )}

        {/* REVIEWS PANEL */}
        {currentTab === 'reviews' && (
          <div
            role="tabpanel"
            id="tabpanel-reviews"
            aria-labelledby="tab-reviews"
            className="space-y-6 animate-fadeIn"
          >
            {/* Rating Summary Card */}
            <div className="p-5 sm:p-6 rounded-card bg-brand-surface border border-slate-200/70 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-8">
                <p className="text-4xl font-extrabold text-slateText-primary">
                  {course.rating.toFixed(1)}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-slateText-muted">
                  Course Rating ({course.reviewsCount} reviews)
                </p>
              </div>

              <div className="flex-1 space-y-1.5 w-full max-w-sm">
                <div className="flex items-center gap-2 text-xs text-slateText-muted">
                  <span>5 stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[85%]" />
                  </div>
                  <span>85%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slateText-muted">
                  <span>4 stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[12%]" />
                  </div>
                  <span>12%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slateText-muted">
                  <span>3 stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[3%]" />
                  </div>
                  <span>3%</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3.5">
              {course.reviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          </div>
        )}

        {/* ASSIGNMENT & EVALUATION PANEL */}
        {currentTab === 'assignment' && (
          <div
            role="tabpanel"
            id="tabpanel-assignment"
            aria-labelledby="tab-assignment"
            className="animate-fadeIn"
          >
            <CourseAssignmentTab
              courseId={course.id}
              isEnrolled={Boolean(isEnrolled)}
              isAllLessonsCompleted={Boolean(isAllLessonsCompleted)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
