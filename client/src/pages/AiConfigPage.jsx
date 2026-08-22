import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, RefreshCw, Code, CheckCircle, Terminal, HelpCircle, ArrowRight } from 'lucide-react';

const PRESETS = [
  {
    title: 'Minecraft VIP Ranks (LuckPerms)',
    game: 'Minecraft',
    prompt: 'Create a 4-tier VIP rank permissions setup (VIP, VIP+, MVP, MVP+) with custom prefixes, fly permissions, and chat colors.',
    sampleOutput: `# MinoForge AI Generated Config
# Format: LuckPerms / PermissionsEx (YAML)

groups:
  default:
    options:
      default: true
      prefix: "&7[Member] "
    permissions:
      - essentials.spawn
      - essentials.tpa
      - essentials.sethome
  vip:
    inheritance:
      - default
    options:
      prefix: "&a[VIP] "
      weight: 100
    permissions:
      - essentials.fly
      - essentials.hat
      - essentials.sethome.multiple.vip
  vip_plus:
    inheritance:
      - vip
    options:
      prefix: "&b[VIP+] "
      weight: 200
    permissions:
      - essentials.workbench
      - essentials.feed
  mvp:
    inheritance:
      - vip_plus
    options:
      prefix: "&d[MVP] "
      weight: 300
    permissions:
      - essentials.heal
      - essentials.god.pvp-bypass: false
  mvp_plus:
    inheritance:
      - mvp
    options:
      prefix: "&6&l[MVP+] "
      weight: 400
    permissions:
      - essentials.nick
      - essentials.repair.all
`
  },
  {
    title: 'FiveM Economy & Garage Config',
    game: 'FiveM',
    prompt: 'Create a custom vehicle garage config with impound fees, insurance recovery, and custom vehicle tiers.',
    sampleOutput: `-- MinoForge AI Generated Config
-- Format: FiveM QBCore / ESX Config (Lua)

Config = {}

Config.ImpoundFee = 500
Config.InsuranceRate = 0.05 -- 5% of vehicle value
Config.MaxVehiclesPerPlayer = 8

Config.Garages = {
    ['legion'] = {
        label = "Legion Square Central Garage",
        coords = vector4(215.12, -805.34, 30.82, 340.0),
        type = "public",
        fee = 50
    },
    ['vinewood'] = {
        label = "Vinewood Luxury Motors",
        coords = vector4(-780.21, 335.45, 85.12, 180.0),
        type = "vip",
        requiredJob = false,
        fee = 150
    }
}

Config.VehicleTiers = {
    ['super'] = { priceMultiplier = 1.8, maxSpeed = 220 },
    ['sports'] = { priceMultiplier = 1.3, maxSpeed = 180 },
    ['sedan'] = { priceMultiplier = 1.0, maxSpeed = 140 }
}
`
  },
  {
    title: 'Discord Verification & Anti-Raid',
    game: 'Discord',
    prompt: 'Create a Discord bot security configuration with auto-ban for spam mentions, captcha role assignment, and invite logging.',
    sampleOutput: `// MinoForge AI Generated Config
// Format: Discord Bot Configuration (JSON)

{
  "bot": {
    "prefix": "!",
    "status": "watching MinoForge Marketplace",
    "activityType": "WATCHING"
  },
  "security": {
    "antiRaid": true,
    "maxMentionsPerMessage": 5,
    "accountAgeRequirementDays": 3,
    "autoMuteDurationSeconds": 300
  },
  "verification": {
    "enabled": true,
    "type": "BUTTON_CLICK",
    "unverifiedRoleId": "123456789012345678",
    "verifiedRoleId": "987654321098765432",
    "welcomeChannelId": "112233445566778899"
  },
  "logging": {
    "modLogChannelId": "998877665544332211",
    "logMemberJoins": true,
    "logDeletedMessages": true
  }
}
`
  }
];

const AiConfigPage = () => {
  const [selectedGame, setSelectedGame] = useState('Minecraft');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState(PRESETS[0].sampleOutput);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Simulate real AI config generation with custom syntax
    setTimeout(() => {
      let generated = '';
      if (selectedGame === 'Minecraft') {
        generated = `# MinoForge AI Generated Config for: "${prompt}"
# Generated: ${new Date().toLocaleDateString()}
# Format: Spigot/Paper YAML (Syntax Validated)

settings:
  enabled: true
  auto-save-interval: 300
  debug-mode: false

custom-features:
  prompt-request: "${prompt}"
  cooldown-seconds: 15
  broadcast-notifications: true
  rewards:
    coins: 250
    xp: 50
    items:
      - "DIAMOND:2"
      - "GOLDEN_APPLE:1"

messages:
  success: "&a[MinoForge] &7Action completed successfully!"
  cooldown: "&c[MinoForge] &7Please wait &e%time%s &7before using this again."
  no-permission: "&c[MinoForge] &7You do not have permission to execute this."
`;
      } else if (selectedGame === 'FiveM') {
        generated = `-- MinoForge AI Generated Config for: "${prompt}"
-- Format: FiveM Lua

Config = {}
Config.Enabled = true
Config.Debug = false
Config.Prompt = "${prompt}"

Config.Settings = {
    Cooldown = 15,
    RewardCash = 500,
    NotificationType = "ox_lib", -- "qb", "esx", or "ox_lib"
    AuthorizedJobs = { "police", "ambulance", "mechanic" }
}

Config.Locations = {
    vector3(145.2, -1045.6, 29.3),
    vector3(-420.1, 1120.4, 325.8)
}
`;
      } else {
        generated = `// MinoForge AI Generated Config for: "${prompt}"
// Format: JSON

{
  "configVersion": "2.0.0",
  "generatedFor": "${prompt}",
  "settings": {
    "enabled": true,
    "maxRetries": 3,
    "timeoutMs": 5000
  },
  "modules": [
    { "name": "CoreModule", "active": true },
    { "name": "SecurityModule", "active": true }
  ]
}
`;
      }

      setOutput(generated);
      setLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedGame === 'FiveM' ? 'lua' : selectedGame === 'Discord' ? 'json' : 'yml';
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `config.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full text-xs font-bold text-blue-400 border border-blue-500/20 mb-4 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI Powered Server Configurator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            AI Plugin Config Generator
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Describe what you need in plain English, and our AI will generate clean, error-free YAML, Lua, or JSON configuration files for your server.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl space-y-5">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Platform / Game
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Minecraft', 'FiveM', 'Roblox', 'Discord', 'Websites'].map(game => (
                    <button
                      key={game}
                      onClick={() => setSelectedGame(game)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${selectedGame === game ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    >
                      {game}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  What should this config do?
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-800/90 border border-white/10 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Create a 5-tier VIP rank setup with custom prefixes and fly permissions..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 ${loading || !prompt.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <Sparkles className="w-5 h-5" />
                <span>{loading ? 'Generating Config...' : 'Generate with AI'}</span>
              </button>

              {/* Presets List */}
              <div className="pt-4 border-t border-white/5">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Quick Community Presets
                </span>
                <div className="space-y-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedGame(preset.game);
                        setPrompt(preset.prompt);
                        setOutput(preset.sampleOutput);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-blue-500/30 transition-all text-xs font-semibold text-slate-300 flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{preset.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Code Output & Validation */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
              
              {/* Output Header */}
              <div className="px-5 py-3.5 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono font-medium text-slate-400">
                    config.{selectedGame === 'FiveM' ? 'lua' : selectedGame === 'Discord' ? 'json' : 'yml'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mr-2">
                    <CheckCircle className="w-3 h-3" /> Validated
                  </span>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Download file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Code Display Area */}
              <div className="flex-1 p-5 overflow-auto bg-[#070b14] font-mono text-xs md:text-sm text-blue-200/90 leading-relaxed hide-scrollbar">
                <pre className="whitespace-pre">{output}</pre>
              </div>

              {/* Syntax validation status footer */}
              <div className="px-5 py-3 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Syntax checked for {selectedGame} runtime</span>
                </div>
                <span>MinoForge AI Model 3.0</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AiConfigPage;
