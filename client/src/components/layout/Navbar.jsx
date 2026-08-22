import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, Settings, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-40 border-b border-gray-100 flex items-center px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#1A1A2E]">
          <div className="w-8 h-8 bg-[#2196F3] rounded flex items-center justify-center text-white font-bold text-sm">
            MF
          </div>
          <span className="hidden sm:inline">MinoForge</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-[#2196F3] font-medium px-4 py-2 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="bg-[#2196F3] hover:bg-[#1976D2] text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
              Register
            </Link>
          </>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-9 h-9 bg-[#BBDEFB] text-[#1976D2] rounded-full flex items-center justify-center font-bold overflow-hidden border border-gray-200">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link 
                    to="/my-plugins" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package className="w-4 h-4" /> My Plugins
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
