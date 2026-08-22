import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Filter, Search, PackageOpen, Upload, Megaphone, Sparkles } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import PluginCard from '../components/ui/PluginCard';
import SponsoredPluginCard from '../components/ui/SponsoredPluginCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getPlugins } from '../services/api';

const GAMES = ['All Categories', 'Minecraft', 'Roblox', 'FiveM', 'Discord', 'Websites'];

const SPONSORED_PLUGINS = [
  {
    id: 'p-mine-1',
    title: 'Ultimate Economy & Multi-Vault Pro',
    game: 'Minecraft',
    price: '4.99',
    rating: '4.9',
    reviewsCount: 142,
    downloads: 4820,
    coverImageUrl: '/images/categories/minecraft.png',
    summary: 'Multi-currency vault system with GUI ATMs, pin codes, and instant transaction logs.'
  },
  {
    id: 'p-fivem-2',
    title: 'Advanced Fuel & Electric Charging System',
    game: 'FiveM',
    price: '3.49',
    rating: '4.8',
    reviewsCount: 88,
    downloads: 2150,
    coverImageUrl: '/images/categories/fivem.png',
    summary: 'Realistic gas stations, EV chargers, jerry cans, and smooth 60fps UI for QBCore & ESX.'
  }
];

const PluginsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialSearch = searchParams.get('search') || '';
  const [loading, setLoading] = useState(true);
  const [plugins, setPlugins] = useState([]);
  
  // Filters
  const [selectedGame, setSelectedGame] = useState(searchParams.get('game') || 'All Categories');
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
  const [sortBy, setSortBy] = useState('newest'); // newest, popular, price_asc, price_desc
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (initialSearch) params.search = initialSearch;
    if (selectedGame !== 'All Categories') params.game = selectedGame;
    if (priceFilter !== 'all') params.price = priceFilter;
    if (sortBy) params.sort = sortBy;

    // Fetch real plugins from API
    getPlugins(params)
      .then(res => {
        setPlugins(res.data?.plugins || res.data || []);
      })
      .catch(() => {
        setPlugins([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialSearch, selectedGame, priceFilter, sortBy]);

  const handleSearch = (query) => {
    searchParams.set('search', query);
    setSearchParams(searchParams);
  };

  const updateGame = (game) => {
    setSelectedGame(game);
    if (game === 'All Categories') {
      searchParams.delete('game');
    } else {
      searchParams.set('game', game);
    }
    setSearchParams(searchParams);
  };

  // Filter sponsored plugins based on selected game category
  const filteredSponsored = selectedGame === 'All Categories'
    ? SPONSORED_PLUGINS
    : SPONSORED_PLUGINS.filter(sp => sp.game.toLowerCase() === selectedGame.toLowerCase());

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Browse Marketplace</h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">Find verified plugins, scripts, and developer resources</p>
          </div>
          <div className="w-full md:w-96">
            <SearchBar onSearch={handleSearch} initialValue={initialSearch} placeholder="Search plugins..." />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-slate-900 border border-white/10 rounded-xl font-medium text-white"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" /> Filters & Sorting
          </button>

          {/* Sidebar Filters */}
          <div className={`w-full lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'} space-y-6`}>
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-5 sticky top-24 space-y-6">
              
              <div>
                <h3 className="font-bold text-slate-400 mb-3 uppercase text-xs tracking-wider">Game Category</h3>
                <div className="space-y-1.5">
                  {GAMES.map(game => (
                    <button 
                      key={game}
                      onClick={() => updateGame(game)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedGame === game ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                    >
                      <span>{game}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-400 mb-3 uppercase text-xs tracking-wider">Price</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'free', 'paid'].map(price => (
                    <button
                      key={price}
                      onClick={() => setPriceFilter(price)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center ${priceFilter === price ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-400 mb-3 uppercase text-xs tracking-wider">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 text-slate-200 text-xs font-bold rounded-xl focus:ring-2 focus:ring-blue-500 block p-2.5 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {/* Creator Ad Promotion CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Promote Your Plugin</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Want your plugin pinned upfront? Use your $5/mo free Ultimate ad credits.
                </p>
                <Link
                  to="/ads"
                  className="block text-center py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition-colors"
                >
                  Launch Ad Campaign
                </Link>
              </div>

            </div>
          </div>

          {/* Main Results Grid */}
          <div className="flex-1 space-y-8">
            
            {/* Top Promoted Sponsored Ads */}
            {filteredSponsored.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                      Promoted Sponsored Listings
                    </h2>
                  </div>
                  <Link to="/ads" className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors">
                    Advertise here &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredSponsored.map(sp => (
                    <SponsoredPluginCard key={sp.id} plugin={sp} />
                  ))}
                </div>
              </div>
            )}

            {/* Standard Organic Results */}
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                All Listings ({plugins.length})
              </h2>

              {loading ? (
                <LoadingSpinner />
              ) : plugins.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {plugins.map(plugin => (
                    <PluginCard key={plugin.id} plugin={plugin} />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/60 rounded-3xl border border-white/10 p-12 text-center max-w-xl mx-auto">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
                    <PackageOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No organic listings found</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {initialSearch 
                      ? `No organic results matched "${initialSearch}". Try a different keyword or check your filters.` 
                      : 'Be the first developer to publish a plugin in this category on MinoForge!'}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link
                      to="/upload"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400 transition-all"
                    >
                      <Upload className="w-4 h-4" /> Upload a Plugin
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PluginsPage;
