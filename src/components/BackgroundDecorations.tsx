import React from 'react';
import { Palmtree, Waves, Compass, Terminal, Sparkles, MapPin, Radio } from 'lucide-react';

export const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none aria-hidden">
      
      {/* 1. Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8dc63f10_1px,transparent_1px),linear-gradient(to_bottom,#8dc63f10_1px,transparent_1px)] bg-[size:44px_44px]"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
        }}
      />

      {/* 2. Neon Ambient Color Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FFE600]/15 blur-[120px]" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[#FF007A]/20 blur-[150px]" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full bg-[#8DC63F]/10 blur-[180px]" />

      {/* 3. Tropical Palm Vectors (Left & Right Flanks) */}
      {/* Left Palm Frond SVG */}
      <div className="absolute top-2 sm:top-12 -left-10 sm:-left-12 text-[#002413]/80 block opacity-25 sm:opacity-40 hover:opacity-60 transition-opacity scale-75 sm:scale-100 origin-top-left">
        <svg width="280" height="360" viewBox="0 0 280 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 350C40 280 120 200 260 180" stroke="#8DC63F" strokeWidth="3" strokeDasharray="6 6" />
          <path d="M260 180C210 150 150 140 100 160" stroke="#8DC63F" strokeWidth="2" />
          <path d="M260 180C220 200 180 230 140 270" stroke="#8DC63F" strokeWidth="2" />
          <path d="M260 180C210 120 130 100 80 110" stroke="#FFE600" strokeWidth="2" />
          <path d="M260 180C230 100 170 60 110 50" stroke="#8DC63F" strokeWidth="2" />
          {/* Leaves */}
          <path d="M120 200 Q 150 160 180 185 Q 150 210 120 200 Z" fill="#003B1F" stroke="#8DC63F" strokeWidth="1.5" />
          <path d="M160 160 Q 190 120 220 150 Q 180 180 160 160 Z" fill="#003B1F" stroke="#FFE600" strokeWidth="1.5" />
          <path d="M90 140 Q 130 110 160 135 Q 120 165 90 140 Z" fill="#003B1F" stroke="#8DC63F" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Right Palm Frond SVG */}
      <div className="absolute top-16 sm:top-36 -right-10 sm:-right-10 text-[#002413]/80 block opacity-25 sm:opacity-40 hover:opacity-60 transition-opacity transform scale-x-[-1] scale-75 sm:scale-100 origin-top-right">
        <svg width="260" height="380" viewBox="0 0 280 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 350C40 280 120 200 260 180" stroke="#FF007A" strokeWidth="3" strokeDasharray="6 6" />
          <path d="M260 180C210 150 150 140 100 160" stroke="#FFE600" strokeWidth="2" />
          <path d="M260 180C220 200 180 230 140 270" stroke="#FF007A" strokeWidth="2" />
          <path d="M120 200 Q 150 160 180 185 Q 150 210 120 200 Z" fill="#003B1F" stroke="#FF007A" strokeWidth="1.5" />
          <path d="M160 160 Q 190 120 220 150 Q 180 180 160 160 Z" fill="#003B1F" stroke="#FFE600" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 6. Bottom Cyber Waves Graphic Lines */}
      <div className="absolute bottom-0 inset-x-0 h-24 opacity-30 text-[#8DC63F]">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
          <path d="M0 40 Q 300 100 600 40 T 1200 40 L 1200 120 L 0 120 Z" fill="#002413" />
          <path d="M0 60 Q 300 20 600 60 T 1200 60" stroke="#8DC63F" strokeWidth="2" strokeDasharray="8 8" />
          <path d="M0 80 Q 300 110 600 80 T 1200 80" stroke="#FF007A" strokeWidth="1.5" />
        </svg>
      </div>

    </div>
  );
};
