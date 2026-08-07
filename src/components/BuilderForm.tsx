import React, { useState } from 'react';
import { BuilderProfile, BUILDER_STACK_SUGGESTIONS } from '../types';
import { generateBuilderTitle } from '../utils/builderTitles';
import { Sparkles, Dices, Layers, User, Users, Tag, Palette, Plus } from 'lucide-react';

interface BuilderFormProps {
  profile: BuilderProfile;
  onChange: (updated: Partial<BuilderProfile>) => void;
}

export const BuilderForm: React.FC<BuilderFormProps> = ({ profile, onChange }) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const [userCustomTags, setUserCustomTags] = useState<string[]>([]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: e.target.value });
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ teamName: e.target.value });
  };

  const handleStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStack = e.target.value;
    const derivedTitle = generateBuilderTitle(newStack);
    onChange({
      stack: newStack,
      title: derivedTitle,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ title: e.target.value });
  };

  const handleTagClick = (tag: string) => {
    const currentStack = profile.stack.trim();
    const tagLower = tag.toLowerCase();

    // Check if stack contains bullet-separated or comma-separated tokens
    let tokens = currentStack
      ? currentStack.split(/[\u2022,\/]/).map(t => t.trim()).filter(Boolean)
      : [];

    // Check if already present
    const existsIndex = tokens.findIndex(t => t.toLowerCase() === tagLower);

    let newTokens: string[];
    if (existsIndex >= 0) {
      // Deselect (remove) tag
      newTokens = tokens.filter((_, idx) => idx !== existsIndex);
    } else if (currentStack && tokens.length === 0 && currentStack.toLowerCase().includes(tagLower)) {
      // Fallback if user typed text without bullets
      const regex = new RegExp(`\\b${tag}\\b`, 'gi');
      const cleaned = currentStack.replace(regex, '').replace(/\s+/g, ' ').trim();
      newTokens = cleaned ? [cleaned] : [];
    } else {
      // Select (add) tag
      newTokens = [...tokens, tag];
    }

    const newStack = newTokens.join(' • ');
    const derivedTitle = generateBuilderTitle(newStack);
    onChange({
      stack: newStack,
      title: derivedTitle,
    });
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;

    // Add to custom tags if not present
    if (!userCustomTags.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      setUserCustomTags(prev => [...prev, trimmed]);
    }

    // Toggle/select tag into primary stack text box
    handleTagClick(trimmed);
    setCustomTagInput('');
  };

  const handleRerollTitle = () => {
    const currentStack = profile.stack || '';
    const newTitle = generateBuilderTitle(currentStack, profile.title);
    onChange({ title: newTitle });
  };

  const allTags = [...userCustomTags, ...BUILDER_STACK_SUGGESTIONS];

  return (
    <div className="w-full max-w-lg mx-auto bg-[#003B1F] p-5 sm:p-6 rounded-3xl border-2 border-[#8DC63F] shadow-[0_8px_0_#001e0e] space-y-5.5 relative overflow-hidden">
      {/* Decorative top accent glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF007A]/20 blur-2xl rounded-full pointer-events-none" />
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#8DC63F]/40 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="bg-[#FF007A] text-white p-1.5 rounded-xl border border-black shadow-[0_2px_0_#121212]">
            <Sparkles className="w-4 h-4 text-[#FFE600]" />
          </span>
          <div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-[#FFE600] tracking-wide leading-none">
              Builder Pass Customization
            </h3>
            <span className="text-[10px] font-mono-code text-[#8DC63F]/90 uppercase font-semibold">
              Live Canvas Sync
            </span>
          </div>
        </div>

        <span className="bg-[#002413] px-3 py-1 rounded-xl font-mono-code text-xs text-[#8DC63F] font-extrabold border border-[#8DC63F]/50 shadow-inner">
          ID: {profile.passId}
        </span>
      </div>

      {/* 1. Builder Name Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-mono-code font-bold text-[#FAF8F5] tracking-wider uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#FF007A]" />
            Your Name / Handle
          </span>
          <span className="text-[10px] font-normal text-[#8DC63F]">Max 30 chars</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={profile.name}
            onChange={handleNameChange}
            placeholder="e.g. Alex Rivers or @alexrivers"
            maxLength={30}
            className="w-full px-4 py-3 bg-[#002413] border-2 border-[#8DC63F]/60 rounded-xl text-white font-sans-ui font-bold text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:border-[#FFE600] focus:ring-2 focus:ring-[#FFE600]/30 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 2. Team Name Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-mono-code font-bold text-[#FAF8F5] tracking-wider uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#FFE600]" />
            Team / Squad Name
          </span>
          <span className="text-[10px] font-normal text-[#8DC63F]">Shown on Builder Pass</span>
        </label>
        
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

      {/* 2. Stack & Role Input */}
      <div className="space-y-2">
        <label className="block text-xs font-mono-code font-bold text-[#FAF8F5] tracking-wider uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FFE600]" />
            Primary Stack / Role
          </span>
          <span className="text-[10px] font-normal text-[#8DC63F]">Edit directly or tap tags</span>
        </label>
        
        <input
          type="text"
          value={profile.stack}
          onChange={handleStackChange}
          placeholder="e.g. LLM, Agentic AI, Crypto, Rust, React"
          maxLength={55}
          className="w-full px-4 py-3 bg-[#002413] border-2 border-[#8DC63F]/60 rounded-xl text-white font-sans-ui font-bold text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:border-[#FFE600] focus:ring-2 focus:ring-[#FFE600]/30 transition-all shadow-inner"
        />
      </div>

      {/* 3. Stack Tags Selection & Custom Addition */}
      <div className="space-y-2">
        <label className="block text-xs font-mono-code font-bold text-[#FAF8F5] tracking-wider uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#FFE600]" />
            Stack Tags
          </span>
          <span className="text-[10px] font-normal text-[#8DC63F]">Click to toggle • Type custom tag</span>
        </label>

        <div className="bg-[#002413] p-3.5 sm:p-4 rounded-2xl border-2 border-[#8DC63F] shadow-[0_4px_0_#00140a] space-y-3">
          {/* Type Custom Tag Input Form */}
          <form onSubmit={handleAddCustomTag} className="flex gap-2">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              placeholder="Type tag & press Enter (e.g. PyTorch)..."
              maxLength={25}
              className="flex-1 px-4 py-2.5 bg-[#003B1F] border-2 border-[#8DC63F]/60 focus:border-[#FFE600] rounded-xl text-white font-mono-code text-xs sm:text-sm font-bold focus:outline-none placeholder:text-white/40 shadow-inner"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#FF007A] hover:bg-[#e0006b] text-[#f9f908] font-mono-code text-xs font-black rounded-xl border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add
            </button>
          </form>

          {/* Tag Chips List */}
          <div className="flex flex-wrap gap-1.5 pt-1 max-h-48 overflow-y-auto no-scrollbar">
            {allTags.map((tag, idx) => {
              const isSelected = profile.stack.toLowerCase().includes(tag.toLowerCase());
              return (
                <button
                  key={`${tag}-${idx}`}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-1 text-xs font-mono-code rounded-xl border-2 transition-all transform active:scale-95 flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF007A] text-[#f9f908] border-2 border-black font-black shadow-[0_3px_0_#121212] scale-[1.03]'
                      : 'bg-[#003B1F] hover:bg-[#004726] text-[#FAF8F5] font-bold border-[#8DC63F]/40 hover:border-[#FFE600] hover:text-[#FFE600]'
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Custom Builder Title */}
      <div className="space-y-2">
        <label className="block text-xs font-mono-code font-bold text-[#FAF8F5] tracking-wider uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#FFE600]" />
            Builder Badge Title
          </span>
          <span className="text-[10px] font-normal text-[#8DC63F]">Custom or Auto-Suggest</span>
        </label>

        <div className="bg-[#002413] p-3.5 sm:p-4 rounded-2xl border-2 border-[#8DC63F] shadow-[0_4px_0_#00140a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code font-bold text-[#FFE600] uppercase tracking-wider">
              ★ Active Title
            </span>
            <button
              type="button"
              onClick={handleRerollTitle}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] hover:bg-[#ffd900] text-[#121212] font-mono-code font-black text-xs rounded-xl border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5 text-[#FF007A]" />
              Re-roll Title
            </button>
          </div>

          <input
            type="text"
            value={profile.title}
            onChange={handleTitleChange}
            placeholder="★ GOA UNSTOPPABLE BUILDER ★"
            maxLength={40}
            className="w-full bg-[#FF007A] text-[#FFE600] font-mono-code font-black text-sm sm:text-base px-3.5 py-2.5 rounded-xl text-center shadow-md tracking-wider border-2 border-black uppercase focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all placeholder:text-[#FFE600]/60"
          />
        </div>
      </div>

      {/* 4. Badge Theme Accent Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-mono-code font-bold text-[#FAF8F5] tracking-wider uppercase flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#FFE600]" />
          Badge Theme Accent
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'goa-green', label: 'Goa Green', bg: 'bg-[#FAF8F5]', text: 'text-[#005C31]' },
            { id: 'sunset-yellow', label: 'Sunset Gold', bg: 'bg-[#FFE600]', text: 'text-[#121212]' },
            { id: 'magenta-pink', label: 'Hot Pink', bg: 'bg-[#FF007A]', text: 'text-white' },
            { id: 'midnight-dark', label: 'Midnight', bg: 'bg-[#1E2621]', text: 'text-[#8DC63F]' },
          ].map((themeItem) => {
            const isSelected = profile.theme === themeItem.id;
            return (
              <button
                key={themeItem.id}
                type="button"
                onClick={() => onChange({ theme: themeItem.id as BuilderProfile['theme'] })}
                className={`p-2.5 rounded-2xl text-xs font-mono-code font-bold transition-all border-2 flex items-center justify-center gap-1.5 ${themeItem.bg} ${themeItem.text} ${
                  isSelected
                    ? 'border-black ring-2 ring-[#FFE600] scale-[1.04] shadow-[0_4px_0_#121212] font-black'
                    : 'border-[#121212]/30 opacity-75 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                {isSelected && <span>✓</span>}
                {themeItem.label}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
