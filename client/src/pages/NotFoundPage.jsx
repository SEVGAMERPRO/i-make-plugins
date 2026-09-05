import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertOctagon, Home, Search, HelpCircle, ArrowLeft, Sparkles, Compass } from 'lucide-react';

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/plugins?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-[#0b0f19] min-h-[80vh] flex-grow flex items-center justify-center text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Glowing 404 Visual Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-red-600/30 rounded-2xl blur-2xl pointer-events-none" />
          <div className="relative w-28 h-28 mx-auto rounded-3xl bg-slate-900/90 border-2 border-red-500/30 flex items-center justify-center text-red-400 shadow-2xl shadow-red-500/10">
            <AlertOctagon className="w-14 h-14 animate-pulse text-red-400" />
          </div>
        </div>

        {/* Status code and title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold border border-red-500/20">
            <span>HTTP 404 ERROR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The requested path <code className="text-red-300 font-mono bg-red-950/40 px-2 py-0.5 rounded text-xs border border-red-500/20">{location.pathname}</code> does not exist, was moved, or an invalid URL was provided.
          </p>
        </div>

        {/* In-page Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins, games, resources..."
            className="w-full bg-slate-900/90 border border-white/15 rounded-2xl py-3.5 pl-11 pr-24 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="btn-animated btn-glow-blue absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
          >
            Search
          </button>
        </form>

        {/* Quick Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="btn-animated inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/plugins"
            className="btn-animated inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/10"
          >
            <Compass className="w-4 h-4" />
            <span>Browse All Plugins</span>
          </Link>

          <a
            href="mailto:minoforge.requests@gmail.com"
            className="btn-animated inline-flex items-center gap-2 px-5 py-3 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs rounded-xl border border-white/5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Report Broken Link</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
