import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A2E] text-white pt-12 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <div className="w-8 h-8 bg-[#2196F3] rounded flex items-center justify-center text-white font-bold text-sm">
                MF
              </div>
              <span>MinoForge</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm mb-4">
              The premium marketplace for high-quality game plugins. Find exactly what you need to take your server to the next level.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Marketplace</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/plugins" className="hover:text-white transition-colors">Browse All</Link></li>
              <li><Link to="/games/minecraft" className="hover:text-white transition-colors">Minecraft Plugins</Link></li>
              <li><Link to="/games/roblox" className="hover:text-white transition-colors">Roblox Assets</Link></li>
              <li><Link to="/games/fivem" className="hover:text-white transition-colors">FiveM Scripts</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MinoForge. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
