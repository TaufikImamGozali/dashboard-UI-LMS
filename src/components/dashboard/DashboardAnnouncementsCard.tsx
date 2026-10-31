import React, { useEffect, useState } from 'react';
import { Megaphone, ArrowRight, Sparkles, BookOpen, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { announcementService, type AnnouncementItem } from '../../services/announcementService';

export const DashboardAnnouncementsCard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const data = await announcementService.getLatestAnnouncements(3);
        if (mounted) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.warn('Dashboard announcements error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-surface rounded-card p-5 sm:p-6 border border-outline-subtle shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Megaphone className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slateText-primary tracking-tight">
            Pengumuman
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/announcements')}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 bg-surface-muted rounded-xl animate-pulse space-y-2">
              <div className="h-3.5 bg-surface rounded w-1/3" />
              <div className="h-4 bg-surface rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/announcements')}
              className="p-3.5 rounded-xl bg-surface-muted/60 hover:bg-brand-50/50 border border-outline-subtle hover:border-brand-200 transition-all duration-200 cursor-pointer text-left space-y-1.5 group"
            >
              <div className="flex items-center justify-between gap-2">
                {item.courseTitle ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                    <BookOpen className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{item.courseTitle}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-2.5 h-2.5 shrink-0" />
                    <span>Umum</span>
                  </span>
                )}
                <span className="text-[10px] text-content-muted flex items-center gap-1 shrink-0">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{formatDate(item.createdAt)}</span>
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-content-primary group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-content-muted space-y-1">
          <p className="font-semibold text-content-secondary">Belum ada pengumuman</p>
          <p>Semua informasi kelas terkini akan tampil di sini.</p>
        </div>
      )}
    </div>
  );
};

