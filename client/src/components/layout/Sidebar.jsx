import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Search, MessageSquare, Settings, User, X, Briefcase, Sparkles, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white';
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-950/95 backdrop-blur-2xl z-50 shadow-2xl border-r border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col text-white ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2 font-black text-lg">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">MF</div>
            <span>MinoForge</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 hide-scrollbar">
          {user && (
            <div className="px-3 py-3 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-bold text-blue-400 overflow-hidden text-xs flex-shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white text-sm truncate">{user.username}</p>
                <span className="text-[11px] text-blue-400 font-semibold block truncate">Verified Member</span>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            <Link to="/" onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive('/')}`}>
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/plugins" onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive('/plugins')}`}>
              <Search className="w-4 h-4" /> Marketplace
            </Link>
            <Link to="/bounties" onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive('/bounties')}`}>
              <Briefcase className="w-4 h-4 text-amber-400" /> Bounties & Requests
            </Link>
            <Link to="/ai-config" onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive('/ai-config')}`}>
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI Config Tool
            </Link>

            <div className="pt-5 pb-2 px-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Creator Portal</p>
            </div>
            <Link to="/dashboard" onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive('/dashboard')}`}>
              <User className="w-4 h-4" /> Creator Dashboard
            </Link>
            <Link to="/upload" onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive('/upload')}`}>
              <Plus className="w-4 h-4 text-emerald-400" /> Upload Plugin
            </Link>
            <Link to="/staff/reviews" onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive('/staff/reviews')}`}>
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Staff Reviews
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
