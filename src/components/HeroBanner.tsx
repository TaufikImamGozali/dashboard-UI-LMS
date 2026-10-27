import React from 'react';
import { ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onJoinClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onJoinClick }) => {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 p-7 md:p-9 text-white shadow-card">
      {/* Background Decorative Sparkles / Stars matching screenshot */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        {/* Large 4-point sparkle star */}
        <svg
          viewBox="0 0 160 160"
          className="w-36 h-36 lg:w-48 lg:h-48 text-white/30 fill-current animate-pulse duration-1000"
        >
          <path d="M80 0 C80 50, 110 80, 160 80 C110 80, 80 110, 80 160 C80 110, 50 80, 0 80 C50 80, 80 50, 80 0 Z" />
        </svg>
      </div>

      {/* Floating smaller stars */}
      <div className="absolute right-44 top-7 pointer-events-none opacity-40">
        <svg viewBox="0 0 60 60" className="w-8 h-8 fill-white">
          <path d="M30 0 C30 18, 42 30, 60 30 C42 30, 30 42, 30 60 C30 42, 18 30, 0 30 C18 30, 30 18, 30 0 Z" />
        </svg>
      </div>

      <div className="absolute right-24 bottom-6 pointer-events-none opacity-30">
        <svg viewBox="0 0 40 40" className="w-5 h-5 fill-white">
          <path d="M20 0 C20 12, 28 20, 40 20 C28 20, 20 28, 20 40 C20 28, 12 20, 0 20 C12 20, 20 12, 20 0 Z" />
        </svg>
      </div>

      {/* Floating soft background aura */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-content max-w-xl space-y-4">
        {/* Category capsule */}
        <div>
          <span className="inline-block px-3.5 py-1 text-meta font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md text-white rounded-full">
            Online Course
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight text-white leading-[1.25] drop-shadow-xs">
          Sharpen Your Skills with <br className="hidden sm:inline" />
          Professional Online Courses
        </h1>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onJoinClick || (() => alert('Joining course!'))}
            className="group inline-flex items-center gap-3.5 pl-6 pr-2.5 py-2.5 bg-brand-dark hover:bg-content-primary text-white font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-lg active:scale-95"
            aria-label="Join Course Now"
          >
            <span>Join Now</span>
            <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-brand-dark transition-transform duration-300 group-hover:translate-x-0.5">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
