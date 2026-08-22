import React, { useState } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Megaphone, Settings, MessageSquare, 
  Plus, Edit, Trash2, CheckCircle2, Clock, DollarSign, Download, Star, 
  ExternalLink, Key, Tag, Bell, ShieldCheck, Crown, Rocket, ChevronDown, 
  HelpCircle, Check, X, ArrowUpRight, TrendingUp, Users, Calendar, Percent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import MinoShieldBadge from '../components/security/MinoShieldBadge';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('advertising'); // 'overview', 'resources', 'advertising', 'licenses', 'coupons', 'settings'

  // Time filters
  const [timeRange, setTimeRange] = useState('Past 30 days');
  const [chartMetric, setChartMetric] = useState('Impressions');

  // Ad Modals State
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [showEditAdModal, setShowEditAdModal] = useState(false);

  // Ad Configuration State (BuiltByBit style featured rate system)
  const [adScope, setAdScope] = useState('all'); // 'all' or 'selected'
  const [manualRate, setManualRate] = useState(true);
  const [featuredRate, setFeaturedRate] = useState('10'); // % of sale
  const [selectedResourcesForAd, setSelectedResourcesForAd] = useState(['p-1', 'p-2']);

  // Sample Resources
  const [resources, setResources] = useState([
    {
      id: 'p-1',
      title: 'Ultimate Economy & Vault System',
      game: 'Minecraft',
      version: 'v2.4.0',
      price: '14.99',
      downloads: 482,
      revenue: '7,225.18',
      rating: 4.9,
      status: 'APPROVED',
      hasActiveAd: true,
      featuredRate: 10,
      updatedAt: '2 days ago'
    },
    {
      id: 'p-2',
      title: 'Advanced Fuel & Electric Charging System',
      game: 'FiveM',
      version: 'v1.1.2',
      price: '9.99',
      downloads: 128,
      revenue: '1,278.72',
      rating: 4.7,
      status: 'APPROVED',
      hasActiveAd: true,
      featuredRate: 8,
      updatedAt: '1 week ago'
    },
    {
      id: 'p-3',
      title: 'Discord Ticket & Transcripts Bot',
      game: 'Discord',
      version: 'v1.0.0',
      price: '0.00',
      downloads: 940,
      revenue: '0.00',
      rating: 5.0,
      status: 'APPROVED',
      hasActiveAd: false,
      featuredRate: 0,
      updatedAt: '3 weeks ago'
    }
  ]);

  // Chart Data Points (Simulating BuiltByBit date progression)
  const chartPoints = [
    { date: 'Jul 23', val: 2 },
    { date: 'Jul 24', val: 8 },
    { date: 'Jul 25', val: 5 },
    { date: 'Jul 26', val: 5 },
    { date: 'Jul 27', val: 1 },
    { date: 'Jul 28', val: 0 },
    { date: 'Jul 29', val: 0 },
    { date: 'Jul 31', val: 0 },
    { date: 'Aug 4', val: 0 },
    { date: 'Aug 8', val: 0 },
    { date: 'Aug 12', val: 0 },
    { date: 'Aug 16', val: 0 },
    { date: 'Aug 20', val: 0 },
  ];

  const handleSaveAds = () => {
    alert(`🎉 Advertising updated! Featured rate set to ${featuredRate}%. Your resources will receive priority spotlight impressions across MinoForge.`);
    setShowCreateAdModal(false);
    setShowEditAdModal(false);
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
            <span className="text-blue-400 font-semibold capitalize">{currentSection}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/upgrade" 
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 font-bold rounded-lg border border-amber-500/30 hover:brightness-110 transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Ultimate Active (0% Fees)</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Main Grid with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Exact BuiltByBit Sidebar Navigation */}
          <div className="lg:col-span-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl space-y-6">
            
            {/* Analytics */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Analytics
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('overview')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'overview' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setCurrentSection('product-analytics')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'product-analytics' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Product analytics
                </button>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Products
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('resources')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${currentSection === 'resources' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Resources</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{resources.length}</span>
                </button>
                <button
                  onClick={() => setCurrentSection('bundles')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'bundles' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Bundles
                </button>
              </div>
            </div>

            {/* Purchases */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Purchases
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('transactions')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'transactions' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setCurrentSection('licenses')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'licenses' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Licenses
                </button>
              </div>
            </div>

            {/* Engagement (BuiltByBit Exact) */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Engagement
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('advertising')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${currentSection === 'advertising' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Advertising</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">PRO</span>
                </button>
                <button
                  onClick={() => setCurrentSection('sale-events')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'sale-events' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Sale events
                </button>
                <button
                  onClick={() => setCurrentSection('referrals')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'referrals' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Referrals
                </button>
                <button
                  onClick={() => setCurrentSection('invite-a-creator')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'invite-a-creator' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Invite a creator
                </button>
                <button
                  onClick={() => setCurrentSection('coupon-codes')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'coupon-codes' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Coupon codes
                </button>
                <button
                  onClick={() => setCurrentSection('stores')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${currentSection === 'stores' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Stores</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    <Rocket className="w-2.5 h-2.5" /> Ultimate
                  </span>
                </button>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Settings
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('wallet')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'wallet' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Tebex / Stripe wallet
                </button>
                <button
                  onClick={() => setCurrentSection('discord-bot')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'discord-bot' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Discord bot sync
                </button>
                <button
                  onClick={() => setCurrentSection('placeholders')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'placeholders' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Placeholders
                </button>
                <button
                  onClick={() => setCurrentSection('webhooks')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'webhooks' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Webhooks
                </button>
                <button
                  onClick={() => setCurrentSection('api-tokens')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'api-tokens' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  API Tokens
                </button>
              </div>
            </div>

            {/* Communication */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2 px-3">
                Communication
              </h3>
              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => setCurrentSection('copyright-claims')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'copyright-claims' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Copyright claims
                </button>
                <button
                  onClick={() => setCurrentSection('resolution-center')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'resolution-center' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Resolution center
                </button>
              </div>
            </div>

          </div>

          {/* Main Dashboard Content Area */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* SECTION 1: ADVERTISING (Exact replica of Image 1) */}
            {currentSection === 'advertising' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in">
                
                {/* Header with Edit & Create Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-black text-white">Advertising</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Promote your resources across premium search & spotlight placements</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowEditAdModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit existing ads</span>
                    </button>

                    <button
                      onClick={() => setShowCreateAdModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create ad</span>
                    </button>
                  </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center justify-between text-xs">
                  <div className="relative">
                    <button className="flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300">
                      <span>{timeRange}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Top 5 Metrics (BuiltByBit Exact Stats) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">21</span>
                      <span className="text-xs font-bold text-red-400">-81%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Impressions past 30 days</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">0</span>
                      <span className="text-xs font-bold text-red-400">-100%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Purchases past 30 days</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">$0.00</span>
                      <span className="text-xs font-bold text-red-400">-100%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Revenue past 30 days</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">$0.00</span>
                      <span className="text-xs font-bold text-red-400">-100%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Ad fees paid past 30 days</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">$0.00</span>
                      <span className="text-xs font-bold text-red-400">-100%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Gross profit past 30 days</p>
                  </div>
                </div>

                {/* Interactive SVG Impressions Graph */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">Daily</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="flex items-center gap-1 font-bold text-blue-400">
                      <span>Analytics</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="bg-slate-950/70 p-6 rounded-2xl border border-white/5 relative overflow-hidden h-72 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    
                    {/* Y-axis labels & grid */}
                    <div className="flex-1 flex flex-col justify-between relative z-10 text-[10px] text-slate-500 font-mono">
                      <div className="border-b border-white/5 pb-1 flex justify-between"><span>8</span></div>
                      <div className="border-b border-white/5 pb-1 flex justify-between"><span>6</span></div>
                      <div className="border-b border-white/5 pb-1 flex justify-between"><span>4</span></div>
                      <div className="border-b border-white/5 pb-1 flex justify-between"><span>2</span></div>
                      <div className="border-b border-white/5 pb-1 flex justify-between"><span>0</span></div>
                    </div>

                    {/* SVG Line Graph */}
                    <div className="absolute inset-x-8 inset-y-6 flex items-end">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Line Path */}
                        <path
                          d="M 0,75 L 8,0 L 16,37.5 L 24,37.5 L 32,87.5 L 40,100 L 48,100 L 56,100 L 64,100 L 72,100 L 80,100 L 88,100 L 100,100"
                          fill="none"
                          stroke="#2196F3"
                          strokeWidth="2.5"
                          className="drop-shadow-lg"
                        />
                        {/* Points */}
                        {[
                          { cx: 0, cy: 75, val: 2 },
                          { cx: 8, cy: 0, val: 8 },
                          { cx: 16, cy: 37.5, val: 5 },
                          { cx: 24, cy: 37.5, val: 5 },
                          { cx: 32, cy: 87.5, val: 1 },
                          { cx: 40, cy: 100, val: 0 },
                          { cx: 48, cy: 100, val: 0 },
                          { cx: 56, cy: 100, val: 0 },
                          { cx: 64, cy: 100, val: 0 },
                          { cx: 72, cy: 100, val: 0 },
                          { cx: 80, cy: 100, val: 0 },
                          { cx: 88, cy: 100, val: 0 },
                          { cx: 100, cy: 100, val: 0 },
                        ].map((pt, i) => (
                          <circle key={i} cx={pt.cx} cy={pt.cy} r="3" fill="#2196F3" className="hover:scale-150 transition-transform cursor-pointer" />
                        ))}
                      </svg>
                    </div>

                    {/* X-axis date labels */}
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-white/5 relative z-10">
                      <span>Jul 23, 2026</span>
                      <span>Jul 27, 2026</span>
                      <span>Jul 31, 2026</span>
                      <span>Aug 4, 2026</span>
                      <span>Aug 8, 2026</span>
                      <span>Aug 12, 2026</span>
                      <span>Aug 16, 2026</span>
                      <span>Aug 20, 2026</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2196F3]" />
                    <span>Impressions</span>
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 2: RESOURCES (Portfolio Table) */}
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

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 bg-slate-950/40">
                      <tr>
                        <th className="py-3 px-4 font-bold">Resource</th>
                        <th className="py-3 px-4 font-bold">Category</th>
                        <th className="py-3 px-4 font-bold">Price</th>
                        <th className="py-3 px-4 font-bold">Featured Ad</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {resources.map(res => (
                        <tr key={res.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-bold text-white block">{res.title}</span>
                              <span className="text-xs text-slate-400 font-mono">{res.version}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-200">{res.game}</span>
                          </td>
                          <td className="py-4 px-4 font-bold text-white">${res.price}</td>
                          <td className="py-4 px-4">
                            {res.hasActiveAd ? (
                              <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                                {res.featuredRate}% Rate
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">None</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link to={`/plugins/${res.id}`} className="text-xs font-bold text-blue-400 hover:underline">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 3: LICENSES & DRM */}
            {currentSection === 'licenses' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">License Keys & DRM</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Automated customer key generation and anti-leak IP binding</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block text-sm">MinecraftServer_Network</span>
                      <span className="text-xs font-mono text-slate-400">KEY-9281-MINE-ECO-8821 (Ultimate Economy)</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block text-sm">FiveM_LosSantosRP</span>
                      <span className="text-xs font-mono text-slate-400">KEY-1049-FIVEM-FUEL-3920 (Advanced Fuel)</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: STORES (ULTIMATE FEATURE) */}
            {currentSection === 'stores' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-white">Custom Storefronts</h2>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">2 of 2 Available</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Create branded portal storefronts with your own vanity URLs</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Primary Creator Storefront</span>
                    <span className="text-xs text-emerald-400 font-bold">colasmp.net/@yourbrand</span>
                  </div>
                  <p className="text-xs text-slate-400">Custom header banner, theme colors, and curated plugin bundles enabled.</p>
                </div>
              </div>
            )}

            {/* SECTION 5: OVERVIEW */}
            {currentSection === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
                    <span className="text-xs font-bold uppercase text-slate-400">Lifetime Revenue</span>
                    <p className="text-3xl font-black text-emerald-400 mt-2">$8,503.90</p>
                    <p className="text-xs text-slate-400 mt-1">0% Commission with Ultimate</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
                    <span className="text-xs font-bold uppercase text-slate-400">Total Downloads</span>
                    <p className="text-3xl font-black text-white mt-2">1,550</p>
                    <p className="text-xs text-slate-400 mt-1">Across 3 plugins</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
                    <span className="text-xs font-bold uppercase text-slate-400">Customer Rating</span>
                    <p className="text-3xl font-black text-amber-400 mt-2">4.9 / 5.0</p>
                    <p className="text-xs text-slate-400 mt-1">100% positive reviews</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* MODAL 1: CREATE AD (Exact Replica of Image 3) */}
        {showCreateAdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Create ad</h3>
                <button 
                  onClick={() => setShowCreateAdModal(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
                <div className="md:col-span-4 font-bold text-slate-300">
                  Feature your resource:
                </div>
                <div className="md:col-span-8 space-y-4 text-slate-300 leading-relaxed">
                  <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                    <li>Set your featured rate as a percentage of your resource's final price - higher rates get more impressions</li>
                    <li>Your resource will be promoted in premium ad positions across MinoForge</li>
                    <li>Only pay the fee on sales you receive through the featured resource. Cancel at any time to pay nothing</li>
                  </ol>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="adScopeCreate" 
                        checked={adScope === 'all'} 
                        onChange={() => setAdScope('all')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>All of my eligible resources without an active ad</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="adScopeCreate" 
                        checked={adScope === 'selected'} 
                        onChange={() => setAdScope('selected')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Only these selected resources</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={manualRate} 
                        onChange={(e) => setManualRate(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-white">Manually set a featured rate for all resources I select</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1 pl-6">
                      You may adjust featured rates on a per-resource basis at any time.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="font-bold text-white">Featured rate:</span>
                    <div className="flex items-center gap-1 bg-slate-800 border border-white/10 rounded-lg px-2 py-1">
                      <input 
                        type="number" 
                        min="1" 
                        max="50"
                        value={featuredRate} 
                        onChange={(e) => setFeaturedRate(e.target.value)}
                        className="w-12 bg-transparent text-white font-bold text-center outline-none"
                      />
                      <span className="text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={handleSaveAds}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT EXISTING ADS (Exact Replica of Image 2) */}
        {showEditAdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Edit existing ads</h3>
                <button 
                  onClick={() => setShowEditAdModal(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
                <div className="md:col-span-4 font-bold text-slate-300">
                  Feature your resource:
                </div>
                <div className="md:col-span-8 space-y-4 text-slate-300 leading-relaxed">
                  <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                    <li>Set your featured rate as a percentage of your resource's final price - higher rates get more impressions</li>
                    <li>Your resource will be promoted in premium ad positions across MinoForge</li>
                    <li>Only pay the fee on sales you receive through the featured resource. Cancel at any time to pay nothing</li>
                  </ol>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="adScopeEdit" 
                        checked={adScope === 'all'} 
                        onChange={() => setAdScope('all')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>All of my resources with an active ad</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="adScopeEdit" 
                        checked={adScope === 'selected'} 
                        onChange={() => setAdScope('selected')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Only these selected resources</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={manualRate} 
                        onChange={(e) => setManualRate(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-white">Manually set a featured rate for all resources I select</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1 pl-6">
                      You may adjust featured rates on a per-resource basis at any time.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="font-bold text-white">Featured rate:</span>
                    <div className="flex items-center gap-1 bg-slate-800 border border-white/10 rounded-lg px-2 py-1">
                      <input 
                        type="number" 
                        min="1" 
                        max="50"
                        value={featuredRate} 
                        onChange={(e) => setFeaturedRate(e.target.value)}
                        className="w-12 bg-transparent text-white font-bold text-center outline-none"
                      />
                      <span className="text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={handleSaveAds}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreatorDashboard;
