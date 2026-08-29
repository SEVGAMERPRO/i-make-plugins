import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import GoogleRecaptcha from '../components/common/GoogleRecaptcha';
import { Sparkles, ArrowRight, Lock, Mail, KeyRound, Copy, Check, RefreshCw, AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('CREDENTIALS'); // 'CREDENTIALS' | 'VERIFY_CODE'
  const [verificationCode, setVerificationCode] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);

  const { login, loginWithGoogle, verifyLoginCode, complete2FALogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Format 9-digit code as XXX-XXX-XXX as user types
  const handleCodeChange = (e) => {
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 9);
    let formatted = raw;
    if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6, 9)}`;
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}`;
    }
    setVerificationCode(formatted);
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const raw = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 9);
      if (raw.length > 0) {
        let formatted = raw;
        if (raw.length > 6) {
          formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6, 9)}`;
        } else if (raw.length > 3) {
          formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}`;
        }
        setVerificationCode(formatted);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  // Step 1: Send verification code to email
  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!recaptchaToken) {
      setError('Please verify that you are not a robot using the reCAPTCHA box.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/send-verification-code', {
        email: email.trim(),
        recaptchaToken: recaptchaToken || 'BYPASS_LOCAL'
      });

      if (res.data && res.data.success) {
        setStep('VERIFY_CODE');
        setResendCooldown(30);
        setSuccessMsg(`A 9-digit code has been sent to ${email}.`);
      } else {
        throw new Error(res.data?.message || 'Failed to send code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 9-digit code and check for 2FA
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const cleanCode = verificationCode.replace(/-/g, '').trim();

    if (cleanCode.length !== 9) {
      setError('Please enter the full 9-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await verifyLoginCode(email.trim(), cleanCode);
      if (res && res.requires2FA) {
        setStep('2FA_CHALLENGE');
        setSuccessMsg('Two-Factor Authentication required. Enter your 6-digit Authenticator code.');
        return;
      }
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify 2FA TOTP or Backup code
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    const clean = twoFactorCode.replace(/[\s-]/g, '').trim();
    if (!clean) {
      setError('Please enter your 6-digit Google Authenticator code or emergency backup code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await complete2FALogin(email.trim(), clean);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 2FA code. Please check your Authenticator app and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await loginWithGoogle(credentialResponse);
      if (res && res.requires2FA) {
        setEmail(res.email || '');
        setStep('2FA_CHALLENGE');
        setSuccessMsg('Two-Factor Authentication required. Enter your 6-digit Authenticator code.');
        return;
      }
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was canceled or failed.');
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#0b0f19] py-16 px-4 sm:px-6 lg:px-8 text-white relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10">
        
        {/* Header with MinoForge Myna Bird Mascot */}
        <div className="text-center">
          <Link to="/" className="inline-block group mb-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-950/90 border border-cyan-400/40 p-1 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:scale-105 group-hover:border-cyan-400 transition-all overflow-hidden">
              <img src="/favicon.png" alt="MinoForge Myna Bird" className="w-full h-full object-cover rounded-xl" />
            </div>
          </Link>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {step === 'CREDENTIALS' && 'Sign In to MinoForge'}
            {step === 'VERIFY_CODE' && 'Email Verification'}
            {step === '2FA_CHALLENGE' && 'Two-Factor Authentication'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {step === 'CREDENTIALS' && 'Access your plugins, purchases, and creator hub'}
            {step === 'VERIFY_CODE' && 'Enter the 9-digit security code sent to your email'}
            {step === '2FA_CHALLENGE' && 'Enter the code from Google Authenticator to confirm your identity'}
          </p>
        </div>
        
        {/* Notification alerts */}
        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-sm text-center animate-fade-in">
            {error}
          </div>
        )}

        {successMsg && step === 'VERIFY_CODE' && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs text-center animate-fade-in flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: INITIAL LOGIN (Email / Google) */}
        {step === 'CREDENTIALS' && (
          <div className="space-y-6">
            
            {/* Email Code Request Form */}
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Email Address
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
                    className="block w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Google reCAPTCHA v2 Checkbox */}
              <GoogleRecaptcha onVerify={(token) => { setRecaptchaToken(token); setError(''); }} onExpired={() => setRecaptchaToken('')} />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span>{loading ? 'Sending 9-Digit Code...' : 'Send 9-Digit Security Code'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-slate-900 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 absolute">
                or continue with
              </span>
            </div>

            {/* Google Sign-In Placed Underneath (Matches Image 2 Exactly with English Text) */}
            <div className="space-y-4">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="Continue with Google"
              />
            </div>

            <div className="text-center text-xs text-slate-400 pt-2">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                Create free account
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: 9-DIGIT CODE VERIFICATION */}
        {step === 'VERIFY_CODE' && (
          <form onSubmit={handleVerifySubmit} className="space-y-6 animate-fade-in">
            
            {/* Email Badge */}
            <div className="p-3 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 truncate">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('CREDENTIALS');
                  setError('');
                }}
                className="text-blue-400 hover:text-blue-300 font-bold ml-2 flex-shrink-0"
              >
                Change
              </button>
            </div>

            {/* 9-Digit Input Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  9-Digit Security Code
                </label>
                <button
                  type="button"
                  onClick={handlePasteCode}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Pasted!' : 'Paste from clipboard'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="XXX-XXX-XXX"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  maxLength={11}
                  className="w-full bg-slate-950/80 border-2 border-blue-500/40 focus:border-blue-400 rounded-2xl py-4 px-4 text-center text-2xl font-mono font-black tracking-widest text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all select-all uppercase"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block text-center">Format: 9 alphanumeric letters & numbers (e.g. 9K2-X7W-4BP)</span>
            </div>

            {/* CRITICAL: Check Spam Folder Notice */}
            <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-2 text-slate-200 shadow-lg shadow-amber-500/5">
              <div className="flex items-center gap-2 font-extrabold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Don't see the email? Check your SPAM folder!</span>
              </div>
              <p className="leading-relaxed text-slate-300 text-[11px]">
                The verification email is sent from <strong className="text-white">MinoForge</strong>. If it is not in your primary inbox, please check your <strong className="text-amber-200">Spam or Junk folder</strong> and click <strong className="text-emerald-400">"Report Not Spam"</strong>.
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || verificationCode.replace(/-/g, '').length !== 9}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying Code...' : 'Verify & Sign In'}</span>
            </button>

            {/* Resend Code Section */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Didn't receive the code?{' '}
                {resendCooldown > 0 ? (
                  <span className="text-slate-500 font-semibold font-mono">
                    Send again in ({resendCooldown}s)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestCode(null)}
                    disabled={loading}
                    className="font-bold text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Send again</span>
                  </button>
                )}
              </p>
            </div>

            {/* Back Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setStep('CREDENTIALS')}
                className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: TWO-FACTOR AUTHENTICATION (2FA) CHALLENGE */}
        {step === '2FA_CHALLENGE' && (
          <form onSubmit={handle2FASubmit} className="space-y-6 animate-fade-in">
            {/* Account Info Pill */}
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-200 font-semibold truncate">{email}</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full">
                2FA Active
              </span>
            </div>

            {/* 2FA Input Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  {useBackupCode ? 'Emergency Backup Recovery Code' : 'Google Authenticator 6-Digit Code'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode);
                    setTwoFactorCode('');
                    setError('');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                >
                  {useBackupCode ? 'Use 6-digit code' : 'Use backup code'}
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder={useBackupCode ? 'XXXX-XXXX' : '000000'}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.toUpperCase())}
                  maxLength={useBackupCode ? 12 : 8}
                  className="w-full bg-slate-950/90 border-2 border-amber-500/40 focus:border-amber-400 rounded-2xl py-4 px-4 text-center text-2xl font-mono font-black tracking-widest text-amber-300 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all uppercase select-all"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block text-center">
                {useBackupCode
                  ? 'Enter one of your 8-digit emergency backup recovery codes.'
                  : 'Open your Authenticator app (Google Authenticator, Authy, etc.) and enter the current code.'}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !twoFactorCode.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying 2FA Code...' : 'Verify & Complete Sign In'}</span>
            </button>

            {/* Back Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('CREDENTIALS');
                  setError('');
                }}
                className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
