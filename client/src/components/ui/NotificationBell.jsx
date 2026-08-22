import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, XCircle, Clock, Info, Check, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'approved':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
      case 'denied':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'pending':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-300';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        
        {/* Red Unread Notification Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse border border-slate-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Glassmorphic Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in divide-y divide-white/5">
          
          {/* Header */}
          <div className="p-4 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold text-[11px] rounded-full border border-red-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors p-1"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 hide-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400">No notifications right now.</p>
                <p className="text-[11px] text-slate-600">You'll see plugin approvals, upload statuses, and reviews here.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link || '#'}
                  onClick={() => {
                    markAsRead(n.id);
                    setIsOpen(false);
                  }}
                  className={`p-3.5 flex items-start gap-3 hover:bg-white/5 transition-colors block ${
                    !n.read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className={`p-2 rounded-xl border flex-shrink-0 ${getBadgeStyle(n.type)}`}>
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      {n.time}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-2" />
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-950/60 text-center">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-slate-400 hover:text-blue-400 font-semibold transition-colors"
            >
              View Creator Dashboard →
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationBell;
