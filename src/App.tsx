import React from 'react';
import EmailAnalyzer from './components/EmailAnalyzer';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col border border-border overflow-hidden">
      <header className="px-10 py-6 border-b border-border flex justify-between items-center bg-background">
        <div className="flex items-center gap-3">
          <div className="font-heading italic text-xl tracking-wider uppercase">PHISH_<span className="text-primary">SENTINEL</span>.AI</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">System_Online</span>
          </div>
          <div className="text-[11px] uppercase tracking-[2px] text-muted-foreground border border-border px-3 py-1 rounded-sm">
            Threat Analysis Engine v.4.0.2
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <EmailAnalyzer />
      </main>
    </div>
  );
}
