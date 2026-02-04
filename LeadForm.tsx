
import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Building2, Users, Mail, Phone, User, ShieldCheck } from 'lucide-react';
import { submitLead } from '../services/leadService';
import { LeadData } from '../types';

const LeadForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<LeadData>({
    FullName: '',
    ContactPhone: '',
    BusinessEmail: '',
    BusinessName: '',
    EmployeeSize: '1-3'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const success = await submitLead(formData);
    
    if (success) {
      setStatus('success');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-zinc-900 border-2 border-neonGreen p-12 rounded-[40px] text-center shadow-[0_0_50px_rgba(57,255,20,0.15)] animate-in zoom-in duration-500">
        <CheckCircle2 className="w-16 h-16 text-neonGreen mx-auto mb-6" />
        <h3 className="font-header text-3xl mb-4 text-white uppercase tracking-tighter">DATA SYNCHRONIZED</h3>
        <p className="text-zinc-400 max-w-sm mx-auto">The VibeStyle engine has confirmed capture for <strong>{formData.BusinessName}</strong>.</p>
        <button 
          onClick={() => {
            setFormData({ FullName: '', ContactPhone: '', BusinessEmail: '', BusinessName: '', EmployeeSize: '1-3' });
            setStatus('idle');
          }}
          className="mt-8 text-[10px] font-black text-neonGreen uppercase tracking-[0.4em] underline underline-offset-8"
        >
          SYNC NEW STUDIO
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border-2 border-zinc-800 p-8 md:p-12 rounded-[40px] shadow-brutalist relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-electricPurple/5 blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h3 className="font-header text-4xl mb-2 uppercase tracking-tighter text-white">STUDIO DEMO</h3>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black border-l-2 border-electricPurple pl-4 mt-2">Sync Engine v8.0 Active</p>
          </div>
          <ShieldCheck className="w-10 h-10 text-zinc-700" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                required
                className="w-full bg-obsidian border-2 border-zinc-800 focus:border-electricPurple p-4 pl-12 rounded-2xl text-sm outline-none transition-all text-white placeholder:text-zinc-800"
                placeholder="FULL NAME"
                value={formData.FullName}
                onChange={e => setFormData({...formData, FullName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                required
                type="tel"
                className="w-full bg-obsidian border-2 border-zinc-800 focus:border-electricPurple p-4 pl-12 rounded-2xl text-sm outline-none transition-all text-white placeholder:text-zinc-800"
                placeholder="CONTACT PHONE"
                value={formData.ContactPhone}
                onChange={e => setFormData({...formData, ContactPhone: e.target.value})}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                required
                type="email"
                className="w-full bg-obsidian border-2 border-zinc-800 focus:border-electricPurple p-4 pl-12 rounded-2xl text-sm outline-none transition-all text-white placeholder:text-zinc-800"
                placeholder="BUSINESS EMAIL"
                value={formData.BusinessEmail}
                onChange={e => setFormData({...formData, BusinessEmail: e.target.value})}
              />
            </div>
          </div>

          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              required
              className="w-full bg-obsidian border-2 border-zinc-800 focus:border-electricPurple p-4 pl-12 rounded-2xl text-sm outline-none transition-all text-white placeholder:text-zinc-800"
              placeholder="BUSINESS NAME"
              value={formData.BusinessName}
              onChange={e => setFormData({...formData, BusinessName: e.target.value})}
            />
          </div>

          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 z-10" />
            <select 
              className="w-full bg-obsidian border-2 border-zinc-800 focus:border-electricPurple p-4 pl-12 rounded-2xl text-sm outline-none transition-all text-white appearance-none cursor-pointer relative z-0"
              value={formData.EmployeeSize}
              onChange={e => setFormData({...formData, EmployeeSize: e.target.value as any})}
            >
              <option value="1-3">1-3 STYLISTS</option>
              <option value="4-10">4-10 STYLISTS</option>
              <option value="11-25">11-25 STYLISTS</option>
              <option value="25+">25+ ENTERPRISE</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-electricPurple py-6 rounded-2xl font-header text-2xl shadow-brutalist hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" /> : <>FORCE SYNC <Send className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
