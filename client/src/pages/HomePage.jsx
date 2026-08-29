import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/ui/SearchBar';
import GameCard from '../components/ui/GameCard';
import CustomPluginRequestModal from '../components/ui/CustomPluginRequestModal';
import StarRating from '../components/ui/StarRating';
import { Zap, Shield, Code, Users, Sparkles, TrendingUp, Download, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, AlertCircle, Star, MessageSquare, Plus, CheckCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const GAMES = [
  { slug: 'minecraft', name: 'Minecraft', image: '/images/categories/minecraft.png', accentColor: '#4CAF50' },
  { slug: 'roblox', name: 'Roblox', image: '/images/categories/roblox.png', accentColor: '#E53935' },
  { slug: 'fivem', name: 'FiveM', image: '/images/categories/fivem.png', accentColor: '#FF9800' },
  { slug: 'discord', name: 'Discord', image: '/images/categories/discord.png', accentColor: '#5865F2' },
  { slug: 'websites', name: 'Websites', image: '/images/categories/websites.png', accentColor: '#00D2FF' },
];

const HERO_IMAGES = [
  '/images/categories/minecraft.png',
  '/images/categories/fivem.png',
  '/images/categories/roblox.png',
  '/images/categories/discord.png',
  '/images/categories/websites.png',
];

export default function HomePage() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [bgIndex, setBgIndex] = useState(0);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [featuredPlugins, setFeaturedPlugins] = useState([]);
  
  // Platform Reviews State
  const [platformReviews, setPlatformReviews] = useState([]);
  const [platformAvgRating, setPlatformAvgRating] = useState(4.9);
  const [platformTotalReviews, setPlatformTotalReviews] = useState(3);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5.0);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  const fetchPlatformReviews = async () => {
    try {
      const res = await axios.get('/api/reviews/platform');
      if (res.data?.success) {
        setPlatformReviews(res.data.reviews || []);
        if (res.data.averageRating) setPlatformAvgRating(res.data.averageRating);
        if (res.data.totalReviews !== undefined) setPlatformTotalReviews(res.data.totalReviews);
      }
    } catch {}
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/plugins/featured');
        if (res.data && Array.isArray(res.data)) {
          setFeaturedPlugins(res.data);
        }
      } catch (err) {}
    };
    fetchFeatured();
    fetchPlatformReviews();
    const interval = setInterval(fetchFeatured, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePostPlatformReview = async (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    setReviewSubmitting(true);
    setReviewErrorMsg('');
    setReviewSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewErrorMsg('Please log in to submit a platform review.');
        setReviewSubmitting(false);
        return;
      }
      const res = await axios.post('/api/reviews/platform', {
        rating: newReviewRating,
        title: newReviewTitle.trim() || 'MinoForge Experience',
        comment: newReviewComment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setReviewSuccessMsg('⭐ Thank you for your feedback! Your review is live.');
        setNewReviewComment('');
        setNewReviewTitle('');
        fetchPlatformReviews();
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      setReviewErrorMsg(err.response?.data?.message || 'Failed to submit review. Please ensure you are logged in.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    // 9-second cinematic hero background crossfade
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query) => {
    navigate(`/plugins?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex-grow flex flex-col bg-[#0b0f19] text-white">
      {/* Hero Section */}
      <div className="relative pt-20 sm:pt-24 pb-40 sm:pb-52 px-3 sm:px-4 min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col items-center justify-center overflow-visible">
        {/* Animated In-Game Hero Wallpapers */}
        {HERO_IMAGES.map((bg, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: idx === bgIndex ? 0.4 : 0,
              zIndex: 0,
            }}
          />
        ))}

        {/* Cinematic dark gradient overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b0f19]/85 via-[#0b0f19]/65 to-[#0b0f19] pointer-events-none" />

        {/* Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 z-[1] opacity-10 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }} 
        />

        {/* Hero Content */}
        <div className="relative z-30 w-full max-w-4xl mx-auto text-center animate-fade-in px-2">
          {/* Note: Website Heavy Development Notice Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 backdrop-blur-md rounded-2xl text-xs md:text-sm text-amber-300 font-medium mb-4 border border-amber-500/30 shadow-lg shadow-amber-500/10 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-left text-xs md:text-sm leading-snug">
              <strong className="text-amber-300 uppercase tracking-wide mr-1 font-bold">Note:</strong>
              This website is still under heavy development, and some subscription features aren't fully active yet!
            </span>
          </div>

          <br />

          {/* Marketplace Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 backdrop-blur-md rounded-full text-xs sm:text-sm text-blue-300 font-semibold mb-4 sm:mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span>The #1 Game Plugin &amp; Mod Marketplace</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Find the best plugins
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              for your favorite games
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Discover, download, and sell high-performance plugins for Minecraft, FiveM, Rust, and more.
          </p>

          {/* Upgraded Glassmorphism Search Bar */}
          <div className="max-w-2xl mx-auto mb-5 sm:mb-6 relative z-50">
            <SearchBar onSearch={handleSearch} suggestions={GAMES} />
          </div>

          {/* Popular Quick Search Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs md:text-sm">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1 text-[11px] sm:text-xs">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" /> Popular:
            </span>
            {['Economy', 'Staff Admin', 'PvP Kits', 'Anti-Cheat', 'Custom Vehicles', 'Discord Sync'].map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="btn-tag-animated text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/25 border border-white/10 hover:border-blue-400/50 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium shadow-sm transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 100% Seamless Endless Moving Game Categories Marquee */}
        <div className="absolute -bottom-20 sm:-bottom-24 md:-bottom-28 left-0 right-0 z-20 px-1 sm:px-4 pointer-events-none">
          <div className="max-w-7xl mx-auto relative group/carousel pointer-events-auto overflow-hidden">
            {/* Seamless Endless Infinite Moving Track */}
            <div className="overflow-hidden pb-4 pt-2 px-2 select-none w-full">
              <div className="animate-marquee-infinite flex gap-2.5 sm:gap-4">
                {/* First Half */}
                {[...GAMES, ...GAMES].map((game, index) => (
                  <GameCard key={`${game.slug}-a-${index}`} {...game} />
                ))}
                {/* Second Half (Exact Mirror for 100% Seamless Infinite Loop) */}
                {[...GAMES, ...GAMES].map((game, index) => (
                  <GameCard key={`${game.slug}-b-${index}`} {...game} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for overlapping game cards */}
      <div className="h-24 sm:h-32 md:h-36 bg-[#0b0f19]" />

      {/* Sponsored & Promoted Plugins Spotlight Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Featured & Sponsored Spotlight</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/ads')}
            className="btn-animated text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 group"
          >
            <span>Promote Your Plugin</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlugins.map(plugin => (
            <div 
              key={plugin.id}
              onClick={() => navigate(`/plugins/${plugin.id}`)}
              className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/40 hover:border-amber-400 p-6 shadow-2xl transition-all duration-300 cursor-pointer group space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  PROMOTED
                </span>
                <span className="text-xs font-bold text-emerald-400">{formatPrice(plugin.price)}</span>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 relative">
                <img 
                  src={plugin.coverImageUrl || '/images/plugins/minecraft_economy_gui.svg'} 
                  alt={plugin.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                  {plugin.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {plugin.summary || plugin.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG CUSTOM PLUGIN REQUEST CTA BANNER */}
      <section className="py-8 px-4 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border-2 border-blue-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 max-w-2xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-black rounded-full border border-blue-500/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Development Studio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Want us to make custom plugins?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have an idea for a unique Minecraft mechanic, FiveM script, or Discord bot? Fill in a quick request and our team will build and test it for you!
            </p>
          </div>

          <div className="z-10 flex-shrink-0">
            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="btn-glow-blue btn-shimmer btn-animated py-4 px-8 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-base sm:text-lg rounded-2xl flex items-center gap-3 group"
            >
              <span>Order Custom Plugin</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* Why MinoForge Features Section */}
      <section className="py-20 px-4 bg-slate-900/50 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Why Server Owners Choose MinoForge
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              Everything you need to supercharge your gaming community in one secure platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5 text-blue-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Instant Delivery</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Download purchased plugins immediately with automated version updates.</p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-5 text-green-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Verified & Secure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Staff-reviewed code to guarantee zero malware, backdoors, or malicious exploits.</p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-5 text-purple-400">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Custom Plugin Requests</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Hire expert creators directly to code custom features for your server.</p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5 text-amber-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Active Community</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Connect with server admins, exchange configs, and get direct author support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ Platform Experience & Community Reviews Section (.1 Precision) */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0b0f19] via-slate-950 to-[#0b0f19] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header with Average Score & Review CTA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-amber-400 text-xs font-bold mb-3">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Verified Platform Reviews &amp; Ratings</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                What Creators &amp; Server Admins Say
              </h2>
              <p className="text-slate-400 mt-2 text-sm max-w-xl">
                Real feedback from community members building with MinoForge plugins, tools, and creator ecosystem.
              </p>
            </div>

            {/* Platform Score Snapshot & Add Review Button */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-900/90 border border-white/10 p-4 rounded-2xl shadow-xl">
              <div className="text-center sm:text-left pr-2 border-r border-white/10">
                <div className="text-3xl font-black text-amber-300 font-mono flex items-center gap-1.5">
                  <span>{platformAvgRating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <StarRating rating={platformAvgRating} size="sm" showValue={false} />
                <span className="text-[11px] text-slate-400 block mt-0.5">{platformTotalReviews} verified reviews</span>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write Website Review</span>
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <StarRating rating={rev.rating} size="sm" showValue={true} />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm mb-2 leading-snug">
                    "{rev.title}"
                  </h3>

                  <p className="text-slate-300 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs text-amber-300">
                    {rev.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">{rev.username}</span>
                      {rev.isUltimate && (
                        <span className="text-[10px] text-amber-400 font-black" title="Ultimate VIP">👑</span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>Verified Experience</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Supported Games Quick Grid */}
      <section className="py-20 px-4 bg-[#0b0f19]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
            Supporting All Major Gaming Platforms
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-sm md:text-base">
            From survival servers to roleplay communities, find tools specifically built for your platform.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {GAMES.map(game => (
              <button
                key={game.slug}
                onClick={() => navigate(`/games/${game.slug}`)}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-sm font-bold text-white hover:text-blue-300 transition-all border border-white/10 hover:border-blue-400/40 shadow-md"
              >
                <div className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                </div>
                <span>{game.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action for developers */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-950/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6 text-blue-400">
            <Download className="w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
            Are you a Plugin Developer?
          </h2>
          <p className="text-base md:text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Monetize your code and connect directly with server owners looking for premium plugins and custom development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Start Selling on MinoForge</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/plugins')}
              className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-xl font-bold text-lg transition-all border border-white/10 hover:border-white/20"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Write Platform Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  ⭐
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Rate Your Experience</h3>
                  <p className="text-xs text-slate-400">Share your thoughts on MinoForge performance and ecosystem.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostPlatformReview} className="space-y-4">
              {/* .1 Precision Star Rating Picker */}
              <div className="p-4 bg-slate-950/90 rounded-2xl border border-white/10 text-center space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Platform Rating (1.0 to 5.0 Stars)
                </label>
                <div className="flex flex-col items-center justify-center gap-2">
                  <StarRating 
                    rating={newReviewRating} 
                    size="xl" 
                    interactive={true} 
                    onChange={(val) => setNewReviewRating(val)}
                  />
                  <span className="text-xs text-amber-400 font-medium">
                    Slide or tap to adjust rating with .1 decimal precision
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Best marketplace experience with 0% fees"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Comment Message */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Feedback Message *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="What was your experience with downloads, speed, customer support, or plugins on MinoForge?"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {reviewSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{reviewSuccessMsg}</span>
                </div>
              )}

              {reviewErrorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{reviewErrorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Publishing...' : 'Publish Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      {/* Custom Plugin Request Modal */}
      <CustomPluginRequestModal 
        isOpen={isCustomRequestOpen} 
        onClose={() => setIsCustomRequestOpen(false)} 
      />
    </div>
  );
}
