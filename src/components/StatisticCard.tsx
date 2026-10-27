import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts';
import type { StatisticDataPoint } from '../types';
import { useProfile } from '../hooks/useProfile';

interface StatisticCardProps {
  data: StatisticDataPoint[];
}

export const StatisticCard: React.FC<StatisticCardProps> = ({ data }) => {
  const { profile } = useProfile();
  // SVG circular progress calculation
  const radius = 56;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (profile.completionPercentage / 100) * circumference;

  return (
    <div className="bg-surface rounded-card p-6 border border-outline-subtle shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slateText-primary tracking-tight">
          Statistic
        </h2>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-slateText-muted hover:text-slateText-primary hover:bg-surface-muted transition-colors"
          aria-label="Statistic options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Circular Avatar Progress Section */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Circular SVG Ring */}
          <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
            {/* Background track circle */}
            <circle
              stroke="var(--chart-track)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Animated progress ring */}
            <circle
              stroke="var(--chart-primary)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Inner Avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img height="160" width="160" loading="lazy"
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-50 shadow-xs"
            />
          </div>

          {/* 32% Badge at ~2 o'clock */}
          <div className="absolute top-1 right-2 bg-brand-500 text-white text-meta font-bold px-2 py-0.5 rounded-full shadow-purple-glow">
            {profile.completionPercentage}%
          </div>
        </div>

        {/* Greeting & Subtext */}
        <div className="text-center mt-3">
          <h3 className="text-base font-extrabold text-slateText-primary flex items-center justify-center gap-1.5">
            <span>Good Morning {profile.name.split(' ')[0]}</span>
            <span role="img" aria-label="fire">🔥</span>
          </h3>
          <p className="text-xs text-slateText-muted mt-1 max-w-52 mx-auto leading-relaxed">
            Continue your learning to achieve your target!
          </p>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="mt-6 pt-2 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
            barCategoryGap={20}
          >
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={[0, 20, 40, 60]}
              domain={[0, 60]}
              tick={{ fill: 'var(--chart-muted)', fontSize: 11, fontWeight: 500 }}
            />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--chart-muted)', fontSize: 11, fontWeight: 500 }}
              dy={6}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-content-primary text-content-inverse text-xs py-1.5 px-3 rounded-xl shadow-lg">
                      <p className="font-semibold">{payload[0].payload.range}</p>
                      <p className="text-brand-300 font-bold">{payload[0].value} hrs spent</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="hours"
              radius={[8, 8, 4, 4]}
              barSize={28}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.highlighted ? 'var(--chart-primary)' : 'var(--chart-secondary)'}
                  className="transition-all duration-300 hover:opacity-90"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
