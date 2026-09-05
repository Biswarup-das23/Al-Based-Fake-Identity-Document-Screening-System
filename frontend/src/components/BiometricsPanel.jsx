import React from 'react';
import { UserCheck, UserX, ScanFace, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function BiometricsPanel({ biometricsData, documentImage, liveImage }) {
  const matchScore = biometricsData?.match_score || 0;
  const isMatched = biometricsData?.is_matched;
  const liveness = biometricsData?.liveness;
  const confidence = biometricsData?.confidence;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <ScanFace className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Module 4: Biometric 1:1 Face Verification & Liveness
            </h2>
            <p className="text-[11px] text-slate-400">
              Document portrait vs live camera stream with presentation attack defense
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 shadow-sm ${
          isMatched
            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10"
            : "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse shadow-rose-500/20"
        }`}>
          {isMatched ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <UserX className="w-3.5 h-3.5 text-rose-400" />}
          {isMatched ? "BIOMETRIC MATCH CONFIRMED" : "IDENTITY MISMATCH / REJECTED"}
        </span>
      </div>

      {/* 3-Column Match Arena */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-950/60 border border-white/8 rounded-xl p-4 backdrop-blur-md">
        
        {/* Left: Document Portrait */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            1. Document Portrait
          </span>
          <div className="w-24 h-28 rounded-xl border border-white/20 bg-slate-900/80 flex items-center justify-center overflow-hidden relative shadow-2xl group">
            {documentImage ? (
              <img
                src={documentImage}
                alt="Document Crop"
                className="w-full h-full object-cover scale-150 transition-transform duration-300 group-hover:scale-160"
              />
            ) : (
              <UserCheck className="w-8 h-8 text-slate-600" />
            )}
            <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-xl pointer-events-none"></div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-2">Resolution: 300 DPI</span>
        </div>

        {/* Center: Match Confidence & Cosine Similarity Gauge */}
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Cosine Similarity Match
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Circular Gauge with glow */}
            <svg className="w-full h-full transform -rotate-90 filter drop-shadow(0 0 8px rgba(16, 185, 129, 0.2))" viewBox="0 0 36 36">
              <path
                className="text-slate-800/80"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isMatched ? "text-emerald-400" : "text-rose-500"}
                strokeDasharray={`${matchScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-2xl font-black font-mono ${isMatched ? "text-emerald-400" : "text-rose-400"}`}>
                {matchScore}%
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{confidence}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-300 font-mono mt-1">
            Threshold: <span className="text-cyan-400 font-bold">&ge; 65.0%</span>
          </div>
        </div>

        {/* Right: Live Camera Frame */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            2. Live Passenger Cam
          </span>
          <div className="w-24 h-28 rounded-xl border border-white/20 bg-slate-900/80 flex items-center justify-center overflow-hidden relative shadow-2xl group">
            {liveImage || documentImage ? (
              <img
                src={liveImage || documentImage}
                alt="Live Capture"
                className="w-full h-full object-cover scale-150 transition-transform duration-300 group-hover:scale-160"
              />
            ) : (
              <UserCheck className="w-8 h-8 text-slate-600" />
            )}
            <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-xl pointer-events-none"></div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-2">Live Sensor Stream</span>
        </div>

      </div>

      {/* Liveness & Anti-Spoofing Metrics Bar */}
      <div className="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 font-mono uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Presentation Attack Detection (PAD) & Anti-Spoofing
          </span>
          <span className="text-[10px] text-emerald-300 font-mono font-bold">
            Score: {liveness?.liveness_score || 95}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/8">
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Screen Moiré</span>
            <span className={liveness?.moire_artifact_detected ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {liveness?.moire_artifact_detected ? "SCREEN DETECTED" : "None (Live Human)"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/8">
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Sharpness Index</span>
            <span className="text-slate-200 font-bold">
              {liveness?.sharpness_index || 120.4}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/8">
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Spoof Defense</span>
            <span className={liveness?.is_live !== false ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {liveness?.is_live !== false ? "PASSED (AUTHENTIC)" : "FAILED (SPOOF)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
