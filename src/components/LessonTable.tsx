import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Lesson } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface LessonTableProps {
  lessons: Lesson[];
  onActionClick?: (lesson: Lesson) => void;
  onSeeAllClick?: () => void;
}

export const LessonTable: React.FC<LessonTableProps> = ({
  lessons,
  onActionClick,
  onSeeAllClick,
}) => {
  return (
    <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-[#EEF0F6] shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slateText-primary tracking-tight">
          Your Lesson
        </h2>
        <button
          onClick={onSeeAllClick || (() => alert('Viewing all lessons'))}
          className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
        >
          See all
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0F1F6] text-[11px] font-bold text-slateText-muted uppercase tracking-wider">
              <th className="pb-3 pl-2 font-semibold">Mentor</th>
              <th className="pb-3 px-3 font-semibold text-center">Type</th>
              <th className="pb-3 px-4 font-semibold">Desc</th>
              <th className="pb-3 pr-2 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F6F7FA]">
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
                className="group hover:bg-[#F9FAFC] transition-colors"
              >
                {/* Mentor Column */}
                <td className="py-3.5 pl-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={lesson.mentorAvatar}
                      alt={lesson.mentorName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="text-xs font-bold text-slateText-primary group-hover:text-brand-500 transition-colors">
                        {lesson.mentorName}
                      </p>
                      <p className="text-[11px] text-slateText-muted">
                        {lesson.date}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Type Column */}
                <td className="py-3.5 px-3 text-center">
                  <CategoryBadge
                    category={lesson.type}
                    label={lesson.typeLabel}
                  />
                </td>

                {/* Description Column */}
                <td className="py-3.5 px-4">
                  <p className="text-xs font-semibold text-slateText-primary line-clamp-1">
                    {lesson.description}
                  </p>
                </td>

                {/* Action Column */}
                <td className="py-3.5 pr-2 text-right">
                  <button
                    onClick={() => onActionClick && onActionClick(lesson)}
                    className="w-8 h-8 rounded-full border border-[#E5E7EB] hover:border-brand-500 hover:bg-brand-500 hover:text-white flex items-center justify-center text-slateText-secondary transition-all duration-200 group/btn ml-auto shadow-2xs"
                    aria-label={`Open lesson: ${lesson.description}`}
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card List (<640px) */}
      <div className="sm:hidden space-y-3">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={lesson.mentorAvatar}
                  alt={lesson.mentorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slateText-primary">
                    {lesson.mentorName}
                  </p>
                  <p className="text-[10px] text-slateText-muted">
                    {lesson.date}
                  </p>
                </div>
              </div>
              <CategoryBadge category={lesson.type} label={lesson.typeLabel} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs font-semibold text-slateText-primary line-clamp-1 pr-2">
                {lesson.description}
              </p>
              <button
                onClick={() => onActionClick && onActionClick(lesson)}
                className="w-7 h-7 shrink-0 rounded-full border border-[#E5E7EB] hover:border-brand-500 hover:bg-brand-500 hover:text-white flex items-center justify-center text-slateText-secondary transition-colors"
                aria-label={`Open lesson: ${lesson.description}`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
