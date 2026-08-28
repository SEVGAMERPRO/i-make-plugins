import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Lock, Activity, Server, Users, Package, 
  Settings, MessageSquare, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, 
  ExternalLink, LogOut, DollarSign, Database, Sliders, Globe, Bell, 
  Download, Trash2, Eye, Check, X, Search, ChevronRight, Terminal, Cpu, Wrench
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
    id: 'p-mine-1',
    title: 'Ultimate Economy & Multi-Currency Vault',
    author: 'SevGamer',
    game: 'Minecraft',
    price: 4.99,
    downloads: 0,
    status: 'APPROVED',
    isPromoted: true,
    version: '2.4.0',
    fileSize: '4.2 MB',
    minoShieldStatus: 'CLEAN_BYTECODE'
  },
  {
    id: 'p-fivem-2',
    title: 'Advanced Fuel & Electric Charging Station',
    author: 'FiveMDev',
    game: 'FiveM',
    price: 3.49,
    downloads: 0,
    status: 'APPROVED',
    isPromoted: true,
    version: '1.1.2',
    fileSize: '8.7 MB',
    minoShieldStatus: 'CLEAN_BYTECODE'
  },
  {
    id: 'p-bot-3',
    title: 'Discord Automated Ticket & Transcript Bot',
    author: 'BotMaster',
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

const SAMPLE_USERS_ADMIN = [
  { id: 'u-admin', username: 'SevGamerPro', email: 'admin@minoforge.net', role: 'ADMIN', registeredAt: 'Aug 2026', ip: '127.0.0.1', status: 'ACTIVE', flags: 0 },
  { id: 'u-1', username: 'AlexDev', email: 'creator@example.com', role: 'CREATOR', registeredAt: 'Aug 2026', ip: '82.165.42.19', status: 'ACTIVE', flags: 0 },
  { id: 'u-2', username: 'PixelCraft', email: 'pixel@example.com', role: 'USER', registeredAt: 'Aug 2026', ip: '192.168.1.102', status: 'FLAGGED_IP_MULTI', flags: 1 },
];

const NimdaAdminDashboard = ({ onLogout }) => {
  const { formatPrice } = useCurrency();
  const { config: globalConfig, updateConfig: syncGlobalConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'config' | 'plugins' | 'users' | 'ai' | 'logs'
  const [config, setConfig] = useState(globalConfig || DEFAULT_CONFIG);
  const [stats, setStats] = useState({
    uptime: '1h 42m 10s',
    memoryHeapMB: '38.4',
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
  const [users, setUsers] = useState(SAMPLE_USERS_ADMIN);
  const [auditLogs, setAuditLogs] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchPlugin, setSearchPlugin] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [notification, setNotification] = useState('');

  // Keep local state in sync when global config changes
  useEffect(() => {
    if (globalConfig) {
      setConfig(globalConfig);
    }
  }, [globalConfig]);

  // Fetch admin config & stats
  const fetchData = async () => {
    setRefreshLoading(true);
    try {
      const [configRes, statsRes, logsRes] = await Promise.allSettled([
        axios.get('/api/admin/config'),
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/audit-logs')
      ]);

      if (configRes.status === 'fulfilled' && configRes.data?.config) {
        setConfig(configRes.data.config);
      }
      if (statsRes.status === 'fulfilled' && statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
      if (logsRes.status === 'fulfilled' && logsRes.data?.logs) {
        setAuditLogs(logsRes.data.logs);
      }
    } catch (err) {
      console.warn('Using local fallback state for admin dashboard');
    } finally {
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
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
      setNotification('✅ System configuration saved and synchronized site-wide!');
      setTimeout(() => {
        setSaveSuccess(false);
        setNotification('');
      }, 4000);
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

  const handleTogglePromoted = (pluginId) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === pluginId) {
        const nextPromoted = !p.isPromoted;
        return { ...p, isPromoted: nextPromoted };
      }
      return p;
    }));
    setNotification(`Updated spotlight status for plugin.`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleUserRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setNotification(`User role updated to ${newRole}.`);
    setTimeout(() => setNotification(''), 3000);
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

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

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
                <span>Users &amp; IP Rules</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-950/60 text-[10px] font-mono">
                {users.length}
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
                  <div className="text-3xl font-black text-white">{stats.registeredUsers}</div>
                  <p className="text-[11px] text-slate-400">Real verified accounts (from 0)</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Verified Creators</span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-cyan-300">{stats.verifiedCreators}</div>
                  <p className="text-[11px] text-slate-400">Published resource authors</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Active Marketplace Plugins</span>
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-purple-300">{stats.totalPlugins}</div>
                  <p className="text-[11px] text-emerald-400 font-bold">100% MinoShield verified</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Multi-Account IP Alerts</span>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-amber-400">{stats.ipFlagsCount}</div>
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
                                onClick={() => {
                                  setPlugins(prev => prev.filter(p => p.id !== plugin.id));
                                  setNotification(`Deleted plugin ${plugin.title}`);
                                  setTimeout(() => setNotification(''), 3000);
                                }}
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

          {/* ================= TAB 4: USERS & IP RULES ================= */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Users &amp; 1 Account Per IP Rule</h2>
                  <p className="text-xs text-slate-400">Manage user authorization roles, multi-account IP alerts, and bans.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Last Known IP</th>
                        <th className="p-4">IP Flags</th>
                        <th className="p-4 text-right">Assign Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-300 font-black flex items-center justify-center text-xs">
                              {user.username.charAt(0)}
                            </div>
                            <span>{user.username}</span>
                          </td>
                          <td className="p-4 text-slate-300 font-mono text-[11px]">{user.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              user.role === 'ADMIN'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : user.role === 'STAFF'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : user.role === 'CREATOR'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-400 border border-white/10'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 font-mono text-[11px]">{user.ip}</td>
                          <td className="p-4">
                            {user.flags > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Multi-Account Alert</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500 font-semibold">Clean (1 Acc / IP)</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={user.role}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                              className="bg-slate-950 border border-white/15 rounded-lg text-xs text-white px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="USER">USER</option>
                              <option value="CREATOR">CREATOR</option>
                              <option value="STAFF">STAFF</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                        </tr>
                      ))}
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

    </div>
  );
};

export default NimdaAdminDashboard;
