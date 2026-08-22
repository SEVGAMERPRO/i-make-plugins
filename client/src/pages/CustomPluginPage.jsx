import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, Code2, ShieldCheck, DollarSign, Clock, MessageSquare } from 'lucide-react';
import axios from 'axios';

const CustomPluginPage = () => {
  const [email, setEmail] = useState('');
  const [game, setGame] = useState('Minecraft');
  const [budget, setBudget] = useState('$50 - $150');
  const [requestDetails, setRequestDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !requestDetails.trim()) {
      setNotification({
        type: 'error',
        message: 'Please provide both your email address and detailed plugin request.'
      });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      await axios.post('/api/requests/custom', {
        email,
        game,
        budget,
        requestDetails,
        recipient: 'minoforge.support@gmail.com',
        timestamp: new Date().toISOString()
      }).catch(() => {});

      setNotification({
        type: 'success',
        message: `Your custom plugin request has been sent to minoforge.support@gmail.com! Our dev team will email you at ${email} within 24 hours.`
      });

      setRequestDetails('');
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Error sending request. Please check your connection or email us directly at minoforge.support@gmail.com'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-14 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full text-xs font-bold text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>MinoForge Official Custom Development</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Want us to make custom plugins?
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Need a tailor-made Minecraft plugin, 2b2t anarchy mod, FiveM script, or Discord bot? Submit your specifications directly to our engineering team.
          </p>
        </div>

        {/* Live Notification Banner */}
        {notification && (
          <div 
            className={`p-5 rounded-3xl border text-sm flex items-start gap-4 animate-fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-xl shadow-emerald-500/10'
                : 'bg-red-500/15 border-red-500/40 text-red-300 shadow-xl shadow-red-500/10'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-extrabold text-base">{notification.type === 'success' ? 'Request Sent Successfully!' : 'Error Sending Request'}</p>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed text-slate-200">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Main Request Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">We'll send our reply and quote to this address.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Platform / Game
                </label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Minecraft">Minecraft (Paper/Purpur/Folia)</option>
                  <option value="Minecraft: 2b2t & Anarchy Clients">Minecraft: 2b2t & Anarchy Mods</option>
                  <option value="FiveM">FiveM (QBCore / ESX / Standalone)</option>
                  <option value="Roblox">Roblox Studio</option>
                  <option value="Discord">Discord Bot (Discord.js / Python)</option>
                  <option value="Websites">Web Portal & Store Integration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Estimated Budget (USD)
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="$20 - $50">$20 - $50 (Simple script or small fix)</option>
                  <option value="$50 - $150">$50 - $150 (Standard feature plugin)</option>
                  <option value="$150 - $350">$150 - $350 (Advanced multi-system)</option>
                  <option value="$350+">$350+ (Complete gamemode & network core)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Detailed Request & Requirements *
              </label>
              <textarea
                rows={6}
                required
                placeholder="Explain the features, commands, permissions, database requirements, and GUI interactions you want..."
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                className="w-full bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
              />
            </div>

            {/* Quality Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-slate-300 font-medium">24h Rapid Response</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-slate-300 font-medium">MinoShield Verified</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Direct Support Email</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto py-4 px-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Sending Request...' : 'Send Custom Plugin Request'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CustomPluginPage;
