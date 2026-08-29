import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/ui/SearchBar';
import GameCard from '../components/ui/GameCard';
import CustomPluginRequestModal from '../components/ui/CustomPluginRequestModal';
import { Zap, Shield, Code, Users, Sparkles, TrendingUp, Download, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const GAMES = [
  { slug: 'minecraft', name: 'Minecraft', image: '/images/categories/minecraft.png', accentColor: '#4CAF50' },
  { slug: 'roblox', name: 'Roblox', image: '/images/categories/roblox.png', accentColor: '#E53935' },
  { slug: 'fivem', name: 'FiveM', image: '/images/categories/fivem.png', accentColor: '#FF9800' },
  { slug: 'discord', name: 'Discord', image: '/images/categories/discord.png', accentColor: '#5865F2' },
  { slug: 'websites', name: 'Websites', image: '/images/categories/websites.png', accentColor: '#00D2FF' },
];

const HERO_IMAGES = [
  '/images/categories/minecraft.png',
  '/images/categories/fivem.png',
  '/images/categories/roblox.png',
  '/images/categories/discord.png',
  '/images/categories/websites.png',
];

export default function HomePage() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [bgIndex, setBgIndex] = useState(0);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [featuredPlugins, setFeaturedPlugins] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/plugins/featured');
        if (res.data && Array.isArray(res.data)) {
          setFeaturedPlugins(res.data);
        }
      } catch (err) {}
    };
    fetchFeatured();
    const interval = setInterval(fetchFeatured, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 9-second cinematic hero background crossfade
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query) => {
    navigate(`/plugins?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex-grow flex flex-col bg-[#0b0f19] text-white">
      {/* Hero Section */}
      <div className="relative pt-20 sm:pt-24 pb-40 sm:pb-52 px-3 sm:px-4 min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col items-center justify-center overflow-visible">
        {/* Animated In-Game Hero Wallpapers */}
        {HERO_IMAGES.map((bg, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: idx === bgIndex ? 0.4 : 0,
              zIndex: 0,
            }}
          />
        ))}

        {/* Cinematic dark gradient overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b0f19]/85 via-[#0b0f19]/65 to-[#0b0f19] pointer-events-none" />

        {/* Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 z-[1] opacity-10 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }} 
        />

        {/* Hero Content */}
        <div className="relative z-30 w-full max-w-4xl mx-auto text-center animate-fade-in px-2">
          {/* Note: Website Heavy Development Notice Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 backdrop-blur-md rounded-2xl text-xs md:text-sm text-amber-300 font-medium mb-4 border border-amber-500/30 shadow-lg shadow-amber-500/10 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-left text-xs md:text-sm leading-snug">
              <strong className="text-amber-300 uppercase tracking-wide mr-1 font-bold">Note:</strong>
              This website is still under heavy development, and some subscription features aren't fully active yet!
            </span>
          </div>

          <br />

          {/* Marketplace Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 backdrop-blur-md rounded-full text-xs sm:text-sm text-blue-300 font-semibold mb-4 sm:mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span>The #1 Game Plugin &amp; Mod Marketplace</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Find the best plugins
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              for your favorite games
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Discover, download, and sell high-performance plugins for Minecraft, FiveM, Rust, and more.
          </p>

          {/* Upgraded Glassmorphism Search Bar */}
          <div className="max-w-2xl mx-auto mb-5 sm:mb-6 relative z-50">
            <SearchBar onSearch={handleSearch} suggestions={GAMES} />
          </div>

          {/* Popular Quick Search Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs md:text-sm">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1 text-[11px] sm:text-xs">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" /> Popular:
            </span>
            {['Economy', 'Staff Admin', 'PvP Kits', 'Anti-Cheat', 'Custom Vehicles', 'Discord Sync'].map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="btn-tag-animated text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/25 border border-white/10 hover:border-blue-400/50 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium shadow-sm transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 100% Seamless Endless Moving Game Categories Marquee */}
        <div className="absolute -bottom-20 sm:-bottom-24 md:-bottom-28 left-0 right-0 z-20 px-1 sm:px-4 pointer-events-none">
          <div className="max-w-7xl mx-auto relative group/carousel pointer-events-auto overflow-hidden">
            {/* Seamless Endless Infinite Moving Track */}
            <div className="overflow-hidden pb-4 pt-2 px-2 select-none w-full">
              <div className="animate-marquee-infinite flex gap-2.5 sm:gap-4">
                {/* First Half */}
                {[...GAMES, ...GAMES].map((game, index) => (
                  <GameCard key={`${game.slug}-a-${index}`} {...game} />
                ))}
                {/* Second Half (Exact Mirror for 100% Seamless Infinite Loop) */}
                {[...GAMES, ...GAMES].map((game, index) => (
                  <GameCard key={`${game.slug}-b-${index}`} {...game} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for overlapping game cards */}
      <div className="h-24 sm:h-32 md:h-36 bg-[#0b0f19]" />

      {/* Sponsored & Promoted Plugins Spotlight Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Featured & Sponsored Spotlight</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/ads')}
            className="btn-animated text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 group"
          >
            <span>Promote Your Plugin</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlugins.map(plugin => (
            <div 
              key={plugin.id}
              onClick={() => navigate(`/plugins/${plugin.id}`)}
              className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/40 hover:border-amber-400 p-6 shadow-2xl transition-all duration-300 cursor-pointer group space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  PROMOTED
                </span>
                <span className="text-xs font-bold text-emerald-400">{formatPrice(plugin.price)}</span>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 relative">
                <img 
                  src={plugin.coverImageUrl || '/images/plugins/minecraft_economy_gui.svg'} 
                  alt={plugin.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                  {plugin.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {plugin.summary || plugin.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG CUSTOM PLUGIN REQUEST CTA BANNER */}
      <section className="py-8 px-4 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border-2 border-blue-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 max-w-2xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-black rounded-full border border-blue-500/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Development Studio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Want us to make custom plugins?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have an idea for a unique Minecraft mechanic, FiveM script, or Discord bot? Fill in a quick request and our team will build and test it for you!
            </p>
          </div>

          <div className="z-10 flex-shrink-0">
            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="btn-glow-blue btn-shimmer btn-animated py-4 px-8 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-base sm:text-lg rounded-2xl flex items-center gap-3 group"
            >
              <span>Order Custom Plugin</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* Why MinoForge Features Section */}
      <section className="py-20 px-4 bg-slate-900/50 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Why Server Owners Choose MinoForge
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              Everything you need to supercharge your gaming community in one secure platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5 text-blue-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Instant Delivery</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Download purchased plugins immediately with automated version updates.</p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-5 text-green-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Verified & Secure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Staff-reviewed code to guarantee zero malware, backdoors, or malicious exploits.</p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-5 text-purple-400">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Custom Plugin Requests</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Hire expert creators directly to code custom features for your server.</p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5 text-amber-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Active Community</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Connect with server admins, exchange configs, and get direct author support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Games Quick Grid */}
      <section className="py-20 px-4 bg-[#0b0f19]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
            Supporting All Major Gaming Platforms
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-sm md:text-base">
            From survival servers to roleplay communities, find tools specifically built for your platform.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {GAMES.map(game => (
              <button
                key={game.slug}
                onClick={() => navigate(`/games/${game.slug}`)}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-sm font-bold text-white hover:text-blue-300 transition-all border border-white/10 hover:border-blue-400/40 shadow-md"
              >
                <div className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                </div>
                <span>{game.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action for developers */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-950/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6 text-blue-400">
            <Download className="w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
            Are you a Plugin Developer?
          </h2>
          <p className="text-base md:text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Monetize your code and connect directly with server owners looking for premium plugins and custom development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Start Selling on MinoForge</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/plugins')}
              className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-xl font-bold text-lg transition-all border border-white/10 hover:border-white/20"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      {/* Custom Plugin Request Modal */}
      <CustomPluginRequestModal 
        isOpen={isCustomRequestOpen} 
        onClose={() => setIsCustomRequestOpen(false)} 
      />
    </div>
  );
}
