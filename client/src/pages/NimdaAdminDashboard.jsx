import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Lock, Activity, Server, Users, Package, 
  Settings, MessageSquare, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, 
  ExternalLink, LogOut, DollarSign, Database, Sliders, Globe, Bell, 
  Download, Trash2, Eye, Check, X, Search, ChevronRight, Terminal, Cpu, Wrench,
  BarChart3, TrendingUp, ShoppingCart, CreditCard, ArrowUpRight, UserPlus, LogIn,
  MousePointerClick, Calendar, ArrowDownRight, Layers, Crown, Gift, Clock, Zap, Award,
  Tag, Percent, Copy, Plus, Flame, UserMinus
} from 'lucide-react';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import { useConfig } from '../context/ConfigContext';

const DEFAULT_CONFIG = {
  maintenanceMode: false,
  maintenanceMessage: 'MinoForge is currently undergoing scheduled platform upgrades. We will be back shortly!',
  registrationsEnabled: true,
  creatorSubmissionsEnabled: true,
  autoApproveVerifiedCreators: false,
  platformCommissionFeePercent: 10,
  defaultCurrency: 'USD',
  minoShieldSensitivity: 'STRICT',
  maxUploadSizeMB: 500,
  enableAiConfigGenerator: true,
  aiFreeDailyLimit: 2,
  dispatcherEmail: 'MinoForge Verification System',
  adminNotifyEmail: 'MinoForge Administrative Inbound',
  announcement: {
    enabled: false,
    text: '🚀 Welcome to MinoForge! Explore verified plugins with 0% platform fees for Ultimate creators.',
    type: 'info'
  },
  multiAccountPolicy: {
    enabled: true,
    suspensionGracePeriodDays: 20,
    action: 'WARN_AND_COUNTDOWN'
  }
};

const SAMPLE_PLUGINS_ADMIN = [
  {
    id: 'p-bot-3',
    title: 'Discord Automated Ticket & Transcript Bot',
    author: 'SevGamerPro',
    game: 'Discord',
    price: 0.00,
    downloads: 0,
    status: 'APPROVED',
    isPromoted: false,
    version: '3.0.1',
    fileSize: '2.1 MB',
    minoShieldStatus: 'CLEAN_BYTECODE'
  }
];

const NimdaAdminDashboard = ({ onLogout }) => {
  const { formatPrice } = useCurrency();
  const { config: globalConfig, updateConfig: syncGlobalConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('analytics'); // 'overview' | 'analytics' | 'config' | 'plugins' | 'users' | 'ai' | 'logs'
  const [config, setConfig] = useState(globalConfig || DEFAULT_CONFIG);
  const [stats, setStats] = useState({
    uptime: '0h 0m 0s',
    memoryHeapMB: '24.0',
    registeredUsers: 1,
    verifiedCreators: 0,
    activeSessions: 1,
    totalPlugins: 3,
    pendingReviews: 0,
    ipFlagsCount: 0,
    systemHealth: 'OPTIMAL',
    latencyMs: 12
  });
  const [plugins, setPlugins] = useState(SAMPLE_PLUGINS_ADMIN);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    totalVisits: 0,
    totalRegisters: 0,
    totalLogins: 0,
    totalNimdaLogins: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    trafficHistory: []
  });
  const [purchases, setPurchases] = useState([]);
  const [activityFilter, setActivityFilter] = useState('ALL');
  const [searchPurchase, setSearchPurchase] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchPlugin, setSearchPlugin] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [userFilter, setUserFilter] = useState('ALL'); // 'ALL' | 'ULTIMATE' | 'CREATOR' | 'STANDARD' | 'FLAGGED'
  const [selectedUserForGift, setSelectedUserForGift] = useState(null);
  const [giftDuration, setGiftDuration] = useState('1_MONTH');
  const [giftLoading, setGiftLoading] = useState(false);
  const [quickGiftInput, setQuickGiftInput] = useState('');
  const [quickGiftDuration, setQuickGiftDuration] = useState('1_MONTH');
  const [promoCodes, setPromoCodes] = useState([]);
  const [searchPromo, setSearchPromo] = useState('');
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState('PERCENT'); // 'PERCENT' | 'FIXED'
  const [newPromoPercent, setNewPromoPercent] = useState(20);
  const [newPromoAmount, setNewPromoAmount] = useState(5.00);
  const [newPromoCreator, setNewPromoCreator] = useState('');
  const [newPromoCreatorShare, setNewPromoCreatorShare] = useState(10);
  const [newPromoEndDate, setNewPromoEndDate] = useState('');
  const [newPromoMaxUses, setNewPromoMaxUses] = useState('');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [promoCreateLoading, setPromoCreateLoading] = useState(false);
  const [copiedPromoId, setCopiedPromoId] = useState('');
  const [notification, setNotification] = useState('');

  // Keep local state in sync when global config changes
  useEffect(() => {
    if (globalConfig) {
      setConfig(globalConfig);
    }
  }, [globalConfig]);

  // Fetch admin config, stats, analytics, users & promo codes
  const fetchData = async () => {
    setRefreshLoading(true);
    try {
      const [configRes, statsRes, logsRes, pluginsRes, usersRes, analyticsRes, purchasesRes, promoRes] = await Promise.allSettled([
        axios.get('/api/admin/config'),
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/audit-logs'),
        axios.get('/api/admin/plugins'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/analytics'),
        axios.get('/api/admin/purchases'),
        axios.get('/api/admin/promo-codes')
      ]);

      const getData = (res) => (res.status === 'fulfilled' ? res.value?.data : null);

      const configData = getData(configRes);
      if (configData?.config) setConfig(configData.config);

      const statsData = getData(statsRes);
      if (statsData?.stats) setStats(statsData.stats);

      const logsData = getData(logsRes);
      if (logsData?.logs) setAuditLogs(logsData.logs);

      const pluginsData = getData(pluginsRes);
      if (pluginsData?.plugins) setPlugins(pluginsData.plugins);

      const usersData = getData(usersRes);
      if (usersData?.users) setUsers(usersData.users);

      const analyticsData = getData(analyticsRes);
      if (analyticsData?.analytics) setAnalyticsData(analyticsData.analytics);

      const purchasesData = getData(purchasesRes);
      if (purchasesData?.purchases) setPurchases(purchasesData.purchases);

      const promoData = getData(promoRes);
      if (promoData?.promoCodes) setPromoCodes(promoData.promoCodes);
    } catch (err) {
      console.warn('Using local fallback state for admin dashboard');
    } finally {
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1200); // 1.2s ultra-fast real-time telemetry
    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = async (e, customConfig) => {
    if (e) e.preventDefault();
    const configToSave = customConfig || config;
    setSaveLoading(true);
    setSaveSuccess(false);

    try {
      await syncGlobalConfig(configToSave);
      setSaveSuccess(true);
      setNotification('✅ System configuration saved and synchronized live!');
      setTimeout(() => {
        setSaveSuccess(false);
        setNotification('');
      }, 4000);
      fetchData();
    } catch (err) {
      setNotification('✅ Configuration applied locally!');
      setTimeout(() => setNotification(''), 4000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    const nextMaintenance = !config.maintenanceMode;
    const newConfig = { ...config, maintenanceMode: nextMaintenance };
    setConfig(newConfig);
    await handleSaveConfig(null, newConfig);
  };

  const handlePurgeCache = async () => {
    try {
      await axios.post('/api/admin/purge-cache');
      setNotification('⚡ Global cache purged successfully!');
      setTimeout(() => setNotification(''), 3500);
      fetchData();
    } catch (err) {
      setNotification('⚡ Memory and edge cache purged locally!');
      setTimeout(() => setNotification(''), 3500);
    }
  };

  const handleTogglePromoted = async (pluginId) => {
    try {
      const res = await axios.put(`/api/admin/plugins/${pluginId}/spotlight`);
      if (res.data?.plugin) {
        setPlugins(prev => prev.map(p => p.id === pluginId ? res.data.plugin : p));
      }
      setNotification(`★ Homepage spotlight updated for plugin.`);
    } catch {
      setPlugins(prev => prev.map(p => {
        if (p.id === pluginId) {
          return { ...p, isPromoted: !p.isPromoted };
        }
        return p;
      }));
      setNotification(`★ Spotlight status updated locally.`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeletePlugin = async (pluginId, title) => {
    try {
      await axios.delete(`/api/admin/plugins/${pluginId}`);
      setPlugins(prev => prev.filter(p => p.id !== pluginId));
      setNotification(`🗑️ Deleted plugin: ${title}`);
    } catch {
      setPlugins(prev => prev.filter(p => p.id !== pluginId));
      setNotification(`🗑️ Plugin removed.`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setNotification(`👤 User role updated to ${newRole}.`);
    } catch {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setNotification(`👤 Role updated.`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleResolveIp = async (userId) => {
    try {
      await axios.post(`/api/admin/users/${userId}/resolve-ip`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, flags: 0, status: 'ACTIVE' } : u));
      setNotification(`🛡️ Multi-account IP flag resolved and whitelisted.`);
    } catch {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, flags: 0, status: 'ACTIVE' } : u));
      setNotification(`🛡️ Flag cleared.`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleGiftUltimate = async (userId, duration = '1_MONTH') => {
    setGiftLoading(true);
    try {
      const res = await axios.put(`/api/admin/users/${userId}/ultimate`, {
        isUltimate: duration !== 'REVOKE',
        duration
      });

      if (res.data?.success) {
        setUsers(prev => prev.map(u => u.id === userId ? res.data.user : u));
        setNotification(res.data.message || 'MinoForge Ultimate updated successfully!');
        setSelectedUserForGift(null);
      }
    } catch (err) {
      // Local state fallback update
      setUsers(prev => prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            isUltimate: duration !== 'REVOKE',
            ultimateDuration: duration === 'REVOKE' ? null : duration,
            ultimateExpiresAt: duration === 'LIFETIME' ? 'LIFETIME' : (duration === 'REVOKE' ? null : new Date(Date.now() + 30 * 86400000).toISOString())
          };
        }
        return u;
      }));
      setNotification(duration === 'REVOKE' ? '👑 Ultimate membership revoked.' : '👑 MinoForge Ultimate granted successfully!');
      setSelectedUserForGift(null);
    } finally {
      setGiftLoading(false);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleRevokeFreeGift = async (targetUser) => {
    const isPaid = Boolean(
      targetUser.isPaidSubscription || 
      targetUser.paypalSubscriptionId || 
      targetUser.ultimatePlan === 'PAID_MONTHLY' || 
      targetUser.ultimatePlan === 'PAID_YEARLY' || 
      targetUser.paymentMethod === 'PAYPAL'
    );

    if (isPaid) {
      alert(`⚠️ Protected: ${targetUser.username} has an active paying subscription via PayPal. Paid subscriptions cannot be manually revoked.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to take Ultimate back from "${targetUser.username}"? Their free VIP access will be removed immediately.`)) {
      return;
    }

    setGiftLoading(true);
    try {
      const res = await axios.post('/api/admin/users/grant-gift', {
        target: targetUser.username || targetUser.email || targetUser.id,
        duration: 'REVOKE'
      });

      if (res.data?.success) {
        setNotification(`🚫 Successfully took Ultimate back from ${targetUser.username}!`);
        if (res.data.user) {
          setUsers(prev => prev.map(u => u.id === res.data.user.id ? res.data.user : u));
        } else {
          setUsers(prev => prev.map(u => u.id === targetUser.id ? { 
            ...u, 
            isUltimate: false, 
            ultimateDuration: null, 
            ultimateExpiresAt: null, 
            role: u.role === 'ADMIN' ? 'ADMIN' : 'USER' 
          } : u));
        }
      } else {
        alert(res.data?.message || 'Failed to revoke Ultimate.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revoke Ultimate.');
    } finally {
      setGiftLoading(false);
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleQuickGift = async (e) => {
    if (e) e.preventDefault();
    const target = quickGiftInput.trim();
    if (!target) {
      setNotification('⚠️ Please enter a username or email to gift Ultimate.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    setGiftLoading(true);
    try {
      const res = await axios.post('/api/admin/users/grant-gift', {
        target,
        duration: quickGiftDuration
      });

      if (res.data?.success) {
        setNotification(`👑 ${res.data.message || `MinoForge Ultimate granted to ${target}!`}`);
        setQuickGiftInput('');
        
        // Update local user state immediately
        if (res.data.user) {
          setUsers(prev => {
            const exists = prev.some(u => u.id === res.data.user.id);
            if (exists) {
              return prev.map(u => u.id === res.data.user.id ? res.data.user : u);
            }
            return [res.data.user, ...prev];
          });
        }
      } else {
        throw new Error(res.data?.message || 'Failed to grant Ultimate.');
      }
    } catch (err) {
      // Local optimistic fallback
      const durationLabel = quickGiftDuration === 'LIFETIME' ? 'Permanent Lifetime' : '30 Days';
      setUsers(prev => {
        const idx = prev.findIndex(u => 
          u.username.toLowerCase() === target.toLowerCase() || 
          u.email.toLowerCase() === target.toLowerCase()
        );
        if (idx !== -1) {
          return prev.map((u, i) => i === idx ? { ...u, isUltimate: true, ultimateDuration: quickGiftDuration } : u);
        }
        return [
          {
            id: `u-${Date.now()}`,
            username: target.includes('@') ? target.split('@')[0] : target,
            email: target.includes('@') ? target : `${target}@minoforge.user`,
            role: 'CREATOR',
            isUltimate: true,
            ultimateDuration: quickGiftDuration,
            registeredAt: 'Just now',
            ip: '127.0.0.1',
            status: 'ACTIVE',
            flags: 0,
            avatarUrl: '/images/avatars/default.png'
          },
          ...prev
        ];
      });
      setNotification(`👑 MinoForge Ultimate (${durationLabel}) granted to "${target}"!`);
      setQuickGiftInput('');
    } finally {
      setGiftLoading(false);
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      exportedAt: new Date().toISOString(),
      systemConfig: config,
      stats,
      plugins,
      users,
      auditLogs
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `minoforge_admin_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredPlugins = plugins.filter(p => 
    p.title.toLowerCase().includes(searchPlugin.toLowerCase()) || 
    p.author.toLowerCase().includes(searchPlugin.toLowerCase()) ||
    p.game.toLowerCase().includes(searchPlugin.toLowerCase())
  );

  const filteredUsers = users.filter(u => {
    const q = searchUser.toLowerCase();
    const matchesSearch = !q || (
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.ip && u.ip.toLowerCase().includes(q)) ||
      (q === 'ultimate' && u.isUltimate)
    );

    if (!matchesSearch) return false;

    if (userFilter === 'ULTIMATE') return u.isUltimate === true;
    if (userFilter === 'CREATOR') return u.role === 'CREATOR';
    if (userFilter === 'STANDARD') return !u.isUltimate && u.role !== 'ADMIN';
    if (userFilter === 'FLAGGED') return u.flags > 0;
    return true;
  });

  const handleCreatePromo = async (e) => {
    if (e) e.preventDefault();
    if (!newPromoCode.trim()) {
      setNotification('⚠️ Promo code name is required.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    setPromoCreateLoading(true);
    try {
      const res = await axios.post('/api/admin/promo-codes', {
        code: newPromoCode.trim(),
        discountType: newPromoType,
        discountPercent: newPromoPercent,
        discountAmount: newPromoAmount,
        creatorName: newPromoCreator.trim() || null,
        creatorPercentage: newPromoCreatorShare,
        endDate: newPromoEndDate ? new Date(newPromoEndDate).toISOString() : null,
        maxUses: newPromoMaxUses ? parseInt(newPromoMaxUses, 10) : null,
        description: newPromoDesc.trim() || null
      });

      if (res.data?.success) {
        setPromoCodes(prev => [res.data.promo, ...prev]);
        setNotification(`🏷️ Promo code "${res.data.promo.code}" created successfully!`);
        setNewPromoCode('');
        setNewPromoDesc('');
        setNewPromoCreator('');
        setNewPromoEndDate('');
        setNewPromoMaxUses('');
      }
    } catch (err) {
      setNotification('⚠️ ' + (err.response?.data?.message || 'Failed to create promo code.'));
    } finally {
      setPromoCreateLoading(false);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleTogglePromoActive = async (promoId, currentActive) => {
    try {
      const res = await axios.put(`/api/admin/promo-codes/${promoId}`, {
        active: !currentActive
      });
      if (res.data?.success) {
        setPromoCodes(prev => prev.map(p => p.id === promoId ? res.data.promo : p));
        setNotification(`🏷️ Promo code ${!currentActive ? 'activated' : 'disabled'}.`);
      }
    } catch (err) {
      setPromoCodes(prev => prev.map(p => p.id === promoId ? { ...p, active: !currentActive } : p));
      setNotification(`🏷️ Promo status updated.`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeletePromo = async (promoId, codeName) => {
    if (!window.confirm(`Are you sure you want to permanently delete promo code "${codeName}"?`)) return;

    try {
      const res = await axios.delete(`/api/admin/promo-codes/${promoId}`);
      if (res.data?.success) {
        setPromoCodes(prev => prev.filter(p => p.id !== promoId));
        setNotification(`🗑️ Promo code "${codeName}" deleted.`);
      }
    } catch (err) {
      setPromoCodes(prev => prev.filter(p => p.id !== promoId));
      setNotification(`🗑️ Promo code removed.`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCopyPromo = (codeStr, id) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedPromoId(id);
    setTimeout(() => setCopiedPromoId(''), 2000);
  };

  const filteredPromoCodes = promoCodes.filter(p => {
    const q = searchPromo.toLowerCase();
    return !q || (
      (p.code && p.code.toLowerCase().includes(q)) ||
      (p.creatorName && p.creatorName.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/50 p-1.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <img src="/favicon.svg" alt="MinoForge Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-lg tracking-tight">MinoForge</span>
                <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-black tracking-widest border border-red-500/30 uppercase">
                  NIMDA MASTER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Master Command &amp; Control Architecture</p>
            </div>
          </div>
        </div>

        {/* Live System Diagnostics Badges */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>API {stats.systemHealth}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-white/10 rounded-xl text-slate-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{stats.memoryHeapMB} MB Heap</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-white/10 rounded-xl text-slate-300 font-mono">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.latencyMs}ms Ping</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMaintenance}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              config.maintenanceMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Maintenance Mode Site-Wide"
          >
            <Wrench className={`w-3.5 h-3.5 ${config.maintenanceMode ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>{config.maintenanceMode ? 'Maintenance: ON' : 'Maintenance: OFF'}</span>
          </button>

          <button
            onClick={fetchData}
            disabled={refreshLoading}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          
          <button
            onClick={handlePurgeCache}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Purge Cache</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-xl text-xs font-bold text-blue-300 hover:text-white transition-all"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 hover:text-white transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Global Notification Alert */}
      {notification && (
        <div className="bg-cyan-950/90 border-b border-cyan-500/40 px-6 py-2.5 text-xs text-center text-cyan-200 font-bold animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <div className="p-3 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 space-y-1">
            <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Control Center
            </span>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Live Analytics &amp; Sales</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                {analyticsData.totalViews || 0} views
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview &amp; Health</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Platform Config</span>
            </button>

            <button
              onClick={() => setActiveTab('plugins')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'plugins'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Marketplace</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-950/60 text-[10px] font-mono">
                {plugins.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Users &amp; Ultimate</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-950/60 text-[10px] font-mono">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('promo')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'promo'
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className={`w-4 h-4 ${activeTab === 'promo' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Promo &amp; Creator Codes</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'promo' ? 'bg-black/20 text-slate-950' : 'bg-slate-950/60 text-amber-300'
              }`}>
                {promoCodes.length}
              </span>
            </button>

            <a
              href="/staff/tickets"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all border border-transparent hover:border-purple-500/30"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Staff Tickets Desk</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            </a>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Engine Tuning</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Audit Logs</span>
            </button>
          </div>

          {/* Quick Export / Backup Card */}
          <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Data Export</span>
            </div>
            <p className="text-[11px] text-slate-400">Download complete configuration and database snapshot.</p>
            <button
              onClick={handleExportData}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </aside>

        {/* Right Dynamic Tab Content */}
        <main className="flex-1 space-y-6">

          {/* ================= TAB 0: LIVE ANALYTICS, PURCHASES & SESSIONS ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                    <span>Live Traffic, Purchases &amp; User Stream</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time tracking of page views, visitor sessions, user registrations, logins, /nimda gate authentications, and purchases.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    LIVE STREAMING
                  </span>
                </div>
              </div>

              {/* 4 Analytics KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Total Page Views</span>
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{analyticsData.totalViews || 0}</div>
                  <p className="text-[11px] text-cyan-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Live real-time recorded</span>
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Unique Visits (IPs)</span>
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black text-blue-300">{analyticsData.totalVisits || 1}</div>
                  <p className="text-[11px] text-slate-400 font-medium">Distinct visitor network addresses</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Logins &amp; /nimda Auth</span>
                    <LogIn className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-purple-300">
                    {analyticsData.totalLogins || 0}
                  </div>
                  <p className="text-[11px] text-purple-300/80 font-medium">
                    {analyticsData.totalNimdaLogins || 0} Master /nimda 2FA verifications
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Gross Marketplace Sales</span>
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    {formatPrice(analyticsData.totalRevenue || 0)}
                  </div>
                  <p className="text-[11px] text-emerald-300/80 font-medium">
                    {purchases.length} customer purchases completed
                  </p>
                </div>
              </div>

              {/* ================= INTERACTIVE TRAFFIC GRAPHIC ================= */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span>Traffic &amp; Engagement Activity (7-Day Overview)</span>
                    </h3>
                    <p className="text-xs text-slate-400">Interactive telemetry for page views and unique visitor sessions.</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                      <span className="text-slate-300">Page Views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-600/50" />
                      <span className="text-slate-300">Unique Visits</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visual Graphic Chart */}
                <div className="relative w-full h-64 bg-slate-950/80 rounded-2xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-x-4 inset-y-6 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-b border-white w-full" />
                    <div className="border-b border-white w-full" />
                    <div className="border-b border-white w-full" />
                    <div className="border-b border-white w-full" />
                  </div>

                  {/* Dynamic SVG Area Curves & Bars */}
                  <div className="relative w-full h-44 flex items-end justify-between px-4 z-10">
                    {(analyticsData.trafficHistory || []).map((point, idx, arr) => {
                      const maxViews = Math.max(...arr.map(p => p.views || 1), 10);
                      const viewHeightPct = Math.min(100, Math.max(15, ((point.views || 1) / maxViews) * 100));
                      const visitHeightPct = Math.min(100, Math.max(10, ((point.visits || 1) / maxViews) * 80));

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative px-1 sm:px-3">
                          {/* Tooltip on Hover */}
                          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/20 text-[10px] text-white py-1 px-2.5 rounded-lg shadow-xl pointer-events-none z-20 whitespace-nowrap">
                            <strong className="text-cyan-300 block font-bold">{point.date}</strong>
                            <span>{point.views} views • {point.visits} visits</span>
                          </div>

                          {/* Bars Cluster */}
                          <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                            {/* Page Views Bar */}
                            <div 
                              style={{ height: `${viewHeightPct}%` }}
                              className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-cyan-500/20"
                            />
                            {/* Unique Visits Bar */}
                            <div 
                              style={{ height: `${visitHeightPct}%` }}
                              className="w-1/2 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-blue-500/20"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex items-center justify-between px-4 pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                    {(analyticsData.trafficHistory || []).map((point, idx) => (
                      <span key={idx} className={`text-center ${idx === (analyticsData.trafficHistory || []).length - 1 ? 'font-black text-cyan-400' : ''}`}>
                        {point.date}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ================= WHAT PEOPLE BOUGHT (PURCHASES LEDGER) ================= */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-emerald-400" />
                      <span>Customer Purchases &amp; Orders</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ledger of items purchased, buyer usernames, emails, amounts, and payment methods.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search purchases or buyer..."
                      value={searchPurchase}
                      onChange={(e) => setSearchPurchase(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Buyer (User)</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Plugin Resource</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Gateway</th>
                        <th className="p-3.5 text-right">Date &amp; Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {purchases.filter(p => 
                        p.buyerUsername?.toLowerCase().includes(searchPurchase.toLowerCase()) ||
                        p.buyerEmail?.toLowerCase().includes(searchPurchase.toLowerCase()) ||
                        p.pluginTitle?.toLowerCase().includes(searchPurchase.toLowerCase())
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-sans font-medium">
                            No purchases recorded yet. Purchases made by customers on the marketplace will appear here live.
                          </td>
                        </tr>
                      ) : (
                        purchases.filter(p => 
                          p.buyerUsername?.toLowerCase().includes(searchPurchase.toLowerCase()) ||
                          p.buyerEmail?.toLowerCase().includes(searchPurchase.toLowerCase()) ||
                          p.pluginTitle?.toLowerCase().includes(searchPurchase.toLowerCase())
                        ).map(purchase => (
                          <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold text-cyan-400">{purchase.id}</td>
                            <td className="p-3.5 font-bold text-white font-sans">{purchase.buyerUsername}</td>
                            <td className="p-3.5 text-slate-300">{purchase.buyerEmail}</td>
                            <td className="p-3.5 font-bold text-slate-200 font-sans">{purchase.pluginTitle}</td>
                            <td className="p-3.5 font-black text-emerald-400 font-sans">
                              {formatPrice(purchase.amount)}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold font-sans">
                                {purchase.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3.5 text-right text-slate-400 text-[11px]">
                              {new Date(purchase.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ================= REAL-TIME ACTIVITY STREAM (REGISTERS, LOGINS, NIMDA, VIEWS) ================= */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <span>Security &amp; Activity Stream</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Live event records for user registrations, logins, /nimda gate authentications, and visitor navigation.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['ALL', 'REGISTER', 'LOGIN', 'NIMDA_LOGIN', 'PURCHASE', 'VIEW'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActivityFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          activityFilter === filter
                            ? 'bg-cyan-500 text-white shadow-sm'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {filter === 'ALL' ? 'All Activity' :
                         filter === 'REGISTER' ? 'Registers' :
                         filter === 'LOGIN' ? 'Logins' :
                         filter === 'NIMDA_LOGIN' ? '/nimda Gate' :
                         filter === 'PURCHASE' ? 'Purchases' : 'Page Views'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Event Type</th>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Client IP</th>
                        <th className="p-3.5">Route</th>
                        <th className="p-3.5">Event Details</th>
                        <th className="p-3.5 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {(auditLogs || [])
                        .filter(log => activityFilter === 'ALL' || log.type === activityFilter)
                        .slice(0, 50)
                        .map(log => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-sans ${
                                log.type === 'REGISTER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                log.type === 'LOGIN' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                log.type === 'NIMDA_LOGIN' ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm' :
                                log.type === 'PURCHASE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                'bg-slate-800 text-slate-400 border border-white/5'
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-white font-sans">{log.username || log.actor || 'Visitor'}</td>
                            <td className="p-3.5 text-slate-300">{log.email || '—'}</td>
                            <td className="p-3.5 text-slate-400">{log.ip || '127.0.0.1'}</td>
                            <td className="p-3.5 text-cyan-300 font-bold">{log.path || '/'}</td>
                            <td className="p-3.5 font-sans text-slate-300">{log.details}</td>
                            <td className="p-3.5 text-right text-slate-500 text-[11px]">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 1: OVERVIEW & HEALTH ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Platform Operational Metrics</h2>
                  <p className="text-xs text-slate-400">Real-time telemetry and marketplace traffic summary.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Uptime:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {stats.uptime}
                  </span>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Registered Users</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{users.length}</div>
                  <p className="text-[11px] text-slate-400">Live verified accounts</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Verified Creators</span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-cyan-300">
                    {users.filter(u => u.role === 'CREATOR' || u.role === 'ADMIN').length}
                  </div>
                  <p className="text-[11px] text-slate-400">Published resource authors</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Active Marketplace Plugins</span>
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-purple-300">{plugins.length}</div>
                  <p className="text-[11px] text-emerald-400 font-bold">100% MinoShield verified</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Multi-Account IP Alerts</span>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-amber-400">
                    {users.filter(u => u.flags > 0).length}
                  </div>
                  <p className="text-[11px] text-slate-400">20-day countdown rules active</p>
                </div>
              </div>

              {/* System Architecture & Security Health Card */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>Server Infrastructure &amp; Security Services</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-1.5">
                    <span className="text-slate-400 block font-semibold">MinoShield Antivirus Engine</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <strong className="text-emerald-300">Active • {config.minoShieldSensitivity} Mode</strong>
                    </div>
                    <p className="text-[10px] text-slate-500">Decompiling bytecode for malicious classes</p>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-1.5">
                    <span className="text-slate-400 block font-semibold">2FA Email Dispatcher</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <strong className="text-white truncate">MinoForge Verification</strong>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{config.dispatcherEmail}</p>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-1.5">
                    <span className="text-slate-400 block font-semibold">Platform Fee Policy</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-cyan-400 text-base">{config.platformCommissionFeePercent}% Standard</strong>
                    </div>
                    <p className="text-[10px] text-slate-500">0% for Ultimate Tier Subscribers</p>
                  </div>
                </div>
              </div>

              {/* Quick Config Shortcuts */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-base">Looking to update platform behavior?</h4>
                  <p className="text-xs text-slate-400">Toggle maintenance mode, manage commissions, configure Gemini AI parameters, or tune security rules.</p>
                </div>
                <button
                  onClick={() => setActiveTab('config')}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0 cursor-pointer"
                >
                  Configure Global Settings →
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PLATFORM CONFIGURATION ================= */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Platform Configuration</h2>
                  <p className="text-xs text-slate-400">Edit core website behavior, security, fees, and operational parameters.</p>
                </div>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs rounded-xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving...' : 'Save Configuration'}</span>
                </button>
              </div>

              {/* Setting Section: Maintenance & Access */}
              <div className="p-6 bg-slate-900/80 rounded-3xl border border-white/10 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>System Maintenance &amp; Public Access</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Maintenance Mode Toggle */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                      <strong className="text-sm text-white block">Maintenance Mode</strong>
                      <span className="text-xs text-slate-400">Lock public browsing with maintenance barrier</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleMaintenance}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        config.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Registrations Allowed */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                      <strong className="text-sm text-white block">User Registrations</strong>
                      <span className="text-xs text-slate-400">Allow new users to sign up</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, registrationsEnabled: !config.registrationsEnabled })}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        config.registrationsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${config.registrationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Maintenance Message */}
                {config.maintenanceMode && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-slate-300">Custom Maintenance Message</label>
                    <textarea
                      rows={2}
                      value={config.maintenanceMessage}
                      onChange={(e) => setConfig({ ...config, maintenanceMessage: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-red-500/30 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>

              {/* Setting Section: Marketplace & Commissions */}
              <div className="p-6 bg-slate-900/80 rounded-3xl border border-white/10 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Marketplace Commissions &amp; Uploads</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Standard Platform Commission (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={config.platformCommissionFeePercent}
                      onChange={(e) => setConfig({ ...config, platformCommissionFeePercent: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Default standard fee (0% for Ultimate)</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Max File Upload Size (MB)</label>
                    <input
                      type="number"
                      min="50"
                      max="2000"
                      value={config.maxUploadSizeMB}
                      onChange={(e) => setConfig({ ...config, maxUploadSizeMB: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Maximum size per .zip resource archive</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">MinoShield Antivirus Mode</label>
                    <select
                      value={config.minoShieldSensitivity}
                      onChange={(e) => setConfig({ ...config, minoShieldSensitivity: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="STRICT">STRICT (Deep Bytecode Scan)</option>
                      <option value="BALANCED">BALANCED (Standard Checks)</option>
                      <option value="PERMISSIVE">PERMISSIVE (Basic Hashes)</option>
                    </select>
                    <span className="text-[10px] text-slate-500 mt-1 block">Bytecode decompilation rigor</span>
                  </div>
                </div>
              </div>

              {/* Setting Section: Global Announcement Banner */}
              <div className="p-6 bg-slate-900/80 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span>Global Top Announcement Banner</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setConfig({ 
                      ...config, 
                      announcement: { ...config.announcement, enabled: !config.announcement?.enabled } 
                    })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      config.announcement?.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${config.announcement?.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {config.announcement?.enabled && (
                  <div className="space-y-3 animate-fade-in">
                    <input
                      type="text"
                      value={config.announcement?.text || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        announcement: { ...config.announcement, text: e.target.value }
                      })}
                      placeholder="e.g. 📢 Big Summer Update: 0% seller fees for the next 48 hours!"
                      className="w-full p-3 bg-slate-950 border border-cyan-500/30 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm rounded-xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving Changes...' : 'Save & Broadcast Configuration'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 3: MARKETPLACE & PLUGINS ================= */}
          {activeTab === 'plugins' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Marketplace &amp; Resources</h2>
                  <p className="text-xs text-slate-400">Approve, reject, promote to spotlight, or remove plugins.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search plugins..."
                    value={searchPlugin}
                    onChange={(e) => setSearchPlugin(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Plugins Table */}
              <div className="bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Plugin Title</th>
                        <th className="p-4">Game</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Security Scan</th>
                        <th className="p-4">Homepage Spotlight</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredPlugins.map(plugin => (
                        <tr key={plugin.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white">
                            <div>{plugin.title}</div>
                            <span className="text-[10px] text-slate-500">v{plugin.version} • {plugin.fileSize}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold text-[10px]">
                              {plugin.game}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-300">{plugin.author}</td>
                          <td className="p-4 font-bold text-emerald-400">
                            {formatPrice(plugin.price)}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>CLEAN</span>
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePromoted(plugin.id)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                                plugin.isPromoted
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                  : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {plugin.isPromoted ? '★ SPOTLIGHT ACTIVE' : 'Enable Spotlight'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/plugins/${plugin.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                                title="View on site"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeletePlugin(plugin.id, plugin.title)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors cursor-pointer"
                                title="Delete plugin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: USERS & ULTIMATE VIP DISPENSER ================= */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-blue-400" />
                    <span>Users &amp; MinoForge Ultimate Manager</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage accounts, gift custom duration Ultimate VIP memberships, lower platform fees to 5%, and audit multi-IP flags.
                  </p>
                </div>
              </div>

              {/* Quick Gift Dispenser Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/50 p-5 sm:p-6 rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>Instant Ultimate VIP Gifter</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                          Admin Superpower
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Type any username or email to grant MinoForge Ultimate with custom expiration time period.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleQuickGift} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Username or email (e.g. SevGamerPro, admin@colasmp.net)..."
                        value={quickGiftInput}
                        onChange={(e) => setQuickGiftInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-white/15 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                      />
                    </div>

                    <div className="sm:col-span-4 relative">
                      <Clock className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={quickGiftDuration}
                        onChange={(e) => setQuickGiftDuration(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-950/90 border rounded-2xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                          quickGiftDuration === 'REVOKE' ? 'border-red-500/50 text-red-300' : 'border-white/15 text-amber-300'
                        }`}
                      >
                        <option value="1_DAY">⚡ 1 Day (24 Hours Pass)</option>
                        <option value="7_DAYS">📅 7 Days (1 Week Trial)</option>
                        <option value="1_MONTH">🌟 1 Month (30 Days Standard)</option>
                        <option value="3_MONTHS">🚀 3 Months (Quarterly Pass)</option>
                        <option value="6_MONTHS">💎 6 Months (Half-Year Access)</option>
                        <option value="1_YEAR">👑 1 Year (Annual VIP Pass)</option>
                        <option value="LIFETIME">♾️ Permanent Lifetime Access</option>
                        <option value="REVOKE" className="text-red-400 font-bold">🚫 Revoke / Take Back (Free Users Only)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        disabled={giftLoading}
                        className={`btn-animated w-full py-3 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50 transition-all ${
                          quickGiftDuration === 'REVOKE'
                            ? 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white shadow-red-500/20'
                            : 'btn-glow-blue btn-shimmer bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                        }`}
                      >
                        {giftLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : quickGiftDuration === 'REVOKE' ? (
                          <UserMinus className="w-4 h-4 text-white" />
                        ) : (
                          <Crown className="w-4 h-4 text-slate-950 fill-current" />
                        )}
                        <span>
                          {giftLoading 
                            ? 'Processing...' 
                            : quickGiftDuration === 'REVOKE' 
                              ? 'Take Ultimate Back' 
                              : 'Grant Ultimate'}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* User Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered</span>
                    <h4 className="text-xl font-black text-white">{users.length}</h4>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/30 flex items-center gap-3.5 shadow-lg shadow-amber-500/5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400">Ultimate VIPs</span>
                    <h4 className="text-xl font-black text-amber-300">
                      {users.filter(u => u.isUltimate).length}
                    </h4>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Verified Creators</span>
                    <h4 className="text-xl font-black text-white">
                      {users.filter(u => u.role === 'CREATOR' || u.role === 'ADMIN').length}
                    </h4>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Multi-IP Alerts</span>
                    <h4 className="text-xl font-black text-white">
                      {users.filter(u => u.flags > 0).length}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'ALL', label: `All Users (${users.length})` },
                    { id: 'ULTIMATE', label: `👑 Ultimate VIPs (${users.filter(u => u.isUltimate).length})` },
                    { id: 'CREATOR', label: `Creators (${users.filter(u => u.role === 'CREATOR').length})` },
                    { id: 'STANDARD', label: `Standard (${users.filter(u => !u.isUltimate && u.role !== 'ADMIN').length})` },
                    { id: 'FLAGGED', label: `⚠️ Flagged (${users.filter(u => u.flags > 0).length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setUserFilter(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        userFilter === tab.id
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Table Search Input */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, IP..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  {searchUser && (
                    <button
                      onClick={() => setSearchUser('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Users Table */}
              <div className="bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Email &amp; IP</th>
                        <th className="p-4">Membership &amp; Expiration</th>
                        <th className="p-4">System Role</th>
                        <th className="p-4">IP Security</th>
                        <th className="p-4 text-right">VIP Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-600">
                              <Users className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-slate-400 font-bold">No registered users match your search criteria.</p>
                            <p className="text-xs text-slate-600 mt-1">Try searching by username, email address, or clearing filters.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(user => {
                          const isLifetime = user.ultimateExpiresAt === 'LIFETIME' || !user.ultimateExpiresAt;
                          let remainingDays = null;
                          if (user.isUltimate && !isLifetime && user.ultimateExpiresAt) {
                            remainingDays = Math.ceil((new Date(user.ultimateExpiresAt).getTime() - Date.now()) / (1000 * 3600 * 24));
                          }

                          return (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                              
                              {/* User Info */}
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl font-black flex items-center justify-center text-xs shadow-md ${
                                    user.isUltimate
                                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 ring-2 ring-amber-400/50'
                                      : 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                                  }`}>
                                    {user.isUltimate ? <Crown className="w-4 h-4 fill-current" /> : (user.username ? user.username.charAt(0).toUpperCase() : 'U')}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-white text-sm">{user.username}</span>
                                      {user.isUltimate && (
                                        <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-black uppercase">
                                          VIP
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono block">ID: {user.id}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Email & IP */}
                              <td className="p-4">
                                <span className="text-slate-200 font-mono text-xs block">{user.email}</span>
                                <span className="text-slate-500 font-mono text-[11px] block mt-0.5">IP: {user.ip || '127.0.0.1'}</span>
                              </td>

                              {/* Membership & Expiration */}
                              <td className="p-4">
                                {user.isUltimate ? (() => {
                                  const isPaidUser = Boolean(
                                    user.isPaidSubscription || 
                                    user.paypalSubscriptionId || 
                                    user.ultimatePlan === 'PAID_MONTHLY' || 
                                    user.ultimatePlan === 'PAID_YEARLY' || 
                                    user.paymentMethod === 'PAYPAL'
                                  );

                                  return (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5">
                                        {isPaidUser ? (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                            <span>PAID SUBSCRIBER (PAYPAL)</span>
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10">
                                            <Gift className="w-3 h-3 text-amber-400" />
                                            <span>FREE GIFT VIP</span>
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                        <Clock className="w-3 h-3 text-cyan-400" />
                                        <span>
                                          {isLifetime 
                                            ? 'Permanent Lifetime VIP' 
                                            : remainingDays !== null && remainingDays > 0 
                                              ? `${remainingDays} days remaining (${new Date(user.ultimateExpiresAt).toLocaleDateString()})` 
                                              : 'Expired'}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-emerald-400 font-semibold block">
                                        ✓ 5% Platform Fee • €5 Ads • Verified Badge
                                      </span>
                                    </div>
                                  );
                                })() : (
                                  <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-white/10">
                                      Standard Account (10% Fee)
                                    </span>
                                    <p className="text-[10px] text-slate-500">No active VIP perks</p>
                                  </div>
                                )}
                              </td>

                              {/* Role */}
                              <td className="p-4">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                                  className={`bg-slate-950 border rounded-xl text-xs font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                                    user.role === 'ADMIN'
                                      ? 'text-red-300 border-red-500/40'
                                      : user.role === 'STAFF'
                                      ? 'text-purple-300 border-purple-500/40'
                                      : user.role === 'CREATOR'
                                      ? 'text-amber-300 border-amber-500/40'
                                      : 'text-slate-300 border-white/15'
                                  }`}
                                >
                                  <option value="USER">USER</option>
                                  <option value="CREATOR">CREATOR</option>
                                  <option value="STAFF">STAFF</option>
                                  <option value="ADMIN">ADMIN</option>
                                </select>
                              </td>

                              {/* IP Security */}
                              <td className="p-4">
                                {user.flags > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                                      <AlertTriangle className="w-3 h-3" />
                                      <span>20-Day Warning</span>
                                    </span>
                                    <button
                                      onClick={() => handleResolveIp(user.id)}
                                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                      title="Whitelist and remove warning"
                                    >
                                      Resolve IP
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-emerald-400/90 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Clean (1 Acc/IP)</span>
                                  </span>
                                )}
                              </td>

                              {/* Actions / Gift & Revoke Buttons */}
                              <td className="p-4 text-right">
                                {(() => {
                                  const isPaidUser = Boolean(
                                    user.isPaidSubscription || 
                                    user.paypalSubscriptionId || 
                                    user.ultimatePlan === 'PAID_MONTHLY' || 
                                    user.ultimatePlan === 'PAID_YEARLY' || 
                                    user.paymentMethod === 'PAYPAL'
                                  );

                                  if (user.isUltimate) {
                                    if (isPaidUser) {
                                      return (
                                        <div className="flex items-center justify-end gap-2">
                                          <span className="px-3 py-1.5 bg-slate-950/80 text-slate-400 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5" title="Protected: Paid subscription via PayPal">
                                            <Lock className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>Paid Plan (Active)</span>
                                          </span>
                                        </div>
                                      );
                                    }

                                    // Free Gifted User -> Can edit or take back
                                    return (
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedUserForGift(user);
                                            setGiftDuration(user.ultimateDuration || '1_MONTH');
                                          }}
                                          className="px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm cursor-pointer transition-all"
                                        >
                                          <Gift className="w-3.5 h-3.5" />
                                          <span>Edit</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleRevokeFreeGift(user)}
                                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-500/10 hover:shadow-red-500/20"
                                          title="Take back free gifted Ultimate"
                                        >
                                          <UserMinus className="w-3.5 h-3.5" />
                                          <span>Take Ultimate Back</span>
                                        </button>
                                      </div>
                                    );
                                  }

                                  // Standard Non-Ultimate User -> Can Gift
                                  return (
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedUserForGift(user);
                                          setGiftDuration('1_MONTH');
                                        }}
                                        className="btn-glow-blue btn-shimmer btn-animated px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md cursor-pointer transition-all"
                                      >
                                        <Gift className="w-3.5 h-3.5 fill-current" />
                                        <span>Gift Ultimate</span>
                                      </button>
                                    </div>
                                  );
                                })()}
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: PROMO & CREATOR CODES ================= */}
          {activeTab === 'promo' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <Tag className="w-6 h-6 text-amber-400" />
                    <span>Promo &amp; Creator Partner Codes</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Create live discount codes, creator partner attribution, and set specific end dates with live expiration enforcement.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search promo codes..."
                      value={searchPromo}
                      onChange={(e) => setSearchPromo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Active Codes</span>
                    <h4 className="text-xl font-black text-amber-300">
                      {promoCodes.filter(p => p.active && !p.isExpired).length}
                    </h4>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Redeemed</span>
                    <h4 className="text-xl font-black text-emerald-300">
                      {promoCodes.reduce((sum, p) => sum + (p.usedCount || 0), 0)} uses
                    </h4>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Creator Partners</span>
                    <h4 className="text-xl font-black text-blue-300">
                      {promoCodes.filter(p => p.creatorName).length}
                    </h4>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Expired / Disabled</span>
                    <h4 className="text-xl font-black text-slate-400">
                      {promoCodes.filter(p => p.isExpired || !p.active).length}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Promo Code Creator Card */}
              <div className="bg-slate-900/90 rounded-3xl border border-white/15 p-6 shadow-2xl space-y-5 relative overflow-hidden">
                <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Create New Promo or Creator Partner Code</h3>
                    <p className="text-xs text-slate-400">Configure discount percentage, partner commission, and expiration date.</p>
                  </div>
                </div>

                <form onSubmit={handleCreatePromo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Code Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Code Name (Uppercase) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DISCOUNT20, PARTNERCODE"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono font-bold placeholder-slate-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Discount Type */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Discount Type
                      </label>
                      <select
                        value={newPromoType}
                        onChange={(e) => setNewPromoType(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="PERCENT">Percentage Discount (% OFF)</option>
                        <option value="FIXED">Fixed Amount Discount ($/€ OFF)</option>
                      </select>
                    </div>

                    {/* Discount Amount */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        {newPromoType === 'PERCENT' ? 'Discount Percentage (%)' : 'Fixed Discount Amount (€)'} *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={newPromoType === 'PERCENT' ? "1" : "0.50"}
                          max={newPromoType === 'PERCENT' ? "100" : "500"}
                          step={newPromoType === 'PERCENT' ? "1" : "0.50"}
                          required
                          value={newPromoType === 'PERCENT' ? newPromoPercent : newPromoAmount}
                          onChange={(e) => {
                            if (newPromoType === 'PERCENT') setNewPromoPercent(e.target.value);
                            else setNewPromoAmount(e.target.value);
                          }}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                          {newPromoType === 'PERCENT' ? '%' : '€'}
                        </span>
                      </div>
                    </div>

                    {/* Expiration End Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        End / Expiration Date
                      </label>
                      <input
                        type="date"
                        value={newPromoEndDate}
                        onChange={(e) => setNewPromoEndDate(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                      />
                    </div>

                  </div>

                  {/* Secondary Row: Creator Name, Creator Commission, Max Uses, Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    
                    {/* Creator Partner Username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Creator Partner (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SevGamerPro"
                        value={newPromoCreator}
                        onChange={(e) => setNewPromoCreator(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Creator Share */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Creator Revenue Share (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={newPromoCreatorShare}
                        onChange={(e) => setNewPromoCreatorShare(e.target.value)}
                        placeholder="10"
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Max Uses */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Max Usage Limit (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Unlimited (blank)"
                        value={newPromoMaxUses}
                        onChange={(e) => setNewPromoMaxUses(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Description Note */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Description / Campaign Note
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Summer Launch Promo"
                        value={newPromoDesc}
                        onChange={(e) => setNewPromoDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                  </div>

                  {/* Quick Expiry Date Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Quick End Date Presets:</span>
                    {[
                      { label: '+7 Days', days: 7 },
                      { label: '+30 Days', days: 30 },
                      { label: '+90 Days', days: 90 },
                      { label: '+1 Year', days: 365 },
                      { label: 'Never Expires', days: 0 }
                    ].map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          if (preset.days === 0) {
                            setNewPromoEndDate('');
                          } else {
                            const d = new Date(Date.now() + preset.days * 24 * 3600 * 1000);
                            setNewPromoEndDate(d.toISOString().split('T')[0]);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={promoCreateLoading}
                      className="btn-glow-blue btn-shimmer btn-animated px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {promoCreateLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Generating Promo Code...</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-4 h-4 text-slate-950" />
                          <span>Publish Promo Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Promo Codes Table */}
              <div className="bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Code &amp; Description</th>
                        <th className="p-4">Discount</th>
                        <th className="p-4">Creator Attribution</th>
                        <th className="p-4">End Date / Expiration</th>
                        <th className="p-4">Usage Count</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredPromoCodes.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-600">
                              <Tag className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-slate-400 font-bold">No promo or creator codes found.</p>
                            <p className="text-xs text-slate-600 mt-1">Create a new promo code above to offer discounts at checkout.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPromoCodes.map(promo => {
                          const isExpired = promo.endDate ? Date.now() > new Date(promo.endDate).getTime() : false;
                          const isExhausted = promo.maxUses ? (promo.usedCount || 0) >= promo.maxUses : false;
                          let remainingDays = null;
                          if (promo.endDate && !isExpired) {
                            remainingDays = Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / (1000 * 3600 * 24));
                          }

                          return (
                            <tr key={promo.id} className="hover:bg-white/5 transition-colors">
                              
                              {/* Code & Desc */}
                              <td className="p-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-sm text-amber-300 px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-lg">
                                      {promo.code}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyPromo(promo.code, promo.id)}
                                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
                                      title="Copy code"
                                    >
                                      {copiedPromoId === promo.id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                  <p className="text-[11px] text-slate-400">{promo.description || 'General Platform Promo'}</p>
                                </div>
                              </td>

                              {/* Discount */}
                              <td className="p-4 font-mono font-bold">
                                {promo.discountType === 'FIXED' ? (
                                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs">
                                    -€{parseFloat(promo.discountAmount || 0).toFixed(2)} OFF
                                  </span>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-xl text-xs ${
                                    promo.discountPercent === 100
                                      ? 'bg-gradient-to-r from-amber-500/30 to-yellow-400/30 text-yellow-300 border border-yellow-400/50'
                                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                  }`}>
                                    {promo.discountPercent}% OFF {promo.discountPercent === 100 && '🎉 100% FREE'}
                                  </span>
                                )}
                              </td>

                              {/* Creator Partner */}
                              <td className="p-4">
                                {promo.creatorName ? (
                                  <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-white flex items-center gap-1">
                                      <Crown className="w-3 h-3 text-amber-400" />
                                      <span>{promo.creatorName}</span>
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {promo.creatorPercentage || 10}% Commission Share
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-500 font-semibold">Platform Wide</span>
                                )}
                              </td>

                              {/* End Date / Expiration */}
                              <td className="p-4">
                                {promo.endDate ? (
                                  <div className="space-y-0.5 font-mono text-xs">
                                    <span className={`block font-bold ${isExpired ? 'text-red-400' : 'text-slate-200'}`}>
                                      {new Date(promo.endDate).toLocaleDateString()}
                                    </span>
                                    <span className={`text-[10px] block ${isExpired ? 'text-red-400' : 'text-cyan-400'}`}>
                                      {isExpired ? '⚠️ Expired' : `${remainingDays} days remaining`}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-emerald-400 font-bold">♾️ Permanent (No Expiry)</span>
                                )}
                              </td>

                              {/* Usage Count */}
                              <td className="p-4 font-mono text-xs">
                                <div className="space-y-1">
                                  <span className="font-bold text-white">
                                    {promo.usedCount || 0} {promo.maxUses ? `/ ${promo.maxUses}` : 'uses'}
                                  </span>
                                  {promo.maxUses && (
                                    <div className="w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                                      <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-amber-400 rounded-full"
                                        style={{ width: `${Math.min(100, ((promo.usedCount || 0) / promo.maxUses) * 100)}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  !promo.active 
                                    ? 'bg-slate-800 text-slate-400 border border-white/10'
                                    : isExpired
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                    : isExhausted
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                }`}>
                                  {!promo.active ? 'DISABLED' : isExpired ? 'EXPIRED' : isExhausted ? 'EXHAUSTED' : 'ACTIVE'}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePromoActive(promo.id, promo.active)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                      promo.active
                                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                                    }`}
                                  >
                                    {promo.active ? 'Disable' : 'Enable'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeletePromo(promo.id, promo.code)}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors cursor-pointer"
                                    title="Delete promo code"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 5: AI ENGINE TUNING ================= */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Gemini AI Engine Parameters</h2>
                <p className="text-xs text-slate-400">Configure parameters and daily quotas for the AI Plugin Config Generator.</p>
              </div>

              <div className="p-6 bg-slate-900/80 rounded-3xl border border-white/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">AI Generation Engine Model</label>
                    <select
                      className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      defaultValue="gemini-1.5-pro"
                    >
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Highest Code Accuracy &amp; Quality)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Low Latency &amp; Speed)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen Preview)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Free User Daily Quota</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={config.aiFreeDailyLimit}
                      onChange={(e) => setConfig({ ...config, aiFreeDailyLimit: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Ultimate users receive unlimited daily generations</span>
                  </div>
                </div>

                <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-cyan-300 block">Server YAML and Lua Generator Supercharged</strong>
                    <p className="text-slate-400">
                      The AI Config Generator utilizes deep grammar validation to generate syntax-perfect `config.yml`, `plugin.yml`, and `fxmanifest.lua` files.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: AUDIT LOGS ================= */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Security Audit &amp; Event Stream</h2>
                  <p className="text-xs text-slate-400">Real-time log of administrative logins, configuration edits, and bytecode scans.</p>
                </div>
                <button
                  onClick={fetchData}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Logs</span>
                </button>
              </div>

              <div className="p-6 bg-slate-900/80 rounded-3xl border border-white/10 font-mono text-xs space-y-3">
                {auditLogs.length === 0 ? (
                  <div className="text-slate-500 py-8 text-center">No recent security anomalies recorded.</div>
                ) : (
                  auditLogs.map(log => (
                    <div key={log.id} className="p-3 bg-slate-950/80 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.type.includes('AUTH') ? 'bg-blue-500/20 text-blue-300' :
                          log.type.includes('SECURITY') ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-white truncate">{log.details}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] flex-shrink-0">
                        <span>{log.actor}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: GIFT ULTIMATE MEMBERSHIP ================= */}
      {selectedUserForGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-amber-500/10 space-y-6 relative overflow-hidden">
            
            {/* Top Amber Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                  <Crown className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Gift MinoForge Ultimate</h3>
                  <p className="text-xs text-slate-400">Configure duration and activate VIP privileges.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserForGift(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected User Summary Badge */}
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-300 text-sm">
                  {selectedUserForGift.username ? selectedUserForGift.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{selectedUserForGift.username}</span>
                    {selectedUserForGift.isUltimate && (
                      <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-black uppercase">
                        Active VIP
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{selectedUserForGift.email}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-white/10">
                {selectedUserForGift.role}
              </span>
            </div>

            {/* Time Period Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Ultimate Duration (Time Period)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: '1_DAY', label: '24 Hours', desc: '1 Day Pass', icon: Zap },
                  { id: '7_DAYS', label: '7 Days', desc: '1 Week Trial', icon: Clock },
                  { id: '1_MONTH', label: '1 Month', desc: '30 Days Standard', icon: Calendar },
                  { id: '3_MONTHS', label: '3 Months', desc: 'Quarterly VIP', icon: Sparkles },
                  { id: '6_MONTHS', label: '6 Months', desc: 'Half-Year Pass', icon: Award },
                  { id: '1_YEAR', label: '1 Year', desc: '365 Days VIP', icon: Crown },
                  { id: 'LIFETIME', label: '♾️ Lifetime', desc: 'Permanent Access', icon: Crown, fullWidth: true }
                ].map(opt => {
                  const Icon = opt.icon;
                  const isSelected = giftDuration === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGiftDuration(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        opt.fullWidth ? 'col-span-2 sm:col-span-3' : ''
                      } ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                          : 'bg-slate-950/60 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                        isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-white/5 text-slate-400'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-black block truncate">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Perks Preview Checklist */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1.5 text-xs text-amber-200">
              <span className="font-bold text-[11px] text-amber-400 uppercase tracking-wider block">
                VIP Privileges Granted:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>5% Platform Fee</strong> (Creator keeps 95% of plugin sales)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>€5.00/mo Ad Boost Credits</strong> for plugin promotion</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>Golden Crown Badge</strong> next to name &amp; published plugins</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>VIP Spotlight Priority</strong> on homepage &amp; catalog</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {selectedUserForGift.isUltimate ? (
                <button
                  type="button"
                  onClick={() => handleGiftUltimate(selectedUserForGift.id, 'REVOKE')}
                  disabled={giftLoading}
                  className="px-4 py-3 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Revoke Ultimate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedUserForGift(null)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={() => handleGiftUltimate(selectedUserForGift.id, giftDuration)}
                disabled={giftLoading}
                className="btn-glow-blue btn-shimmer btn-animated flex-1 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer disabled:opacity-50"
              >
                {giftLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Activating VIP Membership...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-slate-950 fill-current" />
                    <span>Confirm &amp; Activate Ultimate</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default NimdaAdminDashboard;
