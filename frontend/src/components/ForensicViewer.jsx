import React, { useState } from 'react';
import { Eye, Flame, Activity, Layers, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ForensicViewer({ forensicsData }) {
  const [activeTab, setActiveTab] = useState('ela'); // 'original', 'ela', 'noise', 'edge'
  const summary = forensicsData?.summary;
  const visuals = forensicsData?.visuals;

  const currentImage = 
    activeTab === 'original' ? visuals?.original :
    activeTab === 'ela' ? visuals?.ela_heatmap :
    activeTab === 'noise' ? visuals?.noise_map : visuals?.edge_gradient_map;

  const isTampered = (summary?.photo_tamper_score || 0) > 60 || (summary?.ela_score || 0) > 65;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
        isTampered ? "bg-rose-500/10" : "bg-cyan-500/10"
      }`}></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Module 3: Advanced Tampering Forensics Suite
            </h2>
            <p className="text-[11px] text-slate-400">
              Multi-spectral pixel compression differentials & photo replacement boundary scanner
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-3.5 py-1 rounded-full font-bold border flex items-center gap-1.5 shadow-sm ${
            isTampered 
              ? "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse shadow-rose-500/20" 
              : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10"
          }`}>
            {isTampered ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {isTampered ? "DIGITAL / PHYSICAL FORGERY DETECTED" : "COMPRESSION & SENSOR NOISE UNIFORM"}
          </span>
        </div>
      </div>

      {/* Forensic Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        
        {/* ELA Score */}
        <div className={`p-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 font-mono ${
          (summary?.ela_score || 0) > 60 
            ? "bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-500/10" 
            : "bg-slate-950/60 border-white/8"
        }`}>
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase mb-1">
            <span>ELA Compression</span>
            <Flame className={`w-3.5 h-3.5 ${(summary?.ela_score || 0) > 60 ? "text-rose-400 animate-bounce" : "text-slate-500"}`} />
          </div>
          <div className={`text-xl font-black ${(summary?.ela_score || 0) > 60 ? "text-rose-400" : "text-cyan-400"}`}>
            {summary?.ela_score || 0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {(summary?.ela_score || 0) > 60 ? "Splicing Artifacts Present" : "Uniform Compression"}
          </div>
        </div>

        {/* Photo Tamper Score */}
        <div className={`p-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 font-mono ${
          (summary?.photo_tamper_score || 0) > 60 
            ? "bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-500/10" 
            : "bg-slate-950/60 border-white/8"
        }`}>
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase mb-1">
            <span>Photo Replacement</span>
            <Eye className={`w-3.5 h-3.5 ${(summary?.photo_tamper_score || 0) > 60 ? "text-rose-400" : "text-slate-500"}`} />
          </div>
          <div className={`text-xl font-black ${(summary?.photo_tamper_score || 0) > 60 ? "text-rose-400" : "text-cyan-400"}`}>
            {summary?.photo_tamper_score || 0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary?.is_photo_tampered ? "Border Discontinuity" : "Border Blended Natural"}
          </div>
        </div>

        {/* Noise Inconsistency */}
        <div className="p-3.5 rounded-xl border border-white/8 bg-slate-950/60 font-mono backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase mb-1">
            <span>Sensor Noise Grain</span>
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-cyan-400">
            {summary?.noise_discrepancy_score || 0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary?.noise_anomalies_count || 0} Inconsistency Blocks
          </div>
        </div>

        {/* Metadata & Software Signature */}
        <div className={`p-3.5 rounded-xl border backdrop-blur-md font-mono ${
          summary?.detected_software 
            ? "bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-500/10" 
            : "bg-slate-950/60 border-white/8"
        }`}>
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase mb-1">
            <span>EXIF Metadata Tag</span>
            <Info className={`w-3.5 h-3.5 ${summary?.detected_software ? "text-amber-400" : "text-slate-500"}`} />
          </div>
          <div className={`text-sm font-bold truncate ${summary?.detected_software ? "text-amber-300" : "text-slate-300"}`}>
            {summary?.detected_software || "Native Camera Sensor"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary?.detected_software ? "Digital Editor Signature" : "No Editing Flag"}
          </div>
        </div>
      </div>

      {/* Layer View Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-md relative z-10">
        <button
          onClick={() => setActiveTab('ela')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ela'
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          1. ELA Thermal Heatmap (Error Level Analysis)
        </button>

        <button
          onClick={() => setActiveTab('edge')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'edge'
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-yellow-400" />
          2. Edge Splicing & Portrait Boundary
        </button>

        <button
          onClick={() => setActiveTab('noise')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'noise'
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          3. Laplacian Noise Variance
        </button>

        <button
          onClick={() => setActiveTab('original')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'original'
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          4. Full Spectrum Scan
        </button>
      </div>

      {/* Main Forensic Viewport Canvas */}
      <div className="relative w-full min-h-[300px] sm:min-h-[360px] bg-slate-950/90 rounded-xl border border-white/10 flex items-center justify-center p-3 overflow-hidden shadow-inner relative z-10">
        {currentImage ? (
          <div className="relative max-w-full flex items-center justify-center group">
            <img
              src={currentImage}
              alt="Forensic Spectral View"
              className="max-h-[360px] w-auto object-contain rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
            />
            
            {/* Viewport HUD Overlay info */}
            <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              {activeTab === 'ela' && "SPECTRAL: ELA 90Q Differential Re-compression Heatmap"}
              {activeTab === 'edge' && "GRADIENT: Sobel Discontinuity & Portrait Boundary Perimeter"}
              {activeTab === 'noise' && "FREQUENCY: Laplacian High-Frequency Noise Variance Map"}
              {activeTab === 'original' && "RAW SCAN: Full Spectrum Unfiltered Input"}
            </div>

            {/* Suspicious Anomaly Bounding Boxes count if any */}
            {(summary?.suspicious_bboxes?.length || 0) > 0 && activeTab === 'ela' && (
              <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-rose-950/90 backdrop-blur-md border border-rose-500/50 text-[10px] font-mono text-rose-300 flex items-center gap-1.5 shadow-lg animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                {summary.suspicious_bboxes.length} High-Error Splicing Regions Detected
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-xs font-mono">No document scan loaded for forensic inspection.</div>
        )}
      </div>

      {/* Forensic Findings Explanation Banner */}
      <div className="bg-slate-950/70 border border-white/8 rounded-xl p-3.5 text-xs text-slate-300 font-mono relative z-10">
        <span className="text-cyan-400 font-bold mr-2">FORENSIC RADAR ANALYSIS:</span>
        {activeTab === 'ela' && (
          <span>Error Level Analysis (ELA) identifies re-compression discrepancies. Digitally modified text, spliced passport portraits, or inserted stamps show up as bright, localized thermal anomalies (Yellow/Red) against darker uniform backgrounds.</span>
        )}
        {activeTab === 'edge' && (
          <span>Boundary gradient analysis calculates edge sharpness along avatar borders. Unnatural sharp step discontinuities (gradient &gt; 65.0) indicate physical photo replacement or digital pasting over the security pattern.</span>
        )}
        {activeTab === 'noise' && (
          <span>Laplacian variance maps sensor noise consistency across 32x32 pixel blocks. Manipulated blocks display mismatched CCD sensor grain signatures from external image sources.</span>
        )}
        {activeTab === 'original' && (
          <span>Raw document visual examination for security guilloché patterns, fine-line typography, and micro-print authenticity.</span>
        )}
      </div>
    </div>
  );
}
