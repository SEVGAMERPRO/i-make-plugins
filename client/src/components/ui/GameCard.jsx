import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ slug, name, colorClass }) => {
  return (
    <Link to={`/games/${slug}`} className="group relative block w-48 h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-colors"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg text-center shadow-sm">{name}</h3>
      </div>
    </Link>
  );
};

export default GameCard;
