import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, KeyRound, QrCode, Copy, Check, Lock, Smartphone, Download, RefreshCw, AlertTriangle, ChevronRight, Sparkles, CheckCircle2, Bot, ExternalLink, Zap, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Security2FAPage = () => {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [enabledAt, setEnabledAt] = useState(null);
  const [remainingBackupCodes, setRemainingBackupCodes] = useState(0);

  // Setup Wizard State
  const [setupStep, setSetupStep] = useState(0); // 0 = Closed, 1 = Scan QR, 2 = Verify Code, 3 = Backup Codes
  const [setupData, setSetupData] = useState(null);
  const [verifyToken, setVerifyToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  const email = user?.email || 'user@example.com';
  const username = user?.username || 'MinoUser';

  useEffect(() => {
    // Check 2FA Status from server
    axios.get(`/api/auth/2fa/status/${encodeURIComponent(email)}`)
      .then(res => {
        if (res.data) {
          setTwoFactorEnabled(res.data.enabled);
          setEnabledAt(res.data.enabledAt);
          setRemainingBackupCodes(res.data.remainingBackupCodes);
        }
      })
      .catch(() => {
        // Local fallback
        const saved = localStorage.getItem(`minoforge_2fa_${email}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setTwoFactorEnabled(parsed.enabled);
          setEnabledAt(parsed.enabledAt);
        }
      });
  }, [email]);

  const handleStartSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/2fa/setup', {
        email,
        username
      });

      if (res.data && res.data.success) {
        setSetupData(res.data);
        setSetupStep(1);
      } else {
        throw new Error(res.data?.message || 'Failed to start 2FA setup.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating 2FA credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndActivate = async (e) => {
    e.preventDefault();
    if (!verifyToken.trim() || verifyToken.replace(/\s+/g, '').length !== 6) {
      setError('Please enter the full 6-digit code from Google Authenticator.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/2fa/verify-and-activate', {
        email,
        secret: setupData.secret,
        token: verifyToken.trim(),
        backupCodes: setupData.backupCodes
      });

      if (res.data && res.data.success) {
        setTwoFactorEnabled(true);
        setEnabledAt(new Date().toISOString());
        setRemainingBackupCodes(setupData.backupCodes.length);
        setSetupStep(3); // Show backup codes
        localStorage.setItem(`minoforge_2fa_${email}`, JSON.stringify({
          enabled: true,
          enabledAt: new Date().toISOString(),
          secret: setupData.secret
        }));
      } else {
        throw new Error(res.data?.message || 'Invalid code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 6-digit code. Check your phone clock and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.')) {
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/2fa/disable', { email });
      setTwoFactorEnabled(false);
      setEnabledAt(null);
      localStorage.removeItem(`minoforge_2fa_${email}`);
      setSuccessMsg('Two-Factor Authentication has been disabled.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Failed to disable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    const content = `MINOFORGE TWO-FACTOR AUTHENTICATION BACKUP CODES
Account: ${username} (${email})
Generated: ${new Date().toLocaleString()}

Keep these emergency recovery codes in a safe place. Each code can be used ONCE to access your account if you lose your Google Authenticator device.

${setupData.backupCodes.map((code, idx) => `[${idx + 1}] ${code}`).join('\n')}

MinoForge Security Engine • https://colasmp.net
`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `minoforge-2fa-backup-codes-${username}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">Account Security &amp; Google Perks</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Security &amp; Google Pro Suite</h1>
                <p className="text-xs text-slate-400">Two-Factor Authentication (2FA) with Google Authenticator &amp; Gemini Pro tools.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            {twoFactorEnabled ? (
              <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-xl flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>2FA ACTIVE (PROTECTED)</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black rounded-xl flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>2FA DISABLED</span>
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-bold text-red-300 flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Google Authenticator 2FA Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span>Google Authenticator (TOTP 2FA)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Protect your MinoForge account from unauthorized access by requiring a dynamic 6-digit security code generated by the Google Authenticator app on your phone whenever you sign in.
              </p>
            </div>

            {twoFactorEnabled ? (
              <button
                onClick={handleDisable2FA}
                disabled={loading}
                className="px-5 py-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                onClick={handleStartSetup}
                disabled={loading}
                className="btn-glow-blue px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0"
              >
                <Lock className="w-4 h-4" />
                <span>Enable Google Authenticator</span>
              </button>
            )}
          </div>

          {twoFactorEnabled && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Two-Factor Authentication is actively safeguarding your account</span>
              </div>
              <p className="text-xs text-slate-400">
                Activated on <strong className="text-slate-300">{new Date(enabledAt || Date.now()).toLocaleDateString()}</strong>. Every sign-in requires your 6-digit Google Authenticator code or a backup recovery code.
              </p>
            </div>
          )}

          {/* 2FA Setup Flow Wizard */}
          {setupStep > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-blue-500/40 space-y-6 animate-fade-in">
              
              {/* Step Navigation Indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs flex items-center justify-center">
                    {setupStep}
                  </span>
                  <span className="text-sm font-black text-white">
                    {setupStep === 1 && 'Step 1: Scan QR Code with Google Authenticator'}
                    {setupStep === 2 && 'Step 2: Enter 6-Digit Verification Code'}
                    {setupStep === 3 && 'Step 3: Save Your Emergency Recovery Codes'}
                  </span>
                </div>
                {setupStep < 3 && (
                  <button
                    onClick={() => setSetupStep(0)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel Setup
                  </button>
                )}
              </div>

              {/* Step 1: Scan QR Code */}
              {setupStep === 1 && setupData && (
                <div className="space-y-6">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Open the <strong>Google Authenticator</strong> app on your iPhone or Android phone.<br />
                    2. Tap the <strong>"+"</strong> button and select <strong>"Scan a QR code"</strong>.<br />
                    3. Point your camera at the QR code below:
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900/90 rounded-2xl border border-white/10">
                    <div className="p-3 bg-white rounded-2xl shadow-xl flex-shrink-0">
                      <img src={setupData.qrCode} alt="Google Authenticator QR" className="w-44 h-44 rounded-lg" />
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-400 block">Can't scan the QR code? Enter this secret manually:</span>
                      <div className="p-3 bg-slate-950 border border-white/10 rounded-xl flex items-center justify-between gap-3">
                        <code className="font-mono text-xs text-cyan-300 font-bold tracking-wider select-all">
                          {setupData.formattedSecret || setupData.secret}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(setupData.secret);
                            setCopiedSecret(true);
                            setTimeout(() => setCopiedSecret(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1 cursor-pointer flex-shrink-0"
                        >
                          {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-400 block">Account: <strong>MinoForge ({email})</strong> • Time-based (TOTP)</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSetupStep(2)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Next: Verify Code</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Verify Code */}
              {setupStep === 2 && setupData && (
                <form onSubmit={handleVerifyAndActivate} className="space-y-6">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enter the <strong>6-digit security code</strong> currently showing on your Google Authenticator app for <strong>MinoForge</strong> to verify the setup:
                  </p>

                  <div className="max-w-xs space-y-2">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="000000"
                      value={verifyToken}
                      onChange={(e) => setVerifyToken(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full text-center tracking-[0.5em] font-mono text-2xl font-black p-4 bg-slate-900 border border-blue-500/40 rounded-2xl text-cyan-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
                    />
                    <span className="text-[11px] text-slate-400 block text-center">Codes refresh every 30 seconds</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSetupStep(1)}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{loading ? 'Verifying...' : 'Activate 2FA'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Backup Codes */}
              {setupStep === 3 && setupData && (
                <div className="space-y-6">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>IMPORTANT: Save Your Emergency Backup Codes!</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      If you ever lose or break your phone, you can use these <strong>8 single-use recovery codes</strong> to sign in to your account. Store them in a password manager or print them out.
                    </p>
                  </div>

                  {/* 8 Codes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-900 rounded-2xl border border-white/10">
                    {setupData.backupCodes.map((code, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 border border-white/10 rounded-xl text-center font-mono font-bold text-xs text-cyan-300 select-all">
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={downloadBackupCodes}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-cyan-400" />
                        <span>Download Codes (.txt)</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
                          setCopiedBackup(true);
                          setTimeout(() => setCopiedBackup(false), 2000);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-white/10 flex items-center gap-2 cursor-pointer"
                      >
                        {copiedBackup ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedBackup ? 'Copied to Clipboard' : 'Copy All'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSetupStep(0)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Done (Finish)
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Section 2: Google Workspace & Cloud Infrastructure Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Platform Cloud Infrastructure &amp; Security</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              MinoForge runs on high-performance cloud infrastructure with DKIM verified emails and edge CDN downloads.
            </p>
          </div>

          {/* Google Workspace & Cloud Infrastructure Setup Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Google Workspace SMTP */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <Bot className="w-4 h-4 text-blue-400" />
                <span>Google Workspace Custom Email</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect <code className="bg-slate-900 px-1 rounded text-cyan-300">support@minoforge.com</code> or <code className="bg-slate-900 px-1 rounded text-cyan-300">contact@colasmp.net</code> through Google Workspace with DKIM &amp; SPF to guarantee 100% inbox delivery for 2FA security codes.
              </p>
            </div>

            {/* Google Cloud Storage Edge CDN */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Google Cloud Global Edge CDN</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Host plugin <code className="bg-slate-900 px-1 rounded text-cyan-300">.zip</code> archives on Google Cloud Storage buckets for lightning-fast 100MB/s global downloads with signed temporary URLs.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Security2FAPage;
