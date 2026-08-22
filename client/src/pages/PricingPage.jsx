import React, { useState } from 'react';
import { Check, Sparkles, Zap, ShieldCheck, Crown, Star, ArrowRight, DollarSign, Clock, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    id: 'free',
    name: 'Free Member',
    badge: 'Standard',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Essential access for browsing, purchasing, and casual selling on MinoForge.',
    buttonText: 'Current Plan',
    buttonVariant: 'outline',
    highlighted: false,
    features: [
      'Browse & download all free resources',
      'Standard marketplace fee: 10%',
      'Standard staff review queue (24-48h)',
      '10 AI Config generations per day',
      'Standard MinoShield security scan',
      'Community Discord access',
    ]
  },
  {
    id: 'pro',
    name: 'Creator Pro',
    badge: 'Growing Sellers',
    priceMonthly: 9.99,
    priceYearly: 89,
    description: 'For active creators looking to boost sales, speed up reviews, and unlock advanced AI.',
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'blue',
    highlighted: false,
    features: [
      'Reduced marketplace fee: 5%',
      'Priority staff review queue (< 12 hours)',
      '50 AI Config generations per day',
      'MinoShield Deep Bytecode Analysis',
      'Pro Verified badge on profile & listings',
      'Automated Discord customer role sync',
      '5x Monthly resource bump credits',
      'Priority ticket support',
    ]
  },
  {
    id: 'ultimate',
    name: 'MinoForge Ultimate',
    badge: 'BuiltByBit Style • Most Popular',
    priceMonthly: 19.99,
    priceYearly: 179,
    description: 'The definitive tier for serious creators. Keep 100% of your earnings with top-tier perks.',
    buttonText: 'Get Ultimate Access',
    buttonVariant: 'gradient',
    highlighted: true,
    features: [
      '🔥 0% Marketplace Fee (Keep 100% of earnings)',
      '⚡ Instant Staff Review Priority (< 2 hours)',
      '🤖 Unlimited Gemini AI Config & Code Generator',
      '🛡️ Unlimited MinoShield Deep Security Scans',
      '👑 Glowing Gold "ULTIMATE" Creator Badge',
      '🌟 Homepage Featured Carousel Spotlight',
      '🎨 Custom Animated Profile & Storefront Banner',
      '🔑 Automated Discord Role Sync & License Keys',
      '📈 Advanced Real-Time Analytics & Payouts',
      '💬 Dedicated 1-on-1 Staff Concierge Support',
    ]
  }
];

const COMPARISON_ROWS = [
  { feature: 'Marketplace Sales Commission', free: '10%', pro: '5%', ultimate: '0% (Keep 100%)' },
  { feature: 'Staff Review Speed', free: '24-48 Hours', pro: '< 12 Hours', ultimate: 'Instant (< 2 Hours)' },
  { feature: 'MinoForge AI Config Tool', free: '10 / day', pro: '50 / day', ultimate: 'Unlimited' },
  { feature: 'MinoShield Deep Security Scans', free: 'Standard', pro: 'Enhanced', ultimate: 'Priority Deep Scan' },
  { feature: 'Homepage Spotlight Carousel', free: false, pro: false, ultimate: true },
  { feature: 'Automated Discord Role Sync', free: false, pro: true, ultimate: true },
  { feature: 'Creator Profile Customization', free: 'Standard', pro: 'Banner & Badges', ultimate: 'Animated Storefront' },
  { feature: 'Monthly Listing Bump Credits', free: '0', pro: '5 / month', ultimate: 'Unlimited' },
  { feature: 'Priority Staff Concierge', free: false, pro: false, ultimate: true },
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
      alert(`🎉 Welcome to ${selectedPlan.name}! Your account has been upgraded.`);
      setSelectedPlan(null);
      setCheckoutSuccess(false);
    }, 1500);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-full text-xs font-bold text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>MinoForge Ultimate Creator Membership</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Keep 100% of your earnings.
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Supercharge your creations.
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Upgrade to Ultimate to eliminate platform fees, skip staff review queues, and unlock unlimited AI & security superpowers.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map(tier => {
            const price = annualBilling ? tier.priceYearly : tier.priceMonthly;
            const period = annualBilling ? '/year' : '/month';

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/15 scale-105 z-10'
                    : 'bg-slate-900/70 border border-white/10 shadow-xl hover:border-white/20'
                }`}
              >
                {/* Popular Highlight Ribbon */}
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-lg">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    {!tier.highlighted && (
                      <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                        {tier.badge}
                      </span>
                    )}
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

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
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
                      : tier.buttonVariant === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
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

        {/* Detailed Comparison Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white">Full Feature Comparison</h2>
            <p className="text-xs text-slate-400 mt-1">See exactly what you unlock with each membership tier</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 bg-slate-950/40">
                <tr>
                  <th className="py-4 px-4 font-bold">Feature</th>
                  <th className="py-4 px-4 font-bold text-center">Free</th>
                  <th className="py-4 px-4 font-bold text-center">Creator Pro</th>
                  <th className="py-4 px-4 font-bold text-center text-amber-400">Ultimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300 font-medium">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>
                      ) : row.free}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>
                      ) : row.pro}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-amber-300">
                      {typeof row.ultimate === 'boolean' ? (
                        row.ultimate ? <Check className="w-4 h-4 text-amber-400 mx-auto" /> : <span className="text-slate-600">—</span>
                      ) : row.ultimate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <span>Plan:</span>
                  <span>{selectedPlan.name} ({annualBilling ? 'Annual' : 'Monthly'})</span>
                </div>
                <div className="flex justify-between font-bold text-amber-300 text-sm pt-2 border-t border-amber-500/20">
                  <span>Total Due:</span>
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
                Secure 256-bit encrypted checkout. You can cancel your subscription at any time from your settings.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PricingPage;
