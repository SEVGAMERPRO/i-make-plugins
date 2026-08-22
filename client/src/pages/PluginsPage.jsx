import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Filter, Search, PackageOpen, Upload } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import PluginCard from '../components/ui/PluginCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getPlugins } from '../services/api';

const GAMES = ['All Categories', 'Minecraft', 'Roblox', 'FiveM', 'Discord', 'Websites'];

const PluginsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialSearch = searchParams.get('search') || '';
  const [loading, setLoading] = useState(true);
  const [plugins, setPlugins] = useState([]);
  
  // Filters
  const [selectedGame, setSelectedGame] = useState(searchParams.get('game') || 'All Games');
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
  const [sortBy, setSortBy] = useState('newest'); // newest, popular, price_asc, price_desc
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (initialSearch) params.search = initialSearch;
    if (selectedGame !== 'All Games') params.game = selectedGame;
    if (priceFilter !== 'all') params.price = priceFilter;
    if (sortBy) params.sort = sortBy;

    // Fetch real plugins from API
    getPlugins(params)
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
  }, [initialSearch, selectedGame, priceFilter, sortBy]);

  const handleSearch = (query) => {
    searchParams.set('search', query);
    setSearchParams(searchParams);
  };

  const updateGame = (game) => {
    setSelectedGame(game);
    if (game === 'All Games') {
      searchParams.delete('game');
    } else {
      searchParams.set('game', game);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Browse Marketplace</h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">Find verified plugins, scripts, and developer resources</p>
          </div>
          <div className="w-full md:w-96">
            <SearchBar onSearch={handleSearch} initialValue={initialSearch} placeholder="Search plugins..." />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-slate-900 border border-white/10 rounded-xl font-medium text-white"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" /> Filters & Sorting
          </button>

          {/* Sidebar Filters */}
          <div className={`w-full lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-5 sticky top-24">
              
              <div className="mb-6">
                <h3 className="font-semibold text-slate-400 mb-3 uppercase text-xs tracking-wider">Game Category</h3>
                <div className="space-y-1.5">
                  {GAMES.map(game => (
                    <button 
                      key={game}
                      onClick={() => updateGame(game)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${selectedGame === game ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                    >
                      <span>{game}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-400 mb-3 uppercase text-xs tracking-wider">Price</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'free', 'paid'].map(price => (
                    <button
                      key={price}
                      onClick={() => setPriceFilter(price)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all text-center ${priceFilter === price ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-400 mb-3 uppercase text-xs tracking-wider">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 text-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block p-2.5 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

            </div>
          </div>

          {/* Plugin Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner />
            ) : plugins.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {plugins.map(plugin => (
                  <PluginCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/60 rounded-2xl border border-white/10 p-16 text-center max-w-xl mx-auto">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-400">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No plugins found</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {initialSearch 
                    ? `No results matched "${initialSearch}". Try a different keyword or check your filters.` 
                    : 'No plugins have been uploaded to this category yet. Be the first to list your plugin on MinoForge!'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button 
                    onClick={() => {
                      setSearchParams({});
                      setSelectedGame('All Games');
                      setPriceFilter('all');
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400 transition-all"
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
  );
};

export default PluginsPage;
