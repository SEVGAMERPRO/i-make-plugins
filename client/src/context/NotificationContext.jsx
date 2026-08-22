import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('minoforge_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'welcome-1',
        title: 'Welcome to MinoForge! 🚀',
        message: 'Explore 1,000+ custom game plugins or request a tailor-made build.',
        type: 'info',
        time: 'Just now',
        read: false,
        link: '/plugins'
      },
      {
        id: 'sample-upload-1',
        title: 'Plugin Upload Status: Approved! 🎉',
        message: 'Your plugin "Ultimate Economy & Vault" is approved and live on the marketplace.',
        type: 'approved',
        time: '2 hours ago',
        read: false,
        link: '/plugins/1'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('minoforge_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const addNotification = ({ title, message, type = 'info', link = '#' }) => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      message,
      type, // 'info' | 'pending' | 'approved' | 'denied'
      time: 'Just now',
      read: false,
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
