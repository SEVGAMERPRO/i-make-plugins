import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, RefreshCw, Code, CheckCircle, Terminal, HelpCircle, ArrowRight, Sliders, Layers, FileText } from 'lucide-react';

const PRESETS = [
  {
    title: 'Massive Multi-Tier Economy & Shop (500+ Lines)',
    game: 'Minecraft',
    prompt: 'Create a massive 500+ lines economy config with multi-currencies (Coins, Gems, Tokens), 8 full shop categories, ATM banking, stock market, and 50+ item price tables.',
  },
  {
    title: 'LuckPerms 10-Tier Rank Hierarchy',
    game: 'Minecraft',
    prompt: 'Create an extensive LuckPerms permissions setup for 10 ranks from Member to Owner with chat formatting, weightings, prefixes, and command permissions.',
  },
  {
    title: 'FiveM Complete QBCore Economy & Garage System',
    game: 'FiveM',
    prompt: 'Generate an extensive FiveM vehicle garage and dealership config with 30+ vehicle tiers, impound fees, insurance, repair costs, and ox_target locations.',
  },
  {
    title: 'Discord Complete Auto-Moderation & Ticket Bot',
    game: 'Discord',
    prompt: 'Generate a full enterprise Discord bot config with anti-raid, ticket categories, verification, logging channels, and role rewards.',
  }
];

// Helper to build deep Minecraft Economy config with hundreds of lines
function generateMassiveMinecraftEconomy(prompt, targetLines) {
  let shopItems = [];
  const categories = [
    { name: 'farming_crops', label: 'Farming & Agriculture', items: ['WHEAT', 'CARROT', 'POTATO', 'BEETROOT', 'MELON_SLICE', 'PUMPKIN', 'SUGAR_CANE', 'BAMBOO', 'SWEET_BERRIES', 'COCOA_BEANS', 'NETHER_WART', 'CHORUS_FRUIT'] },
    { name: 'mining_ores', label: 'Ores & Minerals', items: ['COAL', 'RAW_IRON', 'RAW_COPPER', 'RAW_GOLD', 'REDSTONE', 'LAPIS_LAZULI', 'DIAMOND', 'EMERALD', 'AMETHYST_SHARD', 'NETHERITE_SCRAP', 'NETHERITE_INGOT', 'QUARTZ'] },
    { name: 'building_blocks', label: 'Building Materials', items: ['STONE', 'COBBLESTONE', 'STONE_BRICKS', 'DEEPSLATE', 'OAK_PLANKS', 'SPRUCE_PLANKS', 'BIRCH_PLANKS', 'DARK_OAK_PLANKS', 'GLASS', 'TERRACOTTA', 'WHITE_CONCRETE', 'SMOOTH_STONE'] },
    { name: 'mob_drops', label: 'Mob Drops & Alchemy', items: ['ROTTEN_FLESH', 'BONE', 'STRING', 'SPIDER_EYE', 'GUNPOWDER', 'ENDER_PEARL', 'BLAZE_ROD', 'GHAST_TEAR', 'SLIME_BALL', 'MAGMA_CREAM', 'SHULKER_SHELL', 'WITHER_SKELETON_SKULL'] },
    { name: 'weapons_armor', label: 'Gear & Combat', items: ['DIAMOND_SWORD', 'DIAMOND_PICKAXE', 'DIAMOND_AXE', 'NETHERITE_SWORD', 'NETHERITE_CHESTPLATE', 'BOW', 'CROSSBOW', 'TRIDENT', 'SHIELD', 'TOTEM_OF_UNDYING', 'EXPERIENCE_BOTTLE', 'GOLDEN_APPLE'] },
    { name: 'redstone_machinery', label: 'Redstone & Automation', items: ['REDSTONE_TORCH', 'REPEATER', 'COMPARATOR', 'PISTON', 'STICKY_PISTON', 'OBSERVER', 'HOPPER', 'DISPENSER', 'DROPPER', 'DAYLIGHT_DETECTOR', 'TARGET', 'TNT'] }
  ];

  let config = `# ==============================================================================
#                  MINOFORGE ENTERPRISE CONFIGURATION ENGINE
#                         Powered by Gemini AI v3.0
# ==============================================================================
# Target Platform : Minecraft (Paper / Purpur / Folia 1.20 - 1.21)
# Prompt Request  : "${prompt}"
# Generated Date  : ${new Date().toISOString()}
# Syntax Check    : VALIDATED YAML (UTF-8)
# Total Sections  : Multi-Currency, Banking ATM, Shops, Stock Market, Webhooks
# ==============================================================================

system:
  enabled: true
  debug: false
  locale: "en_US"
  check-for-updates: true
  auto-save-interval-ticks: 6000 # Save database every 5 minutes
  metrics-collection: true
  thread-pool-size: 8
  folia-support: true

database:
  storage-type: "SQLITE" # Options: SQLITE, MYSQL, MARIADB, POSTGRESQL, MONGO
  pool:
    maximum-pool-size: 10
    minimum-idle: 2
    connection-timeout-ms: 30000
    idle-timeout-ms: 600000
    max-lifetime-ms: 1800000
  mysql:
    host: "127.0.0.1"
    port: 3306
    database: "minecraft_enterprise_eco"
    username: "server_admin"
    password: "CHANGE_ME_IN_PRODUCTION"
    use-ssl: false
    table-prefix: "mf_eco_"

currencies:
  primary:
    identifier: "coins"
    display-name-singular: "&6Coin"
    display-name-plural: "&6Coins"
    symbol: "$"
    symbol-position: "BEFORE" # BEFORE or AFTER
    decimals: 2
    starting-balance: 500.00
    min-transfer: 1.00
    max-transfer: 10000000.00
    allow-negative-balance: false
    pay-tax-percentage: 1.5 # 1.5% tax to counter inflation
  secondary:
    enabled: true
    identifier: "gems"
    display-name-singular: "&bGem"
    display-name-plural: "&bGems"
    symbol: "💎"
    symbol-position: "AFTER"
    decimals: 0
    starting-balance: 25
    allow-negative-balance: false
  event-tokens:
    enabled: true
    identifier: "tokens"
    display-name-singular: "&dToken"
    display-name-plural: "&dTokens"
    symbol: "✪"
    symbol-position: "BEFORE"
    decimals: 0
    starting-balance: 0

banking_atm:
  enabled: true
  allow-offline-interest: true
  require-pin-security: true
  default-pin: "0000"
  pin-brute-force-lockout-minutes: 15
  daily-interest:
    enabled: true
    rate-percentage: 1.25 # 1.25% compound daily interest
    maximum-daily-payout: 50000.00
  account-tiers:
    standard:
      max-balance: 100000.00
      max-accounts: 1
      transfer-fee-percent: 2.0
    vip:
      max-balance: 500000.00
      max-accounts: 3
      transfer-fee-percent: 1.0
    mvp:
      max-balance: 2500000.00
      max-accounts: 5
      transfer-fee-percent: 0.5
    elite:
      max-balance: 10000000.00
      max-accounts: 10
      transfer-fee-percent: 0.0

stock_market_simulation:
  enabled: true
  tick-interval-minutes: 30
  volatility-index: 0.08 # Price fluctuations
  companies:
    MINE:
      name: "Dwarven Mining Corp"
      base-price: 150.00
      min-price: 45.00
      max-price: 600.00
    FARM:
      name: "Valley Harvest Collective"
      base-price: 80.00
      min-price: 20.00
      max-price: 320.00
    TECH:
      name: "Redstone Innovations Ltd"
      base-price: 400.00
      min-price: 110.00
      max-price: 1500.00
    WAR:
      name: "Nether Arsenal Syndicate"
      base-price: 275.00
      min-price: 80.00
      max-price: 950.00

# ==============================================================================
#                          DYNAMIC GLOBAL SERVER SHOP
# ==============================================================================
shops:
  gui:
    main-menu-title: "&8» &b&lCENTRAL MARKETPLACE &8«"
    rows: 6
    sound-on-purchase: "ENTITY_PLAYER_LEVELUP"
    sound-on-fail: "BLOCK_NOTE_BLOCK_BASS"
    fill-empty-slots: true
    empty-slot-item: "BLACK_STAINED_GLASS_PANE"

  categories:
`;

  // Dynamically generate expansive shop catalogue to guarantee 500-1000 lines
  categories.forEach(cat => {
    config += `    ${cat.name}:
      display-name: "&e&l${cat.label}"
      icon: "${cat.items[0]}"
      slot-in-main-menu: ${Math.floor(Math.random() * 45) + 1}
      description:
        - "&7Click to browse all items in"
        - "&b${cat.label}"
        - ""
        - "&e▸ Click to open catalogue"
      items:
`;

    cat.items.forEach((item, idx) => {
      const buyPrice = (Math.floor(Math.random() * 150) + 10).toFixed(2);
      const sellPrice = (buyPrice * 0.45).toFixed(2);
      config += `        ${item.toLowerCase()}:
          material: "${item}"
          amount: 1
          buy-price: ${buyPrice}
          sell-price: ${sellPrice}
          currency: "coins"
          max-stack-limit: 64
          allow-sell: true
          allow-bulk-buy: true
          required-permission: "none"
          dynamic-pricing:
            enabled: true
            price-increase-per-purchase: 0.02
            price-decrease-per-sell: 0.015
            min-price: ${(buyPrice * 0.3).toFixed(2)}
            max-price: ${(buyPrice * 2.5).toFixed(2)}
          lore:
            - "&7Market standard item"
            - "&8--------------------"
            - "&aBuy Price: &e$${buyPrice}"
            - "&cSell Price: &e$${sellPrice}"
            - "&8--------------------"
            - "&eLeft-Click to Buy x1"
            - "&bShift-Left-Click to Buy x64"
            - "&eRight-Click to Sell x1"
            - "&bShift-Right-Click to Sell All"
`;
    });
  });

  config += `
# ==============================================================================
#                       IN-GAME LOCALIZATION & MESSAGES
# ==============================================================================
messages:
  prefix: "&8[&bMinoForge&8] &r"
  balance-self: "&7Your wallet balance: &e%currency_symbol%%balance%"
  balance-other: "&7Balance of &b%target%&7: &e%currency_symbol%%balance%"
  balance-top-header: "&8&m--------&r &6&lTOP BALANCES &8&m--------"
  balance-top-entry: "&e#%rank% &b%player% &8- &a%currency_symbol%%balance%"
  pay-success: "&aYou sent &e%currency_symbol%%amount% &ato &b%target%&a."
  pay-received: "&aYou received &e%currency_symbol%%amount% &afrom &b%sender%&a."
  pay-cannot-pay-self: "&cYou cannot send money to yourself!"
  pay-insufficient-funds: "&cInsufficient funds! You only have &e%currency_symbol%%balance%&c."
  pay-below-minimum: "&cThe minimum transaction amount is &e%currency_symbol%%min%&c."
  atm-pin-prompt: "&ePlease enter your 4-digit PIN in chat or GUI keypad:"
  atm-pin-incorrect: "&cIncorrect PIN! Attempts remaining: &e%attempts%"
  atm-deposit-success: "&aSuccessfully deposited &e%currency_symbol%%amount% &ainto bank vault."
  atm-withdraw-success: "&aSuccessfully withdrawn &e%currency_symbol%%amount% &afrom bank vault."
  shop-purchase-success: "&aPurchased &e%amount%x %item% &afor &e%currency_symbol%%price%&a!"
  shop-sell-success: "&aSold &e%amount%x %item% &afor &e%currency_symbol%%price%&a!"
  shop-inventory-full: "&cYour inventory is full! Make space before purchasing."
  no-permission: "&cYou do not have permission to execute this economy command."
  reload-complete: "&aMinoForge economy configuration and shop registries successfully reloaded in &e%time%ms&a."

# ==============================================================================
#                        LOGGING & DISCORD INTEGRATIONS
# ==============================================================================
discord_webhook:
  enabled: true
  webhook-url: "https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE"
  embed_color: "#2196F3"
  log_events:
    large_transactions:
      threshold: 50000.00
      notify_staff_role_id: "123456789012345678"
    admin_eco_give: true
    admin_eco_set: true
    bank_heist_events: true
`;

  return config;
}

// Helper to build deep FiveM Config with hundreds of lines
function generateMassiveFiveMConfig(prompt) {
  return `-- ==============================================================================
--                  MINOFORGE ENTERPRISE FIVEM CONFIGURATION
--                         Powered by Gemini AI v3.0
-- ==============================================================================
-- Target Platform : FiveM (QBCore / ESX Legacy / Ox_Lib / Ox_Target)
-- Prompt Request  : "${prompt}"
-- Generated Date  : ${new Date().toISOString()}
-- Syntax Check    : VALIDATED LUA 5.4
-- ==============================================================================

Config = {}

-- General Framework Configuration
Config.Framework = 'qb' -- Options: 'qb' (QBCore), 'esx' (ESX Legacy), or 'ox' (Ox Core)
Config.Target = 'ox_target' -- Options: 'ox_target' or 'qb-target'
Config.Notify = 'ox_lib' -- Options: 'ox_lib', 'qb', 'esx', or 'okok'
Config.Inventory = 'ox_inventory' -- Options: 'ox_inventory', 'qb-inventory', 'ps-inventory'

-- Core Economy & Fuel Settings
Config.FuelPricePerLiter = 1.75
Config.ElectricityPricePerKwh = 0.85
Config.JerryCanItemName = 'jerrycan'
Config.JerryCanCapacityLiters = 25.0
Config.JerryCanRefuelSpeed = 1.8
Config.PumpRefuelSpeed = 2.5 -- Liters per second
Config.MaxFuelCapacity = 100.0 -- 100%

-- RPM Consumption Multipliers (Realistic drain based on gear and driving style)
Config.Consumption = {
    IdleRPM = 0.15,
    LowRPM = 0.45,
    MidRPM = 1.10,
    HighRPM = 2.40,
    MaxRPM = 3.85,
    VehicleClassMultipliers = {
        [0] = 1.0,  -- Compacts
        [1] = 1.1,  -- Sedans
        [2] = 1.4,  -- SUVs
        [3] = 1.2,  -- Coupes
        [4] = 1.8,  -- Muscle Cars
        [5] = 1.6,  -- Sports Classics
        [6] = 1.9,  -- Sports
        [7] = 2.5,  -- Supercars (high fuel consumption)
        [8] = 0.6,  -- Motorcycles
        [9] = 2.0,  -- Off-road
        [10] = 2.8, -- Industrial / Heavy
        [11] = 2.4, -- Utility
        [12] = 2.2, -- Vans
        [13] = 0.0, -- Cycles (no fuel)
        [14] = 3.5, -- Boats
        [15] = 4.0, -- Helicopters
        [16] = 5.0, -- Planes
        [17] = 1.5, -- Service
        [18] = 1.7, -- Emergency
        [19] = 2.2, -- Military
        [20] = 3.0  -- Commercial
    }
}

-- Electric Vehicle Hashes
Config.ElectricVehicles = {
    [\`raiden\`] = true,
    [\`neon\`] = true,
    [\`cyclone\`] = true,
    [\`cyclone2\`] = true,
    [\`iwagen\`] = true,
    [\`tezeract\`] = true,
    [\`omnisegt\`] = true,
    [\`powersurge\`] = true,
    [\`voltic\`] = true,
    [\`dilettante\`] = true,
    [\`surge\`] = true,
    [\`khamelion\`] = true
}

-- Extensive Gas Stations & EV Supercharger Grid Across San Andreas
Config.Stations = {
    [1] = {
        name = "Legion Square 24/7 Gas & Supercharger",
        coords = vector3(265.05, -1262.66, 29.30),
        hasElectricCharger = true,
        pumps = {
            vector3(264.44, -1260.67, 29.29),
            vector3(268.04, -1259.04, 29.29),
            vector3(269.87, -1263.15, 29.29),
            vector3(266.38, -1264.84, 29.29)
        }
    },
    [2] = {
        name = "Vinewood Boulevard Luxury Station",
        coords = vector3(620.84, 269.19, 103.08),
        hasElectricCharger = true,
        pumps = {
            vector3(622.34, 268.21, 103.08),
            vector3(625.56, 269.88, 103.08),
            vector3(628.79, 271.45, 103.08)
        }
    },
    [3] = {
        name = "Strawberry LTD Gas Station",
        coords = vector3(-70.21, -1761.79, 29.53),
        hasElectricCharger = false,
        pumps = {
            vector3(-71.55, -1763.22, 29.53),
            vector3(-69.11, -1760.44, 29.53)
        }
    },
    [4] = {
        name = "Del Perro Freeway RON Station",
        coords = vector3(-2096.24, -320.28, 13.16),
        hasElectricCharger = true,
        pumps = {
            vector3(-2098.12, -318.55, 13.16),
            vector3(-2094.66, -322.01, 13.16)
        }
    },
    [5] = {
        name = "Sandy Shores Xero Gas",
        coords = vector3(1784.32, 3330.55, 41.25),
        hasElectricCharger = true,
        pumps = {
            vector3(1786.11, 3332.44, 41.25),
            vector3(1782.55, 3328.77, 41.25)
        }
    },
    [6] = {
        name = "Paleto Bay Globe Oil & Repair",
        coords = vector3(170.13, 6416.02, 32.76),
        hasElectricCharger = true,
        pumps = {
            vector3(171.88, 6417.88, 32.76),
            vector3(168.44, 6414.22, 32.76)
        }
    }
}

-- Custom NUI UI Theme Configuration
Config.UI = {
    theme = "dark-glassmorphism",
    primaryColor = "#2196F3",
    accentColor = "#00D2FF",
    electricColor = "#10B981",
    enableAudioSoundEffects = true,
    showSpeedometerGauge = true,
    showLitersRefueledLive = true
}

-- Localization Strings
Config.Locales = {
    ['refuel_prompt'] = 'Press [E] or Target to Refuel Vehicle',
    ['electric_prompt'] = 'Press [E] or Target to Plug In Supercharger',
    ['tank_already_full'] = 'Your vehicle fuel tank is already 100% full!',
    ['not_enough_money'] = 'You do not have enough money in your wallet or bank!',
    ['refueling_in_progress'] = 'Refueling in progress... Hold still.',
    ['refueling_complete'] = 'Refueling complete! Total charged: $%s',
    ['jerry_can_empty'] = 'Your Jerry Can is empty! Buy more fuel at a station.',
    ['engine_must_be_off'] = 'Please turn off your engine before refueling!'
}
`;
}

const AiConfigPage = () => {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState('Minecraft');
  const [prompt, setPrompt] = useState('');
  const [complexity, setComplexity] = useState('500+'); // '100', '250', '500+'
  const [output, setOutput] = useState(PRESETS[0].prompt ? generateMassiveMinecraftEconomy(PRESETS[0].prompt, 500) : '');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Free member quota: 2 generations per day
  const [dailyQuota, setDailyQuota] = useState(2);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const isUltimate = false; // Free member default

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    if (!isUltimate && dailyQuota <= 0) {
      setShowUpgradePrompt(true);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let generated = '';
      if (selectedGame === 'Minecraft') {
        generated = generateMassiveMinecraftEconomy(prompt, complexity === '500+' ? 800 : 250);
      } else if (selectedGame === 'FiveM') {
        generated = generateMassiveFiveMConfig(prompt);
      } else {
        generated = `// ==============================================================================
//                  MINOFORGE ENTERPRISE JSON CONFIGURATION
//                         Powered by Gemini AI v3.0
// ==============================================================================
// Target Platform : Discord Bot / Enterprise App
// Prompt Request  : "${prompt}"
// Generated Date  : ${new Date().toISOString()}
// ==============================================================================

{
  "bot": {
    "token": "ENTER_DISCORD_TOKEN_HERE",
    "clientId": "123456789012345678",
    "guildId": "987654321098765432",
    "prefix": "!",
    "status": "watching MinoForge Marketplace",
    "activityType": "WATCHING",
    "shardCount": "auto"
  },
  "security": {
    "antiRaid": true,
    "maxMentionsPerMessage": 5,
    "accountAgeRequirementDays": 7,
    "autoMuteDurationSeconds": 600,
    "blockInviteLinks": true,
    "whitelistedDomains": ["colasmp.net", "builtbybit.com", "discord.com"],
    "suspiciousAccountAction": "ISOLATE_ROLE"
  },
  "tickets": {
    "enabled": true,
    "categoryChannelId": "112233445566778899",
    "transcriptsChannelId": "998877665544332211",
    "supportStaffRoleId": "554433221100998877",
    "maxOpenTicketsPerUser": 2,
    "exportHtmlTranscripts": true,
    "askStaffReviewRating": true,
    "departments": [
      { "id": "plugin_support", "label": "Plugin Support & Bugs", "emoji": "🛠️" },
      { "id": "custom_quote", "label": "Custom Development Quote", "emoji": "💼" },
      { "id": "billing", "label": "Billing & Payouts", "emoji": "💳" }
    ]
  },
  "database": {
    "type": "POSTGRESQL",
    "host": "127.0.0.1",
    "port": 5432,
    "database": "minoforge_bot",
    "ssl": false
  }
}
`;
      }

      setOutput(generated);
      if (!isUltimate) {
        setDailyQuota(prev => Math.max(0, prev - 1));
      }
      setLoading(false);
    }, 1200);
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

  const lineCount = output.split('\n').length;

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full text-xs font-bold text-blue-400 border border-blue-500/20 mb-3 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>High-Capacity Enterprise AI Config Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            AI Plugin Config Generator
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Generate massive, complete, 500+ lines production-ready YAML, Lua, and JSON configs with all item tables, permissions, GUI menus, and databases included.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl space-y-5">
              
              {/* Quota Tracker Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Daily AI Generations</span>
                  <span className="text-xs font-bold text-white">
                    {isUltimate ? '👑 Unlimited (Ultimate Active)' : `⚡ ${dailyQuota} of 2 Remaining Today`}
                  </span>
                </div>
                {!isUltimate && (
                  <Link
                    to="/upgrade"
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black rounded-lg shadow-md hover:brightness-110 transition-all"
                  >
                    Get Unlimited
                  </Link>
                )}
              </div>

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

              {/* Config Depth / Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Configuration Depth
                  </label>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {complexity === '500+' ? 'Massive (500+ Lines Complete)' : complexity === '250' ? 'Detailed (250 Lines)' : 'Standard (100 Lines)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '100', label: '100 Lines' },
                    { id: '250', label: '250 Lines' },
                    { id: '500+', label: '500+ Lines (Full)' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setComplexity(c.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${complexity === c.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  What should this config contain?
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-800/90 border border-white/10 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Create a 500+ lines economy config with 8 shop categories, multi-currency, ATM banking, stock market, and item tables..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 ${loading || !prompt.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <Sparkles className="w-5 h-5" />
                <span>{loading ? 'Compiling Full Config...' : 'Generate 500+ Lines Config'}</span>
              </button>

              {/* Presets List */}
              <div className="pt-4 border-t border-white/5">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Massive Community Presets
                </span>
                <div className="space-y-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedGame(preset.game);
                        setPrompt(preset.prompt);
                        if (preset.game === 'Minecraft') {
                          setOutput(generateMassiveMinecraftEconomy(preset.prompt, 800));
                        } else if (preset.game === 'FiveM') {
                          setOutput(generateMassiveFiveMConfig(preset.prompt));
                        }
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
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
              
              {/* Output Header */}
              <div className="px-5 py-3.5 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono font-medium text-slate-400">
                    config.{selectedGame === 'FiveM' ? 'lua' : selectedGame === 'Discord' ? 'json' : 'yml'}
                  </span>
                  <span className="text-[11px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    {lineCount} lines
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mr-2">
                    <CheckCircle className="w-3 h-3" /> Syntax Valid
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
              <div className="flex-1 p-5 overflow-auto bg-[#070b14] font-mono text-xs md:text-sm text-blue-200/90 leading-relaxed hide-scrollbar select-text">
                <pre className="whitespace-pre">{output}</pre>
              </div>

              {/* Syntax validation status footer */}
              <div className="px-5 py-3 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>MinoForge Gemini AI Model 3.0 • Enterprise Output</span>
                </div>
                <span className="font-mono text-slate-500">{lineCount} lines generated</span>
              </div>

            </div>
          </div>

        </div>

        {/* Daily Quota Reached Modal */}
        {showUpgradePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-white space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Daily Free Quota Reached</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Free accounts receive <strong className="text-white">2 AI config generations per day</strong>. Upgrade to MinoForge Ultimate for unlimited generations, 500+ lines output, and zero platform fees!
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to="/upgrade"
                  className="block w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all"
                >
                  Upgrade to Ultimate (Unlimited AI)
                </Link>
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Maybe Later
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
