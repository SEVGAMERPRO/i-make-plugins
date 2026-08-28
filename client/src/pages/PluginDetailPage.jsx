import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Download, Clock, Tag, ShieldCheck, ChevronRight, Sparkles, Terminal, FileCode, CheckCircle2, User, Share2, Check, CreditCard, ShoppingCart, MessageSquare, ExternalLink, Cpu, Layers, AlertCircle, History, FileText, Key, Award, Flame, Zap, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import MinoShieldBadge from '../components/security/MinoShieldBadge';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getPluginById } from '../services/api';

const SAMPLE_PLUGINS_DATABASE = {
  'p-mine-1': {
    id: 'p-mine-1',
    title: 'Ultimate Economy & Multi-Vault Pro',
    authorName: 'MinoDeveloper',
    gameName: 'Minecraft',
    price: '4.99',
    rating: '5.0',
    reviewsCount: 0,
    downloads: 0,
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
      <h3>Minecraft Economy & Banking Engine (Paper / Purpur / Folia 1.20 - 1.21)</h3>
      <p>The premier economy, multi-vault, and player auction house plugin engineered for high-concurrency Minecraft networks. Built with asynchronous thread safety to eliminate server tick lag even with hundreds of concurrent transactions.</p>
      <br/>
      <h4>⚡ Core Engine Features</h4>
      <ul>
        <li><strong>Multi-Currency System:</strong> Configure distinct wallet pools (Coins, Mob Tokens, Bank Credits, Vouchers) with custom formatting symbols.</li>
        <li><strong>Interactive Chest GUI ATMs:</strong> DonutSMP & EconomySMP style 54-slot visual banking interface with 4-digit PIN security to prevent account theft.</li>
        <li><strong>Automated Bank Interest:</strong> Customizable compound savings interest distributed hourly or daily to active bank deposits.</li>
        <li><strong>Integrated Auction House (AH):</strong> Full BIN (Buy It Now) and bidding marketplace with sales tax deduction and search filters.</li>
        <li><strong>Cross-Server Sync:</strong> Instant MySQL & PostgreSQL connection pooling with Redis caching for multi-proxy Velocity/BungeeCord networks.</li>
        <li><strong>100% Vault Hook:</strong> Drop-in replacement for EssentialsX Economy with instant compatibility across 100+ shop and claim plugins.</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-emerald-200 text-xs">
        <strong>⚡ Quick Setup Guide:</strong> Copy the <code>UltimateEconomy</code> folder into your server's <code>/plugins</code> directory, make sure <code>Vault</code> is installed, and run <code>/eco reload</code>!
      </div>
      <h4>Step-by-Step Installation (README.txt)</h4>
      <ol>
        <li><strong>Prerequisites:</strong> Ensure your server is running Paper, Purpur, Spigot, or Folia (1.18.2 - 1.21.x) with <a href="https://www.spigotmc.org/resources/vault.34315/" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline">Vault</a> installed.</li>
        <li><strong>Place Plugin:</strong> Extract and place <code>UltimateEconomy</code> (or <code>UltimateEconomy.jar</code>) into your server's <code>/plugins/</code> directory.</li>
        <li><strong>Start Server:</strong> Start your Minecraft server to automatically generate <code>config.yml</code> and the SQLite database.</li>
        <li><strong>Configuration:</strong> Customize starting balances, interest rates, and currency symbols in <code>plugins/UltimateEconomy/config.yml</code>.</li>
        <li><strong>Reload:</strong> Run <code>/eco reload</code> in-game or console to apply your changes with zero downtime!</li>
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
            <td class="p-2.5 font-mono text-emerald-400">/bank pin &lt;set|change&gt; &lt;####&gt;</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.bank.pin</td>
            <td class="p-2.5">Configure 4-digit security PIN for ATM withdrawals</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/ah [search query]</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.ah.use</td>
            <td class="p-2.5">Open global Auction House & player marketplace</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/ah sell &lt;price&gt;</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.ah.sell</td>
            <td class="p-2.5">List held item on Auction House with optional tax fee</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">/eco baltop [page]</td>
            <td class="p-2.5 text-blue-400 font-semibold">mino.eco.baltop</td>
            <td class="p-2.5">View server-wide leaderboard of the wealthiest players</td>
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
# Generated by MinoForge • https://colasmp.net

database:
  type: "SQLITE" # Options: SQLITE, MYSQL, POSTGRESQL
  host: "localhost"
  port: 3306
  database: "minecraft_eco"
  username: "root"
  password: "password123"
  pool-size: 10

currency:
  name-singular: "Coin"
  name-plural: "Coins"
  symbol: "$"
  starting-balance: 250.00
  allow-negative-balance: false
  format: "$#,##0.00"

banking:
  enabled: true
  max-accounts-per-player: 3
  daily-interest-rate: 0.015 # 1.5% daily compound interest
  interest-payout-interval-hours: 1
  require-pin-on-atm: true

auction-house:
  enabled: true
  listing-fee-percentage: 0.02 # 2% sales tax
  max-active-listings: 10
  listing-duration-hours: 48
`
  },
  'p-fivem-2': {
    id: 'p-fivem-2',
    title: 'Advanced Fuel & Electric Charging System',
    authorName: 'FiveMDev_99',
    gameName: 'FiveM',
    price: '3.49',
    rating: '5.0',
    reviewsCount: 0,
    downloads: 0,
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
      <h3>Next-Gen Vehicle Refueling & EV Supercharging (FiveM Lua 5.4)</h3>
      <p>An automotive refueling simulation and electric charging infrastructure package designed for immersive roleplay servers. Hyper-optimized to maintain an impeccable 0.00ms idle resmon.</p>
      <br/>
      <h4>⚡ Core Engine Features</h4>
      <ul>
        <li><strong>RPM-Based Dynamic Fuel Consumption:</strong> Calculates gas consumption dynamically based on engine acceleration, gear shifting, vehicle class, and damages.</li>
        <li><strong>Electric Vehicle (EV) Superchargers:</strong> Auto-detects EV sports cars (Raiden, Neon, Cyclone, Omnis e-GT) with realistic charging audio effects.</li>
        <li><strong>Interactive Nozzle & Hose Physics:</strong> Grab the pump nozzle, walk up to the gas cap, and insert it with synced multi-player animations and sound effects.</li>
        <li><strong>Roadside Jerry Cans:</strong> Buy portable 25L Jerry cans from 24/7 convenience stores to rescue stranded cars on highways.</li>
        <li><strong>Fuel Siphoning Theft:</strong> Criminals can use siphon hoses with lockpick minigames to steal gasoline from parked vehicles.</li>
        <li><strong>Multi-Framework Compatibility:</strong> Auto-detects QBCore, ESX Legacy, QBox, and standalone setups with ox_target and qb-target support.</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-orange-500/15 border border-orange-400/30 rounded-xl text-orange-200 text-xs">
        <strong>⚡ Quick FiveM Setup:</strong> Place <code>advanced_fuel</code> into your <code>resources/[standalone]/</code> folder and add <code>ensure advanced_fuel</code> to your <code>server.cfg</code>!
      </div>
      <h4>Step-by-Step Installation (README.txt)</h4>
      <ol>
        <li><strong>Prerequisites:</strong> Ensure you have <a href="https://github.com/overextended/ox_lib" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline">ox_lib</a> and <code>ox_target</code> or <code>qb-target</code> installed.</li>
        <li><strong>Extract Resource:</strong> Extract <code>advanced_fuel</code> into your server's <code>resources/[standalone]/advanced_fuel</code> directory.</li>
        <li><strong>Server Configuration:</strong> Open your <code>server.cfg</code> and ensure the loading order:
          <pre class="bg-black/40 p-2 rounded text-xs mt-1 font-mono text-slate-300">ensure ox_lib
ensure advanced_fuel</pre>
        </li>
        <li><strong>Configuration:</strong> Open <code>config.lua</code> to adjust fuel prices, gas station Blips, and EV car model lists.</li>
        <li><strong>Restart:</strong> Restart your server or run <code>refresh</code> and <code>ensure advanced_fuel</code> in server console!</li>
      </ol>
    `,
    commands: `
      <h4>All Available Commands, Keybinds & Exports</h4>
      <table class="w-full text-left text-xs border border-white/10 mt-2 rounded-lg overflow-hidden">
        <thead class="bg-slate-800 text-slate-300">
          <tr>
            <th class="p-2.5 border-b border-white/10">Command / Keybind / Export</th>
            <th class="p-2.5 border-b border-white/10">Scope</th>
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
            <td class="p-2.5 font-mono text-orange-400">/givejerrycan [player] [liters]</td>
            <td class="p-2.5 text-amber-400 font-semibold">Admin Only</td>
            <td class="p-2.5">Spawn a portable fuel jerry can item for target player</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">[E] Keybind</td>
            <td class="p-2.5 text-blue-400 font-semibold">Player Action</td>
            <td class="p-2.5">Hold to grab pump nozzle and refuel vehicle tank</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-emerald-400">[G] Keybind</td>
            <td class="p-2.5 text-blue-400 font-semibold">Player Action</td>
            <td class="p-2.5">Use portable Jerry can to add 25L of emergency fuel</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-cyan-400">exports['advanced_fuel']:GetFuel(veh)</td>
            <td class="p-2.5 text-purple-400 font-semibold">Lua Export</td>
            <td class="p-2.5">Returns vehicle fuel level as float (0.0 to 100.0)</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-cyan-400">exports['advanced_fuel']:SetFuel(veh, val)</td>
            <td class="p-2.5 text-purple-400 font-semibold">Lua Export</td>
            <td class="p-2.5">Programmatically modify vehicle fuel level</td>
          </tr>
        </tbody>
      </table>
    `,
    configSample: `-- FiveM Fuel & EV Charging Configuration (config.lua)
-- Framework: QBCore / ESX Legacy / Standalone

Config = {}
Config.Framework = 'qb' -- 'qb', 'esx', or 'standalone'
Config.Target = 'ox_target' -- 'ox_target' or 'qb-target'

Config.FuelPrice = 1.75 -- Price per Liter (USD)
Config.JerryCanCapacity = 25.0 -- Liters
Config.JerryCanPrice = 150.0 -- Shop Purchase Price
Config.RefuelSpeed = 1.5 -- Liters per second

-- Electric Vehicles Whitelist
Config.ElectricVehicles = {
    'raiden',
    'neon',
    'cyclone',
    'cyclone2',
    'iwagen',
    'tezeract',
    'omnisegt'
}

-- Station Blip Settings
Config.Blip = {
    Show = true,
    Sprite = 361,
    Scale = 0.6,
    Color = 47,
    Name = "Gas Station"
}
`
  },
  'p-bot-3': {
    id: 'p-bot-3',
    title: 'Discord Ticket & Transcripts Bot',
    authorName: 'BotCrafter',
    gameName: 'Discord',
    price: '0.00',
    rating: '5.0',
    reviewsCount: 0,
    downloads: 0,
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
      <h3>Automated Support Desk & HTML Archiving (Discord.js v14)</h3>
      <p>A support ticketing bot built for gaming servers, marketplaces, and developer communities. Replaces unorganized direct messages with clean, private channels with automatic HTML transcript generation.</p>
      <br/>
      <h4>⚡ Core Engine Features</h4>
      <ul>
        <li><strong>1-Click Button & Modal Panel:</strong> Deploy interactive panels in <code>#support</code> with modal forms requesting user issue summaries.</li>
        <li><strong>Self-Hosted HTML Transcripts:</strong> On ticket closure, exports complete visual HTML archives with message history, embeds, attachments, and timestamps to <code>#ticket-logs</code>.</li>
        <li><strong>Role-Based Privacy:</strong> Automatic permission overwrites ensuring only assigned Support Staff and the ticket creator can view channel messages.</li>
        <li><strong>Staff Performance Star Ratings:</strong> Prompts the user for 1-5 star staff satisfaction reviews upon ticket resolution.</li>
        <li><strong>Idle Ticket Auto-Close:</strong> Automatically warns and closes inactive tickets after 24 hours without moderator activity.</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-blue-500/15 border border-blue-400/30 rounded-xl text-blue-200 text-xs">
        <strong>⚡ Quick 1-Click Setup:</strong> Run the <code>install.bat</code> file inside the zip to download everything automatically, then just configure your bot in <code>config.example.json</code>!
      </div>
      <h4>Step-by-Step Installation Guide (README.txt)</h4>
      <ol>
        <li><strong>1-Click Install:</strong> Double click <code>install.bat</code> (or run <code>npm install</code> in terminal).</li>
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
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket stats [@staff]</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">View ticket resolution volume and average star rating</td>
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
  "askFeedbackOnClose": true,
  "autoCloseInactiveHours": 24
}
`
  },
  'p-2b2t-1': {
    id: 'p-2b2t-1',
    title: '2b2t Anarchy Utility & Baritone Auto-Highway Builder',
    authorName: 'AnarchyDev_2b',
    gameName: 'Minecraft: 2b2t & Anarchy Clients',
    price: '0.00',
    rating: '5.0',
    reviewsCount: 0,
    downloads: 0,
    version: 'v3.2.0-Fabric',
    lastUpdated: 'Yesterday',
    category: '2b2t Hacked Clients & Addons',
    coverImageUrl: '/images/plugins/minecraft_anarchy_highway.svg',
    screenshots: [
      '/images/plugins/minecraft_anarchy_highway.svg'
    ],
    downloadUrl: '/downloads/2b2t_Anarchy_Utility_v3.2.0.zip',
    summary: 'High-speed Baritone Nether highway builder, Auto-Totem, GrimAC bypasses, PacketFly, and terrain stash finder for 2b2t.org.',
    overview: `
      <h3>2b2t Anarchy Survival & Construction Utility (Fabric 1.20 - 1.21)</h3>
      <p>A specialized utility mod built specifically for 2b2t.org, Constantiam, and vanilla anarchy servers. Tested against strict GrimAC and NoCheatPlus anti-cheat updates.</p>
      <br/>
      <h4>⚡ Core Utility Modules</h4>
      <ul>
        <li><strong>Automated Baritone Highway Digger:</strong> Automated pathfinder that clears Nether obstacles, places obsidian floors, auto-bridges over lava oceans, and repairs broken highway blocks at 18.4 blocks/sec.</li>
        <li><strong>0-Tick Offhand Auto-Totem:</strong> Instant inventory totem replenishment with strict inventory desync protection.</li>
        <li><strong>2b2t ElytraFly & PacketFly:</strong> Custom pitch and speed bypasses tuned to remain below 2b2t rubberband velocity thresholds.</li>
        <li><strong>Chunk Stash & Shulker Finder:</strong> Scans chunk block entity payloads to detect buried dupe stashes, chests, and player bases across millions of coordinates.</li>
        <li><strong>Obsidian Surround & Anti-CevBreaker:</strong> Instant obsidian defensive cocoon placement with packet rotation bypass.</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-purple-500/15 border border-purple-400/30 rounded-xl text-purple-200 text-xs">
        <strong>⚡ Quick Fabric Setup:</strong> Place the mod jar into your <code>.minecraft/mods</code> folder with Fabric Loader 1.20.4 or 1.21 installed!
      </div>
      <h4>Step-by-Step Installation (README.txt)</h4>
      <ol>
        <li><strong>Prerequisites:</strong> Install <a href="https://fabricmc.net/" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline">Fabric Loader</a> (1.20.4 or 1.21) and Fabric API.</li>
        <li><strong>Place Mod:</strong> Extract and place <code>2b2t-Anarchy-Utility-3.2.0.jar</code> into your <code>.minecraft/mods</code> directory.</li>
        <li><strong>Launch Game:</strong> Start your Minecraft launcher and join your favorite anarchy server.</li>
        <li><strong>ClickGUI:</strong> Press <kbd class="px-1.5 py-0.5 bg-slate-800 border border-white/20 rounded font-mono text-purple-300">RSHIFT</kbd> or type <code>.help</code> in chat to configure modules!</li>
      </ol>
    `,
    commands: `
      <h4>All Available Chat Commands & Keybinds</h4>
      <table class="w-full text-left text-xs border border-white/10 mt-2 rounded-lg overflow-hidden">
        <thead class="bg-slate-800 text-slate-300">
          <tr>
            <th class="p-2.5 border-b border-white/10">Command / Keybind</th>
            <th class="p-2.5 border-b border-white/10">Module</th>
            <th class="p-2.5 border-b border-white/10">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-slate-300">
          <tr>
            <td class="p-2.5 font-mono text-purple-400">.highway &lt;X|Z&gt; &lt;distance&gt;</td>
            <td class="p-2.5 text-cyan-400 font-semibold">Baritone</td>
            <td class="p-2.5">Start automated Nether highway excavation and obsidian paving</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-purple-400">.highway pause | resume</td>
            <td class="p-2.5 text-cyan-400 font-semibold">Baritone</td>
            <td class="p-2.5">Temporarily pause or resume highway construction</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-purple-400">.stash scan [radius]</td>
            <td class="p-2.5 text-emerald-400 font-semibold">StashFinder</td>
            <td class="p-2.5">Scan loaded chunk entities for dupe stashes and hidden chests</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-purple-400">.packetfly mode &lt;grim|ncp&gt;</td>
            <td class="p-2.5 text-blue-400 font-semibold">PacketFly</td>
            <td class="p-2.5">Select anti-cheat bypass profile for vertical phasing</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-purple-400">[R] Keybind</td>
            <td class="p-2.5 text-yellow-400 font-semibold">Surround</td>
            <td class="p-2.5">Toggle instant obsidian 360-degree defensive surround</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-purple-400">[G] Keybind</td>
            <td class="p-2.5 text-purple-400 font-semibold">ElytraFly</td>
            <td class="p-2.5">Toggle 2b2t speed-locked infinite Elytra flight</td>
          </tr>
        </tbody>
      </table>
    `,
    configSample: `# 2b2t Anarchy Utility Configuration (config.json)
{
  "modules": {
    "auto_totem": {
      "enabled": true,
      "health_threshold": 14.0,
      "strict_inventory_sync": true
    },
    "highway_builder": {
      "tunnel_width": 3,
      "tunnel_height": 3,
      "auto_bridge_lava": true,
      "bridge_material": "OBSIDIAN",
      "auto_eat": true
    },
    "bypasses": {
      "grim_packet_sync": true,
      "anti_velocity_bypass": true,
      "fast_break_tick_delay": 0
    }
  }
}
`
  }
};

const PluginDetailPage = () => {
  const { id } = useParams();
  const { addToCart, isInCart, setIsCheckoutOpen } = useCart();
  const { formatPrice } = useCurrency();
  const [userLicense, setUserLicense] = useState(null);
  const [copiedLic, setCopiedLic] = useState(false);

  useEffect(() => {
    try {
      const licenses = JSON.parse(localStorage.getItem('minoforge_licenses') || '[]');
      const found = licenses.find(l => l.pluginId === id || l.pluginTitle === plugin?.title);
      if (found) setUserLicense(found);
    } catch {}
  }, [id, plugin]);

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
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/plugins" className="hover:text-blue-400">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium truncate">{plugin.title}</span>
        </div>

        {/* Flash Sale Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-red-500/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-300 tracking-wide block">
                🔥 Summer Launch Flash Sale — 20% OFF
              </span>
              <span className="text-[11px] text-slate-300">
                Use promo code <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-mono font-bold">MINO20</code> in your cart!
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>05h : 22m : 14s remaining</span>
          </div>
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
                
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md rounded-xl text-[10px] font-black uppercase flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>FEATURED RESOURCE</span>
                  </span>
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
                    <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
                      <span>Developed by</span>
                      <Link to={`/users/${plugin.authorName}`} className="text-blue-400 font-bold hover:underline">
                        {plugin.authorName}
                      </Link>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        <span>Verified Creator</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-emerald-400">
                      {formatPrice(plugin.price)}
                    </span>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <strong className="text-white text-sm">{plugin.rating}</strong>
                    <span className="text-slate-400">({plugin.reviewsCount || 12} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-400" />
                    <strong className="text-white text-sm">{(plugin.downloads || 284).toLocaleString()}</strong>
                    <span className="text-slate-400">downloads</span>
                  </div>
                  <MinoShieldBadge />
                </div>
              </div>
            </div>

            {/* Multi-Tab Documentation & BuiltByBit Suite Hub */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 md:p-8">
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 pb-6 border-b border-white/10">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'compatibility', label: '🎮 Compatibility Matrix' },
                  { id: 'screenshots', label: '📸 In-Game Visuals' },
                  { id: 'changelog', label: '📜 Version Changelog' },
                  { id: 'commands', label: 'Commands & Perms' },
                  { id: 'config', label: 'Sample Config' },
                  { id: 'minoshield', label: '🛡️ MinoShield™ Scan' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
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

                {/* Compatibility Matrix Tab */}
                {activeTab === 'compatibility' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        <span>Platform Compatibility &amp; Requirements</span>
                      </h3>
                      <p className="text-xs text-slate-400">Verified tested runtime environments for this resource.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Game Versions */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
                          <Layers className="w-4 h-4" />
                          <span>Tested Game Versions</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['1.8.8', '1.12.2', '1.16.5', '1.18.2', '1.20.4', '1.21.x'].map(v => (
                            <span key={v} className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-xs font-mono font-bold">
                              ✓ {v}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Server Software */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
                          <Cpu className="w-4 h-4" />
                          <span>Server Engines</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['Paper', 'Purpur', 'Velocity', 'Folia', 'BungeeCord', 'Spigot'].map(s => (
                            <span key={s} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-xs font-semibold">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Java Runtime */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                          <Zap className="w-4 h-4" />
                          <span>Java Runtimes</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['Java 17 (LTS)', 'Java 21 (Recommended)', 'Java 8+'].map(j => (
                            <span key={j} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-semibold">
                              ✓ {j}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Changelog Tab */}
                {activeTab === 'changelog' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-400" />
                        <span>Release History &amp; Changelogs</span>
                      </h3>
                      <p className="text-xs text-slate-400">All published updates and improvements for this plugin.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Latest Release */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white font-mono">{plugin.version || 'v2.4.0'}</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                              Latest Stable
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">Released 2 days ago</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">FEATURE</span>
                            <span>Added multi-vault 54-slot ATM visual banking GUI with 4-digit PIN lock.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">OPTIMIZE</span>
                            <span>Refactored async MySQL connection pool for Folia multi-threaded regions.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">BUGFIX</span>
                            <span>Fixed decimal rounding discrepancy during cross-proxy server transfers.</span>
                          </li>
                        </ul>
                      </div>

                      {/* v2.3.0 */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white font-mono">v2.3.0</span>
                          </div>
                          <span className="text-xs text-slate-500">Released 3 weeks ago</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">FEATURE</span>
                            <span>Integrated global player Auction House with sales tax deduction.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">BUGFIX</span>
                            <span>Resolved SQLite lock conflict during concurrent server restarts.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* MinoShield Security Report Tab */}
                {activeTab === 'minoshield' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span>MinoShield™ Decompilation &amp; Malware Report</span>
                      </h3>
                      <p className="text-xs text-slate-400">Automated static bytecode analysis &amp; security verification.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">VirusTotal &amp; Signatures</span>
                        <div className="text-2xl font-black text-emerald-400">0 / 70 Clean</div>
                        <p className="text-[11px] text-slate-400">Zero malicious class injections or backdoors detected.</p>
                      </div>

                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Bytecode Integrity</span>
                        <div className="text-sm font-mono text-cyan-300 truncate">SHA256: 8f9b4c1... verified</div>
                        <p className="text-[11px] text-emerald-400 font-semibold">✓ Package matches author original build</p>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-slate-300 space-y-2">
                      <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>MinoForge Security Guarantee</span>
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Every resource uploaded to MinoForge passes through our automated bytecode decompilation pipeline to ensure zero forced OP commands, unauthorized token stealers, or external webhooks.
                      </p>
                    </div>
                  </div>
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
                        </div>
                      ))}
                    </div>
                  </div>
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

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* Purchase / Download Card */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl sticky top-24 space-y-4">
              
              {/* User License Key (If previously purchased) */}
              {userLicense && (
                <div className="p-3.5 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-cyan-300 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Your Active License</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(userLicense.licenseKey);
                        setCopiedLic(true);
                        setTimeout(() => setCopiedLic(false), 2000);
                      }}
                      className="text-xs text-slate-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedLic ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-400 select-all truncate">
                    {userLicense.licenseKey}
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              {!isFree ? (
                <div className="space-y-2.5">
                  <button 
                    onClick={() => {
                      addToCart(plugin, false);
                      setIsCheckoutOpen(true);
                    }}
                    className="btn-glow-blue btn-shimmer btn-animated w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Instant Pay Simulator ({formatPrice(plugin.price)})</span>
                  </button>

                  <button 
                    onClick={() => addToCart(plugin, true)}
                    className="btn-animated w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span>{isInCart(plugin.id) ? 'In Cart • View Cart' : 'Add to Shopping Cart'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button 
                    onClick={handleDownload}
                    className="btn-glow-blue btn-shimmer btn-animated w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                  >
                    {downloadSuccess ? <Check className="w-5 h-5 text-white" /> : <Download className="w-5 h-5" />}
                    <span>{downloadSuccess ? 'Downloaded!' : 'Download Free Package (.zip)'}</span>
                  </button>

                  <button 
                    onClick={() => addToCart(plugin, true)}
                    className="btn-animated w-full py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    <span>{isInCart(plugin.id) ? 'In Cart • View Cart' : 'Add Free Item to Cart'}</span>
                  </button>
                </div>
              )}

              {/* Direct 1-on-1 Chat with Creator for Support / Refund Button */}
              <Link
                to={`/chats?creator=${plugin.authorName || 'MinoDeveloper'}&plugin=${encodeURIComponent(plugin.title)}`}
                className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all group cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Chat with Owner (Support &amp; Refunds)</span>
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
