import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { landingContent } from '../../data/landingContent';

export const LandingTestimonials: React.FC = () => {
  return (
    <section id="testimoni" className="py-20 md:py-28 bg-surface-muted/40 border-y border-outline/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>{landingContent.testimonials.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            {landingContent.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
            {landingContent.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {landingContent.testimonials.items.map((testi) => (
            <div
              key={testi.id}
              className="bg-surface rounded-card p-6 sm:p-7 border border-outline shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Top: Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: testi.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-200" />
                </div>

                {/* Comment */}
                <p className="text-sm sm:text-base text-content-secondary leading-relaxed italic mb-6">
                  &ldquo;{testi.comment}&rdquo;
                </p>
              </div>

              {/* Author & Course Info */}
              <div className="pt-4 border-t border-outline-subtle">
                <div className="flex items-center gap-3">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-100"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-content-primary truncate">
                      {testi.name}
                    </p>
                    <p className="text-xs text-content-muted truncate">
                      {testi.role}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 text-[11px] font-semibold text-brand-600 truncate">
                  Kelas: {testi.course}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note indicator for sample testimonials */}
        <div className="mt-10 text-center">
          <span className="text-xs text-content-muted bg-surface border border-outline px-3.5 py-1.5 rounded-full inline-block">
            {/* TODO: Testimoni ini merupakan kompilasi ulasan perwakilan program beta sebelum integrasi review publik */}
            * Sampel ulasan dari peserta program akselerasi pembelajaran Coursue
          </span>
        </div>

      </div>
    </section>
  );
};

