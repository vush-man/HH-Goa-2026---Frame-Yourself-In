import React from 'react';
import { Users, Sparkles, ShieldCheck } from 'lucide-react';
import { BuilderProfile } from '../types';

interface PfpFormProps {
  profile: BuilderProfile;
  onChange: (updated: BuilderProfile) => void;
}

export const PfpForm: React.FC<PfpFormProps> = ({ profile, onChange }) => {
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...profile,
      teamName: e.target.value.toUpperCase(),
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Squad Name Card */}
      <div className="bg-[#003B1F] p-5 sm:p-6 rounded-3xl border-2 border-[#8DC63F]/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#8DC63F]/30 pb-3">
          <label className="text-xs font-mono-code font-bold text-[#FAF8F5] tracking-wider uppercase flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FFE600]" />
            Team / Squad Name
          </label>
          <span className="text-[10px] font-mono-code text-[#8DC63F]">Shown on PFP Frame</span>
        </div>

        <input
          type="text"
          value={profile.teamName || ''}
          onChange={handleTeamNameChange}
          placeholder="e.g. CYBER PALM LABS or TEAM ALPHA"
          maxLength={30}
          className="w-full px-4 py-3 bg-[#002413] border-2 border-[#8DC63F]/60 rounded-xl text-white font-mono-code font-bold text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:border-[#FFE600] focus:ring-2 focus:ring-[#FFE600]/30 transition-all shadow-inner uppercase"
        />

        {profile.teamName && profile.teamName.trim() !== '' && (
          <div className="pt-1 flex items-center gap-2 text-xs font-mono-code text-[#8DC63F]">
            <span>Live Badge Preview:</span>
            <span className="px-2.5 py-1 bg-[#FF007A] text-[#FFE600] font-mono-code font-bold text-xs rounded-lg border border-[#FFE600] shadow-[0_2px_6px_rgba(0,0,0,0.4)] uppercase tracking-wide">
              ✦ SQUAD: {profile.teamName.trim()}
            </span>
          </div>
        )}
      </div>

      {/* PFP Frame Overlay Tips Card */}
      <div className="bg-[#003B1F] p-5 sm:p-6 rounded-3xl border-2 border-[#8DC63F]/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#FFE600] font-display font-bold text-lg border-b border-[#8DC63F]/30 pb-3">
          <Sparkles className="w-5 h-5 text-[#FF007A]" />
          PFP Frame Overlay Tips
        </div>

        <ul className="space-y-3 font-sans-ui text-sm text-[#FAF8F5]/90">
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#8DC63F] shrink-0 mt-0.5" />
            <span><strong>Optimized for X (Twitter):</strong> Toggle the "Circle Crop" mask above to ensure your face sits squarely in X's circular profile avatar.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#8DC63F] shrink-0 mt-0.5" />
            <span><strong>Drag & Zoom:</strong> Click and drag anywhere on the photo to adjust framing. Scroll or use the slider to scale.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#8DC63F] shrink-0 mt-0.5" />
            <span><strong>Client-Side Engine:</strong> Instant rendering with zero server delays or quality loss.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
