import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, X, Code2, ShieldCheck, DollarSign, Phone } from 'lucide-react';
import GooglePhoneInput from './GooglePhoneInput';
import axios from 'axios';

const CustomPluginRequestModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+31');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [game, setGame] = useState('Minecraft');
  const [budget, setBudget] = useState('$50 - $150');
  const [requestDetails, setRequestDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!isOpen) return null;

  const fullPhoneNumber = `${countryCode} ${phoneNumber.trim()}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setNotification({
        type: 'error',
        message: 'Please provide a valid email address (e.g., yourname@domain.com).'
      });
      return;
    }

    // 2. Phone number validation (at least 7 digits)
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim() || digitsOnly.length < 7) {
      setNotification({
        type: 'error',
        message: 'Please enter a valid phone number (minimum 7 digits).'
      });
      return;
    }

    // 3. Specifications validation
    if (!requestDetails.trim() || requestDetails.trim().length < 5) {
      setNotification({
        type: 'error',
        message: 'Please provide detailed specifications for your plugin request.'
      });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      // Dispatch directly via MinoForge Mailer API
      // 1. Sends full order details to minoforge.requests@gmail.com
      // 2. Sends official confirmation receipt to the requester's email (${email})
      // 3. Sender Name is strictly "MinoForgeRequests"
      const response = await axios.post('/api/requests/custom', {
        email,
        phone: fullPhoneNumber,
        game,
        budget,
        requestDetails,
        recipient: 'minoforge.requests@gmail.com',
        timestamp: new Date().toLocaleString()
      });

      if (response.data && response.data.success) {
        onClose();
        navigate('/request-success', {
          state: {
            email,
            phone: fullPhoneNumber,
            game,
            budget
          }
        });
      } else {
        throw new Error(response.data?.message || 'Failed to dispatch emails.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setNotification({
        type: 'error',
        message: 'Error sending request. Please check your connection or try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6 max-h-[90vh] overflow-y-auto hide-scrollbar">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Order a Custom Plugin</h3>
              <p className="text-xs text-slate-400">Direct development by the official MinoForge engineering team</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Notification Popup (Green Success or Red Error) */}
        {notification && (
          <div 
            className={`p-4 rounded-2xl border text-sm flex items-start gap-3 animate-fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-red-500/15 border-red-500/40 text-red-300 shadow-lg shadow-red-500/10'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold">{notification.type === 'success' ? 'Request Sent Successfully!' : 'Error Sending Request'}</p>
              <p className="text-xs mt-0.5 leading-relaxed text-slate-200">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Google-Style Phone Number Input with Flag Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Phone Number (WhatsApp / SMS) *
            </label>
            <GooglePhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              selectedCountryCode={countryCode}
              onCountryChange={setCountryCode}
            />
          </div>

          {/* Platform & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Platform
              </label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Minecraft">Minecraft (Spigot/Paper/Folia)</option>
                <option value="Minecraft: 2b2t & Anarchy Clients">Minecraft: 2b2t & Anarchy</option>
                <option value="FiveM">FiveM (QBCore/ESX/Lua)</option>
                <option value="Roblox">Roblox Studio</option>
                <option value="Discord">Discord Bot (JS/Python)</option>
                <option value="Websites">Custom Web Portal / Store</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Budget Range (USD)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="$20 - $50">$20 - $50 (Simple script)</option>
                <option value="$50 - $150">$50 - $150 (Standard plugin)</option>
                <option value="$150 - $350">$150 - $350 (Advanced system)</option>
                <option value="$350+">$350+ (Full server framework)</option>
              </select>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Detailed Plugin Request & Commands *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the exact features, commands, events, or GUI menus you want us to create for you..."
              value={requestDetails}
              onChange={(e) => setRequestDetails(e.target.value)}
              className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Direct delivery to <strong>minoforge.requests@gmail.com</strong> with 100% bug-free guarantee.</span>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Request...' : 'Send Request'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CustomPluginRequestModal;
