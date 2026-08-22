import React, { useState } from 'react';
import { Check, X, Sparkles, Zap, ShieldCheck, Crown, Star, ArrowRight, DollarSign, Clock, HelpCircle, Rocket, Megaphone, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    id: 'free',
    name: 'Free Member',
    badge: 'Standard',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Essential access for browsing, purchasing, and standard selling on MinoForge.',
    buttonText: 'Current Plan',
    buttonVariant: 'outline',
    highlighted: false,
    features: [
      'Standard marketplace fee: 10%',
      '200MB maximum file upload size',
      '5 maximum carousel images',
      'Standard staff review queue (24-48h)',
      '10 AI Config generations per day',
      'Standard MinoShield security scan',
      'Community Discord access',
    ]
  },
  {
    id: 'ultimate',
    name: 'MinoForge Ultimate',
    badge: 'Official BuiltByBit Style • Most Popular',
    priceMonthly: 19.99,
    priceYearly: 179,
    description: 'The definitive tier for serious creators. Keep 100% of your earnings, get $5/mo free ad credit, and full platform superpowers.',
    buttonText: 'Get Ultimate Access',
    buttonVariant: 'gradient',
    highlighted: true,
    features: [
      '🔥 0% Marketplace Sales Commission (Keep 100%)',
      '📢 $5.00 Free Monthly Sponsored Ad Credits',
      '⚡ Priority Instant Staff Approvals (< 2 hours)',
      '🚀 Boosted Discovery Rankings & Search Visibility',
      '📦 500MB Max File Upload Size (vs 200MB)',
      '🖼️ 15 Carousel Images & 10 Addons per Resource',
      '🤖 Unlimited Gemini AI Config & Code Generator',
      '🛡️ Priority MinoShield Deep Security Scans',
      '👑 Glowing Gold "ULTIMATE" Badge & Profile Banner',
      '🎨 Animated Profile Picture & Custom Theme Accent',
      '🔑 Automated Discord Customer Role Sync & Keys',
      '💬 Dedicated 1-on-1 Staff Concierge Support',
    ]
  }
];

const SECTIONS = [
  {
    title: 'Resources & Selling',
    rows: [
      { name: 'Marketplace Sales Commission', free: '10%', ultimate: '0% (Keep 100%)' },
      { name: 'Free Ad Credit per Month', free: 'None', ultimate: '$5.00 / mo' },
      { name: 'Maximum File Upload Size', free: '200MB', ultimate: '500MB' },
      { name: 'Maximum Carousel Images', free: '5', ultimate: '15' },
      { name: 'Maximum Addons per Resource', free: '5', ultimate: '10' },
      { name: 'Boosted Discovery Rankings', free: false, ultimate: true },
      { name: 'Create 2 Storefront Pages', free: false, ultimate: true },
      { name: 'Resource Custom Vanity URLs', free: false, ultimate: true },
      { name: 'Priority Resource Approvals', free: false, ultimate: true },
      { name: 'Bypass Peer Review Wait Period', free: false, ultimate: true },
      { name: 'Full Developer API Access', free: false, ultimate: true },
    ]
  },
  {
    title: 'MinoForge AI & Security Tools',
    rows: [
      { name: 'MinoForge AI Config Generator', free: '10 / day', ultimate: 'Unlimited' },
      { name: 'MinoShield Deep Bytecode Security Scans', free: 'Standard', ultimate: 'Priority Deep Scan' },
      { name: 'Automated Discord Role Sync & DRM', free: false, ultimate: true },
      { name: 'AI Code Optimization Suggestions', free: false, ultimate: true },
    ]
  },
  {
    title: 'Profile & Customization',
    rows: [
      { name: 'Username Color', free: 'Default', ultimate: 'All custom colors' },
      { name: 'Custom Profile Banner', free: 'None', ultimate: true },
      { name: 'Ultimate Rocket Profile Icon', free: 'None', ultimate: true },
      { name: 'Custom User Title & Badge', free: false, ultimate: true },
      { name: 'Profile Cover Photo', free: false, ultimate: true },
      { name: 'Animated Profile Picture (GIF)', free: false, ultimate: true },
      { name: 'Change Username Frequency', free: 'Only once', ultimate: 'Every 14 days' },
      { name: 'Access to 2-Character Usernames', free: false, ultimate: true },
      { name: 'Profile Custom Vanity URL', free: false, ultimate: true },
      { name: 'Change Site Accent Color', free: false, ultimate: true },
    ]
  },
  {
    title: 'Discord & Community Perks',
    rows: [
      { name: 'Discord Point Multiplier', free: '1.0x', ultimate: '1.5x' },
      { name: 'Free Daily Points with /daily', free: false, ultimate: true },
      { name: 'Spend Points on Rewards & Raffles', free: false, ultimate: true },
      { name: 'Access to Exclusive Ultimate-Only Channels', free: false, ultimate: true },
      { name: 'See Who Has Viewed Your Resource', free: false, ultimate: true },
      { name: 'Daily Feedback & Reviews Limit', free: '2', ultimate: '5' },
    ]
  }
];

const PricingPage = () => {
  const { user } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = (tier) => {
    if (tier.id === 'free') return;
    setSelectedPlan(tier);
  };

  const processPayment = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      alert(`🎉 Welcome to MinoForge Ultimate! Your account now has 0% platform fees, $5 free ad credit, and full Ultimate perks.`);
      setSelectedPlan(null);
      setCheckoutSuccess(false);
    }, 1500);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-full text-xs font-bold text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Official BuiltByBit Style Creator Membership</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Keep 100% of your earnings.
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Built for Top Creators.
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Upgrade to Ultimate to eliminate all platform fees, get $5/mo free ad credit, skip review queues, and unlock full profile & AI perks.
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
                Save 25%
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
                      ${price}
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
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
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

        {/* Checkout Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-white space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Upgrade to {selectedPlan.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <div className="flex justify-between font-bold text-white">
                  <span>Membership:</span>
                  <span>{selectedPlan.name} ({annualBilling ? 'Annual' : 'Monthly'})</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Bonus Free Ad Credits:</span>
                  <span className="font-bold text-emerald-400">+$5.00 Included</span>
                </div>
                <div className="flex justify-between font-bold text-amber-300 text-sm pt-2 border-t border-amber-500/20">
                  <span>Total Due Today:</span>
                  <span>${annualBilling ? selectedPlan.priceYearly : selectedPlan.priceMonthly} USD</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  disabled={checkoutSuccess}
                  className="w-full py-3.5 px-4 bg-[#635BFF] hover:bg-[#534be0] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>{checkoutSuccess ? 'Processing...' : 'Pay with Stripe (Cards / Apple Pay)'}</span>
                </button>

                <button
                  onClick={processPayment}
                  disabled={checkoutSuccess}
                  className="w-full py-3.5 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>{checkoutSuccess ? 'Processing...' : 'Pay with PayPal'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Instant activation. Cancel anytime from your account settings.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PricingPage;
