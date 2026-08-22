import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Mail, Phone, ArrowLeft, Sparkles, Clock, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

const RequestSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const email = state.email || 'your email';
  const phone = state.phone || '';
  const game = state.game || 'Minecraft';
  const budget = state.budget || '$50 - $150';

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8 relative flex items-center justify-center">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
        
        {/* Main Success Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center">
          
          {/* Animated Success Badge */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-500/10 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Transmitted Successfully</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Request Received!
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Your custom plugin specifications for <strong className="text-white">{game}</strong> have been submitted to the MinoForge engineering team.
            </p>
          </div>

          {/* CRITICAL: Check Spam Folder Callout Banner */}
          <div className="bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl p-5 text-left space-y-3 shadow-lg shadow-amber-500/5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-amber-300">
                  Don't see your confirmation email? Check your SPAM folder!
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  We sent an official confirmation receipt from <strong className="text-white">MinoForgeRequests</strong> to <strong className="text-amber-300 font-mono underline">{email}</strong>.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-bold text-white">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>How to find it & make sure you get our reply:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                <li>Check your <strong className="text-amber-200">Spam / Junk</strong> folder or <strong className="text-amber-200">Promotions / Updates</strong> tab.</li>
                <li>Open the email and click <strong className="text-emerald-400">"Report Not Spam"</strong> or <strong className="text-emerald-400">"Move to Inbox"</strong>.</li>
                <li>Search in Gmail: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">in:anywhere MinoForge</code></li>
              </ul>
            </div>
          </div>

          {/* Submission Details Summary */}
          <div className="bg-slate-950/50 rounded-2xl border border-white/5 p-4 text-left divide-y divide-white/5 space-y-2">
            <div className="flex justify-between items-center py-1.5 text-xs">
              <span className="text-slate-400 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> Requester Email</span>
              <span className="text-white font-mono font-bold">{email}</span>
            </div>
            {phone && (
              <div className="flex justify-between items-center py-1.5 text-xs">
                <span className="text-slate-400 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Phone</span>
                <span className="text-emerald-400 font-mono font-bold">{phone}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1.5 text-xs">
              <span className="text-slate-400">Target Platform</span>
              <span className="text-white font-bold">{game}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 text-xs">
              <span className="text-slate-400">Budget Range</span>
              <span className="text-blue-400 font-bold">{budget}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 text-xs">
              <span className="text-slate-400">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Under Developer Review
              </span>
            </div>
          </div>

          {/* What happens next timeline */}
          <div className="text-left space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">What Happens Next:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5 text-xs space-y-1">
                <span className="font-black text-blue-400">1. Review</span>
                <p className="text-slate-400 text-[11px]">Engineers inspect your commands and features.</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5 text-xs space-y-1">
                <span className="font-black text-blue-400">2. Quote & ETA</span>
                <p className="text-slate-400 text-[11px]">We email your custom quote within 24h.</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5 text-xs space-y-1">
                <span className="font-black text-emerald-400">3. Delivery</span>
                <p className="text-slate-400 text-[11px]">Tested .jar/.zip build delivered directly.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/plugins"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Browse Existing Plugins</span>
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RequestSuccessPage;
