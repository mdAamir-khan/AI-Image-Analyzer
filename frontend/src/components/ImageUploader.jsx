import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, AlertCircle, FileUp, Zap } from 'lucide-react';

// Curated high-quality demo images that test diverse objects & conditions
const SAMPLE_PRESETS = [
  {
    name: "Work Desk & Gadgets",
    desc: "Electronics, mug, notebook",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Fresh Fruit Basket",
    desc: "Apples, bananas, citrus",
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Vintage Tools & Workshop",
    desc: "Wrenches, hammer, weathered metal",
    url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Living Room Decor",
    desc: "Sofa, lamp, potted plant",
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
  }
];

export default function ImageUploader({ onImageSelected, onSwitchToCamera, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  // Paste handler for convenience
  useEffect(() => {
    const handlePaste = (e) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          validateAndPassFile(blob);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const validateAndPassFile = (file) => {
    setValidationError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setValidationError('Image size exceeds 20MB limit. Please choose a smaller image.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onImageSelected({
      file,
      previewUrl,
      source: 'upload',
      name: file.name
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndPassFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndPassFile(files[0]);
    }
  };

  const handleSelectPreset = async (preset) => {
    if (isLoading) return;
    try {
      setValidationError(null);
      // Fetch image from URL and convert to File
      const response = await fetch(preset.url);
      const blob = await response.blob();
      const file = new File([blob], `${preset.name.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      validateAndPassFile(file);
    } catch (err) {
      setValidationError('Could not load sample image. Please try uploading your own image.');
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center overflow-hidden ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01] shadow-2xl shadow-cyan-500/20'
            : 'border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/70 hover:border-indigo-500/60'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
        />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600/30 via-slate-800 to-cyan-500/20 border border-slate-700 group-hover:border-indigo-400/60 group-hover:scale-105 transition-all shadow-xl">
            <UploadCloud className="w-10 h-10 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
            <div className="absolute -top-1.5 -right-1.5 p-1 bg-cyan-500 rounded-full text-slate-950">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-indigo-200 transition-colors">
              Drag & Drop your image here
            </h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              or <span className="text-cyan-400 font-semibold underline underline-offset-2">browse files</span> from your computer. You can also paste directly with <kbd className="px-1.5 py-0.5 text-xs bg-slate-800 text-slate-300 rounded border border-slate-700">Ctrl+V</kbd>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">JPEG, PNG, WebP</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Up to 20MB</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Object & Condition Detection</span>
          </div>

          {/* Quick Camera Switch Option */}
          <div className="pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToCamera();
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all shadow-sm"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Capture Live with Camera Instead</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation alert */}
      {validationError && (
        <div className="flex items-center space-x-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Preset sample testing buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center font-medium">
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Quick Demo Images (Instant Test):
          </span>
          <span className="text-[11px] text-slate-500">Click any card to analyze</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectPreset(preset)}
              className="group relative flex flex-col text-left p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all overflow-hidden"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-2 bg-slate-950">
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[10px] font-semibold text-white bg-indigo-600/90 px-1.5 py-0.5 rounded">
                    Test This
                  </span>
                </div>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                {preset.name}
              </h4>
              <p className="text-[10px] text-slate-500 truncate">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
