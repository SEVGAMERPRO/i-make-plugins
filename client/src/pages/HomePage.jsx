import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import GameCard from '../components/ui/GameCard';
import { Zap, Shield, Code, Users } from 'lucide-react';

const GAMES = [
  { slug: 'minecraft', name: 'Minecraft', icon: '⛏️', gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' },
  { slug: 'roblox', name: 'Roblox', icon: '🎮', gradient: 'linear-gradient(135deg, #E53935 0%, #B71C1C 100%)' },
  { slug: 'fivem', name: 'FiveM', icon: '🚗', gradient: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)' },
  { slug: 'the-isle-evrima', name: 'The Isle: Evrima', icon: '🦖', gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
  { slug: 'gmod', name: "Garry's Mod", icon: '🔧', gradient: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)' },
  { slug: 'rust', name: 'Rust', icon: '🏚️', gradient: 'linear-gradient(135deg, #795548 0%, #3E2723 100%)' },
  { slug: 'ark', name: 'ARK', icon: '🦕', gradient: 'linear-gradient(135deg, #558B2F 0%, #33691E 100%)' },
  { slug: 'discord', name: 'Discord', icon: '🤖', gradient: 'linear-gradient(135deg, #7C4DFF 0%, #4527A0 100%)' },
];

const HERO_BACKGROUNDS = [
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
  'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
  'linear-gradient(135deg, #1b1b2f 0%, #162447 50%, #1f4068 100%)',
];

const HomePage = () => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query) => {
    navigate(`/plugins?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <div className="relative pt-20 pb-40 px-4 overflow-hidden min-h-[550px] md:min-h-[620px] flex flex-col items-center justify-center">
        {/* Animated Background Layers */}
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-crossfade"
            style={{
              background: bg,
              opacity: idx === bgIndex ? 1 : 0,
              zIndex: idx === bgIndex ? 0 : -1,
            }}
          />
        ))}

        {/* Decorative dots pattern */}
        <div className="absolute inset-0 z-[1] opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-blue-200 font-medium mb-6 border border-white/10">
            🚀 The #1 Game Plugin Marketplace
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            Find the best plugins
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              for your favorite games
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse, buy, and sell high-quality game plugins. 
            From Minecraft to FiveM — everything your server needs.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Popular search tags */}
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-gray-400">Popular:</span>
            {['Economy', 'Admin', 'PvP', 'Roleplay', 'Chat', 'Anti-Cheat'].map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="text-gray-300 hover:text-white hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Game Categories overlapping hero */}
        <div className="absolute -bottom-20 md:-bottom-24 left-0 right-0 z-20 px-4">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 justify-start md:justify-center px-4 hide-scrollbar">
            {GAMES.map(game => (
              <GameCard key={game.slug} {...game} />
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for overlapping cards */}
      <div className="h-28 md:h-32 bg-[#F5F7FA]" />

      {/* Features / Why MinoForge section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
              Why MinoForge?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              The trusted marketplace for game server plugins. Upload, discover, and manage everything in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-[#F5F7FA] hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">Fast & Reliable</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Instant downloads and automatic updates for all your purchased plugins.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[#F5F7FA] hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">Staff Verified</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Every plugin is reviewed and approved by our team before going live.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[#F5F7FA] hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">Custom Requests</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Need something unique? Request custom plugins built to your specifications.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[#F5F7FA] hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">Growing Community</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Join creators and server owners building the next generation of game experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Games Banner */}
      <section className="py-16 px-4 bg-[#F5F7FA] border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-3">
            Supporting {GAMES.length} Games & Counting
          </h2>
          <p className="text-gray-500 mb-8">
            We support plugins for all major game platforms. More games added regularly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {GAMES.map(game => (
              <button
                key={game.slug}
                onClick={() => navigate(`/games/${game.slug}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md text-sm font-medium text-[#1A1A2E] hover:text-blue-600 transition-all duration-200 border border-gray-100"
              >
                <span>{game.icon}</span>
                {game.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213e 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Are you a developer?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Start selling your plugins today and reach thousands of server owners looking for premium resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 bg-[#2196F3] text-white rounded-lg font-semibold text-lg hover:bg-[#1976D2] transition-colors shadow-lg hover:shadow-xl"
            >
              Start Selling
            </button>
            <button
              onClick={() => navigate('/plugins')}
              className="px-8 py-3.5 bg-white/10 text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Browse Plugins
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
