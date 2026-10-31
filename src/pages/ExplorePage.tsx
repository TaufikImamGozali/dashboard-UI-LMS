import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  Play,
  ArrowRight,
  Filter,
  Heart,
} from 'lucide-react';
import { courseService, type ExploreCourse } from '../services/courseService';
import type { CategoryType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { formatPrice } from '../utils/currency';

interface ExplorePageProps {
  searchQuery?: string;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ searchQuery: externalSearch = '' }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [courses, setCourses] = useState<ExploreCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const effectiveSearch = search || externalSearch;
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid' | 'favorite'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CategoryType>('all');

  const loadCourses = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await courseService.getExploreCourses();
      setCourses(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memuat katalog kelas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchCatalog = async () => {
      try {
        const data = await courseService.getExploreCourses();
        if (mounted) setCourses(data);
      } catch (err: any) {
        if (mounted) setErrorMessage(err?.message || 'Gagal memuat katalog kelas.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    void fetchCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.categoryLabel.toLowerCase().includes(effectiveSearch.toLowerCase());

    if (!matchesSearch) return false;

    // Price & Favorite filter
    if (priceFilter === 'free' && c.price > 0) return false;
    if (priceFilter === 'paid' && c.price === 0) return false;
    if (priceFilter === 'favorite' && !isFavorite(c.id)) return false;

    // Category filter
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;

    return true;
  });

  const renderPriceBadge = (price: number) => {
    if (!price || price === 0) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/90 text-white font-extrabold text-[11px] shadow-xs tracking-wide">
          GRATIS
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-purple-900/90 text-purple-200 font-extrabold text-[11px] border border-purple-400/30 shadow-xs tracking-wide flex items-center gap-1">
        <span>👑</span>
        <span>{formatPrice(price)}</span>
      </span>
    );
  };

  const handleOpenCourse = (course: ExploreCourse) => {
    navigate(`/course/${course.slug || course.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Banner Explorer */}
      <div className="relative rounded-card bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 p-6 sm:p-8 text-white overflow-hidden shadow-card">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 hidden md:block">
          <svg viewBox="0 0 160 160" className="w-56 h-56 fill-white">
            <path d="M80 0 C80 50, 110 80, 160 80 C110 80, 80 110, 80 160 C80 110, 50 80, 0 80 C50 80, 80 50, 80 0 Z" />
          </svg>
        </div>

        <div className="relative z-content space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Katalog Kelas Lengkap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Eksplorasi Kelas & Tingkatkan Keahlianmu 🚀
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Temukan kursus pemrograman, UI/UX design, dan strategi digital terbaik dari mentor industri profesional.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 bg-surface p-4 sm:p-5 rounded-2xl border border-outline shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slateText-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul kursus, topik, atau kategori..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-muted rounded-xl text-sm border border-transparent focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 text-content-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-content-muted hover:text-content-primary"
              >
                Clear
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <button
              type="button"
              onClick={loadCourses}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-outline text-content-secondary hover:bg-surface-muted text-xs font-bold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Categories and Price Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-subtle text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <span className="font-bold text-content-muted mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Kategori:
            </span>
            {(
              [
                { id: 'all', label: 'Semua' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'design', label: 'UI/UX Design' },
                { id: 'branding', label: 'Branding' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategoryFilter(item.id)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  categoryFilter === item.id
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-surface-muted text-content-secondary hover:bg-brand-50 hover:text-brand-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Price & Favorites Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-content-muted mr-1">Tipe:</span>
            {(
              [
                { id: 'all', label: 'Semua' },
                { id: 'free', label: 'Gratis' },
                { id: 'paid', label: 'Berbayar 👑' },
                { id: 'favorite', label: 'Favorit ❤️' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPriceFilter(item.id)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  priceFilter === item.id
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-surface-muted text-content-secondary hover:bg-brand-50 hover:text-brand-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface rounded-card p-4 border border-outline animate-pulse space-y-4 shadow-xs"
            >
              <div className="aspect-[16/10] bg-surface-muted rounded-2xl" />
              <div className="h-4 bg-surface-muted rounded w-1/3" />
              <div className="h-6 bg-surface-muted rounded w-3/4" />
              <div className="h-4 bg-surface-muted rounded w-full" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 w-8 rounded-full bg-surface-muted" />
                <div className="h-8 bg-surface-muted rounded-full w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <div className="p-12 text-center bg-surface rounded-card border border-rose-200 space-y-3">
          <p className="text-sm font-bold text-rose-600">{errorMessage}</p>
          <button
            type="button"
            onClick={loadCourses}
            className="px-5 py-2 rounded-full bg-brand-500 text-white font-bold text-xs"
          >
            Coba Lagi
          </button>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleOpenCourse(course)}
              className="bg-surface rounded-card p-4 sm:p-5 border border-outline hover:border-brand-300 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-3.5 bg-surface-muted">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Price Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    {renderPriceBadge(course.price)}
                  </div>

                  {/* Heart / Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(course.id, course.title);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-75 hover:scale-110 z-10 ${
                      isFavorite(course.id)
                        ? 'bg-surface text-rose-500 shadow-sm ring-1 ring-rose-200'
                        : 'bg-black/30 text-white hover:bg-surface hover:text-rose-500'
                    }`}
                    aria-label={isFavorite(course.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isFavorite(course.id) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Enrolled Badge */}
                  {course.isEnrolled && (
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-extrabold text-[10px] shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Diikuti</span>
                      </span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md text-content-primary font-bold text-[10px] uppercase tracking-wider shadow-xs">
                      {course.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Level and Lessons count */}
                <div className="flex items-center justify-between text-xs text-content-muted mb-2">
                  <span className="font-semibold">{course.level}</span>
                  <div className="flex items-center gap-1.5 font-semibold text-content-secondary">
                    <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                    <span>{course.lessonsCount} Materi</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-content-primary group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-1">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Footer: Mentor & CTA Button */}
              <div className="pt-4 mt-4 border-t border-outline-subtle flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={course.mentor.avatar}
                    alt={course.mentor.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-outline"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-content-primary truncate">
                      {course.mentor.name}
                    </p>
                  </div>
                </div>

                {course.isEnrolled ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCourse(course);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors shrink-0"
                  >
                    <Play className="w-3 h-3 fill-emerald-600 stroke-none" />
                    <span>Lanjut Belajar</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCourse(course);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white font-bold text-xs border border-brand-200 transition-all shrink-0"
                  >
                    <span>Detail Kelas</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-surface rounded-card border border-outline space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-content-primary">
            Tidak ada kursus yang cocok
          </h3>
          <p className="text-xs text-content-muted max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau sesuaikan pilihan filter kategori dan harga.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setPriceFilter('all');
              setCategoryFilter('all');
            }}
            className="text-xs font-bold text-brand-500 hover:underline"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
