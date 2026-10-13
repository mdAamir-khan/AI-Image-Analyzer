import React, { useState } from 'react';
import { Layers, Sparkles, Clock, Cpu, Filter, Search, LayoutGrid, TableProperties, Download, RefreshCw, Eye } from 'lucide-react';
import ObjectCard from './ObjectCard';
import ObjectTable from './ObjectTable';

export default function AnalysisDashboard({ analysis, onReset }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!analysis) return null;

  const {
    totalObjectsDetected = 0,
    overallSummary,
    modelUsed,
    processingDurationMs,
    createdAt,
    objects = [],
    imageUrl,
    originalFileName
  } = analysis;

  // Compute unique categories
  const categories = ['ALL', ...Array.from(new Set(objects.map(o => o.category).filter(Boolean)))];

  // Filter objects based on search and category
  const filteredObjects = objects.filter(obj => {
    const matchesCategory = selectedCategory === 'ALL' || obj.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.condition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate total units counted
  const totalUnitsSum = objects.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `imagereco_analysis_${analysis.id || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      
      {/* ============================================================== */}
      {/* 1. FIRST: DISPLAY TOTAL NUMBER OF DETECTED PHYSICAL OBJECTS    */}
      {/* ============================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Main Hero KPI: Total Objects Count */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visual Object Recognition Complete</span>
            </div>

            <h2 className="text-sm uppercase tracking-wider font-bold text-slate-400">
              Total Detected Physical Objects
            </h2>

            {/* Prominent count badge */}
            <div className="flex items-baseline space-x-3">
              <span className="font-display font-extrabold text-5xl sm:text-6xl bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                {totalObjectsDetected}
              </span>
              <span className="text-slate-400 text-base sm:text-lg font-medium">
                 physical items identified
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-xl">
              Cataloged from <span className="text-slate-200 font-medium">{originalFileName || 'input image'}</span> with physical state assessment and unit quantities.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Total Units</span>
              </div>
              <div className="font-display font-bold text-xl text-white">
                {totalUnitsSum}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Response Time</span>
              </div>
              <div className="font-display font-bold text-xl text-white">
                {processingDurationMs ? `${(processingDurationMs / 1000).toFixed(2)}s` : '1.4s'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vision AI</span>
              </div>
              <div className="font-mono text-xs font-bold text-indigo-300 truncate" title={modelUsed || 'openrouter/free'}>
                {modelUsed || 'openrouter/free'}
              </div>
            </div>

          </div>
        </div>

        {/* Scene Summary Box */}
        {overallSummary && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1.5">
              Scene Overview & Environment
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              {overallSummary}
            </p>
          </div>
        )}

        {/* Action button toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Analyze Another Image</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. IMAGE PREVIEW & OBJECT FILTER BAR                           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Analyzed Image Preview Panel */}
        {imageUrl && (
          <div className="lg:col-span-1 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Input Image
              </span>
              <span className="text-[11px] font-mono text-slate-500">Record #{analysis.id || 'N/A'}</span>
            </div>
            
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-slate-800 group">
              <img
                src={imageUrl}
                alt="Analyzed target"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium backdrop-blur-xs"
              >
                Click to view full image
              </a>
            </div>
          </div>
        )}

        {/* Filter Controls & View Selector */}
        <div className={`space-y-4 ${imageUrl ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search detected items by name, description, condition..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 text-[11px] mr-1 shrink-0 flex items-center">
                <Filter className="w-3 h-3 mr-0.5" />
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. SHOW EACH OBJECT'S NAME, DESCRIPTION, CONDITION, QUANTITY   */}
          {/* ============================================================== */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
              <span className="font-semibold text-slate-200">
                Identified Object Breakdown ({filteredObjects.length} shown)
              </span>
            </div>

            {filteredObjects.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-xs">
                No detected objects match the current filter criteria.
              </div>
            ) : viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredObjects.map((obj, idx) => (
                  <ObjectCard key={obj.id || idx} object={obj} index={idx} />
                ))}
              </div>
            ) : (
              <ObjectTable objects={filteredObjects} />
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
