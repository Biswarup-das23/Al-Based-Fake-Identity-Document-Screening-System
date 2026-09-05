import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet, Hash } from 'lucide-react';

export default function MRZTerminal({ extractedData, validationData, watchlistData }) {
  const mrz = extractedData?.mrz;
  const viz = extractedData?.viz;
  const checksums = mrz?.checksums;
  const discrepancies = validationData?.discrepancies || [];

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Module 1 & 2: ICAO 9303 MRZ Extraction & Cross-Field Validation
            </h2>
            <p className="text-[11px] text-slate-400">
              Dual-zone OCR text alignment, 7-3-1 weight check digit verification, and Interpol screening
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 shadow-sm ${
            validationData?.is_valid 
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10" 
              : "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse shadow-rose-500/20"
          }`}>
            {validationData?.is_valid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
            {validationData?.is_valid ? "CHECKSUMS & INTEGRITY VERIFIED" : "DISCREPANCIES DETECTED"}
          </span>
        </div>
      </div>

      {/* Extracted Fields Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Holder Full Name</span>
          <span className="text-xs font-bold text-slate-100 font-mono line-clamp-1">
            {viz?.full_name || mrz?.full_name || "—"}
          </span>
        </div>

        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Document Number</span>
          <span className="text-xs font-bold text-cyan-300 font-mono">
            {viz?.document_number || mrz?.document_number || "—"}
          </span>
        </div>

        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Nationality / State</span>
          <span className="text-xs font-bold text-slate-100 font-mono">
            {viz?.nationality || mrz?.nationality || "—"} ({mrz?.issuing_country || "—"})
          </span>
        </div>

        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Date of Birth</span>
          <span className="text-xs font-bold text-slate-100 font-mono">
            {viz?.date_of_birth || mrz?.date_of_birth || "—"}
          </span>
        </div>

        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Expiration Status</span>
          <span className={`text-xs font-bold font-mono ${
            validationData?.is_expired ? "text-rose-400" : "text-emerald-400"
          }`}>
            {viz?.date_of_expiry || mrz?.date_of_expiry || "—"}
            {validationData?.is_expired ? " [EXPIRED]" : " [VALID]"}
          </span>
        </div>

        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Sex / Gender</span>
          <span className="text-xs font-bold text-slate-100 font-mono">
            {viz?.gender || mrz?.sex || "—"}
          </span>
        </div>

        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Standard Spec</span>
          <span className="text-xs font-bold text-indigo-300 font-mono">
            ICAO Doc 9303 ({mrz?.format || "TD3"})
          </span>
        </div>

        <div className="bg-slate-950/60 border border-white/8 rounded-xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Document Category</span>
          <span className="text-xs font-bold text-slate-100 font-mono">
            {mrz?.document_type || "Passport"} ({mrz?.document_code || "P"})
          </span>
        </div>
      </div>

      {/* ICAO 9303 Checksum Validation Strip */}
      {checksums && (
        <div className="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 font-mono uppercase">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              ICAO 9303 7-3-1 Weighting Check Digit Integrity
            </span>
            <span className="text-[10px] text-cyan-300/80 font-mono">Algorithm: &sum;(c_i &times; w_i) mod 10</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.entries(checksums).map(([key, val]) => {
              if (key === "overall_valid" || typeof val !== 'object') return null;
              const isValid = val?.valid;
              return (
                <div key={key} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                  isValid 
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10" 
                    : "bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-500/20"
                }`}>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="font-bold">
                      Extracted: {val.extracted} | Calc: {val.calculated}
                    </span>
                  </div>
                  {isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Discrepancies Matrix & Alerts */}
      {discrepancies.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-3.5 shadow-lg shadow-rose-500/10">
          <div className="flex items-center gap-2 mb-2 text-rose-300 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Document Integrity Violations Detected ({discrepancies.length})</span>
          </div>
          <div className="space-y-2">
            {discrepancies.map((d, idx) => (
              <div key={idx} className="flex items-start justify-between bg-slate-950/70 border border-rose-500/30 rounded-lg p-2.5 text-xs font-mono">
                <div>
                  <span className="font-bold text-rose-300 mr-2">[{d.field}]</span>
                  <span className="text-slate-200">{d.description}</span>
                </div>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold ml-2 shrink-0 border border-rose-500/30">
                  {d.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interpol & Watchlist Status */}
      {watchlistData?.flagged && (
        <div className="bg-red-950/50 border-2 border-red-500/80 rounded-xl p-4 shadow-xl shadow-red-500/20 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>INTERPOL RED NOTICE / BORDER WATCHLIST MATCH — {watchlistData.highest_severity}</span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-red-500 text-white font-extrabold tracking-wider">
              DETAIN INDIVIDUAL
            </span>
          </div>
          {watchlistData.alerts.map((a, idx) => (
            <div key={idx} className="text-xs text-slate-100 font-mono">
              <div className="font-bold text-red-300">{a.alert_type}: {a.reason}</div>
              <div className="text-[11px] text-slate-400 mt-1">Enforcement Protocol: <span className="text-red-400 font-bold">{a.action_required}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
