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

        {/* Legal Disclaimer & Safe Harbor Notice */}
        <div className="my-8 p-4 rounded-2xl bg-slate-900/70 border border-white/10 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Legal Disclaimer &amp; Non-Affiliation Notice</span>
          </div>
          <p className="font-bold text-amber-300 text-xs">
            !! Not affiliated with the official Miniforge project !!
          </p>
          <p className="text-slate-400">
            <strong>MinoForge (minoforge.com)</strong> is an independent community platform and marketplace for game plugins, server configs, and developer resources. MinoForge is not affiliated with, endorsed by, or associated with the <em>conda-forge Miniforge</em> distribution, <em>Mojang AB</em>, <em>Microsoft Corporation</em>, <em>Rockstar Games</em>, <em>Take-Two Interactive</em>, <em>Roblox Corporation</em>, <em>Discord Inc.</em>, or any other trademark holders. <em>Minecraft</em> is a registered trademark of Mojang AB / Microsoft. All game titles, trademarks, brand names, and logos referenced on this website remain the sole property of their respective copyright and trademark owners and are used purely for identification and compatibility purposes under Fair Use.
          </p>
        </div>

        {/* Bottom copyright and Currency Switcher */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MinoForge. Built for server creators worldwide.</p>
          
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Display Currency:</span>
            <CurrencySwitcher compact={true} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
