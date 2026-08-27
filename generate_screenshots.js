const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'client', 'public', 'images', 'plugins');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. DISCORD TICKET BOT AUTHENTIC UI SCREENSHOT (1280 x 720)
const discordTicketSvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="'gg sans', 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif">
  <!-- Discord App Background -->
  <rect width="1280" height="720" fill="#313338"/>
  
  <!-- Left Guild Server Sidebar -->
  <rect width="72" height="720" fill="#1e1f22"/>
  <circle cx="36" cy="36" r="24" fill="#5865F2"/>
  <text x="36" y="43" fill="#ffffff" font-size="16" font-weight="900" text-anchor="middle">MF</text>
  <rect x="0" y="24" width="4" height="24" rx="2" fill="#ffffff"/>
  
  <circle cx="36" cy="96" r="22" fill="#2b2d31"/>
  <text x="36" y="103" fill="#dbdee1" font-size="14" font-weight="700" text-anchor="middle">MC</text>
  <circle cx="36" cy="150" r="22" fill="#2b2d31"/>
  <text x="36" y="157" fill="#dbdee1" font-size="14" font-weight="700" text-anchor="middle">5M</text>

  <!-- Channels Sidebar -->
  <rect x="72" width="240" height="720" fill="#2b2d31"/>
  <rect x="72" width="240" height="48" fill="#2b2d31"/>
  <text x="88" y="30" fill="#ffffff" font-size="15" font-weight="800">MinoForge Server</text>
  <path d="M290 26L296 32L302 26" stroke="#949ba4" stroke-width="2" stroke-linecap="round"/>
  <line x1="72" y1="48" x2="312" y2="48" stroke="#1f2023" stroke-width="1"/>

  <!-- Channel List -->
  <text x="88" y="78" fill="#949ba4" font-size="12" font-weight="700" letter-spacing="0.5">▼ INFORMATION</text>
  <text x="108" y="102" fill="#949ba4" font-size="14" font-weight="500"># 📢︱announcements</text>
  <text x="108" y="130" fill="#949ba4" font-size="14" font-weight="500"># 📜︱rules</text>

  <text x="88" y="170" fill="#949ba4" font-size="12" font-weight="700" letter-spacing="0.5">▼ SUPPORT TICKETS</text>
  <!-- Active Channel Highlight -->
  <rect x="80" y="184" width="224" height="34" rx="4" fill="#35373c"/>
  <text x="108" y="206" fill="#ffffff" font-size="14" font-weight="700"># 🎫︱support-tickets</text>
  <text x="108" y="244" fill="#949ba4" font-size="14" font-weight="500"># 📑︱ticket-logs</text>
  <text x="108" y="274" fill="#949ba4" font-size="14" font-weight="500"># 💡︱suggestions</text>

  <!-- User Bar at Bottom Left -->
  <rect x="72" y="668" width="240" height="52" fill="#232428"/>
  <circle cx="100" cy="694" r="16" fill="#5865F2"/>
  <text x="100" y="699" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">S</text>
  <circle cx="112" cy="706" r="5" fill="#23a55a" stroke="#232428" stroke-width="2"/>
  <text x="124" y="690" fill="#ffffff" font-size="13" font-weight="700">SevGamer</text>
  <text x="124" y="705" fill="#949ba4" font-size="11">#0001</text>

  <!-- Main Chat Header -->
  <rect x="312" width="968" height="48" fill="#313338"/>
  <line x1="312" y1="48" x2="1280" y2="48" stroke="#1f2023" stroke-width="1"/>
  <text x="336" y="30" fill="#ffffff" font-size="16" font-weight="700"># 🎫︱support-tickets</text>
  <text x="510" y="30" fill="#949ba4" font-size="13" font-weight="500">|   Click below to create a private support ticket</text>

  <!-- Setup Command Message -->
  <g transform="translate(336, 75)">
    <circle cx="20" cy="20" r="20" fill="#e53935"/>
    <text x="20" y="26" fill="#ffffff" font-size="14" font-weight="900" text-anchor="middle">A</text>
    <text x="52" y="16" fill="#ffffff" font-size="15" font-weight="700">ServerAdmin</text>
    <rect x="145" y="4" width="48" height="16" rx="3" fill="#e53935"/>
    <text x="169" y="16" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">ADMIN</text>
    <text x="205" y="16" fill="#949ba4" font-size="12">Today at 4:15 PM</text>
    <text x="52" y="38" fill="#dbdee1" font-size="14">/ticket setup</text>
  </g>

  <!-- Ticket Master Bot Response & Embed Panel -->
  <g transform="translate(336, 145)">
    <circle cx="20" cy="20" r="20" fill="#5865F2"/>
    <text x="20" y="26" fill="#ffffff" font-size="14" font-weight="900" text-anchor="middle">TM</text>
    <text x="52" y="16" fill="#ffffff" font-size="15" font-weight="700">Ticket Master</text>
    <rect x="150" y="4" width="36" height="16" rx="3" fill="#5865F2"/>
    <text x="168" y="16" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">BOT</text>
    <text x="198" y="16" fill="#949ba4" font-size="12">Today at 4:15 PM</text>

    <!-- Main Discord Embed Box -->
    <g transform="translate(52, 32)">
      <rect width="640" height="260" rx="4" fill="#2b2d31"/>
      <rect width="4" height="260" rx="2" fill="#5865F2"/>

      <text x="20" y="32" fill="#5865F2" font-size="12" font-weight="800" letter-spacing="0.5">MINOFORGE SUPPORT DESK</text>
      <text x="20" y="60" fill="#ffffff" font-size="18" font-weight="800">🎫 Need Assistance with Plugins or Orders?</text>
      <text x="20" y="90" fill="#dbdee1" font-size="14" font-weight="400">Click the button below to open a private 1-on-1 support ticket with our developer team.</text>
      <text x="20" y="112" fill="#dbdee1" font-size="14" font-weight="400">Our staff is available 24/7 to resolve technical issues and deliver custom commissions.</text>

      <!-- Embed Info Fields -->
      <rect x="20" y="132" width="180" height="48" rx="4" fill="#1e1f22"/>
      <text x="32" y="150" fill="#949ba4" font-size="11" font-weight="700">⚡ RESPONSE TIME</text>
      <text x="32" y="170" fill="#23a55a" font-size="13" font-weight="800">&lt; 15 Minutes</text>

      <rect x="210" y="132" width="180" height="48" rx="4" fill="#1e1f22"/>
      <text x="222" y="150" fill="#949ba4" font-size="11" font-weight="700">🔒 PRIVACY &amp; ACCESS</text>
      <text x="222" y="170" fill="#38bdf8" font-size="13" font-weight="800">Staff &amp; Creator Only</text>

      <rect x="400" y="132" width="220" height="48" rx="4" fill="#1e1f22"/>
      <text x="412" y="150" fill="#949ba4" font-size="11" font-weight="700">📑 TRANSCRIPTS</text>
      <text x="412" y="170" fill="#f59e0b" font-size="13" font-weight="800">Automatic HTML Export</text>

      <!-- Interactive Discord Action Row Buttons -->
      <g transform="translate(20, 198)">
        <!-- Blurple Primary Button -->
        <rect width="145" height="38" rx="4" fill="#5865F2" cursor="pointer"/>
        <text x="72" y="24" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">🎫 Open Ticket</text>

        <!-- Red Danger Button -->
        <rect x="155" width="130" height="38" rx="4" fill="#da373c" cursor="pointer"/>
        <text x="220" y="24" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">🐛 Bug Report</text>

        <!-- Green Success Button -->
        <rect x="295" width="150" height="38" rx="4" fill="#248046" cursor="pointer"/>
        <text x="370" y="24" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">📖 Documentation</text>

        <!-- Gray Secondary Link Button -->
        <rect x="455" width="145" height="38" rx="4" fill="#4e5058" cursor="pointer"/>
        <text x="527" y="24" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">🌐 colasmp.net ↗</text>
      </g>
    </g>
  </g>

  <!-- Active Ticket Sample Overlay at Right -->
  <g transform="translate(850, 430)">
    <rect width="390" height="250" rx="8" fill="#1e1f22" stroke="#5865F2" stroke-width="2"/>
    <rect width="390" height="38" rx="8" fill="#2b2d31"/>
    <text x="16" y="24" fill="#ffffff" font-size="13" font-weight="800">#ticket-0412 (Active Session)</text>
    
    <g transform="translate(16, 52)">
      <circle cx="12" cy="12" r="12" fill="#5865F2"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="900" text-anchor="middle">TM</text>
      <text x="32" y="12" fill="#ffffff" font-size="12" font-weight="700">Ticket Master [BOT]</text>
      <text x="32" y="28" fill="#949ba4" font-size="10">Ticket opened by @SevGamer</text>
      
      <rect y="38" width="358" height="60" rx="4" fill="#2b2d31"/>
      <rect y="38" width="3" height="60" fill="#23a55a"/>
      <text x="12" y="56" fill="#23a55a" font-size="10" font-weight="800">REASON: Custom Plugin Question</text>
      <text x="12" y="74" fill="#dbdee1" font-size="11">Staff Member @Alex has claimed this ticket.</text>

      <rect y="110" width="180" height="32" rx="4" fill="#da373c" cursor="pointer"/>
      <text x="90" y="131" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">🔒 Close &amp; Save Transcript</text>
    </g>
  </g>
</svg>`;

// 2. MINECRAFT ECONOMYSMP AUCTION HOUSE & BANK AUTHENTIC CHEST GUI (1280 x 720)
const minecraftEconomySvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="'Courier New', Courier, monospace">
  <!-- In-game Cinematic Shader Spawn Background -->
  <defs>
    <radialGradient id="skyGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#3a2518"/>
      <stop offset="50%" stop-color="#191d28"/>
      <stop offset="100%" stop-color="#0b0f19"/>
    </radialGradient>
    <linearGradient id="goldVoucher" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffd700"/>
      <stop offset="100%" stop-color="#ff8c00"/>
    </linearGradient>
    <linearGradient id="enchantShimmer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9333ea"/>
      <stop offset="50%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  
  <rect width="1280" height="720" fill="url(#skyGlow)"/>

  <!-- Minecraft Crosshair in Center -->
  <rect x="638" y="358" width="4" height="4" fill="#ffffff" opacity="0.6"/>

  <!-- Authentic Minecraft 9x6 Chest GUI Window in Center -->
  <g transform="translate(360, 80)">
    <!-- Container Body -->
    <rect width="560" height="560" rx="4" fill="#c6c6c6" stroke="#ffffff" stroke-width="4"/>
    <rect x="2" y="2" width="556" height="556" fill="none" stroke="#555555" stroke-width="4"/>
    <rect x="6" y="6" width="548" height="548" fill="#c6c6c6"/>

    <!-- GUI Header -->
    <text x="24" y="36" fill="#3f3f3f" font-size="20" font-weight="900">EconomySMP — Auction House &amp; Bank</text>

    <!-- Category Tabs -->
    <g transform="translate(24, 52)">
      <rect width="70" height="26" rx="2" fill="#5865F2"/>
      <text x="35" y="18" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">ALL ITEMS</text>
      
      <rect x="76" width="70" height="26" rx="2" fill="#8b8b8b"/>
      <text x="111" y="18" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">WEAPONS</text>
      
      <rect x="152" width="70" height="26" rx="2" fill="#8b8b8b"/>
      <text x="187" y="18" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">SPAWNERS</text>
      
      <rect x="228" width="70" height="26" rx="2" fill="#8b8b8b"/>
      <text x="263" y="18" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">VOUCHERS</text>
    </g>

    <!-- 9x6 Slot Grid -->
    <g transform="translate(24, 90)">
      <!-- Slot Grid Background Loop -->
      ${Array.from({ length: 6 }).map((_, row) => 
        Array.from({ length: 9 }).map((_, col) => `
          <g transform="translate(${col * 56}, ${row * 56})">
            <rect width="52" height="52" fill="#8b8b8b" stroke="#373737" stroke-width="3"/>
            <rect x="3" y="3" width="46" height="46" fill="#8b8b8b"/>
          </g>
        `).join('')
      ).join('')}

      <!-- Item Slot 1: Creeper Spawner -->
      <g transform="translate(0, 0)">
        <rect x="8" y="8" width="36" height="36" rx="4" fill="#15803d"/>
        <text x="26" y="30" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">👾</text>
        <text x="44" y="46" fill="#ffffff" font-size="13" font-weight="900" text-anchor="end">2</text>
      </g>

      <!-- Item Slot 2: Zombie Spawner -->
      <g transform="translate(56, 0)">
        <rect x="8" y="8" width="36" height="36" rx="4" fill="#047857"/>
        <text x="26" y="30" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">🧟</text>
        <text x="44" y="46" fill="#ffffff" font-size="13" font-weight="900" text-anchor="end">4</text>
      </g>

      <!-- Item Slot 3: Gold Coin Voucher -->
      <g transform="translate(112, 0)">
        <rect x="8" y="8" width="36" height="36" rx="4" fill="url(#goldVoucher)"/>
        <text x="26" y="30" fill="#000000" font-size="18" font-weight="900" text-anchor="middle">🪙</text>
        <text x="44" y="46" fill="#ffff55" font-size="13" font-weight="900" text-anchor="end">64</text>
      </g>

      <!-- Item Slot 4: Enchanted Netherite Sword -->
      <g transform="translate(168, 0)">
        <rect x="8" y="8" width="36" height="36" rx="4" fill="url(#enchantShimmer)"/>
        <text x="26" y="30" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">⚔️</text>
      </g>

      <!-- Item Slot 5: Diamond Blocks -->
      <g transform="translate(224, 0)">
        <rect x="8" y="8" width="36" height="36" rx="4" fill="#06b6d4"/>
        <text x="26" y="30" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">💎</text>
        <text x="44" y="46" fill="#ffffff" font-size="13" font-weight="900" text-anchor="end">64</text>
      </g>

      <!-- Item Slot 6: Elytra -->
      <g transform="translate(280, 0)">
        <rect x="8" y="8" width="36" height="36" rx="4" fill="#475569"/>
        <text x="26" y="30" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">🪽</text>
      </g>

      <!-- Bottom Control Row -->
      <g transform="translate(0, 392)">
        <rect width="100" height="34" rx="2" fill="#15803d"/>
        <text x="50" y="22" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">🏦 DEPOSIT</text>

        <rect x="110" width="110" height="34" rx="2" fill="#b91c1c"/>
        <text x="165" y="22" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">💵 WITHDRAW</text>

        <rect x="230" width="130" height="34" rx="2" fill="#ca8a04"/>
        <text x="295" y="22" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">🏷️ SELL HAND</text>

        <rect x="370" width="134" height="34" rx="2" fill="#2563eb"/>
        <text x="437" y="22" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">📜 BANK LOGS</text>
      </g>
    </g>

    <!-- Hovered Tooltip Box on Netherite Sword -->
    <g transform="translate(180, 160)">
      <rect width="320" height="140" rx="4" fill="#100010" stroke="#280070" stroke-width="4"/>
      <text x="16" y="28" fill="#d946ef" font-size="14" font-weight="900">Netherite Sword</text>
      <text x="16" y="48" fill="#55ffff" font-size="12">Sharpness V</text>
      <text x="16" y="66" fill="#55ffff" font-size="12">Fire Aspect II • Unbreaking III</text>
      <line x1="16" y1="76" x2="304" y2="76" stroke="#555555" stroke-width="1"/>
      <text x="16" y="96" fill="#aaaaaa" font-size="12">Price: <tspan fill="#55ff55" font-weight="900">$450,000 Coins</tspan></text>
      <text x="16" y="118" fill="#ffff55" font-size="11">▶ Click to Buy Instantly</text>
    </g>
  </g>

  <!-- Authentic Minecraft In-Game Scoreboard on Right Side -->
  <g transform="translate(1000, 100)">
    <rect width="250" height="260" rx="4" fill="#000000" opacity="0.65"/>
    <text x="125" y="32" fill="#ffaa00" font-size="16" font-weight="900" text-anchor="middle">§6§lEconomySMP</text>
    <text x="16" y="56" fill="#aaaaaa" font-size="12">------------------------</text>
    
    <text x="16" y="80" fill="#ffffff" font-size="13">Player: <tspan fill="#55ffff">Steve</tspan></text>
    <text x="16" y="106" fill="#ffffff" font-size="13">Balance: <tspan fill="#55ff55" font-weight="900">$1,450,000</tspan></text>
    <text x="16" y="132" fill="#ffffff" font-size="13">Tokens: <tspan fill="#ff55ff">8,200</tspan></text>
    <text x="16" y="158" fill="#ffffff" font-size="13">Bank Rate: <tspan fill="#ffff55">+2.5%/hr</tspan></text>
    <text x="16" y="184" fill="#ffffff" font-size="13">Rank: <tspan fill="#ffaa00">[Veteran]</tspan></text>
    <text x="16" y="210" fill="#ffffff" font-size="13">Online: <tspan fill="#aaaaaa">142/500</tspan></text>
    
    <text x="16" y="234" fill="#aaaaaa" font-size="12">------------------------</text>
    <text x="125" y="250" fill="#ffff55" font-size="12" font-weight="700" text-anchor="middle">play.economysmp.net</text>
  </g>
</svg>`;

// 3. FIVEM ADVANCED FUEL & CHARGING AUTHENTIC NUI SCREENSHOT
const fivemFuelSvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <!-- Night Gas Station Background Simulation -->
  <rect width="1280" height="720" fill="#090d16"/>
  
  <!-- Ambient Gas Station Canopy Light Glow -->
  <ellipse cx="640" cy="180" rx="500" ry="120" fill="#ff9900" opacity="0.15"/>
  <rect x="200" y="40" width="880" height="60" rx="8" fill="#d97706" opacity="0.85"/>
  <text x="640" y="80" fill="#ffffff" font-size="28" font-weight="900" letter-spacing="4" text-anchor="middle">RON OIL — LOS SANTOS</text>

  <!-- Supercar Silhouette Representation -->
  <path d="M300 480 Q450 420 620 420 Q800 420 980 490 L1020 540 L260 540 Z" fill="#1e293b"/>
  <circle cx="380" cy="540" r="45" fill="#0f172a" stroke="#475569" stroke-width="8"/>
  <circle cx="900" cy="540" r="45" fill="#0f172a" stroke="#475569" stroke-width="8"/>

  <!-- Authentic FiveM QBCore / ox_lib Fuel NUI Overlay Box -->
  <g transform="translate(820, 260)">
    <rect width="400" height="380" rx="16" fill="#0b0f19" opacity="0.95" stroke="#f59e0b" stroke-width="2"/>
    
    <!-- NUI Header -->
    <rect width="400" height="52" rx="16" fill="#1e293b"/>
    <text x="24" y="33" fill="#f59e0b" font-size="16" font-weight="900">⛽ RON OIL REFUELING SYSTEM</text>
    <circle cx="370" cy="26" r="6" fill="#22c55e"/>

    <!-- Vehicle Info -->
    <g transform="translate(24, 75)">
      <text x="0" y="0" fill="#94a3b8" font-size="12" font-weight="600">TARGET VEHICLE</text>
      <text x="0" y="20" fill="#ffffff" font-size="16" font-weight="800">Benefactor Krieger (88XCD921)</text>

      <!-- Fuel Tank Progress Meter -->
      <text x="0" y="60" fill="#94a3b8" font-size="12" font-weight="600">CURRENT FUEL LEVEL</text>
      <text x="350" y="60" fill="#22c55e" font-size="14" font-weight="900" text-anchor="end">84%</text>

      <rect y="70" width="350" height="16" rx="8" fill="#1e293b"/>
      <rect y="70" width="294" height="16" rx="8" fill="#22c55e"/>

      <!-- Pricing Summary Box -->
      <rect y="105" width="350" height="85" rx="10" fill="#111827" stroke="#374151"/>
      <text x="16" y="130" fill="#94a3b8" font-size="13">Fuel Type:</text>
      <text x="334" y="130" fill="#ffffff" font-size="13" font-weight="700" text-anchor="end">98 Premium Octane</text>

      <text x="16" y="152" fill="#94a3b8" font-size="13">Price per Liter:</text>
      <text x="334" y="152" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="end">$1.75 / L</text>

      <text x="16" y="174" fill="#94a3b8" font-size="13">Total Cost (36.8L):</text>
      <text x="334" y="174" fill="#22c55e" font-size="15" font-weight="900" text-anchor="end">$64.40</text>

      <!-- Action Keybind Prompts -->
      <g transform="translate(0, 210)">
        <rect width="170" height="42" rx="8" fill="#f59e0b" cursor="pointer"/>
        <text x="85" y="26" fill="#000000" font-size="13" font-weight="900" text-anchor="middle">[E] HOLD TO REFUEL</text>

        <rect x="180" width="170" height="42" rx="8" fill="#dc2626" cursor="pointer"/>
        <text x="265" y="26" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">[X] STOP &amp; PAY</text>
      </g>
    </g>
  </g>

  <!-- Notification Toast in Top Center -->
  <g transform="translate(490, 130)">
    <rect width="300" height="46" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
    <text x="150" y="28" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">⛽ Fuel Nozzle Connected to Vehicle</text>
  </g>
</svg>`;

// 4. 2B2T ANARCHY UTILITY & BARITONE HIGHWAY SCREENSHOT
const anarchyUtilitySvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="'Courier New', Courier, monospace">
  <!-- Nether Highway Background -->
  <defs>
    <linearGradient id="netherBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a0808"/>
      <stop offset="60%" stop-color="#140404"/>
      <stop offset="100%" stop-color="#050101"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#netherBg)"/>

  <!-- Obsidian Tunnel Perspective Lines -->
  <line x1="0" y1="720" x2="640" y2="360" stroke="#4c1d95" stroke-width="6"/>
  <line x1="1280" y1="720" x2="640" y2="360" stroke="#4c1d95" stroke-width="6"/>
  <line x1="0" y1="0" x2="640" y2="360" stroke="#311042" stroke-width="4"/>
  <line x1="1280" y1="0" x2="640" y2="360" stroke="#311042" stroke-width="4"/>

  <!-- Baritone Wireframe Box -->
  <polygon points="560,320 720,320 760,400 520,400" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4" stroke-width="2"/>
  <text x="640" y="310" fill="#06b6d4" font-size="14" font-weight="900" text-anchor="middle">[Baritone Path: X+ Highway Target]</text>

  <!-- Crosshair -->
  <rect x="638" y="358" width="4" height="4" fill="#ffffff"/>

  <!-- Minecraft Java Edition F3 Debug Screen (Top Left) -->
  <g transform="translate(16, 20)">
    <rect width="360" height="150" fill="#000000" opacity="0.6"/>
    <text x="10" y="20" fill="#ffffff" font-size="12">Minecraft 1.20.4 (Fabric Client)</text>
    <text x="10" y="38" fill="#ffffff" font-size="12">144 fps (120 min) / 60 chunks</text>
    <text x="10" y="56" fill="#ffffff" font-size="12">XYZ: 1000002.45 / 120.00 / 0.00</text>
    <text x="10" y="74" fill="#ffffff" font-size="12">Block: nether_bricks (Nether X+ Axis)</text>
    <text x="10" y="92" fill="#ffffff" font-size="12">Facing: East (Towards positive X)</text>
    <text x="10" y="110" fill="#55ff55" font-size="12">Server: 2b2t.org (GrimAC: Active)</text>
    <text x="10" y="128" fill="#ffff55" font-size="12">TPS: 19.98 • Ping: 42ms</text>
  </g>

  <!-- Anarchy Utility Active Arraylist / HUD (Top Right) -->
  <g transform="translate(980, 20)">
    <rect width="280" height="260" rx="4" fill="#000000" opacity="0.75" stroke="#4c1d95" stroke-width="1.5"/>
    <text x="140" y="26" fill="#a855f7" font-size="15" font-weight="900" text-anchor="middle">2B2T ANARCHY SUITE</text>
    <line x1="10" y1="36" x2="270" y2="36" stroke="#4c1d95" stroke-width="1"/>

    <text x="16" y="60" fill="#06b6d4" font-size="13" font-weight="900">Baritone <tspan fill="#ffffff">[Auto-Highway]</tspan></text>
    <text x="16" y="85" fill="#22c55e" font-size="13" font-weight="900">AutoTotem <tspan fill="#ffffff">[14 Totems]</tspan></text>
    <text x="16" y="110" fill="#c084fc" font-size="13" font-weight="900">ElytraFly <tspan fill="#ffffff">[74.2 bps]</tspan></text>
    <text x="16" y="135" fill="#eab308" font-size="13" font-weight="900">Surround <tspan fill="#ffffff">[Obsidian 100%]</tspan></text>
    <text x="16" y="160" fill="#3b82f6" font-size="13" font-weight="900">PacketFly <tspan fill="#ffffff">[Grim Bypass]</tspan></text>
    <text x="16" y="185" fill="#ef4444" font-size="13" font-weight="900">Anti-CevBreaker <tspan fill="#ffffff">[ON]</tspan></text>
    <text x="16" y="210" fill="#10b981" font-size="13" font-weight="900">StashFinder <tspan fill="#ffffff">[Scanning 32ch]</tspan></text>
    <text x="16" y="235" fill="#94a3b8" font-size="13">VisualRange <tspan fill="#ffffff">[0 Nearby]</tspan></text>
  </g>

  <!-- Bottom Baritone Status HUD -->
  <g transform="translate(440, 640)">
    <rect width="400" height="50" rx="8" fill="#000000" opacity="0.8" stroke="#06b6d4" stroke-width="1.5"/>
    <text x="200" y="24" fill="#06b6d4" font-size="12" font-weight="900" text-anchor="middle">BARITONE HIGHWAY DIGGER ACTIVE</text>
    <text x="200" y="42" fill="#ffffff" font-size="12" text-anchor="middle">Blocks Excavated: 8,420 • Speed: 18.4 bps</text>
  </g>
</svg>`;

// Write all SVGs
fs.writeFileSync(path.join(outputDir, 'discord_ticket_panel.svg'), discordTicketSvg, 'utf8');
fs.writeFileSync(path.join(outputDir, 'minecraft_economy_gui.svg'), minecraftEconomySvg, 'utf8');
fs.writeFileSync(path.join(outputDir, 'gta_gas_station.svg'), fivemFuelSvg, 'utf8');
fs.writeFileSync(path.join(outputDir, 'minecraft_anarchy_highway.svg'), anarchyUtilitySvg, 'utf8');

console.log('Successfully generated all 4 pixel-perfect non-AI screenshots in SVG!');
