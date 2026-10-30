import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { landingContent } from '../../data/landingContent';

export const LandingFAQ: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // First item open by default for discoverability
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
            <span>{landingContent.faq.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            {landingContent.faq.title}
          </h2>
          <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
            {landingContent.faq.subtitle}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {landingContent.faq.items.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className="bg-surface rounded-2xl border border-outline overflow-hidden transition-all duration-200 shadow-2xs hover:border-brand-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl transition-colors hover:bg-surface-muted/50"
                >
                  <span className="text-base sm:text-lg font-bold text-content-primary pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-surface-muted border border-outline flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-brand-50 border-brand-200' : ''
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-colors ${
                        isOpen ? 'text-brand-600' : 'text-content-muted'
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-content-secondary leading-relaxed border-t border-outline-subtle pt-3"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-12 text-center text-sm text-content-muted">
          Punya pertanyaan lain yang belum terjawab?{' '}
          <a
            href="mailto:support@coursue.com"
            className="text-brand-500 font-bold hover:underline"
          >
            Hubungi Tim Dukungan Kami
          </a>
        </div>

      </div>
    </section>
  );
};

