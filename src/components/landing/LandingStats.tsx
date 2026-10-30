import React, { useEffect, useState } from 'react';
import { Users, Award, BookOpen, Star } from 'lucide-react';
import { landingContent, type LandingStat } from '../../data/landingContent';
import { supabase } from '../../lib/supabase';

export const LandingStats: React.FC = () => {
  const [stats, setStats] = useState<LandingStat[]>(landingContent.stats);

  useEffect(() => {
    // Attempt to enrich with real counts from Supabase if accessible
    void (async () => {
      try {
        const { count: courseCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        if (typeof courseCount === 'number' && courseCount > 0) {
          setStats((prev) =>
            prev.map((item) =>
              item.id === 'courses'
                ? { ...item, value: `${courseCount} Kelas Aktif` }
                : item
            )
          );
        }
      } catch {
        // Fall back to clean default constants
      }
    })();
  }, []);

  const renderIcon = (name: LandingStat['iconName']) => {
    switch (name) {
      case 'Users':
        return <Users className="w-6 h-6 text-brand-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-purple-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case 'Star':
        return <Star className="w-6 h-6 text-amber-500 fill-amber-400" />;
      default:
        return <Users className="w-6 h-6 text-brand-500" />;
    }
  };

  return (
    <section className="py-12 border-y border-outline/70 bg-surface/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface border border-outline flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:border-brand-300 transition-all duration-300">
                {renderIcon(stat.iconName)}
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-bold text-brand-600 mt-0.5">
                  {stat.label}
                </p>
                <p className="text-xs text-content-muted mt-1 hidden sm:block">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

