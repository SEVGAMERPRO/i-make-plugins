import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ slug, name, image }) => {
  return (
    <Link 
      to={`/games/${slug}`} 
      className="group relative block w-44 h-56 md:w-52 md:h-64 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2.5 flex-shrink-0 border border-white/10 bg-slate-900"
    >
      {/* Game in-game image */}
      <img 
        src={image} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Cinematic dark gradients for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300" />
      
      {/* Top subtle badge */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[11px] font-semibold text-blue-300 bg-blue-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-blue-500/30">
          Explore
        </span>
      </div>

      {/* Game name & details */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-extrabold text-lg md:text-xl text-left drop-shadow-md tracking-tight group-hover:text-blue-300 transition-colors duration-200">
          {name}
        </h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
          Plugins & Resources
        </p>
      </div>
      
      {/* Active Bottom Glow Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
};

export default GameCard;
