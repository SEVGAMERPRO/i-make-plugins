import React, { useState, useEffect } from 'react';
import { 
  Crown, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, 
  ArrowLeft, Lock, Heart, Zap, Rocket, Megaphone, Check, 
  CreditCard, ExternalLink, HelpCircle, Shield, AlertCircle,
  Tag, Percent, RefreshCw, X, Gift
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PayPalSmartButtons from '../components/cart/PayPalSmartButtons';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine initial billing cycle from URL query param (?billing=yearly or monthly)
  const initialBilling = searchParams.get('billing') === 'yearly';
  const [annualBilling, setAnnualBilling] = useState(initialBilling);
  
  // Donation / Tip State
  const [donation, setDonation] = useState(0);
  const [customDonationInput, setCustomDonationInput] = useState('');

  // Promo / Creator Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState({ type: '', text: '' });
  const [freeCheckoutLoading, setFreeCheckoutLoading] = useState(false);

  // Plan Pricing (Standard: 12.99 / mo)
  const baseMonthlyPrice = 12.99;
  const baseYearlyPrice = 132.50; // 15% off

  const currentBasePrice = annualBilling ? baseYearlyPrice : baseMonthlyPrice;

  // Calculate discount dynamically based on applied promo code
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'FIXED') {
      discountAmount = Math.min(currentBasePrice, parseFloat(appliedPromo.discountAmount || 0));
    } else {
      const pct = Math.min(100, Math.max(0, parseFloat(appliedPromo.discountPercent || 0)));
      discountAmount = (currentBasePrice * pct) / 100;
    }
  }
  discountAmount = parseFloat(discountAmount.toFixed(2));
  const discountedBasePrice = Math.max(0, parseFloat((currentBasePrice - discountAmount).toFixed(2)));
  const finalTotalAmount = parseFloat((discountedBasePrice + (parseFloat(donation) || 0)).toFixed(2));
  const isFreeOrder = finalTotalAmount <= 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyPromo = async (e) => {
    if (e) e.preventDefault();
    if (!promoCodeInput.trim()) {
      setPromoMessage({ type: 'error', text: 'Please enter a promo or creator code.' });
      return;
    }

    setPromoLoading(true);
    setPromoMessage({ type: '', text: '' });

    try {
      const res = await axios.post('/api/orders/validate-promo', {
        code: promoCodeInput.trim(),
        price: currentBasePrice
      });

      if (res.data?.success && res.data?.valid) {
        setAppliedPromo(res.data);
        setPromoMessage({
          type: 'success',
          text: `✓ Code "${res.data.code}" applied! ${
            res.data.discountType === 'PERCENT' ? `${res.data.discountPercent}% OFF` : `€${res.data.discountAmount} OFF`
          }${res.data.creatorName ? ` (Supporting Creator: ${res.data.creatorName})` : ''}`
        });
      } else {
        setPromoMessage({ type: 'error', text: res.data?.message || 'Invalid promo code.' });
      }
    } catch (err) {
      setPromoMessage({
        type: 'error',
        text: err.response?.data?.message || `Code "${promoCodeInput.toUpperCase()}" is invalid, expired, or disabled.`
      });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoMessage({ type: '', text: '' });
  };

  const handleFreeCheckout = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/checkout/ultimate?billing=${annualBilling ? 'yearly' : 'monthly'}`)}`);
      return;
    }

    setFreeCheckoutLoading(true);
    try {
      const res = await axios.post('/api/orders/apply-free-checkout', {
        buyerEmail: user.email,
        buyerUsername: user.username,
        code: appliedPromo?.code || 'LAUNCH100',
        planName: 'MinoForge Ultimate Membership'
      });

      if (res.data?.success) {
        handleSuccessfulPayment({
          orderID: res.data.transactionId,
          transactionId: res.data.transactionId
        });
      } else {
        alert(res.data?.message || 'Failed to complete free checkout.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error completing free checkout.');
    } finally {
      setFreeCheckoutLoading(false);
    }
  };

  const handleSuccessfulPayment = (data) => {
    const generatedRef = data?.orderID || data?.transactionId || `MF-ULT-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Generate unique 16-character single-use cryptographic token with special characters (%#@*!&$)
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789%#@*!&$';
    let uniqueToken = '';
    for (let i = 0; i < 16; i++) {
      uniqueToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const orderSession = {
      checkoutId: uniqueToken,
      orderId: generatedRef,
      plan: 'MinoForge Ultimate Membership',
      amount: finalTotalAmount.toFixed(2),
      tip: donation,
      cycle: annualBilling ? 'Annual Plan' : 'Monthly Plan',
      createdAt: Date.now(),
      active: true
    };

    try {
      sessionStorage.setItem(`mf_receipt_${uniqueToken}`, JSON.stringify(orderSession));
      sessionStorage.setItem('mf_current_token', uniqueToken);
      
      const updatedUser = { ...(user || {}), role: 'CREATOR', isUltimate: true };
      localStorage.setItem('minoforge_user', JSON.stringify(updatedUser));
      localStorage.setItem('minoforge_ultimate_active', 'true');
      
      const curCredits = parseFloat(localStorage.getItem('minoforge_ad_credits') || '0');
      localStorage.setItem('minoforge_ad_credits', (curCredits + 5.0).toFixed(2));
    } catch (e) {
      console.warn('Session storage error:', e);
    }

    // Navigate to single-use self-terminating cryptographic receipt URL!
    navigate(`/receipt/${encodeURIComponent(uniqueToken)}`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-10 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10 animate-fade-in">
        
        {/* Top Header & Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Plans</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>MinoForge</span>
              <span>/</span>
              <span className="text-amber-400 font-bold">VIP Checkout</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Enterprise Checkout</span>
          </div>
        </div>

        {/* 2-Column Split Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Plan Details, Perks & Security Guarantee (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* VIP Pass Overview Card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Crown className="w-32 h-32 text-amber-400" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider rounded-full border border-amber-500/30">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ultimate Creator Tier</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    MinoForge Ultimate Membership
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Unlock elite creator superpowers, 5% reduced platform fees, and monthly ad credits.
                  </p>
                </div>

                {user ? (
                  <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-950/80 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Subscribing as: <strong className="text-white">{user.username}</strong></span>
                  </div>
                ) : (
                  <Link
                    to={`/login?redirect=${encodeURIComponent(`/checkout/ultimate?billing=${annualBilling ? 'yearly' : 'monthly'}`)}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-2xl text-xs text-amber-300 font-bold flex-shrink-0 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Log in required</span>
                  </Link>
                )}
              </div>

              {/* Monthly vs Annual Toggle Switch */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs">
                  <strong className="text-white block">Select Billing Frequency</strong>
                  <span className="text-slate-400 text-[11px]">Cancel or change your subscription anytime in 1 click.</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setAnnualBilling(false)}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                      !annualBilling
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualBilling(true)}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      annualBilling
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Yearly</span>
                    <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-black uppercase">
                      -15%
                    </span>
                  </button>
                </div>
              </div>

              {/* Itemized Superpowers Grid */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Included VIP Creator Superpowers:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5 flex-shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Only 5% Marketplace Fee</strong>
                      <span className="text-[11px] text-slate-400">Keep 95% of every sale (saved 50% vs standard 10%).</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5 flex-shrink-0">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">€5.00 / Mo Free Ad Credits</strong>
                      <span className="text-[11px] text-slate-400">Promote your plugins on the homepage hero every month.</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5 flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Unlimited Gemini AI Engine</strong>
                      <span className="text-[11px] text-slate-400">Generate and optimize server configs with zero daily quotas.</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5 flex-shrink-0">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Express Review Queue</strong>
                      <span className="text-[11px] text-slate-400">Fast-track staff approvals in &lt; 2 hours with priority status.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Buyer Protection & Guarantee Card */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400 text-sm font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>180-Day MinoForge &amp; PayPal Buyer Protection</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your transaction is protected by enterprise-grade encryption. Instant digital activation takes effect immediately upon payment confirmation. An itemized VAT / tax receipt is automatically dispatched to your email from <strong>noreply@minoforge.com</strong>.
              </p>
            </div>

          </div>

          {/* Right Column: Order Summary, Tip Box & Payment Terminal (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="font-black text-white text-base">Order Breakdown</h3>
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20">
                  Instant Activation
                </span>
              </div>

              {/* Price Calculation Lines */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>MinoForge Ultimate ({annualBilling ? 'Annual Plan' : 'Monthly Plan'}):</span>
                  <span className="font-mono font-bold text-white">
                    {formatPrice(currentBasePrice)}
                  </span>
                </div>

                {appliedPromo && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold animate-fade-in">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Promo Discount ({appliedPromo.code}):</span>
                    </span>
                    <span className="font-mono font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-400">
                  <span>Platform Fee Rate:</span>
                  <span className="font-bold">5.0% (Save 50% more)</span>
                </div>

                <div className="flex justify-between text-amber-300">
                  <span>Monthly Sponsored Ad Balance:</span>
                  <span className="font-bold">+€5.00 / mo Included</span>
                </div>

                {donation > 0 && (
                  <div className="flex justify-between text-pink-300 font-semibold pt-2 border-t border-white/5 animate-fade-in">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                      <span>Voluntary Platform Tip:</span>
                    </span>
                    <span className="font-mono font-bold">+{formatPrice(donation)}</span>
                  </div>
                )}

                {/* Grand Total Highlight */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-950 to-amber-500/15 border-2 border-amber-500/40 flex items-center justify-between pt-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total Due Today</span>
                    <span className="text-[10px] text-slate-400">Tax / VAT included</span>
                  </div>
                  <span className={`text-2xl sm:text-3xl font-black font-mono ${isFreeOrder ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {isFreeOrder ? 'FREE (€0.00)' : formatPrice(finalTotalAmount)}
                  </span>
                </div>
              </div>

              {/* Promo / Creator Partner Code Module */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Have a Promo / Creator Code?</span>
                  </div>
                  {appliedPromo && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 animate-fade-in">
                      Applied
                    </span>
                  )}
                </div>

                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="e.g. SEV50, LAUNCH100"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                        className="w-full pl-3 pr-3 py-2.5 bg-slate-900 border border-white/15 focus:border-amber-400 rounded-xl text-xs text-amber-300 font-mono font-bold placeholder-slate-600 focus:outline-none uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={promoLoading || !promoCodeInput.trim()}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                    >
                      {promoLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      ) : (
                        <span>Apply</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-center justify-between animate-fade-in">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-amber-300 px-2 py-0.5 bg-amber-500/20 rounded">
                          {appliedPromo.code}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          {appliedPromo.discountType === 'PERCENT' ? `-${appliedPromo.discountPercent}% OFF` : `-€${appliedPromo.discountAmount} OFF`}
                        </span>
                      </div>
                      {appliedPromo.creatorName && (
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>Supporting Creator: <strong className="text-white">{appliedPromo.creatorName}</strong></span>
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-1 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoMessage.text && (
                  <p className={`text-[11px] font-medium leading-tight ${
                    promoMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Voluntary Platform Tip / Donation Module */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/30 via-slate-950 to-pink-950/20 border border-pink-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-300 text-xs font-bold">
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                    <span>Support MinoForge Development</span>
                  </div>
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold">
                    Optional
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  Add an optional tip to support lightning-fast download servers, Gemini AI upgrades, and 24/7 creator support. Total updates dynamically:
                </p>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[0, 1.00, 2.50, 5.00].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { 
                        setDonation(val); 
                        setCustomDonationInput(val > 0 ? val.toString() : ''); 
                      }}
                      className={`py-3 px-2 rounded-xl font-bold transition-all text-center cursor-pointer active:scale-95 text-xs ${
                        donation === val && customDonationInput === (val > 0 ? val.toString() : '')
                          ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 border border-pink-400'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
                      }`}
                    >
                      {val === 0 ? 'No Tip' : `+€${val.toFixed(2)}`}
                    </button>
                  ))}
                </div>

                {/* Custom numerical input */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-pink-400">€</span>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    placeholder="Custom tip amount (e.g. 10.00)"
                    value={customDonationInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomDonationInput(val);
                      const num = parseFloat(val);
                      setDonation(!isNaN(num) && num > 0 ? num : 0);
                    }}
                    className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-pink-500/30 focus:border-pink-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Payment Section: Login gate if guest, 1-Click Free button if 100% off, or PayPal terminal */}
              {!user ? (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/50 via-slate-900 to-slate-950 border-2 border-blue-500/40 text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                    <Lock className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-base font-black text-white">Log in required for Ultimate</h4>
                    <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                      To connect 5% reduced platform fees, €5/mo free ad credits, and creator badges to your account, you must be logged in.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Link
                      to={`/login?redirect=${encodeURIComponent(`/checkout/ultimate?billing=${annualBilling ? 'yearly' : 'monthly'}`)}`}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer active:scale-95"
                    >
                      <span>Log In to Continue Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/register?redirect=${encodeURIComponent(`/checkout/ultimate?billing=${annualBilling ? 'yearly' : 'monthly'}`)}`}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10"
                    >
                      <span>New to MinoForge? Create Free Account</span>
                    </Link>
                  </div>
                </div>
              ) : isFreeOrder ? (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-yellow-400/50 text-center space-y-2 shadow-xl animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center mx-auto font-black shadow-lg shadow-yellow-500/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-yellow-300">100% Free Order Promo Waiver Applied!</h4>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      No payment gateway required. Your Ultimate VIP privileges will activate immediately upon confirmation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFreeCheckout}
                    disabled={freeCheckoutLoading}
                    className="btn-glow-blue btn-shimmer btn-animated w-full py-4 px-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                  >
                    {freeCheckoutLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Activating Free Ultimate Membership...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-slate-950 fill-current" />
                        <span>Claim 100% Free Ultimate VIP</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Official Secure Payment Terminal
                    </span>
                  </div>

                  <PayPalSmartButtons
                    key={`paypal_checkout_${annualBilling ? 'yearly' : 'monthly'}_${finalTotalAmount}_${appliedPromo?.code || 'nopromo'}`}
                    items={[{
                      id: `membership_ultimate_${annualBilling ? 'yearly' : 'monthly'}`,
                      title: `MinoForge Ultimate Membership (${annualBilling ? 'Annual Plan' : 'Monthly Plan'})${appliedPromo ? ` [Code: ${appliedPromo.code}]` : ''}${donation > 0 ? ` (+ €${donation.toFixed(2)} Platform Tip)` : ''}`,
                      price: finalTotalAmount
                    }]}
                    totalAmount={finalTotalAmount}
                    onSuccess={handleSuccessfulPayment}
                    onError={(err) => console.error('Ultimate checkout error:', err)}
                  />
                </div>
              )}

              <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Encrypted by PayPal Treasury • 180-Day Protection</span>
                </p>
                <p>Receipt self-destructs upon session termination for maximum privacy.</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
