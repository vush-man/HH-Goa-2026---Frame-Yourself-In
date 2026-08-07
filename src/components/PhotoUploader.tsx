import React, { useRef, useState } from 'react';
import { Upload, Camera, Loader2, Sparkles } from 'lucide-react';
import { convertHeicIfNeeded } from '../utils/heicConverter';

interface PhotoUploaderProps {
  onPhotoSelected: (file: File, dataUrl: string) => void;
}

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

    </div>
  );
};
