import React, { useState } from 'react';
import { X, Trash2, Clock, Layers, ChevronRight, Search, AlertCircle, Eye } from 'lucide-react';

export default function HistorySidebar({ isOpen, onClose, history = [], onSelectRecord, onDeleteRecord }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = item.originalFileName?.toLowerCase().includes(q);
    const summaryMatch = item.overallSummary?.toLowerCase().includes(q);
    const objectMatch = item.objects?.some(o => o.name?.toLowerCase().includes(q));
    return nameMatch || summaryMatch || objectMatch;
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete analysis record #${id}?`)) {
      setDeletingId(id);
      await onDeleteRecord(id);
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Analysis History</h3>
            <p className="text-xs text-slate-400">
              {history.length} records saved in database
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-850">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter past analyses..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Record List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2 text-xs">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <p>No analysis history found.</p>
              <p className="text-[11px] text-slate-600">Analyzed images will automatically appear here.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectRecord(item);
                  onClose();
                }}
                className="group relative flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.originalFileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                      {item.originalFileName || `Record #${item.id}`}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center space-x-2 text-[11px]">
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 font-medium">
                      <Layers className="w-2.5 h-2.5 mr-1" />
                      {item.totalObjectsDetected} objects
                    </span>
                    {item.processingDurationMs && (
                      <span className="text-slate-500 text-[10px]">
                        {(item.processingDurationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {item.overallSummary || 'Physical object inspection completed.'}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={(e) => handleDelete(e, item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
