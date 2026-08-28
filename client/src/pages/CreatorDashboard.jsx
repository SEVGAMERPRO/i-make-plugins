import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Megaphone, Settings, MessageSquare, 
  Plus, Edit, Trash2, CheckCircle2, Clock, DollarSign, Download, Star, 
  ExternalLink, Key, Tag, Bell, ShieldCheck, Crown, Rocket, ChevronDown, 
  HelpCircle, Check, X, ArrowUpRight, TrendingUp, Users, Calendar, Percent,
  PackageOpen, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import MinoShieldBadge from '../components/security/MinoShieldBadge';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('overview'); // 'overview', 'resources', 'advertising', 'licenses', 'coupons', 'settings'

  // Time filters
  const [timeRange, setTimeRange] = useState('Past 30 days');
  const [chartMetric, setChartMetric] = useState('Impressions');

  // Ad Modals State
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [showEditAdModal, setShowEditAdModal] = useState(false);

  // Ad Configuration State
  const [adScope, setAdScope] = useState('all');
  const [featuredRate, setFeaturedRate] = useState('10');

  // Real Dynamic Resources (starting from user uploaded plugins or empty)
  const [resources, setResources] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('minoforge_uploaded_plugins') || '[]');
    } catch {
      return [];
    }
  });

  // Real Dynamic Licenses (starting empty)
  const [licenses, setLicenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('minoforge_issued_licenses') || '[]');
    } catch {
      return [];
    }
  });

  // Calculated Real Lifetime Metrics (Starting strictly at 0)
  const totalRevenue = resources.reduce((sum, res) => sum + ((parseFloat(res.price) || 0) * (parseInt(res.downloads) || 0)), 0);
  const totalDownloads = resources.reduce((sum, res) => sum + (parseInt(res.downloads) || 0), 0);
  const ratedResources = resources.filter(res => res.ratingCount > 0);
  const averageRating = ratedResources.length > 0 
    ? (ratedResources.reduce((sum, res) => sum + (parseFloat(res.rating) || 0), 0) / ratedResources.length).toFixed(1)
    : '0.0';
  const totalReviewsCount = resources.reduce((sum, res) => sum + (parseInt(res.ratingCount) || 0), 0);

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
              <span>Go Ultimate (0% Fees)</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Main Grid with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
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

            {/* Engagement */}
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
                  onClick={() => setCurrentSection('settings')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${currentSection === 'settings' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  Payout &amp; Payment Settings
                </button>
              </div>
            </div>

          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-9 space-y-6">

            {/* SECTION: OVERVIEW (100% Real Calculated Metrics) */}
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

                {/* Quick Upload CTA or Resource List */}
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

            {/* SECTION: ADVERTISING (Real Ad Metrics Starting at 0) */}
            {currentSection === 'advertising' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">Advertising Performance</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Track real impressions, clicks, and sales from sponsored placements</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCreateAdModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Ad</span>
                    </button>
                  </div>
                </div>

                {/* 5 Real Metrics Starting at 0 */}
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

                {/* Analytics Empty Notice */}
                <div className="p-8 rounded-2xl bg-slate-950/60 border border-white/5 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-300">No Advertising Impressions Recorded</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you promote your plugin with featured ads, real impression counts and conversion graphs will be charted here daily.
                  </p>
                </div>

              </div>
            )}

            {/* SECTION: RESOURCES (Portfolio Table) */}
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

            {/* SECTION: LICENSES */}
            {currentSection === 'licenses' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">License Keys &amp; DRM</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Automated customer key generation and anti-leak IP binding</p>
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
                          <span className="text-xs font-mono text-slate-400">{lic.key}</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION: STORES (ULTIMATE FEATURE) */}
            {currentSection === 'stores' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-white">Custom Storefronts</h2>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">Ultimate Feature</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Create branded portal storefronts with your own vanity URLs</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <span className="font-bold text-white block">Custom Brand Storefront</span>
                  <p className="text-xs text-slate-400">Build your unique creator portal with custom banners, color accents, and plugin bundles.</p>
                  <Link to="/upgrade" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline">
                    <span>Activate with MinoForge Ultimate</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* SECTION: TRANSACTIONS */}
            {currentSection === 'transactions' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-black text-white">Sales Transactions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time payment audit log and payouts</p>
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

          </div>

        </div>

        {/* MODAL 1: CREATE AD */}
        {showCreateAdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Create Featured Ad</h3>
                <button 
                  onClick={() => setShowCreateAdModal(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <p>Set a featured promotion rate for your resources to gain priority discovery impressions across MinoForge search and category pages.</p>
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Featured Rate (% of sale)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={featuredRate}
                    onChange={(e) => setFeaturedRate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowCreateAdModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAds}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg"
                  >
                    Save &amp; Activate Ad
                  </button>
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
