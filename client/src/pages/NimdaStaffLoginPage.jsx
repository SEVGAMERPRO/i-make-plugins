import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, KeyRound, Sparkles, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NimdaStaffLoginPage = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  // Stage: 1 = Credentials, 2 = 6-digit OTP 2FA Verification
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('severinkaptein8@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 6-digit OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

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

  // Handle Step 1: Submit Staff Credentials
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/staff/send-code', {
        email: email.trim(),
        password: password
      });

      if (res.data.success) {
        setStage(2);
        setSuccessMsg(`6-Digit Security Code sent to ${email}`);
        setResendCooldown(60);
        // Focus first OTP box
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Staff Gateway credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (index, value) => {
    // Only allow single digit
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits filled, automatically trigger verification
    const fullCode = newOtp.join('');
    if (fullCode.length === 6) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace handling to go back
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
      setError('Please enter the full 6-digit code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/staff/verify-code', {
        email: email.trim(),
        code
      });

      if (res.data.success) {
        // Log in user as ADMIN
        if (loginWithToken) {
          loginWithToken(res.data.token, res.data.user);
        } else {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        // Navigate to Staff Tickets Command Center
        navigate('/staff/tickets');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/staff/send-code', { email, password });
      setSuccessMsg('A new verification code has been emailed to you.');
      setResendCooldown(60);
    } catch (err) {
      setError('Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden">
      
      {/* High-tech Cyber Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10 space-y-6">
        
        {/* Top Secret Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase shadow-lg shadow-red-500/10">
            <Lock className="w-3.5 h-3.5 animate-pulse" />
            <span>NIMDA SECRET GATEWAY</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Staff &amp; Command Portal
          </h1>
          <p className="text-xs text-slate-400">
            Authorized personnel only • 2FA 256-Bit Hardware Encrypted
          </p>
        </div>

        {/* Card Box */}
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

          {/* ================= STEP 1: CREDENTIALS ================= */}
          {stage === 1 && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Staff Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
                    placeholder="staff@minoforge.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Master Staff Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                <span>{loading ? 'Authorizing...' : 'Request 2FA Security Passcode'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */}
          {stage === 2 && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Email Verification Code
                </span>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit code sent to <strong className="text-white">{email}</strong>
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
                        : 'bg-slate-950/90 border-white/15 text-white focus:border-blue-500 focus:bg-slate-900'
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => verifyCode()}
                  disabled={loading || otp.join('').length !== 6}
                  className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:via-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{loading ? 'Authenticating...' : 'Verify & Enter Command Portal'}</span>
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                  <button
                    type="button"
                    onClick={() => setStage(1)}
                    className="hover:text-white transition-colors"
                  >
                    ← Back to Login
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 font-bold transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Security Note */}
        <p className="text-[11px] text-center text-slate-500">
          All access attempts are logged with SHA-256 telemetry &amp; IP verification.
        </p>

      </div>
    </div>
  );
};

export default NimdaStaffLoginPage;
