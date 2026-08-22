import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ slug, name, logo, accentColor = '#2196F3' }) => {
  return (
    <Link 
      to={`/games/${slug}`} 
      className="group relative flex flex-col justify-between w-40 h-52 sm:w-44 sm:h-56 md:w-48 md:h-60 rounded-2xl overflow-hidden p-4 transition-all duration-300 transform hover:-translate-y-2.5 flex-shrink-0 border border-white/10 bg-gradient-to-b from-slate-800/90 to-slate-900/95 backdrop-blur-xl shadow-xl hover:shadow-2xl"
      style={{
        boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.5)`
      }}
    >
      {/* Dynamic Ambient Background Glow on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accentColor}, transparent 70%)`
        }}
      />

      {/* Subtle border highlight */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-white/20 transition-colors pointer-events-none" />

      {/* Top subtle category pill */}
      <div className="flex justify-between items-center z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
          Game
        </span>
        <span 
          className="w-2 h-2 rounded-full transition-all group-hover:scale-125"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
        />
      </div>

      {/* Centered Official Game Logo */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-2 px-1">
        <img 
          src={logo} 
          alt={name}
          className="max-h-16 md:max-h-20 max-w-[85%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Game Name & Metadata Footer */}
      <div className="relative z-10 pt-2 border-t border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm md:text-base leading-tight tracking-tight group-hover:text-blue-300 transition-colors">
            {name}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Plugins & Mods
          </p>
        </div>
      </div>

      {/* Bottom Glow Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
      />
    </Link>
  );
};

export default GameCard;
