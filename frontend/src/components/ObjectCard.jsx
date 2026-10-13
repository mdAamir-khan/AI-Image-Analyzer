import React from 'react';
import { Tag, CheckCircle2, AlertTriangle, Layers, Shield, Sparkles } from 'lucide-react';

export default function ObjectCard({ object, index }) {
  const { name, description, condition, quantity, category, confidence } = object;

  // Determine condition color badge
  const getConditionStyle = (cond = '') => {
    const c = cond.toLowerCase();
    if (c.includes('new') || c.includes('pristine') || c.includes('mint')) {
      return {
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'Pristine / New'
      };
    }
    if (c.includes('excellent') || c.includes('like new') || c.includes('fresh')) {
      return {
        badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        dot: 'bg-cyan-400',
        label: 'Excellent'
      };
    }
    if (c.includes('good') || c.includes('great') || c.includes('clean')) {
      return {
        badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        dot: 'bg-indigo-400',
        label: 'Good'
      };
    }
    if (c.includes('fair') || c.includes('minor') || c.includes('aged') || c.includes('used')) {
      return {
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400',
        label: 'Fair / Minor Wear'
      };
    }
    if (c.includes('worn') || c.includes('damaged') || c.includes('poor') || c.includes('scratch')) {
      return {
        badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        dot: 'bg-rose-400',
        label: 'Worn / Damaged'
      };
    }
    return {
      badge: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
      dot: 'bg-slate-400',
      label: cond || 'Standard'
    };
  };

  const conditionStyle = getConditionStyle(condition);
  const confidencePercent = confidence ? Math.round(confidence * 100) : 95;

  return (
    <div className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between">
      
      {/* Top Bar: Index badge, Quantity pill & Condition pill */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono font-bold border border-slate-700/60">
              #{index + 1}
            </span>
            {category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700/50">
                <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                {category}
              </span>
            )}
          </div>

          {/* Prominent Quantity Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-xs shrink-0">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Qty: {quantity || 1}</span>
          </div>
        </div>

        {/* Object Title */}
        <h4 className="font-display font-bold text-lg text-white group-hover:text-indigo-200 transition-colors">
          {name}
        </h4>

        {/* Condition / Quality Badge */}
        <div className="mt-2.5 mb-3 flex items-center">
          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${conditionStyle.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${conditionStyle.dot} animate-pulse`} />
            <span className="font-semibold">Quality/Condition:</span>
            <span>{condition}</span>
          </span>
        </div>

        {/* Detailed Physical Description */}
        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer: Confidence Metric */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center text-[11px]">
          <Shield className="w-3 h-3 mr-1 text-cyan-400" />
          Certainty
        </span>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-cyan-300 font-semibold">
            {confidencePercent}%
          </span>
        </div>
      </div>

    </div>
  );
}
