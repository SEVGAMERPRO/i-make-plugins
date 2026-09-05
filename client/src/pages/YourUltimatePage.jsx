import React, { useState } from 'react';
import { 
  Crown, Sparkles, Rocket, Bot, Megaphone, 
  Settings, ExternalLink, Palette, Check, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link, Navigate } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';

const CROWN_STYLES = [
  { id: 'imperial_gold', name: 'Imperial Gold', icon: '👑', color: 'text-amber-400', desc: 'Classic golden royal crown with radiant aura' },
  { id: 'diamond_tiara', name: 'Diamond Monarch', icon: '💎', color: 'text-cyan-400', desc: 'Pure celestial diamond crown with cyan glow' },
  { id: 'phoenix_fire', name: 'Phoenix Flare', icon: '🔥', color: 'text-orange-500', desc: 'Burning embers and fiery crest on avatar' },
  { id: 'cyber_star', name: 'Cyber Overdrive', icon: '⚡', color: 'text-purple-400', desc: 'Futuristic neon electric sparks & RGB pulse' }
];

const YourUltimatePage = () => {
  const { user, updateUser, loading } = useAuth();
  const { formatPrice } = useCurrency();
  const [crownStyle, setCrownStyle] = useState(() => localStorage.getItem('minoforge_crown_style') || 'imperial_gold');
  const [showCrown, setShowCrown] = useState(() => localStorage.getItem('minoforge_show_crown') !== 'false');
  const [rgbGlow, setRgbGlow] = useState(() => localStorage.getItem('minoforge_rgb_glow') === 'true');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [adCredits] = useState(() => parseFloat(localStorage.getItem('minoforge_ad_credits') || '5.00'));

  if (!loading && !user) {
    return <Navigate to="/upgrade" replace />;
  }

  const handleSaveSettings = () => {
    localStorage.setItem('minoforge_crown_style', crownStyle);
    localStorage.setItem('minoforge_show_crown', showCrown ? 'true' : 'false');
    localStorage.setItem('minoforge_rgb_glow', rgbGlow ? 'true' : 'false');
    
    if (updateUser) {
      updateUser({ crownStyle, showCrown, rgbGlow });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10 animate-fade-in">
        
        {/* Header Hero Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-slate-950 border-2 border-amber-400 p-1 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/30 overflow-hidden">
                  <UserAvatar user={user} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="absolute -top-2 -left-2 p-1.5 bg-amber-500 text-slate-950 rounded-full shadow-lg">
                  <Crown className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black uppercase rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>MinoForge Ultimate Member</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Your Ultimate Control Center
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Configure your VIP crown, deploy ad credits, and manage creator perks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marketplace Fee</span>
            <div className="text-3xl font-black text-emerald-400">5.0%</div>
            <p className="text-[11px] text-slate-400">You keep 95% on every plugin sale.</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ad Credits</span>
            <div className="text-3xl font-black text-amber-300">€{adCredits.toFixed(2)}</div>
            <p className="text-[11px] text-slate-400">Renews every billing cycle.</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Config Limits</span>
            <div className="text-3xl font-black text-cyan-400">Unlimited</div>
            <p className="text-[11px] text-slate-400">Gemini Pro turbo mode enabled.</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Verification</span>
            <div className="text-3xl font-black text-purple-300">&lt; 2 Hours</div>
            <p className="text-[11px] text-slate-400">Express priority review queue.</p>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Customizer */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">VIP Badge Customization</h3>
                </div>
              </div>

              <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center gap-6">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-2xl bg-slate-900 border-2 ${rgbGlow ? 'border-amber-400 shadow-2xl shadow-amber-400/50 animate-pulse' : 'border-amber-400/60'} flex items-center justify-center overflow-hidden`}>
                    <UserAvatar user={user} className="w-full h-full object-cover" />
                  </div>
                  {showCrown && (
                    <div className="absolute -top-3 -left-3 text-2xl filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]">
                      {CROWN_STYLES.find(c => c.id === crownStyle)?.icon || '👑'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{user?.username || 'Creator'}</span>
                    {showCrown && <Crown className="w-4 h-4 text-amber-400 fill-amber-400 inline" />}
                  </div>
                  <div className="text-xs text-amber-300 font-bold">
                    👑 MinoForge Ultimate Creator
                  </div>
                  <span className="text-[11px] text-slate-400 block">Shown across marketplace, chat, and comments</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Crown Emblem</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CROWN_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setCrownStyle(style.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        crownStyle === style.id ? 'bg-amber-500/15 border-amber-500' : 'bg-slate-950/60 border-white/5'
                      }`}
                    >
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <strong className="block text-xs font-bold text-white">{style.name}</strong>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{style.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-white/5">
                  <div>
                    <strong className="text-xs font-bold text-white block">Display Crown on Navbar Avatar</strong>
                    <span className="text-[11px] text-slate-400">Shows the golden crown on your top-bar avatar.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCrown}
                    onChange={(e) => setShowCrown(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-white/5">
                  <div>
                    <strong className="text-xs font-bold text-white block">Aura Glow &amp; RGB Pulse</strong>
                    <span className="text-[11px] text-slate-400">Subtle glow around your profile card.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rgbGlow}
                    onChange={(e) => setRgbGlow(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                <span>{savedSuccess ? 'Preferences Saved!' : 'Save VIP Preferences'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Perks & Billing */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Ad Credits */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">Monthly Promotional Balance</h4>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">€{adCredits.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-300">
                Deploy your €5.00 monthly ad credits to showcase your plugins on the homepage and search headers.
              </p>
              <Link
                to="/ads"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Rocket className="w-4 h-4 text-amber-400" />
                <span>Launch Campaign</span>
              </Link>
            </div>

            {/* AI Config Studio */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-white text-sm">AI Config Studio Engine</h4>
                </div>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-bold border border-cyan-500/20">
                  Gemini Pro
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Generate unlimited server configs and optimize plugins with zero daily quotas.
              </p>
              <Link
                to="/ai-config"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Generate Configs</span>
              </Link>
            </div>

            {/* Billing */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">Subscription Details</h4>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
                  Active
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan:</span>
                  <span className="font-bold text-white">MinoForge Ultimate (Monthly)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate:</span>
                  <span className="font-bold text-emerald-400">5% Marketplace Fee</span>
                </div>
              </div>
              <a
                href="https://www.paypal.com/myaccount/autopay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-950 border border-white/10 text-slate-300 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all block text-center mt-2"
              >
                <ExternalLink className="w-3.5 h-3.5 inline mr-1" />
                <span>Manage via PayPal</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default YourUltimatePage;
