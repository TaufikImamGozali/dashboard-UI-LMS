import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { landingContent } from '../../data/landingContent';

export const LandingHero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleScrollToCourses = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector('#kelas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-brand-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Sparkle Icons */}
      <div className="absolute top-28 left-6 md:left-20 pointer-events-none opacity-40 animate-pulse">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-brand-400 stroke-none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>
      <div className="absolute top-64 right-8 md:right-28 pointer-events-none opacity-30 animate-pulse delay-500">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-brand-500 stroke-none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-600 text-xs sm:text-sm font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>{landingContent.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-content-primary tracking-tight leading-[1.15]">
              Tingkatkan Keahlian Digital dengan Pembelajaran{' '}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 bg-clip-text text-transparent">
                Berbasis Proyek
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-2xl">
              {landingContent.hero.subheadline}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-purple-glow hover:shadow-card transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
                >
                  <span>{landingContent.hero.ctaDashboard}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-purple-glow hover:shadow-card transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
                >
                  <span>{landingContent.hero.ctaPrimary}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}

              <a
                href="#kelas"
                onClick={handleScrollToCourses}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-surface hover:bg-surface-muted text-content-primary border border-outline font-bold text-base shadow-xs hover:border-brand-200 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
              >
                <Play className="w-4 h-4 fill-brand-500 stroke-none" />
                <span>{landingContent.hero.ctaSecondary}</span>
              </a>
            </div>

            {/* Trust Note */}
            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-content-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{landingContent.hero.trustNote}</span>
            </div>

          </div>

          {/* Right Column: Visual Product Mockup with Glassmorphism */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Card with Gradient Halo */}
              <div className="relative p-1.5 sm:p-2 rounded-shell bg-gradient-to-br from-brand-400/40 via-purple-500/20 to-brand-600/30 shadow-container">
                
                {/* Main Glass Dashboard Card Mockup */}
                <div className="rounded-[1.6rem] bg-surface/90 backdrop-blur-xl border border-outline/70 p-5 sm:p-6 space-y-5 shadow-card">
                  
                  {/* Top Bar inside mockup */}
                  <div className="flex items-center justify-between border-b border-outline-subtle pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-purple-glow">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white stroke-none">
                          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-content-primary leading-tight">Coursue Studio</p>
                        <p className="text-[10px] text-content-muted">Live Student Dashboard</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Active Session
                    </span>
                  </div>

                  {/* Featured Course Preview Box */}
                  <div className="rounded-2xl border border-outline-subtle bg-surface-muted/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700">
                        FRONTEND
                      </span>
                      <span className="text-xs font-bold text-brand-600">80% Selesai</span>
                    </div>

                    <h4 className="text-sm font-extrabold text-content-primary leading-snug">
                      Fullstack React 19 & Supabase Masterclass
                    </h4>

                    {/* Progress Bar */}
                    <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full w-4/5 shadow-xs transition-all duration-500" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-content-muted pt-1">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                        <span>16 dari 20 Modul</span>
                      </div>
                      <span className="font-semibold text-content-secondary">Next: Row Level Security</span>
                    </div>
                  </div>

                  {/* Floating Sub-Card 1: Satisfaction Rating */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-outline-subtle shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
                        <Star className="w-5 h-5 fill-amber-400 stroke-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-extrabold text-content-primary">4.9 / 5.0</span>
                          <span className="text-[10px] text-amber-500 font-bold">★★★★★</span>
                        </div>
                        <p className="text-[11px] text-content-muted">3.400+ ulasan siswa puas</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Top Rated
                    </span>
                  </div>

                  {/* Sub-Card 2: Active Peer Group */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-brand-50 border border-brand-100/80 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-purple-glow">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-content-primary truncate">
                        1.200+ Pembelajar Aktif
                      </p>
                      <p className="text-[11px] text-content-muted truncate">
                        Saling berbagi kode & review tugas
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating decorative badge outside card */}
              <div className="absolute -bottom-5 -left-5 bg-surface/95 backdrop-blur-md border border-outline px-4 py-2.5 rounded-2xl shadow-card flex items-center gap-2.5 animate-bounce duration-1000">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-content-primary">Mentor Siap Membimbing</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

