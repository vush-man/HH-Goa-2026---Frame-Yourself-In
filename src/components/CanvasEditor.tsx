import React, { useEffect, useRef, useState } from 'react';
import { PhotoState, BuilderProfile, FrameFormat } from '../types';
import { renderGraphicToCanvas, isPointInPhotoRegion } from '../utils/canvasRenderer';
import { ZoomIn, ZoomOut, RotateCw, Move, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface CanvasEditorProps {
  format: FrameFormat;
  photo: PhotoState;
  profile: BuilderProfile;
  onPhotoChange: (updated: Partial<PhotoState>) => void;
  onExportRequest: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  format,
  photo,
  profile,
  onPhotoChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showCirclePreview, setShowCirclePreview] = useState(true);

  // Keep refs for non-passive event listeners
  const photoRef = useRef(photo);
  photoRef.current = photo;
  const onPhotoChangeRef = useRef(onPhotoChange);
  onPhotoChangeRef.current = onPhotoChange;
  const formatRef = useRef(format);
  formatRef.current = format;
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;

  // Native Canvas Dimensions (High Quality 1080p canvas)
  const canvasWidth = 1080;
  const canvasHeight = format === 'pfp' ? 1080 : 1350;

  // Helper: Map DOM event client coordinates to native 1080p canvas space
  const getCanvasCoords = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Re-render canvas whenever photo, profile, or format changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderGraphicToCanvas(
      ctx,
      { format, photo, profile, showCirclePreview: format === 'pfp' && showCirclePreview },
      canvasWidth,
      canvasHeight
    );
  }, [format, photo, profile, showCirclePreview, canvasWidth, canvasHeight]);

  // Non-passive wheel & touch handlers on canvas to prevent page zooming/scrolling ONLY on photo viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartDist = 0;
    let initialScale = photoRef.current.scale;
    let isPinching = false;

    const onNativeWheel = (e: WheelEvent) => {
      const coords = getCanvasCoords(canvas, e.clientX, e.clientY);
      // ONLY zoom if mouse pointer is inside the visible photo region
      if (!isPointInPhotoRegion(formatRef.current, coords.x, coords.y)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Clamp deltaY to prevent extreme jumps on fast mouse scrollwheels
      const clampedDelta = Math.max(-100, Math.min(100, e.deltaY));
      const zoomFactor = 1 - clampedDelta * 0.0025;
      const currentScale = photoRef.current.scale;
      const newScale = Math.min(Math.max(currentScale * zoomFactor, 0.3), 5.0);
      onPhotoChangeRef.current({ scale: newScale });
    };

    const onNativeTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t0 = getCanvasCoords(canvas, e.touches[0].clientX, e.touches[0].clientY);
        const t1 = getCanvasCoords(canvas, e.touches[1].clientX, e.touches[1].clientY);
        const midX = (t0.x + t1.x) / 2;
        const midY = (t0.y + t1.y) / 2;

        // ONLY initiate pinch zoom if touches are within/near the photo viewport
        if (
          isPointInPhotoRegion(formatRef.current, t0.x, t0.y) ||
          isPointInPhotoRegion(formatRef.current, t1.x, t1.y) ||
          isPointInPhotoRegion(formatRef.current, midX, midY)
        ) {
          e.preventDefault();
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          touchStartDist = dist;
          initialScale = photoRef.current.scale;
          isPinching = true;
        } else {
          isPinching = false;
        }
      }
    };

    const onNativeTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinching && touchStartDist > 0) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const rawFactor = dist / touchStartDist;
        // Boost pinch gesture sensitivity slightly (1.35x responsive scaling factor)
        const adjustedFactor = 1 + (rawFactor - 1) * 1.35;
        const newScale = Math.min(Math.max(initialScale * adjustedFactor, 0.3), 5.0);
        onPhotoChangeRef.current({ scale: newScale });
      } else if (e.touches.length === 1 && isDraggingRef.current) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('wheel', onNativeWheel, { passive: false });
    canvas.addEventListener('touchstart', onNativeTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onNativeTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', onNativeWheel);
      canvas.removeEventListener('touchstart', onNativeTouchStart);
      canvas.removeEventListener('touchmove', onNativeTouchMove);
    };
  }, [canvasWidth, canvasHeight]);

  // Mouse Drag Pan Logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = getCanvasCoords(canvas, e.clientX, e.clientY);
    if (isPointInPhotoRegion(format, coords.x, coords.y)) {
      setIsDragging(true);
      isDraggingRef.current = true;
      setDragStart({ x: e.clientX - photo.panX, y: e.clientY - photo.panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const coords = getCanvasCoords(canvas, e.clientX, e.clientY);
      setIsHoveringPhoto(isPointInPhotoRegion(format, coords.x, coords.y));
    }

    if (!isDragging) return;
    onPhotoChange({
      panX: e.clientX - dragStart.x,
      panY: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  // Touch Single-Finger Pan Logic
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const touch = e.touches[0];
      const coords = getCanvasCoords(canvas, touch.clientX, touch.clientY);
      if (isPointInPhotoRegion(format, coords.x, coords.y)) {
        setIsDragging(true);
        isDraggingRef.current = true;
        setDragStart({ x: touch.clientX - photo.panX, y: touch.clientY - photo.panY });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    onPhotoChange({
      panX: touch.clientX - dragStart.x,
      panY: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Live Canvas Graphic Box */}
      <div className="relative group max-w-md w-full bg-[#003D21] p-3 rounded-3xl border-4 border-[#FFE600] shadow-2xl">
        
        {/* Helper Hint Badge */}
        <div className="absolute top-5 left-5 z-20 pointer-events-none bg-[#121212]/80 backdrop-blur-md px-3 py-1 rounded-full text-[#FFE600] font-mono-code text-[11px] font-bold border border-[#8DC63F]/40 flex items-center gap-1.5 shadow-md">
          <Move className="w-3.5 h-3.5 text-[#FF007A]" />
          Touch Photo to Drag &amp; Zoom
        </div>

        {/* Real HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`w-full h-auto rounded-2xl touch-none select-none block shadow-inner ${
            isDragging ? 'cursor-grabbing' : isHoveringPhoto ? 'cursor-grab' : 'cursor-default'
          }`}
        />

        {/* Bottom Interactive Control Bar */}
        <div className="mt-4 pt-3 border-t border-[#8DC63F]/30 flex flex-wrap items-center justify-between gap-3">
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-[#002B17] px-3 py-1.5 rounded-xl border border-[#8DC63F]/40">
            <button
              onClick={() => onPhotoChange({ scale: Math.max(photo.scale - 0.15, 0.4) })}
              className="p-1 text-[#FFE600] hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.05"
              value={photo.scale}
              onChange={(e) => onPhotoChange({ scale: parseFloat(e.target.value) })}
              className="w-20 accent-[#FF007A] cursor-pointer"
            />

            <button
              onClick={() => onPhotoChange({ scale: Math.min(photo.scale + 0.15, 3.5) })}
              className="p-1 text-[#FFE600] hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Rotate & Reset Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPhotoChange({ rotation: (photo.rotation + 90) % 360 })}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#002B17] hover:bg-[#004726] text-[#FAF8F5] text-xs font-mono-code font-bold rounded-xl border border-[#8DC63F]/40 transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#FFE600]" />
              Rotate
            </button>

            <button
              onClick={() => onPhotoChange({ scale: 1.0, panX: 0, panY: 0, rotation: 0 })}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#002B17] hover:bg-[#004726] text-[#FAF8F5] text-xs font-mono-code rounded-xl border border-[#8DC63F]/40 transition-colors"
              title="Reset Alignment"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF007A]" />
              Reset
            </button>

            {format === 'pfp' && (
              <button
                onClick={() => setShowCirclePreview(!showCirclePreview)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono-code font-bold rounded-xl border transition-colors ${
                  showCirclePreview
                    ? 'bg-[#FF007A] text-white border-[#FF007A]'
                    : 'bg-[#002B17] text-[#FAF8F5] border-[#8DC63F]/40'
                }`}
                title="Toggle X Avatar Circle Crop Mask"
              >
                {showCirclePreview ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                Circle Crop
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
