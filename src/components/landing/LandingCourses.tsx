import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, BookOpen } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { landingContent } from '../../data/landingContent';
import type { Course } from '../../types';

export const LandingCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.getPublishedCourses();
        if (mounted) {
          if (data && data.length > 0) {
            setCourses(data.slice(0, 6));
            setUsingFallback(false);
          } else {
            // TODO: Fallback ke konstanta contoh jika Supabase courses belum memiliki row published
            setCourses(landingContent.courses.fallbackCourses as unknown as Course[]);
            setUsingFallback(true);
          }
        }
      } catch (err) {
        console.warn('LandingCourses fetch error, using fallback:', err);
        if (mounted) {
          setCourses(landingContent.courses.fallbackCourses as unknown as Course[]);
          setUsingFallback(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-extrabold text-xs shadow-xs tracking-wide">
          GRATIS
        </span>
      );
    }
    // If price is large (e.g. IDR > 1000) or USD
    const formatted =
      price > 1000 ? `Rp ${price.toLocaleString('id-ID')}` : `$${price}`;
    return (
      <span className="px-3 py-1 rounded-full bg-purple-900/90 backdrop-blur-md text-purple-200 font-extrabold text-xs border border-purple-400/30 shadow-xs tracking-wide">
        {formatted}
      </span>
    );
  };

  return (
    <section id="kelas" className="py-20 md:py-28 bg-surface-muted/50 border-y border-outline/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-600 text-xs font-bold uppercase tracking-wider">
              <span>{landingContent.courses.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
              {landingContent.courses.title}
            </h2>
            <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
              {landingContent.courses.subtitle}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline bg-surface hover:bg-surface-muted text-content-primary font-bold text-sm shadow-xs hover:border-brand-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <span>{landingContent.courses.ctaExplore}</span>
              <ArrowRight className="w-4 h-4 text-brand-500" />
            </Link>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-surface rounded-card p-4 border border-outline animate-pulse space-y-4"
              >
                <div className="aspect-[16/10] bg-surface-muted rounded-2xl" />
                <div className="h-4 bg-surface-muted rounded-md w-1/3" />
                <div className="h-6 bg-surface-muted rounded-md w-3/4" />
                <div className="h-4 bg-surface-muted rounded-md w-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 w-8 rounded-full bg-surface-muted" />
                  <div className="h-4 bg-surface-muted rounded-md w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCourseClick(course.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Buka detail kelas: ${course.title}`}
                className="bg-surface rounded-card p-4 sm:p-5 border border-outline hover:border-brand-300 shadow-xs hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-surface-muted">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      {formatPrice(course.price)}
                    </div>

                    {/* Category Pill */}
                    <div className="absolute bottom-3 left-3 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md text-content-primary font-bold text-[10px] uppercase tracking-wider shadow-xs">
                        {course.categoryLabel || course.category}
                      </span>
                    </div>
                  </div>

                  {/* Level & Rating meta */}
                  <div className="flex items-center justify-between text-xs text-content-muted mb-2">
                    <span className="font-semibold">{course.level || 'Beginner'}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                      <span>{course.rating || 4.9}</span>
                      <span className="text-content-muted font-normal">
                        ({course.reviewsCount || 120})
                      </span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-base sm:text-lg font-bold text-content-primary group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                </div>

                {/* Footer: Mentor & Duration */}
                <div className="pt-4 mt-4 border-t border-outline-subtle flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        course.mentor?.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          course.mentor?.name || 'Mentor'
                        )}`
                      }
                      alt={course.mentor?.name || 'Mentor'}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-outline"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-content-primary truncate">
                        {course.mentor?.name || 'Instruktur Coursue'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-content-muted shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.totalDuration || '3h 30m'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && courses.length === 0 && (
          <div className="p-12 text-center bg-surface rounded-card border border-outline">
            <BookOpen className="w-10 h-10 text-content-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-content-primary">Katalog Sedang Diperbarui</h3>
            <p className="text-sm text-content-secondary mt-1">
              Kelas-kelas baru sedang disiapkan oleh para mentor. Silakan cek kembali dalam waktu dekat.
            </p>
          </div>
        )}

        {usingFallback && (
          <div className="mt-8 text-center text-xs text-content-muted">
            <span className="inline-block px-3 py-1 rounded-full bg-surface border border-outline-subtle">
              💡 Menampilkan kelas kurasi unggulan Coursue
            </span>
          </div>
        )}

      </div>
    </section>
  );
};

