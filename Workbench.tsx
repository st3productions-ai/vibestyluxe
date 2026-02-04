
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Settings2, Wand2, Download, Share2, Info, Check, History as HistoryIcon, X, ExternalLink, Scissors, Palette, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { PALETTES, HAIRSTYLES, PLACEHOLDER_BEFORE } from '../constants';
import { GenerationResult, Hairstyle, VibePalette } from '../types';
import ComparisonSlider from './ComparisonSlider';
import { geminiService } from '../services/geminiService';

const Workbench: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<VibePalette>(PALETTES[0]);
  const [selectedStyle, setSelectedStyle] = useState<Hairstyle>(HAIRSTYLES[0]);
  const [includeColor, setIncludeColor] = useState(true);
  const [includeStyle, setIncludeStyle] = useState(true);
  
  const [baseImage, setBaseImage] = useState<string>(PLACEHOLDER_BEFORE);
  const [resultImage, setResultImage] = useState<string>(PLACEHOLDER_BEFORE);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [showCheck, setShowCheck] = useState(false);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('vibestyle_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) { console.error("History parse failed", e); }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('vibestyle_history', JSON.stringify(history.slice(0, 10)));
    }
  }, [history]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBaseImage(result);
        setResultImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVibe = async () => {
    if (!baseImage) return;
    setIsLoading(true);
    setAnalysis('');
    
    try {
      const transformed = await geminiService.transformHair(
        baseImage, 
        selectedColor.name, 
        selectedStyle.name,
        includeColor,
        includeStyle
      );
      setResultImage(transformed);

      const analysisText = await geminiService.getVibeAnalysis(
        selectedColor.name,
        selectedStyle.name,
        includeColor,
        includeStyle
      );
      setAnalysis(analysisText);
      
      const newResult: GenerationResult = {
        beforeUrl: baseImage,
        afterUrl: transformed,
        technique: includeStyle ? selectedStyle.name : 'Color Refinement',
        colorName: includeColor ? selectedColor.name : 'Original Tone',
        styleName: includeStyle ? selectedStyle.name : 'Original Cut'
      };
      setHistory(prev => [newResult, ...prev]);

      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 3000);

    } catch (error) {
      console.error("Vibe Generation Error:", error);
      alert("AI Studio currently high capacity. Please retry in 30s.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    if (resultImage === PLACEHOLDER_BEFORE) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `VibeStyle-${Date.now()}.png`;
    link.click();
  };

  const loadFromHistory = (item: GenerationResult) => {
    setBaseImage(item.beforeUrl);
    setResultImage(item.afterUrl);
    
    const foundColor = PALETTES.find(p => p.name === item.colorName);
    if (foundColor) {
      setSelectedColor(foundColor);
      setIncludeColor(true);
    } else if (item.colorName === 'Original Tone') {
      setIncludeColor(false);
    }

    const foundStyle = HAIRSTYLES.find(s => s.name === item.styleName);
    if (foundStyle) {
      setSelectedStyle(foundStyle);
      setIncludeStyle(true);
    } else if (item.styleName === 'Original Cut') {
      setIncludeStyle(false);
    }

    setShowHistory(false);
    document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getResultLabel = () => {
    if (!includeColor && !includeStyle) return "NO CHANGE";
    const parts = [];
    if (includeColor) parts.push(selectedColor.name.toUpperCase());
    if (includeStyle) parts.push(selectedStyle.name.toUpperCase());
    return parts.join(" • ");
  };

  return (
    <section id="workbench" className="py-24 bg-zinc-950 border-y-2 border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-zinc-900 border-2 border-zinc-800 shadow-brutalist relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-header text-2xl flex items-center gap-3 tracking-tighter">
                  <div className="w-10 h-10 rounded-lg bg-electricPurple flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.5)]">
                    <Settings2 className="w-5 h-5 text-white" />
                  </div>
                  WORKBENCH
                </h2>
                <button 
                  onClick={() => setShowHistory(true)} 
                  className="p-3 border-2 border-zinc-800 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                >
                  <HistoryIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <button 
                  onClick={() => setIncludeColor(!includeColor)}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${includeColor ? 'border-electricPurple bg-electricPurple/10' : 'border-zinc-800 opacity-40'}`}
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Color</span>
                  {includeColor ? <ToggleRight className="text-electricPurple" /> : <ToggleLeft className="text-zinc-600" />}
                </button>
                <button 
                  onClick={() => setIncludeStyle(!includeStyle)}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${includeStyle ? 'border-neonMagenta bg-neonMagenta/10' : 'border-zinc-800 opacity-40'}`}
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Style</span>
                  {includeStyle ? <ToggleRight className="text-neonMagenta" /> : <ToggleLeft className="text-zinc-600" />}
                </button>
              </div>

              <div className="mb-10">
                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-[0.3em]">
                  <Scissors className="w-3 h-3" /> Select Hairstyle
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar p-1">
                  {HAIRSTYLES.map((style) => (
                    <button 
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      disabled={!includeStyle}
                      className={`p-3 rounded-lg border-2 text-[9px] font-black uppercase tracking-tighter leading-tight text-center transition-all ${
                        selectedStyle.id === style.id && includeStyle 
                          ? 'border-neonMagenta bg-neonMagenta/10 text-white shadow-[0_0_10px_rgba(255,0,255,0.2)]' 
                          : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 disabled:opacity-20'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-[0.3em]">
                  <Palette className="w-3 h-3" /> Luxury Palette
                </label>
                <div className="flex flex-wrap gap-4">
                  {PALETTES.map((p) => (
                    <button 
                      key={p.name}
                      onClick={() => setSelectedColor(p)}
                      disabled={!includeColor}
                      className={`group relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor.name === p.name && includeColor 
                          ? 'border-electricPurple scale-110 shadow-[0_0_20px_rgba(138,43,226,0.4)]' 
                          : 'border-zinc-800 hover:scale-105 disabled:opacity-20'
                      }`}
                      style={{ backgroundColor: p.color }}
                    >
                      {selectedColor.name === p.name && includeColor && <Check className="w-5 h-5 text-obsidian" />}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[8px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                        {p.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full mb-6 border-2 border-dashed border-zinc-800 rounded-xl p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] hover:border-electricPurple hover:text-electricPurple transition-all group"
              >
                <span className="group-hover:scale-105 inline-block">Upload Editorial Portrait</span>
              </button>

              <button 
                onClick={generateVibe}
                disabled={isLoading || (!includeColor && !includeStyle)}
                className={`relative group w-full py-6 rounded-xl font-header text-2xl shadow-brutalist hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:translate-y-0 overflow-hidden ${includeColor || includeStyle ? 'bg-electricPurple' : 'bg-zinc-800'}`}
              >
                {isLoading ? (
                  <div className="animate-spin border-3 border-t-transparent rounded-full w-6 h-6"></div>
                ) : (
                  <>
                    <span className="relative z-10">{showCheck ? 'VIBE LOCKED' : 'GENERATE VIBE'}</span>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                  </>
                )}
              </button>
            </div>

            {analysis && (
              <div className="p-8 rounded-2xl bg-zinc-900 border-2 border-zinc-800 relative animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 mb-4 text-neonMagenta">
                  <div className="w-2 h-2 rounded-full bg-neonMagenta animate-pulse shadow-[0_0_10px_#FF00FF]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">ELITE AI ANALYSIS</span>
                </div>
                <p className="text-base text-zinc-300 italic font-medium leading-relaxed">"{analysis}"</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="font-header text-3xl tracking-tighter uppercase">VISUALIZER CORE</h3>
                  <div className="h-1 w-20 bg-electricPurple rounded-full"></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadResult} className="p-4 border-2 border-zinc-800 rounded-2xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all hover:border-zinc-600" title="Save Result"><Download className="w-5 h-5" /></button>
                  <button className="p-4 border-2 border-zinc-800 rounded-2xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all hover:border-zinc-600" title="Client Link"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
              <ComparisonSlider 
                beforeImg={baseImage} 
                afterImg={resultImage} 
                afterLabel={getResultLabel()}
                loading={isLoading}
              />
              <div className="mt-8 grid grid-cols-3 gap-6 opacity-40">
                <div className="text-center p-4 border border-zinc-800 rounded-xl">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Rendering Engine</p>
                  <p className="text-[10px] font-bold">VibeStyle v2.5</p>
                </div>
                <div className="text-center p-4 border border-zinc-800 rounded-xl">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Color Accuracy</p>
                  <p className="text-[10px] font-bold">99.8% Luxury</p>
                </div>
                <div className="text-center p-4 border border-zinc-800 rounded-xl">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Processing Mode</p>
                  <p className="text-[10px] font-bold">B2B Studio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-md" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-lg bg-zinc-950 border-l-2 border-zinc-800 h-full flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500">
            <div className="p-10 border-b border-zinc-900 flex items-center justify-between">
              <h3 className="font-header text-3xl uppercase tracking-tighter flex items-center gap-4">
                <HistoryIcon className="w-8 h-8 text-electricPurple" /> ARCHIVE
              </h3>
              <button onClick={() => setShowHistory(false)} className="w-12 h-12 rounded-full hover:bg-zinc-900 flex items-center justify-center transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                  <Wand2 className="w-12 h-12 mb-4" />
                  <p className="uppercase tracking-[0.5em] font-black text-xs">No entries archived</p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl overflow-hidden cursor-pointer hover:border-electricPurple transition-all group" onClick={() => loadFromHistory(item)}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={item.afterUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-electricPurple shadow-[0_0_10px_#8A2BE2]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.colorName}</span>
                      </div>
                    </div>
                    <div className="p-5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{item.styleName}</span>
                      <ExternalLink className="w-4 h-4 text-electricPurple opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Workbench;
