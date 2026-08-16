import React, { useState, useRef, useCallback } from 'react';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Modelo Base',
  afterLabel = 'Prueba Virtual IA',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full h-full select-none cursor-ew-resize overflow-hidden rounded-2xl bg-zinc-950"
    >
      {/* After image (full width beneath) */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow">
        {afterLabel}
      </div>

      {/* Before image (clipped by slider) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        </div>
        <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow">
          {beforeLabel}
        </div>
      </div>

      {/* Divider line and handle */}
      <div
        className="absolute top-0 bottom-0 z-30 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 shadow-xl flex items-center justify-center border border-zinc-300">
          <div className="flex items-center gap-0.5 text-xs font-bold">
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
      </div>
    </div>
  );
};
