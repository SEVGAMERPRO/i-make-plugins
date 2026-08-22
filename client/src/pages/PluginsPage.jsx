import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import PluginCard from '../components/ui/PluginCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MOCK_PLUGINS = Array.from({ length: 12 }).map((_, i) => ({
  id: `p${i}`,
  title: `Awesome Plugin ${i + 1}`,
  authorName: 'DevMaster',
  gameName: i % 2 === 0 ? 'Minecraft' : 'FiveM',
  price: i % 3 === 0 ? '0.00' : (Math.random() * 20).toFixed(2),
  rating: (Math.random() * 2 + 3).toFixed(1),
  downloads: Math.floor(Math.random() * 5000),
  imageUrl: ''
}));

const GAMES = ['All Games', 'Minecraft', 'Roblox', 'Hytale', 'Garry\'s Mod', 'FiveM', 'Rust', 'ARK', 'Discord'];

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
    // Simulate API call
    setTimeout(() => {
      let filtered = [...MOCK_PLUGINS];
      
      // Apply search
      if (initialSearch) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(initialSearch.toLowerCase()));
      }
      
      // Apply game filter
      if (selectedGame !== 'All Games') {
        filtered = filtered.filter(p => p.gameName.toLowerCase() === selectedGame.toLowerCase());
      }
      
      // Apply price filter
      if (priceFilter === 'free') {
        filtered = filtered.filter(p => p.price === '0.00' || p.price === 0);
      } else if (priceFilter === 'paid') {
        filtered = filtered.filter(p => p.price !== '0.00' && p.price !== 0);
      }
      
      // Apply sort
      if (sortBy === 'popular') {
        filtered.sort((a, b) => b.downloads - a.downloads);
      } else if (sortBy === 'price_asc') {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortBy === 'price_desc') {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }
      
      setPlugins(filtered);
      setLoading(false);
    }, 600);
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
    <div className="bg-[#F5F7FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">Browse Plugins</h1>
            <p className="text-gray-500 mt-1">Discover the best resources for your server</p>
          </div>
          <div className="w-full md:w-96">
            <SearchBar onSearch={handleSearch} initialValue={initialSearch} placeholder="Search by name..." />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" /> Filters & Sorting
          </button>

          {/* Sidebar Filters */}
          <div className={`w-full lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 uppercase text-xs tracking-wider">Game</h3>
                <div className="space-y-2">
                  {GAMES.map(game => (
                    <label key={game} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="game" 
                        checked={selectedGame === game}
                        onChange={() => updateGame(game)}
                        className="text-[#2196F3] focus:ring-[#2196F3]"
                      />
                      <span className={`text-sm ${selectedGame === game ? 'text-[#1A1A2E] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {game}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 uppercase text-xs tracking-wider">Price</h3>
                <div className="space-y-2">
                  {['all', 'free', 'paid'].map(price => (
                    <label key={price} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="price" 
                        checked={priceFilter === price}
                        onChange={() => setPriceFilter(price)}
                        className="text-[#2196F3] focus:ring-[#2196F3]"
                      />
                      <span className={`text-sm capitalize ${priceFilter === price ? 'text-[#1A1A2E] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 uppercase text-xs tracking-wider">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#2196F3] focus:border-[#2196F3] block p-2.5 outline-none"
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No plugins found</h3>
                <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchParams({});
                    setSelectedGame('All Games');
                    setPriceFilter('all');
                  }}
                  className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {!loading && plugins.length > 0 && (
              <div className="mt-10 flex justify-center">
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded">Previous</button>
                  <button className="px-4 py-2 text-sm font-medium bg-[#2196F3] text-white rounded">1</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">2</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">3</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded">Next</button>
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
