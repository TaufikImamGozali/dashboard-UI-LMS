import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { landingContent } from '../../data/landingContent';

export const LandingCTA: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Banner Container with Purple Gradient matching AuthLayout */}
        <div className="relative rounded-shell sm:rounded-shell-lg bg-gradient-to-br from-brand-600 via-brand-500 to-purple-600 p-8 sm:p-12 md:p-16 text-white overflow-hidden shadow-container">
          
          {/* Decorative Sparkle SVGs matching AuthLayout & Hero */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-25">
            <svg viewBox="0 0 160 160" className="w-64 h-64 fill-white animate-pulse">
              <path d="M80 0 C80 50, 110 80, 160 80 C110 80, 80 110, 80 160 C80 110, 50 80, 0 80 C50 80, 80 50, 80 0 Z" />
            </svg>
          </div>

          <div className="absolute left-8 top-8 pointer-events-none opacity-20">
            <svg viewBox="0 0 60 60" className="w-8 h-8 fill-white">
              <path d="M30 0 C30 18, 42 30, 60 30 C42 30, 30 42, 30 60 C30 42, 18 30, 0 30 C18 30, 30 18, 30 0 Z" />
            </svg>
          </div>

          {/* Glow Auras */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-dark/30 rounded-full blur-2xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-content max-w-3xl mx-auto text-center space-y-6">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{landingContent.cta.badge}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {landingContent.cta.title}
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
              {landingContent.cta.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-brand-600 font-extrabold text-base shadow-card hover:bg-slate-50 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                >
                  <span>Buka Dashboard Saya</span>
                  <ArrowRight className="w-5 h-5 text-brand-600" />
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-brand-600 font-extrabold text-base shadow-card hover:bg-slate-50 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                  >
                    <span>{landingContent.cta.buttonText}</span>
                    <ArrowRight className="w-5 h-5 text-brand-600" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-base border border-white/20 transition-all"
                  >
                    <span>{landingContent.cta.secondaryButton}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust note */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-white/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{landingContent.cta.guarantee}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

