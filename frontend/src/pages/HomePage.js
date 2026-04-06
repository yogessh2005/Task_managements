import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Deep Background Grid & Flares */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[150px] mix-blend-screen" style={{ animation: 'float 12s ease-in-out infinite' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-600/20 rounded-full blur-[150px] mix-blend-screen" style={{ animation: 'float 15s ease-in-out infinite reverse' }}></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]">⚡</div>
          <span className="text-xl font-display font-bold text-white uppercase tracking-widest">Nova</span>
        </div>
        <div className="flex gap-6">
          <Link to="/login" className="px-6 py-2.5 text-xs font-bold text-white uppercase tracking-widest hover:text-brand-400 transition-colors">Access Portal</Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8 shadow-2xl animate-[fadeInDown_0.6s_ease-out] neon-pulse">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">System Engine v2.4.1 Online</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tighter leading-[0.9] mb-8 glitch-effect" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
          Orchestrate <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-300 to-brand-500 gradient-shift">Pure Execution.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-12" style={{ animation: 'fadeInUp 1s ease-out' }}>
          Nova is a heavily specialized, cryptographically secure operational MERN platform designed for elite companies who demand absolute transparency and style natively built-in.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animation: 'fadeInUp 1.2s ease-out' }}>
          <Link to="/login" className="px-12 py-5 bg-zinc-900 border border-brand-500 hover:bg-zinc-900/50 text-white font-bold uppercase tracking-widest text-sm rounded-2xl transition-all w-full sm:w-auto group neon-pulse">
            Access System <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </header>

      {/* Ticker Strip */}
      <div className="relative z-10 w-full bg-zinc-950 border-y border-white/5 py-4 overflow-hidden mb-8">
        <div className="scrolling-ticker text-xs font-mono font-bold text-zinc-600 uppercase tracking-widest">
          {Array(5).fill(" • Master Operations Active • End-to-End JWT Secured • Pitch-Dark Synthwave UI • Built on MERN Stack • Realtime Execution Logic ").join("")}
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="w-6 h-6 bg-white text-black flex flex-col items-center justify-center rounded-md font-bold text-[10px]">⚡</span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Nova Corp</span>
          </div>
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            © 2026 Nova Systems Limited. Distributed Intelligence.
          </div>
        </div>
      </footer>

      {/* Extra Interactive Style Blocks for HomePage */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(5deg); }
          66% { transform: translateY(20px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
