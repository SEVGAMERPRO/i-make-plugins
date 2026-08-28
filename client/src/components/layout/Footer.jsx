import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import CurrencySwitcher from '../ui/CurrencySwitcher';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-black text-white tracking-tight group">
              <img 
                src="/favicon.png" 
                alt="MinoForge Logo" 
                className="w-8 h-8 rounded-xl object-cover shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform" 
              />
              <span className="group-hover:text-blue-300 transition-colors">MinoForge</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier marketplace for gaming plugins, server tools, scripts, and custom development.
            </p>
            <Link to="/minoshield" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/20 transition-all">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MinoShield 100% Protected</span>
            </Link>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-300">
              <li><Link to="/games/minecraft" className="hover:text-blue-400 transition-colors">Minecraft Plugins</Link></li>
              <li><Link to="/games/fivem" className="hover:text-blue-400 transition-colors">FiveM Scripts</Link></li>
              <li><Link to="/games/roblox" className="hover:text-blue-400 transition-colors">Roblox Assets</Link></li>
              <li><Link to="/games/discord" className="hover:text-blue-400 transition-colors">Discord Bots</Link></li>
              <li><Link to="/games/websites" className="hover:text-blue-400 transition-colors">Web Templates</Link></li>
            </ul>
          </div>

          {/* Creators & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Features & Tools</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-300">
              <li><Link to="/ai-config" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-cyan-400" /> AI Config Generator</Link></li>
              <li><Link to="/bounties" className="hover:text-amber-400 transition-colors">Custom Plugin Bounties</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Creator Dashboard</Link></li>
              <li><Link to="/creators" className="hover:text-blue-400 transition-colors">Sell Your Plugins</Link></li>
              <li><Link to="/staff/reviews" className="hover:text-purple-400 transition-colors">Staff Review Queue</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-300">
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/network" className="hover:text-blue-400 transition-colors">Network Portal</Link></li>
              <li><span className="text-slate-400 font-medium">Official domain: <span className="text-cyan-400 font-bold">minoforge.com</span></span></li>
            </ul>
          </div>

        </div>

        {/* Professional Legal Notice */}
        <div className="my-8 p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-white/5 text-[11px] text-slate-400 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="max-w-4xl">
            <strong className="text-slate-300 font-semibold">Non-Affiliation Notice:</strong> MinoForge is an independent community marketplace and is not affiliated with, endorsed by, or connected to the Conda-Forge Miniforge distribution, Mojang AB, Microsoft, Rockstar Games, Roblox Corporation, or Discord Inc. All trademarks belong to their respective owners.
          </p>
          <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 font-semibold whitespace-nowrap text-xs">
            Legal Terms →
          </Link>
        </div>

        {/* Supported Payment Gateways Strip */}
        <div className="pt-6 pb-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold">Supported Payments:</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[11px] font-black rounded-lg">
                iDEAL
              </span>
              <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-black rounded-lg">
                PayPal
              </span>
              <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold rounded-lg">
                Visa / Mastercard
              </span>
              <span className="px-2.5 py-1 bg-slate-800 border border-white/10 text-slate-300 text-[11px] font-bold rounded-lg">
                Apple Pay &amp; Google Pay
              </span>
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold rounded-lg">
                Bancontact
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Currency:</span>
            <CurrencySwitcher compact={true} />
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MinoForge. All rights reserved. Built for server creators worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
