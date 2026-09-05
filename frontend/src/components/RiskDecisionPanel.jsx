import React from 'react';
import { Award, FileCheck, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, Lock } from 'lucide-react';

export default function RiskDecisionPanel({
  riskAssessment,
  _auditReport,
  onOpenAuditModal,
  onTakeAction
}) {
  const score = riskAssessment?.overall_risk_score || 0;
  const tier = riskAssessment?.risk_tier || "LOW";
  const decision = riskAssessment?.recommended_decision || "GRANT ENTRY";
  const actionSummary = riskAssessment?.action_summary;
  const factors = riskAssessment?.risk_factors || [];
  const components = riskAssessment?.component_scores || {};

  const tierConfig = {
    LOW:      { badgeCls: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300', gaugeCls: 'text-emerald-400', bannerCls: 'from-emerald-950/50 to-slate-950/90 border-emerald-500/35', glowCls: 'glow-emerald', dotColor: '#34d399' },
    MODERATE: { badgeCls: 'bg-amber-950/60 border-amber-500/50 text-amber-200',       gaugeCls: 'text-amber-400',   bannerCls: 'from-amber-950/50 to-slate-950/90 border-amber-500/35',   glowCls: 'glow-amber',   dotColor: '#fbbf24' },
    HIGH:     { badgeCls: 'bg-orange-950/60 border-orange-500/50 text-orange-200',     gaugeCls: 'text-orange-500',  bannerCls: 'from-orange-950/50 to-slate-950/90 border-orange-500/40', glowCls: 'glow-amber',   dotColor: '#f97316' },
    CRITICAL: { badgeCls: 'bg-rose-950/80 border-rose-500/70 text-rose-200 animate-pulse shadow-rose-500/30', gaugeCls: 'text-rose-500', bannerCls: 'from-rose-950/70 to-slate-950/90 border-rose-500/60', glowCls: 'glow-rose', dotColor: '#fb7185' },
  };
  const cfg = tierConfig[tier] || tierConfig.LOW;

  const compBars = [
    { label: 'MRZ Checksums',   key: 'integrity_risk',          color: 'bg-cyan-500',    text: 'text-cyan-400'   },
    { label: 'Tamper Forensics', key: 'forensic_tamper_risk',   color: 'bg-rose-500',    text: 'text-rose-400'   },
    { label: 'Face Biometrics', key: 'biometric_mismatch_risk', color: 'bg-indigo-500',  text: 'text-indigo-400' },
    { label: 'Watchlist Lookup', key: 'watchlist_risk',          color: 'bg-amber-500',   text: 'text-amber-400'  },
  ];

  return (
    <div className={`glass-card rounded-2xl p-5 border border-white/[0.08] shadow-2xl flex flex-col gap-5 relative ${cfg.glowCls}`}>
      {/* Ambient corner glow */}
      <div className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 ${
        tier === 'CRITICAL' ? 'bg-rose-600/20' : tier === 'HIGH' ? 'bg-orange-600/15' : tier === 'MODERATE' ? 'bg-amber-600/12' : 'bg-cyan-600/10'
      }`} />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Automated Risk Scoring & Checkpoint Decision Console
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Unified 0–100% Bayesian risk index aggregating MRZ, forensics, biometrics & Interpol data
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuditModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-400/30 transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileCheck className="w-3.5 h-3.5" />
          Audit Certificate
        </button>
      </div>

      {/* Risk Banner */}
      <div className={`relative p-5 rounded-2xl border bg-gradient-to-r ${cfg.bannerCls} flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl overflow-hidden z-10`}>
        {/* Subtle radial inside */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />

        <div className="flex items-center gap-5">
          {/* SVG Gauge */}
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-900/90" strokeWidth="3.5" stroke="currentColor" fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path
                className={cfg.gaugeCls}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{ filter: `drop-shadow(0 0 6px ${cfg.dotColor}60)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-mono text-white leading-none">{score}%</span>
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-widest">RISK</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-0.5">
              Threat Classification
            </div>
            <div className="text-2xl font-black font-mono text-white tracking-wide leading-tight flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${cfg.gaugeCls}`} />
              {tier} PROFILE
            </div>
            <div className="text-xs text-slate-300 mt-1.5 max-w-sm font-medium leading-relaxed">
              {actionSummary}
            </div>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 font-bold">
            Mandated Directive
          </div>
          <div className={`px-5 py-3 rounded-xl border text-sm font-black font-mono uppercase tracking-wider shadow-xl ${cfg.badgeCls}`}>
            {decision}
          </div>
        </div>
      </div>

      {/* Component Risk Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 z-10 relative">
        {compBars.map(({ label, key, color, text }) => {
          const val = components[key] || 0;
          return (
            <div key={key} className="glass-deep rounded-xl p-3.5 border border-white/[0.06]">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">
                <span>{label}</span>
                <span className={text}>{val}%</span>
              </div>
              <div className="w-full bg-slate-900/80 rounded-full h-[4px] overflow-hidden">
                <div className={`bar-fill ${color} h-full rounded-full`} style={{ width: `${val}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Factors List */}
      {factors.length > 0 && (
        <div className="glass-deep border border-rose-500/20 rounded-xl p-4 shadow-lg relative z-10">
          <span className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Identified Threat Vectors ({factors.length})
          </span>
          <div className="space-y-1.5">
            {factors.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-900/50 border border-rose-500/15 rounded-lg px-3.5 py-2 text-xs font-mono hover:border-rose-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span className="font-bold text-rose-300">[{f.module}]</span>
                  <span className="text-slate-300">{f.description}</span>
                </div>
                <span className="text-[10px] font-mono font-black text-rose-400 ml-2 shrink-0 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25">
                  {f.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Officer Action Dispatch */}
      <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 relative z-10">
        <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-cyan-400" />
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          Dispatch Border Protocol:
        </span>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onTakeAction("GRANT_ENTRY")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98]"
          >
            ✓ GRANT ENTRY & STAMP
          </button>
          <button
            onClick={() => onTakeAction("SECONDARY_INSPECTION")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-amber-600/25 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98]"
          >
            ⚠ SECONDARY INSPECTION
          </button>
          <button
            onClick={() => onTakeAction("DETAIN_SUBJECT")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-rose-600/30 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            🚨 DETAIN & CONFISCATE
          </button>
        </div>
      </div>
    </div>
  );
}



