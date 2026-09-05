import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, RefreshCw, Scan, FileText, CheckCircle2, Video, Sparkles } from 'lucide-react';

export default function DocumentIngestion({
  documentImage,
  setDocumentImage,
  liveImage,
  setLiveImage,
  mrzText,
  setMrzText,
  onRunScreening,
  isLoading
}) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch {
      setCameraError("Camera permission denied or device not found. You can upload an image.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const b64 = canvas.toDataURL("image/jpeg", 0.9);
      setLiveImage(b64);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Scan className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Document Ingestion & Live Sensor Feed
            </h2>
            <p className="text-[11px] text-slate-400">
              Module 1: Dual-channel document scanning and facial camera capture
            </p>
          </div>
        </div>

        <button
          onClick={onRunScreening}
          disabled={isLoading || !documentImage}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Vectors...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Forensic Screening</span>
            </>
          )}
        </button>
      </div>

      {/* Dual Screen: Document Scan + Live Passenger Camera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Document Ingestion Box */}
        <div className="flex flex-col bg-slate-950/60 border border-white/8 rounded-xl p-3.5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Document Scan
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-mono transition cursor-pointer px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20"
            >
              <UploadCloud className="w-3.5 h-3.5" /> Upload File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="relative flex-1 min-h-[200px] rounded-lg border border-dashed border-white/10 bg-slate-900/30 flex items-center justify-center overflow-hidden">
            {documentImage ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={documentImage}
                  alt="Scanned Document"
                  className="max-h-[200px] w-auto object-contain rounded-md shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="animate-scan-line"></div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur text-cyan-300 border border-cyan-400/30 text-[9px] font-mono tracking-wider">
                  SCANNER OPTIC READY
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">Select a preset above</p>
                <p className="text-[11px] text-slate-400">or click Upload to scan custom document</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Passenger Camera Stream Box */}
        <div className="flex flex-col bg-slate-950/60 border border-white/8 rounded-xl p-3.5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              Live Passenger Cam
            </span>
            <div className="flex items-center gap-2">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="text-[11px] text-emerald-300 hover:text-emerald-200 flex items-center gap-1 font-mono transition cursor-pointer px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/20"
                >
                  <Video className="w-3.5 h-3.5" /> Start Webcam
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={captureSnapshot}
                    className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded font-mono transition cursor-pointer shadow"
                  >
                    Snap Frame
                  </button>
                  <button
                    onClick={stopCamera}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="relative flex-1 min-h-[200px] rounded-lg border border-dashed border-white/10 bg-slate-900/30 flex items-center justify-center overflow-hidden">
            {isCameraActive ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[200px] object-cover rounded-md"
                />
                <div className="absolute inset-0 border border-emerald-400/40 pointer-events-none rounded-md flex items-center justify-center">
                  <div className="w-28 h-36 border-2 border-dashed border-emerald-400/90 rounded-full animate-pulse shadow-lg shadow-emerald-500/20"></div>
                </div>
              </div>
            ) : liveImage ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={liveImage}
                  alt="Live Passenger"
                  className="max-h-[200px] w-auto object-contain rounded-md shadow-2xl"
                />
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur text-emerald-400 border border-emerald-500/30 text-[9px] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> LIVE BIO CONFIRMED
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">Passenger Camera</p>
                <p className="text-[11px] text-slate-400">Auto-links to sample avatar or webcam</p>
                {cameraError && (
                  <p className="text-[11px] text-amber-400 mt-2">{cameraError}</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Raw MRZ text bar */}
      <div className="bg-slate-950/70 border border-white/8 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Encoded Machine Readable Zone (MRZ String)
          </label>
          <span className="text-[10px] text-slate-400 font-mono">ICAO 9303 Compliant</span>
        </div>
        <textarea
          rows={2}
          value={mrzText || ""}
          onChange={(e) => setMrzText(e.target.value)}
          placeholder="MRZ Line 1\nMRZ Line 2"
          className="w-full bg-slate-900/60 border border-white/10 rounded-lg p-2.5 font-mono text-xs text-cyan-300 tracking-wider focus:outline-none focus:border-cyan-400/60 transition resize-none"
        />
      </div>
    </div>
  );
}
