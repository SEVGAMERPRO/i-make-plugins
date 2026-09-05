import React, { useState } from 'react';
import { 
  Bug, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Terminal, 
  ArrowRight, FileCode, Check, Copy, ExternalLink, Sparkles, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SAMPLE_CRASH_LOG = `[20:14:02 ERROR]: Could not pass event PlayerInteractEvent to MinoVault v1.0.0
java.lang.NullPointerException: Cannot invoke "org.bukkit.configuration.ConfigurationSection.getString(String)" because "config" is null
    at com.minoforge.vault.listeners.InteractListener.onInteract(InteractListener.java:42) ~[MinoVault.jar:?]
    at com.destroystokyo.paper.event.executor.asm.generated.GeneratedEventExecutor4.execute(Unknown Source) ~[?:?]
    at org.bukkit.plugin.EventExecutor.lambda$create$1(EventExecutor.java:75) ~[paper-api-1.21.jar:?]`;

const CrashAnalyzerPage = () => {
  const [logText, setLogText] = useState('');
  const [pluginName, setPluginName] = useState('');
  const [game, setGame] = useState('Minecraft');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!logText.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await axios.post('/api/ai/analyze-log', {
        logText: logText.trim(),
        pluginName: pluginName.trim() || 'MyPlugin',
        game
      });

      if (res.data && res.data.analysis) {
        setResult(res.data.analysis);
      } else {
        throw new Error('No analysis returned');
      }
    } catch (err) {
      setErrorMsg('Failed to run diagnostics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-xl text-xs font-bold text-red-300 border border-red-500/30">
              <Bug className="w-3.5 h-3.5" />
              <span>Pre-Submission Sanity Check #1</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Plugin Error &amp; Crash Diagnostic Analyzer</h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Test your plugin logs, Paper stack traces, or FiveM errors before submitting to admins for approval. Automated crash and stack trace diagnostics.
            </p>
          </div>

          <button
            onClick={() => {
              setLogText(SAMPLE_CRASH_LOG);
              setPluginName('MinoVault');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-white/10 cursor-pointer self-start md:self-auto"
          >
            Load Sample Crash Log
          </button>
        </div>

        {/* Diagnostic Form */}
        <form onSubmit={handleAnalyze} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Plugin / Resource Name
              </label>
              <input
                type="text"
                placeholder="e.g. MinoVault Pro"
                value={pluginName}
                onChange={(e) => setPluginName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Platform
              </label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
              >
                <option value="Minecraft">Minecraft (Paper / Spigot / Velocity)</option>
                <option value="FiveM">FiveM (QBCore / ESX / Standalone)</option>
                <option value="Discord">Discord.js / Bot Framework</option>
                <option value="Roblox">Roblox Luau</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Paste Error Log or Console Stack Trace
            </label>
            <textarea
              rows={7}
              required
              placeholder="Paste latest.log or stack trace here..."
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !logText.trim()}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Deep AI Diagnostic...</span>
              </>
            ) : (
              <>
                <Bug className="w-4 h-4" />
                <span>Analyze Crash Log &amp; Verify Code</span>
              </>
            )}
          </button>
        </form>

        {/* Results Card */}
        {result && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-6 animate-fade-in">
            
            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              result.status === 'PASSED' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : result.status === 'WARNING'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center gap-3">
                {result.status === 'PASSED' ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <ShieldAlert className="w-6 h-6 text-red-400" />}
                <div>
                  <strong className="text-sm font-black block">
                    Diagnostic Result: {result.status}
                  </strong>
                  <span className="text-xs opacity-90">
                    {result.adminApprovalReady 
                      ? '✓ Passed pre-screening. Ready to submit to staff!' 
                      : '⚠️ Critical issues detected. Resolve before submitting to admins.'}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 bg-slate-950/80 rounded-xl text-xs font-bold">
                {result.adminApprovalReady ? 'Approved for Staff Review' : 'Action Required'}
              </span>
            </div>

            {/* Root Cause */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Identified Root Cause</span>
              <p className="text-sm text-white font-semibold leading-relaxed">{result.rootCause}</p>
            </div>

            {/* Conflicting Plugins */}
            {result.conflictingPlugins && result.conflictingPlugins.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Required Dependencies / Incompatible Addons</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.conflictingPlugins.map((p, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs font-bold rounded-lg border border-amber-500/30">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fix Solution */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step-by-Step Developer Solution</span>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">{result.solution}</p>
            </div>

            {/* Action button */}
            <div className="flex justify-end pt-2">
              <Link
                to="/upload"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <span>Proceed to Plugin Submission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CrashAnalyzerPage;
