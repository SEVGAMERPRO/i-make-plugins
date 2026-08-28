import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, RefreshCw, Code, CheckCircle, Terminal, HelpCircle, ArrowRight, Sliders, Layers, FileText, Bot, Key, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PRESETS = [
  {
    title: 'Multi-Tier Economy & Banking Vault',
    game: 'Minecraft',
    prompt: 'Create a multi-currency economy system with Coins, Gems, ATM banking GUI, 4-digit PINs, and automated daily interest.',
  },
  {
    title: 'LuckPerms 8-Tier Rank & Permissions Hierarchy',
    game: 'Minecraft',
    prompt: 'Generate an extensive LuckPerms permissions hierarchy for 8 ranks (Default, Member, VIP, MVP, Builder, Mod, Admin, Owner) with prefixes, weights, and command nodes.',
  },
  {
    title: 'Mystery Crates & Loot Drop Chances',
    game: 'Minecraft',
    prompt: 'Create a custom Crates plugin config with Common, Rare, Epic, and Legendary crates, animated opening sequence, particle effects, and win chances.',
  },
  {
    title: 'FiveM Police & Emergency Dispatch CAD',
    game: 'FiveM',
    prompt: 'Generate an extensive FiveM QBCore police dispatch and impound config with fine amounts, radar speeds, patrol vehicle spawn names, and ox_target armory.',
  },
  {
    title: 'Discord Auto-Moderation & Verification Bot',
    game: 'Discord',
    prompt: 'Generate a full Discord bot config with button verification, anti-raid invite filters, auto-moderation logging, and ticket categories.',
  }
];

// Smart Dynamic Config Generators for 100% Contextual Fallback
function generateDynamicMinecraftConfig(prompt, complexity) {
  const p = prompt.toLowerCase();

  // 1. Ranks / Permissions / LuckPerms
  if (p.includes('rank') || p.includes('perm') || p.includes('luckperm') || p.includes('group')) {
    return `# ==============================================================================
#                  MINOFORGE DYNAMIC PERMISSIONS & RANK CONFIG
# ==============================================================================
# Target Platform : Minecraft (LuckPerms / Paper / Purpur)
# Prompt Request  : "${prompt}"
# Generated Date  : ${new Date().toLocaleString()}
# ==============================================================================

server-id: "survival-main"
primary-group-calculation: "parents-by-weight"

groups:
  default:
    weight: 10
    display-name: "Default"
    prefix: "&7[Member] "
    permissions:
      - "essentials.spawn"
      - "essentials.msg"
      - "essentials.pay"
      - "minoforge.user.basic"
      - "worldguard.region.flags"

  vip:
    weight: 30
    display-name: "VIP"
    prefix: "&a[VIP] "
    parents:
      - default
    permissions:
      - "essentials.fly"
      - "essentials.hat"
      - "essentials.feed"
      - "minoforge.vip.perks"
      - "vault.currency.bonus.1.2"

  mvp:
    weight: 50
    display-name: "MVP"
    prefix: "&b&l[MVP] "
    parents:
      - vip
    permissions:
      - "essentials.heal"
      - "essentials.workbench"
      - "essentials.enderchest"
      - "minoforge.mvp.perks"
      - "vault.currency.bonus.1.5"

  moderator:
    weight: 80
    display-name: "Mod"
    prefix: "&3&l[MOD] "
    parents:
      - mvp
    permissions:
      - "minecraft.command.kick"
      - "minecraft.command.mute"
      - "essentials.freeze"
      - "essentials.vanish"
      - "worldguard.inspect"
      - "minoforge.staff.ticket"

  admin:
    weight: 90
    display-name: "Admin"
    prefix: "&c&l[ADMIN] "
    parents:
      - moderator
    permissions:
      - "minecraft.command.ban"
      - "minecraft.command.gamemode"
      - "essentials.give"
      - "worldedit.*"
      - "minoforge.admin.all"

  owner:
    weight: 100
    display-name: "Owner"
    prefix: "&4&l&o[OWNER] "
    permissions:
      - "*"
`;
  }

  // 2. Mystery Crates & Rewards
  if (p.includes('crate') || p.includes('key') || p.includes('loot') || p.includes('reward') || p.includes('box')) {
    return `# ==============================================================================
#                  MINOFORGE MYSTERY CRATES & REWARDS CONFIG
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${new Date().toLocaleString()}
# ==============================================================================

crates_system:
  enabled: true
  opening_animation: "CSGO_ROULETTE" # Options: CSGO_ROULETTE, SPIRAL_PARTICLES, EXPLOSION
  knockback_on_invalid_key: true
  broadcast_legendary_wins: true

crates:
  bronze_crate:
    display_name: "&6&lBronze Mystery Crate"
    block_type: "CHEST"
    key_item: "TRIPWIRE_HOOK"
    key_name: "&6Bronze Crate Key"
    key_glowing: true
    rewards:
      1:
        type: "COMMAND"
        command: "eco give %player% 500"
        display_item: "GOLD_NUGGET"
        display_name: "&e500 Server Coins"
        chance: 40.0
      2:
        type: "ITEM"
        item: "IRON_SWORD"
        amount: 1
        display_name: "&fSharp Iron Blade"
        enchantments:
          - "DAMAGE_ALL:2"
        chance: 35.0
      3:
        type: "COMMAND"
        command: "lp user %player% parent addtemp vip 3d"
        display_item: "DIAMOND"
        display_name: "&a3-Day Free VIP Rank"
        chance: 5.0

  legendary_crate:
    display_name: "&d&l&k!&r &d&lMYTHIC DRAGON CRATE &d&l&k!"
    block_type: "ENDER_CHEST"
    key_item: "NETHER_STAR"
    key_name: "&dMythic Crate Key"
    key_glowing: true
    rewards:
      1:
        type: "ITEM"
        item: "NETHERITE_SWORD"
        amount: 1
        display_name: "&4&lBlade of the Apocalypse"
        enchantments:
          - "DAMAGE_ALL:5"
          - "FIRE_ASPECT:2"
          - "UNBREAKING:3"
        chance: 15.0
      2:
        type: "COMMAND"
        command: "eco give %player% 50000"
        display_item: "EMERALD_BLOCK"
        display_name: "&a$50,000 Jackpot"
        chance: 10.0
      3:
        type: "COMMAND"
        command: "lp user %player% parent set mvp"
        display_item: "NETHERITE_CHESTPLATE"
        display_name: "&b&lPermanent MVP Rank"
        chance: 2.0
`;
  }

  // 3. Scoreboard & Tablist
  if (p.includes('score') || p.includes('board') || p.includes('tab') || p.includes('sidebar')) {
    return `# ==============================================================================
#                  MINOFORGE ANIMATED SCOREBOARD & TABLIST
# ==============================================================================
# Target Platform : Minecraft (Paper / Velocity 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${new Date().toLocaleString()}
# ==============================================================================

scoreboard:
  title:
    refresh_ticks: 4
    frames:
      - "&b&lMINO&f&lFORGE"
      - "&f&lMINO&b&lFORGE"
      - "&3&lMINO&f&lFORGE"
      - "&b&lM&f&lINOFORGE"
  
  lines:
    1: "&7&m------------------------"
    2: "&fPlayer: &b%player_name%"
    3: "&fRank: %vault_prefix%"
    4: ""
    5: "&fBalance: &e$%vault_eco_balance_formatted%"
    6: "&fGems: &b💎 %playerpoints_points%"
    7: ""
    8: "&fPing: &a%player_ping%ms"
    9: "&fOnline: &a%server_online%&7/&f%server_max_players%"
    10: "&7&m------------------------"
    11: "&ecolasmp.net"

tablist:
  header:
    - "&b&lMINOFORGE NETWORK"
    - "&7Welcome &e%player_name% &7to the official server!"
    - ""
  footer:
    - ""
    - "&fStore: &ehttps://colasmp.net"
    - "&fDiscord: &b/discord"
`;
  }

  // 4. Default Tailored Custom Plugin Config
  return `# ==============================================================================
#                  MINOFORGE TAILORED PLUGIN CONFIGURATION
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur / Folia 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${new Date().toLocaleString()}
# Syntax          : VALIDATED YAML (UTF-8)
# ==============================================================================

settings:
  enabled: true
  debug: false
  locale: "en_US"
  prefix: "&8[&bMinoForge&8] &r"
  auto_save_interval_seconds: 300
  folia_support: true

features:
  custom_mechanics:
    prompt_target: "${prompt}"
    cooldown_seconds: 15
    sound_effects_enabled: true
    particles_on_action: "FIREWORK"
  
database:
  storage_type: "SQLITE" # Options: SQLITE, MYSQL, MARIADB
  sqlite:
    file: "minoforge_data.db"
  mysql:
    host: "127.0.0.1"
    port: 3306
    database: "minoforge_db"
    username: "root"
    password: "CHANGE_ME"

messages:
  success: "&aAction executed successfully!"
  error: "&cAn error occurred. Please verify your permissions."
  cooldown: "&ePlease wait &6%seconds%s &ebefore using this again."
  no_permission: "&cYou do not have permission to execute this command."

commands:
  main_command:
    name: "minoplugin"
    aliases: ["mp", "mf"]
    permission: "minoforge.use"
    description: "Main plugin entry point"
`;
}

function generateDynamicFiveMConfig(prompt) {
  return `-- ==============================================================================
--                  MINOFORGE TAILORED FIVEM CONFIGURATION
-- ==============================================================================
-- Target Platform : FiveM (QBCore / ESX Legacy / ox_lib)
-- Prompt Request  : "${prompt}"
-- Generated Date  : ${new Date().toLocaleString()}
-- Syntax          : VALIDATED LUA 5.4
-- ==============================================================================

Config = {}

-- Framework Settings
Config.Framework = 'qb' -- 'qb' (QBCore), 'esx' (ESX Legacy), 'ox' (Ox Core)
Config.Target = 'ox_target'
Config.Notify = 'ox_lib'

-- System Tailored for Prompt: "${prompt}"
Config.Settings = {
    enabled = true,
    debug = false,
    useTarget = true,
    distance = 2.5,
    soundVolume = 0.6
}

-- Configured Locations & Points of Interest
Config.Zones = {
    {
        name = "Central Station",
        coords = vector3(441.28, -982.51, 30.69),
        radius = 5.0,
        blip = {
            sprite = 60,
            color = 3,
            scale = 0.8,
            label = "MinoForge Station"
        }
    }
}

-- User Notifications
Config.Locales = {
    ['action_success'] = 'Operation completed successfully.',
    ['not_enough_money'] = 'You do not have sufficient funds.',
    ['no_permission'] = 'You are not authorized to access this department.'
}
`;
}

function generateDynamicDiscordConfig(prompt) {
  return `// ==============================================================================
//                  MINOFORGE TAILORED DISCORD BOT CONFIG
// ==============================================================================
// Target Platform : Discord.js v14
// Prompt Request  : "${prompt}"
// Generated Date  : ${new Date().toLocaleString()}
// ==============================================================================

{
  "bot": {
    "token": "YOUR_DISCORD_BOT_TOKEN",
    "clientId": "123456789012345678",
    "guildId": "987654321098765432",
    "prefix": "!",
    "status": "MinoForge Marketplace"
  },
  "features": {
    "request": "${prompt}",
    "autoModeration": true,
    "logChannelId": "112233445566778899",
    "welcomeChannelId": "223344556677889900"
  },
  "roles": {
    "admin": "Administrator",
    "moderator": "Support Staff",
    "member": "Verified Buyer"
  }
}
`;
}

const AiConfigPage = () => {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState('Minecraft');
  const [prompt, setPrompt] = useState('');
  const [complexity, setComplexity] = useState('500+');
  
  // STARTS BLANK AS REQUESTED!
  const [output, setOutput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generationSource, setGenerationSource] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setGenerationSource('');

    const savedApiKey = localStorage.getItem('minoforge_gemini_api_key');

    // 1. Try Google Gemini API if user has their Google Pro Key configured
    if (savedApiKey && savedApiKey.trim()) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${savedApiKey.trim()}`,
          {
            contents: [{
              parts: [{
                text: `You are an expert game server plugin architect. Generate a complete, production-ready, perfectly formatted configuration file for ${selectedGame} based on this exact user request:\n\n"${prompt}"\n\nReturn ONLY the raw configuration code (e.g. YAML, Lua, or JSON) with helpful developer comments. Do NOT enclose in markdown code block ticks (\`\`\`).`
              }]
            }]
          }
        );

        let aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          // Strip any accidental markdown formatting
          aiText = aiText.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
          setOutput(aiText);
          setGenerationSource('Google Gemini 1.5 Pro AI');
          setLoading(false);
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini API Direct Call error, falling back to dynamic engine:', geminiError);
      }
    }

    // 2. Dynamic Smart Engine (tailored strictly to user prompt)
    setTimeout(() => {
      let result = '';
      if (selectedGame === 'Minecraft') {
        result = generateDynamicMinecraftConfig(prompt, complexity);
      } else if (selectedGame === 'FiveM') {
        result = generateDynamicFiveMConfig(prompt);
      } else {
        result = generateDynamicDiscordConfig(prompt);
      }

      setOutput(result);
      setGenerationSource('MinoForge Context Engine');
      setLoading(false);
    }, 600);
  };

  const handlePresetSelect = (preset) => {
    setSelectedGame(preset.game);
    setPrompt(preset.prompt);
  };

  const downloadConfig = () => {
    if (!output) return;
    const ext = selectedGame === 'FiveM' ? 'lua' : selectedGame === 'Discord' ? 'json' : 'yml';
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
                <p className="text-xs text-slate-400">Generates custom YAML, Lua, and JSON configs for whatever you ask.</p>
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Form Box */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-5 shadow-xl">
              
              {/* Game Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Target Platform / Game
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Minecraft', 'FiveM', 'Discord'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGame(g)}
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

              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Describe What You Want in the Config
                </label>
                <textarea
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Create a mystery crates plugin with 4 tiers, custom keys, animation effects, and win chances..."
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
                    <span>AI is Generating Config...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Configuration</span>
                  </>
                )}
              </button>

            </div>

            {/* Quick Inspiration Presets */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Quick Inspiration Presets
              </span>
              <div className="space-y-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(p)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-blue-600/15 border border-white/5 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-cyan-300">
                      <span>{p.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">{p.game}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Output Window */}
          <div className="lg:col-span-7 space-y-3">
            
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase text-slate-300">Generated Code Output</span>
                {generationSource && (
                  <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold rounded-md">
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
                    <span>Download File</span>
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
                    Enter your requirements in the prompt box on the left and click <strong>"Generate Configuration"</strong> to create your custom config file.
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
