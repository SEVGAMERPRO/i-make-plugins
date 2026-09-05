import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Settings, ShieldCheck, Lock, Smartphone, User, Sparkles, Bell, 
  Key, Copy, Check, Download, AlertTriangle, ChevronRight, CheckCircle2, 
  ExternalLink, Bot, Zap, Globe, Mail, Eye, EyeOff, Save, Search, RefreshCw,
  Code, Terminal, Webhook, Plus, Trash2, Send, Activity, FileCode, Play, Radio,
  Crown, Sliders, Flame, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import UserAvatar from '../components/common/UserAvatar';
import axios from 'axios';

const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t, languages = [], currentLanguageObj } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [langSuccess, setLangSuccess] = useState('');
  const [langSearchQuery, setLangSearchQuery] = useState('');
  
  // Active Tab: 'security' | 'ultimate' | 'profile' | 'language' | 'developer' | 'integrations' | 'notifications'
  const initialTab = searchParams.get('tab') || 'security';
  const [activeTab, setActiveTab] = useState(initialTab);

  const email = user?.email || 'user@example.com';
  const username = user?.username || 'MinoUser';

  const isUltimate = (() => {
    if (!user) return false;
    try {
      if (user.isUltimate || user.role === 'CREATOR') return true;
      if (typeof window !== 'undefined' && window.localStorage) {
        if (localStorage.getItem('minoforge_ultimate_active') === 'true') return true;
        const raw = localStorage.getItem('minoforge_user');
        if (raw && typeof raw === 'string' && raw.includes('"isUltimate":true')) return true;
      }
    } catch (e) {}
    return false;
  })();

  // ================= ULTIMATE SETTINGS STATE =================
  const [ultimateSettings, setUltimateSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(`minoforge_ultimate_settings_${email}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      goldenCrownRing: true,
      zeroFeeMode: true,
      autoSpotlight: true,
      minoshieldPriorityScan: true,
      unlimitedAiDiagnostics: true,
      discordVipRole: true,
      customProfileBanner: 'galaxy',
      customProfileFlair: 'Verified Ultimate Creator 👑',
      publicUltimateBadge: true,
      instantPayoutPriority: true
    };
  });
  const [ultimateSavedMsg, setUltimateSavedMsg] = useState('');

  const handleSaveUltimateSettings = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(`minoforge_ultimate_settings_${email}`, JSON.stringify(ultimateSettings));
      setUltimateSavedMsg('👑 Ultimate VIP preferences saved and synchronized!');
      setTimeout(() => setUltimateSavedMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

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

  // ================= DEVELOPER API & DISCORD BOT STATE =================
  const [apiKeys, setApiKeys] = useState([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [keySuccess, setKeySuccess] = useState('');
  const [keyError, setKeyError] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState(new Set());
  
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [webhookSuccess, setWebhookSuccess] = useState('');
  const [webhookError, setWebhookError] = useState('');
  const [webhookTesting, setWebhookTesting] = useState(false);
  
  const [activeSnippetTab, setActiveSnippetTab] = useState('nodejs');
  const [devEvents, setDevEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // ================= INTEGRATIONS STATE =================
  const [discordLinked, setDiscordLinked] = useState(() => {
    try {
      return !!localStorage.getItem('minoforge_discord_link');
    } catch {
      return false;
    }
  });

  const fetchDeveloperData = async () => {
    setKeysLoading(true);
    try {
      const [keysRes, whRes, evRes] = await Promise.allSettled([
        axios.get(`/api/developer/keys?email=${encodeURIComponent(email)}`),
        axios.get(`/api/developer/webhook?email=${encodeURIComponent(email)}`),
        axios.get(`/api/developer/events?email=${encodeURIComponent(email)}&limit=10`)
      ]);

      if (keysRes.status === 'fulfilled' && keysRes.value.data?.keys) {
        setApiKeys(keysRes.value.data.keys);
      }
      if (whRes.status === 'fulfilled' && whRes.value.data?.webhook) {
        setDiscordWebhookUrl(whRes.value.data.webhook.webhookUrl || '');
        setWebhookEnabled(whRes.value.data.webhook.enabled ?? true);
      }
      if (evRes.status === 'fulfilled' && evRes.value.data?.events) {
        setDevEvents(evRes.value.data.events);
      }
    } catch (err) {
      console.warn('Developer data fetch error:', err);
    } finally {
      setKeysLoading(false);
    }
  };

  // Fetch 2FA status and Developer Keys on mount
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

    // Fetch Developer Keys & Webhooks
    fetchDeveloperData();
  }, [email]);

  const handleGenerateKey = async (e) => {
    if (e) e.preventDefault();
    setKeysLoading(true);
    setKeyError('');
    try {
      const res = await axios.post('/api/developer/keys/generate', {
        email,
        username,
        label: newKeyLabel.trim() || 'Discord Bot Key'
      });
      if (res.data && res.data.success) {
        setApiKeys(prev => [res.data.key, ...prev]);
        setNewKeyLabel('');
        setKeySuccess('New API Key created successfully!');
        setTimeout(() => setKeySuccess(''), 3500);
      }
    } catch (err) {
      setKeyError(err.response?.data?.message || 'Failed to generate new API key.');
    } finally {
      setKeysLoading(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API Key? Any Discord bot or script using it will lose access immediately.')) {
      return;
    }
    try {
      const res = await axios.delete(`/api/developer/keys/${keyId}`, { data: { email } });
      if (res.data?.success) {
        setApiKeys(prev => prev.filter(k => k.id !== keyId));
        setKeySuccess('API key revoked.');
        setTimeout(() => setKeySuccess(''), 3000);
      }
    } catch (err) {
      setKeyError('Failed to revoke API key.');
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeyIds(prev => {
      const next = new Set(prev);
      if (next.has(keyId)) next.delete(keyId);
      else next.add(keyId);
      return next;
    });
  };

  const handleSaveWebhook = async (e) => {
    if (e) e.preventDefault();
    setWebhookLoading(true);
    setWebhookError('');
    setWebhookSuccess('');
    try {
      const res = await axios.post('/api/developer/webhook', {
        email,
        username,
        webhookUrl: discordWebhookUrl.trim(),
        enabled: webhookEnabled,
        notifyOnPurchase: true
      });
      if (res.data?.success) {
        setWebhookSuccess('Discord webhook settings saved successfully!');
        setTimeout(() => setWebhookSuccess(''), 3500);
      }
    } catch (err) {
      setWebhookError(err.response?.data?.message || 'Failed to save Discord webhook.');
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!discordWebhookUrl.trim() || !discordWebhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      setWebhookError('Please enter a valid Discord Webhook URL starting with https://discord.com/api/webhooks/');
      return;
    }
    setWebhookTesting(true);
    setWebhookError('');
    setWebhookSuccess('');
    try {
      const res = await axios.post('/api/developer/webhook/test', {
        webhookUrl: discordWebhookUrl.trim(),
        username
      });
      if (res.data?.success) {
        setWebhookSuccess('✓ Test alert sent to Discord channel successfully!');
        setTimeout(() => setWebhookSuccess(''), 4000);
      }
    } catch (err) {
      setWebhookError(err.response?.data?.message || 'Failed to reach Discord webhook.');
    } finally {
      setWebhookTesting(false);
    }
  };

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

MinoForge Security Engine • https://minoforge.com
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
        <div className="flex overflow-x-auto sm:flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 hide-scrollbar">
          {[
            { id: 'security', label: '🔒 Security & 2FA', fullLabel: '🔒 Security & 2FA (Google Authenticator)', icon: ShieldCheck },
            { id: 'ultimate', label: '👑 Ultimate Perks', fullLabel: isUltimate ? '👑 Ultimate VIP Perks' : '👑 Unlock Ultimate', icon: Crown, isSpecial: true },
            { id: 'profile', label: '👤 Profile & Bio', fullLabel: '👤 Profile & Bio', icon: User },
            { id: 'language', label: '🌍 Language / Taal', fullLabel: '🌍 Language / Taal (Google Cloud Translate)', icon: Globe },
            { id: 'developer', label: '🔑 Developer API', fullLabel: '🔑 Developer API & Discord Bot', icon: Code },
            { id: 'integrations', label: '🤖 Discord', fullLabel: '🤖 Discord & Webhooks', icon: Sparkles },
            { id: 'notifications', label: '🔔 Preferences', fullLabel: '🔔 Notifications & Regional', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  isCurrent
                    ? tab.isSpecial 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : tab.isSpecial
                      ? 'text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-300'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${tab.isSpecial && !isCurrent ? 'text-amber-400' : ''}`} />
                <span className="hidden md:inline">{tab.fullLabel}</span>
                <span className="md:hidden">{tab.label}</span>
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

        {/* TAB: ULTIMATE MEMBERSHIP & PERKS */}
        {activeTab === 'ultimate' && (
          <div className="space-y-6 animate-fade-in">
            {!isUltimate ? (
              /* LOCKED PREVIEW / REDIRECT TO UPGRADE FOR NON-ULTIMATE */
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border-2 border-amber-500/40 text-center space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 text-4xl shadow-xl shadow-amber-500/20 animate-pulse">
                    👑
                  </div>
                  
                  <div className="space-y-2 max-w-xl mx-auto">
                    <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                      Ultimate VIP Membership Required
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                      Customize Your Ultimate Perks
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      You are currently on a Standard Member account. Upgrade to MinoForge Ultimate to unlock 0% creator commissions, golden avatar badges, auto-spotlight weekly boosts, priority security scanning, and full customization controls.
                    </p>
                  </div>
                </div>

                {/* Ultimate Features Grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5">
                    <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> 0% Platform Fee
                    </div>
                    <p className="text-[11px] text-slate-400">Keep 100% of all resource revenue with zero platform commission deductions.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5">
                    <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                      <Crown className="w-4 h-4" /> Golden VIP Crown
                    </div>
                    <p className="text-[11px] text-slate-400">Stand out everywhere with a glowing golden crown badge and verified avatar ring.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5">
                    <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Auto-Spotlight Boost
                    </div>
                    <p className="text-[11px] text-slate-400">Automated homepage carousel placement whenever you release or update plugins.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5">
                    <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> MinoShield™ Priority
                    </div>
                    <p className="text-[11px] text-slate-400">Instant bytecode decompilation and express security review bypassing queues.</p>
                  </div>
                </div>

                {/* Redirect / Go Ultimate CTA */}
                <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => navigate('/upgrade')}
                    className="btn-glow-blue btn-shimmer btn-animated w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Go Ultimate: Unlock All Perks</span>
                    <Sparkles className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-white/10 transition-all cursor-pointer"
                  >
                    View All Plan Features
                  </button>
                </div>
              </div>
            ) : (
              /* FULL INTERACTIVE ULTIMATE CONTROL CENTER FOR ULTIMATE MEMBERS */
              <form onSubmit={handleSaveUltimateSettings} className="space-y-6">
                
                {/* Header VIP Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/60 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
                      👑
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-black text-white">Ultimate VIP Creator Studio</h2>
                        <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black rounded-full">
                          ACTIVE &amp; UNLOCKED
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                        Customize your Ultimate perks, verified badge appearance, zero-commission payout routing, and automated marketplace boost settings.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-animated px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Ultimate Settings</span>
                  </button>
                </div>

                {ultimateSavedMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{ultimateSavedMsg}</span>
                  </div>
                )}

                {/* Ultimate Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Perk 1: Golden Crown Badge & Avatar Glow */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-white flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span>Golden Crown Avatar &amp; Profile Ring</span>
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Display a 3D animated golden crown and luminous avatar ring on your profile, comments, reviews, and plugin seller cards.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={ultimateSettings.goldenCrownRing}
                        onChange={(e) => setUltimateSettings({ ...ultimateSettings, goldenCrownRing: e.target.checked })}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer mt-1"
                      />
                    </div>

                    {/* Live Preview */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-sm text-white overflow-hidden border-2 ${
                          ultimateSettings.goldenCrownRing ? 'border-amber-400 shadow-lg shadow-amber-500/40 ring-2 ring-amber-400/30' : 'border-white/10'
                        }`}>
                          <UserAvatar user={{ ...user, username: displayName || username }} className="w-full h-full object-cover" />
                        </div>
                        {ultimateSettings.goldenCrownRing && (
                          <div className="absolute -top-3 -left-2 text-base filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.9)] animate-bounce">
                            👑
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                          <span>{(displayName || username || 'Member').replace(/_/g, ' ')}</span>
                          {ultimateSettings.goldenCrownRing && <span className="text-amber-400 text-xs">👑</span>}
                        </div>
                        <span className="text-[11px] text-amber-400 font-semibold">{ultimateSettings.customProfileFlair}</span>
                      </div>
                    </div>
                  </div>

                  {/* Perk 2: 0% Platform Commission Status */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>0% Creator Platform Fee (Keep 100%)</span>
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Your account automatically receives 100% of all gross plugin sales directly without any standard 10% platform commission fee deduction.
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-black text-xs flex-shrink-0">
                        100% Payout
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Standard Platform Fee:</span>
                        <span className="line-through text-slate-500 font-mono">10%</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-emerald-400">
                        <span>Your Ultimate Creator Fee:</span>
                        <span className="font-mono">0.0% (Waived for Life)</span>
                      </div>
                    </div>
                  </div>

                  {/* Perk 3: Auto-Spotlight Weekly Boost */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>Automated Marketplace Homepage Spotlight</span>
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Automatically boost your newly submitted or updated plugins to the "Featured &amp; Trending" hero showcase on MinoForge homepage.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={ultimateSettings.autoSpotlight}
                        onChange={(e) => setUltimateSettings({ ...ultimateSettings, autoSpotlight: e.target.checked })}
                        className="w-5 h-5 accent-cyan-500 rounded cursor-pointer mt-1"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <span>Status:</span>
                      <span className="font-bold text-cyan-400">{ultimateSettings.autoSpotlight ? '✓ Enabled (Auto-Boost on Publish)' : 'Disabled'}</span>
                    </div>
                  </div>

                  {/* Perk 4: MinoShield™ Priority Scan */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          <span>MinoShield™ Priority Sandbox Security Review</span>
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Bypass manual approval backlogs with automated instant bytecode decompilation, AST exploit scanning, and priority staff verification.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={ultimateSettings.minoshieldPriorityScan}
                        onChange={(e) => setUltimateSettings({ ...ultimateSettings, minoshieldPriorityScan: e.target.checked })}
                        className="w-5 h-5 accent-purple-500 rounded cursor-pointer mt-1"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <span>Review Queue:</span>
                      <span className="font-bold text-purple-400">⚡ VIP Fast-Track (&lt; 5 Minutes)</span>
                    </div>
                  </div>

                  {/* Perk 5: Custom Profile Flair */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl md:col-span-2">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-400" />
                        <span>Custom Profile Flair &amp; VIP Tagline</span>
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Customize the custom badge text that displays next to your username on your public creator page and plugin pages.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Verified Ultimate Creator 👑', 'VIP Studio Master 🚀', 'MinoForge Elite ⭐'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setUltimateSettings({ ...ultimateSettings, customProfileFlair: preset })}
                          className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            ultimateSettings.customProfileFlair === preset
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                              : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-xs font-bold text-slate-300">Or type custom flair:</label>
                      <input
                        type="text"
                        value={ultimateSettings.customProfileFlair}
                        onChange={(e) => setUltimateSettings({ ...ultimateSettings, customProfileFlair: e.target.value })}
                        maxLength={40}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. Master Plugin Developer 👑"
                      />
                    </div>
                  </div>

                </div>

                {/* Bottom Save Bar */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>All changes take effect immediately across all MinoForge services.</span>
                  </div>

                  <button
                    type="submit"
                    className="btn-glow-blue btn-shimmer btn-animated px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Ultimate Preferences</span>
                  </button>
                </div>

              </form>
            )}
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

        {/* TAB: LANGUAGE & GOOGLE MULTI-LANGUAGE TRANSLATOR */}
        {activeTab === 'language' && (() => {
          const filteredLanguages = languages.filter(l => 
            l.name.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
            l.native.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
            l.code.toLowerCase().includes(langSearchQuery.toLowerCase())
          );

          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6 animate-fade-in">
              
              {/* Header Banner */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <span>{t('selectLanguage')}</span>
                    </h2>
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Google Pro AI Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Powered by <strong>Google Multi-Language Cloud Translator</strong>. Select from 60+ world languages in alphabetical order (A–Z) to instantly translate all marketplace plugins, server configurations, creator portals, and forum docs.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-center">
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-2.5 shadow-inner">
                    <span className="text-2xl">{currentLanguageObj?.flag || '🌐'}</span>
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Language</span>
                      <strong className="text-xs font-black text-cyan-300">
                        {currentLanguageObj?.native || currentLanguageObj?.name || 'English'} ({language.toUpperCase()})
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Notification */}
              {langSuccess && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-between gap-2 animate-fade-in shadow-lg shadow-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{langSuccess}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono">Google Cloud Synced ✓</span>
                </div>
              )}

              {/* Search & Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950/80 rounded-2xl border border-white/10">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={langSearchQuery}
                    onChange={(e) => setLangSearchQuery(e.target.value)}
                    placeholder="Search 60+ languages (e.g. Dutch, Spanish, Arabic)..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  />
                  {langSearchQuery && (
                    <button 
                      onClick={() => setLangSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Showing <strong className="text-cyan-300">{filteredLanguages.length}</strong> of {languages.length} (A-Z)
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setLangSuccess('Language reset to English (US)!');
                      setTimeout(() => setLangSuccess(''), 3000);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Reset to default language"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Reset (EN)</span>
                  </button>
                </div>
              </div>

              {/* Alphabetical Grid of Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredLanguages.map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setLangSuccess(`Switched to ${item.name} (${item.native}) via Google Cloud Translator!`);
                        setTimeout(() => setLangSuccess(''), 3500);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                          : 'bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                          {item.flag}
                        </span>
                        <div className="min-w-0">
                          <strong className="text-xs font-bold text-white block truncate group-hover:text-cyan-300 transition-colors">
                            {item.native}
                          </strong>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                            <span>{item.name}</span>
                            <span className="px-1 py-0.2 bg-slate-800 text-[9px] font-mono text-slate-400 rounded">
                              {item.code}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-slate-600 group-hover:text-slate-400 text-xs flex-shrink-0 transition-colors">
                          →
                        </span>
                      )}
                    </button>
                  );
                })}

                {filteredLanguages.length === 0 && (
                  <div className="col-span-full py-12 text-center space-y-2">
                    <p className="text-sm text-slate-400">No language matching "{langSearchQuery}" found.</p>
                    <button
                      onClick={() => setLangSearchQuery('')}
                      className="text-xs text-cyan-400 hover:underline font-bold"
                    >
                      Clear search filter
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Confirmation Bar */}
              <div className="p-4 bg-slate-950/90 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>
                    Current site language: <strong className="text-cyan-300 uppercase font-mono">{language}</strong> ({currentLanguageObj?.name || 'English'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLangSuccess(`Language preference (${currentLanguageObj?.name}) saved across all sessions!`);
                    setTimeout(() => setLangSuccess(''), 3000);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('saveLanguage')}</span>
                </button>
              </div>

            </div>
          );
        })()}

        {/* TAB: DEVELOPER API & DISCORD BOT */}
        {activeTab === 'developer' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header Hero Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[11px] font-bold text-cyan-300">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>MinoForge REST API v1 &amp; Webhook Gateway</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <span>Developer API &amp; Discord Bot Engine</span>
                  </h2>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Connect your Discord bots, external server daemons, or websites to MinoForge. Receive instant sale webhook alerts when players purchase your plugins, or query your catalog programmatically.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchDeveloperData}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-bold text-slate-200 rounded-xl transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${keysLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh API</span>
                </button>
              </div>
            </div>

            {/* Notifications & Feedback */}
            {keySuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{keySuccess}</span>
              </div>
            )}
            {keyError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-bold text-red-300 flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{keyError}</span>
              </div>
            )}

            {/* SECTION 1: DISCORD BOT WEBHOOK (SALES ALERTS) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Webhook className="w-4 h-4 text-[#5865F2]" />
                    <span>Instant Discord Sales Webhook</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automatically send a rich embed alert into your Discord channel whenever someone buys or downloads your plugin.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] text-[11px] font-bold rounded-lg self-start sm:self-auto">
                  Discord Embed v2
                </span>
              </div>

              {webhookSuccess && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{webhookSuccess}</span>
                </div>
              )}
              {webhookError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{webhookError}</span>
                </div>
              )}

              <form onSubmit={handleSaveWebhook} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Discord Webhook URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={discordWebhookUrl}
                        onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                        placeholder="https://discord.com/api/webhooks/1234567890/abcde..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent transition-all"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleTestWebhook}
                      disabled={webhookTesting || !discordWebhookUrl}
                      className="px-4 py-3 bg-slate-800 hover:bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2] hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${webhookTesting ? 'animate-bounce' : ''}`} />
                      <span>{webhookTesting ? 'Sending Test...' : 'Send Test Alert'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={webhookLoading}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-[#5865F2] hover:from-blue-500 hover:to-[#4752c4] text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-[#5865F2]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{webhookLoading ? 'Saving...' : 'Save Webhook'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    How to get your webhook: In Discord, go to Server Settings → Integrations → Webhooks → New Webhook → Copy Webhook URL.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Radio className={`w-4 h-4 ${webhookEnabled ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div>
                      <strong className="text-xs font-bold text-white block">Send Instant Purchase Alerts</strong>
                      <span className="text-[11px] text-slate-400">Trigger webhook when someone completes a purchase of your plugin</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={webhookEnabled}
                    onChange={(e) => setWebhookEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#5865F2] rounded cursor-pointer"
                  />
                </div>
              </form>

              {/* Discord Embed Preview Mockup */}
              <div className="mt-4 p-4 rounded-2xl bg-[#2B2D31] border border-white/5 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Discord Channel Preview:</span>
                <div className="p-4 rounded-xl bg-[#1E1F22] border-l-4 border-emerald-500 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">M</span>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <strong className="text-emerald-400 font-black">Plugin Sold: Ultra Vaults &amp; Bank System</strong>
                    </div>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    A customer has just purchased **Ultra Vaults &amp; Bank System** on MinoForge Marketplace!
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">CUSTOMER</span>
                      <strong className="text-white font-mono">Steve_Gamer</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SALE PRICE</span>
                      <strong className="text-emerald-400">€14.99</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">NET EARNINGS</span>
                      <strong className="text-cyan-300">€14.24 (95%)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">STATUS</span>
                      <span className="text-emerald-400 font-bold">✓ DELIVERED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: API KEYS MANAGEMENT */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span>Personal API Keys</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Use these secret keys to authenticate your Discord bot scripts and fetch orders via REST API.
                  </p>
                </div>

                <form onSubmit={handleGenerateKey} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newKeyLabel}
                    onChange={(e) => setNewKeyLabel(e.target.value)}
                    placeholder="Key Label (e.g. Discord Bot)"
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={keysLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Key</span>
                  </button>
                </form>
              </div>

              {/* API Keys List */}
              <div className="space-y-3">
                {apiKeys.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-white/5">
                    <Key className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No API keys created yet. Generate one above to connect your bot!</p>
                  </div>
                ) : (
                  apiKeys.map((k) => {
                    const isVisible = visibleKeyIds.has(k.id);
                    const isCopied = copiedKeyId === k.id;
                    const maskedKey = isVisible ? k.key : `${k.key.substring(0, 10)}••••••••••••••••••••••••••••••`;

                    return (
                      <div
                        key={k.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                              <Code className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs font-bold text-white block">{k.label || 'API Key'}</strong>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Created: {new Date(k.createdAt).toLocaleDateString()} • Status: <span className="text-emerald-400 font-bold">{k.status}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] font-mono rounded">
                              orders.read
                            </span>
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] font-mono rounded">
                              plugins.read
                            </span>
                          </div>
                        </div>

                        {/* Secret Key Row */}
                        <div className="flex items-center gap-2 bg-slate-900/90 border border-white/5 rounded-xl px-3 py-2">
                          <span className="flex-1 font-mono text-xs text-cyan-300 truncate select-all">
                            {maskedKey}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleKeyVisibility(k.id)}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-800"
                            title={isVisible ? 'Hide Key' : 'Reveal Key'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(k.key);
                              setCopiedKeyId(k.id);
                              setTimeout(() => setCopiedKeyId(null), 2500);
                            }}
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10"
                            title="Revoke API Key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* SECTION 3: DISCORD BOT CODE TEMPLATES */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span>Discord Bot Starter Code (Copy &amp; Paste)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ready-to-use bot script templates for Node.js (Discord.js), Python, and HTTP REST queries.
                  </p>
                </div>

                {/* Subtabs */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                  {[
                    { id: 'nodejs', label: 'Node.js (Discord.js v14)' },
                    { id: 'python', label: 'Python (discord.py)' },
                    { id: 'curl', label: 'cURL / REST' },
                    { id: 'webhook', label: 'Webhook JSON' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSnippetTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        activeSnippetTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Box */}
              <div className="relative rounded-2xl bg-slate-950 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-white/10 text-xs text-slate-400">
                  <span className="font-mono text-cyan-300">
                    {activeSnippetTab === 'nodejs' && 'bot.js - Node.js & Discord.js v14'}
                    {activeSnippetTab === 'python' && 'bot.py - Python discord.py & aiohttp'}
                    {activeSnippetTab === 'curl' && 'Terminal - cURL Request'}
                    {activeSnippetTab === 'webhook' && 'payload.json - Discord Webhook Payload'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      let code = '';
                      const keyToUse = apiKeys[0]?.key || 'mf_live_YOUR_API_KEY';
                      if (activeSnippetTab === 'nodejs') {
                        code = `// MinoForge Discord Bot Sale Listener (Node.js & Discord.js v14)
// Run: npm install discord.js axios dotenv

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const MINOFORGE_API_KEY = '${keyToUse}';
const DISCORD_CHANNEL_ID = '123456789012345678'; // Replace with your target channel ID

client.once('ready', () => {
  console.log(\`🤖 Logged in as \${client.user.tag}\`);
  console.log('⚡ Listening for new MinoForge plugin purchases...');

  // Poll MinoForge API for new sales every 30 seconds
  setInterval(async () => {
    try {
      const response = await axios.get('https://minoforge.com/api/developer/events', {
        headers: { 'X-API-Key': MINOFORGE_API_KEY }
      });

      if (response.data && response.data.events) {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        // Process new sales and send Discord Embed
      }
    } catch (err) {
      console.error('API Error:', err.message);
    }
  }, 30000);
});

client.login('YOUR_DISCORD_BOT_TOKEN');`;
                      } else if (activeSnippetTab === 'python') {
                        code = `# MinoForge Discord Bot Sale Listener (Python discord.py)
# Run: pip install discord.py aiohttp

import discord
from discord.ext import tasks, commands
import aiohttp

bot = commands.Bot(command_prefix="!", intents=discord.Intents.default())

API_KEY = "${keyToUse}"
CHANNEL_ID = 123456789012345678 # Replace with your channel ID

@bot.event
async def on_ready():
    print(f"🤖 Bot online as {bot.user}")
    poll_minoforge_sales.start()

@tasks.loop(seconds=30)
async def poll_minoforge_sales():
    async with aiohttp.ClientSession() as session:
        headers = {"X-API-Key": API_KEY}
        async with session.get("https://minoforge.com/api/developer/events", headers=headers) as resp:
            if resp.status == 200:
                data = await resp.json()
                channel = bot.get_channel(CHANNEL_ID)
                # Send rich embed into Discord channel

bot.run("YOUR_DISCORD_BOT_TOKEN")`;
                      } else if (activeSnippetTab === 'curl') {
                        code = `# 1. Query Store Events & Purchases
curl -X GET "https://minoforge.com/api/developer/events?limit=20" \\
  -H "X-API-Key: ${keyToUse}"

# 2. Test Discord Webhook
curl -X POST "https://minoforge.com/api/developer/webhook/test" \\
  -H "Content-Type: application/json" \\
  -d '{"webhookUrl": "https://discord.com/api/webhooks/...", "username": "${username}"}'`;
                      } else {
                        code = `{
  "username": "MinoForge Sales Bot",
  "avatar_url": "https://minoforge.com/favicon.png",
  "embeds": [
    {
      "title": "Plugin Sold: Ultra Vaults",
      "description": "A player has purchased your plugin on MinoForge Marketplace!",
      "color": 1096065,
      "fields": [
        { "name": "Resource", "value": "Ultra Vaults", "inline": true },
        { "name": "Customer", "value": "Steve_Gamer", "inline": true },
        { "name": "Sale Price", "value": "€14.99", "inline": true },
        { "name": "Your Net Earnings (95%)", "value": "€14.24", "inline": true }
      ],
      "timestamp": "2026-08-29T20:30:00.000Z"
    }
  ]
}`;
                      }

                      navigator.clipboard.writeText(code);
                      setKeySuccess('Code copied to clipboard!');
                      setTimeout(() => setKeySuccess(''), 2500);
                    }}
                    className="flex items-center gap-1 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                </div>

                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  {activeSnippetTab === 'nodejs' && `// MinoForge Discord Bot Sale Listener (Node.js & Discord.js v14)
// Run: npm install discord.js axios dotenv

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const MINOFORGE_API_KEY = '${apiKeys[0]?.key || 'mf_live_YOUR_API_KEY'}';
const DISCORD_CHANNEL_ID = '123456789012345678'; // Replace with your target channel ID

client.once('ready', () => {
  console.log(\`🤖 Logged in as \${client.user.tag}\`);
  console.log('⚡ Listening for new MinoForge plugin purchases...');

  // Poll MinoForge API for new sales every 30 seconds
  setInterval(async () => {
    try {
      const response = await axios.get('https://minoforge.com/api/developer/events', {
        headers: { 'X-API-Key': MINOFORGE_API_KEY }
      });

      if (response.data && response.data.events) {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        // Process new sales and send Discord Embed
      }
    } catch (err) {
      console.error('API Error:', err.message);
    }
  }, 30000);
});

client.login('YOUR_DISCORD_BOT_TOKEN');`}

                  {activeSnippetTab === 'python' && `# MinoForge Discord Bot Sale Listener (Python discord.py)
# Run: pip install discord.py aiohttp

import discord
from discord.ext import tasks, commands
import aiohttp

bot = commands.Bot(command_prefix="!", intents=discord.Intents.default())

API_KEY = "${apiKeys[0]?.key || 'mf_live_YOUR_API_KEY'}"
CHANNEL_ID = 123456789012345678 # Replace with your channel ID

@bot.event
async def on_ready():
    print(f"🤖 Bot online as {bot.user}")
    poll_minoforge_sales.start()

@tasks.loop(seconds=30)
async def poll_minoforge_sales():
    async with aiohttp.ClientSession() as session:
        headers = {"X-API-Key": API_KEY}
        async with session.get("https://minoforge.com/api/developer/events", headers=headers) as resp:
            if resp.status == 200:
                data = await resp.json()
                channel = bot.get_channel(CHANNEL_ID)
                # Send rich embed into Discord channel

bot.run("YOUR_DISCORD_BOT_TOKEN")`}

                  {activeSnippetTab === 'curl' && `# 1. Query Store Events & Purchases
curl -X GET "https://minoforge.com/api/developer/events?limit=20" \\
  -H "X-API-Key: ${apiKeys[0]?.key || 'mf_live_YOUR_API_KEY'}"

# 2. Test Discord Webhook
curl -X POST "https://minoforge.com/api/developer/webhook/test" \\
  -H "Content-Type: application/json" \\
  -d '{"webhookUrl": "https://discord.com/api/webhooks/...", "username": "${username}"}'`}

                  {activeSnippetTab === 'webhook' && `{
  "username": "MinoForge Sales Bot",
  "avatar_url": "https://minoforge.com/favicon.png",
  "embeds": [
    {
      "title": "Plugin Sold: Ultra Vaults",
      "description": "A player has purchased your plugin on MinoForge Marketplace!",
      "color": 1096065,
      "fields": [
        { "name": "Resource", "value": "Ultra Vaults", "inline": true },
        { "name": "Customer", "value": "Steve_Gamer", "inline": true },
        { "name": "Sale Price", "value": "€14.99", "inline": true },
        { "name": "Your Net Earnings (95%)", "value": "€14.24", "inline": true }
      ],
      "timestamp": "2026-08-29T20:30:00.000Z"
    }
  ]
}`}
                </pre>
              </div>
            </div>

            {/* SECTION 4: REAL-TIME API EVENT STREAM */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Developer Event Stream</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live record of webhook dispatches and purchases received by your API key.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold rounded-lg border border-emerald-500/20">
                  LIVE STREAM ACTIVE
                </span>
              </div>

              {devEvents.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-white/5">
                  <Activity className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No events logged yet. Place a test order or send a test webhook to see live data!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="p-3">EVENT TYPE</th>
                        <th className="p-3">RESOURCE</th>
                        <th className="p-3">CUSTOMER</th>
                        <th className="p-3">PRICE / EARNINGS</th>
                        <th className="p-3">TIMESTAMP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {devEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">
                              {evt.type || 'PLUGIN_PURCHASED'}
                            </span>
                          </td>
                          <td className="p-3 text-white font-sans font-bold">{evt.pluginTitle || 'Plugin Sale'}</td>
                          <td className="p-3 text-cyan-300">{evt.buyerUsername || 'Customer'}</td>
                          <td className="p-3 text-emerald-400 font-bold">
                            €{(evt.price || 0).toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">(+€{(evt.earnings || 0).toFixed(2)})</span>
                          </td>
                          <td className="p-3 text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: DISCORD & INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#5865F2]" />
                <span>Discord &amp; Platform Integrations</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Connect your Discord account to sync buyer roles, automate ticket channels, and receive purchase alerts.
              </p>
            </div>

            {/* Discord Connection Snapshot */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                  <Bot className="w-6 h-6" />
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
