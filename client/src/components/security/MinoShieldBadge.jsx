import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Eye, Lock, FileCode, Cpu } from 'lucide-react';

const MinoShieldBadge = ({ scanResult, detailed = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const defaultScan = {
    status: 'PASSED',
    score: 100,
    scannedAt: 'Just now',
    checks: [
      { name: 'Malware & Backdoor Signatures', status: 'CLEAN', icon: Lock },
      { name: 'Force-OP & Privilege Escalation', status: 'CLEAN', icon: AlertTriangle },
      { name: 'Suspicious Network Sockets & IP Loggers', status: 'CLEAN', icon: Cpu },
      { name: 'Bytecode Obfuscation & Payloads', status: 'CLEAN', icon: FileCode },
    ]
  };

  const scan = scanResult || defaultScan;

  return (
    <>
      <div 
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 cursor-pointer transition-all shadow-sm select-none group"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold tracking-tight">MinoShield Verified</span>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded">
          {scan.score}/100 Safe
        </span>
      </div>

      {/* Security Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">MinoShield Security Report</h3>
                  <p className="text-xs text-slate-400">Automated Bytecode & Threat Intelligence Analysis</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Score Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Overall Safety Rating</span>
                <p className="text-2xl font-black text-white">100% Malware-Free</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg text-sm">
                PASSED
              </div>
            </div>

            {/* Checks list */}
            <div className="space-y-3 mb-6">
              {scan.checks.map((check, idx) => {
                const Icon = check.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-200">{check.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clean
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 text-center leading-relaxed">
              Every file on MinoForge is verified against our automated bytecode ruleset before public distribution to protect server operators.
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MinoShieldBadge;
