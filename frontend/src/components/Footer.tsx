import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-300">
            CardioSense CDSS &bull; Clinical Decision Support System
          </span>
        </div>

        <div className="flex items-center space-x-6 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            ISO/IEC 27001 &amp; HIPAA Oriented Design
          </span>
          <span>FastAPI + Scikit-Learn ML Engine</span>
          <span>React + Vite + TypeScript</span>
        </div>

        <div className="text-[11px] text-slate-400">
          Clinical Decision Support Tool &bull; Not for Independent Diagnosis
        </div>
      </div>
    </footer>
  );
};
