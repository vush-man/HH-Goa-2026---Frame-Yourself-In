import React from 'react';
import { FrameFormat } from '../types';
import { User, IdCard, Sparkles } from 'lucide-react';

interface FormatPickerProps {
  format: FrameFormat;
  onChange: (format: FrameFormat) => void;
}

export const FormatPicker: React.FC<FormatPickerProps> = ({ format, onChange }) => {
  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="text-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007A]/20 border border-[#FF007A] text-[#FFE600] text-xs font-mono-code font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
          Select Output Graphic Style
        </span>
      </div>

      {/* Tactile Goan Dual Toggle */}
      <div className="relative p-1 sm:p-1.5 bg-[#003B1F] rounded-2xl border-2 border-[#8DC63F]/40 shadow-inner flex items-center">
        
        {/* Option 1: PFP Frame */}
        <button
          type="button"
          onClick={() => onChange('pfp')}
          className={`relative flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-3 px-2 sm:px-4 rounded-xl font-bold transition-all duration-200 select-none ${
            format === 'pfp'
              ? 'bg-[#FFE600] text-[#121212] shadow-[0_6px_0_#b3a200] translate-y-[-2px] border-2 border-[#121212]'
              : 'text-[#FAF8F5]/80 hover:text-white hover:bg-[#004D28]'
          }`}
        >
          <User className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${format === 'pfp' ? 'text-[#FF007A]' : 'text-[#8DC63F]'}`} />
          <div className="text-left leading-tight">
            <div className="font-display font-extrabold text-xs sm:text-base tracking-wide">
              PFP Frame
            </div>
            <div className={`text-[9px] sm:text-[10px] font-mono-code ${format === 'pfp' ? 'text-[#121212]/70' : 'text-[#8DC63F]'}`}>
              1:1 Avatar Overlay
            </div>
          </div>
          {format === 'pfp' && (
            <span className="absolute -top-2 -right-1 sm:-right-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FF007A] text-white text-[8px] sm:text-[9px] font-mono-code font-extrabold shadow-sm">
              X/TWITTER
            </span>
          )}
        </button>

        {/* Option 2: Builder Pass */}
        <button
          type="button"
          onClick={() => onChange('pass')}
          className={`relative flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-3 px-2 sm:px-4 rounded-xl font-bold transition-all duration-200 select-none ${
            format === 'pass'
              ? 'bg-[#FFE600] text-[#121212] shadow-[0_6px_0_#b3a200] translate-y-[-2px] border-2 border-[#121212]'
              : 'text-[#FAF8F5]/80 hover:text-white hover:bg-[#004D28]'
          }`}
        >
          <IdCard className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${format === 'pass' ? 'text-[#FF007A]' : 'text-[#8DC63F]'}`} />
          <div className="text-left leading-tight">
            <div className="font-display font-extrabold text-xs sm:text-base tracking-wide">
              Builder Pass
            </div>
            <div className={`text-[9px] sm:text-[10px] font-mono-code ${format === 'pass' ? 'text-[#121212]/70' : 'text-[#8DC63F]'}`}>
              4:5 VIP Event Badge
            </div>
          </div>
          {format === 'pass' && (
            <span className="absolute -top-2 -right-1 sm:-right-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FF007A] text-white text-[8px] sm:text-[9px] font-mono-code font-extrabold shadow-sm">
              FEATURED
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
