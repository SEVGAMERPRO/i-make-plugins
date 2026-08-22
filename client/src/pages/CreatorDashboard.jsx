import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Package, Download, DollarSign, Star, Clock, CheckCircle2, AlertCircle, Edit, Trash2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import MinoShieldBadge from '../components/security/MinoShieldBadge';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [plugins, setPlugins] = useState([
    {
      id: 'p-mine-1',
      title: 'Ultimate Economy & Vault Sync',
      game: 'Minecraft',
      version: 'v2.4.0',
      price: '14.99',
      downloads: 482,
      revenue: '7,225.18',
      rating: 4.9,
      status: 'APPROVED',
      updatedAt: '2 days ago'
    },
    {
      id: 'p-fivem-2',
      title: 'Advanced Fuel & Electric Charging System',
      game: 'FiveM',
      version: 'v1.1.2',
      price: '9.99',
      downloads: 128,
      revenue: '1,278.72',
      rating: 4.7,
      status: 'APPROVED',
      updatedAt: '1 week ago'
    },
    {
      id: 'p-bot-3',
      title: 'Discord Ticket & Transcripts Bot',
      game: 'Discord',
      version: 'v1.0.0',
      price: '0.00',
      downloads: 940,
      revenue: '0.00',
      rating: 5.0,
      status: 'APPROVED',
      updatedAt: '3 weeks ago'
    },
    {
      id: 'p-draft-4',
      title: 'Roblox Custom Battle Pass Framework',
      game: 'Roblox',
      version: 'v0.9.0',
      price: '19.99',
      downloads: 0,
      revenue: '0.00',
      rating: 0,
      status: 'PENDING',
      updatedAt: 'Yesterday'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('ALL');

  const totalRevenue = plugins.reduce((acc, p) => acc + parseFloat(p.revenue || 0), 0);
  const totalDownloads = plugins.reduce((acc, p) => acc + p.downloads, 0);

  const filteredPlugins = activeFilter === 'ALL'
    ? plugins
    : plugins.filter(p => p.status === activeFilter);

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Creator Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Creator Dashboard
              </h1>
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                Verified Creator
              </span>
            </div>
            <p className="text-slate-400 text-sm md:text-base">
              Welcome back, <strong className="text-white">{user?.username || 'Creator'}</strong>. Manage your plugins, sales, and analytics.
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Upload New Plugin</span>
          </Link>
        </div>

        {/* Analytics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">Direct creator payouts enabled</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Downloads</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Download className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{totalDownloads.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Across all published plugins</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{plugins.length}</p>
            <p className="text-xs text-slate-400 mt-1">3 Approved, 1 In Review</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Rating</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-400">4.9 / 5.0</p>
            <p className="text-xs text-slate-400 mt-1">Based on 142 customer reviews</p>
          </div>
        </div>

        {/* Plugins Table Section */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Your Plugin Portfolio</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage versions, pricing, and documentation</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5">
              {['ALL', 'APPROVED', 'PENDING', 'DRAFT'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 bg-slate-950/40">
                <tr>
                  <th className="py-3 px-4 font-bold">Plugin</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Downloads</th>
                  <th className="py-3 px-4 font-bold">Revenue</th>
                  <th className="py-3 px-4 font-bold">Security</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredPlugins.map(plugin => (
                  <tr key={plugin.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-bold text-white block">{plugin.title}</span>
                        <span className="text-xs text-slate-400 font-mono">{plugin.version}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs text-slate-200 border border-white/5">
                        {plugin.game}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {parseFloat(plugin.price) === 0 ? 'Free' : `$${plugin.price}`}
                    </td>
                    <td className="py-4 px-4">{plugin.downloads.toLocaleString()}</td>
                    <td className="py-4 px-4 font-bold text-emerald-400">${plugin.revenue}</td>
                    <td className="py-4 px-4">
                      <MinoShieldBadge />
                    </td>
                    <td className="py-4 px-4">
                      {plugin.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : plugin.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> In Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-white/5">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/plugins/${plugin.id}`}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View plugin"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit plugin"
                        >
                          <Edit className="w-4 h-4" />
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
    </div>
  );
};

export default CreatorDashboard;
