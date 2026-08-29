import React, { useState } from 'react';
import { Check, X, Sparkles, Zap, ShieldCheck, Crown, Star, ArrowRight, DollarSign, Clock, HelpCircle, Rocket, Megaphone, Terminal, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';

const TIERS = [
  {
    id: 'free',
    name: 'Standard Creator',
    badge: 'Starter',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Essential toolkit for publishing, distributing, and standard selling on the MinoForge network.',
    buttonText: 'Current Plan',
    buttonVariant: 'outline',
    highlighted: false,
    features: [
      'Standard marketplace processing fee: 10%',
      '200MB maximum resource archive upload limit',
      '5 gallery showcase screenshots per plugin',
      'Standard staff review verification (24-48h)',
      '10 daily Gemini AI Config generator requests',
      'Continuous MinoShield™ malware protection',
      'Official MinoForge Developer Discord access',
    ]
  },
  {
    id: 'ultimate',
    name: 'MinoForge Ultimate',
    badge: 'Pro Creator Tier • Most Popular',
    priceMonthly: 0.01, // 🧪 Temporary Testing Price: 1 cent (Standard: 12.99/mo)
    priceYearly: 132.50, // 15% discount on 12.99/mo (12.99 * 12 * 0.85 = 132.50)
    description: 'The definitive tier for elite developers. Cut platform fees to just 5%, receive monthly sponsored ad credits, and unlock full Forge superpowers.',
    buttonText: 'Unlock Ultimate Access',
    buttonVariant: 'gradient',
    highlighted: true,
    features: [
      '🔥 Only 5% Marketplace Platform Fee (Keep 95%)',
      '📢 €5.00 Free Monthly Sponsored Showcase Credits',
      '⚡ Express Staff Approvals & Fast-Track Queue (< 2 hours)',
      '🚀 Algorithmic Discovery Boost & Search Ranking Priority',
      '📦 500MB Expanded Package Upload Capacity (vs 200MB)',
      '🖼️ 15 HD Gallery Slots & 10 Expansion Addons',
      '🤖 Unlimited Gemini AI Config & Code Optimizer',
      '🛡️ Priority MinoShield™ Deep Bytecode Malware Inspection',
      '👑 Glowing Golden Crown Icon & Animated Profile Banner',
      '🎨 Custom RGB Username Glow & Site Theme Accents',
      '🔑 Automated Discord Customer Role Sync & DRM Licensing',
      '💬 Dedicated 1-on-1 Staff Concierge Developer Support',
    ]
  }
];

const SECTIONS = [
  {
    title: 'Marketplace & Sales Distribution',
    rows: [
      { name: 'Platform Processing Fee', free: '10%', ultimate: 'Only 5% (Keep 95%)' },
      { name: 'Monthly Sponsored Showcase Credits', free: '—', ultimate: '€5.00 / mo included' },
      { name: 'Resource Binary Upload Capacity', free: '200 MB', ultimate: '500 MB' },
      { name: 'Media Gallery Showcase Slots', free: '5 slots', ultimate: '15 HD slots' },
      { name: 'Add-on Expansion Packages per Resource', free: '5 packages', ultimate: '10 packages' },
      { name: 'Algorithmic Discovery Boost & Search Priority', free: 'Standard', ultimate: 'Top Priority' },
      { name: 'Multi-Brand Creator Storefronts', free: '1 storefront', ultimate: '2 custom storefronts' },
      { name: 'Direct Vanity Resource URLs (/r/your-plugin)', free: false, ultimate: true },
      { name: 'Express Staff Verification Queue', free: '24-48h queue', ultimate: 'Fast-track (< 2 hours)' },
      { name: 'Instant Publishing (Skip Peer Review Wait)', free: false, ultimate: true },
      { name: 'Full Developer REST & Webhook APIs', free: false, ultimate: true },
    ]
  },
  {
    title: 'MinoShield™ Security & AI Engine',
    rows: [
      { name: 'Gemini AI Config & Optimization Engine', free: '2 / day', ultimate: 'Unlimited' },
      { name: 'MinoShield™ Deep Bytecode Malware Inspection', free: 'Standard Heuristic', ultimate: 'Priority Deep Scan' },
      { name: 'Automated Discord Customer Sync & DRM Licensing', free: false, ultimate: true },
      { name: 'Automated Performance & Code Audit Insights', free: false, ultimate: true },
    ]
  },
  {
    title: 'Profile Branding & Creator Studio',
    rows: [
      { name: 'Custom Name Glow & RGB Palette', free: 'Default', ultimate: 'Full RGB Palette' },
      { name: 'Cinematic Animated Profile Header', free: 'Static', ultimate: 'Custom Animated Header' },
      { name: 'Verified Golden Crown & Elite Creator Badge', free: 'None', ultimate: true },
      { name: 'Custom User Title & Distinction Tag', free: false, ultimate: true },
      { name: 'High-Res Profile Cover Banner', free: false, ultimate: true },
      { name: 'Animated Profile Avatar (GIF)', free: false, ultimate: true },
      { name: 'Username Change Frequency', free: 'Every 90 days', ultimate: 'Every 14 days' },
      { name: 'Ultra-Short & Rare Handle Reservation', free: false, ultimate: true },
      { name: 'Custom Creator Domain Handle (/@yourname)', free: false, ultimate: true },
      { name: 'Personalized Platform UI Theme Accents', free: false, ultimate: true },
    ]
  },
  {
    title: 'Discord Community & Multipliers',
    rows: [
      { name: 'Discord Community XP & Rewards Multiplier', free: '1.0x XP', ultimate: '1.5x XP Boost' },
      { name: 'Daily Bonus Credits via Discord Bot', free: false, ultimate: true },
      { name: 'Forge Vault Raffle & Giveaway Entries', free: 'Standard Entry', ultimate: 'Double Entry Weight' },
      { name: 'Private Creator Lounge & Developer Council', free: false, ultimate: true },
      { name: 'Real-time Visitor Analytics & Traffic Insights', free: false, ultimate: true },
      { name: 'Daily Customer Review Engagement Capacity', free: '2 responses / day', ultimate: 'Unlimited' },
    ]
  }
];

const PricingPage = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [annualBilling, setAnnualBilling] = useState(false);

  const handleCheckout = (tier) => {
    if (tier.id === 'free') return;
    navigate(`/checkout/ultimate?billing=${annualBilling ? 'yearly' : 'monthly'}`);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-full text-xs font-bold text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>MinoForge Creator Subscriptions</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Keep 95% of your earnings.
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Built for Professional Creators.
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Upgrade to Ultimate to lower platform fees to just 5%, get €5/mo free sponsored ad credits, skip review queues, and unlock complete platform superpowers.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-4 text-sm font-bold">
            <span className={!annualBilling ? 'text-white' : 'text-slate-500'}>Monthly</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-14 h-8 bg-slate-800 rounded-full p-1 border border-white/10 transition-colors relative"
            >
              <div 
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-md transform transition-transform ${annualBilling ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
            <span className={`flex items-center gap-1.5 ${annualBilling ? 'text-white' : 'text-slate-500'}`}>
              <span>Yearly</span>
              <span className="text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {TIERS.map(tier => {
            const price = annualBilling ? tier.priceYearly : tier.priceMonthly;
            const period = annualBilling ? '/year' : '/month';

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/20 scale-105 z-10'
                    : 'bg-slate-900/70 border border-white/10 shadow-xl hover:border-white/20'
                }`}
              >
                {/* Popular Ribbon */}
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                    <Rocket className="w-3.5 h-3.5" />
                    <span>{tier.badge}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                  </div>

                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                    <span className="text-4xl md:text-5xl font-black text-white">
                      {price === 0 ? 'Free' : formatPrice(price)}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">
                      {price === 0 ? 'forever' : period}
                    </span>
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={feat.includes('0%') || feat.includes('Ad Credit') ? 'font-bold text-amber-300' : ''}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleCheckout(tier)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{tier.buttonText}</span>
                  {tier.highlighted && <Crown className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Detailed BuiltByBit Comparison Tables */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-white">Compare Features</h2>
            <p className="text-xs text-slate-400 mt-1">Exact side-by-side feature comparison between Free and Ultimate</p>
          </div>

          <div className="space-y-8">
            {SECTIONS.map((section, sIdx) => (
              <div key={sIdx} className="overflow-x-auto">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                  <span>{section.title}</span>
                </h3>
                <table className="w-full text-left text-sm border-t border-white/10">
                  <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-950/60">
                    <tr>
                      <th className="py-3.5 px-4 font-bold w-1/2">Feature</th>
                      <th className="py-3.5 px-4 font-bold text-center w-1/4">Free</th>
                      <th className="py-3.5 px-4 font-bold text-center w-1/4 text-amber-400">Ultimate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300 font-medium">
                    {section.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">{row.name}</td>
                        <td className="py-3.5 px-4 text-center">
                          {typeof row.free === 'boolean' ? (
                            row.free ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-red-400/80 mx-auto" />
                          ) : (
                            <span>{row.free}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-300">
                          {typeof row.ultimate === 'boolean' ? (
                            row.ultimate ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />
                          ) : (
                            <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                              {row.ultimate}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;

