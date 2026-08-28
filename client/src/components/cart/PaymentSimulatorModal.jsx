import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, ShieldCheck, Download, Sparkles, Lock, ArrowRight, RefreshCw, Copy, Check, Wallet, QrCode, Key, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import PayPalSmartButtons from './PayPalSmartButtons';

const PAYMENT_METHODS = [
  { id: 'paypal', name: 'PayPal & Cards', icon: Wallet, subtitle: 'Official 1-Click PayPal Gateway' },
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, subtitle: 'Visa, Mastercard, Amex, Apple Pay' },
  { id: 'crypto', name: 'Web3 Crypto Gateway', icon: QrCode, subtitle: 'Bitcoin, Ethereum, Solana, USDT' },
  { id: 'credits', name: 'MinoForge Wallet', icon: Sparkles, subtitle: 'Creator Earnings Balance' }
];

const PaymentSimulatorModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cartItems, total, clearCart } = useCart();
  const { formatPrice, activeCurrency } = useCurrency();
  const [selectedMethod, setSelectedMethod] = useState('paypal');
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [processingStep, setProcessingStep] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [generatedLicenses, setGeneratedLicenses] = useState([]);

  // Form Fields
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('842');
  const [cardName, setCardName] = useState('Alex Developer');

  if (!isCheckoutOpen) return null;

  const { user } = useAuth();

  const handleSimulatePayment = () => {
    setStatus('processing');
    setProcessingStep(0);

    const generatedId = `MF-${Math.floor(100000 + Math.random() * 900000)}`;
    setTransactionId(generatedId);

    // Generate license keys for each item
    const licenses = cartItems.map(item => ({
      pluginId: item.id,
      pluginTitle: item.title,
      authorName: item.authorName || 'MinoDeveloper',
      orderId: generatedId,
      licenseKey: `MF-${(item.title || 'PLG').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      issuedAt: new Date().toISOString()
    }));
    setGeneratedLicenses(licenses);

    // Persist licenses locally
    try {
      const existingLicenses = JSON.parse(localStorage.getItem('minoforge_licenses') || '[]');
      localStorage.setItem('minoforge_licenses', JSON.stringify([...licenses, ...existingLicenses]));

      const existingChats = JSON.parse(localStorage.getItem('minoforge_user_chats') || '[]');
      cartItems.forEach(item => {
        const chatItem = {
          id: `chat-${Date.now()}-${item.id}`,
          creator: item.authorName || 'MinoDeveloper',
          pluginTitle: item.title,
          orderId: generatedId,
          updatedAt: new Date().toISOString(),
          unread: 1,
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: item.authorName || 'MinoDeveloper',
              text: `Hello! Thank you for purchasing ${item.title}. Your DRM license key is active. Feel free to message here if you need assistance!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        existingChats.unshift(chatItem);
      });
      localStorage.setItem('minoforge_user_chats', JSON.stringify(existingChats));
    } catch (err) {
      console.warn('LocalStorage error during license creation:', err);
    }

    setTimeout(() => setProcessingStep(1), 600);
    setTimeout(() => setProcessingStep(2), 1400);
    setTimeout(() => setProcessingStep(3), 2200);

    setTimeout(async () => {
      setStatus('success');
      
      try {
        await axios.post('/api/orders/confirm-purchase', {
          buyerUsername: user?.username || 'GuestBuyer',
          buyerEmail: user?.email || 'customer@minoforge.com',
          items: cartItems,
          totalAmount: total,
          transactionId: generatedId
        });
      } catch (err) {
        console.warn('Backend order sync:', err);
      }

      clearCart();
    }, 2800);
  };

  const handlePayPalSuccess = (data) => {
    setTransactionId(data.transactionId || `MF-${Date.now()}`);
    setGeneratedLicenses(data.licenses || []);
    
    try {
      const existingLicenses = JSON.parse(localStorage.getItem('minoforge_licenses') || '[]');
      localStorage.setItem('minoforge_licenses', JSON.stringify([...(data.licenses || []), ...existingLicenses]));
    } catch (e) {
      console.warn('Failed to persist licenses', e);
    }

    setStatus('success');
    clearCart();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setProcessingStep(0);
    }, 300);
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={status === 'processing' ? null : handleClose}
      />

      <div className="relative bg-slate-950 border border-white/15 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-white my-8 z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">MinoForge Secure Checkout</h2>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  256-BIT SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">Official encrypted checkout &amp; instant DRM license activation</p>
            </div>
          </div>

          {status !== 'processing' && (
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* ================= STAGE 1: IDLE / FORM ================= */}
          {status === 'idle' && (
            <div className="space-y-6">
              
              {/* Order Summary Strip */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Due ({cartItems.length} items)</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">${total} USD</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>MinoShield 100% Protected</span>
                  </span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                            : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <div className={`p-2 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong className="block text-xs font-bold text-white">{method.name}</strong>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">{method.subtitle}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Method Specific Form */}
              {selectedMethod === 'card' && (
                <div className="p-5 bg-slate-900/60 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Credit / Debit Card</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      256-Bit SSL Encrypted
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="842"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'paypal' && (
                <div className="p-6 bg-slate-900/80 rounded-2xl border border-amber-500/30 space-y-4 shadow-xl shadow-amber-500/5">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                      <span className="font-black text-xl tracking-tighter text-[#003087]">
                        <span className="text-[#0079C1]">P</span>P
                      </span>
                    </div>
                    <h4 className="font-black text-white text-base flex items-center justify-center gap-2">
                      <span>PayPal Official Gateway</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">Instant Live</span>
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click below to checkout directly via your PayPal balance, linked bank account, or debit/credit card.
                    </p>
                  </div>

                  <div className="pt-2">
                    <PayPalSmartButtons
                      items={cartItems}
                      totalAmount={total}
                      onSuccess={handlePayPalSuccess}
                      onError={(err) => console.error('PayPal checkout error', err)}
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'crypto' && (
                <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Web3 Multi-Chain Gateway</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Supports Solana (USDC/SOL), Ethereum (USDT/ETH), and Bitcoin with instant DRM license key issuance.
                  </p>
                </div>
              )}

              {selectedMethod === 'credits' && (
                <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">MinoForge Creator Wallet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Deducts automatically from your verified creator earnings balance.
                  </p>
                </div>
              )}

              {/* Submit Pay Button for Card/Crypto/Credits */}
              {selectedMethod !== 'paypal' && (
                <button
                  onClick={handleSimulatePayment}
                  className="btn-glow-blue btn-shimmer btn-animated w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-2xl shadow-blue-500/30 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Complete Order of {formatPrice(total, true)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>
          )}

          {/* ================= STAGE 2: PROCESSING ================= */}
          {status === 'processing' && (
            <div className="py-12 text-center space-y-8">
              
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black text-white">Finalizing Your Order...</h3>
                
                {/* Step Progress Indicators */}
                <div className="max-w-md mx-auto space-y-2 text-xs">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    processingStep >= 1 ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-slate-900 border-white/5 text-slate-500'
                  }`}>
                    {processingStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>1. Authorizing secure 256-bit gateway handshake...</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    processingStep >= 2 ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-slate-900 border-white/5 text-slate-500'
                  }`}>
                    {processingStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>2. Generating official DRM license keys &amp; download access...</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    processingStep >= 3 ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-slate-900 border-white/5 text-slate-500'
                  }`}>
                    {processingStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>3. Dispatching invoice confirmation via noreply@minoforge.com...</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STAGE 3: SUCCESS & DOWNLOAD DISPATCH ================= */}
          {status === 'success' && (
            <div className="py-4 space-y-6">
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-white">Payment Approved &amp; Order Complete!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for your order! Your digital licenses have been activated and your downloads are ready below.
                </p>
              </div>

              {/* Receipt Information Card */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Transaction Reference</span>
                  <strong className="text-white font-mono text-sm">{transactionId}</strong>
                </div>
                <button
                  onClick={handleCopyTx}
                  className="btn-animated px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 text-[11px]"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Generated License Keys Section */}
              {generatedLicenses.length > 0 && (
                <div className="space-y-3 p-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                      <Key className="w-4 h-4 text-cyan-400" />
                      <span>Your Plugin License Key (DRM)</span>
                    </h4>
                    <span className="text-[10px] text-cyan-400/80 font-mono">Bound to Order #{transactionId}</span>
                  </div>

                  <div className="space-y-2">
                    {generatedLicenses.map((lic, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                          <strong className="text-xs text-white block">{lic.pluginTitle}</strong>
                          <span className="text-xs font-mono font-bold text-emerald-400 select-all">{lic.licenseKey}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(lic.licenseKey);
                            setCopiedKey(lic.licenseKey);
                            setTimeout(() => setCopiedKey(''), 2000);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1 font-mono transition-all cursor-pointer"
                        >
                          {copiedKey === lic.licenseKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === lic.licenseKey ? 'Copied' : 'Copy Key'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat with Creator for Support / Refund Box */}
              <div className="p-4 bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-950/40 border border-purple-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>Creator Support &amp; Refund Request</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                    DIRECT CHAT CREATED
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  We automatically opened a 1-on-1 chat thread with the plugin author. If you need help with installation, server configuration, or wish to request a refund, chat directly with the owner!
                </p>
                <Link
                  to="/chats"
                  onClick={handleClose}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open 1-on-1 Chat with Creator</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Instant Download Archives */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Instant Package Downloads</span>
                </h4>

                <div className="space-y-2">
                  <a
                    href="/downloads/UltimateEconomy-v2.4.0.zip"
                    download
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-white block">UltimateEconomy-v2.4.0.zip</strong>
                        <span className="text-[10px] text-slate-400">Includes plugin.yml, config.yml, README.txt</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow">
                      Download
                    </span>
                  </a>

                  <a
                    href="/downloads/advanced_fuel-v1.1.2.zip"
                    download
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-orange-500/30 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-white block">advanced_fuel-v1.1.2.zip</strong>
                        <span className="text-[10px] text-slate-400">Includes fxmanifest.lua, config.lua, README.txt</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-orange-500 text-slate-950 font-black text-xs rounded-xl shadow">
                      Download
                    </span>
                  </a>

                  <a
                    href="/downloads/DiscordTicketBot-v1.0.0.zip"
                    download
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-blue-500/30 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-white block">DiscordTicketBot-v1.0.0.zip</strong>
                        <span className="text-[10px] text-slate-400">Includes install.bat, index.js, config.example.json</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-500 text-white font-black text-xs rounded-xl shadow">
                      Download
                    </span>
                  </a>
                </div>
              </div>

              {/* Done Button */}
              <button
                onClick={handleClose}
                className="btn-animated w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-white/10 cursor-pointer"
              >
                Done &amp; Return to Marketplace
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PaymentSimulatorModal;
