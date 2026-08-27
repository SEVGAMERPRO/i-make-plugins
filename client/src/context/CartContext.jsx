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

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
  const total = subtotal; // 0% tax / fees on MinoForge digital resources

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
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
