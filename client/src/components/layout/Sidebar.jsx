import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Search, MessageSquare, Settings, User, X, Briefcase, Sparkles, Plus, ShieldCheck, LogIn, UserPlus, LogOut, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CurrencySwitcher from '../ui/CurrencySwitcher';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white';
  };

  const isUltimate = (() => {
    try {
      if (user?.isUltimate || user?.role === 'CREATOR') return true;
      if (typeof window !== 'undefined' && window.localStorage) {
        if (localStorage.getItem('minoforge_ultimate_active') === 'true') return true;
        const raw = localStorage.getItem('minoforge_user');
        if (raw && typeof raw === 'string' && raw.includes('"isUltimate":true')) return true;
      }
    } catch (e) {}
    return false;
  })();

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
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950/98 backdrop-blur-2xl z-50 shadow-2xl border-r border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col text-white ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2 font-black text-lg">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 p-0.5 overflow-hidden flex items-center justify-center shadow-lg">
              <img src="/favicon.png" alt="MinoForge" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">MinoForge</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 hide-scrollbar">
          {/* Guest Auth Banner */}
          {!user ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-white/10 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Join MinoForge</span>
                <span className="text-[10px] text-cyan-400 font-semibold">Free Account</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm border border-white/10"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-300" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-3.5 py-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className={`w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-blue-400 overflow-hidden text-xs border ${
                    isUltimate ? 'border-amber-400 shadow-md shadow-amber-500/30' : 'border-white/10'
                  }`}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  {isUltimate && (
                    <div className="absolute -top-2 -left-2 z-10 filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.9)]">
                      <span className="text-sm">👑</span>
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-xs truncate flex items-center gap-1">
                    <span>{user.username}</span>
                    {isUltimate && <span className="text-amber-400 text-xs">👑</span>}
                  </p>
                  <span className="text-[10px] text-amber-400 font-semibold block truncate">
                    {isUltimate ? 'Ultimate Creator' : 'Verified Member'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {isUltimate ? (
              <Link to="/ultimate" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 transition-all mb-2 shadow-lg shadow-amber-500/10 active:scale-95">
                <span>👑</span> Your Ultimate Hub
              </Link>
            ) : (
              <Link to="/upgrade" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-blue-600/25 to-cyan-600/25 border border-blue-500/40 text-cyan-300 transition-all mb-2 shadow-lg shadow-blue-500/10 active:scale-95">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Go Ultimate
              </Link>
            )}

            <Link to="/" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/')}`}>
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/plugins" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/plugins')}`}>
              <Search className="w-4 h-4" /> Marketplace
            </Link>
            <Link to="/bounties" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/bounties')}`}>
              <Briefcase className="w-4 h-4 text-amber-400" /> Bounties & Requests
            </Link>
            <Link to="/ai-config" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/ai-config')}`}>
              <Sparkles className="w-4 h-4 text-cyan-400" /> Config Generator
            </Link>

            <div className="pt-4 pb-1.5 px-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Studio</p>
            </div>
            <Link to="/creators" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/creators')}`}>
              <Sparkles className="w-4 h-4 text-cyan-400" /> Become a Creator
            </Link>
            <Link to="/dashboard" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/dashboard')}`}>
              <User className="w-4 h-4" /> Creator Dashboard
            </Link>
            <Link to="/staff/reviews" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/staff/reviews')}`}>
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Staff Reviews
            </Link>
            <Link to="/settings" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isActive('/settings')}`}>
              <Settings className="w-4 h-4 text-cyan-400" /> Settings &amp; 2FA
            </Link>
          </nav>
        </div>

        {/* Bottom Currency Bar in Sidebar */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">Currency:</span>
          <CurrencySwitcher compact={true} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
