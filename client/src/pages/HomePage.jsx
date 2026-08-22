import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import GameCard from '../components/ui/GameCard';
import { Zap, Shield, Code, Users, Sparkles, TrendingUp, Download, ArrowRight } from 'lucide-react';

const GAMES = [
  { slug: 'minecraft', name: 'Minecraft', image: '/images/games/minecraft.jpg' },
  { slug: 'roblox', name: 'Roblox', image: '/images/games/roblox.jpg' },
  { slug: 'fivem', name: 'FiveM', image: '/images/games/fivem.jpg' },
  { slug: 'the-isle-evrima', name: 'The Isle: Evrima', image: '/images/games/the-isle.jpg' },
  { slug: 'gmod', name: "Garry's Mod", image: '/images/games/gmod.jpg' },
  { slug: 'rust', name: 'Rust', image: '/images/games/rust.jpg' },
  { slug: 'ark', name: 'ARK', image: '/images/games/ark.jpg' },
  { slug: 'discord', name: 'Discord', image: '/images/games/discord.jpg' },
];

const HERO_IMAGES = [
  '/images/hero/minecraft-hero.jpg',
  '/images/hero/gta-hero.jpg',
  '/images/hero/rust-hero.jpg',
  '/images/hero/ark-hero.jpg',
  '/images/hero/the-isle-hero.jpg',
  '/images/hero/gmod-hero.jpg',
];

const HomePage = () => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    // Smooth 9-second in-game wallpaper rotation
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
      <div className="relative pt-24 pb-48 px-4 min-h-[640px] md:min-h-[700px] flex flex-col items-center justify-center overflow-visible">
        {/* Animated In-Game Hero Wallpapers */}
        {HERO_IMAGES.map((bg, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: idx === bgIndex ? 0.45 : 0,
              zIndex: 0,
            }}
          />
        ))}

        {/* Cinematic dark gradient vignette */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b0f19]/80 via-[#0b0f19]/60 to-[#0b0f19] pointer-events-none" />

        {/* Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 z-[1] opacity-10 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }} 
        />

        {/* Hero Content */}
        <div className="relative z-30 w-full max-w-4xl mx-auto text-center animate-fade-in">
          {/* Marketplace Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 backdrop-blur-md rounded-full text-xs md:text-sm text-blue-300 font-semibold mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>The #1 Game Plugin & Mod Marketplace</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Find the best plugins
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              for your favorite games
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Discover, download, and sell high-performance plugins for Minecraft, FiveM, Rust, and more.
          </p>

          {/* Upgraded Glassmorphism Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 relative z-50">
            <SearchBar onSearch={handleSearch} suggestions={GAMES} />
          </div>

          {/* Popular Quick Search Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Popular:
            </span>
            {['Economy', 'Staff Admin', 'PvP Kits', 'Anti-Cheat', 'Custom Vehicles', 'Discord Sync'].map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/30 border border-white/5 hover:border-blue-400/40 px-3 py-1 rounded-lg transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Game Categories Carousel (Fixed left-clipping and smooth scrolling) */}
        <div className="absolute -bottom-24 md:-bottom-28 left-0 right-0 z-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 pt-2 px-4 justify-start xl:justify-center hide-scrollbar scroll-smooth">
              {GAMES.map(game => (
                <GameCard key={game.slug} {...game} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for overlapping game cards */}
      <div className="h-32 md:h-36 bg-[#0b0f19]" />

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
              <p className="text-slate-400 text-sm leading-relaxed">Connect with thousands of server admins, exchange configs, and get support.</p>
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
            Monetize your code and reach thousands of server owners looking for premium plugins and custom development.
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
    </div>
  );
};

export default HomePage;
