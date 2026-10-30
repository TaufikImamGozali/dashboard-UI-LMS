import React from 'react';
import { UserPlus, Compass, Laptop, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landingContent } from '../../data/landingContent';

export const LandingHowItWorks: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <UserPlus className="w-6 h-6 text-brand-500" />;
      case 1:
        return <Compass className="w-6 h-6 text-purple-600" />;
      case 2:
        return <Laptop className="w-6 h-6 text-emerald-600" />;
      default:
        return <UserPlus className="w-6 h-6 text-brand-500" />;
    }
  };

  return (
    <section id="cara-kerja" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-600 text-xs font-bold uppercase tracking-wider">
            <span>{landingContent.howItWorks.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            {landingContent.howItWorks.title}
          </h2>
          <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
            {landingContent.howItWorks.subtitle}
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {landingContent.howItWorks.steps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-surface rounded-card p-6 sm:p-8 border border-outline relative flex flex-col justify-between shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Step Number Watermark */}
              <div className="absolute top-4 right-5 text-4xl sm:text-5xl font-black text-content-muted/20 select-none group-hover:text-brand-500/20 transition-colors">
                {item.step}
              </div>

              <div className="space-y-5">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-outline flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-brand-200 transition-all duration-300">
                  {getStepIcon(idx)}
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xl font-bold text-content-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-content-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Step Tip Pill */}
              <div className="pt-6 mt-6 border-t border-outline-subtle flex items-center text-xs font-semibold text-brand-600 bg-brand-50/50 -mx-2 px-3 py-2 rounded-xl">
                <span>💡 {item.tip}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to start */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-purple-glow hover:shadow-card transition-all active:scale-[0.98]"
          >
            <span>Mulai Langkah Pertama Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

