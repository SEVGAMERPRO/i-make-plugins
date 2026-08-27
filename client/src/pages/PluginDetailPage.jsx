import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Download, Clock, Tag, ShieldCheck, ChevronRight, Sparkles, Terminal, FileCode, CheckCircle2, User, Share2, Check } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import MinoShieldBadge from '../components/security/MinoShieldBadge';
import { getPluginById } from '../services/api';

const SAMPLE_PLUGINS_DATABASE = {
  'p-mine-1': {
    id: 'p-mine-1',
    title: 'Ultimate Economy & Vault System',
    authorName: 'MinoDeveloper',
    gameName: 'Minecraft',
    price: '4.99', // Lowered from 14.99!
    rating: '4.9',
    reviewsCount: 142,
    downloads: 4820,
    version: 'v2.4.0',
    lastUpdated: '2 days ago',
    category: 'Economy & Vault',
    coverImageUrl: '/images/plugins/minecraft_economy_gui.svg',
    screenshots: [
      '/images/plugins/minecraft_economy_gui.svg'
    ],
    downloadUrl: '/downloads/UltimateEconomy-v2.4.0.zip',
    summary: 'High-performance multi-currency vault system with GUI ATMs, pin codes, and transaction logs.',
    overview: `
      <h3>Overview</h3>
      <p>The premier economy plugin for modern Minecraft servers. Built from the ground up for Paper, Purpur, and Folia with zero lag and instant SQL synchronization.</p>
      <br/>
      <h4>Key Features</h4>
      <ul>
        <li>Multi-Currency Support (Coins, Gems, Bank Credits)</li>
        <li>Interactive GUI ATM & Banking System with PIN codes</li>
        <li>Automated Interest & Loan Management</li>
        <li>Full Vault, PlaceholderAPI, and Discord Webhook integration</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-emerald-200 text-xs">
        <strong>⚡ Quick Setup Guide:</strong> Copy the <code>UltimateEconomy</code> folder into your server's <code>/plugins</code> directory, make sure <code>Vault</code> is installed, and run <code>/eco reload</code>!
      </div>
      <h4>Step-by-Step Installation (README.txt)</h4>
      <ol>
        <li><strong>Requirements:</strong> Ensure your server runs Paper, Purpur, Spigot, or Folia (1.18 - 1.21.x) with <a href="https://www.spigotmc.org/resources/vault.34315/" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline">Vault</a>.</li>
        <li><strong>Place Plugin:</strong> Extract and place <code>UltimateEconomy</code> into your <code>/plugins/</code> directory.</li>
        <li><strong>Start Server:</strong> Restart your server to automatically generate <code>config.yml</code> and SQLite database.</li>
        <li><strong>Reload:</strong> Customize starting balances, interest rates, and run <code>/eco reload</code>.</li>
      </ol>
    `,
    commands: `
      <h4>All Available Commands & Permissions</h4>
      <table class="w-full text-left text-xs border border-white/10 mt-2 rounded-lg overflow-hidden">
        <thead class="bg-slate-800 text-slate-300">
          <tr>
            <th class="p-2.5 border-b border-white/10">Command</th>
            <th class="p-2.5 border-b border-white/10">Permission</th>
            <th class="p-2.5 border-b border-white/10">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-slate-300">
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/balance [player]</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.eco.balance</td>
            <td class="p-2.5">Check personal or target player's current balance</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/pay &lt;player&gt; &lt;amount&gt;</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.eco.pay</td>
            <td class="p-2.5">Transfer coins to another player with anti-fraud confirmation</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/bank</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.bank.gui</td>
            <td class="p-2.5">Open personal banking ATM GUI with PIN protection</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/ah [search]</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.ah.use</td>
            <td class="p-2.5">Open global Auction House & player market</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/eco give|take|set &lt;player&gt; &lt;amount&gt;</td>
            <td class="p-2.5 text-amber-400 font-semibold">mino.eco.admin</td>
            <td class="p-2.5">Admin balance management across online/offline players</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/eco reload</td>
            <td class="p-2.5 text-amber-400 font-semibold">mino.eco.admin</td>
            <td class="p-2.5">Reloads all configurations, messages, and database pool</td>
          </tr>
        </tbody>
      </table>
    `,
    configSample: `# Ultimate Economy Configuration (config.yml)
# Generated by MinoForge

database:
  type: "SQLITE" # Options: SQLITE, MYSQL, POSTGRESQL
  host: "localhost"
  port: 3306
  database: "minecraft_eco"
  username: "root"
  password: "password123"

currency:
  name-singular: "Coin"
  name-plural: "Coins"
  symbol: "$"
  starting-balance: 250.00
  allow-negative-balance: false

banking:
  enabled: true
  max-accounts-per-player: 3
  daily-interest-rate: 0.015 # 1.5% daily interest
`
  },
  'p-fivem-2': {
    id: 'p-fivem-2',
    title: 'Advanced Fuel & Electric Charging System',
    authorName: 'FiveMDev_99',
    gameName: 'FiveM',
    price: '3.49', // Lowered from 9.99!
    rating: '4.8',
    reviewsCount: 88,
    downloads: 2150,
    version: 'v1.1.2',
    lastUpdated: '1 week ago',
    category: 'Vehicles & Mechanics',
    coverImageUrl: '/images/plugins/gta_gas_station.svg',
    screenshots: [
      '/images/plugins/gta_gas_station.svg'
    ],
    downloadUrl: '/downloads/advanced_fuel-v1.1.2.zip',
    summary: 'Realistic gas stations, EV charging stations, Jerry cans, and smooth 60fps UI for QBCore and ESX.',
    overview: `
      <h3>Overview</h3>
      <p>A next-generation vehicle refueling system for FiveM. Features animated nozzle physics, fuel consumption based on RPM/speed, EV chargers for electric cars, and Jerry cans with roadside delivery.</p>
      <br/>
      <h4>Key Features</h4>
      <ul>
        <li>Optimized 0.00ms idle resmon performance</li>
        <li>Supports both QBCore, ESX Legacy, and standalone frameworks</li>
        <li>Jerry can refueling and roadside mechanics</li>
        <li>Electric vehicle charging stations with sound effects</li>
        <li>Sleek modern NUI interface with customizable colors</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-orange-500/15 border border-orange-400/30 rounded-xl text-orange-200 text-xs">
        <strong>⚡ Quick FiveM Setup:</strong> Place <code>advanced_fuel</code> into your <code>resources/[standalone]/</code> folder and add <code>ensure advanced_fuel</code> to your <code>server.cfg</code>!
      </div>
      <h4>Step-by-Step Installation (README.txt)</h4>
      <ol>
        <li><strong>Prerequisites:</strong> Ensure you have <a href="https://github.com/overextended/ox_lib" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline">ox_lib</a> and <code>ox_target</code> / <code>qb-target</code> installed.</li>
        <li><strong>Extract Resource:</strong> Extract <code>advanced_fuel</code> into your server's <code>resources/[standalone]</code> directory.</li>
        <li><strong>Server Config:</strong> Add <code>ensure advanced_fuel</code> in your <code>server.cfg</code>.</li>
        <li><strong>Restart:</strong> Restart your server or run <code>refresh</code> and <code>ensure advanced_fuel</code> in console.</li>
      </ol>
    `,
    commands: `
      <h4>All Available Commands & Exports</h4>
      <table class="w-full text-left text-xs border border-white/10 mt-2 rounded-lg overflow-hidden">
        <thead class="bg-slate-800 text-slate-300">
          <tr>
            <th class="p-2.5 border-b border-white/10">Command / Export</th>
            <th class="p-2.5 border-b border-white/10">Permission</th>
            <th class="p-2.5 border-b border-white/10">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-slate-300">
          <tr>
            <td class="p-2.5 font-mono text-orange-400">/setfuel [0-100]</td>
            <td class="p-2.5 text-amber-400 font-semibold">Admin Only</td>
            <td class="p-2.5">Set current target vehicle fuel percentage</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-orange-400">/givejerrycan [player]</td>
            <td class="p-2.5 text-amber-400 font-semibold">Admin Only</td>
            <td class="p-2.5">Give a fuel jerry can item to target player</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-cyan-400">exports['advanced_fuel']:GetFuel(veh)</td>
            <td class="p-2.5 text-blue-400 font-semibold">Public API</td>
            <td class="p-2.5">Returns vehicle fuel percentage (float 0.0 to 100.0)</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-cyan-400">exports['advanced_fuel']:SetFuel(veh, val)</td>
            <td class="p-2.5 text-blue-400 font-semibold">Public API</td>
            <td class="p-2.5">Programmatically modify vehicle fuel level</td>
          </tr>
        </tbody>
      </table>
    `,
    configSample: `-- FiveM Fuel Configuration
-- Format: Lua (QBCore / ESX)

Config = {}
Config.Framework = 'qb' -- 'qb', 'esx', or 'standalone'
Config.Target = 'ox_target' -- 'ox_target' or 'qb-target'
Config.FuelPrice = 1.75 -- Price per Liter

Config.ElectricVehicles = {
    'raiden',
    'neon',
    'cyclone',
    'iwagen',
    'tezeract'
}

Config.JerryCanCapacity = 25.0
Config.RefuelSpeed = 1.5
`
  },
  'p-bot-3': {
    id: 'p-bot-3',
    title: 'Discord Ticket & Transcripts Bot',
    authorName: 'BotCrafter',
    gameName: 'Discord',
    price: '0.00', // Free!
    rating: '5.0',
    reviewsCount: 210,
    downloads: 3940,
    version: 'v1.0.0',
    lastUpdated: '3 weeks ago',
    category: 'Community & Moderation',
    coverImageUrl: '/images/plugins/discord_ticket_panel.svg',
    screenshots: [
      '/images/plugins/discord_ticket_panel.svg'
    ],
    downloadUrl: '/downloads/DiscordTicketBot-v1.0.0.zip',
    summary: 'Automated ticket buttons, transcript HTML archiving, and staff rating system for Discord servers.',
    overview: `
      <h3>What It Does</h3>
      <p>A fast, automated support ticket system for Discord servers that replaces messy direct messages with clean, private 1-on-1 support channels. Users open tickets with 1-click interactive buttons and modal popups, while full chat histories are automatically exported into standalone HTML transcripts upon closure.</p>
      <br/>
      <h4>How It Works</h4>
      <ul>
        <li><strong>1. Panel Deployment:</strong> The bot posts a permanent interactive button panel in your <code>#support</code> channel.</li>
        <li><strong>2. Ticket Creation:</strong> Clicking "Open Ticket" opens a reason modal and creates a private channel (e.g. <code>#ticket-username</code>).</li>
        <li><strong>3. Staff Resolution:</strong> Support Staff chat privately with the user to resolve their questions.</li>
        <li><strong>4. Transcript Export:</strong> Clicking "Close Ticket" saves a full HTML transcript with timestamps/attachments to your logs channel, then cleanly deletes the ticket.</li>
      </ul>
      <br/>
      <h4>Key Features</h4>
      <ul>
        <li>Interactive Discord Button & Modal menus</li>
        <li>Self-hosted HTML transcripts viewable in any web browser</li>
        <li>Role-based permissions (only staff & ticket creator can view)</li>
        <li>Auto-close idle tickets after inactivity</li>
        <li>Zero external database required (pure Node.js & Discord.js v14)</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-blue-500/15 border border-blue-400/30 rounded-xl text-blue-200 text-xs">
        <strong>⚡ Quick 1-Click Setup:</strong> Run the <code>install.bat</code> file inside the zip to download everything automatically, then just configure your bot in <code>config.example.json</code>!
      </div>
      <h4>Step-by-Step Installation Guide (README.txt)</h4>
      <ol>
        <li><strong>1-Click Install:</strong> Double click <code>install.bat</code> (or run <code>npm install</code>).</li>
        <li><strong>Discord Developer Portal:</strong> Create a bot at <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline">discord.com/developers</a>. Enable <em>Server Members Intent</em> and <em>Message Content Intent</em> under the Bot tab.</li>
        <li><strong>Configuration:</strong> Rename <code>config.example.json</code> to <code>config.json</code> and paste your Bot Token and Server IDs.</li>
        <li><strong>Start the Bot:</strong> Run <code>node index.js</code> (or use PM2 for 24/7 hosting: <code>pm2 start index.js --name ticket-bot</code>).</li>
        <li><strong>Deploy Panel:</strong> Run <code>/ticket setup</code> in your Discord server #support channel!</li>
      </ol>
    `,
    commands: `
      <h4>All Available Commands & Permissions</h4>
      <table class="w-full text-left text-xs border border-white/10 mt-2 rounded-lg overflow-hidden">
        <thead class="bg-slate-800 text-slate-300">
          <tr>
            <th class="p-2.5 border-b border-white/10">Command</th>
            <th class="p-2.5 border-b border-white/10">Permission</th>
            <th class="p-2.5 border-b border-white/10">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-slate-300">
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket setup</td>
            <td class="p-2.5 text-amber-400 font-semibold">Administrator</td>
            <td class="p-2.5">Deploys the interactive button panel to current channel</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket close [reason]</td>
            <td class="p-2.5 text-emerald-400 font-semibold">Staff & Creator</td>
            <td class="p-2.5">Closes ticket, logs reason, and exports HTML transcript</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket add @user</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Grants another user access to the active ticket</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket remove @user</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Removes a user from the active ticket</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket rename [name]</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Renames the active ticket channel</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket transcript</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Generates an instant HTML transcript without closing</td>
          </tr>
        </tbody>
      </table>
    `,
    configSample: `// Discord Ticket Bot Configuration (config.json)
// Format: JSON

{
  "botToken": "YOUR_DISCORD_BOT_TOKEN_HERE",
  "clientId": "YOUR_DISCORD_APPLICATION_CLIENT_ID",
  "guildId": "YOUR_DISCORD_SERVER_ID",
  "ticketCategoryChannelId": "CATEGORY_CHANNEL_ID_FOR_TICKETS",
  "transcriptLogsChannelId": "TEXT_CHANNEL_ID_FOR_HTML_TRANSCRIPTS",
  "supportStaffRoleId": "ROLE_ID_OF_YOUR_SUPPORT_STAFF",
  "maxOpenTicketsPerUser": 2,
  "askFeedbackOnClose": true
}
`
  },
  'p-2b2t-1': {
    id: 'p-2b2t-1',
    title: '2b2t Anarchy Utility & Baritone Auto-Highway Builder',
    authorName: 'AnarchyDev_2b',
    gameName: 'Minecraft: 2b2t & Anarchy Clients',
    price: '0.00', // Free!
    rating: '5.0',
    reviewsCount: 310,
    downloads: 8940,
    version: 'v3.2.0-Fabric',
    lastUpdated: 'Yesterday',
    category: '2b2t Hacked Clients & Addons',
    coverImageUrl: '/images/plugins/minecraft_anarchy_highway.svg',
    screenshots: [
      '/images/plugins/minecraft_anarchy_highway.svg'
    ],
    summary: 'High-speed Baritone Nether highway builder, Auto-Totem, GrimAC bypasses, PacketFly, and terrain stash finder for 2b2t.org.',
    overview: `
      <h3>2b2t Anarchy Utility Suite (Fabric 1.20 - 1.21)</h3>
      <p>The ultimate anarchy survival and highway construction utility mod for 2b2t.org and anarchy servers. Optimized for GrimAC and NoCheatPlus bypasses.</p>
      <br/>
      <h4>Modules Included</h4>
      <ul>
        <li><strong>Auto-Highway Builder:</strong> Automated Baritone pathfinder that clears obsidian, bridges lava, and builds 3x3 Nether highways at maximum tick speeds.</li>
        <li><strong>Offhand Auto-Totem:</strong> Zero-tick inventory refilling and invulnerability swap.</li>
        <li><strong>2b2t ElytraFly & PacketFly:</strong> Custom pitch/speed bypass tailored for 2b2t patch limits.</li>
        <li><strong>Stash & Chest ESP:</strong> Scans chunk metadata to highlight dupe stashes and unlooted bases.</li>
        <li><strong>Anti-Hunger & Auto-Disconnect:</strong> Automatically logs off on low health or nearby hostile players.</li>
      </ul>
    `,
    installation: `
      <ol>
        <li>Install Fabric Loader 1.20.4 or 1.21 on your Minecraft launcher.</li>
        <li>Place <code>2b2t-Anarchy-Utility-3.2.0.jar</code> into your <code>.minecraft/mods</code> folder.</li>
        <li>Launch Minecraft and press <kbd>RSHIFT</kbd> or type <code>.help</code> in chat to open the ClickGUI.</li>
      </ol>
    `,
    commands: `
      <ul>
        <li><code>.highway [x] [z]</code> - Start automated Baritone Nether highway construction</li>
        <li><code>.stash scan [radius]</code> - Scan loaded chunks for chests and shulkers</li>
        <li><code>.elytra mode 2b2t</code> - Switch ElytraFly bypass to 2b2t profile</li>
      </ul>
    `,
    configSample: `# 2b2t Anarchy Utility Configuration (JSON/YAML)

modules:
  auto_totem:
    enabled: true
    health_threshold: 14.0
    strict_mode: true
  highway_builder:
    width: 3
    height: 3
    clear_blocks: ["NETHERRACK", "BASALT", "BLACKSTONE", "LAVA"]
    bridge_material: "OBSIDIAN"
    auto_eat: true
  bypasses:
    grim_packet_sync: true
    anti_velocity_bypass: true
    fast_break_tick_delay: 0
`
  }
};

const PluginDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [plugin, setPlugin] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPluginById(id)
      .then(res => {
        setPlugin(res.data);
      })
      .catch(() => {
        const found = SAMPLE_PLUGINS_DATABASE[id] || SAMPLE_PLUGINS_DATABASE['p-mine-1'];
        setPlugin(found);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDownload = () => {
    const url = plugin?.downloadUrl || '/downloads/UltimateEconomy-v2.4.0.zip';
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  if (loading) return <LoadingSpinner />;
  if (!plugin) return <div className="text-center py-20 text-xl text-slate-400">Plugin not found</div>;

  const isFree = parseFloat(plugin.price) === 0 || plugin.price === '0.00' || plugin.price === 'Free';

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/plugins" className="hover:text-blue-400">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium truncate">{plugin.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Column */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Header Showcase Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="aspect-[21/9] w-full bg-slate-950 relative overflow-hidden">
                <img 
                  src={plugin.coverImageUrl || '/images/categories/minecraft.png'} 
                  alt={plugin.title}
                  className="w-full h-full object-cover filter brightness-85" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl text-xs font-extrabold text-blue-400 border border-white/10 shadow-lg">
                    {plugin.gameName || plugin.game}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                      {plugin.title}
                    </h1>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      Developed by <Link to={`/users/${plugin.authorName}`} className="text-blue-400 font-bold hover:underline">{plugin.authorName}</Link>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-emerald-400">
                      {isFree ? 'Free' : `$${plugin.price}`}
                    </span>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <strong className="text-white text-sm">{plugin.rating}</strong>
                    <span className="text-slate-400">({plugin.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-400" />
                    <strong className="text-white text-sm">{plugin.downloads.toLocaleString()}</strong>
                    <span className="text-slate-400">downloads</span>
                  </div>
                  <MinoShieldBadge />
                </div>
              </div>
            </div>

            {/* Multi-Tab Documentation Hub */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 md:p-8">
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 pb-6 border-b border-white/10">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'screenshots', label: '📸 In-Game Screenshots' },
                  { id: 'install', label: 'Installation' },
                  { id: 'commands', label: 'Commands & Perms' },
                  { id: 'config', label: 'Sample Config' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="pt-6">
                {activeTab === 'overview' && (
                  <div 
                    className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: plugin.overview || plugin.summary }}
                  />
                )}

                {activeTab === 'screenshots' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">
                      Real in-game GUI screenshots and feature showcases uploaded by the author:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(plugin.screenshots || [plugin.coverImageUrl]).map((img, idx) => (
                        <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-xl">
                          <img 
                            src={img} 
                            alt={`${plugin.title} preview ${idx + 1}`} 
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-[11px] font-bold text-white">Feature Showcase #{idx + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'install' && (
                  <div 
                    className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: plugin.installation || '<p>Follow standard plugin installation for this platform.</p>' }}
                  />
                )}

                {activeTab === 'commands' && (
                  <div 
                    className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: plugin.commands || '<p>No custom commands required.</p>' }}
                  />
                )}

                {activeTab === 'config' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Default Configuration</span>
                      <Link
                        to="/ai-config"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Customize with AI</span>
                      </Link>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-blue-200 overflow-x-auto">
                      {plugin.configSample}
                    </pre>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* Purchase / Download Card */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl sticky top-24 space-y-5">
              <button 
                onClick={handleDownload}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-base"
              >
                {downloadSuccess ? <Check className="w-5 h-5 text-emerald-300" /> : <Download className="w-5 h-5" />}
                <span>{downloadSuccess ? 'Downloaded!' : isFree ? 'Download Free Package (.zip)' : `Get Resource for $${plugin.price}`}</span>
              </button>

              {downloadSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 text-center font-bold animate-fade-in">
                  Package saved to your Downloads folder!
                </div>
              )}

              {/* AI Config Banner */}
              <Link
                to="/ai-config"
                className="block p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/50 transition-all group"
              >
                <div className="flex items-center gap-2 text-blue-300 font-bold text-xs mb-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>AI Config Generator</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Need a custom rank or economy configuration? Let MinoForge AI write it for you.
                </p>
              </Link>

              {/* Details table */}
              <div className="space-y-3 pt-4 border-t border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated</span>
                  <strong className="text-white">{plugin.lastUpdated}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Version</span>
                  <strong className="font-mono text-white">{plugin.version}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <strong className="text-blue-400">{plugin.gameName || plugin.game}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Package Format</span>
                  <strong className="font-mono text-white">.ZIP Resource</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security</span>
                  <strong className="text-emerald-400 font-bold">MinoShield Verified</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PluginDetailPage;
