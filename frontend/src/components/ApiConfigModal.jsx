import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Save, Check, RefreshCw } from 'lucide-react';
import { getLocalApiKey, setLocalApiKey } from '../services/api';

export default function ApiConfigModal({ isOpen, onClose, systemStatus, onStatusRefresh }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getLocalApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setLocalApiKey(apiKeyInput.trim());
    setSavedSuccess(true);
    if (onStatusRefresh) onStatusRefresh();
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const handleClear = () => {
    setLocalApiKey('');
    setApiKeyInput('');
    if (onStatusRefresh) onStatusRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">AI Vision Settings</h3>
              <p className="text-xs text-slate-400">OpenRouter Multimodal Integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Status info box */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Backend API Key:</span>
              <span className={`font-medium ${systemStatus?.apiKeyConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {systemStatus?.apiKeyConfigured ? 'Configured (via Backend Env)' : 'Not Set in Env'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Vision AI Model:</span>
              <span className="font-mono text-indigo-300">{systemStatus?.defaultModel || 'openrouter/free'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Database Engine:</span>
              <span className="font-mono text-cyan-300">MySQL (Profile: {systemStatus?.activeProfile || 'mysql'})</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                OpenRouter API Key Override (Optional UI Override)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                You can set <code className="text-indigo-300">OPENROUTER_API_KEY</code> on your backend server or paste your key here. The key is stored securely in your browser and passed only to your Spring Boot backend.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Key</span>
                    </>
                  )}
                </button>

                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    Clear Override
                  </button>
                )}
              </div>

              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                <span>Get OpenRouter Key</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </form>

          {/* Security Banner */}
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-indigo-300/90">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              Your key communicates directly through your local Spring Boot backend. No third-party tracking or intermediaries.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
