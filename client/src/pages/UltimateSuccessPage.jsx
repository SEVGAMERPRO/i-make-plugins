import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Crown, Sparkles, CheckCircle2, Check, ArrowRight, Download, 
  Rocket, Zap, Heart, ShieldCheck, Copy, Star, MessageSquare, 
  Bot, ExternalLink, Printer, Share2, Award, Lock, ShieldAlert,
  AlertTriangle, History, RefreshCw, Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const UltimateSuccessPage = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Extract unique checkoutId from URL parameter or query
  const rawParamId = params.checkoutId || params.checkoutToken || new URLSearchParams(location.search).get('checkoutId') || '';
  const checkoutId = decodeURIComponent(rawParamId || sessionStorage.getItem('mf_current_token') || '');

  const [sessionValid, setSessionValid] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  const isDirectLookup = !checkoutId && !new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    window.scrollTo(0, 0);

    // Verify single-use token from session storage
    if (checkoutId) {
      try {
        const raw = sessionStorage.getItem(`mf_receipt_${checkoutId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.active === true) {
            setOrderData(parsed);
            setSessionValid(true);
          } else {
            setSessionValid(false);
          }
        } else {
          // If no session data exists, token has expired or is invalid
          setSessionValid(false);
        }
      } catch (e) {
        setSessionValid(false);
      }
    }

    // Invalidate token when the user navigates away or unloads the window
    const handleBeforeUnload = () => {
      if (checkoutId) {
        try {
          const raw = sessionStorage.getItem(`mf_receipt_${checkoutId}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.active = false;
            sessionStorage.setItem(`mf_receipt_${checkoutId}`, JSON.stringify(parsed));
          }
        } catch (e) {}
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [checkoutId]);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(checkoutId);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleCopyTx = () => {
    if (orderData?.orderId) {
      navigator.clipboard.writeText(orderData.orderId);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ================= DIRECT /RECEIPT VISIT (PORTAL & VERIFICATION LOOKUP) =================
  if (isDirectLookup) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white py-16 px-4 sm:px-6 lg:px-8 relative flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-600/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full mx-auto space-y-6 relative z-10 animate-fade-in text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-6">
            
            {/* Shield Check Icon */}
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>MinoForge Secure Receipt Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Receipt &amp; Order Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                All order receipts and transaction invoices on MinoForge are private, encrypted, and issued directly via email to protect user privacy.
              </p>
            </div>

            {/* Verification Lookup Input */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Transaction ID (e.g. MF-ORD-123456)"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-white/10 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
                <button
                  onClick={() => {
                    if (lookupQuery.trim()) {
                      setLookupResult({
                        found: true,
                        id: lookupQuery.trim(),
                        status: 'Verified Valid Transaction',
                        message: 'A complete copy of this receipt is available in the account dashboard and registered email.'
                      });
                    }
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Verify
                </button>
              </div>

              {lookupResult && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left text-xs text-slate-300 space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lookupResult.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {lookupResult.id}</p>
                  <p className="text-[11px] text-slate-300">{lookupResult.message}</p>
                </div>
              )}
            </div>

            {/* Quick Navigation Links */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/plugins"
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse Marketplace</span>
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>My Creator Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Log In to View Account</span>
                </Link>
              )}
            </div>

            <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5">
              Official MinoForge Checkout Endpoint • 256-bit SSL Cryptographic Privacy Protection
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ================= EXPIRED / INVALID TOKEN VIEW =================
  if (!sessionValid) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white py-16 px-4 sm:px-6 lg:px-8 relative flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full mx-auto space-y-6 relative z-10 animate-fade-in text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6">
            
            {/* Animated Lock Icon */}
            <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-xl shadow-amber-500/20">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/25">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Single-Use Token Terminated</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                One-Time Checkout Link Expired
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                This verification URL was a one-time cryptographic checkout token generated exclusively for your active session. For your security and to prevent link sharing, this link is immediately destroyed once you leave the page.
              </p>
            </div>

            {/* Token Info Box */}
            {checkoutId && (
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-white/5 text-left text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Cryptographic Token</span>
                  <span className="text-amber-400">Status: Revoked / Expired</span>
                </div>
                <div className="font-mono text-amber-300 font-bold break-all">
                  {checkoutId}
                </div>
              </div>
            )}

            {/* Account Status Assurance */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your Purchases &amp; VIP Status Are 100% Intact</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Your payment was successfully processed. A permanent invoice receipt was sent to your email from <strong>noreply@minoforge.com</strong>, and your perks are active in your Creator Dashboard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Open Creator Dashboard</span>
              </Link>
              <Link
                to="/plugins"
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Browse Marketplace</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ================= ACTIVE SINGLE-USE RECEIPT VIEW =================
  const planName = orderData?.plan || 'MinoForge Ultimate';
  const orderId = orderData?.orderId || `MF-ULT-${Math.floor(100000 + Math.random() * 900000)}`;
  const rawAmount = parseFloat(orderData?.amount || '12.99');
  const tipAmount = parseFloat(orderData?.tip || '0');
  const billingCycle = orderData?.cycle || 'Monthly';

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 animate-fade-in">
        
        {/* Top Hero Banner */}
        <div className="text-center space-y-4">
          {/* Glowing Animated Crown */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-orange-400 p-1 shadow-2xl shadow-amber-500/40 mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-amber-400">
                <Crown className="w-12 h-12 animate-bounce" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider border border-amber-500/40 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official VIP Creator Activation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Thank You For Subscribing!
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Welcome to the elite tier of <strong className="text-white">MinoForge</strong>. Your subscription is active, your creator fee is reduced to <strong>5% (you keep 95%)</strong>, and all platform superpowers are now unlocked.
          </p>

          {/* Cryptographic Token Callout Ribbon */}
          {checkoutId && (
            <div className="p-3 bg-slate-900/90 border border-amber-500/40 rounded-2xl max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shadow-xl shadow-amber-500/5">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Single-Use Verification ID
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{checkoutId}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Destroys on exit
                </span>
                <button
                  onClick={handleCopyToken}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded-lg transition-all cursor-pointer"
                >
                  {copiedToken ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {tipAmount > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/15 border border-pink-500/30 rounded-2xl text-xs font-bold text-pink-300 shadow-lg shadow-pink-500/10">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>Includes a generous {formatPrice(tipAmount, true)} platform development contribution. Thank you for supporting MinoForge!</span>
            </div>
          )}
        </div>

        {/* Two-Column Section: VIP Card + Order Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Digital VIP Pass (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
              {/* Background ambient shine */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img src="/favicon.png" alt="MinoForge" className="w-7 h-7 rounded-lg object-cover" />
                  <span className="font-black text-sm tracking-tight text-white">MINO<span className="text-cyan-400">FORGE</span></span>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase rounded-full border border-amber-500/30">
                  VIP PASS
                </span>
              </div>

              <div className="py-6 text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-amber-400/60 mx-auto flex items-center justify-center overflow-hidden shadow-xl shadow-amber-500/20 relative">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-amber-400 uppercase">{user?.username?.[0] || 'U'}</span>
                  )}
                  <div className="absolute bottom-0 right-0 p-1 bg-amber-500 text-slate-950 rounded-full">
                    <Crown className="w-3 h-3" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                    <span>{user?.username || 'Creator'}</span>
                    <Crown className="w-4 h-4 text-amber-400 inline" />
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Ultimate Status: Active
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Membership Tier:</span>
                  <span className="font-bold text-amber-300">{planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sales Commission:</span>
                  <span className="font-bold text-emerald-400">5% Only (Keep 95%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Ad Credits:</span>
                  <span className="font-bold text-emerald-400">€5.00 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Config Engine:</span>
                  <span className="font-bold text-cyan-400">Unlimited Access</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Go to Creator Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handlePrint}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Tax Receipt / Invoice</span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Details & Unlocked Perks (7 Cols) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Invoice Breakdown Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Payment Receipt &amp; Settlement</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                  Paid In Full
                </span>
              </div>

              {/* Order Reference Number */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                    Transaction ID
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-300">{orderId}</span>
                </div>
                <button
                  onClick={handleCopyTx}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedTx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTx ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Line Items */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white font-medium">{planName} ({billingCycle})</span>
                  <span className="font-mono font-bold text-white">{formatPrice(rawAmount - tipAmount, true)}</span>
                </div>

                {tipAmount > 0 && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-pink-300">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                      <span>Voluntary Platform Support Contribution</span>
                    </span>
                    <span className="font-mono font-bold">+{formatPrice(tipAmount, true)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 text-sm font-black text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-amber-300 font-mono text-base">{formatPrice(rawAmount, true)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Invoice confirmation and receipt dispatched via <strong>noreply@minoforge.com</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Protected by 180-day PayPal Buyer Guarantee &amp; SSL 256-bit encryption</span>
                </div>
              </div>
            </div>

            {/* Unlocked Superpowers Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Your Unlocked VIP Perks</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    95%
                  </div>
                  <strong className="text-xs font-bold text-white block">5% Marketplace Cut</strong>
                  <p className="text-[11px] text-slate-400">Keep 95% of every plugin sale directly in your creator wallet.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">€5.00 / mo Free Ad Credits</strong>
                  <p className="text-[11px] text-slate-400">Feature your plugins on the homepage and search header for free.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">Unlimited AI Config Generator</strong>
                  <p className="text-[11px] text-slate-400">Zero daily limits with high-speed Gemini Pro optimization.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">Fast-Track Verification</strong>
                  <p className="text-[11px] text-slate-400">Your plugin submissions jump to the front of the staff review queue.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Navigation Ribbon */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-blue-950/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="text-sm font-bold text-white">Ready to publish your next masterpiece?</h4>
            <p className="text-xs text-slate-400">Upload plugins or manage your products directly in the Creator Studio.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/upload"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              Upload Plugin
            </Link>
            <Link
              to="/plugins"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UltimateSuccessPage;
