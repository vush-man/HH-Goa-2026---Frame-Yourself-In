import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Camera, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { convertHeicIfNeeded } from '../utils/heicConverter';

interface PhotoUploaderProps {
  onPhotoSelected: (file: File, dataUrl: string) => void;
}

// Sample avatars for quick instant testing
const SAMPLE_AVATARS = [
  {
    name: 'Dev Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Hacker Studio',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Tech Founder',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
  }
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotoSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { file: processedFile, dataUrl } = await convertHeicIfNeeded(file);
      onPhotoSelected(processedFile, dataUrl);
    } catch (err: any) {
      console.error('File load error:', err);
      setErrorMessage('Failed to read image file. Please try another image file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSampleSelect = async (sampleUrl: string, sampleName: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const resp = await fetch(sampleUrl);
      const blob = await resp.blob();
      const file = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, '-')}.jpg`, { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onload = () => {
        onPhotoSelected(file, reader.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setErrorMessage('Could not load sample image');
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Branded Goan Empty State Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden cursor-pointer rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 border-4 ${
          isDragging
            ? 'bg-[#004726] border-[#FF007A] scale-[1.02] shadow-[0_0_30px_rgba(255,0,122,0.4)]'
            : 'bg-[#004726]/80 hover:bg-[#003d21] border-[#FFE600] shadow-2xl'
        }`}
      >
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#FF007A] rounded-tl-2xl m-2" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#FF007A] rounded-tr-2xl m-2" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#FF007A] rounded-bl-2xl m-2" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#FF007A] rounded-br-2xl m-2" />

        {/* Goan Tropical Center Visual */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          
          {isProcessing ? (
            <div className="py-8 flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-[#FFE600] animate-spin mb-4" />
              <p className="font-mono-code font-bold text-lg text-[#FFE600]">
                Processing Photo & Convert HEIC...
              </p>
            </div>
          ) : (
            <>
              {/* Central Camera Icon Badge */}
              <div className="relative mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FF007A] text-[#FFE600] flex items-center justify-center border-4 border-[#FFE600] shadow-[0_8px_0_#990049] transform hover:rotate-3 transition-transform">
                  <Camera className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#8DC63F] text-[#121212] p-2 rounded-full border-2 border-[#121212] shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#121212]" />
                </div>
              </div>

              {/* Title & Call to Action */}
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#FFE600] mb-2 tracking-wide">
                DROP YOUR PHOTO HERE
              </h3>
              <p className="font-sans-ui text-sm sm:text-base text-[#FAF8F5]/90 mb-6 max-w-sm mx-auto">
                Tap to upload or drag & drop. Supports <strong className="text-[#8DC63F]">all image formats</strong> (JPG, PNG, WEBP, HEIC, GIF, AVIF & more).
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FFE600] text-[#121212] font-mono-code font-extrabold text-sm shadow-[0_6px_0_#b3a200] border-2 border-[#121212] active:translate-y-1 active:shadow-none transition-all"
              >
                <Upload className="w-4 h-4 text-[#FF007A]" />
                SELECT FROM DEVICE
              </button>
            </>
          )}

        </div>
      </div>

      {errorMessage && (
        <p className="mt-3 text-center text-red-400 font-mono-code text-xs bg-red-950/60 p-2 rounded-lg border border-red-500">
          {errorMessage}
        </p>
      )}

      {/* Quick Sample Photos for Testing */}
      <div className="mt-6 text-center">
        <p className="text-xs font-mono-code text-[#8DC63F] mb-3 uppercase tracking-wider">
          Or try with a sample avatar:
        </p>
        <div className="flex items-center justify-center gap-3">
          {SAMPLE_AVATARS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleSelect(sample.url, sample.name)}
              className="group flex items-center gap-2 px-3 py-2 bg-[#003B1F] hover:bg-[#004D28] border border-[#8DC63F]/40 rounded-xl transition-all"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-8 h-8 rounded-full object-cover border border-[#FFE600]"
              />
              <span className="text-xs font-sans-ui text-[#FAF8F5] group-hover:text-[#FFE600]">
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
