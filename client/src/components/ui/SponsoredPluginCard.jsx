import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Megaphone, ArrowRight } from 'lucide-react';

const SponsoredPluginCard = ({ plugin }) => {
  const isFree = parseFloat(plugin.price || 0) === 0 || plugin.price === '0.00';

  return (
    <Link 
      to={`/plugins/${plugin.id}`}
      className="block relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/40 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
    >
      {/* Top Promoted Banner */}
      <div className="px-4 py-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-transparent border-b border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
          <Megaphone className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Sponsored Listing</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">Promoted</span>
      </div>

      {/* Media Image */}
      <div className="aspect-[16/9] w-full bg-slate-950 relative overflow-hidden">
        <img 
          src={plugin.coverImageUrl || '/images/plugins/minecraft_economy_gui.jpg'} 
          alt={plugin.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-[11px] font-extrabold text-blue-300 border border-white/10 shadow-lg">
            {plugin.game}
          </span>
        </div>

        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-sm font-black text-emerald-400 border border-emerald-500/30 shadow-lg">
            {isFree ? 'Free' : `$${plugin.price}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
            {plugin.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {plugin.summary || 'High performance server plugin with instant setup, verified security, and active updates.'}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <strong className="text-white">{plugin.rating || '5.0'}</strong>
            <span className="text-slate-400">({plugin.reviewsCount || 48})</span>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:text-amber-200">
            <span className="group-hover:translate-x-0.5 transition-transform">Open</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

    </Link>
  );
};

export default SponsoredPluginCard;
