import React, { useState } from 'react';
import { 
  Sparkles, Copy, Check, Download, RefreshCw, Code, CheckCircle, Terminal, 
  HelpCircle, ArrowRight, Sliders, Layers, FileText, Bot, Key, ExternalLink, 
  Flame, Skull, Zap, Shield, Crown, Swords, Coins, Heart, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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
  const [selectedGame, setSelectedGame] = useState('Minecraft');
  const [format, setFormat] = useState('YAML'); // 'YAML' | 'JSON' | 'Lua' | 'TOML'
  const [prompt, setPrompt] = useState('');
  
  // STARTS BLANK AS REQUESTED!
  const [output, setOutput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generationSource, setGenerationSource] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setGenerationSource('');

    const savedApiKey = localStorage.getItem('minoforge_gemini_api_key');

    try {
      // Send to server AI generator (which uses Gemini Pro or domain-specific smart rules)
      const res = await axios.post('/api/ai/generate-config', {
        prompt: prompt.trim(),
        game: selectedGame,
        format: format.toLowerCase(),
        apiKey: savedApiKey || undefined
      });

      if (res.data && res.data.config) {
        setOutput(res.data.config);
        setGenerationSource(res.data.source || 'AI Config Engine');
      } else {
        throw new Error('No configuration generated');
      }
    } catch (err) {
      console.warn('AI generation error, generating local contextual fallback:', err);
      // Client-side fallback
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
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Plugin Config Generator</h1>
                <p className="text-xs text-slate-400">Generates unique, smart, production-ready configurations tailored to any plugin idea.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              to="/settings?tab=integrations"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect Gemini Pro Key</span>
            </Link>
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
                    <span>AI is Architecting Config...</span>
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

      </div>
    </div>
  );
};

export default AiConfigPage;
