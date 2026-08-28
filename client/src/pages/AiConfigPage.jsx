import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Copy, Check, Download, RefreshCw, Code, CheckCircle, Terminal, 
  HelpCircle, ArrowRight, Sliders, Layers, FileText, Bot, Crown, Rocket,
  Flame, Skull, Zap, Shield, Swords, Coins, Heart, MessageSquare, Lock, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const INSPIRATION_TAGS = [
  { label: '🧟 Zombie Apocalypse & Cure', game: 'Minecraft', icon: Skull, prompt: 'Create a zombie apocalypse infection plugin with hazmat suits, cure syringes, blood moon horde nights, and safe zones.' },
  { label: '⚔️ Custom Enchants & Lifesteal', game: 'Minecraft', icon: Swords, prompt: 'Create a custom enchantments plugin with Lifesteal, Lightning Strike, Telepathy, and Auto-Smelt.' },
  { label: '👑 Mythic Boss Fights & Raids', game: 'Minecraft', icon: Flame, prompt: 'Create an Infernal Dragon Boss fight with 2 rage phases, meteor attacks, dynamic boss bar, and custom mythic drop tables.' },
  { label: '🛡️ RPG Stats, Skills & Mana', game: 'Minecraft', icon: Shield, prompt: 'Create an RPG skills & stats system with Strength, Agility, Defense, Intelligence, mana regeneration, and Berserker / Paladin skill trees.' },
  { label: '🏆 BattlePass Season 1 (50 Tiers)', game: 'Minecraft', icon: Crown, prompt: 'Generate a BattlePass season config with 50 tiers, free & premium reward tracks, daily quests, and XP boosters.' },
  { label: '💰 Multi-Currency & Banking Vault', game: 'Minecraft', icon: Coins, prompt: 'Create a multi-currency economy system with Coins, Gems, ATM banking GUI, 4-digit PINs, and compound daily interest.' },
  { label: '🚗 FiveM Drugs & Gang Territory', game: 'FiveM', icon: Zap, prompt: 'Generate a FiveM drug processing laboratory and gang turf territory war config with police alert chances and ox_target zones.' },
  { label: '🤖 Discord Leveling & Rank Cards', game: 'Discord', icon: MessageSquare, prompt: 'Generate a Discord XP leveling and voice chat tracking bot config with role rewards and custom rank cards.' }
];

const AiConfigPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState('Minecraft');
  const [format, setFormat] = useState('YAML');
  const [prompt, setPrompt] = useState('');
  
  // Starts 100% blank
  const [output, setOutput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generationSource, setGenerationSource] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Daily Free Quota vs Paid Ultimate
  const [remainingGenerations, setRemainingGenerations] = useState(() => {
    try {
      const saved = localStorage.getItem('minoforge_config_quota_today');
      if (saved !== null) return parseInt(saved);
      return 2; // 2 free trial generations per day for free users
    } catch {
      return 2;
    }
  });

  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const isUltimate = user?.role === 'ADMIN' || user?.isUltimate || false;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // If free user has exhausted daily quota, show paywall modal
    if (!isUltimate && remainingGenerations <= 0) {
      setShowPaywallModal(true);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setGenerationSource('');

    try {
      // Backend automatically uses your Gemini API key
      const res = await axios.post('/api/ai/generate-config', {
        prompt: prompt.trim(),
        game: selectedGame,
        format: format.toLowerCase()
      });

      if (res.data && res.data.config) {
        setOutput(res.data.config);
        setGenerationSource('Gemini Pro Engine');

        // Deduct trial quota for free users
        if (!isUltimate) {
          const updated = Math.max(0, remainingGenerations - 1);
          setRemainingGenerations(updated);
          localStorage.setItem('minoforge_config_quota_today', updated.toString());
        }
      } else {
        throw new Error('No configuration generated');
      }
    } catch (err) {
      console.warn('Config generation error:', err);
      setErrorMsg('Failed to generate configuration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedGame(tag.game);
    setPrompt(tag.prompt);
    if (tag.game === 'FiveM') setFormat('Lua');
    else if (tag.game === 'Discord') setFormat('JSON');
    else setFormat('YAML');
  };

  const downloadConfig = () => {
    if (!output) return;
    const ext = format === 'Lua' ? 'lua' : format === 'JSON' ? 'json' : format === 'TOML' ? 'toml' : 'yml';
    const filename = `config-${selectedGame.toLowerCase()}.${ext}`;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Config Generator</h1>
                <p className="text-xs text-slate-400">Generates unique, production-ready configurations tailored to any plugin idea.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            {isUltimate ? (
              <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-black rounded-xl border border-amber-500/30 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Unlimited Ultimate Generations</span>
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-white/10">
                  Free Quota: <strong className="text-cyan-300">{remainingGenerations} / 2</strong> left today
                </span>
                <Link
                  to="/upgrade"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Get Unlimited ($19.99/mo)</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Inspiration Tags */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block px-1">
            ⚡ Quick Plugin Presets &amp; Concepts (Click to try)
          </span>
          <div className="flex flex-wrap gap-2">
            {INSPIRATION_TAGS.map((tag, idx) => {
              const Icon = tag.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleTagClick(tag)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-blue-600/20 border border-white/10 hover:border-cyan-400/50 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-5 shadow-xl">
              
              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Target Platform / Engine
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Minecraft', 'FiveM', 'Discord'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGame(g);
                        if (g === 'FiveM') setFormat('Lua');
                        else if (g === 'Discord') setFormat('JSON');
                        else setFormat('YAML');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedGame === g
                          ? 'bg-blue-600/30 border-cyan-400 text-cyan-300 shadow-md'
                          : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Output Format
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['YAML', 'JSON', 'Lua', 'TOML'].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        format === fmt
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      .{fmt.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Describe Your Plugin / Configuration Needs
                </label>
                <textarea
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your plugin mechanics in detail (e.g. A zombie infection plugin with hazmat suits, cure syringe recipes, blood moon horde multipliers, and safe zones)..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Custom Config...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Configuration</span>
                  </>
                )}
              </button>

              {errorMsg && (
                <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300 text-center font-bold">
                  {errorMsg}
                </div>
              )}

            </div>

          </div>

          {/* Right Code Output */}
          <div className="lg:col-span-7 space-y-3">
            
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase text-slate-300">Generated Code Output</span>
                {generationSource && (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-md">
                    ✓ {generationSource}
                  </span>
                )}
              </div>

              {output && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(output);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={downloadConfig}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .{format.toLowerCase()}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Code Output Screen */}
            <div className="rounded-3xl bg-slate-950 border border-white/10 p-6 min-h-[540px] shadow-2xl relative flex flex-col justify-center">
              {output ? (
                <pre className="font-mono text-xs text-cyan-200 leading-relaxed overflow-x-auto whitespace-pre select-all h-full max-h-[600px] overflow-y-auto">
                  {output}
                </pre>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 mx-auto flex items-center justify-center text-slate-600">
                    <Terminal className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-300">Ready to Generate Config</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Enter your requirements or pick one of the quick plugin presets above, then click <strong>"Generate Configuration"</strong>.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* PAYWALL UPGRADE MODAL */}
        {showPaywallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-white space-y-6 text-center">
              <button 
                onClick={() => setShowPaywallModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              >
                ✕
              </button>

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
                  <Crown className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-white">Daily Quota Reached</h3>
                <p className="text-xs text-slate-300">
                  You have used all <strong>2 free trial generations</strong> for today.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-left text-xs space-y-2.5">
                <span className="font-black uppercase tracking-wider text-amber-400 block">
                  Unlock MinoForge Ultimate:
                </span>
                <div className="flex items-center gap-2 text-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>Unlimited</strong> Config Generations with zero daily limits</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>0% Sales Commission</strong> (Keep 100% of plugin sales)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Rocket className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>$5.00 Free Monthly</strong> Sponsored Ad Credits</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  to="/upgrade"
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all block"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade to Ultimate — $19.99/mo</span>
                </Link>
                <button
                  onClick={() => setShowPaywallModal(false)}
                  className="text-xs text-slate-400 hover:text-white font-medium block mx-auto pt-1 cursor-pointer"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AiConfigPage;
