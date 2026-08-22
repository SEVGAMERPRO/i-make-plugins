import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ slug, name, gradient, icon }) => {
  return (
    <Link 
      to={`/games/${slug}`} 
      className="group relative block w-40 h-48 md:w-48 md:h-56 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex-shrink-0"
    >
      <div 
        className="absolute inset-0 transition-all duration-300 group-hover:brightness-110"
        style={{ background: gradient }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Game icon/emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl md:text-6xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-lg">
          {icon}
        </span>
      </div>

      {/* Game name */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        <h3 className="text-white font-bold text-sm md:text-base text-center drop-shadow-lg">
          {name}
        </h3>
      </div>
    </Link>
  );
};

export default GameCard;
