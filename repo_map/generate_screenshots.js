const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'client', 'public', 'images', 'plugins');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. DISCORD TICKET & TRANSCRIPTS BOT — HYPER-REALISTIC DISCORD CLIENT (1280 x 720)
const discordTicketSvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="'gg sans', 'Whitney', 'Segoe UI', Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="blurpleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5865F2"/>
      <stop offset="100%" stop-color="#4752C4"/>
    </linearGradient>
    <filter id="cardShadow" x="-10" y="-10" width="1300" height="740" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Discord App Background -->
  <rect width="1280" height="720" fill="#1e1f22"/>
  
  <!-- Left Guild Server Sidebar (72px) -->
  <rect width="72" height="720" fill="#1e1f22"/>
  <rect x="0" y="24" width="4" height="40" rx="2" fill="#ffffff"/>
  <rect x="12" y="20" width="48" height="48" rx="16" fill="url(#blurpleGrad)"/>
  <text x="36" y="49" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">MF</text>
  
  <rect x="12" y="80" width="48" height="48" rx="24" fill="#313338"/>
  <text x="36" y="109" fill="#dbdee1" font-size="15" font-weight="700" text-anchor="middle">MC</text>

  <rect x="12" y="140" width="48" height="48" rx="24" fill="#313338"/>
  <text x="36" y="169" fill="#dbdee1" font-size="15" font-weight="700" text-anchor="middle">5M</text>

  <!-- Channels Sidebar (240px) -->
  <rect x="72" width="240" height="720" fill="#2b2d31"/>
  <!-- Server Header -->
  <rect x="72" width="240" height="48" fill="#2b2d31"/>
  <text x="88" y="30" fill="#ffffff" font-size="15" font-weight="800">MinoForge Official</text>
  <path d="M290 26L296 32L302 26" stroke="#949ba4" stroke-width="2" stroke-linecap="round"/>
  <line x1="72" y1="48" x2="312" y2="48" stroke="#1f2023" stroke-width="1"/>

  <!-- Channel Categories -->
  <text x="88" y="76" fill="#949ba4" font-size="11" font-weight="800" letter-spacing="0.5">▼ INFORMATION</text>
  <text x="108" y="100" fill="#949ba4" font-size="14" font-weight="500"># 📢︱announcements</text>
  <text x="108" y="128" fill="#949ba4" font-size="14" font-weight="500"># 📜︱server-rules</text>

  <text x="88" y="168" fill="#949ba4" font-size="11" font-weight="800" letter-spacing="0.5">▼ SUPPORT &amp; TICKETS</text>
  <!-- Active Channel Highlight -->
  <rect x="80" y="182" width="224" height="34" rx="4" fill="#35373c"/>
  <text x="108" y="204" fill="#ffffff" font-size="14" font-weight="700"># 🎫︱support-tickets</text>
  <text x="108" y="242" fill="#949ba4" font-size="14" font-weight="500"># 📑︱ticket-logs</text>
  <text x="108" y="272" fill="#949ba4" font-size="14" font-weight="500"># 💡︱plugin-requests</text>

  <!-- User Bar at Bottom Left -->
  <rect x="72" y="668" width="240" height="52" fill="#232428"/>
  <circle cx="96" cy="694" r="16" fill="#5865F2"/>
  <text x="96" y="699" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle">S</text>
  <circle cx="108" cy="706" r="5" fill="#23a55a" stroke="#232428" stroke-width="2"/>
  <text x="120" y="690" fill="#ffffff" font-size="13" font-weight="700">MinoUser</text>
  <text x="120" y="705" fill="#949ba4" font-size="11">Online (Developer)</text>

  <!-- Main Chat Window (968px) -->
  <rect x="312" width="968" height="720" fill="#313338"/>
  <rect x="312" width="968" height="48" fill="#313338"/>
  <line x1="312" y1="48" x2="1280" y2="48" stroke="#1f2023" stroke-width="1"/>
  <text x="336" y="30" fill="#ffffff" font-size="16" font-weight="700"># 🎫︱support-tickets</text>
  <text x="510" y="30" fill="#949ba4" font-size="13">|   Open 24/7 support tickets, order commissions, and get plugin assistance</text>

  <!-- Setup Command Message -->
  <g transform="translate(336, 72)">
    <circle cx="20" cy="20" r="20" fill="#e11d48"/>
    <text x="20" y="26" fill="#ffffff" font-size="14" font-weight="900" text-anchor="middle">A</text>
    <text x="52" y="16" fill="#ffffff" font-size="15" font-weight="700">MinoAdmin</text>
    <rect x="145" y="4" width="48" height="16" rx="3" fill="#e11d48"/>
    <text x="169" y="16" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">ADMIN</text>
    <text x="205" y="16" fill="#949ba4" font-size="12">Today at 4:15 PM</text>
    <text x="52" y="38" fill="#dbdee1" font-size="14">/ticket setup</text>
  </g>

  <!-- Ticket Master Bot Embed Panel -->
  <g transform="translate(336, 140)">
    <circle cx="20" cy="20" r="20" fill="url(#blurpleGrad)"/>
    <text x="20" y="26" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">TM</text>
    <text x="52" y="16" fill="#ffffff" font-size="15" font-weight="700">Ticket Master</text>
    <rect x="150" y="4" width="36" height="16" rx="3" fill="#5865F2"/>
    <text x="168" y="16" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">BOT</text>
    <text x="198" y="16" fill="#949ba4" font-size="12">Today at 4:15 PM</text>

    <!-- Rich Discord Embed Box -->
    <g transform="translate(52, 32)">
      <rect width="640" height="270" rx="4" fill="#2b2d31"/>
      <rect width="4" height="270" rx="2" fill="#5865F2"/>

      <text x="20" y="32" fill="#5865F2" font-size="12" font-weight="800" letter-spacing="0.5">MINOFORGE SUPPORT DESK</text>
      <text x="20" y="60" fill="#ffffff" font-size="18" font-weight="800">🎫 Need Help with Plugins or Custom Orders?</text>
      <text x="20" y="90" fill="#dbdee1" font-size="14">Click a category button below to create a private support ticket with our engineering team.</text>
      <text x="20" y="112" fill="#dbdee1" font-size="14">Our moderators and developers are active to resolve issues and deliver custom commissions.</text>

      <!-- Embed Info Grid -->
      <rect x="20" y="132" width="180" height="50" rx="4" fill="#1e1f22"/>
      <text x="32" y="152" fill="#949ba4" font-size="11" font-weight="700">⚡ AVG RESPONSE TIME</text>
      <text x="32" y="172" fill="#23a55a" font-size="13" font-weight="800">&lt; 15 Minutes</text>

      <rect x="210" y="132" width="180" height="50" rx="4" fill="#1e1f22"/>
      <text x="222" y="152" fill="#949ba4" font-size="11" font-weight="700">🔒 ENCRYPTED LOGS</text>
      <text x="222" y="172" fill="#38bdf8" font-size="13" font-weight="800">Staff &amp; Creator Only</text>

      <rect x="400" y="132" width="220" height="50" rx="4" fill="#1e1f22"/>
      <text x="412" y="152" fill="#949ba4" font-size="11" font-weight="700">📑 AUTO-TRANSCRIPTS</text>
      <text x="412" y="172" fill="#f59e0b" font-size="13" font-weight="800">HTML Archive Export</text>

      <!-- Action Buttons -->
      <g transform="translate(20, 204)">
        <rect width="145" height="42" rx="4" fill="#5865F2" cursor="pointer"/>
        <text x="72" y="26" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">🎫 Open Ticket</text>

        <rect x="155" width="130" height="42" rx="4" fill="#da373c" cursor="pointer"/>
        <text x="220" y="26" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">🐛 Bug Report</text>

        <rect x="295" width="150" height="42" rx="4" fill="#248046" cursor="pointer"/>
        <text x="370" y="26" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">📖 Documentation</text>

        <rect x="455" width="145" height="42" rx="4" fill="#4e5058" cursor="pointer"/>
        <text x="527" y="26" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">🌐 colasmp.net ↗</text>
      </g>
    </g>
  </g>

  <!-- Floating Active Ticket Session at Bottom Right -->
  <g transform="translate(850, 440)">
    <rect width="390" height="240" rx="8" fill="#1e1f22" stroke="#5865F2" stroke-width="2"/>
    <rect width="390" height="38" rx="8" fill="#2b2d31"/>
    <text x="16" y="24" fill="#ffffff" font-size="13" font-weight="800">#ticket-0412 (Active Session)</text>
    
    <g transform="translate(16, 52)">
      <circle cx="12" cy="12" r="12" fill="#5865F2"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="900" text-anchor="middle">TM</text>
      <text x="32" y="12" fill="#ffffff" font-size="12" font-weight="700">Ticket Master [BOT]</text>
      <text x="32" y="28" fill="#949ba4" font-size="10">Created by @MinoUser</text>
      
      <rect y="38" width="358" height="54" rx="4" fill="#2b2d31"/>
      <rect y="38" width="3" height="54" fill="#23a55a"/>
      <text x="12" y="56" fill="#23a55a" font-size="11" font-weight="800">REASON: Custom Economy Commission</text>
      <text x="12" y="74" fill="#dbdee1" font-size="11">Staff Member @Alex has claimed this ticket.</text>

      <rect y="105" width="180" height="34" rx="4" fill="#da373c" cursor="pointer"/>
      <text x="90" y="127" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">🔒 Close &amp; Save Transcript</text>
    </g>
  </g>
</svg>`;

// 2. MINECRAFT ULTIMATE ECONOMY — HYPER-REALISTIC IN-GAME MINECRAFT CONTAINER & SCOREBOARD (1280 x 720)
const minecraftEconomySvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="'Courier New', Courier, monospace">
  <defs>
    <!-- Shaders Sky & Tavern Glow -->
    <linearGradient id="mcSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e130c"/>
      <stop offset="40%" stop-color="#2d1d14"/>
      <stop offset="80%" stop-color="#121824"/>
      <stop offset="100%" stop-color="#080b12"/>
    </linearGradient>
    <linearGradient id="woodPlanks" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8a5e38"/>
      <stop offset="50%" stop-color="#6d4727"/>
      <stop offset="100%" stop-color="#54361c"/>
    </linearGradient>
    <linearGradient id="goldGlint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#ffb703"/>
      <stop offset="100%" stop-color="#fb8500"/>
    </linearGradient>
    <linearGradient id="netheriteGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4a3f4e"/>
      <stop offset="50%" stop-color="#2c2730"/>
      <stop offset="100%" stop-color="#19161c"/>
    </linearGradient>
    <linearGradient id="enchantSheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#ec4899" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.8"/>
    </linearGradient>
  </defs>

  <!-- Background Wallpaper: Warm Shader Tavern & Dark Wood Planks -->
  <rect width="1280" height="720" fill="url(#mcSky)"/>

  <!-- In-game Crosshair -->
  <g transform="translate(640, 360)">
    <rect x="-8" y="-1" width="16" height="2" fill="#ffffff" opacity="0.6"/>
    <rect x="-1" y="-8" width="2" height="16" fill="#ffffff" opacity="0.6"/>
  </g>

  <!-- Authentic 9x6 Minecraft Chest GUI in Center -->
  <g transform="translate(360, 75)">
    <!-- 3D Beveled Minecraft GUI Container Body -->
    <rect width="560" height="570" fill="#c6c6c6" stroke="#ffffff" stroke-width="4"/>
    <rect x="2" y="2" width="556" height="566" fill="none" stroke="#555555" stroke-width="4"/>
    <rect x="6" y="6" width="548" height="558" fill="#c6c6c6"/>

    <!-- GUI Header Text -->
    <text x="24" y="36" fill="#3f3f3f" font-size="20" font-weight="900">EconomySMP — Auction House &amp; Bank</text>

    <!-- Filter Buttons Bar -->
    <g transform="translate(24, 52)">
      <rect width="70" height="26" fill="#5865F2" stroke="#373737" stroke-width="2"/>
      <text x="35" y="18" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle">ALL ITEMS</text>
      
      <rect x="76" width="70" height="26" fill="#8b8b8b" stroke="#373737" stroke-width="2"/>
      <text x="111" y="18" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">WEAPONS</text>
      
      <rect x="152" width="70" height="26" fill="#8b8b8b" stroke="#373737" stroke-width="2"/>
      <text x="187" y="18" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">SPAWNERS</text>
      
      <rect x="228" width="70" height="26" fill="#8b8b8b" stroke="#373737" stroke-width="2"/>
      <text x="263" y="18" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">VOUCHERS</text>
    </g>

    <!-- 9x6 54 Slot Grid -->
    <g transform="translate(24, 90)">
      ${Array.from({ length: 6 }).map((_, row) => 
        Array.from({ length: 9 }).map((_, col) => `
          <g transform="translate(${col * 56}, ${row * 56})">
            <rect width="52" height="52" fill="#8b8b8b" stroke="#373737" stroke-width="3"/>
            <rect x="3" y="3" width="46" height="46" fill="#8b8b8b"/>
          </g>
        `).join('')
      ).join('')}

      <!-- Item 1: Creeper Spawner with green cage -->
      <g transform="translate(0, 0)">
        <rect x="6" y="6" width="40" height="40" rx="3" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
        <text x="26" y="32" fill="#ffffff" font-size="20" text-anchor="middle">👾</text>
        <text x="44" y="44" fill="#ffff55" font-size="13" font-weight="900" text-anchor="end">2</text>
      </g>

      <!-- Item 2: Zombie Spawner -->
      <g transform="translate(56, 0)">
        <rect x="6" y="6" width="40" height="40" rx="3" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="26" y="32" fill="#ffffff" font-size="20" text-anchor="middle">🧟</text>
        <text x="44" y="44" fill="#ffff55" font-size="13" font-weight="900" text-anchor="end">4</text>
      </g>

      <!-- Item 3: Gold Coin Voucher Stack -->
      <g transform="translate(112, 0)">
        <rect x="6" y="6" width="40" height="40" rx="3" fill="url(#goldGlint)" stroke="#fbbf24" stroke-width="2"/>
        <text x="26" y="32" fill="#000000" font-size="20" text-anchor="middle">🪙</text>
        <text x="44" y="44" fill="#ffff55" font-size="13" font-weight="900" text-anchor="end">64</text>
      </g>

      <!-- Item 4: Enchanted Netherite Sword -->
      <g transform="translate(168, 0)">
        <rect x="6" y="6" width="40" height="40" rx="3" fill="url(#enchantSheen)" stroke="#d946ef" stroke-width="2"/>
        <text x="26" y="32" fill="#ffffff" font-size="20" text-anchor="middle">⚔️</text>
      </g>

      <!-- Item 5: Diamond Blocks -->
      <g transform="translate(224, 0)">
        <rect x="6" y="6" width="40" height="40" rx="3" fill="#0891b2" stroke="#22d3ee" stroke-width="2"/>
        <text x="26" y="32" fill="#ffffff" font-size="20" text-anchor="middle">💎</text>
        <text x="44" y="44" fill="#ffffff" font-size="13" font-weight="900" text-anchor="end">64</text>
      </g>

      <!-- Item 6: Elytra Wings -->
      <g transform="translate(280, 0)">
        <rect x="6" y="6" width="40" height="40" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
        <text x="26" y="32" fill="#ffffff" font-size="20" text-anchor="middle">🪽</text>
      </g>

      <!-- Bottom Interactive Action Buttons -->
      <g transform="translate(0, 396)">
        <rect width="100" height="34" fill="#15803d" stroke="#373737" stroke-width="2"/>
        <text x="50" y="22" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">🏦 DEPOSIT</text>

        <rect x="108" width="110" height="34" fill="#b91c1c" stroke="#373737" stroke-width="2"/>
        <text x="163" y="22" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">💵 WITHDRAW</text>

        <rect x="226" width="134" height="34" fill="#ca8a04" stroke="#373737" stroke-width="2"/>
        <text x="293" y="22" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">🏷️ SELL HAND</text>

        <rect x="368" width="136" height="34" fill="#2563eb" stroke="#373737" stroke-width="2"/>
        <text x="436" y="22" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">📜 BANK LOGS</text>
      </g>
    </g>

    <!-- Hovered Tooltip Box on Netherite Sword -->
    <g transform="translate(180, 160)">
      <rect width="320" height="145" rx="4" fill="#100010" stroke="#280070" stroke-width="4"/>
      <text x="16" y="28" fill="#d946ef" font-size="14" font-weight="900">Netherite Sword (Sharpness V)</text>
      <text x="16" y="48" fill="#55ffff" font-size="12">Fire Aspect II • Unbreaking III</text>
      <text x="16" y="66" fill="#ffaa00" font-size="12">Looting III • Mending</text>
      <line x1="16" y1="76" x2="304" y2="76" stroke="#555555" stroke-width="1"/>
      <text x="16" y="96" fill="#aaaaaa" font-size="12">Price: <tspan fill="#55ff55" font-weight="900">$450,000 Coins</tspan></text>
      <text x="16" y="118" fill="#ffff55" font-size="11">▶ Click to Purchase Instantly</text>
      <text x="16" y="134" fill="#55ffff" font-size="10">Seller: xX_ProTrader_Xx</text>
    </g>
  </g>

  <!-- Right-Hand Authentic In-Game Scoreboard -->
  <g transform="translate(990, 80)">
    <rect width="260" height="280" rx="4" fill="#000000" opacity="0.75"/>
    <text x="130" y="32" fill="#ffaa00" font-size="16" font-weight="900" text-anchor="middle">§6§lEconomySMP</text>
    <text x="16" y="56" fill="#aaaaaa" font-size="12">--------------------------</text>
    
    <text x="16" y="80" fill="#ffffff" font-size="13">Player: <tspan fill="#55ffff">MinoPlayer</tspan></text>
    <text x="16" y="106" fill="#ffffff" font-size="13">Balance: <tspan fill="#55ff55" font-weight="900">$1,450,000</tspan></text>
    <text x="16" y="132" fill="#ffffff" font-size="13">Bank: <tspan fill="#22c55e" font-weight="900">$5,820,000</tspan></text>
    <text x="16" y="158" fill="#ffffff" font-size="13">Interest: <tspan fill="#ffff55">+2.5%/hr</tspan></text>
    <text x="16" y="184" fill="#ffffff" font-size="13">Tokens: <tspan fill="#ff55ff">12,400</tspan></text>
    <text x="16" y="210" fill="#ffffff" font-size="13">Rank: <tspan fill="#ffaa00">[VIP+]</tspan></text>
    <text x="16" y="236" fill="#ffffff" font-size="13">Online: <tspan fill="#aaaaaa">184/500</tspan></text>
    
    <text x="16" y="256" fill="#aaaaaa" font-size="12">--------------------------</text>
    <text x="130" y="272" fill="#ffff55" font-size="12" font-weight="700" text-anchor="middle">play.economysmp.net</text>
  </g>
</svg>`;

// 3. FIVEM ADVANCED FUEL & CHARGING — AUTHENTIC GTA V NIGHTTIME RON OIL & NUI GLASS (1280 x 720)
const fivemFuelSvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <defs>
    <!-- Night Asphalt & Gas Station Lighting -->
    <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="50%" stop-color="#0c1220"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
    <linearGradient id="canopyGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <radialGradient id="pumpLight" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Realistic GTA V Nighttime Environment -->
  <rect width="1280" height="720" fill="url(#nightSky)"/>

  <!-- Gas Station Canopy Roof Structure -->
  <rect x="80" y="30" width="1120" height="70" rx="8" fill="url(#canopyGlow)"/>
  <text x="640" y="76" fill="#000000" font-size="32" font-weight="900" letter-spacing="6" text-anchor="middle">RON OIL — LOS SANTOS #04</text>
  <ellipse cx="640" cy="240" rx="550" ry="160" fill="url(#pumpLight)"/>

  <!-- Gas Pump Pillars -->
  <rect x="220" y="240" width="80" height="260" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>
  <rect x="235" y="260" width="50" height="40" rx="4" fill="#0284c7"/>
  <text x="260" y="285" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">$1.75</text>

  <!-- Supercar Silhouette Parked at Pump -->
  <path d="M340 480 Q480 410 680 410 Q880 410 1020 490 L1080 560 L280 560 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <circle cx="420" cy="560" r="50" fill="#020617" stroke="#475569" stroke-width="10"/>
  <circle cx="940" cy="560" r="50" fill="#020617" stroke="#475569" stroke-width="10"/>

  <!-- 3D In-game ox_target Marker Floating Over Gas Cap -->
  <g transform="translate(480, 360)">
    <circle cx="20" cy="20" r="20" fill="#f59e0b" opacity="0.9"/>
    <text x="20" y="26" fill="#000000" font-size="15" font-weight="900" text-anchor="middle">E</text>
    <rect x="50" y="6" width="230" height="28" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="165" y="25" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle">HOLD [E] TO REFUEL VEHICLE</text>
  </g>

  <!-- Authentic FiveM Glassmorphism NUI Overlay on Right Side -->
  <g transform="translate(800, 180)">
    <rect width="440" height="460" rx="20" fill="#0b0f19" opacity="0.95" stroke="#f59e0b" stroke-width="2"/>
    
    <!-- NUI Header -->
    <rect width="440" height="60" rx="20" fill="#1e293b"/>
    <text x="24" y="38" fill="#f59e0b" font-size="18" font-weight="900">⛽ RON OIL REFUELING SYSTEM</text>
    <circle cx="410" cy="30" r="7" fill="#22c55e"/>

    <!-- Target Vehicle Details -->
    <g transform="translate(24, 85)">
      <text x="0" y="0" fill="#94a3b8" font-size="12" font-weight="700">CURRENT VEHICLE</text>
      <text x="0" y="22" fill="#ffffff" font-size="18" font-weight="900">Pfister 811 Supercar (88XCD921)</text>

      <!-- Fuel Tank Level Gauge -->
      <text x="0" y="65" fill="#94a3b8" font-size="12" font-weight="700">FUEL LEVEL</text>
      <text x="390" y="65" fill="#22c55e" font-size="16" font-weight="900" text-anchor="end">84%</text>

      <rect y="75" width="390" height="18" rx="9" fill="#1e293b"/>
      <rect y="75" width="327" height="18" rx="9" fill="#22c55e"/>

      <!-- Pricing Summary Card -->
      <rect y="115" width="390" height="120" rx="12" fill="#111827" stroke="#374151"/>
      <text x="16" y="142" fill="#94a3b8" font-size="13">Fuel Grade:</text>
      <text x="374" y="142" fill="#ffffff" font-size="13" font-weight="700" text-anchor="end">98 Premium Octane</text>

      <text x="16" y="168" fill="#94a3b8" font-size="13">Price per Liter:</text>
      <text x="374" y="168" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="end">$1.75 / Liter</text>

      <text x="16" y="194" fill="#94a3b8" font-size="13">Liters Pumped:</text>
      <text x="374" y="194" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="end">36.8 Liters</text>

      <text x="16" y="220" fill="#94a3b8" font-size="14" font-weight="700">Total Price:</text>
      <text x="374" y="220" fill="#22c55e" font-size="18" font-weight="900" text-anchor="end">$64.40</text>

      <!-- Action Buttons -->
      <g transform="translate(0, 255)">
        <rect width="190" height="46" rx="10" fill="#f59e0b" cursor="pointer"/>
        <text x="95" y="28" fill="#000000" font-size="13" font-weight="900" text-anchor="middle">[E] HOLD TO PUMP</text>

        <rect x="200" width="190" height="46" rx="10" fill="#dc2626" cursor="pointer"/>
        <text x="295" y="28" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">[X] STOP &amp; PAY</text>
      </g>
    </g>
  </g>

  <!-- Top-Left GTA Minimap HUD -->
  <g transform="translate(40, 40)">
    <rect width="160" height="160" rx="80" fill="#000000" opacity="0.8" stroke="#ffffff" stroke-width="3"/>
    <text x="80" y="85" fill="#ffffff" font-size="14" font-weight="900" text-anchor="middle">VINEWOOD</text>
    <rect x="20" y="130" width="120" height="8" rx="4" fill="#22c55e"/>
    <rect x="20" y="142" width="120" height="8" rx="4" fill="#3b82f6"/>
  </g>
</svg>`;

// 4. 2B2T ANARCHY UTILITY & BARITONE AUTO-HIGHWAY (1280 x 720)
const anarchyUtilitySvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="'Courier New', Courier, monospace">
  <defs>
    <linearGradient id="netherHell" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b0707"/>
      <stop offset="50%" stop-color="#1c0303"/>
      <stop offset="100%" stop-color="#0a0101"/>
    </linearGradient>
  </defs>

  <!-- Nether Tunnel Background -->
  <rect width="1280" height="720" fill="url(#netherHell)"/>

  <!-- Obsidian Highway Perspective Lines -->
  <line x1="0" y1="720" x2="640" y2="360" stroke="#581c87" stroke-width="8"/>
  <line x1="1280" y1="720" x2="640" y2="360" stroke="#581c87" stroke-width="8"/>
  <line x1="0" y1="0" x2="640" y2="360" stroke="#3b0764" stroke-width="4"/>
  <line x1="1280" y1="0" x2="640" y2="360" stroke="#3b0764" stroke-width="4"/>

  <!-- Baritone 3D Wireframe Excavation Box -->
  <polygon points="540,310 740,310 780,410 500,410" fill="#06b6d4" fill-opacity="0.25" stroke="#06b6d4" stroke-width="3"/>
  <text x="640" y="295" fill="#06b6d4" font-size="15" font-weight="900" text-anchor="middle">[Baritone Target: X+ Nether Highway Tunnel]</text>

  <!-- Crosshair -->
  <rect x="638" y="358" width="4" height="4" fill="#ffffff"/>

  <!-- Minecraft Java Edition F3 Debug Screen (Top Left) -->
  <g transform="translate(16, 20)">
    <rect width="380" height="160" fill="#000000" opacity="0.65"/>
    <text x="10" y="22" fill="#ffffff" font-size="12">Minecraft 1.20.4 (Fabric Client)</text>
    <text x="10" y="42" fill="#ffffff" font-size="12">144 fps (120 min) / 60 chunks</text>
    <text x="10" y="62" fill="#ffffff" font-size="12">XYZ: 1000002.45 / 120.00 / 0.00</text>
    <text x="10" y="82" fill="#ffffff" font-size="12">Block: nether_bricks (Nether X+ Axis)</text>
    <text x="10" y="102" fill="#ffffff" font-size="12">Facing: East (Towards positive X)</text>
    <text x="10" y="122" fill="#55ff55" font-size="12">Server: 2b2t.org (GrimAC: Active)</text>
    <text x="10" y="142" fill="#ffff55" font-size="12">TPS: 19.98 • Ping: 42ms</text>
  </g>

  <!-- Anarchy Utility Active Arraylist HUD (Top Right) -->
  <g transform="translate(970, 20)">
    <rect width="290" height="280" rx="4" fill="#000000" opacity="0.8" stroke="#a855f7" stroke-width="2"/>
    <text x="145" y="28" fill="#c084fc" font-size="15" font-weight="900" text-anchor="middle">2B2T ANARCHY SUITE</text>
    <line x1="10" y1="38" x2="280" y2="38" stroke="#a855f7" stroke-width="1"/>

    <text x="16" y="64" fill="#06b6d4" font-size="13" font-weight="900">Baritone <tspan fill="#ffffff">[Auto-Highway]</tspan></text>
    <text x="16" y="90" fill="#22c55e" font-size="13" font-weight="900">AutoTotem <tspan fill="#ffffff">[14 Totems]</tspan></text>
    <text x="16" y="116" fill="#c084fc" font-size="13" font-weight="900">ElytraFly <tspan fill="#ffffff">[74.2 bps]</tspan></text>
    <text x="16" y="142" fill="#eab308" font-size="13" font-weight="900">Surround <tspan fill="#ffffff">[Obsidian 100%]</tspan></text>
    <text x="16" y="168" fill="#3b82f6" font-size="13" font-weight="900">PacketFly <tspan fill="#ffffff">[Grim Bypass]</tspan></text>
    <text x="16" y="194" fill="#ef4444" font-size="13" font-weight="900">Anti-CevBreaker <tspan fill="#ffffff">[ON]</tspan></text>
    <text x="16" y="220" fill="#10b981" font-size="13" font-weight="900">StashFinder <tspan fill="#ffffff">[Scanning 32ch]</tspan></text>
    <text x="16" y="246" fill="#94a3b8" font-size="13">VisualRange <tspan fill="#ffffff">[0 Nearby]</tspan></text>
  </g>

  <!-- Bottom Baritone Status Progress Box -->
  <g transform="translate(430, 640)">
    <rect width="420" height="52" rx="8" fill="#000000" opacity="0.85" stroke="#06b6d4" stroke-width="2"/>
    <text x="210" y="24" fill="#06b6d4" font-size="12" font-weight="900" text-anchor="middle">BARITONE HIGHWAY DIGGER ACTIVE</text>
    <text x="210" y="44" fill="#ffffff" font-size="12" text-anchor="middle">Blocks Excavated: 8,420 • Speed: 18.4 bps</text>
  </g>
</svg>`;

// Write all SVGs
fs.writeFileSync(path.join(outputDir, 'discord_ticket_panel.svg'), discordTicketSvg, 'utf8');
fs.writeFileSync(path.join(outputDir, 'minecraft_economy_gui.svg'), minecraftEconomySvg, 'utf8');
fs.writeFileSync(path.join(outputDir, 'gta_gas_station.svg'), fivemFuelSvg, 'utf8');
fs.writeFileSync(path.join(outputDir, 'minecraft_anarchy_highway.svg'), anarchyUtilitySvg, 'utf8');

console.log('Successfully updated all 4 plugin screenshots to hyper-realistic in-game SVGs!');
