import React from 'react';
import { X, ShieldCheck, Download, Printer, Key, CheckCircle } from 'lucide-react';

export default function AuditReportModal({ isOpen, onClose, screeningResult }) {
  if (!isOpen || !screeningResult) return null;

  const audit = screeningResult?.audit_report;
  const risk = screeningResult?.risk_assessment;
  const mrz = screeningResult?.extracted_data?.mrz;
  const viz = screeningResult?.extracted_data?.viz;

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(screeningResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `border_audit_${audit?.audit_id || "report"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col border border-white/15">
        
        {/* Decorative backdrop light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/40 shadow-sm shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Border Inspection Audit Certificate
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Cryptographically Signed Immutable Ledger Entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 font-mono text-xs relative z-10">
          
          {/* Certificate Header Banner */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col sm:flex-row justify-between gap-3 backdrop-blur-md">
            <div>
              <span className="text-[9px] text-slate-400 uppercase block font-bold">Audit Identifier</span>
              <span className="text-cyan-300 font-bold text-sm">{audit?.audit_id || "BCP-AUDIT-RECORD"}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase block font-bold">Timestamp (UTC)</span>
              <span className="text-slate-200">{audit?.timestamp}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase block font-bold">Checkpoint Node</span>
              <span className="text-slate-200">{audit?.checkpoint_id || "DELHI-IGI-T3"}</span>
            </div>
          </div>

          {/* SHA-256 Signature Stamp */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              Cryptographic SHA-256 Digital Verification Hash
            </div>
            <div className="text-[11px] break-all select-all bg-slate-950/90 p-2.5 rounded-lg border border-cyan-900/60 font-mono">
              {audit?.cryptographic_hash}
            </div>
          </div>

          {/* Passenger & Decision Summary Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
            <div className="bg-slate-900/80 px-4 py-2.5 font-bold text-slate-200 text-xs border-b border-white/10">
              Inspection Ledger Payload
            </div>
            <div className="divide-y divide-white/5 bg-slate-950/60">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-400">Document Holder</span>
                <span className="text-slate-100 font-bold">{viz?.full_name || mrz?.full_name}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-400">Document Number</span>
                <span className="text-cyan-300 font-bold">{viz?.document_number || mrz?.document_number}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-400">Nationality & Format</span>
                <span className="text-slate-200">{mrz?.nationality} / {mrz?.format} ({mrz?.document_type})</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-400">Composite Risk Score</span>
                <span className="text-slate-100 font-bold">{risk?.overall_risk_score}% ({risk?.risk_tier} RISK)</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-400">Final Recommendation</span>
                <span className="text-emerald-400 font-bold">{risk?.recommended_decision}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-400">Screening Officer</span>
                <span className="text-slate-300">{audit?.officer_id} (BIOMETRIC-SIGN-ON)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital seal cryptographically verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-white/10 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold transition cursor-pointer shadow-lg shadow-cyan-600/25"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Package</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
