import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import CameraCapture from './components/CameraCapture';
import LoadingState from './components/LoadingState';
import AnalysisDashboard from './components/AnalysisDashboard';
import HistorySidebar from './components/HistorySidebar';
import ApiConfigModal from './components/ApiConfigModal';
import {
  getSystemStatus,
  uploadAndAnalyze,
  captureAndAnalyze,
  getHistory,
  deleteAnalysis
} from './services/api';
import { Sparkles, Camera, UploadCloud, AlertCircle, RefreshCw, Key, CheckCircle2 } from 'lucide-react';
import useTheme from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera'
  const [selectedImage, setSelectedImage] = useState(null); // { file, imageBase64, previewUrl, name, source }
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Initial load: Fetch system configuration and history
  useEffect(() => {
    loadSystemStatus();
    loadHistoryList();
  }, []);

  const loadSystemStatus = async () => {
    try {
      const status = await getSystemStatus();
      setSystemStatus(status);
    } catch (err) {
      console.warn('Backend not yet reachable:', err.message);
    }
  };

  const loadHistoryList = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.warn('Could not load history:', err.message);
    }
  };

  // Trigger analysis for an uploaded or selected image
  const handleAnalyze = async (imgData = selectedImage) => {
    if (!imgData) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let result;
      if (imgData.source === 'camera' || imgData.imageBase64) {
        result = await captureAndAnalyze(imgData.imageBase64, imgData.name);
      } else if (imgData.file) {
        result = await uploadAndAnalyze(imgData.file);
      }

      setCurrentAnalysis(result);
      loadHistoryList();
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during image analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Called when user selects or drops an image
  const handleImageSelected = (imageData) => {
    setSelectedImage(imageData);
    setErrorMessage(null);
    // Automatically start analysis for snappy UX
    handleAnalyze(imageData);
  };

  // Called when user snaps a camera shot
  const handleCameraCapture = (captureData) => {
    setSelectedImage(captureData);
    setActiveTab('upload');
    handleAnalyze(captureData);
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setSelectedImage(null);
    setErrorMessage(null);
    setActiveTab('upload');
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteAnalysis(id);
      loadHistoryList();
      if (currentAnalysis?.id === id) {
        handleReset();
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleSelectHistoryItem = (record) => {
    setCurrentAnalysis(record);
    setSelectedImage({
      previewUrl: record.imageUrl,
      name: record.originalFileName,
      source: 'history'
    });
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">

      {/* Navbar */}
      <Navbar
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        systemStatus={systemStatus}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-shake">
            <div className="flex items-start sm:items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h4 className="text-sm font-semibold text-rose-200">Analysis Failed</h4>
                <p className="text-xs text-rose-300/90">{errorMessage}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {errorMessage.toLowerCase().includes('key') && (
                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Enter API Key</span>
                </button>
              )}
              {selectedImage && (
                <button
                  onClick={() => handleAnalyze()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ACTIVE VIEW STATES: LOADING | DASHBOARD | INPUT UPLOADER       */}
        {/* ============================================================== */}
        {isLoading ? (
          <LoadingState previewUrl={selectedImage?.previewUrl} />
        ) : currentAnalysis ? (
          <AnalysisDashboard
            analysis={currentAnalysis}
            onReset={handleReset}
          />
        ) : (
          <div className="space-y-10">
            
            {/* Hero Greeting & Explanation */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen Visual Intelligence</span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                AI Physical Object & <br />
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                  Condition Recognition
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Upload or capture any photo. ImageReco identifies every visible physical object, provides an accurate count, analyzes condition/quality, and details exact quantities.
              </p>
            </div>

            {/* Input Selection Tabs: Upload vs Camera */}
            <div className="max-w-xl mx-auto flex items-center justify-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Image File</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'camera'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Live Camera Snap</span>
              </button>
            </div>

            {/* Content for chosen tab */}
            <div className="max-w-3xl mx-auto">
              {activeTab === 'upload' ? (
                <ImageUploader
                  onImageSelected={handleImageSelected}
                  onSwitchToCamera={() => setActiveTab('camera')}
                  isLoading={isLoading}
                />
              ) : (
                <CameraCapture
                  onCapture={handleCameraCapture}
                  onCancel={() => setActiveTab('upload')}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-800/80 max-w-5xl mx-auto">
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-display font-semibold text-white text-sm">Total Count & Catalog</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculates total physical objects first, then organizes every detected item with unique IDs and categories.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-display font-semibold text-white text-sm">Condition & Quality Evaluation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Examines surface condition, wear, and physical status (e.g. Pristine, Like New, Good, Aged, Damaged).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-display font-semibold text-white text-sm">MySQL Persistence & History</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every analysis and uploaded asset is persisted to MySQL via Spring Data JPA for review and audit anytime.
                </p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ImageReco. Full-Stack AI Image Analysis Web Application.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Spring Boot 3.3</span>
            <span>•</span>
            <span>React & Tailwind CSS</span>
            <span>•</span>
            <span>OpenRouter Vision AI</span>
            <span>•</span>
            <span>MySQL</span>
          </div>
        </div>
      </footer>

      {/* Slide-over History Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectRecord={handleSelectHistoryItem}
        onDeleteRecord={handleDeleteHistory}
      />

      {/* API Key / Configuration Modal */}
      <ApiConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        systemStatus={systemStatus}
        onStatusRefresh={loadSystemStatus}
      />

    </div>
  );
}
