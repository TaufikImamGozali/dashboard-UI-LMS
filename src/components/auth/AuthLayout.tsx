import React from 'react';
import { Users, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const CURRENT_YEAR = new Date().getFullYear();

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-3 sm:p-5 lg:p-8 font-sans">
      {/* Outer Rounded Container matching Dashboard */}
      <div className="w-full max-w-auth bg-brand-card rounded-shell sm:rounded-shell-lg shadow-container border border-outline overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-auth">
        
        {/* Left Column: Form */}
        <main id="main-content" tabIndex={-1} className="lg:col-span-6 p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-surface">
          {/* Logo Header */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-purple-glow text-white group-hover:scale-105 transition-transform">
                {/* 4-point star sparkle icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white stroke-none">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slateText-primary font-sans">
                Coursue
              </span>
            </Link>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
            {children}
          </div>

          {/* Footer note */}
          <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slateText-muted">
            &copy; {CURRENT_YEAR} Coursue Inc. All rights reserved.
          </div>
        </main>

        {/* Right Column: Visual Gradient Panel (Hidden on screens < 1024px) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 p-10 xl:p-12 relative overflow-hidden flex-col justify-between text-white select-none">
          {/* Decorative Sparkle Stars matching Hero Banner */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <svg viewBox="0 0 160 160" className="w-48 h-48 fill-white animate-pulse duration-1000">
              <path d="M80 0 C80 50, 110 80, 160 80 C110 80, 80 110, 80 160 C80 110, 50 80, 0 80 C50 80, 80 50, 80 0 Z" />
            </svg>
          </div>

          <div className="absolute left-8 top-12 pointer-events-none opacity-30">
            <svg viewBox="0 0 60 60" className="w-7 h-7 fill-white">
              <path d="M30 0 C30 18, 42 30, 60 30 C42 30, 30 42, 30 60 C30 42, 18 30, 0 30 C18 30, 30 18, 30 0 Z" />
            </svg>
          </div>

          <div className="absolute right-20 bottom-12 pointer-events-none opacity-30">
            <svg viewBox="0 0 40 40" className="w-5 h-5 fill-white">
              <path d="M20 0 C20 12, 28 20, 40 20 C28 20, 20 28, 20 40 C20 28, 12 20, 0 20 C12 20, 20 12, 20 0 Z" />
            </svg>
          </div>

          {/* Soft Blur Glow Aura */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-brand-dark/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top pill badge */}
          <div className="relative z-content">
            <span className="inline-block px-3.5 py-1 text-meta font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md text-white rounded-full">
              Online Learning Platform
            </span>
          </div>

          {/* Center: Floating Info Cards */}
          <div className="relative z-content space-y-3.5 my-8">
            {/* Card 1: Students */}
            <div className="bg-white/15 backdrop-blur-md border border-surface/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-card hover:bg-white/20 transition-all transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-tight">
                  1.2k+ Active Students
                </p>
                <p className="text-xs text-white/80 mt-0.5">
                  Learning together in peer study groups
                </p>
              </div>
            </div>

            {/* Card 2: Mentors */}
            <div className="bg-white/15 backdrop-blur-md border border-surface/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-card hover:bg-white/20 transition-all transform hover:-translate-y-0.5 translate-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-tight">
                  50+ Verified Mentors
                </p>
                <p className="text-xs text-white/80 mt-0.5">
                  Top engineers, product designers & leads
                </p>
              </div>
            </div>

            {/* Card 3: Courses */}
            <div className="bg-white/15 backdrop-blur-md border border-surface/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-card hover:bg-white/20 transition-all transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-tight">
                  200+ Curated Courses
                </p>
                <p className="text-xs text-white/80 mt-0.5">
                  UI/UX, Frontend, Branding, and Architecture
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Headline & Subtitle */}
          <div className="relative z-content space-y-2">
            <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xs">
              Learn Anything, Anytime.
            </h2>
            <p className="text-xs xl:text-sm text-white/85 leading-relaxed max-w-sm">
              Upgrade your skills with high-quality courses taught by industry leading mentors and track your progress in real-time.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
