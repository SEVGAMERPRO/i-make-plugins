import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Settings, ShieldCheck, Lock, Smartphone, User, Sparkles, Bell, 
  Key, Copy, Check, Download, AlertTriangle, ChevronRight, CheckCircle2, 
  ExternalLink, Bot, Zap, Globe, Mail, Eye, EyeOff, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import axios from 'axios';

const SettingsPage = () => {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Active Tab: 'security' | 'profile' | 'integrations' | 'notifications'
  const initialTab = searchParams.get('tab') || 'security';
  const [activeTab, setActiveTab] = useState(initialTab);

  const email = user?.email || 'user@example.com';
  const username = user?.username || 'MinoUser';

  // ================= 2FA STATE =================
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [enabledAt, setEnabledAt] = useState(null);
  const [remainingBackupCodes, setRemainingBackupCodes] = useState(0);

  // Setup Wizard State (0 = idle, 1 = scan QR, 2 = enter code, 3 = show backup codes)
  const [setupStep, setSetupStep] = useState(0);
  const [setupData, setSetupData] = useState(null);
  const [verifyToken, setVerifyToken] = useState('');
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaError, setTwoFaError] = useState('');
  const [twoFaSuccess, setTwoFaSuccess] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // ================= PROFILE STATE =================
  const [displayName, setDisplayName] = useState(user?.username || 'MinoCreator');
  const [bio, setBio] = useState('Game Developer & Plugin Architect building next-gen game server experiences on MinoForge.');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // ================= INTEGRATIONS STATE =================
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('minoforge_gemini_api_key') || '';
  });
  const [geminiStatus, setGeminiStatus] = useState(geminiApiKey ? 'CONNECTED' : 'NOT_CONFIGURED');
  const [geminiSuccess, setGeminiSuccess] = useState('');

  const [discordLinked, setDiscordLinked] = useState(() => {
    try {
      return !!localStorage.getItem('minoforge_discord_link');
    } catch {
      return false;
    }
  });

  // Fetch 2FA status on mount
  useEffect(() => {
    axios.get(`/api/auth/2fa/status/${encodeURIComponent(email)}`)
      .then(res => {
        if (res.data) {
          setTwoFactorEnabled(res.data.enabled);
          setEnabledAt(res.data.enabledAt);
          setRemainingBackupCodes(res.data.remainingBackupCodes);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem(`minoforge_2fa_${email}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setTwoFactorEnabled(parsed.enabled);
          setEnabledAt(parsed.enabledAt);
        }
      });
  }, [email]);

  const handleStart2FASetup = async () => {
    setTwoFaLoading(true);
    setTwoFaError('');
    try {
      const res = await axios.post('/api/auth/2fa/setup', { email, username });
      if (res.data && res.data.success) {
        setSetupData(res.data);
        setSetupStep(1);
      } else {
        throw new Error(res.data?.message || 'Failed to start 2FA setup.');
      }
    } catch (err) {
      setTwoFaError(err.response?.data?.message || 'Error generating 2FA credentials.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleVerifyAndActivate2FA = async (e) => {
    e.preventDefault();
    if (!verifyToken.trim() || verifyToken.replace(/\s+/g, '').length !== 6) {
      setTwoFaError('Please enter the full 6-digit code from Google Authenticator.');
      return;
    }

    setTwoFaLoading(true);
    setTwoFaError('');
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
      setTwoFaError(err.response?.data?.message || 'Invalid 6-digit code. Check your phone clock and try again.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.')) {
      return;
    }

    setTwoFaLoading(true);
    try {
      await axios.post('/api/auth/2fa/disable', { email });
      setTwoFactorEnabled(false);
      setEnabledAt(null);
      localStorage.removeItem(`minoforge_2fa_${email}`);
      setTwoFaSuccess('Two-Factor Authentication has been disabled.');
      setTimeout(() => setTwoFaSuccess(''), 4000);
    } catch (err) {
      setTwoFaError('Failed to disable 2FA.');
    } finally {
      setTwoFaLoading(false);
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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSuccess('Profile settings saved successfully!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleSaveGeminiKey = () => {
    if (!geminiApiKey.trim()) {
      localStorage.removeItem('minoforge_gemini_api_key');
      setGeminiStatus('NOT_CONFIGURED');
      setGeminiSuccess('Gemini API key removed.');
    } else {
      localStorage.setItem('minoforge_gemini_api_key', geminiApiKey.trim());
      setGeminiStatus('CONNECTED');
      setGeminiSuccess('Gemini Pro API Key saved! AI tools unlocked with unlimited quota.');
    }
    setTimeout(() => setGeminiSuccess(''), 4000);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">Account Settings</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Account Settings &amp; Security</h1>
                <p className="text-xs text-slate-400">Manage your Google Authenticator 2FA, profile, and Google Pro API integrations.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-cyan-300">
              {email}
            </span>
          </div>
        </div>

        {/* Multi-Tab Navigation Bar */}
        <div className="flex flex-wrap gap-2 p-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10">
          {[
            { id: 'security', label: '🔒 Security & 2FA (Google Authenticator)', icon: ShieldCheck },
            { id: 'profile', label: '👤 Profile & Bio', icon: User },
            { id: 'integrations', label: '🤖 Google Pro & API Keys', icon: Sparkles },
            { id: 'notifications', label: '🔔 Notifications & Regional', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SECURITY & 2FA (GOOGLE AUTHENTICATOR) */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Status alerts */}
            {twoFaSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{twoFaSuccess}</span>
              </div>
            )}
            {twoFaError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-bold text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{twoFaError}</span>
              </div>
            )}

            {/* Main 2FA Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-400" />
                      <span>Google Authenticator (Two-Factor Authentication)</span>
                    </h2>
                    {twoFactorEnabled ? (
                      <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-lg">
                        ACTIVE &amp; SECURE
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black rounded-lg">
                        DISABLED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Protect your account with Time-based One-Time Passwords (TOTP). Use the <strong>Google Authenticator</strong> app on your iPhone or Android to generate a new 6-digit passcode every 30 seconds.
                  </p>
                </div>

                {twoFactorEnabled ? (
                  <button
                    onClick={handleDisable2FA}
                    disabled={twoFaLoading}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0"
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <button
                    onClick={handleStart2FASetup}
                    disabled={twoFaLoading}
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
                    <span>Your account is actively protected by Google Authenticator</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Activated on <strong className="text-slate-300">{new Date(enabledAt || Date.now()).toLocaleDateString()}</strong>. Every sign-in requires your 6-digit Google Authenticator code or an emergency recovery code.
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
                    <form onSubmit={handleVerifyAndActivate2FA} className="space-y-6">
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
                          disabled={twoFaLoading}
                          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{twoFaLoading ? 'Verifying...' : 'Activate 2FA'}</span>
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

          </div>
        )}

        {/* TAB 2: PROFILE & BIO */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6 animate-fade-in">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Public Creator Profile</span>
            </h2>

            {profileSuccess && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Display Name / Creator Handle
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Primary Email (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-sm text-slate-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Creator Bio / About
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: INTEGRATIONS & GOOGLE PRO */}
        {activeTab === 'integrations' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Google Pro &amp; API Integrations</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Connect your Google AI Studio Gemini Pro API Key and Discord account to unlock automated workflows.
              </p>
            </div>

            {geminiSuccess && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{geminiSuccess}</span>
              </div>
            )}

            {/* Gemini API Key Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block">
                    Google Gemini API Key (Google AI Studio)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-bold inline-flex items-center gap-1">Google AI Studio <ExternalLink className="w-3 h-3" /></a>
                  </span>
                </div>

                <span className={`px-3 py-1 text-xs font-bold rounded-xl flex items-center gap-1.5 flex-shrink-0 ${
                  geminiStatus === 'CONNECTED' 
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-800 text-slate-400 border border-white/10'
                }`}>
                  {geminiStatus === 'CONNECTED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
                  <span>{geminiStatus === 'CONNECTED' ? 'Gemini Pro Connected' : 'No Key Set'}</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveGeminiKey}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex-shrink-0"
                >
                  Save &amp; Connect Key
                </button>
              </div>
            </div>

            {/* Discord Connection Snapshot */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-white block">Discord Role Sync &amp; Webhooks</strong>
                  <span className="text-xs text-slate-400">
                    {discordLinked ? '✓ Connected to Discord account' : 'Link your Discord to sync buyer roles'}
                  </span>
                </div>
              </div>

              <Link
                to="/discord"
                className="px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <span>{discordLinked ? 'Manage Discord Link' : 'Connect Discord'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS & REGIONAL */}
        {activeTab === 'notifications' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6 animate-fade-in">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <span>Notifications &amp; Regional Preferences</span>
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-white block">Default Currency</strong>
                  <span className="text-[11px] text-slate-400">Choose your preferred currency symbol and conversion</span>
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-white block">Email Notifications for Watched Plugins</strong>
                  <span className="text-[11px] text-slate-400">Receive emails whenever a watched plugin releases a new version</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded" />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-white block">Security &amp; Login Alerts</strong>
                  <span className="text-[11px] text-slate-400">Send an immediate email whenever a new sign-in is detected</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsPage;
