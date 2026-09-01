import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingCart, ArrowRight, ShieldCheck, Sparkles, Download, CheckCircle2, Tag, Check, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';

const CartDrawer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    total, 
    appliedCoupon, 
    discountAmount, 
    couponError, 
    applyCoupon, 
    removeCoupon, 
    setIsCheckoutOpen,
    openCheckoutWithMethod 
  } = useCart();
  const { formatPrice, activeCurrency } = useCurrency();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleProceedToCheckout = (method = 'applepay') => {
    setIsCartOpen(false);
    if (!user) {
      navigate('/login?redirect=/plugins');
      return;
    }
    openCheckoutWithMethod(method);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-950/98 backdrop-blur-2xl border-l border-white/10 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Your Cart</h2>
                <p className="text-xs text-slate-400">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingCart className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-bold text-white text-base">Your cart is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse verified game plugins, Minecraft addons, FiveM scripts, and Discord bots to add to your server.
                </p>
                <Link
                  to="/plugins"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-animated btn-glow-blue inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 bg-slate-900/80 border border-white/10 rounded-2xl flex items-center gap-3.5 group hover:border-blue-500/30 transition-all"
                  >
                    <img 
                      src={item.coverImageUrl} 
                      alt={item.title} 
                      className="w-14 h-14 rounded-xl object-cover bg-slate-950 flex-shrink-0 border border-white/10"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-300 rounded border border-blue-500/20">
                        {item.gameName}
                      </span>
                      <h4 className="font-bold text-white text-xs truncate mt-1 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">By {item.authorName}</p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="font-black text-sm text-emerald-400">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-slate-900/60 space-y-4">
              
              {/* Trust Badge */}
              <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-[11px]">MinoShield™ Bytecode Verified &amp; 100% Exploit Free</span>
              </div>

              {/* Promo / Coupon Code Section */}
              <div className="space-y-2 pt-1">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-bold font-mono">{appliedCoupon.code}</span>
                      <span className="text-emerald-400 font-semibold">({appliedCoupon.percent}% off applied)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-400 hover:text-red-300 font-bold ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Coupon Code (e.g. MINO20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-400 font-medium">{couponError}</p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold">{formatPrice(subtotal, true)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-mono font-bold">-{formatPrice(discountAmount, true)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Digital Delivery &amp; DRM License</span>
                  <span className="text-emerald-400 font-bold">Instant Free</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 font-mono text-base">{formatPrice(total, true)}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleProceedToCheckout('applepay')}
                  className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 cursor-pointer"
                >
                  <span>Checkout All Items ({formatPrice(total, true)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 4 Express 1-Click Payment Gateways */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Apple Pay Button */}
                  <button
                    onClick={() => handleProceedToCheckout('applepay')}
                    className="py-2.5 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-white/20 transition-all cursor-pointer"
                  >
                    <span>Pay with</span>
                    <span className="font-bold text-sm tracking-tight flex items-center">
                      <span></span><span>Pay</span>
                    </span>
                  </button>

                  {/* Google Pay Button */}
                  <button
                    onClick={() => handleProceedToCheckout('googlepay')}
                    className="py-2.5 bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-white/15 transition-all cursor-pointer"
                  >
                    <span>Pay with</span>
                    <span className="font-bold text-xs tracking-tight flex items-center">
                      <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">P</span><span className="text-[#FBBC05]">a</span><span className="text-[#34A853]">y</span>
                    </span>
                  </button>

                  {/* PayPal Button */}
                  <button
                    onClick={() => handleProceedToCheckout('paypal')}
                    className="py-2.5 bg-[#ffc439] hover:bg-[#f4b628] active:scale-[0.99] text-[#003087] font-black text-xs rounded-xl flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                  >
                    <span>Pay with</span>
                    <span className="font-black text-xs tracking-tight italic">
                      <span className="text-[#003087]">Pay</span><span className="text-[#0079C1]">Pal</span>
                    </span>
                  </button>

                  {/* iDEAL Button */}
                  <button
                    onClick={() => handleProceedToCheckout('ideal')}
                    className="py-2.5 bg-[#cc0066] hover:bg-[#b30059] active:scale-[0.99] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                  >
                    <span>Pay with</span>
                    <span className="font-black text-[11px] tracking-tight uppercase bg-white text-[#cc0066] px-1 py-0.2 rounded font-mono">
                      iDEAL
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <span>🔒 256-Bit SSL</span>
                <span>•</span>
                <span>🍎 Apple Pay</span>
                <span>•</span>
                <span>🌐 Google Pay</span>
                <span>•</span>
                <span>🅿️ PayPal</span>
                <span>•</span>
                <span>🏦 iDEAL</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
