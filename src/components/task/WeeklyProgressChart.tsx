import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { Task } from '../../types/task';

interface WeeklyProgressChartProps {
  tasks: Task[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ tasks }) => {
  const data = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    return DAY_LABELS.map((label, idx) => {
      const targetDate = new Date(startOfWeek);
      targetDate.setDate(startOfWeek.getDate() + idx);
      const iso = targetDate.toISOString().split('T')[0];
      const count = tasks.filter(
        (t) => t.status === 'done' && t.deadline === iso
      ).length;
      return { label, count, isToday: idx === dayOfWeek };
    });
  }, [tasks]);

  const maxCount = Math.max(...data.map((d) => d.count), 3);

  return (
    <div className="bg-white rounded-[22px] border border-[#EEF0F6] shadow-xs p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-brand-500" />
        <h3 className="text-sm font-extrabold text-slateText-primary">Weekly Progress</h3>
      </div>
      <p className="text-xs text-slateText-muted mb-3">Tasks completed this week</p>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={18} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9E9DAE' }}
            />
            <YAxis
              domain={[0, maxCount]}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9E9DAE' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(108,92,231,0.06)', radius: 8 }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #EEF0F6',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 4px 16px -2px rgba(24,23,42,0.08)',
              }}
              formatter={(v: number | string | undefined) => {
                const n = Number(v) || 0;
                return [`${n} task${n !== 1 ? 's' : ''}`, 'Done'] as [string, string];
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.isToday ? '#6C5CE7' : entry.count > 0 ? '#C4B5FD' : '#EDE9FE'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
