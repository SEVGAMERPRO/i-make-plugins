import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Search, MessageSquare, Settings, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-50 text-[#2196F3]' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900';
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-2xl border-r border-gray-100 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <span className="font-bold text-lg text-[#1A1A2E]">Menu</span>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {user && (
            <div className="px-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#BBDEFB] text-[#1976D2] rounded-full flex items-center justify-center font-bold">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{user.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-[#1A1A2E] truncate">{user.username}</p>
                  <Link to={`/users/${user.username}`} className="text-xs text-[#2196F3] hover:underline block truncate" onClick={onClose}>
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          )}

          <nav className="px-2 space-y-1">
            <Link to="/" onClick={onClose} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/')}`}>
              <Home className="w-5 h-5" /> Home
            </Link>
            <Link to="/plugins" onClick={onClose} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/plugins')}`}>
              <Search className="w-5 h-5" /> Browse Plugins
            </Link>
            
            {user && (
              <>
                <div className="pt-4 pb-1 px-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dashboard</p>
                </div>
                <Link to="/dashboard" onClick={onClose} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/dashboard')}`}>
                  <User className="w-5 h-5" /> Overview
                </Link>
                <Link to="/my-plugins" onClick={onClose} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/my-plugins')}`}>
                  <Package className="w-5 h-5" /> My Plugins
                </Link>
                <Link to="/chats" onClick={onClose} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/chats')}`}>
                  <MessageSquare className="w-5 h-5" /> Messages
                </Link>
                <Link to="/settings" onClick={onClose} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/settings')}`}>
                  <Settings className="w-5 h-5" /> Settings
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
