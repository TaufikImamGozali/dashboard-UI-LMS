import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from '../../types/task';

interface MiniCalendarProps {
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ tasks, selectedDate, onSelectDate }) => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Deadline dates this month
  const deadlineDates = new Set(
    tasks
      .filter((t) => {
        const d = new Date(t.deadline);
        return d.getFullYear() === year && d.getMonth() === month && t.status !== 'done';
      })
      .map((t) => new Date(t.deadline).getDate())
  );

  const toISO = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-[22px] border border-[#EEF0F6] shadow-xs p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-slateText-primary">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous month"
            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slateText-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next month"
            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slateText-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1.5">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-slateText-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty leading cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toISO(day);
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          const hasDeadline = deadlineDates.has(day);
          const isSelected = selectedDate === iso;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : iso)}
              aria-label={`${day} ${MONTHS[month]} ${year}${hasDeadline ? ', has deadlines' : ''}`}
              aria-pressed={isSelected}
              className={`relative flex flex-col items-center justify-center h-8 w-full rounded-xl text-[11px] font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                isSelected
                  ? 'bg-brand-500 text-white shadow-purple-glow'
                  : isToday
                  ? 'bg-brand-50 text-brand-500'
                  : 'hover:bg-slate-100 text-slateText-secondary'
              }`}
            >
              {day}
              {hasDeadline && (
                <div
                  className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-brand-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <button
          type="button"
          onClick={() => onSelectDate(null)}
          className="mt-3 w-full text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors text-center py-1"
        >
          Clear date filter
        </button>
      )}
    </div>
  );
};
