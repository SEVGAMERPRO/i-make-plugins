import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Bug, Cpu, CheckCircle2, Zap, Terminal, FileCode, ArrowRight } from 'lucide-react';

const MinoShieldPage = () => {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Autonomous Bytecode Protection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            MinoShield™ Security System
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            How MinoForge protects server owners and creators with automated binary bytecode deobfuscation, vulnerability scanning, and backdoor interception.
          </p>
        </div>

        {/* Protection Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Bug className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Zero Force-OPs &amp; Backdoors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every JAR and ZIP file is decompiled and analyzed for hidden privilege escalation, remote code execution (RCE), and backdoor commands.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Token &amp; Webhook Guard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prevents Discord token loggers, webhook stealers, and unlicensed telemetry calls from executing inside your game server environment.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Staff Code Audits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated AI heuristics are paired with manual verification from senior software engineers before any resource is marked Approved.
            </p>
          </div>
        </div>

        {/* Deep Dive Pipeline */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>The 4-Stage MinoShield Verification Pipeline</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex gap-4 items-start">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
              <div>
                <strong className="text-white text-sm block">Static Bytecode &amp; AST Analysis</strong>
                <p className="text-xs text-slate-400 mt-0.5">Decompiles Java .class files, Lua bytecode, and JavaScript bundles to inspect all AST trees for suspicious reflection calls.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex gap-4 items-start">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
              <div>
                <strong className="text-white text-sm block">Sandboxed Execution Testing</strong>
                <p className="text-xs text-slate-400 mt-0.5">Executes the resource in an isolated VM to test memory allocation, thread stability, and ensure 0.00ms idle tick performance.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex gap-4 items-start">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
              <div>
                <strong className="text-white text-sm block">Malware Signature &amp; Hash Matching</strong>
                <p className="text-xs text-slate-400 mt-0.5">Cross-references binary hashes against our global database of known server exploits, leaked griefing utilities, and stolen source code.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex gap-4 items-start">
              <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">4</span>
              <div>
                <strong className="text-white text-sm block">Verified MinoForge Signature Stamp</strong>
                <p className="text-xs text-slate-400 mt-0.5">Once certified, resources receive the green MinoShield badge and are signed for secure download.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link 
            to="/" 
            className="btn-animated inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl text-xs border border-white/10"
          >
            <span>Return to Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MinoShieldPage;
