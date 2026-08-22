import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Smartphone } from 'lucide-react';

const COUNTRIES = [
  { code: '+31', iso: 'nl', flag: '🇳🇱', name: 'Netherlands', placeholder: '06 12 34 56 78' },
  { code: '+32', iso: 'be', flag: '🇧🇪', name: 'Belgium', placeholder: '0470 12 34 56' },
  { code: '+49', iso: 'de', flag: '🇩🇪', name: 'Germany', placeholder: '0151 23456789' },
  { code: '+44', iso: 'gb', flag: '🇬🇧', name: 'United Kingdom', placeholder: '07123 456789' },
  { code: '+1', iso: 'us', flag: '🇺🇸', name: 'United States', placeholder: '(555) 000-0000' },
  { code: '+1', iso: 'ca', flag: '🇨🇦', name: 'Canada', placeholder: '(555) 000-0000' },
  { code: '+33', iso: 'fr', flag: '🇫🇷', name: 'France', placeholder: '06 12 34 56 78' },
  { code: '+34', iso: 'es', flag: '🇪🇸', name: 'Spain', placeholder: '612 34 56 78' },
  { code: '+39', iso: 'it', flag: '🇮🇹', name: 'Italy', placeholder: '312 345 6789' },
  { code: '+41', iso: 'ch', flag: '🇨🇭', name: 'Switzerland', placeholder: '079 123 45 67' },
  { code: '+43', iso: 'at', flag: '🇦🇹', name: 'Austria', placeholder: '0664 1234567' },
  { code: '+61', iso: 'au', flag: '🇦🇺', name: 'Australia', placeholder: '0412 345 678' },
  { code: '+46', iso: 'se', flag: '🇸🇪', name: 'Sweden', placeholder: '070-123 45 67' },
  { code: '+47', iso: 'no', flag: '🇳🇴', name: 'Norway', placeholder: '412 34 567' },
  { code: '+45', iso: 'dk', flag: '🇩🇰', name: 'Denmark', placeholder: '20 12 34 56' },
  { code: '+358', iso: 'fi', flag: '🇫🇮', name: 'Finland', placeholder: '040 1234567' },
  { code: '+48', iso: 'pl', flag: '🇵🇱', name: 'Poland', placeholder: '512 345 678' },
  { code: '+55', iso: 'br', flag: '🇧🇷', name: 'Brazil', placeholder: '(11) 91234-5678' },
  { code: '+91', iso: 'in', flag: '🇮🇳', name: 'India', placeholder: '98765 43210' },
  { code: '+81', iso: 'jp', flag: '🇯🇵', name: 'Japan', placeholder: '090-1234-5678' },
  { code: '+971', iso: 'ae', flag: '🇦🇪', name: 'United Arab Emirates', placeholder: '050 123 4567' },
  { code: '+90', iso: 'tr', flag: '🇹🇷', name: 'Turkey', placeholder: '0532 123 45 67' }
];

const GooglePhoneInput = ({ value, onChange, onCountryChange, selectedCountryCode = '+31' }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      
      {/* Google-Style Container */}
      <div className={`relative flex items-center bg-slate-800/90 rounded-2xl border transition-all duration-200 ${
        dropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/10 hover:border-white/20'
      }`}>
        
        {/* Flag Selector Button */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-3.5 bg-slate-900/60 hover:bg-slate-900 rounded-l-2xl border-r border-white/10 transition-colors focus:outline-none flex-shrink-0"
        >
          <span className="text-xl select-none leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-black text-slate-300 tracking-wide font-mono">{selectedCountry.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
        </button>

        {/* Number Input Field */}
        <div className="relative flex-1 flex items-center">
          <input
            type="tel"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={selectedCountry.placeholder}
            className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none"
          />
          {value && value.length >= 7 && (
            <div className="pr-4 flex items-center text-emerald-400 gap-1 text-[11px] font-bold select-none">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Google-Style Flag Search Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in backdrop-blur-xl">
          
          {/* Search bar */}
          <div className="p-3 border-b border-white/10 bg-slate-950">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search country or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-white/5 hide-scrollbar">
            {filteredCountries.map((c, i) => (
              <button
                key={`${c.iso}-${i}`}
                type="button"
                onClick={() => {
                  onCountryChange(c.code);
                  setDropdownOpen(false);
                  setSearch('');
                }}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-xs text-left hover:bg-blue-600/15 hover:text-white transition-colors ${
                  selectedCountryCode === c.code ? 'bg-blue-600/20 text-blue-300 font-bold' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px] font-bold">{c.code}</span>
              </button>
            ))}

            {filteredCountries.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No country found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Google Verified Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
        <span>Google International Phone Format</span>
        <span className="text-slate-500">SMS / WhatsApp Ready</span>
      </div>

    </div>
  );
};

export default GooglePhoneInput;
