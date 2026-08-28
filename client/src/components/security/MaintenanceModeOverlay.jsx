import React from 'react';
import { ShieldAlert, Wrench, ExternalLink, RefreshCw, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';

export const GlobalAnnouncementBanner = () => {
  const { config } = useConfig();

  if (!config.announcement?.enabled || !config.announcement?.text) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-slate-950 px-4 py-2 text-xs font-black tracking-wide text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 z-50 animate-fade-in select-none">
      <Sparkles className="w-4 h-4 animate-pulse flex-shrink-0" />
      <span>{config.announcement.text}</span>
    </div>
  );
};

export const AdminMaintenanceBypassBar = () => {
  const { isAdminBypassActive, updateConfig, config } = useConfig();

  if (!isAdminBypassActive) return null;

  const handleDisableMaintenance = async () => {
    await updateConfig({ ...config, maintenanceMode: false });
  };

  return (
    <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 sm:px-6 py-2 text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 z-50 animate-fade-in backdrop-blur-md">
      <div className="flex items-center gap-2 font-bold">
        <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
        <span>⚡ MAINTENANCE MODE ACTIVE • ADMIN BYPASS ENGAGED (Visitors see maintenance screen)</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/nimda"
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-[11px] font-bold text-white transition-colors"
        >
          Nimda Console
        </a>
        <button
          onClick={handleDisableMaintenance}
          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[11px] transition-colors cursor-pointer"
        >
          Disable Maintenance
        </button>
      </div>
    </div>
  );
};

export const MaintenanceScreen = () => {
  const { config, fetchConfig, loading } = useConfig();

  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden font-sans select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg z-10 space-y-6 text-center">
        
        {/* Emblem */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-slate-950/90 border border-amber-400/40 p-3 flex items-center justify-center shadow-2xl shadow-amber-500/20 animate-pulse">
          <img src="/favicon.svg" alt="MinoForge Mascot" className="w-full h-full object-contain" />
        </div>

        {/* Maintenance Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black tracking-widest uppercase shadow-lg shadow-amber-500/10">
          <Wrench className="w-3.5 h-3.5 animate-spin" />
          <span>SCHEDULED PLATFORM UPGRADE</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            We'll Be Back Shortly!
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {config.maintenanceMessage || 'MinoForge is currently undergoing scheduled platform upgrades. We will be back shortly!'}
          </p>
        </div>

        {/* Live Status Diagnostics */}
        <div className="p-5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl space-y-3 text-left">
          <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2.5">
            <span className="text-slate-400">Upgrade Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Migrating Bytecode &amp; Cluster Engine
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2.5">
            <span className="text-slate-400">Marketplace Protection:</span>
            <span className="text-cyan-300 font-mono font-bold">MinoShield Active 100%</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Estimated Duration:</span>
            <span className="text-slate-300 font-mono">~10 - 20 Minutes</span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => fetchConfig()}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Check Status Again</span>
          </button>

          <a
            href="https://colasmp.net"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>colasmp.net Network</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="text-[11px] text-slate-500">
          Administrator? Access the secret portal at <a href="/nimda" className="text-cyan-400 hover:underline">/nimda</a>
        </div>
      </div>
    </div>
  );
};
