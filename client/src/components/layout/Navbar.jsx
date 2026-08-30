import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, User, Settings, LogOut, Package, Plus, Sparkles, Briefcase, 
  ShieldAlert, ShieldCheck, Crown, Megaphone, Compass, ShoppingCart, 
  MessageSquare, Bot, ChevronDown, Rocket, Bookmark, Key, Heart, 
  Smile, Check, ExternalLink, Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationBell from '../ui/NotificationBell';
import CurrencySwitcher from '../ui/CurrencySwitcher';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // User Custom Status
  const [userStatus, setUserStatus] = useState(() => {
    return localStorage.getItem('minoforge_user_status') || '';
  });
  const [statusInput, setStatusInput] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Top of page: always show with original navbar background
      if (currentScrollY <= 15) {
        setIsVisible(true);
        setIsScrolled(false);
      } 
      // Scrolling DOWN -> Hide the top bar smoothly
      else if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
        setIsVisible(false);
        setIsScrolled(true);
        setDropdownOpen(false); // Close dropdown if scrolling down
      } 
      // Scrolling UP -> Reveal the top bar with floating glass & glow!
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
        setIsScrolled(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveStatus = (e) => {
    if (e) e.preventDefault();
    if (!statusInput.trim()) {
      localStorage.removeItem('minoforge_user_status');
      setUserStatus('');
    } else {
      localStorage.setItem('minoforge_user_status', statusInput.trim());
      setUserStatus(statusInput.trim());
    }
    setIsEditingStatus(false);
    setStatusInput('');
  };

  const isActive = (path) => {
    return location.pathname === path;
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
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
    } ${
      isScrolled 
        ? 'nav-glass-scrolled bg-[#0b0f19]/90 shadow-2xl backdrop-blur-xl border-b border-cyan-500/20' 
        : 'bg-[#0b0f19]/95 backdrop-blur-md border-b border-white/5 shadow-md'
    }`}>
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Left Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={onMenuClick}
            className="btn-animated p-2 -ml-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl md:hidden transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/" className="flex items-center gap-2.5 group py-1">
            <div className="w-9 h-9 rounded-xl bg-slate-950/90 border border-white/15 p-0.5 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-105 group-hover:border-cyan-400 transition-all">
              <img src="/favicon.png" alt="Mino on Anvil" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-cyan-300 transition-all">
                MinoForge
              </span>
            </div>
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
              <span>Config Generator</span>
            </Link>
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Creator Hub
            </Link>
          </div>
        </div>

        {/* Right User Actions & Popover Menu */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          
          {/* ✨ Become a Creator Button (Exact location circled in user screenshot) */}
          <Link
            to="/become-creator"
            className="btn-animated hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 hover:from-cyan-500/30 hover:via-blue-500/30 hover:to-purple-500/30 text-cyan-300 hover:text-white border border-cyan-400/40 hover:border-cyan-300 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/10 transition-all cursor-pointer mr-1"
            title="Join our verified creators and monetize your plugins"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Become a Creator</span>
          </Link>

          {/* Currency Switcher (Desktop only; mobile uses drawer & footer) */}
          <div className="hidden sm:block">
            <CurrencySwitcher />
          </div>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-xl transition-all cursor-pointer"
            aria-label="Shopping Cart"
            title="View Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 text-slate-300 hover:text-blue-400 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Top-Bar Button: Switches dynamically from 'Go Ultimate' to 'Your Ultimate' */}
          {isUltimate ? (
            <Link
              to="/ultimate"
              className="btn-shimmer btn-animated hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/30 border border-amber-300/80 hover:border-amber-200 transition-all cursor-pointer"
              title="Manage Your Ultimate Membership"
            >
              <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span>Your Ultimate</span>
            </Link>
          ) : (
            <Link
              to="/upgrade"
              className="btn-shimmer btn-animated hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/25 border border-cyan-400/40 hover:border-cyan-300 transition-all cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span>Go Ultimate</span>
            </Link>
          )}

          {!user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link 
                to="/login" 
                className="btn-animated text-slate-300 hover:text-white font-bold text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="btn-glow-blue btn-shimmer btn-animated bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 rounded-xl whitespace-nowrap shadow-sm"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              
              {/* User Profile Pill / Button */}
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 py-1 px-2 rounded-xl border transition-all cursor-pointer ${
                  dropdownOpen 
                    ? 'bg-slate-800 border-cyan-400/60 shadow-lg shadow-cyan-500/20' 
                    : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="relative">
                  <div className={`w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-cyan-300 overflow-hidden text-xs border ${
                    isUltimate ? 'border-amber-400/80 shadow-md shadow-amber-500/20' : 'border-white/10'
                  }`}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  {/* Golden Crown on Avatar Top-Left (Exact spot user circled in image 1) */}
                  {isUltimate && (
                    <div className="absolute -top-2.5 -left-2.5 z-10 filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.9)] animate-bounce-subtle pointer-events-none">
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400 -rotate-12" />
                    </div>
                  )}

                  {/* Online Green Dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-slate-950 rounded-full" />
                </div>
                <span className="text-xs font-bold text-white max-w-[90px] sm:max-w-[120px] truncate hidden xs:inline-block">
                  {user.username}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {/* RICH BUILTBYBIT-STYLE USER PROFILE POPOVER DROPDOWN */}
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setDropdownOpen(false)}
                  />

                  {/* Popover Card with Top Pointer Arrow */}
                  <div className="absolute right-0 mt-3 w-[calc(100vw-24px)] max-w-[360px] sm:max-w-[390px] bg-slate-950/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-cyan-500/30 z-30 divide-y divide-white/5 animate-fade-in text-xs overflow-hidden">
                    
                    {/* Top Pointer Arrow */}
                    <div className="absolute -top-2 right-4 sm:right-6 w-4 h-4 bg-slate-950 border-t border-l border-cyan-500/30 transform rotate-45" />

                    {/* Section 1: User Profile & Identity Banner */}
                    <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900/90 to-slate-950 flex items-start gap-3 sm:gap-4">
                      
                      {/* Avatar with Glow & Online Status */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl bg-slate-900 border-2 ${isUltimate ? 'border-amber-400 shadow-lg shadow-amber-500/30' : 'border-cyan-400/40 shadow-lg shadow-cyan-500/20'} p-0.5 overflow-hidden flex items-center justify-center text-cyan-300 font-black text-xl`}>
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span>{user.username?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        {/* Ultimate Golden Crown on Big Avatar */}
                        {isUltimate && (
                          <div className="absolute -top-3.5 -left-3.5 z-10 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.9)] animate-bounce-subtle pointer-events-none">
                            <Crown className="w-6 h-6 text-amber-400 fill-amber-400 -rotate-12" />
                          </div>
                        )}

                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[8px] font-black rounded-md uppercase tracking-wider shadow">
                          ONLINE
                        </span>
                      </div>

                      {/* Name, Role & Real Stats */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className={`font-black text-sm truncate ${isUltimate ? 'text-amber-300' : 'text-white'}`}>
                            {user?.username && user.username.toLowerCase() !== 'user' 
                              ? user.username 
                              : (user?.email ? user.email.split('@')[0] : 'Community Member')}
                          </h3>
                          {isUltimate ? (
                            <span className="text-amber-400 text-xs font-black" title="Ultimate Verified VIP">👑</span>
                          ) : (
                            <span className="text-cyan-400 text-xs">✓</span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isUltimate && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black rounded-md flex items-center gap-1 shadow-sm">
                              <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span>Ultimate VIP</span>
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                            user.role === 'ADMIN' 
                              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                              : user.role === 'CREATOR'
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                              : user.role === 'STAFF'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                          }`}>
                            {user.role === 'ADMIN' ? '👑 Staff Admin' : user.role === 'CREATOR' ? '🎨 Verified Creator' : user.role === 'STAFF' ? '🛡️ Staff Mod' : 'Verified Member'}
                          </span>
                        </div>

                        {/* Status text if present */}
                        {userStatus ? (
                          <p className="text-[11px] text-cyan-200/90 italic truncate pt-0.5 flex items-center gap-1">
                            <span>💬</span>
                            <span>"{userStatus}"</span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-500 truncate pt-0.5">
                            No status set
                          </p>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400 font-mono">
                          <span>Plugins: <strong className="text-white font-bold">0</strong></span>
                          <span>Feedback: <strong className="text-emerald-400 font-bold">100%</strong></span>
                          <span>Reactions: <strong className="text-cyan-300 font-bold">0</strong></span>
                        </div>
                      </div>

                    </div>

                    {/* Section 2: Two-Column Quick Actions (BuiltByBit Style Refined) */}
                    <div className="p-3 sm:p-4 grid grid-cols-2 gap-1.5 sm:gap-2 bg-slate-950/80">
                      
                      {/* Left Column */}
                      <div className="space-y-1">
                        <Link 
                          to="/dashboard" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Package className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span className="truncate">Your Content</span>
                        </Link>
                        
                        <Link 
                          to="/settings?tab=profile" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">Account Details</span>
                        </Link>

                        <Link 
                          to="/settings?tab=security" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">Password &amp; 2FA</span>
                        </Link>

                        <Link 
                          to="/privacy" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">Privacy &amp; Rules</span>
                        </Link>

                        <Link 
                          to="/settings?tab=notifications" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Sliders className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span className="truncate">Preferences</span>
                        </Link>

                        {isUltimate ? (
                          <Link 
                            to="/ultimate" 
                            className="flex items-center gap-2 px-2.5 py-2 text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl transition-colors font-bold"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="truncate">Your Ultimate Hub</span>
                          </Link>
                        ) : (
                          <Link 
                            to="/upgrade" 
                            className="flex items-center gap-2 px-2.5 py-2 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl transition-colors font-bold"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="truncate">Go Ultimate</span>
                          </Link>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-1">
                        <Link 
                          to="/plugins" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Bookmark className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">Watched Plugins</span>
                        </Link>

                        <Link 
                          to="/discord" 
                          className="flex items-center gap-2 px-2.5 py-2 text-indigo-300 hover:text-white hover:bg-[#5865F2]/20 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Bot className="w-3.5 h-3.5 text-[#5865F2] flex-shrink-0" />
                          <span className="truncate">Link Discord</span>
                        </Link>

                        <Link 
                          to="/ai-config" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">Config Generator</span>
                        </Link>

                        <Link 
                          to="/bounties" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Briefcase className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">Custom Bounties</span>
                        </Link>

                        <Link 
                          to="/ads" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Megaphone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">Promote ($5 Free)</span>
                        </Link>

                        <Link 
                          to="/settings?tab=profile" 
                          className="flex items-center gap-2 px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Smile className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span className="truncate">Change Bio</span>
                        </Link>
                      </div>

                    </div>

                    {/* Section 3: Interactive "Update your status..." Bar & Logout */}
                    <div className="p-4 bg-slate-950 space-y-3">
                      
                      {/* Status Input Field */}
                      {isEditingStatus ? (
                        <form onSubmit={handleSaveStatus} className="flex gap-2">
                          <input
                            type="text"
                            autoFocus
                            maxLength={60}
                            placeholder="What are you working on?"
                            value={statusInput}
                            onChange={(e) => setStatusInput(e.target.value)}
                            className="flex-1 bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingStatus(false)}
                            className="px-2 py-2 text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setStatusInput(userStatus);
                            setIsEditingStatus(true);
                          }}
                          className="w-full text-left p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/30 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-all flex items-center justify-between group"
                        >
                          <span className="truncate">
                            {userStatus ? `"${userStatus}"` : 'Update your status...'}
                          </span>
                          <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            Edit
                          </span>
                        </button>
                      )}

                      {/* Log Out Button */}
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>

                    </div>

                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
