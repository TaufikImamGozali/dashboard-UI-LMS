import React from 'react';
import { BarChart2, Globe, BookOpen, Award, Infinity as InfinityIcon } from 'lucide-react';
import type { CourseDetail } from '../../types';

interface CourseInfoCardProps {
  course: CourseDetail;
}

export const CourseInfoCard: React.FC<CourseInfoCardProps> = ({ course }) => {
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  const infoItems = [
    {
      icon: BarChart2,
      label: 'Skill Level',
      value: course.level,
    },
    {
      icon: Globe,
      label: 'Language',
      value: course.language,
    },
    {
      icon: BookOpen,
      label: 'Total Lessons',
      value: `${totalLessons} lessons (${course.totalDuration})`,
    },
    {
      icon: Award,
      label: 'Certificate',
      value: course.certificate ? 'Verified Certificate' : 'Not Included',
    },
    {
      icon: InfinityIcon,
      label: 'Access',
      value: course.access,
    },
  ];

  return (
    <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-[#EEF0F6] shadow-xs space-y-4">
      <h2 className="text-base font-bold text-slateText-primary tracking-tight">
        Course Information
      </h2>

      <div className="divide-y divide-[#F5F6FA] text-xs">
        {infoItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-slateText-muted">
                <Icon className="w-4 h-4 text-brand-500 stroke-[2]" />
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="font-semibold text-slateText-primary text-right">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
