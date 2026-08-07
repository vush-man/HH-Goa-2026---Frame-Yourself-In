import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { FrameFormat, PhotoState, BuilderProfile } from './types';
import { generatePassId, generateBuilderTitle } from './utils/builderTitles';
import { renderGraphicToCanvas } from './utils/canvasRenderer';
import { HeaderNav } from './components/HeaderNav';
import { FormatPicker } from './components/FormatPicker';
import { PhotoUploader } from './components/PhotoUploader';
import { CanvasEditor } from './components/CanvasEditor';
import { BuilderForm } from './components/BuilderForm';
import { PfpForm } from './components/PfpForm';
import { ResultModal } from './components/ResultModal';
import { BackgroundDecorations } from './components/BackgroundDecorations';
import { Sparkles, ArrowRight, Image as ImageIcon, Wand2, ShieldCheck, Heart } from 'lucide-react';
import { loadImage } from './utils/heicConverter';

export default function App() {
  // Application State
  const [format, setFormat] = useState<FrameFormat>('pfp');

  const [photo, setPhoto] = useState<PhotoState>({
    file: null,
    dataUrl: null,
    imageObj: null,
    scale: 1.0,
    panX: 0,
    panY: 0,
    rotation: 0,
  });

  const [profile, setProfile] = useState<BuilderProfile>({
    name: 'ALEX RIVERS',
    teamName: 'CYBER PALM LABS',
    stack: 'REACT • GEMINI AI • RUST',
    title: 'NEURAL ALCHEMIST',
    theme: 'goa-green',
    passId: generatePassId(),
  });

  const [finalDataUrl, setFinalDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle Photo Selection
  const handlePhotoSelected = async (file: File, dataUrl: string) => {
    try {
      const imgObj = await loadImage(dataUrl);
      setPhoto({
        file,
        dataUrl,
        imageObj: imgObj,
        scale: 1.0,
        panX: 0,
        panY: 0,
        rotation: 0,
      });
    } catch (err) {
      console.error('Failed to load image object:', err);
    }
  };

  const handlePhotoChange = (updated: Partial<PhotoState>) => {
    setPhoto((prev) => ({ ...prev, ...updated }));
  };

  const handleProfileChange = (updated: Partial<BuilderProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setPhoto({
      file: null,
      dataUrl: null,
      imageObj: null,
      scale: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
    });
    setFinalDataUrl(null);
  };

  // Generate Final High-Res Graphic
  const handleGenerateGraphic = async () => {
    setIsGenerating(true);

    try {
      // Offscreen canvas at full 1080p high-DPI resolution
      const width = 1080;
      const height = format === 'pfp' ? 1080 : 1350;

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;

      const ctx = offscreenCanvas.getContext('2d');
      if (ctx) {
        await renderGraphicToCanvas(
          ctx,
          { format, photo, profile, showCirclePreview: false },
          width,
          height
        );

        const exportedUrl = offscreenCanvas.toDataURL('image/png', 0.95);
        setFinalDataUrl(exportedUrl);
      }
    } catch (e) {
      console.error('Error rendering export graphic:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#005C31] text-white font-sans-ui flex flex-col selection:bg-[#FF007A] selection:text-white pb-2 relative overflow-x-hidden">
      
      {/* Background Graphic Decor & Atmospheric Cyber Tropical Ambient */}
      <BackgroundDecorations />

      {/* Top Header Navigation */}
      <HeaderNav onReset={handleReset} hasPhoto={!!photo.dataUrl} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-6 sm:pt-10 relative z-10">
        
        {/* HERO SECTION */}
        <section className="text-center mb-8 relative">
          
          {/* Decorative Goan Palm Accents */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#003B1F] border border-[#8DC63F]/50 text-[#8DC63F] font-mono-code text-xs font-bold mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-ping" />
            OFFICIAL SHORTLISTING TASK TOOL
          </div>

          {/* Main Title Banner with Floating Devanagari "गोवा" Motif */}
          <div className="relative inline-block my-2">
            <h1 className="font-display font-black text-4xl sm:text-7xl lg:text-8xl tracking-tight text-[#FFE600] leading-none drop-shadow-md">
              HACKER HOUSE
            </h1>
            
            {/* Floating Devanagari "गोवा" Text (Red text with Yellow stroke, hover motion, no drop shadow) */}
            <motion.div 
              className="absolute top-1/2 left-1/2 z-10 pointer-events-none select-none"
              animate={{
                y: ['-50%', '-56%', '-44%', '-52%', '-50%'],
                x: ['-50%', '-47%', '-53%', '-48%', '-50%'],
                rotate: [-6, -9, -3, -8, -6],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span 
                className="font-devanagari font-black text-4xl sm:text-7xl lg:text-8xl text-[#FF007A] leading-none tracking-wide inline-block"
                style={{
                  WebkitTextStroke: '2.5px #FFE600',
                  paintOrder: 'stroke fill',
                }}
              >
                गोवा
              </span>
            </motion.div>

            <div className="font-display font-black text-3xl sm:text-6xl text-[#FFE600] tracking-widest mt-1">
              GOA 2026
            </div>
          </div>

          <p className="font-sans-ui text-base sm:text-xl text-[#FAF8F5]/90 max-w-xl mx-auto mt-4 font-medium">
            Frame yourself in for Hacker House Goa 2026.
            <br />
            Generate your custom profile picture frame or VIP builder pass in seconds.
          </p>

          {/* Format Picker Toggle Switch */}
          <div className="mt-8">
            <FormatPicker format={format} onChange={setFormat} />
          </div>

        </section>

        {/* WORKSPACE SECTION */}
        {!photo.dataUrl ? (
          /* State 1: Upload Photo */
          <PhotoUploader onPhotoSelected={handlePhotoSelected} />
        ) : (
          /* State 2: Edit & Live Preview Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-6">
            
            {/* Left Column: Live Canvas Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full">
                <CanvasEditor
                  format={format}
                  photo={photo}
                  profile={profile}
                  onPhotoChange={handlePhotoChange}
                  onExportRequest={handleGenerateGraphic}
                />
              </div>

              {/* Action Button: Generate Graphic */}
              <button
                type="button"
                onClick={handleGenerateGraphic}
                disabled={isGenerating}
                className="w-full max-w-md mt-6 py-4 px-8 bg-[#FFE600] hover:bg-[#ffd900] text-[#121212] font-mono-code font-black text-lg sm:text-xl rounded-2xl shadow-[0_8px_0_#b3a200] border-2 border-[#121212] flex items-center justify-center gap-3 transition-all transform active:translate-y-1 active:shadow-none cursor-pointer"
              >
                <Wand2 className="w-6 h-6 text-[#FF007A]" />
                {isGenerating ? 'GENERATING GRAPHIC...' : 'GENERATE GRAPHIC →'}
              </button>
            </div>

            {/* Right Column: Customization Controls / Format Info */}
            <div className="lg:col-span-6 w-full space-y-6">
              
              {format === 'pass' ? (
                /* Builder Pass Inline Fields */
                <BuilderForm profile={profile} onChange={handleProfileChange} />
              ) : (
                /* PFP Frame Squad Name & Info */
                <PfpForm profile={profile} onChange={handleProfileChange} />
              )}

              {/* Upload Another Photo Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handlePhotoChange({ file: null, dataUrl: null, imageObj: null })}
                  className="w-full max-w-md py-4 px-6 bg-[#FF007A] hover:bg-[#e0006b] text-white font-mono-code text-base sm:text-lg font-black tracking-wider rounded-2xl border-2 border-black shadow-[0_4px_0_#000] hover:shadow-[0_6px_0_#000] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
                >
                  <ImageIcon className="w-5 h-5 text-white" />
                  CHANGE SELECTED PHOTO
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* RESULT REVEAL MODAL */}
      {finalDataUrl && (
        <ResultModal
          dataUrl={finalDataUrl}
          format={format}
          onClose={() => setFinalDataUrl(null)}
        />
      )}

      {/* FOOTER */}
      <footer className="mt-8 sm:mt-10 text-center text-[11px] sm:text-xs font-mono-code text-[#8DC63F]/90 border-t border-[#8DC63F]/20 pt-4 pb-3 px-4 relative z-10">
        <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 max-w-sm sm:max-w-none mx-auto leading-relaxed">
          <span>Crafted for <strong className="text-[#FFE600] font-bold">HH Goa 2026</strong> Shortlisting Task</span>
          <span className="hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#FF007A] fill-current shrink-0" />
            <a href="http://hhgoa.com/" target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">hhgoa.com</a>
          </span>
        </p>
      </footer>

    </div>
  );
}
