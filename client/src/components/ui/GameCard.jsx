import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ slug, name, capsule, logo, bgImage, accentColor = '#2196F3' }) => {
  return (
    <Link 
      to={`/games/${slug}`} 
      className="group relative block w-60 h-36 sm:w-64 sm:h-38 md:w-72 md:h-44 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0 border border-white/10 bg-slate-900"
    >
      {/* Game Capsule / In-Game Art (Fitted so the full artwork is visible) */}
      <img 
        src={capsule || bgImage} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Subtle cinematic vignette around edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

      {/* Explore badge on hover */}
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <span className="text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-blue-400/30">
          Explore
        </span>
      </div>

      {/* Bottom metadata strip */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 flex items-center justify-between">
        <span className="text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-blue-300 transition-colors">
          {name}
        </span>
        <span className="text-[10px] font-medium text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
          Plugins
        </span>
      </div>

      {/* Bottom Accent Glow Indicator */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
      />
    </Link>
  );
};

export default GameCard;
