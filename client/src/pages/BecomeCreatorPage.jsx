import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, CreditCard, ShieldCheck, Star, Sparkles, Lock, MessageSquare, Unlock, Zap, ArrowRight, ChevronRight, Activity, LogIn, UserPlus } from 'lucide-react';
import CreateResourceModal from '../components/ui/CreateResourceModal';
import { useAuth } from '../context/AuthContext';

// Real creator counts starting strictly from zero (0)
const getRealCreatorCount = (gameName) => {
  try {
    const uploaded = JSON.parse(localStorage.getItem('minoforge_uploaded_plugins') || '[]');
    const matched = uploaded.filter(p => (p.game || p.gameName || '').toLowerCase() === gameName.toLowerCase());
    return matched.length; // Starts strictly at 0!
  } catch {
    return 0;
  }
};

const CREATOR_GAMES = [
  { name: 'Minecraft', image: '/images/categories/minecraft.png', tag: 'Open Category' },
  { name: 'Roblox', image: '/images/categories/roblox.png', tag: 'Open Category' },
  { name: 'FiveM', image: '/images/categories/fivem.png', tag: 'Open Category' },
  { name: 'Discord', image: '/images/categories/discord.png', tag: 'Open Category' },
  { name: 'Websites', image: '/images/categories/websites.png', tag: 'Open Category' },
];

const GameCreatorCard = ({ game, onOpenModal }) => {
  const [creatorCount, setCreatorCount] = useState(0);

  useEffect(() => {
    // Read real creator count starting strictly from 0
    setCreatorCount(getRealCreatorCount(game.name));
  }, [game.name]);

  return (
    <div 
      className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 border border-white/20 shadow-xl group hover:border-cyan-400/60 transition-all cursor-pointer"
      onClick={onOpenModal}
    >
      <img 
        src={game.image} 
        alt={game.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3 text-center">
        <span className="font-extrabold text-white text-xs tracking-tight">{game.name}</span>
        
        {/* Real-life creator count starting from 0 */}
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-cyan-300 font-mono font-bold">
            {creatorCount} {creatorCount === 1 ? 'creator' : 'creators'}
          </span>
        </div>
        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
          {creatorCount === 0 ? 'Be the first!' : game.tag}
        </span>
      </div>
    </div>
  );
};

const FEATURES = [
  {
    icon: Users,
    title: 'Dedicated Gaming Audience',
    description: 'Connect directly with server owners, developers, and communities looking for authentic, tested game plugins and tools.',
    iconColor: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    icon: CreditCard,
    title: 'Easy payments & payouts',
    description: 'Accept payments through PayPal, cards, and secure checkout simulation. We provide zero platform lock-in and creator-first revenue share.',
    iconColor: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  {
    icon: ShieldCheck,
    title: 'Safe & moderated platform',
    description: 'Maintaining a trusted marketplace is our highest priority. Every resource published through MinoForge is manually reviewed by our staff team before it becomes available for purchase.',
    iconColor: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20'
  },
  {
    icon: Star,
    title: 'Verified reviews',
    description: "Only buyers who've actually purchased your product can leave a review. This protects your reputation from fake or malicious feedback and helps genuine quality stand out.",
    iconColor: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20'
  },
  {
    icon: Sparkles,
    title: 'Innovative features',
    description: 'We have countless features to make your life as a creator easier including our AI Config generator, addons, bundles, coupon codes, sale events, and split payments.',
    iconColor: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20'
  },
  {
    icon: Lock,
    title: 'Leak & theft protection',
    description: 'Our placeholder injection system can be used to make every file downloaded uniquely marked with the buyer\'s details! We provide extensive guides and support to fight leaks.',
    iconColor: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20'
  },
  {
    icon: MessageSquare,
    title: 'Support & ticketing',
    description: 'Support buyers directly without sharing personal details. Built-in support tickets, Discord roles, and instant notifications keep your buyers happy.',
    iconColor: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    icon: Unlock,
    title: 'No exclusivity locks',
    description: 'You own your work. Publish your resources on MinoForge alongside any other platform without exclusivity penalties or restrictions.',
    iconColor: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20'
  },
  {
    icon: Zap,
    title: 'Instant payouts & crypto',
    description: 'Withdraw your earnings whenever you want. Support for PayPal, Stripe, Wise, and cryptocurrency payouts with transparent low transaction fees.',
    iconColor: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20'
  }
];

const BecomeCreatorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartPublishing = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      
      {/* Create Resource Modal */}
      <CreateResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Hero Banner Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 border border-white/15">
          
          {/* Subtle background hexagon pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Left Text */}
          <div className="space-y-5 max-w-xl z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/30 border border-white/20 text-xs font-bold text-cyan-300">
              <Lock className="w-3.5 h-3.5" />
              <span>{user ? `Logged in as @${user.username}` : 'Login Required to Publish'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Sell your creations through MinoForge
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Publishing your creations as resources on MinoForge means that you can spend more time creating, we'll handle the rest. You must have a registered account to start publishing.
            </p>

            <div className="pt-2">
              <button
                onClick={handleStartPublishing}
                className="btn-shimmer btn-animated px-7 py-3.5 bg-slate-950/90 hover:bg-slate-900 text-white font-black text-sm rounded-xl border border-white/30 hover:border-cyan-400/60 shadow-2xl hover:shadow-cyan-500/20 inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>Publish a resource</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Right Game Categories Cards with Real-Life Live Counting */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full lg:w-auto z-10">
            {CREATOR_GAMES.map((game, idx) => (
              <GameCreatorCard 
                key={idx} 
                game={game} 
                onOpenModal={handleStartPublishing} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* Why Publish Through MinoForge Section (9 Feature Cards matching image 1) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why publish through MinoForge?
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Since 2024 we've provided the easiest and safest experience for creators and entrepreneurs to grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:border-blue-500/30 transition-all duration-300 space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feat.bg}`}>
                  <Icon className={`w-5 h-5 ${feat.iconColor}`} />
                </div>
                <h3 className="font-bold text-white text-base">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="pt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-glow-blue btn-shimmer btn-animated px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-xl inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>Start Selling Today: Publish a Resource</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

      {/* Authentication Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-950 border border-white/20 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/20">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Login Required to Publish</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You must be logged into a MinoForge account to register as a creator, publish resources, and manage payouts.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/login?redirect=/creators')}
                className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Your Account</span>
              </button>

              <button
                onClick={() => navigate('/register?redirect=/creators')}
                className="btn-animated w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Create Free Account</span>
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-slate-500 hover:text-slate-400 font-medium transition-colors pt-2 block mx-auto"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BecomeCreatorPage;
