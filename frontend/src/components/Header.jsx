import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Wifi, Activity, Cpu, Layers, UserPlus } from 'lucide-react';

export default function Header({ screeningResult, activeTab, setActiveTab, onOpenNewPassengerModal }) {
  const [time, setTime] = useState(new Date());
  const [scanCount] = useState(1247);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hasCriticalAlert = screeningResult?.watchlist_screening?.flagged ||
    screeningResult?.risk_assessment?.risk_tier === "CRITICAL";

  const tabs = [
    { id: 'overview',   label: 'Overview HUD',    icon: Layers },
    { id: 'forensics',  label: 'Forensics Studio', icon: Activity },
    { id: 'mrz',        label: 'MRZ & Validation', icon: Cpu },
    { id: 'biometrics', label: 'Biometrics',       icon: Wifi },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07]"
      style={{ background: 'rgba(4,8,16,0.85)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)' }}
    >
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 pulse-ring" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-white">AegisBorder AI</h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-mono font-bold tracking-widest">
                SMART BORDER OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>Automated Doc & Biometric Screener</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                GATE-14 / DEL IGI
              </span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl border border-white/[0.08]"
          style={{ background: 'rgba(4,8,22,0.70)', backdropFilter: 'blur(16px)' }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono transition-all duration-200 cursor-pointer ${
                activeTab === id
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-400/35 shadow shadow-cyan-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right: Actions + Status + Clock */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewPassengerModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold transition shadow-sm hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">+ New Passenger</span>
          </button>

          {hasCriticalAlert ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 animate-pulse font-mono font-bold text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              THREAT ACTIVE
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[10px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DEFENSE: ONLINE
            </div>
          )}

          <div className="text-right hidden sm:block">
            <div className="font-mono text-slate-200 font-bold tracking-wider text-sm">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              SCANS: <span className="text-cyan-400 font-bold">{(scanCount + Math.floor(Math.random() * 3)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
