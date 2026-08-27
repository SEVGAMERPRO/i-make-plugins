import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('minoforge_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // No default fake notifications!
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
