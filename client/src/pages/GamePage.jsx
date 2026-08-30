import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGamePlugins } from '../services/api';
import PluginCard from '../components/ui/PluginCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { PackageOpen, Upload, ArrowLeft } from 'lucide-react';

const GAME_DATA = {
  'minecraft': { name: 'Minecraft', image: '/images/categories/minecraft.png', colorClass: 'from-emerald-600 to-green-800', description: 'Server plugins for Paper, Spigot, Purpur, and Velocity.' },
  'roblox': { name: 'Roblox', image: '/images/categories/roblox.png', colorClass: 'from-red-600 to-rose-800', description: 'Scripts, frameworks, and UI assets for Roblox Studio.' },
  'fivem': { name: 'FiveM', image: '/images/categories/fivem.png', colorClass: 'from-orange-600 to-amber-800', description: 'Custom scripts, vehicles, and MLOs for FiveM servers.' },
  'discord': { name: 'Discord', image: '/images/categories/discord.png', colorClass: 'from-indigo-600 to-purple-900', description: 'Verification bots, ticket systems, and community tools.' },
  'websites': { name: 'Websites', image: '/images/categories/websites.png', colorClass: 'from-cyan-600 to-blue-800', description: 'Custom server websites, store templates, and web portals.' },
};

const GamePage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [plugins, setPlugins] = useState([]);
  
  const gameInfo = GAME_DATA[slug] || { 
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
    image: '/images/games/minecraft.jpg',
    colorClass: 'from-blue-600 to-indigo-900', 
    description: 'Explore verified community plugins and server resources.' 
  };

  useEffect(() => {
    setLoading(true);
    // Fetch actual plugins from the database
    getGamePlugins(slug)
      .then(res => {
        setPlugins(res.data?.plugins || res.data || []);
      })
      .catch(() => {
        // Zero fake mock plugins!
        setPlugins([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white pb-16">
      {/* Game Header Banner */}
      <div className="relative h-72 md:h-80 overflow-hidden flex items-center justify-center border-b border-white/10">
        {/* In-game background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-50 scale-105"
          style={{ backgroundImage: `url(${gameInfo.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mb-4 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
            {gameInfo.name}
          </h1>
          <p className="text-base md:text-lg text-slate-300 drop-shadow">
            {gameInfo.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Available Plugins</h2>
            <p className="text-sm text-slate-400 mt-0.5">Showing verified community releases</p>
          </div>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <Upload className="w-4 h-4" /> Upload Plugin
          </Link>
        </div>

        {plugins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {plugins.map(plugin => (
              <PluginCard key={plugin.id} plugin={plugin} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 rounded-2xl border border-white/10 p-16 text-center max-w-xl mx-auto backdrop-blur-md">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-400">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No plugins uploaded yet</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              There are currently no active plugins for {gameInfo.name}. Are you a developer? Be the first to upload and start earning!
            </p>
            <Link
              to="/become-creator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              <Upload className="w-4 h-4" /> Start Selling for {gameInfo.name} — Become a Creator
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
