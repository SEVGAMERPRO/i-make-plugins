import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, ShieldCheck, Star, Sparkles, Lock, MessageSquare, Unlock, Zap, ArrowRight, ChevronRight } from 'lucide-react';
import CreateResourceModal from '../components/ui/CreateResourceModal';

const CREATOR_GAMES = [
  { name: 'Minecraft', count: '5,095 creators', image: '/images/categories/minecraft.png' },
  { name: 'Roblox', count: '1,528 creators', image: '/images/categories/roblox.png' },
  { name: 'FiveM', count: '2,140 creators', image: '/images/categories/fivem.png' },
  { name: 'Discord', count: '865 creators', image: '/images/categories/discord.png' },
  { name: 'Websites', count: '755 creators', image: '/images/categories/websites.png' },
];

const FEATURES = [
  {
    icon: Users,
    title: 'Huge userbase',
    description: 'More than 500,000 users are already registered to MinoForge providing a huge audience of interested buyers and downloaders for your products.',
    iconColor: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    icon: CreditCard,
    title: 'Easy payments & payouts',
    description: 'Accept payments through PayPal, credit cards, and 50+ other local payment methods, even without a PayPal account! We provide full chargeback protection and automatic payouts.',
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
    iconColor: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20'
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
    title: 'Creator community',
    description: 'Join channels on Discord exclusively available to our creators! Make friends, get feedback and get notified of new features as they release.',
    iconColor: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    icon: Unlock,
    title: 'No exclusivity required',
    description: "Publishing through our platform doesn't mean that you're locked in to only sell through us, you are free to sell your products through other platforms alongside ours.",
    iconColor: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20'
  },
  {
    icon: Zap,
    title: 'Instant delivery',
    description: "We'll store your products and ensure that they're delivered securely. We make the process hassle-free for you and your buyers, meaning you can spend less time providing support.",
    iconColor: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20'
  },
];

const BecomeCreatorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white pb-20">
      
      {/* Create Resource Modal */}
      <CreateResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Hero Blue Banner (Matching Image 1) */}
      <section className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 border border-white/15">
          
          {/* Subtle background hexagon pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Left Text */}
          <div className="space-y-5 max-w-xl z-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Sell your creations through MinoForge
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Publishing your creations as resources on MinoForge means that you can spend more time creating, we'll handle the rest. We're the best place for creators to share their work and it's completely free to get started!
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-shimmer btn-animated px-7 py-3.5 bg-slate-950/90 hover:bg-slate-900 text-white font-black text-sm rounded-xl border border-white/30 hover:border-cyan-400/60 shadow-2xl hover:shadow-cyan-500/20 inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>Publish a resource</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Right Game Categories Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full lg:w-auto z-10">
            {CREATOR_GAMES.map((game, idx) => (
              <div 
                key={idx}
                className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 border border-white/20 shadow-xl group hover:border-white/40 transition-all cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 text-center">
                  <span className="font-extrabold text-white text-xs tracking-tight">{game.name}</span>
                  <span className="text-[10px] text-slate-300 font-medium">{game.count}</span>
                </div>
              </div>
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
            <span>Start Selling Today — Publish a Resource</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default BecomeCreatorPage;
