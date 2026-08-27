import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, User, Settings, LogOut, Package, Plus, Sparkles, Briefcase, ShieldAlert, ShieldCheck, Crown, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../ui/NotificationBell';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-xl z-40 border-b border-white/10 flex items-center px-4 md:px-8 text-white">
      {/* Brand & Left Menu */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 text-xl font-black text-white tracking-tight">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
            MF
          </div>
          <span>MinoForge</span>
        </Link>

        {/* Desktop Quick Links */}
        <div className="hidden md:flex items-center gap-1 ml-6 text-sm font-semibold">
          <Link
            to="/plugins"
            className={`px-3.5 py-1.5 rounded-xl transition-colors ${isActive('/plugins') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            Marketplace
          </Link>
          <Link
            to="/bounties"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-colors ${isActive('/bounties') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Bounties</span>
          </Link>
          <Link
            to="/ai-config"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-colors ${isActive('/ai-config') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Config</span>
          </Link>
          <Link
            to="/upgrade"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-colors ${isActive('/upgrade') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-amber-400 hover:text-amber-300 hover:bg-white/5'}`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Ultimate</span>
          </Link>
          <Link
            to="/dashboard"
            className={`px-3.5 py-1.5 rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            Creator Hub
          </Link>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Notification Bell (Left of Become a Creator) */}
        <NotificationBell />

        <Link
          to="/creators"
          className="btn-shimmer btn-animated hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-600/30 hover:from-blue-600/40 hover:via-cyan-500/30 hover:to-blue-600/40 text-blue-200 hover:text-white rounded-xl text-xs font-bold border border-cyan-400/40 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Become a Creator</span>
        </Link>

        {!user ? (
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              className="btn-animated text-slate-300 hover:text-white font-bold text-sm px-3.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="btn-glow-blue btn-shimmer btn-animated bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm px-4 py-2 rounded-xl"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none ring-2 ring-blue-500/30 rounded-full p-0.5"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white overflow-hidden text-xs">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 z-20 py-2 divide-y divide-white/5 animate-fade-in text-sm">
                  <div className="px-4 py-2.5">
                    <p className="font-bold text-white truncate">{user.username}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-blue-400" /> Creator Dashboard
                    </Link>
                    <Link 
                      to="/upload" 
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Plus className="w-4 h-4 text-emerald-400" /> Upload Plugin
                    </Link>
                    <Link 
                      to="/ads" 
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Megaphone className="w-4 h-4 text-amber-400" /> Promote & Ads ($5 Credit)
                    </Link>
                    <Link 
                      to="/bounties" 
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Briefcase className="w-4 h-4 text-cyan-400" /> Custom Bounties
                    </Link>
                    <Link 
                      to="/staff/reviews" 
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" /> Staff Reviews
                    </Link>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
