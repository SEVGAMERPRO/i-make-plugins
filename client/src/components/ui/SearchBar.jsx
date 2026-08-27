import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, placeholder = "Search plugins, scripts, or games...", initialValue = "", suggestions = [] }) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter games based on current query
  const trimmed = query.trim().toLowerCase();
  const filteredSuggestions = trimmed === ''
    ? []
    : suggestions.filter(s => s.name.toLowerCase().includes(trimmed)).slice(0, 6);

  // Auto-completion text prediction (e.g. typing "the i" -> suggests "The Isle: Evrima")
  const topMatch = filteredSuggestions.length > 0 ? filteredSuggestions[0] : null;
  const isPrefixMatch = topMatch && topMatch.name.toLowerCase().startsWith(trimmed);
  const completionSuffix = isPrefixMatch ? topMatch.name.slice(query.length) : '';

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
      handleSelectGame(filteredSuggestions[selectedIndex]);
      return;
    }
    if (query.trim()) {
      setIsFocused(false);
      onSearch(query.trim());
    }
  };

  const handleSelectGame = (game) => {
    setQuery("");
    setIsFocused(false);
    navigate(`/games/${game.slug}`);
  };

  const handleKeyDown = (e) => {
    // Tab key completion
    if (e.key === 'Tab') {
      if (topMatch && trimmed.length > 0) {
        e.preventDefault();
        setQuery(topMatch.name);
      }
    }
    // Arrow down
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsFocused(true);
      setSelectedIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    }
    // Escape
    else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-50">
      {/* Outer Glow Wrapper */}
      <div className={`relative transition-all duration-300 rounded-2xl ${isFocused ? 'ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/20' : 'shadow-xl'}`}>
        <form onSubmit={handleSubmit} className="flex items-center w-full bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden p-1.5 focus-within:border-blue-500 transition-all">
          <div className="flex items-center pl-4 pr-2 text-blue-400">
            <Search className="w-5 h-5" />
          </div>

          <div className="relative flex-grow flex items-center">
            {/* Main Input */}
            <input
              ref={inputRef}
              type="text"
              className="w-full py-3 md:py-3.5 px-2 bg-transparent text-white placeholder-slate-400 text-base md:text-lg outline-none font-medium z-10"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
            />

            {/* Ghost completion text behind input */}
            {isFocused && completionSuffix && (
              <div className="absolute left-2 text-base md:text-lg font-medium pointer-events-none select-none z-0 text-slate-500 whitespace-pre">
                <span className="opacity-0">{query}</span>
                <span>{completionSuffix}</span>
              </div>
            )}
          </div>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Tab hint pill if completion is available */}
          {isFocused && topMatch && trimmed.length > 0 && isPrefixMatch && (
            <button
              type="button"
              onClick={() => setQuery(topMatch.name)}
              className="hidden sm:flex items-center gap-1 text-xs text-blue-300 bg-blue-500/20 border border-blue-400/30 px-2 py-1 rounded-md mr-2 select-none hover:bg-blue-500/30 transition-colors"
            >
              <span>Tab</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          )}

          {/* Search Action Button */}
          <button
            type="submit"
            className="btn-glow-blue btn-shimmer btn-animated px-6 md:px-7 py-3 md:py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4 text-blue-200" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && query.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-fade-in divide-y divide-white/5">
          {filteredSuggestions.length > 0 ? (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between bg-slate-800/50">
                <span>Matching Games</span>
                <span className="text-[10px] text-slate-500">Use ↑↓ keys + Enter</span>
              </div>
              <ul className="py-1">
                {filteredSuggestions.map((game, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <li
                      key={game.slug}
                      onClick={() => handleSelectGame(game)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-blue-600/30 text-white' : 'hover:bg-white/5 text-slate-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-slate-800 flex items-center justify-center p-1">
                          <img src={game.logo || game.image} alt={game.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm md:text-base text-white">{game.name}</p>
                          <p className="text-xs text-slate-400">View game plugins & mods</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
                          Browse <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {/* Quick search query fallback */}
          <div
            onClick={() => handleSubmit()}
            className="px-4 py-3 cursor-pointer hover:bg-white/5 flex items-center gap-3 text-slate-300 text-sm transition-colors"
          >
            <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Search all marketplace plugins for <strong className="text-white">"{query}"</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
