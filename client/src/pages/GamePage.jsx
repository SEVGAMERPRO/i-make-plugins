import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PluginCard from '../components/ui/PluginCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GAME_DATA = {
  'minecraft': { name: 'Minecraft', colorClass: 'from-green-500 to-emerald-700', description: 'Server plugins for Spigot, Paper, and more.' },
  'roblox': { name: 'Roblox', colorClass: 'from-red-500 to-rose-700', description: 'Scripts and assets for Roblox Studio.' },
  'hytale': { name: 'Hytale', colorClass: 'from-cyan-400 to-teal-600', description: 'Mods and scripts for Hytale servers.' },
  'garrys-mod': { name: 'Garry\'s Mod', colorClass: 'from-blue-700 to-indigo-900', description: 'Addons, gamemodes, and scripts.' },
  'fivem': { name: 'FiveM', colorClass: 'from-orange-500 to-amber-700', description: 'Scripts and vehicles for GTA V Roleplay.' },
  'rust': { name: 'Rust', colorClass: 'from-amber-700 to-yellow-900', description: 'Oxide plugins and server mods.' },
  'ark': { name: 'ARK', colorClass: 'from-emerald-700 to-green-900', description: 'Server API plugins and mods.' },
  'discord': { name: 'Discord', colorClass: 'from-indigo-500 to-purple-700', description: 'Bots, templates, and scripts.' },
};

const GamePage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [plugins, setPlugins] = useState([]);
  
  const gameInfo = GAME_DATA[slug] || { name: slug, colorClass: 'from-gray-500 to-gray-700', description: 'Plugins and resources.' };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mock = Array.from({ length: 8 }).map((_, i) => ({
        id: `${slug}-p${i}`,
        title: `${gameInfo.name} Plugin ${i + 1}`,
        authorName: 'ProDev',
        gameName: gameInfo.name,
        price: i % 2 === 0 ? '0.00' : '9.99',
        rating: '4.8',
        downloads: Math.floor(Math.random() * 2000),
        imageUrl: ''
      }));
      setPlugins(mock);
      setLoading(false);
    }, 500);
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-12">
      {/* Game Header Banner */}
      <div className={`relative h-64 bg-gradient-to-br ${gameInfo.colorClass} overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">{gameInfo.name}</h1>
          <p className="text-lg text-white/90 drop-shadow">{gameInfo.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Latest {gameInfo.name} Plugins</h2>
          <Link to={`/plugins?game=${encodeURIComponent(gameInfo.name)}`} className="text-[#2196F3] hover:underline font-medium text-sm">
            View All
          </Link>
        </div>

        {plugins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {plugins.map(plugin => (
              <PluginCard key={plugin.id} plugin={plugin} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">No plugins yet</h3>
            <p className="text-gray-500">Be the first to publish a plugin for {gameInfo.name}!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
