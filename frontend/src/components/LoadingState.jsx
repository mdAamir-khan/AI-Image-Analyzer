import React, { useState, useEffect } from 'react';
import { Sparkles, Scan, Database, Cpu, CheckCircle } from 'lucide-react';

const STEPS = [
  { label: 'Preprocessing & encoding image buffer...', icon: Scan },
  { label: 'Connecting to OpenRouter Vision AI (Multimodal Engine)...', icon: Cpu },
  { label: 'Detecting visible physical objects & spatial geometry...', icon: Sparkles },
  { label: 'Evaluating physical condition, quality & quantities...', icon: Sparkles },
  { label: 'Saving analysis record to MySQL database...', icon: Database },
];

export default function LoadingState({ previewUrl }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-3xl bg-slate-900/90 border border-indigo-500/30 overflow-hidden shadow-2xl p-6 sm:p-8 animate-fade-in relative">
      
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Image preview with laser scan line */}
        {previewUrl && (
          <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black border border-indigo-500/40">
            <img
              src={previewUrl}
              alt="Analyzing Target"
              className="w-full h-full object-cover filter brightness-75 contrast-125"
            />
            
            {/* Blue/Cyan Laser scanning beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_4px_rgba(6,182,212,0.8)] animate-scan pointer-events-none" />

            {/* Tech grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-black/40 pointer-events-none" />

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

            <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>AI SCAN ACTIVE</span>
            </div>
          </div>
        )}

        {/* Textual progress status */}
        <div className="text-center space-y-2">
          <h3 className="font-display font-bold text-xl text-white flex items-center justify-center space-x-2">
            <span>Analyzing Image with Vision AI</span>
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          </h3>
          <p className="text-xs text-slate-400">
            Deep-learning multimodal vision is cataloging all physical objects, assessing conditions, and quantifying items.
          </p>
        </div>

        {/* Step progression indicators */}
        <div className="space-y-2 pt-2">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const IconComponent = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-200 font-medium scale-[1.01]'
                    : isDone
                    ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                    : 'bg-transparent border-transparent text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <IconComponent className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
