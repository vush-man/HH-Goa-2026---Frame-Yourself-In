import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Download, Share2, Copy, Check, ExternalLink, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { FrameFormat } from '../types';

interface ResultModalProps {
  dataUrl: string;
  format: FrameFormat;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ dataUrl, format, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied-image' | 'copied-link' | 'downloaded'>('idle');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Trigger celebration confetti on reveal!
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFE600', '#FF007A', '#8DC63F', '#FFFFFF'],
    });
  }, []);

  // Download graphic as real PNG file
  const handleDownload = () => {
    const filename = format === 'pfp' ? 'hh-goa-2026-pfp-frame.png' : 'hh-goa-2026-builder-pass.png';
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert Base64 Data URL to Blob synchronously (enables instant clipboard write)
  const getPhotoBlob = (): Blob => {
    const parts = dataUrl.split(',');
    const byteString = atob(parts[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  };

  // Copy Share Link to Clipboard
  const handleCopyClipboard = async () => {
    const urlToCopy = shareUrl || window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = urlToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('copied-link');
      setTimeout(() => setCopyStatus('idle'), 3000);
    } catch (err) {
      console.error('Copy link failed:', err);
    }
  };

  // Pre-upload image to server endpoint on mount (optional reference link)
  useEffect(() => {
    let isMounted = true;

    async function preUploadOg() {
      try {
        const uploadResp = await fetch('/api/upload-og', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            format,
          }),
        });

        if (uploadResp.ok && isMounted) {
          const data = await uploadResp.json();
          setShareUrl(data.shareUrl);
        }
      } catch (err) {
        console.error('Background OG upload error:', err);
      }
    }

    preUploadOg();

    return () => {
      isMounted = false;
    };
  }, [dataUrl, format]);

  // Construct clean pre-filled X (Twitter) post template URL without leading space
  const postCaption = `Framed myself in for Hacker House Goa 2026! 🌴🚀\n\n#FrameInGoa`.trim();
  const twitterIntentUrl = `https://x.com/intent/post?text=${encodeURIComponent(postCaption)}`;

  // Share to X handler: Uses native file share on mobile to send image + text directly to X app; opens X web intent on desktop while copying & downloading image
  const handleShareClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = typeof navigator !== 'undefined' && (
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 768)
    );

    const blob = getPhotoBlob();
    const filename = format === 'pfp' ? 'hh-goa-2026-pfp.png' : 'hh-goa-2026-pass.png';
    const file = new File([blob], filename, { type: 'image/png' });

    // On Mobile: Use native share sheet to send image file + caption directly to X app
    if (
      isMobile &&
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      e.preventDefault();
      try {
        await navigator.share({
          text: postCaption,
          files: [file],
        });
        setShareSuccess(true);
      } catch (err) {
        console.log('Mobile native share canceled:', err);
      }
      return;
    }

    // On Desktop: Show copy notification & copy image to clipboard
    setCopyStatus('copied-image');
    setTimeout(() => setCopyStatus('idle'), 8000);

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
      }
    } catch (err) {
      console.log('Desktop clipboard copy on share:', err);
    }

    handleDownload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#121212]/90 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-300">
      
      {/* Modal Container with Goan Gold Framing */}
      <div className="relative max-w-xl w-full bg-[#004726] border-4 border-[#FFE600] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 transform transition-all animate-in zoom-in-95 duration-300 my-auto">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-[#8DC63F]/30 pb-3 sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 bg-[#002B17] hover:bg-[#003B1F] text-[#FAF8F5] hover:text-[#FFE600] font-mono-code font-bold text-[11px] sm:text-xs rounded-xl border border-[#8DC63F]/40 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FFE600]" />
            Back to Edit
          </button>

          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-[#002B17] text-[#fdfdfd] font-mono-code font-bold text-[11px] sm:text-xs tracking-wider uppercase rounded-full border border-[#8DC63F]/60 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
            GRAPHIC READY
          </span>
        </div>

        {/* Satisfying Reveal Animated Graphic Preview */}
        <div className="relative mx-auto max-w-[260px] sm:max-w-sm rounded-2xl overflow-hidden border-2 border-[#FFE600] shadow-[0_12px_30px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] transition-transform duration-300">
          <img
            src={dataUrl}
            alt="HH Goa 2026 Graphic"
            className="w-full h-auto block"
          />
        </div>

        {/* Call to Actions */}
        <div className="space-y-2.5 sm:space-y-3">
          
          {/* Main Action 1: Download Image */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-[#FFE600] hover:bg-[#ffd900] text-[#121212] font-mono-code font-black text-sm sm:text-lg rounded-2xl shadow-[0_5px_0_#b3a200] sm:shadow-[0_6px_0_#b3a200] border-2 border-[#121212] flex items-center justify-center gap-2 sm:gap-2.5 transition-all transform active:translate-y-1 active:shadow-none"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF007A]" />
            DOWNLOAD GRAPHIC (PNG)
          </button>

          {/* Main Action 2: Share to X */}
          <a
            href={twitterIntentUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShareClick}
            className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-[#FF007A] hover:bg-[#d90068] text-white font-mono-code font-bold text-xs sm:text-base rounded-2xl shadow-[0_5px_0_#80003d] sm:shadow-[0_6px_0_#80003d] border-2 border-[#121212] flex items-center justify-center gap-2 sm:gap-2.5 transition-all transform active:translate-y-1 active:shadow-none no-underline"
          >
            {copyStatus === 'copied-image' ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFE600] stroke-[3]" />
                <span>IMAGE COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFE600]" />
                <span>SHARE TO X · #FrameInGoa</span>
              </>
            )}
          </a>

          {/* Desktop Image Copied Alert Banner */}
          {copyStatus === 'copied-image' && (
            <div className="bg-[#FFE600] text-[#121212] px-3.5 py-3 rounded-2xl font-mono-code font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl border-2 border-[#121212] animate-in fade-in zoom-in-95 duration-200">
              <Check className="w-5 h-5 text-[#FF007A] shrink-0 stroke-[3]" />
              <span>Image copied &amp; downloaded! Press <strong>Ctrl+V / Cmd+V</strong> in X to paste.</span>
            </div>
          )}

          {/* Secondary Action: Copy Link */}
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-[#ffffff] hover:bg-[#f1f5f9] text-[#121212] font-mono-code font-bold text-xs sm:text-base rounded-2xl shadow-[0_5px_0_#94a3b8] sm:shadow-[0_6px_0_#94a3b8] border-2 border-[#121212] flex items-center justify-center gap-2 sm:gap-2.5 transition-all transform active:translate-y-1 active:shadow-none"
          >
            {copyStatus === 'copied-link' ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212]" />
                SHARE LINK COPIED TO CLIPBOARD!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212]" />
                COPY CARD SHARE LINK
              </>
            )}
          </button>

          {/* Quick Tip for X Paste */}
          <div className="bg-[#002413] border border-[#8DC63F]/50 p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-sans-ui text-[#FAF8F5]/90 text-left flex items-start gap-2 sm:gap-2.5 shadow-inner leading-relaxed">
            <span className="bg-[#FFE600] text-[#121212] font-mono-code font-extrabold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0 mt-0.5">
              PRO TIP
            </span>
            <p className="m-0 text-[11px] sm:text-xs text-[#FAF8F5]/90 font-medium leading-normal">
              On mobile, tapping <strong className="text-[#FFE600] font-bold">Share to X</strong> opens your native share menu so you can select the X app with your graphic attached!
              <br className="my-1 block" />
              On desktop, it opens X in a new tab, downloads your graphic, and copies the image to your clipboard (press <strong className="text-[#8DC63F] font-bold">Ctrl+V / Cmd+V</strong> to paste).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
