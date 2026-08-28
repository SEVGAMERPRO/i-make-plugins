import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Upload, FileCode, DollarSign, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Image, Terminal, Sparkles, BookOpen, Plus, X, Layers, Lock, LogIn, UserPlus } from 'lucide-react';
import MinoShieldBadge from '../components/security/MinoShieldBadge';
import CanvaBannerModal from '../components/plugins/CanvaBannerModal';
import ReadmeWriterModal from '../components/plugins/ReadmeWriterModal';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'general', label: '1. General Info' },
  { id: 'files', label: '2. Files & Media' },
  { id: 'documentation', label: '3. Documentation' },
  { id: 'pricing', label: '4. Pricing & DRM' },
  { id: 'security', label: '5. MinoShield & Submit' },
];

const UploadPluginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {};

  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [currentTab, setCurrentTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showCanvaModal, setShowCanvaModal] = useState(false);
  const [showReadmeModal, setShowReadmeModal] = useState(false);

  // If not logged in, show authentication required prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Creator Login Required</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              You must be logged in to upload plugins, publish new releases, and earn revenue on MinoForge.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/login?redirect=/upload"
              className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Your Account</span>
            </Link>

            <Link
              to="/register?redirect=/upload"
              className="btn-animated w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Register Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form State initialized from Create Resource modal if available
  const [title, setTitle] = useState(initialData.title || '');
  const [game, setGame] = useState(initialData.category || 'Minecraft');
  const [summary, setSummary] = useState(initialData.summary || '');
  const [version, setVersion] = useState('v1.0.0');
  const [tags, setTags] = useState('');
  // Cover & Screenshots State
  const [coverUrl, setCoverUrl] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [fileUrl, setFileUrl] = useState('');

  // Handle local screenshot image file uploads with Base64 preview
  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshots(prev => [...prev, event.target.result].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = (index) => {
    setScreenshots(prev => prev.filter((_, idx) => idx !== index));
  };
  
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
      const pluginTitle = title || 'Custom Game Plugin';
      if (status === 'PENDING') {
        addNotification({
          title: `Upload Submitted: "${pluginTitle}"`,
          message: `Your plugin was submitted to MinoForge staff for verification. We will notify you once approved!`,
          type: 'pending',
          link: '/dashboard'
        });
      } else {
        addNotification({
          title: `Draft Saved: "${pluginTitle}"`,
          message: `Your plugin draft is saved in your Creator Hub.`,
          type: 'info',
          link: '/dashboard'
        });
      }

      setLoading(false);
      navigate('/dashboard');
    }, 800);
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
            <div>
              <h2 className="text-xl font-bold text-white">Step 2: Files & Plugin Screenshots</h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload your compiled plugin file and real in-game screenshots showing your GUI menus, HUDs, and features.
              </p>
            </div>

            {/* Plugin specific imagery guidance alert */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Showcase your plugin in action:</p>
                <p className="text-slate-400">
                  Instead of generic game category logos, upload real in-game screenshots and UI previews of your plugin so buyers can see exactly what they're getting.
                </p>
              </div>
            </div>
            
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

            {/* Custom Plugin Cover Banner */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Custom Plugin Cover Banner
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="border border-white/10 rounded-2xl p-4 bg-slate-950/50 space-y-3">
                  <p className="text-xs text-slate-400">Upload a custom banner for your plugin:</p>
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-upload"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor="cover-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>Upload Local File</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowCanvaModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-black cursor-pointer transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🎨 Design on Canva with AI</span>
                    </button>
                  </div>
                  
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="h-36 rounded-2xl border border-white/10 bg-slate-950 overflow-hidden relative flex items-center justify-center">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-500 text-xs p-4">
                      <Image className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span>Cover image preview will appear here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* In-Game Screenshots / Showcase Gallery */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  In-Game Plugin Screenshots ({screenshots.length}/5)
                </label>
                <span className="text-[11px] text-slate-500">GUI menus, in-game commands, HUDs</span>
              </div>

              <div className="border border-white/10 rounded-2xl p-4 bg-slate-950/50 space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="screenshots-upload"
                  className="hidden"
                  onChange={handleScreenshotUpload}
                />
                <label
                  htmlFor="screenshots-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add In-Game Screenshots</span>
                </label>

                {screenshots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    {screenshots.map((src, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 h-24 bg-slate-900">
                        <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-md text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No screenshots added yet. Add up to 5 in-game feature screenshots.</p>
                )}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-xl font-bold text-white">Step 3: Multi-Tab Documentation</h2>
                <p className="text-xs text-slate-400 mt-1">
                  MinoForge creates structured tabs on your plugin's public page so buyers have everything they need.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReadmeModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-md self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>📝 Write with AI Docs Generator</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overview &amp; Features
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
                <p className="font-bold text-white">MinoShield Automated Scan Ready</p>
                <p className="text-slate-300 mt-0.5">Automated bytecode decompilation and security checks are enabled.</p>
              </div>
            </div>

            {/* Pre-Submission AI Crash Test Recommendation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-white block">Pre-Submission Sanity Check #1</strong>
                  <span className="text-slate-400">Have error logs or stack traces? Test with AI before staff review.</span>
                </div>
              </div>

              <Link
                to="/crash-analyzer"
                target="_blank"
                className="px-3.5 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Run Crash Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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

        {/* Canva Banner Designer Modal */}
        <CanvaBannerModal
          isOpen={showCanvaModal}
          onClose={() => setShowCanvaModal(false)}
          pluginTitle={title || 'My Plugin'}
          onAcceptBanner={(tpl) => {
            if (tpl) {
              setCoverUrl(tpl.canvaTemplateUrl);
            }
          }}
        />

        {/* AI Readme & Docs Modal */}
        <ReadmeWriterModal
          isOpen={showReadmeModal}
          onClose={() => setShowReadmeModal(false)}
          pluginTitle={title || 'My Plugin'}
          game={game}
        />

      </div>
    </div>
  );
};

export default UploadPluginPage;
