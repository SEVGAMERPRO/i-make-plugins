import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, Sparkles, ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PluginCard = ({ plugin }) => {
  const { addToCart, isInCart } = useCart();
  const isFree = parseFloat(plugin.price || 0) === 0 || plugin.price === '0.00';
  const imgUrl = plugin.coverImageUrl || plugin.imageUrl || '/images/plugins/minecraft_economy_gui.svg';
  const inCart = isInCart(plugin.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plugin, true);
  };

  return (
    <Link 
      to={`/plugins/${plugin.id}`} 
      className="block group bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-blue-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div className="aspect-[16/9] w-full bg-slate-950 relative overflow-hidden">
        <img 
          src={imgUrl} 
          alt={plugin.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-[11px] font-extrabold text-blue-300 border border-white/10 shadow-lg">
            {plugin.gameName || plugin.game || 'Plugin'}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleQuickAdd}
            className={`p-1.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
              inCart 
                ? 'bg-emerald-500/90 border-emerald-400 text-slate-950' 
                : 'bg-slate-900/90 hover:bg-blue-600 border-white/10 text-slate-300 hover:text-white'
            }`}
            title={inCart ? 'Already in cart' : 'Add to cart'}
            aria-label="Add to cart"
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
          
          <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-sm font-black text-emerald-400 border border-emerald-500/30 shadow-lg">
            {isFree ? 'Free' : `$${plugin.price}`}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-extrabold text-white text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
            {plugin.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {plugin.summary || 'High-performance plugin with instant installation and active developer updates.'}
          </p>
        </div>
        
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{plugin.rating || '5.0'}</span>
            <span className="text-slate-500">({plugin.downloads || 0} downloads)</span>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PluginCard;
