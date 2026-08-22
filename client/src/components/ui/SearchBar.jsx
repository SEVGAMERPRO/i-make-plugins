import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search plugins...", initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#2196F3] focus-within:border-transparent transition-all">
      <div className="flex items-center pl-4 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        className="w-full px-4 py-3 outline-none text-gray-700 bg-transparent placeholder-gray-400"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
