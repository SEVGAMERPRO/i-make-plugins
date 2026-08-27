import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const CurrencySwitcher = ({ compact = false, className = '' }) => {
  const { currency, activeCurrency, setCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Switcher Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl border transition-all cursor-pointer select-none ${
          compact
            ? 'px-2.5 py-1 text-xs bg-slate-900/80 hover:bg-slate-800 border-white/10 hover:border-cyan-400/40 text-slate-200'
            : 'px-3 py-1.5 text-xs font-bold bg-slate-900/90 hover:bg-slate-800/90 border-white/15 hover:border-cyan-400/60 text-white shadow-md'
        }`}
        title="Change Display Currency"
        aria-label="Currency Switcher"
      >
        <span className="text-sm leading-none">{activeCurrency.flag}</span>
        <span className="font-mono font-bold tracking-tight">{activeCurrency.code}</span>
        <span className="text-cyan-400 font-bold text-[11px]">({activeCurrency.symbol})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-300' : ''}`} />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 p-1.5 animate-fade-in space-y-1">
          <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Select Currency</span>
            <Globe className="w-3 h-3 text-cyan-400" />
          </div>

          <div className="max-h-60 overflow-y-auto py-1 space-y-0.5 custom-scrollbar">
            {currencies.map((curr) => {
              const isSelected = curr.code === currency;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{curr.flag}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white font-mono">{curr.code}</strong>
                        <span className="text-cyan-400 font-bold text-[11px]">({curr.symbol})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block -mt-0.5 leading-tight">{curr.name}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
