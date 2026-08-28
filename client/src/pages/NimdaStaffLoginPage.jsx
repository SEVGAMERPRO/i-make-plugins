import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Lock, Sparkles, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NimdaAdminDashboard from './NimdaAdminDashboard';

const NimdaStaffLoginPage = () => {
  const { loginWithToken } = useAuth();

  // Zero-Trust Security: Always require 2FA verification on every visit to /nimda
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Clear any existing stored admin session immediately upon mounting
  useEffect(() => {
    localStorage.removeItem('nimda_admin_auth');
  }, []);

  // Stage: 1 = Request Access, 2 = 6-digit OTP 2FA Verification
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 6-digit OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  const handleAdminLogout = () => {
    localStorage.removeItem('nimda_admin_auth');
    setIsAdminAuthenticated(false);
    setStage(1);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccessMsg('');
  };

  // Auto countdown for 2FA resend
  useEffect(() => {
    let timer;
    if (stage === 2 && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, resendCooldown]);

  // Step 1: Request 2FA Security Code
  const handleRequestAccess = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/staff/send-code');

      if (res.data?.success) {
        setStage(2);
        setSuccessMsg('6-Digit Master Security Code dispatched to authorized inbox.');
        setResendCooldown(60);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch security code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit input
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits filled, auto submit
    const fullCode = newOtp.join('');
    if (fullCode.length === 6 && !newOtp.includes('')) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();

      if (pasted.length === 6) {
        verifyCode(pasted);
      }
    }
  };

  // Step 2: Verify OTP
  const verifyCode = async (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit security passcode.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/staff/verify-code', { code });

      if (res.data?.success) {
        if (loginWithToken) {
          loginWithToken(res.data.token, res.data.user);
        } else {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        localStorage.setItem('nimda_admin_auth', 'true');
        setIsAdminAuthenticated(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect verification passcode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated as Master Admin, render full Command & Control Dashboard
  if (isAdminAuthenticated) {
    return <NimdaAdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden font-sans">
      
      {/* High-tech Cyber Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10 space-y-6">
        
        {/* Top Secret Gateway Emblem */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-950/90 border border-cyan-400/40 p-2.5 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <img src="/favicon.svg" alt="MinoForge Emblem" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase shadow-lg shadow-red-500/10">
            <Lock className="w-3.5 h-3.5 animate-pulse" />
            <span>NIMDA SECRET GATEWAY</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Staff &amp; Command Portal
          </h1>
          <p className="text-xs text-slate-400">
            Authorized Personnel Only • 256-Bit Hardware Encrypted
          </p>
        </div>

        {/* Gateway Card Box */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Subtle Cyber Notch */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600" />

          {error && (
            <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-red-200 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !error && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= STEP 1: DIRECT ACCESS REQUEST ================= */}
          {stage === 1 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-white/10 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/20">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base">Master 2FA Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click below to dispatch your single-use 6-digit cryptographic security passcode.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRequestAccess}
                disabled={loading}
                className="btn-glow-blue btn-shimmer btn-animated w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-2xl shadow-blue-500/30 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching Passcode...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Request Master 2FA Passcode</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= STEP 2: 6-DIGIT OTP PASSCODE INPUT ================= */}
          {stage === 2 && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Enter 6-Digit Passcode
                </span>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit security passcode dispatched to your inbox
                </p>
              </div>

              {/* 6-Digit OTP Boxes with Smooth Animations */}
              <div 
                className="flex items-center justify-center gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl border transition-all duration-200 focus:outline-none ${
                      digit
                        ? 'bg-blue-600/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30 scale-105'
                        : 'bg-slate-950/90 border-white/15 text-white focus:border-cyan-400 focus:bg-slate-900'
                    }`}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => verifyCode()}
                disabled={loading || otp.join('').length !== 6}
                className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:via-teal-400 hover:to-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Authenticating...' : 'Authorize Master Session'}</span>
              </button>

              {/* Resend & Back controls */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="hover:text-slate-200 transition-colors"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleRequestAccess}
                  disabled={resendCooldown > 0 || loading}
                  className="text-cyan-400 hover:text-cyan-300 font-bold disabled:text-slate-600 transition-colors cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Passcode'}
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="text-center text-[10px] text-slate-600 font-mono">
          <span>MINOFORGE SECURE ARCHITECTURE • ZERO KNOWLEDGE PASSCODE GATEWAY</span>
        </div>

      </div>

    </div>
  );
};

export default NimdaStaffLoginPage;
