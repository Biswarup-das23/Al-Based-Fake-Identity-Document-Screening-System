import React from 'react';
import { ShieldCheck, FileWarning, AlertOctagon, UserX, AlertTriangle, Sparkles, ChevronRight, Zap, UserPlus, Plus, Trash2 } from 'lucide-react';

const PRESET_META = {
  preset_genuine_passport:       { icon: ShieldCheck,   color: 'emerald', label: 'AUTHENTIC' },
  preset_photo_tampered:         { icon: FileWarning,   color: 'rose',    label: 'FORGERY'   },
  preset_forged_visa_checksum:   { icon: AlertTriangle, color: 'amber',   label: 'CHECKSUM'  },
  preset_dob_mismatch:           { icon: AlertOctagon,  color: 'orange',  label: 'MISMATCH'  },
  preset_interpol_blacklist:     { icon: UserX,         color: 'red',     label: 'WATCHLIST' },
};

const colorMap = {
  emerald: {
    badge:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
    icon:   'text-emerald-400',
    active: 'border-emerald-400/70 bg-emerald-950/35 shadow-lg shadow-emerald-500/12 ring-1 ring-emerald-500/25',
    glow:   'hover:shadow-emerald-500/10',
  },
  rose: {
    badge:  'bg-rose-500/15 text-rose-300 border-rose-500/35',
    icon:   'text-rose-400',
    active: 'border-rose-400/70 bg-rose-950/35 shadow-lg shadow-rose-500/12 ring-1 ring-rose-500/25',
    glow:   'hover:shadow-rose-500/10',
  },
  orange: {
    badge:  'bg-orange-500/15 text-orange-300 border-orange-500/35',
    icon:   'text-orange-400',
    active: 'border-orange-400/70 bg-orange-950/35 shadow-lg shadow-orange-500/12 ring-1 ring-orange-500/25',
    glow:   'hover:shadow-orange-500/10',
  },
  amber: {
    badge:  'bg-amber-500/15 text-amber-300 border-amber-500/35',
    icon:   'text-amber-400',
    active: 'border-amber-400/70 bg-amber-950/35 shadow-lg shadow-amber-500/12 ring-1 ring-amber-500/25',
    glow:   'hover:shadow-amber-500/10',
  },
  red: {
    badge:  'bg-red-500/15 text-red-300 border-red-500/35',
    icon:   'text-red-400',
    active: 'border-red-400/70 bg-red-950/35 shadow-lg shadow-red-500/15 ring-1 ring-red-500/30 animate-pulse',
    glow:   'hover:shadow-red-500/12',
  },
};

export default function PresetBar({
  presets,
  activePresetId,
  onSelectPreset,
  isLoading,
  onOpenNewPassengerModal,
  onDeletePassenger
}) {
  return (
    <div className="glass-card glass-shimmer rounded-2xl p-5 border border-white/[0.08] shadow-2xl">
      {/* Ambient corner orb */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-cyan-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Passenger Screening Profiles &amp; Test Cases
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Select verification profiles or register real-world passengers for IRL document &amp; biometric analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewPassengerModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/25 to-blue-600/25 hover:from-cyan-500/40 hover:to-blue-600/40 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ New Passenger</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-cyan-400/70 font-mono">
            <Zap className="w-3 h-3" />
            <span>Click to auto-screen</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Quick Add Card */}
        <button
          onClick={onOpenNewPassengerModal}
          className="text-left p-4 rounded-xl border border-dashed border-cyan-400/40 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 hover:bg-cyan-950/40 hover:border-cyan-400/70 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-cyan-500/10"
        >
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border bg-cyan-500/15 text-cyan-300 border-cyan-400/30 flex items-center gap-1">
              <Plus className="w-2.5 h-2.5" /> IRL ENTRY
            </span>
            <UserPlus className="w-4 h-4 text-cyan-400 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
          </div>

          <div>
            <div className="font-bold text-xs text-white mb-1 group-hover:text-cyan-300 transition-colors">
              + New Passenger
            </div>
            <div className="text-[11px] text-cyan-200/80 font-mono line-clamp-1">
              Register custom profile
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Live document &amp; selfie
            </div>
          </div>
        </button>

        {/* Existing Presets and Custom Passengers */}
        {presets.map((p) => {
          const isCustom = p.is_custom;
          const meta = PRESET_META[p.id] || {
            icon: ShieldCheck,
            color: p.badge_color || 'emerald',
            label: p.badge || 'CUSTOM'
          };
          const Icon = meta.icon;
          const colors = colorMap[p.badge_color || meta.color] || colorMap.emerald;
          const isActive = activePresetId === p.id;

          return (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id)}
              disabled={isLoading}
              className={`text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? colors.active
                  : `bg-slate-900/35 border-white/[0.07] hover:bg-slate-900/70 hover:border-white/[0.16] hover:shadow-xl ${colors.glow}`
              } ${isCustom ? 'ring-1 ring-cyan-500/20' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Active sweep */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none rounded-xl" />
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border line-clamp-1 ${colors.badge}`}>
                    {isCustom ? (p.badge || 'IRL PASSENGER') : meta.label}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {isCustom && onDeletePassenger && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePassenger(p.id);
                        }}
                        title="Delete custom test passenger"
                        className="p-1 rounded-md hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </span>
                    )}
                    <Icon className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${colors.icon}`} />
                  </div>
                </div>

                <div className="font-bold text-xs text-slate-100 line-clamp-1 mb-1 group-hover:text-white transition-colors">
                  {p.title?.split(':')[1]?.trim() || p.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                  {p.holder_name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {p.doc_number} · {p.nationality}
                </div>
              </div>

              {isActive && (
                <div className="absolute bottom-2 right-2">
                  <div className={`w-2 h-2 rounded-full ${colors.icon} animate-ping opacity-75`}
                    style={{ background: 'currentColor' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}



