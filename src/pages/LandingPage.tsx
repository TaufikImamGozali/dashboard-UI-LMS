import React, { useEffect } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingStats } from '../components/landing/LandingStats';
import { LandingFeatures } from '../components/landing/LandingFeatures';
import { LandingCourses } from '../components/landing/LandingCourses';
import { LandingHowItWorks } from '../components/landing/LandingHowItWorks';
import { LandingTestimonials } from '../components/landing/LandingTestimonials';
import { LandingFAQ } from '../components/landing/LandingFAQ';
import { LandingCTA } from '../components/landing/LandingCTA';
import { LandingFooter } from '../components/landing/LandingFooter';
import { landingContent } from '../data/landingContent';

export const LandingPage: React.FC = () => {
  // Dynamic SEO metadata injection
  useEffect(() => {
    const originalTitle = document.title;
    document.title = landingContent.meta.title;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', landingContent.meta.description);

    // Open Graph Tags
    const ogTags: Record<string, string> = {
      'og:title': landingContent.meta.ogTitle,
      'og:description': landingContent.meta.ogDescription,
      'og:type': 'website',
      'og:url': window.location.origin,
    };

    const createdElements: HTMLMetaElement[] = [];
    Object.entries(ogTags).forEach(([property, content]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
        createdElements.push(ogMeta);
      }
      ogMeta.setAttribute('content', content);
    });

    return () => {
      document.title = originalTitle;
      createdElements.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-content-primary font-sans antialiased selection:bg-brand-500 selection:text-white">
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#main-landing"
        className="fixed left-4 top-4 z-toast -translate-y-24 rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-card transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        Lewati ke Konten Utama
      </a>

      {/* 1. Header / Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main id="main-landing" tabIndex={-1}>
        {/* 2. Hero Section */}
        <LandingHero />

        {/* 3. Statistics & Social Proof */}
        <LandingStats />

        {/* 4. Fitur Utama */}
        <LandingFeatures />

        {/* 5. Preview Kelas dari Supabase */}
        <LandingCourses />

        {/* 6. Cara Kerja (3 Langkah) */}
        <LandingHowItWorks />

        {/* 7. Testimoni Siswa */}
        <LandingTestimonials />

        {/* 8. FAQ Accordion */}
        <LandingFAQ />

        {/* 9. Final CTA */}
        <LandingCTA />
      </main>

      {/* 10. Footer */}
      <LandingFooter />
    </div>
  );
};

