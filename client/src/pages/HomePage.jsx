import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import GameCard from '../components/ui/GameCard';
import PluginCard from '../components/ui/PluginCard';
import { ChevronRight } from 'lucide-react';

const GAMES = [
  { slug: 'minecraft', name: 'Minecraft', colorClass: 'from-green-500 to-emerald-700' },
  { slug: 'roblox', name: 'Roblox', colorClass: 'from-red-500 to-rose-700' },
  { slug: 'fivem', name: 'FiveM', colorClass: 'from-orange-500 to-amber-700' },
  { slug: 'the-isle-evrima', name: 'The Isle: Evrima', colorClass: 'from-green-700 to-emerald-900' },
  { slug: 'gmod', name: 'Garry\'s Mod', colorClass: 'from-blue-700 to-indigo-900' },
  { slug: 'rust', name: 'Rust', colorClass: 'from-amber-700 to-yellow-900' },
  { slug: 'ark', name: 'ARK', colorClass: 'from-emerald-700 to-green-900' },
  { slug: 'discord', name: 'Discord', colorClass: 'from-indigo-500 to-purple-700' },
];

const MOCK_FEATURED = [
  { id: '1', title: 'EssentialsX Pro', authorName: 'DevTeam', gameName: 'Minecraft', price: '9.99', rating: '4.9', downloads: 1250, imageUrl: '' },
  { id: '2', title: 'Vehicle Spawner', authorName: 'FiveMods', gameName: 'FiveM', price: '14.99', rating: '4.7', downloads: 840, imageUrl: '' },
  { id: '3', title: 'Admin Tools GUI', authorName: 'BloxDev', gameName: 'Roblox', price: '0.00', rating: '4.8', downloads: 5000, imageUrl: '' },
  { id: '4', title: 'Economy Core', authorName: 'EconomyPlus', gameName: 'Minecraft', price: '4.99', rating: '4.5', downloads: 320, imageUrl: '' },
  { id: '5', title: 'Custom NPCs', authorName: 'ModderX', gameName: 'Garry\'s Mod', price: '2.99', rating: '4.6', downloads: 610, imageUrl: '' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  
  // Cycle through some background colors for the hero section crossfade effect
  const bgGradients = [
    'from-[#0f2027] via-[#203a43] to-[#2c5364]',
    'from-[#141E30] to-[#243B55]',
    'from-[#0B486B] to-[#F56217]',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgGradients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query) => {
    navigate(`/plugins?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <div className="relative pt-24 pb-32 px-4 overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
        {/* Animated Background Layers */}
        {bgGradients.map((grad, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 bg-gradient-to-br ${grad} transition-crossfade ${idx === bgIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          />
        ))}
        
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
            Find the best plugins <br className="hidden md:block"/> for your favorite games
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow">
            Join thousands of server owners and developers downloading high-quality, premium game modifications.
          </p>

          <div className="mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/90 font-medium mt-12">
            <div className="text-center">
              <span className="block text-3xl font-bold text-white mb-1">10k+</span>
              <span className="text-sm text-gray-300">Active Users</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-white mb-1">5,000+</span>
              <span className="text-sm text-gray-300">Plugins Available</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-white mb-1">1M+</span>
              <span className="text-sm text-gray-300">Total Downloads</span>
            </div>
          </div>
        </div>

        {/* Game Categories overlapping hero */}
        <div className="absolute -bottom-24 left-0 right-0 z-20 overflow-x-auto pb-8 pt-4 px-4 hide-scrollbar">
          <div className="flex gap-6 w-max mx-auto px-4">
            {GAMES.map(game => (
              <GameCard key={game.slug} {...game} />
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for overlapping cards */}
      <div className="h-32 bg-[#F5F7FA]"></div>

      {/* Featured Plugins Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-2">Featured Plugins</h2>
            <p className="text-gray-500">Hand-picked premium resources for your servers.</p>
          </div>
          <button 
            onClick={() => navigate('/plugins')}
            className="hidden md:flex items-center gap-1 text-[#2196F3] hover:text-[#1976D2] font-medium transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          {MOCK_FEATURED.map((plugin) => (
            <div key={plugin.id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <PluginCard plugin={plugin} />
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center md:hidden">
          <button 
            onClick={() => navigate('/plugins')}
            className="inline-flex items-center gap-1 text-[#2196F3] font-medium"
          >
            View all plugins <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">Are you a developer?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start selling your plugins today and reach thousands of server owners looking for premium resources.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-[#1A1A2E] text-white rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors shadow-lg"
          >
            Become a Seller
          </button>
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
