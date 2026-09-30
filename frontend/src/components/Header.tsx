import React from 'react';
import { Activity, Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import type { HealthResponse } from '../types';

interface HeaderProps {
  activeTab: 'assessment' | 'performance';
  setActiveTab: (tab: 'assessment' | 'performance') => void;
  health: HealthResponse | null;
  checkingHealth: boolean;
  onRefreshHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  health,
  checkingHealth,
  onRefreshHealth
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & System Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/30">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  CardioSense <span className="text-teal-400 text-xs px-2 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/80 font-mono uppercase font-semibold">CDSS v1.0</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Heart Disease Risk Assessment &amp; Clinical Decision Support
              </p>
            </div>
          </div>

          {/* Navigation & Status Controls */}
          <div className="flex items-center space-x-4">
            {/* System Status Indicator */}
            <button
              onClick={onRefreshHealth}
              title="Click to refresh connection status"
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs transition-colors cursor-pointer"
            >
              <span className="text-slate-400">ML Engine:</span>
              {checkingHealth ? (
                <span className="flex items-center text-amber-400 gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Verifying...
                </span>
              ) : health?.status === 'healthy' ? (
                <span className="flex items-center text-teal-400 gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> {health.model_name || 'Online'}
                </span>
              ) : (
                <span className="flex items-center text-amber-400 gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Connecting
                </span>
              )}
            </button>

            {/* Navigation Tabs */}
            <nav className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('assessment')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'assessment'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-4 h-4" />
                Risk Assessment
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'performance'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Cpu className="w-4 h-4" />
                Model Performance
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
