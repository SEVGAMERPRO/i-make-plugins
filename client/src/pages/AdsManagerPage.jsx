import React, { useState } from 'react';
import { Megaphone, DollarSign, Eye, MousePointer, Plus, ArrowUpRight, CheckCircle2, Crown, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SAMPLE_CAMPAIGNS = [
  {
    id: 'ad-1',
    pluginTitle: 'Ultimate Economy & Vault System',
    game: 'Minecraft',
    placement: 'Top Search & Homepage Spotlight',
    dailyBudget: 2.50,
    spent: 8.75,
    impressions: 4280,
    clicks: 342,
    ctr: '7.99%',
    status: 'ACTIVE'
  },
  {
    id: 'ad-2',
    pluginTitle: 'Advanced Fuel & Electric Charging',
    game: 'FiveM',
    placement: 'FiveM Category Header Ad',
    dailyBudget: 1.50,
    spent: 4.50,
    impressions: 1950,
    clicks: 184,
    ctr: '9.43%',
    status: 'ACTIVE'
  }
];

const AdsManagerPage = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState(SAMPLE_CAMPAIGNS);
  const [modalOpen, setModalOpen] = useState(false);
  const [adCredits, setAdCredits] = useState(5.00); // From Ultimate plan

  // New Ad Form State
  const [selectedPlugin, setSelectedPlugin] = useState('Ultimate Economy & Vault System');
  const [placement, setPlacement] = useState('Search Top & Homepage Spotlight');
  const [budget, setBudget] = useState('2.00');

  const handleCreateAd = (e) => {
    e.preventDefault();
    const newCamp = {
      id: `ad-${Date.now()}`,
      pluginTitle: selectedPlugin,
      game: 'Minecraft',
      placement,
      dailyBudget: parseFloat(budget),
      spent: 0.00,
      impressions: 0,
      clicks: 0,
      ctr: '0.00%',
      status: 'ACTIVE'
    };

    setCampaigns([newCamp, ...campaigns]);
    setModalOpen(false);
    alert('🎉 Your sponsored ad is now live! It will appear upfront in search results and on the homepage spotlight.');
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 rounded-full text-xs font-bold text-amber-300 border border-amber-500/30 mb-3">
              <Megaphone className="w-3.5 h-3.5" />
              <span>MinoForge Sponsored Ads & Promoted Listings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Plugin Advertising Manager
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Feature your plugins upfront in top search results, game categories, and the homepage spotlight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>Launch New Ad Campaign</span>
            </button>
          </div>
        </div>

        {/* Ad Balance & KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Ad Credits</span>
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400">${adCredits.toFixed(2)}</p>
            <p className="text-xs text-emerald-400 font-semibold mt-1">+$5.00 monthly Ultimate credit</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Ad Impressions</span>
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white">6,230</p>
            <p className="text-xs text-slate-400 mt-1">Upfront in search & categories</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Ad Clicks</span>
              <MousePointer className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">526</p>
            <p className="text-xs text-slate-400 mt-1">Direct buyer conversions</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average CTR</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-purple-400">8.44%</p>
            <p className="text-xs text-slate-400 mt-1">Industry leading performance</p>
          </div>
        </div>

        {/* Active Campaigns Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Your Promoted Listings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage daily budgets, target placements, and analytics</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 bg-slate-950/40">
                <tr>
                  <th className="py-3 px-4 font-bold">Promoted Plugin</th>
                  <th className="py-3 px-4 font-bold">Placement</th>
                  <th className="py-3 px-4 font-bold">Daily Budget</th>
                  <th className="py-3 px-4 font-bold">Impressions</th>
                  <th className="py-3 px-4 font-bold">Clicks</th>
                  <th className="py-3 px-4 font-bold">CTR</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {campaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                        AD
                      </span>
                      <span>{camp.pluginTitle}</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300">{camp.placement}</td>
                    <td className="py-4 px-4 font-bold text-emerald-400">${camp.dailyBudget.toFixed(2)}/day</td>
                    <td className="py-4 px-4">{camp.impressions.toLocaleString()}</td>
                    <td className="py-4 px-4 font-bold text-white">{camp.clicks}</td>
                    <td className="py-4 px-4 text-purple-400 font-bold">{camp.ctr}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Campaign Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative text-white space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Promote a Plugin (Create Ad)</h3>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAd} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Select Plugin to Boost
                  </label>
                  <select
                    value={selectedPlugin}
                    onChange={(e) => setSelectedPlugin(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Ultimate Economy & Vault System">Ultimate Economy & Vault System (Minecraft)</option>
                    <option value="Advanced Fuel & Electric Charging">Advanced Fuel & Electric Charging (FiveM)</option>
                    <option value="Discord Ticket & Transcripts Bot">Discord Ticket & Transcripts Bot (Discord)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Ad Placement Type
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Search Top & Homepage Spotlight">Top Search Slot + Homepage Spotlight (Max Clicks)</option>
                    <option value="Category Header Spotlight">Category Header Spotlight Only</option>
                    <option value="Related Plugins Sidebar">Related Plugins Sidebar Recommendation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Daily Budget ($ USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                      $
                    </div>
                    <input
                      type="number"
                      step="0.50"
                      min="1.00"
                      required
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    Your $5.00 Free Ultimate Ad Credit will be applied automatically!
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20"
                  >
                    Start Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdsManagerPage;
