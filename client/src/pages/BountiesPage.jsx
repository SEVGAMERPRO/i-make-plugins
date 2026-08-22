import React, { useState } from 'react';
import { Briefcase, DollarSign, Clock, MessageSquare, Plus, CheckCircle2, ShieldCheck, Filter, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SAMPLE_BOUNTIES = [
  {
    id: 'b-1',
    title: 'Custom FiveM Underground Street Racing & Betting Script',
    author: 'LosSantosRP_Admin',
    game: 'FiveM',
    budget: 250,
    currency: 'USD',
    deadline: '7 days',
    proposalsCount: 4,
    description: 'Looking for a skilled Lua developer to build an underground street race script with custom UI, vehicle wager escrow, checkpoint creator, and police notification alerts.',
    tags: ['QBCore', 'Lua', 'Custom UI', 'Vehicles'],
    status: 'OPEN',
    createdAt: '2 hours ago'
  },
  {
    id: 'b-2',
    title: 'Minecraft RPG Dungeon Boss & Custom Loot System',
    author: 'MysticRealm',
    game: 'Minecraft',
    budget: 450,
    currency: 'USD',
    deadline: '14 days',
    proposalsCount: 6,
    description: 'Need a Spigot/Paper 1.21 plugin that spawns instanced dungeon boss fights with custom mythic mob skills, phase transitions, and tiered rewards.',
    tags: ['Paper 1.21', 'MythicMobs', 'Java', 'Dungeons'],
    status: 'OPEN',
    createdAt: '5 hours ago'
  },
  {
    id: 'b-3',
    title: 'Discord Verification Bot with Minecraft & FiveM Whitelist Sync',
    author: 'NexusCommunity',
    game: 'Discord',
    budget: 150,
    currency: 'USD',
    deadline: '3 days',
    proposalsCount: 8,
    description: 'Need a Node.js / Python Discord bot that links Discord accounts with server databases to automatically assign roles and manage whitelist access.',
    tags: ['Discord.js', 'MySQL', 'OAuth2', 'Bot'],
    status: 'OPEN',
    createdAt: '1 day ago'
  },
  {
    id: 'b-4',
    title: 'Roblox Custom Inventory & Trading UI Framework',
    author: 'BloxKingdom',
    game: 'Roblox',
    budget: 300,
    currency: 'USD',
    deadline: '5 days',
    proposalsCount: 3,
    description: 'Require a sleek, smooth 60fps inventory and secure P2P trading system for Roblox Studio with anti-dupe protection and animations.',
    tags: ['Roblox Studio', 'LuaU', 'Anti-Dupe', 'UI'],
    status: 'OPEN',
    createdAt: '1 day ago'
  }
];

const BountiesPage = () => {
  const { user } = useAuth();
  const [bounties, setBounties] = useState(SAMPLE_BOUNTIES);
  const [selectedGame, setSelectedGame] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [proposalModal, setProposalModal] = useState(null);

  // New Bounty Form State
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Minecraft');
  const [budget, setBudget] = useState(100);
  const [deadline, setDeadline] = useState('7 days');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleCreateBounty = (e) => {
    e.preventDefault();
    const newBounty = {
      id: `b-${Date.now()}`,
      title,
      author: user?.username || 'ServerOwner',
      game,
      budget: parseFloat(budget),
      currency: 'USD',
      deadline,
      proposalsCount: 0,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'OPEN',
      createdAt: 'Just now'
    };

    setBounties([newBounty, ...bounties]);
    setModalOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setTags('');
  };

  const filteredBounties = selectedGame === 'All' 
    ? bounties 
    : bounties.filter(b => b.game.toLowerCase() === selectedGame.toLowerCase());

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 rounded-full text-xs font-bold text-blue-400 border border-blue-500/20 mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Escrow Protected Freelance Board</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Plugin Requests & Bounties
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Hire verified developers for custom server plugins or earn money completing bounties.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Post a Plugin Request</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Filter:
          </span>
          {['All', 'Minecraft', 'FiveM', 'Roblox', 'Discord', 'Websites'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedGame(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedGame === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bounties List */}
        <div className="space-y-4">
          {filteredBounties.map(bounty => (
            <div 
              key={bounty.id}
              className="bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 p-6 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                    {bounty.game}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {bounty.createdAt}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    by <strong className="text-slate-300">{bounty.author}</strong>
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-extrabold text-white hover:text-blue-300 transition-colors">
                  {bounty.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                  {bounty.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {bounty.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Budget & Action Box */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 flex-shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 font-semibold block">Escrow Budget</span>
                  <span className="text-2xl md:text-3xl font-black text-emerald-400">
                    ${bounty.budget}
                  </span>
                </div>

                <button
                  onClick={() => setProposalModal(bounty)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-blue-600 text-white font-bold rounded-xl text-xs md:text-sm border border-white/10 hover:border-transparent transition-all shadow-md flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Bid ({bounty.proposalsCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Post Bounty Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Post a Plugin Request</h3>
                  <p className="text-xs text-slate-400">Funds are held in MinoForge escrow until work is delivered</p>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBounty} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Request Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Custom FiveM Police MDT & Dispatch System"
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Platform / Game
                    </label>
                    <select
                      value={game}
                      onChange={(e) => setGame(e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {['Minecraft', 'FiveM', 'Roblox', 'Discord', 'Websites'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Budget (USD $)
                    </label>
                    <input
                      type="number"
                      required
                      min="20"
                      className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Detailed Specifications & Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the exact commands, features, and dependencies required..."
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paper, MySQL, Custom UI"
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400"
                  >
                    Publish Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submit Bid / Proposal Modal */}
        {proposalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Submit Developer Proposal</h3>
                  <p className="text-xs text-slate-400 truncate max-w-xs">{proposalModal.title}</p>
                </div>
                <button 
                  onClick={() => setProposalModal(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                  You are bidding on a <strong>${proposalModal.budget} USD</strong> bounty for <strong>{proposalModal.game}</strong>.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Bid Amount (USD $)
                  </label>
                  <input
                    type="number"
                    defaultValue={proposalModal.budget}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Estimated Completion Time
                  </label>
                  <input
                    type="text"
                    defaultValue="4 days"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Cover Letter & Portfolio Links
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your previous work and how you plan to implement this..."
                    className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setProposalModal(null)}
                    className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert('Your proposal has been submitted to the server owner!');
                      setProposalModal(null);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400"
                  >
                    Submit Proposal
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

export default BountiesPage;
