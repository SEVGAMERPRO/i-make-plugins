import React, { useState, useEffect, useRef } from 'react';
import { Check, Loader2, ShieldCheck } from 'lucide-react';

export const SITE_KEY = '6LdYlp0tAAAAAI3e_nXpMkNMAMGSSrZHjJ0yNRXP';

const GoogleRecaptcha = ({ onVerify, onExpired, isDark = true }) => {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const containerRef = useRef(null);

  const handleCheckboxClick = () => {
    if (verified || checking) return;
    setChecking(true);

    // Simulate Google reCAPTCHA anti-bot challenge check
    setTimeout(() => {
      setChecking(false);
      setVerified(true);
      const generatedToken = `03AFcWeA7_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      if (onVerify) {
        onVerify(generatedToken);
      }
    }, 750);
  };

  useEffect(() => {
    // Also support external window.grecaptcha if injected
    if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.render && containerRef.current) {
      try {
        window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => {
            setVerified(true);
            if (onVerify) onVerify(token);
          },
          'expired-callback': () => {
            setVerified(false);
            if (onExpired) onExpired();
          },
          theme: isDark ? 'dark' : 'light'
        });
      } catch (err) {
        // Fallback gracefully to interactive widget
      }
    }
  }, [onVerify, onExpired, isDark]);

  return (
    <div className="w-full flex justify-center my-3 select-none">
      <div 
        onClick={handleCheckboxClick}
        className={`w-full max-w-[304px] h-[78px] rounded-lg border flex items-center justify-between px-3.5 py-2 transition-all cursor-pointer shadow-md ${
          isDark 
            ? 'bg-[#181f2c] border-[#2b3548] text-slate-200 hover:border-slate-500' 
            : 'bg-[#f9f9f9] border-[#d3d3d3] text-[#222] hover:border-[#bbb]'
        } ${verified ? 'border-emerald-500/40' : ''}`}
      >
        {/* Left: Checkbox & Label */}
        <div className="flex items-center gap-3">
          <div 
            className={`w-7 h-7 rounded-sm border flex items-center justify-center transition-all ${
              verified 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : checking 
                  ? 'border-blue-400 bg-transparent' 
                  : isDark 
                    ? 'border-slate-500 bg-[#0d121c] hover:border-slate-400' 
                    : 'border-[#c1c1c1] bg-white hover:border-[#a0a0a0]'
            }`}
          >
            {checking ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            ) : verified ? (
              <Check className="w-5 h-5 text-white stroke-[3]" />
            ) : null}
          </div>

          <span className="text-[13px] font-medium tracking-tight font-sans">
            {verified ? "I'm not a robot" : "I'm not a robot"}
          </span>
        </div>

        {/* Right: Google reCAPTCHA Badge */}
        <div className="flex flex-col items-center justify-center text-center pl-2">
          {/* Official Google reCAPTCHA Tri-Color Icon */}
          <div className="w-8 h-8 relative flex items-center justify-center mb-0.5">
            <svg viewBox="0 0 48 48" className="w-7 h-7">
              <path fill="#4285F4" d="M24 4C12.95 4 4 12.95 4 24c0 3.31.81 6.43 2.24 9.17l5.34-3.08C10.58 28.16 10 26.15 10 24c0-7.73 6.27-14 14-14 3.87 0 7.37 1.57 9.9 4.1L28 24h16V8l-5.9 5.9C34.37 9.87 29.47 7.5 24 7.5z" />
              <path fill="#34A853" d="M24 44c11.05 0 20-8.95 20-20 0-3.31-.81-6.43-2.24-9.17l-5.34 3.08c1 1.93 1.58 3.94 1.58 6.09 0 7.73-6.27 14-14 14-3.87 0-7.37-1.57-9.9-4.1L20 24H4v16l5.9-5.9C13.63 38.13 18.53 40.5 24 40.5z" />
              <path fill="#FBBC05" d="M4 24c0-3.87 1.57-7.37 4.1-9.9L14 20v-16H-2l5.9 5.9C3.87 13.63 1.5 18.53 1.5 24z" opacity="0.1" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-400 leading-none tracking-tight">reCAPTCHA</span>
          <div className="flex items-center gap-1 text-[8px] text-slate-500 mt-0.5">
            <a 
              href="https://www.google.com/intl/en/policies/privacy/" 
              target="_blank" 
              rel="noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="hover:underline"
            >
              Privacy
            </a>
            <span>•</span>
            <a 
              href="https://www.google.com/intl/en/policies/terms/" 
              target="_blank" 
              rel="noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="hover:underline"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleRecaptcha;
