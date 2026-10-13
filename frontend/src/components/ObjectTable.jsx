import React from 'react';
import { Layers, Tag, Shield } from 'lucide-react';

export default function ObjectTable({ objects = [] }) {
  if (!objects || objects.length === 0) {
    return <div className="text-center py-8 text-xs text-slate-500">No objects recorded.</div>;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Object Name</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Quantity</th>
            <th className="py-3 px-4">Quality / Condition</th>
            <th className="py-3 px-4 min-w-[240px]">Physical Description</th>
            <th className="py-3 px-4">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {objects.map((obj, idx) => (
            <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
              <td className="py-3 px-4 font-mono text-slate-500">
                {idx + 1}
              </td>
              <td className="py-3 px-4 font-semibold text-white">
                {obj.name}
              </td>
              <td className="py-3 px-4 text-slate-300">
                <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                  {obj.category || 'General'}
                </span>
              </td>
              <td className="py-3 px-4 font-bold text-indigo-300">
                {obj.quantity || 1}
              </td>
              <td className="py-3 px-4 font-medium text-cyan-300">
                {obj.condition || 'Good'}
              </td>
              <td className="py-3 px-4 text-slate-300/90 leading-relaxed">
                {obj.description}
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">
                {obj.confidence ? `${Math.round(obj.confidence * 100)}%` : '95%'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
