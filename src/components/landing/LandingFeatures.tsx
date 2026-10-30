import React from 'react';
import {
  BookCheck,
  MessageSquareQuote,
  PlayCircle,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { landingContent, type LandingFeature } from '../../data/landingContent';

export const LandingFeatures: React.FC = () => {
  const renderIcon = (name: LandingFeature['iconName']) => {
    switch (name) {
      case 'BookCheck':
        return <BookCheck className="w-6 h-6 text-brand-500" />;
      case 'MessageSquareQuote':
        return <MessageSquareQuote className="w-6 h-6 text-indigo-500" />;
      case 'PlayCircle':
        return <PlayCircle className="w-6 h-6 text-emerald-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-rose-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-sky-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-brand-500" />;
    }
  };

  const getIconContainerBg = (name: LandingFeature['iconName']) => {
    switch (name) {
      case 'BookCheck':
        return 'bg-brand-50 border-brand-100';
      case 'MessageSquareQuote':
        return 'bg-indigo-50 border-indigo-100';
      case 'PlayCircle':
        return 'bg-emerald-50 border-emerald-100';
      case 'TrendingUp':
        return 'bg-rose-50 border-rose-100';
      case 'ShieldCheck':
        return 'bg-amber-50 border-amber-100';
      case 'Sparkles':
        return 'bg-sky-50 border-sky-100';
      default:
        return 'bg-brand-50 border-brand-100';
    }
  };

  return (
    <section id="fitur" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-600 text-xs font-bold uppercase tracking-wider">
            <span>{landingContent.features.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            {landingContent.features.title}
          </h2>
          <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
            {landingContent.features.subtitle}
          </p>
        </div>

        {/* Feature Cards Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {landingContent.features.items.map((feature) => (
            <div
              key={feature.id}
              className="bg-surface rounded-card p-6 sm:p-7 border border-outline hover:border-brand-300 shadow-xs hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-2xs ${getIconContainerBg(
                      feature.iconName
                    )}`}
                  >
                    {renderIcon(feature.iconName)}
                  </div>
                  <span className="text-[11px] font-bold text-content-muted bg-surface-muted px-2.5 py-1 rounded-full border border-outline-subtle">
                    {feature.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-content-primary group-hover:text-brand-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-content-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-subtle flex items-center text-xs font-bold text-brand-500 group-hover:text-brand-600 transition-colors">
                <span>Pelajari lebih lanjut</span>
                <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

