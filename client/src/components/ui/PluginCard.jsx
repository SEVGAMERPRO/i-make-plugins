import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const PluginCard = ({ plugin }) => {
  return (
    <Link to={`/plugins/${plugin.id}`} className="block group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-[16/9] w-full bg-gray-200 relative overflow-hidden">
        {plugin.imageUrl ? (
          <img src={plugin.imageUrl} alt={plugin.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <span className="text-gray-400 font-medium">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#1A1A2E] shadow-sm">
          {plugin.gameName}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-[#1A1A2E] line-clamp-1 group-hover:text-[#2196F3] transition-colors">{plugin.title}</h3>
          <span className="font-bold text-[#FF9800] ml-2 shrink-0">
            {plugin.price === 0 || plugin.price === '0.00' ? 'Free' : `$${plugin.price}`}
          </span>
        </div>
        
        <p className="text-sm text-[#6B7280] mb-3">by <span className="font-medium text-[#1A1A2E] hover:underline">{plugin.authorName}</span></p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
            <span className="text-sm font-medium text-[#1A1A2E]">{plugin.rating || 'New'}</span>
          </div>
          <span className="text-xs text-[#6B7280]">{plugin.downloads || 0} downloads</span>
        </div>
      </div>
    </Link>
  );
};

export default PluginCard;
