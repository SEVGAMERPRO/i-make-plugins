import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ slug, name, image }) => {
  return (
    <Link 
      to={`/games/${slug}`} 
      className="group relative block w-36 h-48 sm:w-40 sm:h-52 md:w-44 md:h-56 lg:w-48 lg:h-60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0 border border-white/10 bg-slate-900"
    >
      {/* Game Image (Crisp & clearly visible) */}
      <img 
        src={image} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Subtle top vignette */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* Dark bottom gradient for legible text without obscuring the artwork */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent pointer-events-none" />

      {/* Game Name & Category */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
        <h3 className="text-white font-extrabold text-base md:text-lg leading-snug tracking-tight group-hover:text-blue-300 transition-colors drop-shadow-md">
          {name}
        </h3>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Plugins & Mods
        </p>
      </div>

      {/* Bottom Accent Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
};

export default GameCard;
