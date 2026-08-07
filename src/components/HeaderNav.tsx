import React from 'react';
import { Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface HeaderNavProps {
  onReset?: () => void;
  hasPhoto?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onReset, hasPhoto }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#005C31]/90 backdrop-blur-md border-b-2 border-[#8DC63F]/30 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#FFE600] text-[#121212] font-hand font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-md border border-[#121212] transform -rotate-1">
            2:47 PM STUDIO
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="font-display font-extrabold text-lg leading-none tracking-wider text-[#FFE600]">
              HACKER HOUSE GOA
            </span>
            <span className="font-mono-code text-[10px] text-[#8DC63F] tracking-widest mt-0.5">
              28 - 31 OCT 2026 • GOA, INDIA
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="http://hhgoa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#004726] hover:bg-[#00381e] text-[#FAF8F5] text-[11px] sm:text-xs font-mono-code font-medium border border-[#8DC63F]/40 transition-colors"
          >
            <span>hhgoa.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FFE600]" />
          </a>

          {hasPhoto && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#FF007A] hover:bg-[#d90068] text-white text-[11px] sm:text-xs font-bold font-mono-code border border-[#FFE600]/40 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>Start Over</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
