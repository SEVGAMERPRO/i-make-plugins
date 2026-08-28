import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('minoforge_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('minoforge_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (plugin, openDrawer = true) => {
    if (!plugin) return;
    setCartItems(prev => {
      const exists = prev.some(item => item.id === plugin.id);
      if (exists) return prev;
      return [...prev, {
        id: plugin.id,
        title: plugin.title,
        price: parseFloat(plugin.price) || 0,
        gameName: plugin.gameName || plugin.game || 'Universal',
        coverImageUrl: plugin.coverImageUrl || '/images/plugins/minecraft_economy_gui.svg',
        authorName: plugin.authorName || 'MinoDeveloper',
        downloadUrl: plugin.downloadUrl || '/downloads/UltimateEconomy-v2.4.0.zip',
        version: plugin.version || 'v1.0.0'
      }];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (pluginId) => {
    setCartItems(prev => prev.filter(item => item.id !== pluginId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (pluginId) => {
    return cartItems.some(item => item.id === pluginId);
  };

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const VALID_COUPONS = {
    'MINO20': { code: 'MINO20', percent: 20, desc: '20% Summer Launch Promo' },
    'LAUNCH10': { code: 'LAUNCH10', percent: 10, desc: '10% Welcome Discount' },
    'VIP50': { code: 'VIP50', percent: 50, desc: '50% VIP Creator Pass' },
    'BUILDBYBIT': { code: 'BUILDBYBIT', percent: 15, desc: '15% Community Special' }
  };

  const applyCoupon = (code) => {
    setCouponError('');
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    const cleanCode = code.trim().toUpperCase();
    if (VALID_COUPONS[cleanCode]) {
      setAppliedCoupon(VALID_COUPONS[cleanCode]);
      return true;
    } else {
      setCouponError('Invalid or expired coupon code.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
  const discountAmount = appliedCoupon ? (subtotal * (appliedCoupon.percent / 100)) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
        appliedCoupon,
        discountAmount: discountAmount.toFixed(2),
        couponError,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
