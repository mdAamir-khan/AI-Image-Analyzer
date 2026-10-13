import React from 'react';
import { Eye, Key, History, Sparkles, CheckCircle2, AlertCircle, Sun, Moon } from 'lucide-react';

export default function Navbar({ onOpenConfig, onOpenHistory, historyCount, systemStatus, theme, onToggleTheme }) {
  const isDark = theme !== 'light';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Eye className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Image<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Reco</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
                Multimodal AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Full-Stack Vision Object & Condition Intelligence</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Status Indicator */}
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            {systemStatus?.apiKeyConfigured ? (
              <span className="flex items-center text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                OpenRouter AI Ready
              </span>
            ) : (
              <span className="flex items-center text-amber-400">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                API Key Needed
              </span>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 text-slate-300 transition-all shadow-sm"
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenConfig}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 text-slate-200 transition-all shadow-sm"
            title="Configure OpenRouter API Key"
          >
            <Key className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 transition-all hover:border-indigo-400/50"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
