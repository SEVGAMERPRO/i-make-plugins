import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, X, Code2, ShieldCheck, DollarSign, Phone, ChevronDown } from 'lucide-react';
import axios from 'axios';

const COUNTRY_CODES = [
  { code: '+31', flag: '🇳🇱', name: 'Netherlands (+31)' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium (+32)' },
  { code: '+49', flag: '🇩🇪', name: 'Germany (+49)' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom (+44)' },
  { code: '+1', flag: '🇺🇸', name: 'United States (+1)' },
  { code: '+1', flag: '🇨🇦', name: 'Canada (+1)' },
  { code: '+33', flag: '🇫🇷', name: 'France (+33)' },
  { code: '+34', flag: '🇪🇸', name: 'Spain (+34)' },
  { code: '+39', flag: '🇮🇹', name: 'Italy (+39)' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland (+41)' },
  { code: '+43', flag: '🇦🇹', name: 'Austria (+43)' },
  { code: '+61', flag: '🇦🇺', name: 'Australia (+61)' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden (+46)' },
  { code: '+47', flag: '🇳🇴', name: 'Norway (+47)' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark (+45)' },
  { code: '+358', flag: '🇫🇮', name: 'Finland (+358)' },
  { code: '+48', flag: '🇵🇱', name: 'Poland (+48)' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil (+55)' },
  { code: '+91', flag: '🇮🇳', name: 'India (+91)' },
  { code: '+81', flag: '🇯🇵', name: 'Japan (+81)' },
];

const CustomPluginRequestModal = ({ isOpen, onClose }) => {
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
    if (!email.trim() || !phoneNumber.trim() || !requestDetails.trim()) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields (Email, Phone Number, and Specifications).'
      });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      // 24/7 Cloud Email Gateway
      // 1. Sends full request ALWAYS to minoforge.requests@gmail.com
      // 2. Sends automated confirmation receipt to the user's email
      // 3. Completely hides all personal Google accounts and profile pictures
      const formData = new FormData();
      formData.append('_subject', `🚀 New Custom Plugin Order from colasmp.net [${game}]`);
      formData.append('email', email);
      formData.append('Client Email', email);
      formData.append('Phone Number', fullPhoneNumber);
      formData.append('Platform / Game', game);
      formData.append('Estimated Budget', budget);
      formData.append('Specifications & Details', requestDetails);
      formData.append('Order Timestamp', new Date().toLocaleString());
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      formData.append('_replyto', email);
      formData.append('_autoresponse', `Thank you for contacting MinoForge Development!

We have received your custom plugin order for ${game}.
Our engineering team is reviewing your project requirements and will contact you directly at ${email} or via SMS/WhatsApp at ${fullPhoneNumber} within 24 hours.

Best regards,
MinoForge Engineering Team
Official Marketplace: colasmp.net`);

      await fetch('https://formsubmit.co/ajax/minoforge.requests@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      // Also dispatch to local server if active
      await axios.post('/api/requests/custom', {
        email,
        phone: fullPhoneNumber,
        game,
        budget,
        requestDetails,
        recipient: 'minoforge.requests@gmail.com',
        timestamp: new Date().toISOString()
      }).catch(() => {});

      // Show success notification popup
      setNotification({
        type: 'success',
        message: `Your custom plugin request has been sent to minoforge.requests@gmail.com! A confirmation receipt has been sent to ${email}.`
      });

      // Clear form
      setRequestDetails('');
      setPhoneNumber('');
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Error sending request. Please check your connection or email us directly at minoforge.requests@gmail.com'
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
            <div className="flex rounded-xl bg-slate-800/80 border border-white/10 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              
              {/* Flag & Dial Code Select */}
              <div className="relative flex items-center bg-slate-900/90 border-r border-white/10 px-3 py-2 cursor-pointer hover:bg-slate-900 transition-colors">
                <span className="text-lg mr-1.5 select-none">{selectedCountry.flag}</span>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer appearance-none pr-4"
                >
                  {COUNTRY_CODES.map((c, i) => (
                    <option key={`${c.code}-${i}`} value={c.code} className="bg-slate-900 text-white">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
              </div>

              {/* Phone Input Box */}
              <input
                type="tel"
                required
                placeholder="06 12345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 bg-transparent px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Used for urgent dev notifications and order status.</span>
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
