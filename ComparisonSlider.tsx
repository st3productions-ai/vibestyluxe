
import React, { useState, useRef } from 'react';
import { MoveHorizontal, Zap } from 'lucide-react';

interface ComparisonSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
  loading?: boolean;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeImg,
  afterImg,
  beforeLabel = "BASE CANVAS",
  afterLabel = "AI TRANSFORMATION",
  loading = false
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : (e as React.MouseEvent).clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(position);
  };

  // Prevent division by zero if slider is at the very edge
  const safeSliderPos = Math.max(0.1, sliderPos);

  return (
    <div className="relative w-full group">
      <div 
        ref={containerRef}
        className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border-2 border-zinc-800 bg-zinc-900 cursor-ew-resize select-none shadow-2xl"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {/* After Image */}
        <div className="absolute inset-0">
          <img src={afterImg} alt="After" className="w-full h-full object-cover" />
          <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
            <span className="bg-electricPurple text-white px-3 py-1 rounded-sm text-[9px] font-black tracking-[0.2em] shadow-lg">
              {afterLabel}
            </span>
            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest bg-obsidian/40 px-2 py-0.5 rounded-sm">VIBESTYLE v2.5</span>
          </div>
        </div>

        {/* Before Image (Revealed by slider) */}
        <div 
          className="absolute inset-0 z-10 overflow-hidden border-r border-electricPurple/50"
          style={{ width: `${sliderPos}%` }}
        >
          <img 
            src={beforeImg} 
            alt="Before" 
            className="absolute top-0 left-0 h-full object-cover grayscale brightness-[0.8]"
            style={{ 
              width: `${(100 / safeSliderPos) * 100}%`, 
              minWidth: containerRef.current?.offsetWidth || '100%' 
            }}
          />
          <div className="absolute top-6 left-6">
            <span className="bg-zinc-800/80 backdrop-blur-md text-zinc-300 px-3 py-1 rounded-sm text-[9px] font-black tracking-[0.2em] border border-zinc-700">
              {beforeLabel}
            </span>
          </div>
        </div>

        {/* Handle with Neon Pulse */}
        <div 
          className="absolute top-0 bottom-0 z-20 w-[2px] bg-electricPurple pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-active:scale-90 transition-transform">
             <div className="w-10 h-10 bg-obsidian border-2 border-electricPurple rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.5)]">
               <MoveHorizontal className="w-4 h-4 text-electricPurple" />
             </div>
             <div className="absolute inset-0 rounded-full bg-neonGreen/20 animate-ping -z-10"></div>
          </div>
        </div>

        {/* High-End Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-30 bg-obsidian/80 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electricPurple/10 to-transparent h-24 w-full animate-[scan_1.5s_ease-in-out_infinite]"></div>
            
            <div className="relative">
              <div className="w-20 h-20 border-2 border-zinc-800 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-neonGreen animate-pulse" />
              </div>
              <div className="absolute inset-0 border-2 border-electricPurple rounded-full border-t-transparent animate-spin"></div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="font-header text-2xl text-white tracking-[0.1em] mb-2 uppercase italic">CALCULATING VIBE</p>
              <p className="text-[10px] text-zinc-500 font-black tracking-[0.3em] uppercase">Bronx Luxury AI v2.5 Online</p>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
      `}</style>
      
      <div className="mt-6 flex items-center justify-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="h-[1px] flex-1 bg-zinc-800"></div>
        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.5em]">Interaction Required to Lock Vibe</p>
        <div className="h-[1px] flex-1 bg-zinc-800"></div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
