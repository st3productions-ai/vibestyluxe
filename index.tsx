
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Settings2, MoveHorizontal, Loader2, CheckCircle2, 
  Target, TrendingUp, Sparkles, Rocket, Scissors, Palette, 
  User, Mail, Phone, Building2, Users, ShieldCheck, Download,
  Share2, Check, Wand2, Scissors as CutIcon, DollarSign, Briefcase
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ComparisonSlider from './components/ComparisonSlider';
import LeadForm from './components/LeadForm';
import { PALETTES, HAIRSTYLES, PLACEHOLDER_BEFORE } from './constants';

const App = () => {
  const [selectedColor, setSelectedColor] = useState(PALETTES[1]);
  const [selectedStyle, setSelectedStyle] = useState(HAIRSTYLES[0]);
  const [base, setBase] = useState(PLACEHOLDER_BEFORE);
  const [result, setResult] = useState(PLACEHOLDER_BEFORE);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const generate = async () => {
    setLoading(true);
    setAnalysis("");
    try {
      // Fixed: Initialize GoogleGenAI strictly using process.env.API_KEY as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a celebrity hair artist. Transform the hairstyle in this photo to a precise "${selectedStyle.name}" in a premium luxury "${selectedColor.name}" color. High-end fashion editorial quality. Seamless blend. Only change the hair. Maintain high-ticket Bronx Luxury aesthetic.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base.split(',')[1] || '', mimeType: 'image/jpeg' } },
            { text: prompt }
          ],
        },
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setResult(`data:image/jpeg;base64,${part.inlineData.data}`);
        const vibeRes = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze why a "${selectedStyle.name}" with "${selectedColor.name}" is a power move in the luxury Bronx fashion scene. High-ticket perspective. 2 sentences max.`
        });
        setAnalysis(vibeRes.text || "Elite aesthetic confirmed.");
      }
    } catch (e) { 
      console.error(e);
      alert("Neural Engine high capacity. Try again shortly."); 
    }
    finally { setLoading(false); }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const res = f.target?.result as string;
        setBase(res);
        setResult(res);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-electricPurple selection:text-white font-body">
      <nav className="fixed top-0 w-full h-24 bg-obsidian/90 backdrop-blur-2xl border-b border-zinc-900 z-50 flex items-center justify-between px-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-electricPurple rotate-45 flex items-center justify-center shadow-neonPurple">
            <span className="text-white font-header -rotate-45 text-sm">VS</span>
          </div>
          <div className="font-header text-3xl tracking-tighter uppercase">VIBESTYLE</div>
        </div>
        <button onClick={() => document.getElementById('lead')?.scrollIntoView({behavior:'smooth'})} 
                className="bg-electricPurple px-8 py-3 rounded-2xl font-bold text-xs tracking-widest uppercase shadow-brutalist hover:translate-y-0.5 hover:shadow-none transition-all">GET ACCESS</button>
      </nav>

      <header className="pt-56 pb-24 px-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <div className="animate-in slide-in-from-left duration-1000">
          <h1 className="font-header text-7xl md:text-[100px] leading-[0.8] mb-10 uppercase">
            STOP <span className="text-electricPurple text-glow">GUESSING.</span><br />
            <span className="text-zinc-800">START CLOSING.</span>
          </h1>
          <p className="text-zinc-400 text-2xl max-w-lg mb-14 font-light leading-relaxed italic border-l-4 border-electricPurple pl-6">
            Bridge the "Misunderstanding Gap" instantly. VibeStyle AI transforms client hesitation into high-ticket commitments with 99.8% visual accuracy.
          </p>
          <div className="flex flex-wrap gap-6">
            <button onClick={() => document.getElementById('workbench')?.scrollIntoView({behavior:'smooth'})}
                    className="bg-white text-black px-12 py-6 rounded-3xl font-header text-2xl shadow-brutalist hover:bg-neonMagenta hover:text-white transition-all flex items-center gap-4">
              OPEN WORKBENCH <Sparkles className="w-6 h-6" />
            </button>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">ROI TRACKER</span>
              <span className="text-neonGreen font-header text-2xl">+42% CLOSURE RATE</span>
            </div>
          </div>
        </div>
        <div className="relative group">
           <div className="absolute -inset-4 bg-electricPurple/20 blur-[100px] group-hover:bg-electricPurple/30 transition-all"></div>
           <ComparisonSlider beforeImg={PLACEHOLDER_BEFORE} afterImg={PLACEHOLDER_BEFORE} />
        </div>
      </header>

      <section id="workbench" className="py-40 bg-zinc-950 border-y-2 border-zinc-900">
        <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5">
            <div className="bg-zinc-900 border-2 border-zinc-800 p-10 rounded-[40px] space-y-10 shadow-brutalist relative overflow-hidden">
              <h2 className="font-header text-3xl flex items-center gap-4 italic text-zinc-300">
                <Settings2 className="text-electricPurple w-8 h-8" /> WORKBENCH CORE
              </h2>
              
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Cut Style (9 Options)</p>
                <div className="grid grid-cols-3 gap-2">
                  {HAIRSTYLES.map(s => (
                    <button key={s.id} onClick={() => setSelectedStyle(s)} 
                            className={`p-3 text-[10px] font-bold rounded-xl border-2 transition-all ${selectedStyle.id === s.id ? 'border-neonMagenta bg-neonMagenta/10 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                      {s.name.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Luxury Palette (6 Colors)</p>
                <div className="flex flex-wrap gap-4">
                  {PALETTES.map(p => (
                    <button key={p.name} onClick={() => setSelectedColor(p)} 
                            className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor.name === p.name ? 'border-white scale-110 shadow-neonPurple' : 'border-zinc-800 hover:scale-105'}`}
                            style={{ backgroundColor: p.color }}>
                      {selectedColor.name === p.name && <Check className="w-5 h-5 text-obsidian" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <input type="file" ref={fileRef} className="hidden" onChange={onFileChange} accept="image/*" />
                <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-zinc-800 p-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:border-electricPurple transition-all">UPLOAD EDITORIAL PORTRAIT</button>
                <button onClick={generate} disabled={loading} className="w-full bg-electricPurple py-7 rounded-[30px] font-header text-3xl animate-neon flex items-center justify-center gap-4 group overflow-hidden">
                  {loading ? <Loader2 className="animate-spin" /> : <>GENERATE VIBE <Wand2 className="w-6 h-6" /></>}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
            {analysis && (
              <div className="mt-8 p-8 bg-zinc-900 border-l-4 border-neonMagenta rounded-[30px] animate-in slide-in-from-bottom-5">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neonMagenta">ELITE AI ANALYSIS</span>
                <p className="text-xl text-zinc-300 italic font-medium mt-4">"{analysis}"</p>
              </div>
            )}
          </div>
          <div className="lg:col-span-7 sticky top-32">
             <div className="mb-6 flex justify-between items-end">
                <div>
                  <h3 className="font-header text-3xl tracking-tighter uppercase">VISUALIZER</h3>
                  <p className="text-zinc-600 text-[10px] font-black tracking-widest">BRONX LUXURY ENGINE v2.5</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LOCK STATUS: ACTIVE</div>
                </div>
             </div>
             <ComparisonSlider beforeImg={base} afterImg={result} loading={loading} afterLabel={`${selectedStyle.name.toUpperCase()} • ${selectedColor.name.toUpperCase()}`} />
          </div>
        </div>
      </section>

      <section className="py-40 px-10 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center">
            <h2 className="font-header text-6xl md:text-8xl uppercase tracking-tighter mb-6">STUDIO <span className="text-electricPurple">TIERS</span></h2>
            <p className="text-zinc-500 font-black tracking-[0.5em] uppercase text-xs">Invest in the Closing Tool</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-zinc-900 p-16 rounded-[50px] border-2 border-zinc-800 hover:border-electricPurple transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Scissors className="w-32 h-32" /></div>
              <h3 className="font-header text-4xl mb-2">SOLO ARTIST</h3>
              <p className="text-zinc-500 mb-10 text-sm uppercase tracking-widest font-black">Individual Stylist License</p>
              <div className="mb-12">
                <span className="font-header text-7xl">$79</span>
                <span className="text-zinc-600 font-bold">/MO</span>
              </div>
              <ul className="space-y-4 mb-12">
                {['Unlimited Visualizations', 'B2B Client Portal', 'Priority Rendering', 'HD Exports'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-zinc-400 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-neonGreen" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => document.getElementById('lead')?.scrollIntoView({behavior:'smooth'})} className="w-full bg-white text-black py-6 rounded-2xl font-header text-xl group-hover:bg-electricPurple group-hover:text-white transition-all shadow-brutalist">ACQUIRE LICENSE</button>
            </div>
            
            <div className="bg-zinc-900 p-16 rounded-[50px] border-2 border-electricPurple shadow-neonPurple group relative overflow-hidden">
              <div className="absolute -top-4 -right-4 bg-electricPurple px-10 py-2 rotate-45 font-header text-xs tracking-widest">BEST ROI</div>
              <h3 className="font-header text-4xl mb-2">STUDIO COLLECTIVE</h3>
              <p className="text-zinc-500 mb-10 text-sm uppercase tracking-widest font-black">Up to 10 Stylists</p>
              <div className="mb-12">
                <span className="font-header text-7xl">$150</span>
                <span className="text-zinc-600 font-bold">/MO</span>
              </div>
              <ul className="space-y-4 mb-12">
                {['Team Dashboard', 'Admin Lead Control', 'Custom Style Presets', 'Dedicated Support'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-zinc-400 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-neonGreen" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => document.getElementById('lead')?.scrollIntoView({behavior:'smooth'})} className="w-full bg-electricPurple text-white py-6 rounded-2xl font-header text-xl shadow-brutalist animate-neon">ACQUIRE LICENSE</button>
            </div>
          </div>
        </div>
      </section>

      <section id="lead" className="py-40 px-10 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-header text-5xl uppercase tracking-tighter mb-8 leading-none">FORCE SYNC <br/><span className="text-electricPurple">YOUR STUDIO.</span></h2>
            <p className="text-zinc-500 text-xl font-light italic leading-relaxed mb-10">
              Stop letting "Let me think about it" kill your revenue. Join the elite studios using VibeStyle to close the sale before the cape even goes on.
            </p>
            <div className="space-y-6">
               <div className="flex items-center gap-4 p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-neonMagenta/10 flex items-center justify-center"><Briefcase className="text-neonMagenta" /></div>
                  <div>
                    <p className="font-black text-[10px] text-zinc-500 tracking-widest uppercase">B2B RELIABILITY</p>
                    <p className="font-bold text-sm text-zinc-300">99.9% Uptime Engine</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-neonGreen/10 flex items-center justify-center"><ShieldCheck className="text-neonGreen" /></div>
                  <div>
                    <p className="font-black text-[10px] text-zinc-500 tracking-widest uppercase">SECURITY</p>
                    <p className="font-bold text-sm text-zinc-300">Encrypted Studio Logs</p>
                  </div>
               </div>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>

      <footer className="py-32 border-t border-zinc-900 text-center bg-zinc-950/30">
        <div className="font-header text-4xl mb-8 tracking-tighter opacity-10">VIBESTYLE</div>
        <p className="text-zinc-800 text-[11px] uppercase tracking-[0.6em] font-black">
          Bronx Luxury Systems © 2026 • Valentine St. Martin Original
        </p>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
