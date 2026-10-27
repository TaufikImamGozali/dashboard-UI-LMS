import React, { useState } from 'react';
import {
  ChevronDown,
  Play,
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react';
import type { CourseSection, CurriculumLesson } from '../../types';

interface CurriculumAccordionProps {
  sections: CourseSection[];
  activeLessonId: string;
  onSelectLesson: (lesson: CurriculumLesson) => void;
}

export const CurriculumAccordion: React.FC<CurriculumAccordionProps> = ({
  sections,
  activeLessonId,
  onSelectLesson,
}) => {
  // By default, open the first section and any section containing the active lesson
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = { [sections[0]?.id]: true };
    sections.forEach((sec) => {
      if (sec.lessons.some((l) => l.id === activeLessonId)) {
        initial[sec.id] = true;
      }
    });
    return initial;
  });

  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleLessonClick = (lesson: CurriculumLesson) => {
    if (lesson.isLocked) {
      setLockedTooltip(lesson.id);
      setTimeout(() => setLockedTooltip(null), 2500);
      return;
    }
    onSelectLesson(lesson);
  };

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = !!openSections[section.id];
        const completedCount = section.lessons.filter((l) => l.isCompleted).length;

        return (
          <div
            key={section.id}
            className="rounded-card border border-slate-200/80 bg-surface overflow-hidden transition-all duration-200 shadow-2xs"
          >
            {/* Section Accordion Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <div className="space-y-0.5 pr-4">
                <h2 className="text-sm font-bold text-slateText-primary flex items-center gap-2">
                  <span>{section.title}</span>
                </h2>
                <p className="text-xs text-slateText-muted flex items-center gap-2">
                  <span>{section.lessons.length} lessons</span>
                  <span>•</span>
                  <span>{completedCount}/{section.lessons.length} completed</span>
                </p>
              </div>

              <div
                className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slateText-secondary transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180 bg-brand-50 text-brand-500' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Accordion Lessons List */}
            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-100 bg-surface-muted animate-fadeIn">
                {section.lessons.map((lesson) => {
                  const isActive = lesson.id === activeLessonId;
                  const isTooltipVisible = lockedTooltip === lesson.id;

                  return (
                    <button
                      type="button"
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${lesson.title}${lesson.isLocked ? ', locked' : ''}`}
                      className={`relative w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400 ${
                        isActive
                          ? 'bg-brand-50/70 text-brand-600 font-semibold'
                          : lesson.isLocked
                          ? 'opacity-65 hover:bg-slate-100/50 cursor-not-allowed'
                          : 'hover:bg-surface text-slateText-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status Icon */}
                        <div className="shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                          ) : isActive ? (
                            <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-xs">
                              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                            </div>
                          ) : lesson.isLocked ? (
                            <Lock className="w-4 h-4 text-slate-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-brand-400" />
                          )}
                        </div>

                        {/* Title */}
                        <span className="text-xs sm:text-sm truncate leading-snug">
                          {lesson.title}
                        </span>
                      </div>

                      {/* Duration & Lock Tooltip */}
                      <div className="flex items-center gap-2 shrink-0 text-xs text-slateText-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </span>

                        {/* Tooltip on locked click */}
                        {isTooltipVisible && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-tooltip bg-slate-900 text-white text-meta font-medium px-3 py-1.5 rounded-lg shadow-lg animate-fadeIn pointer-events-none">
                            Complete previous lessons to unlock
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
