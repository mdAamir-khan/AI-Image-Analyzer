import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle, FlipHorizontal, Sparkles } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel, isLoading }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Default to rear camera if available
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsCameraReady(false);

    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let msg = 'Could not access camera. Please allow camera permissions in your browser.';
      if (err.name === 'NotAllowedError') {
        msg = 'Camera permission was denied. Please grant permission in your browser URL bar.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No video camera device was found on this system.';
      }
      setCameraError(msg);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const capturePhoto = () => {
    if (!videoRef.current || !isCameraReady || isLoading) return;

    // Visual camera shutter flash
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.92);

    stopCamera();
    onCapture({
      imageBase64: base64Data,
      previewUrl: base64Data,
      source: 'camera',
      name: `camera_capture_${Date.now()}.jpg`
    });
  };

  return (
    <div className="w-full relative rounded-3xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-2xl p-4 sm:p-6 animate-fade-in">
      
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">Live Camera Capture</h3>
            <p className="text-xs text-slate-400">Position objects in the frame and snap a photo</p>
          </div>
        </div>

        <button
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Close Camera"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video Viewport */}
      <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center">
        
        {/* Flash Effect */}
        {flash && (
          <div className="absolute inset-0 bg-white z-30 transition-opacity duration-200 pointer-events-none" />
        )}

        {/* Viewfinder crosshairs & reticle */}
        {isCameraReady && !cameraError && (
          <div className="absolute inset-6 pointer-events-none z-10 border border-dashed border-cyan-400/30 rounded-xl flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-cyan-400/50 rounded-full flex items-center justify-center animate-pulse-slow">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-cyan-300 font-mono">
              AI READY
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Loading Spinner */}
        {!isCameraReady && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-950 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="text-xs font-medium">Initializing camera stream...</span>
          </div>
        )}

        {/* Error State */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-400" />
            <p className="text-xs text-rose-300 max-w-sm">{cameraError}</p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={startCamera}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Retry Camera
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  onCancel();
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-xs text-white hover:bg-indigo-500 transition-colors"
              >
                Upload File Instead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="flex items-center justify-center space-x-4 mt-5">
        <button
          type="button"
          onClick={toggleFacingMode}
          disabled={!isCameraReady || isLoading}
          className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 disabled:opacity-50"
          title="Flip Camera (Front/Rear)"
        >
          <FlipHorizontal className="w-5 h-5" />
        </button>

        {/* Big Capture Button */}
        <button
          type="button"
          onClick={capturePhoto}
          disabled={!isCameraReady || isLoading}
          className="relative group p-4 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-xl shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Take Photo"
        >
          <div className="w-8 h-8 rounded-full border-2 border-white/80 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
        >
          Cancel
        </button>
      </div>

    </div>
  );
}
