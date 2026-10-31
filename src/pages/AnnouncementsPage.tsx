import React, { useEffect, useState, useCallback } from 'react';
import { Megaphone, Search, RefreshCw, Sparkles, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { announcementService, type AnnouncementItem } from '../services/announcementService';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<'all' | 'general' | 'course'>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await announcementService.getAnnouncementsForStudent();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error loading announcements:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchInitial = async () => {
      try {
        const data = await announcementService.getAnnouncementsForStudent();
        if (mounted) setAnnouncements(data);
      } catch (err) {
        console.error('Error loading announcements:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    void fetchInitial();
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
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.courseTitle && item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTarget === 'general') return !item.courseId;
    if (selectedTarget === 'course') return Boolean(item.courseId);
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-card bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 p-6 sm:p-8 text-white overflow-hidden shadow-card">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 hidden sm:block">
          <svg viewBox="0 0 160 160" className="w-48 h-48 fill-white">
            <path d="M80 0 C80 50, 110 80, 160 80 C110 80, 80 110, 80 160 C80 110, 50 80, 0 80 C50 80, 80 50, 80 0 Z" />
          </svg>
        </div>

        <div className="relative z-content space-y-2 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Papan Informasi Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pengumuman & Update Platform 📢
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Dapatkan berita terbaru seputar kelas yang Anda ikuti, pembaruan kurikulum, dan informasi penting lainnya.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 sm:p-4 rounded-2xl border border-outline shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slateText-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul pengumuman atau kelas..."
            className="w-full pl-10 pr-4 py-2 bg-surface-muted rounded-xl text-sm border border-transparent focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all text-content-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedTarget('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTarget === 'all'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-surface-muted text-content-secondary hover:bg-brand-50 hover:text-brand-600'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setSelectedTarget('general')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTarget === 'general'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-surface-muted text-content-secondary hover:bg-brand-50 hover:text-brand-600'
            }`}
          >
            Umum
          </button>
          <button
            type="button"
            onClick={() => setSelectedTarget('course')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTarget === 'course'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-surface-muted text-content-secondary hover:bg-brand-50 hover:text-brand-600'
            }`}
          >
            Khusus Kelas
          </button>
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl text-content-muted hover:text-brand-500 hover:bg-surface-muted transition-colors"
            title="Muat ulang"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-surface rounded-2xl p-5 border border-outline animate-pulse space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-16 h-5 bg-surface-muted rounded-full" />
                <div className="w-24 h-4 bg-surface-muted rounded" />
              </div>
              <div className="h-6 bg-surface-muted rounded w-2/3" />
              <div className="h-4 bg-surface-muted rounded w-full" />
              <div className="h-4 bg-surface-muted rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAnnouncement(item)}
              className="bg-surface rounded-2xl p-5 sm:p-6 border border-outline hover:border-brand-300 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.courseTitle ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 text-[11px] font-bold">
                      <BookOpen className="w-3 h-3 text-purple-600" />
                      <span>{item.courseTitle}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Pengumuman Umum</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-content-muted">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-content-muted">
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-outline"
                  />
                  <span>{item.authorName}</span>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-content-primary group-hover:text-brand-600 transition-colors mb-2">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-content-secondary line-clamp-2 leading-relaxed">
                {item.body}
              </p>

              <div className="mt-4 pt-3 border-t border-outline-subtle flex items-center justify-between text-xs font-semibold text-brand-600 group-hover:text-brand-700">
                <span>Baca selengkapnya</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-surface rounded-2xl border border-outline shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-content-primary">
            Belum ada pengumuman
          </h3>
          <p className="text-xs sm:text-sm text-content-muted max-w-sm mx-auto">
            Saat ini belum ada pengumuman baru untuk kategori yang Anda pilih. Silakan cek kembali nanti.
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTarget('all');
              }}
              className="mt-2 text-xs font-bold text-brand-500 hover:underline"
            >
              Reset pencarian
            </button>
          )}
        </div>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-modal bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-scale-in"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="w-full max-w-xl bg-surface rounded-shell p-6 sm:p-8 border border-outline shadow-2xl relative text-left space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-outline-subtle pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedAnnouncement.courseTitle ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span>{selectedAnnouncement.courseTitle}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pengumuman Umum</span>
                  </span>
                )}
                <span className="text-xs text-content-muted">
                  {formatDate(selectedAnnouncement.createdAt)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="w-8 h-8 rounded-full bg-surface-muted hover:bg-slate-200 text-content-secondary flex items-center justify-center text-sm font-bold"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-content-primary leading-tight">
                {selectedAnnouncement.title}
              </h2>

              <div className="flex items-center gap-2.5 text-xs text-content-muted pt-1">
                <img
                  src={selectedAnnouncement.authorAvatar}
                  alt={selectedAnnouncement.authorName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-outline"
                />
                <span className="font-semibold text-content-primary">
                  {selectedAnnouncement.authorName}
                </span>
                <span>•</span>
                <span>Administrator Coursue</span>
              </div>
            </div>

            <div className="text-sm sm:text-base text-content-secondary leading-relaxed whitespace-pre-line bg-surface-muted/50 p-4 rounded-xl border border-outline-subtle max-h-80 overflow-y-auto">
              {selectedAnnouncement.body}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-purple-glow"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
