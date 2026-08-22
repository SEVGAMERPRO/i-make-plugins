import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileCode, DollarSign, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Image, Terminal, Sparkles, BookOpen } from 'lucide-react';
import MinoShieldBadge from '../components/security/MinoShieldBadge';

const TABS = [
  { id: 'general', label: '1. General Info' },
  { id: 'files', label: '2. Files & Media' },
  { id: 'documentation', label: '3. Documentation' },
  { id: 'pricing', label: '4. Pricing & DRM' },
  { id: 'security', label: '5. MinoShield & Submit' },
];

const UploadPluginPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Minecraft');
  const [summary, setSummary] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [tags, setTags] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  
  // Multi-tab description
  const [overviewDoc, setOverviewDoc] = useState('');
  const [installDoc, setInstallDoc] = useState('');
  const [commandsDoc, setCommandsDoc] = useState('');
  const [configDoc, setConfigDoc] = useState('');

  // Pricing
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState('9.99');
  const [discordRoleId, setDiscordRoleId] = useState('');

  const [scanPassed, setScanPassed] = useState(true);

  const handleSubmit = (status) => {
    setLoading(true);
    setTimeout(() => {
      alert(status === 'PENDING' 
        ? 'Your plugin has been submitted to MinoForge staff for review! You can track its status in your dashboard.' 
        : 'Plugin saved as Draft in your Creator Dashboard!');
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight">Upload New Plugin</h1>
            <p className="text-slate-400 text-sm mt-0.5">Publish your plugin or script to thousands of server operators</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <MinoShieldBadge />
          </div>
        </div>

        {/* Tab Wizard Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${currentTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: General Info */}
        {currentTab === 'general' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Step 1: General Information</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Plugin Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Advanced Economy & Bank Vault System"
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Category / Target Platform *
                </label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['Minecraft', 'Roblox', 'FiveM', 'Discord', 'Websites'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Initial Version *
                </label>
                <input
                  type="text"
                  required
                  placeholder="v1.0.0"
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                One-Sentence Tagline / Summary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. High-performance multi-currency vault system with GUI support and transaction logs."
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Economy, Paper 1.21, Vault, MySQL, GUI"
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentTab('files')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Continue to Files</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Files & Media */}
        {currentTab === 'files' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Step 2: Files & Media Assets</h2>
            
            {/* Binary File Upload Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Main Plugin File (.jar, .zip, .lua, .js) *
              </label>
              <div className="border-2 border-dashed border-white/15 hover:border-blue-500/50 rounded-2xl p-8 text-center bg-slate-950/40 transition-colors cursor-pointer">
                <FileCode className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-white">Drag & drop your plugin archive or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">Supported: .jar, .zip, .lua, .tar.gz (Max 100MB)</p>
                <input
                  type="file"
                  className="hidden"
                  id="plugin-file"
                  onChange={(e) => setFileUrl(e.target.files[0]?.name || '')}
                />
                <label htmlFor="plugin-file" className="inline-block mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer">
                  Choose Local File
                </label>
                {fileUrl && (
                  <p className="text-xs text-emerald-400 font-bold mt-2">Selected: {fileUrl}</p>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Cover Image URL / Banner (Optional)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="https://example.com/cover.png"
                  className="flex-1 bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentTab('general')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentTab('documentation')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Continue to Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Documentation */}
        {currentTab === 'documentation' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-2">Step 3: Multi-Tab Documentation</h2>
            <p className="text-xs text-slate-400 mb-4">
              MinoForge creates structured tabs on your plugin's public page so buyers have everything they need.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overview & Features
              </label>
              <textarea
                rows={4}
                placeholder="Describe all features, compatibility, and key benefits..."
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={overviewDoc}
                onChange={(e) => setOverviewDoc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Installation Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="1. Drop .jar into /plugins&#10;2. Restart server..."
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={installDoc}
                  onChange={(e) => setInstallDoc(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Commands & Permissions
                </label>
                <textarea
                  rows={3}
                  placeholder="/bank open - mino.bank.use&#10;/bank admin - mino.bank.admin"
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  value={commandsDoc}
                  onChange={(e) => setCommandsDoc(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Default config.yml / config.lua sample
              </label>
              <textarea
                rows={4}
                placeholder="# Paste sample configuration code here..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3.5 font-mono text-xs text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={configDoc}
                onChange={(e) => setConfigDoc(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentTab('files')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentTab('pricing')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Continue to Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Pricing & DRM */}
        {currentTab === 'pricing' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Step 4: Pricing & Licensing</h2>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setIsFree(false)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${!isFree ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30' : 'bg-slate-800/60 border-white/10 hover:bg-slate-800'}`}
              >
                <div className="flex items-center gap-2 font-bold text-white text-base mb-1">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Premium Paid Plugin</span>
                </div>
                <p className="text-xs text-slate-400">Earn revenue on every download via instant checkout.</p>
              </div>

              <div 
                onClick={() => setIsFree(true)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${isFree ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30' : 'bg-slate-800/60 border-white/10 hover:bg-slate-800'}`}
              >
                <div className="flex items-center gap-2 font-bold text-white text-base mb-1">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Free Resource</span>
                </div>
                <p className="text-xs text-slate-400">Release freely to gain reputation and downloads.</p>
              </div>
            </div>

            {!isFree && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Price (USD $)
                </label>
                <div className="relative max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                    $
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.99"
                    className="w-full pl-8 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Discord Customer Role ID (Automated Sync)
              </label>
              <p className="text-xs text-slate-500 mb-2">When buyers purchase this plugin, MinoForge bot automatically gives them this role in your server.</p>
              <input
                type="text"
                placeholder="e.g. 109283746592817263"
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={discordRoleId}
                onChange={(e) => setDiscordRoleId(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentTab('documentation')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentTab('security')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Continue to MinoShield Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: MinoShield & Submit */}
        {currentTab === 'security' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Step 5: MinoShield Pre-Scan & Review</h2>
                <p className="text-xs text-slate-400 mt-0.5">Automated bytecode security verification before submission</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-lg border border-emerald-500/30">
                100/100 PASSED
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium">Title:</span>
                <strong className="text-white">{title || 'Untitled Plugin'}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium">Category:</span>
                <strong className="text-blue-400">{game}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium">Version:</span>
                <strong className="font-mono text-white">{version}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium">Pricing:</span>
                <strong className="text-emerald-400">{isFree ? 'Free' : `$${price} USD`}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-white">MinoShield Automated Scan Complete</p>
                <p className="text-slate-300 mt-0.5">No malicious bytecode, token grabbers, or unauthorized socket connections detected.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-white/5">
              <button
                onClick={() => setCurrentTab('pricing')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
              >
                Back
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit('DRAFT')}
                  disabled={loading}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('PENDING')}
                  disabled={loading || !title}
                  className={`px-7 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition-all ${loading || !title ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting...' : 'Submit for Staff Review'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadPluginPage;
