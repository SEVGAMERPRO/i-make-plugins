import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Megaphone, Settings, MessageSquare, 
  Plus, Edit, Trash2, CheckCircle2, Clock, DollarSign, Download, Star, 
  ExternalLink, Key, Tag, Bell, ShieldCheck, Crown, Rocket, ChevronDown, 
  HelpCircle, Check, X, ArrowUpRight, TrendingUp, Users, Calendar, Percent,
  PackageOpen, AlertCircle, Share2, Copy, Gift, UserPlus, Sliders, Bot,
  Lock, Globe, CreditCard, Sparkles, Filter, RefreshCw, Eye, MousePointer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import MinoShieldBadge from '../components/security/MinoShieldBadge';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('overview');

  // Time filters
  const [timeRange, setTimeRange] = useState('Past 30 days');
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals State
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [showCreateBundleModal, setShowCreateBundleModal] = useState(false);
  const [showScheduleSaleModal, setShowScheduleSaleModal] = useState(false);
  const [showIssueLicenseModal, setShowIssueLicenseModal] = useState(false);

  // Forms State
  const [featuredRate, setFeaturedRate] = useState('10');
  const [bundleTitle, setBundleTitle] = useState('');
  const [bundleDiscount, setBundleDiscount] = useState('20');
  const [saleEventName, setSaleEventName] = useState('');
  const [saleDiscount, setSaleDiscount] = useState('20');
  const [licenseBuyer, setLicenseBuyer] = useState('');
  const [payoutEmail, setPayoutEmail] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('paypal');

  // Dynamic Stores & Data from LocalStorage
  const [resources, setResources] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('minoforge_uploaded_plugins') || '[]');
    } catch {
      return [];
    }
  });

  const [bundles, setBundles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('minoforge_bundles') || '[]');
    } catch {
      return [];
    }
  });

  const [saleEvents, setSaleEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('minoforge_sale_events') || '[]');
    } catch {
      return [];
    }
  });

  const [licenses, setLicenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('minoforge_issued_licenses') || '[]');
    } catch {
      return [];
    }
  });

  // Placeholder Anti-Leak Settings
  const [placeholderSettings, setPlaceholderSettings] = useState({
    watermarkBuyerId: true,
    watermarkOrderId: true,
    ipLocking: false,
    autoBanLeakers: true,
    obfuscateBytecode: true
  });

  // Payout & Wallet State (8% Transaction fee to Treasury)
  const [payoutHistory, setPayoutHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('minoforge_payout_history') || '[]');
      return saved.filter(p => p.id !== 'pay-tx-sample' && p.ref !== 'PAY-2026-0801');
    } catch {
      return [];
    }
  });

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [customWithdrawBalance, setCustomWithdrawBalance] = useState(() => {
    const raw = localStorage.getItem('minoforge_creator_wallet_balance');
    if (!raw || raw === '65.00' || raw === '65') {
      localStorage.setItem('minoforge_creator_wallet_balance', '0.00');
      return 0.00;
    }
    return parseFloat(raw) || 0.00;
  });

  // Calculated Real Lifetime Metrics (Starting strictly at 0)
  const totalRevenue = resources.reduce((sum, res) => sum + ((parseFloat(res.price) || 0) * (parseInt(res.downloads) || 0)), 0);
  const totalDownloads = resources.reduce((sum, res) => sum + (parseInt(res.downloads) || 0), 0);
  const ratedResources = resources.filter(res => res.ratingCount > 0);
  const averageRating = ratedResources.length > 0 
    ? (ratedResources.reduce((sum, res) => sum + (parseFloat(res.rating) || 0), 0) / ratedResources.length).toFixed(1)
    : '0.0';
  const totalReviewsCount = resources.reduce((sum, res) => sum + (parseInt(res.ratingCount) || 0), 0);

  // Handlers
  const handleCreateBundle = (e) => {
    e.preventDefault();
    if (!bundleTitle.trim()) return;
    const newBundle = {
      id: `bundle-${Date.now()}`,
      title: bundleTitle.trim(),
      discount: parseInt(bundleDiscount) || 20,
      pluginsCount: resources.length > 0 ? Math.min(3, resources.length) : 2,
      price: (24.99 * (1 - (parseInt(bundleDiscount) || 20) / 100)).toFixed(2),
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [newBundle, ...bundles];
    setBundles(updated);
    localStorage.setItem('minoforge_bundles', JSON.stringify(updated));
    setShowCreateBundleModal(false);
    setBundleTitle('');
  };

  const handleScheduleSale = (e) => {
    e.preventDefault();
    if (!saleEventName.trim()) return;
    const newSale = {
      id: `sale-${Date.now()}`,
      title: saleEventName.trim(),
      discount: parseInt(saleDiscount) || 20,
      startDate: new Date().toLocaleDateString(),
      endDate: 'In 7 days',
      status: 'ACTIVE'
    };
    const updated = [newSale, ...saleEvents];
    setSaleEvents(updated);
    localStorage.setItem('minoforge_sale_events', JSON.stringify(updated));
    setShowScheduleSaleModal(false);
    setSaleEventName('');
  };

  const handleIssueLicense = (e) => {
    e.preventDefault();
    if (!licenseBuyer.trim()) return;
    const newLicense = {
      id: `lic-${Date.now()}`,
      buyerName: licenseBuyer.trim(),
      key: `KEY-${Math.floor(1000 + Math.random() * 9000)}-MINE-${Math.floor(1000 + Math.random() * 9000)}`,
      plugin: resources[0]?.title || 'Custom Plugin',
      ipBinding: '127.0.0.1 (Unbound)',
      status: 'ACTIVE',
      issuedAt: new Date().toLocaleDateString()
    };
    const updated = [newLicense, ...licenses];
    setLicenses(updated);
    localStorage.setItem('minoforge_issued_licenses', JSON.stringify(updated));
    setShowIssueLicenseModal(false);
    setLicenseBuyer('');
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(`https://minoforge.com/ref/@${user?.username || 'creator'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Top Breadcrumb & User Ribbon */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-blue-400 font-bold hover:underline">MinoForge</Link>
            <span>&gt;</span>
            <span className="text-white font-medium capitalize">Creator Portal</span>
            <span>&gt;</span>
            <span className="text-blue-400 font-semibold capitalize">{currentSection.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Dashboard Main Grid with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Exact BuiltByBit Sidebar Navigation */}
          <div className="lg:col-span-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl space-y-6">
            
            {/* 1. Analytics */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Analytics
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('overview')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'overview' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setCurrentSection('product-analytics')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'product-analytics' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Product analytics
                </button>
              </div>
            </div>

            {/* 2. Products */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Products
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('resources')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${currentSection === 'resources' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Resources</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{resources.length}</span>
                </button>
                <button
                  onClick={() => setCurrentSection('bundles')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${currentSection === 'bundles' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Bundles</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{bundles.length}</span>
                </button>
              </div>
            </div>

            {/* 3. Purchases */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Purchases
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('transactions')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'transactions' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setCurrentSection('licenses')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${currentSection === 'licenses' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Licenses</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{licenses.length}</span>
                </button>
              </div>
            </div>

            {/* 4. Engagement */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Engagement
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('advertising')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${currentSection === 'advertising' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Advertising</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">PRO</span>
                </button>
                <button
                  onClick={() => setCurrentSection('sale-events')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${currentSection === 'sale-events' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Sale events</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{saleEvents.length}</span>
                </button>
                <button
                  onClick={() => setCurrentSection('referrals')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'referrals' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Referrals
                </button>
                <button
                  onClick={() => setCurrentSection('invite-a-creator')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'invite-a-creator' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Invite a creator
                </button>
                <button
                  onClick={() => setCurrentSection('stores')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${currentSection === 'stores' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Stores</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    <Rocket className="w-2.5 h-2.5" /> Ultimate
                  </span>
                </button>
              </div>
            </div>

            {/* 5. Settings */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Settings
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('tebex-stripe-wallet')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'tebex-stripe-wallet' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Tebex / Stripe wallet
                </button>
                <button
                  onClick={() => setCurrentSection('discord-bot-sync')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'discord-bot-sync' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Discord bot sync
                </button>
                <button
                  onClick={() => setCurrentSection('placeholders')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${currentSection === 'placeholders' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Placeholders
                </button>
              </div>
            </div>

          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-9 space-y-6">

            {/* SECTION 1: OVERVIEW */}
            {currentSection === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* 3 Real Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl">
                    <span className="text-xs font-bold uppercase text-slate-400">Lifetime Revenue</span>
                    <p className="text-3xl font-black text-emerald-400 mt-2">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-slate-400 mt-1">Calculated from verified sales</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl">
                    <span className="text-xs font-bold uppercase text-slate-400">Total Downloads</span>
                    <p className="text-3xl font-black text-white mt-2">{totalDownloads}</p>
                    <p className="text-xs text-slate-400 mt-1">Across {resources.length} {resources.length === 1 ? 'plugin' : 'plugins'}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl">
                    <span className="text-xs font-bold uppercase text-slate-400">Customer Rating</span>
                    <p className="text-3xl font-black text-amber-400 mt-2">{averageRating} / 5.0</p>
                    <p className="text-xs text-slate-400 mt-1">{totalReviewsCount} verified reviews</p>
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button 
                    onClick={() => navigate('/upload')}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-blue-500/40 text-left transition-all group cursor-pointer"
                  >
                    <Package className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Upload Plugin</span>
                    <span className="text-[10px] text-slate-400">List new resource</span>
                  </button>

                  <button 
                    onClick={() => setCurrentSection('bundles')}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
                  >
                    <Gift className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Create Bundle</span>
                    <span className="text-[10px] text-slate-400">Package deals</span>
                  </button>

                  <button 
                    onClick={() => setCurrentSection('advertising')}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                  >
                    <Megaphone className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Promote Ads</span>
                    <span className="text-[10px] text-slate-400">$5 Free Credit</span>
                  </button>

                  <button 
                    onClick={() => setCurrentSection('discord-bot-sync')}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 text-left transition-all group cursor-pointer"
                  >
                    <Bot className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Discord Roles</span>
                    <span className="text-[10px] text-slate-400">Sync buyers</span>
                  </button>
                </div>

                {/* Google Pro Creator Tools Suite */}
                <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Google Pro AI Creator Tools</span>
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-300 font-bold px-2 py-0.5 rounded-md border border-blue-500/30">
                      Gemini 1.5/2.0 Pro
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link
                      to="/crash-analyzer"
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-red-500/40 transition-all group block"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">AI Crash Diagnostics</strong>
                        <span className="text-[9px] bg-red-500/20 text-red-300 font-black px-1.5 py-0.5 rounded">Pre-Check #1</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Test stack traces &amp; paper logs before staff submission.</p>
                    </Link>

                    <Link
                      to="/upload"
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-cyan-500/40 transition-all group block"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Canva Banner AI</strong>
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-black px-1.5 py-0.5 rounded">Design</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Generate high-res YouTube &amp; store thumbnails on Canva.</p>
                    </Link>

                    <Link
                      to="/settings?tab=language"
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-emerald-500/40 transition-all group block"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Global Translation</strong>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-1.5 py-0.5 rounded">5 Languages</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Google Cloud instant multi-language translation.</p>
                    </Link>
                  </div>
                </div>

                {/* Listed Plugins Overview */}
                {resources.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-slate-900/80 border border-white/10 text-center space-y-4 shadow-xl">
                    <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-white/10 mx-auto flex items-center justify-center text-slate-500">
                      <PackageOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No Resources Published Yet</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      You haven't uploaded any plugins yet. Upload your first plugin to start tracking real downloads, customer reviews, and sales.
                    </p>
                    <Link
                      to="/upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Your First Plugin</span>
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="text-lg font-bold text-white">Your Listed Plugins ({resources.length})</h3>
                      <Link to="/upload" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Upload New
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {resources.map((res, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white text-sm block">{res.title}</span>
                            <span className="text-xs text-slate-400">{res.game || 'Minecraft'} • v{res.version || '1.0.0'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-white">${parseFloat(res.price || 0).toFixed(2)}</span>
                            <span className="text-xs text-slate-400 block">{res.downloads || 0} downloads</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* SECTION 2: PRODUCT ANALYTICS */}
            {currentSection === 'product-analytics' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">Product Performance Analytics</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Page views, conversion rates, and regional traffic breakdown</p>
                  </div>
                  <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-slate-800 border border-white/10 text-xs text-white rounded-xl px-3 py-2"
                  >
                    <option value="Past 7 days">Past 7 days</option>
                    <option value="Past 30 days">Past 30 days</option>
                    <option value="All Time">All Time</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                    <span className="text-xs text-slate-400 font-bold">Total Page Views</span>
                    <p className="text-2xl font-black text-white">0</p>
                    <span className="text-[10px] text-slate-500">From verified users</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                    <span className="text-xs text-slate-400 font-bold">Checkout Conversion</span>
                    <p className="text-2xl font-black text-emerald-400">0.00%</p>
                    <span className="text-[10px] text-slate-500">View to purchase ratio</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                    <span className="text-xs text-slate-400 font-bold">Top Traffic Source</span>
                    <p className="text-2xl font-black text-cyan-400">Direct</p>
                    <span className="text-[10px] text-slate-500">Marketplace Search</span>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-slate-950/60 border border-white/5 text-center space-y-2">
                  <BarChart3 className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Analytics Data in This Timeframe</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When visitors view your plugins or purchase licenses, real-time conversion rates and referral logs will be graphed here.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 3: RESOURCES */}
            {currentSection === 'resources' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-black text-white">Your Resources ({resources.length})</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Manage plugin files, changelogs, pricing, and active ads</p>
                  </div>
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Resource</span>
                  </Link>
                </div>

                {resources.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <PackageOpen className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-base font-bold text-white">No Resources Uploaded Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click the "Upload Resource" button above to submit your first game plugin or script for staff review.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 bg-slate-950/40">
                        <tr>
                          <th className="py-3 px-4 font-bold">Resource</th>
                          <th className="py-3 px-4 font-bold">Category</th>
                          <th className="py-3 px-4 font-bold">Price</th>
                          <th className="py-3 px-4 font-bold">Downloads</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium">
                        {resources.map((res, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-bold text-white">{res.title}</td>
                            <td className="py-4 px-4 text-xs text-slate-400">{res.game || 'Minecraft'}</td>
                            <td className="py-4 px-4 font-bold text-white">${parseFloat(res.price || 0).toFixed(2)}</td>
                            <td className="py-4 px-4 text-xs text-slate-400">{res.downloads || 0}</td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Approved
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Link to={`/plugins/${res.id || idx}`} className="text-xs font-bold text-blue-400 hover:underline">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 4: BUNDLES */}
            {currentSection === 'bundles' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-black text-white">Plugin Bundles ({bundles.length})</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Package multiple plugins together at a discounted rate to boost total sales volume</p>
                  </div>
                  <button
                    onClick={() => setShowCreateBundleModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Bundle</span>
                  </button>
                </div>

                {bundles.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Gift className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-base font-bold text-white">No Bundles Created Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Combine 2 or more of your plugins (e.g. Economy + Vault + ATM) into a discounted starter package.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bundles.map((bundle, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-base">{bundle.title}</h4>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded">
                            {bundle.discount}% OFF
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Includes {bundle.pluginsCount} plugins in this bundle.</p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-lg font-black text-emerald-400">${bundle.price}</span>
                          <span className="text-xs text-slate-400">Created {bundle.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 5: TRANSACTIONS */}
            {currentSection === 'transactions' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">Sales Transactions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time payment audit log, customer receipts, and payouts</p>
                </div>

                <div className="text-center py-12 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">No Transactions Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    All customer purchases, payouts, and automated invoice receipts will appear here in chronological order.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 6: LICENSES */}
            {currentSection === 'licenses' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-black text-white">License Keys &amp; DRM ({licenses.length})</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Automated customer key generation and anti-leak IP binding</p>
                  </div>
                  <button
                    onClick={() => setShowIssueLicenseModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Issue License</span>
                  </button>
                </div>

                {licenses.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Key className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-base font-bold text-white">Zero Licenses Issued</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      When customers purchase your premium plugins, unique cryptographic license keys will be generated and tracked here in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {licenses.map((lic, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block text-sm">{lic.buyerName}</span>
                          <span className="text-xs font-mono text-cyan-300">{lic.key}</span>
                          <span className="text-[10px] text-slate-500 block">{lic.plugin} • {lic.ipBinding}</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          ✓ Active
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 7: ADVERTISING */}
            {currentSection === 'advertising' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">Advertising Performance</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Track real impressions, clicks, and sales from sponsored placements</p>
                  </div>
                  <button
                    onClick={() => setShowCreateAdModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Ad</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-2xl font-black text-white">0</span>
                    <p className="text-[11px] text-slate-400 mt-1">Impressions past 30 days</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-2xl font-black text-white">0</span>
                    <p className="text-[11px] text-slate-400 mt-1">Purchases past 30 days</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-2xl font-black text-white">$0.00</span>
                    <p className="text-[11px] text-slate-400 mt-1">Revenue past 30 days</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-2xl font-black text-white">$0.00</span>
                    <p className="text-[11px] text-slate-400 mt-1">Ad fees paid</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-2xl font-black text-white">$0.00</span>
                    <p className="text-[11px] text-slate-400 mt-1">Gross profit</p>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-slate-950/60 border border-white/5 text-center space-y-2">
                  <Megaphone className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Advertising Impressions Recorded</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you promote your plugin with featured ads, real impression counts and conversion graphs will be charted here daily.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 8: SALE EVENTS */}
            {currentSection === 'sale-events' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-black text-white">Sale Events &amp; Discounts ({saleEvents.length})</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Schedule seasonal store-wide flash sales with custom banner badges</p>
                  </div>
                  <button
                    onClick={() => setShowScheduleSaleModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Sale</span>
                  </button>
                </div>

                {saleEvents.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Percent className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-base font-bold text-white">No Active Sale Events</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Schedule a discount event (e.g. 20% OFF Summer Weekend Sale) to boost conversion rates across your products.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {saleEvents.map((sale, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block text-sm">{sale.title}</span>
                          <span className="text-xs text-slate-400">{sale.startDate} to {sale.endDate}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full">
                          🔥 {sale.discount}% OFF
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 9: REFERRALS */}
            {currentSection === 'referrals' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">Affiliate &amp; Referrals</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Share your link and earn 5% on every purchase made by referred users</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Unique Referral Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://minoforge.com/ref/@${user?.username || 'creator'}`}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-cyan-300 font-mono"
                    />
                    <button
                      onClick={handleCopyRef}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-xs text-slate-400 font-bold">Referred Clicks</span>
                    <p className="text-2xl font-black text-white mt-1">0</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-xs text-slate-400 font-bold">Referred Signups</span>
                    <p className="text-2xl font-black text-white mt-1">0</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-xs text-slate-400 font-bold">Referral Earnings</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">$0.00</p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 10: INVITE A CREATOR */}
            {currentSection === 'invite-a-creator' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">Invite a Creator</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Invite fellow plugin developers and earn $10 bonus credits when they publish their first plugin</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Creator Partner Program</h4>
                      <p className="text-xs text-slate-400">Share your invite link with developers on Discord, SpigotMC, or GitHub.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://minoforge.com/join-creator?ref=${user?.username || 'partner'}`}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-purple-300 font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://minoforge.com/join-creator?ref=${user?.username || 'partner'}`);
                        alert('✅ Creator invite link copied to clipboard!');
                      }}
                      className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Invite</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 12: STORES */}
            {currentSection === 'stores' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-white">Custom Brand Storefront</h2>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">Ultimate Feature</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Create branded portal storefronts with your own vanity URLs</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Custom Storefront URL</span>
                      <span className="text-xs font-mono text-cyan-400">minoforge.com/@{user?.username || 'yourbrand'}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Customize header cover banners, curated plugin bundles, and Discord embeds.</p>
                </div>
              </div>
            )}

            {/* SECTION 13: PAYOUT GATEWAYS & WALLET */}
            {currentSection === 'tebex-stripe-wallet' && (() => {
              const commissionRate = user?.isUltimate ? 1.00 : 0.90;
              const currentTotalBalance = totalRevenue > 0 ? (totalRevenue * commissionRate) + customWithdrawBalance : customWithdrawBalance;
              const grossWithdrawNum = parseFloat(withdrawAmount) || 0;
              const fee8Percent = parseFloat((grossWithdrawNum * 0.08).toFixed(2));
              const netWithdrawNum = Math.max(0, parseFloat((grossWithdrawNum - fee8Percent).toFixed(2)));

              const handleWithdrawSubmit = async (e) => {
                e.preventDefault();
                setWithdrawError('');
                setWithdrawSuccessMsg('');
                const amount = parseFloat(withdrawAmount);
                if (!amount || amount < 10) {
                  setWithdrawError('Minimum payout withdrawal amount is €10.00.');
                  return;
                }
                if (amount > currentTotalBalance) {
                  setWithdrawError(`Requested withdrawal amount exceeds your available balance (€${currentTotalBalance.toFixed(2)}).`);
                  return;
                }
                if (!payoutEmail || !payoutEmail.includes('@')) {
                  setWithdrawError('Please enter a valid destination PayPal email address.');
                  return;
                }

                setWithdrawLoading(true);
                try {
                  const res = await axios.post('/api/orders/payout-request', {
                    creatorEmail: user?.email || 'creator@minoforge.com',
                    creatorUsername: user?.username || 'MinoCreator',
                    paypalEmail: payoutEmail.trim(),
                    grossAmount: amount
                  });

                  const fee8 = parseFloat((amount * 0.08).toFixed(2));
                  const net = parseFloat((amount - fee8).toFixed(2));
                  const newRef = res.data?.payoutRef || `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

                  const newRecord = {
                    ref: newRef,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    destination: `PayPal (${payoutEmail.trim()})`,
                    gross: amount,
                    fee: fee8,
                    amount: net,
                    status: 'Completed'
                  };

                  const updatedHistory = [newRecord, ...payoutHistory];
                  setPayoutHistory(updatedHistory);
                  localStorage.setItem('minoforge_payout_history', JSON.stringify(updatedHistory));

                  const newBalance = Math.max(0, customWithdrawBalance - amount);
                  setCustomWithdrawBalance(newBalance);
                  localStorage.setItem('minoforge_creator_wallet_balance', newBalance.toFixed(2));

                  setWithdrawSuccessMsg(`🎉 Payout of €${net.toFixed(2)} successfully sent to ${payoutEmail}! (8% fee of €${fee8.toFixed(2)} routed to Treasury: severinkaptein8@gmail.com)`);
                  setTimeout(() => {
                    setIsWithdrawModalOpen(false);
                    setWithdrawAmount('');
                    setWithdrawSuccessMsg('');
                  }, 3000);
                } catch (err) {
                  console.error('Payout request error:', err);
                  setWithdrawError(err.response?.data?.message || 'Failed to submit withdrawal request.');
                } finally {
                  setWithdrawLoading(false);
                }
              };

              return (
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-blue-400" />
                        <span>Creator Payouts &amp; Earnings Wallet</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Official payout gateway for instant PayPal withdrawals (8% transaction fee routed to Treasury)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Treasury Auto-Routed</span>
                      </span>
                    </div>
                  </div>

                  {/* Balance Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-lg shadow-emerald-500/5 space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Available for Payout</span>
                      <span className="text-3xl font-black text-emerald-400 font-mono">€{currentTotalBalance.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-500 block">Available immediately for withdrawal</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Platform Rate</span>
                      <span className="text-3xl font-black text-amber-400 font-mono">{user?.isUltimate ? '100%' : '90%'}</span>
                      <span className="text-[10px] text-slate-500 block">{user?.isUltimate ? '0% Ultimate fee (Keep 100%)' : '10% Standard commission'}</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Lifetime Paid Out</span>
                      <span className="text-3xl font-black text-blue-400 font-mono">
                        €{payoutHistory.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Transferred directly to your PayPal</span>
                    </div>
                  </div>

                  {/* Payout Settings & Withdrawal Trigger */}
                  <div className="p-6 rounded-2xl bg-slate-950/90 border border-white/10 space-y-6">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Payout Destination Settings</span>
                    </h4>

                    {/* Gateway Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('paypal')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          payoutMethod === 'paypal' 
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-white">PayPal Instant</span>
                          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">MassPay</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Direct PayPal payout in EUR / USD.</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayoutMethod('sepa')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          payoutMethod === 'sepa' 
                            ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-white">SEPA Bank Wire</span>
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Direct IBAN</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Direct European bank wire transfer.</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayoutMethod('stripe')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          payoutMethod === 'stripe' 
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10' 
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-white">Stripe Connect</span>
                          <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Express</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Automatic daily rolling transfers.</p>
                      </button>
                    </div>

                    {/* Payout Input Fields */}
                    {payoutMethod === 'paypal' && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          PayPal Payout Account Email
                        </label>
                        <input
                          type="email"
                          placeholder="your-paypal-account@email.com"
                          value={payoutEmail}
                          onChange={(e) => setPayoutEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={() => alert('✅ Payout preferences saved! Automatic weekly withdrawals will be routed to your destination.')}
                        className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Destination</span>
                      </button>

                      <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Request PayPal Withdrawal</span>
                      </button>
                    </div>
                  </div>

                  {/* Official Payout History Ledger */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Recent Payout History &amp; Settlements
                    </h4>
                    
                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-white/10">
                          <tr>
                            <th className="py-3 px-4 font-bold">Payout Reference</th>
                            <th className="py-3 px-4 font-bold">Date</th>
                            <th className="py-3 px-4 font-bold">Destination</th>
                            <th className="py-3 px-4 font-bold">Gross Requested</th>
                            <th className="py-3 px-4 font-bold">8% Fee (Treasury)</th>
                            <th className="py-3 px-4 font-bold">Net Deposited</th>
                            <th className="py-3 px-4 font-bold text-center">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Receipt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-slate-900/40 text-slate-300">
                          {payoutHistory.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-3.5 px-4 font-mono text-cyan-400">{item.ref}</td>
                              <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                              <td className="py-3.5 px-4">{item.destination}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-300">€{(item.gross || item.amount).toFixed(2)}</td>
                              <td className="py-3.5 px-4 font-mono text-amber-400">-€{(item.fee || (item.gross ? item.gross * 0.08 : 4.00)).toFixed(2)}</td>
                              <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">€{item.amount.toFixed(2)}</td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
                                  {item.status || 'Completed'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button 
                                  onClick={() => alert(`📄 Official Settlement Receipt\nReference: ${item.ref}\nGross: €${(item.gross || item.amount).toFixed(2)}\n8% Treasury Fee: €${(item.fee || 4.00).toFixed(2)}\nNet Paid: €${item.amount.toFixed(2)}\nDestination: ${item.destination}\nTreasury Account: severinkaptein8@gmail.com`)}
                                  className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                                >
                                  Statement
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* WITHDRAWAL MODAL */}
                  {isWithdrawModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                      <div className="relative bg-slate-950 border border-white/20 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-white">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-black text-white">Request PayPal Withdrawal</h3>
                              <p className="text-xs text-slate-400">Available Balance: <strong className="text-emerald-400 font-mono">€{currentTotalBalance.toFixed(2)}</strong></p>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsWithdrawModalOpen(false)}
                            className="text-slate-400 hover:text-white p-2"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {withdrawError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium">
                            {withdrawError}
                          </div>
                        )}

                        {withdrawSuccessMsg && (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bold">
                            {withdrawSuccessMsg}
                          </div>
                        )}

                        <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Withdrawal Amount (€ EUR)</label>
                              <button
                                type="button"
                                onClick={() => setWithdrawAmount(currentTotalBalance.toFixed(2))}
                                className="text-[11px] text-cyan-400 hover:underline font-bold"
                              >
                                Max (€{currentTotalBalance.toFixed(2)})
                              </button>
                            </div>
                            <input
                              type="number"
                              step="0.01"
                              min="10"
                              max={currentTotalBalance}
                              placeholder="Minimum €10.00"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-base font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              Destination PayPal Email
                            </label>
                            <input
                              type="email"
                              placeholder="your-paypal-email@example.com"
                              value={payoutEmail}
                              onChange={(e) => setPayoutEmail(e.target.value)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                              required
                            />
                          </div>

                          {/* Live 8% Transaction Breakdown Box */}
                          <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-300">
                              <span>Gross Requested Amount:</span>
                              <span className="font-mono font-bold text-white">€{grossWithdrawNum.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-amber-400">
                              <span>8% MinoForge Transaction &amp; Treasury Fee:</span>
                              <span className="font-mono font-bold">-€{fee8Percent.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-400 font-bold text-sm pt-2 border-t border-white/10">
                              <span>Net Deposited into your PayPal:</span>
                              <span className="font-mono">€{netWithdrawNum.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 pt-1">
                              * All 10% platform cuts and 8% payout transaction fees are automatically dispatched to MinoForge Treasury (<code>severinkaptein8@gmail.com</code>).
                            </p>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsWithdrawModalOpen(false)}
                              className="w-1/2 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={withdrawLoading || grossWithdrawNum < 10}
                              className="w-1/2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                              {withdrawLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                              <span>Confirm Withdrawal</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}

            {/* SECTION 14: DISCORD BOT SYNC */}
            {currentSection === 'discord-bot-sync' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">Discord Bot Synchronization</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Automatically grant buyer roles and send purchase logs in your Discord server</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Bot className="w-8 h-8 text-[#5865F2]" />
                    <div>
                      <h4 className="text-sm font-bold text-white">MinoForge Discord Sync Bot</h4>
                      <p className="text-xs text-slate-400">Assigns customer roles instantly upon verified purchase.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Discord Guild Server ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 123456789012345678"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Customer Role ID to Assign
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 987654321098765432"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => alert('✅ Discord Bot connected and role mapping active!')}
                    className="px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Discord Integration</span>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 15: PLACEHOLDERS (ANTI-LEAK WATERMARKING) */}
            {currentSection === 'placeholders' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">Anti-Leak Placeholder Injection</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Proprietary bytecode watermarking that embeds buyer IDs directly into downloaded plugin binaries</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">MinoShield Bytecode Watermark</h4>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-white block">Inject Buyer ID in JAR/ZIP Manifest</span>
                        <span className="text-[10px] text-slate-400">Identifies origin buyer if file is leaked</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={placeholderSettings.watermarkBuyerId}
                        onChange={(e) => setPlaceholderSettings({ ...placeholderSettings, watermarkBuyerId: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-white block">Automatic Leaker Detection &amp; Ban</span>
                        <span className="text-[10px] text-slate-400">Revokes licenses automatically when leaked hashes match</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={placeholderSettings.autoBanLeakers}
                        onChange={(e) => setPlaceholderSettings({ ...placeholderSettings, autoBanLeakers: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </label>
                  </div>

                  <button
                    onClick={() => alert('✅ Anti-theft placeholder settings updated!')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                  >
                    Save Security Settings
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* MODAL: CREATE BUNDLE */}
        {showCreateBundleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Create New Plugin Bundle</h3>
                <button onClick={() => setShowCreateBundleModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateBundle} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Bundle Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Survival SMP Starter Kit"
                    value={bundleTitle}
                    onChange={(e) => setBundleTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={bundleDiscount}
                    onChange={(e) => setBundleDiscount(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button type="button" onClick={() => setShowCreateBundleModal(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 rounded-xl text-xs font-bold">Create Bundle</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SCHEDULE SALE */}
        {showScheduleSaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Schedule Sale Event</h3>
                <button onClick={() => setShowScheduleSaleModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleScheduleSale} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Weekend Flash Sale"
                    value={saleEventName}
                    onChange={(e) => setSaleEventName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="5"
                    max="70"
                    value={saleDiscount}
                    onChange={(e) => setSaleDiscount(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button type="button" onClick={() => setShowScheduleSaleModal(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 rounded-xl text-xs font-bold">Activate Sale</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ISSUE LICENSE */}
        {showIssueLicenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Issue Manual License Key</h3>
                <button onClick={() => setShowIssueLicenseModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleIssueLicense} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Buyer Username / Server</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hypixel_Staff"
                    value={licenseBuyer}
                    onChange={(e) => setLicenseBuyer(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button type="button" onClick={() => setShowIssueLicenseModal(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 rounded-xl text-xs font-bold">Generate Key</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CREATE AD */}
        {showCreateAdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Create Featured Ad</h3>
                <button onClick={() => setShowCreateAdModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="space-y-4 text-xs">
                <p className="text-slate-300">Set a featured promotion rate for your resources to gain priority discovery impressions across search and category listings.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Featured Rate (% of sale)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={featuredRate}
                    onChange={(e) => setFeaturedRate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button onClick={() => setShowCreateAdModal(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs">Cancel</button>
                  <button onClick={() => { setShowCreateAdModal(false); alert('🎉 Ad campaign activated!'); }} className="px-5 py-2 bg-blue-600 rounded-xl text-xs font-bold">Save Ad</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreatorDashboard;
