// Central Server Store for Live System Configuration, Plugins, Users, and IP Management

let systemConfig = {
  maintenanceMode: false,
  maintenanceMessage: 'MinoForge is currently undergoing scheduled platform upgrades. We will be back shortly!',
  registrationsEnabled: true,
  creatorSubmissionsEnabled: true,
  autoApproveVerifiedCreators: false,
  platformCommissionFeePercent: 10,
  defaultCurrency: 'USD',
  minoShieldSensitivity: 'STRICT',
  maxUploadSizeMB: 500,
  enableAiConfigGenerator: true,
  aiFreeDailyLimit: 2,
  dispatcherEmail: 'MinoForge Verification System',
  adminNotifyEmail: 'MinoForge Administrative Inbound',
  announcement: {
    enabled: false,
    text: '🚀 Welcome to MinoForge! Explore verified plugins with 0% platform fees for Ultimate creators.',
    type: 'info'
  },
  multiAccountPolicy: {
    enabled: true,
    suspensionGracePeriodDays: 20,
    action: 'WARN_AND_COUNTDOWN'
  }
};

let plugins = [
  {
    id: 'p-mine-1',
    title: 'Ultimate Economy & Multi-Currency Vault',
    summary: 'High-performance multi-currency vault system with GUI ATMs, pin codes, and transaction logs.',
    description: 'Complete Spigot/Paper economy solution featuring physical and digital banking, currency exchange, custom tax rates, and vault integration.',
    price: 4.99,
    rating: 4.9,
    downloads: 0,
    version: '2.4.0',
    fileSize: '4.2 MB',
    status: 'APPROVED',
    isPromoted: true,
    coverImageUrl: '/images/plugins/minecraft_economy_gui.svg',
    author: { id: 'u-1', username: 'SevGamer', avatarUrl: '/images/avatars/default.png' },
    game: { id: 'g-1', name: 'Minecraft', slug: 'minecraft' },
    minoShieldStatus: 'CLEAN_BYTECODE',
    tags: ['Economy', 'Vault', 'Banking', 'GUI'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-fivem-2',
    title: 'Advanced Fuel & Electric Vehicle Charging Station',
    summary: 'Realistic gas stations, EV charging, jerry cans, fuel nozzles, and synchronized UI for QBCore & ESX.',
    description: 'A cutting-edge FiveM fuel management script with realistic nozzle physics, octane ratings, and solar-powered EV superchargers.',
    price: 3.49,
    rating: 4.8,
    downloads: 0,
    version: '1.1.2',
    fileSize: '8.7 MB',
    status: 'APPROVED',
    isPromoted: true,
    coverImageUrl: '/images/plugins/gta_gas_station.svg',
    author: { id: 'u-2', username: 'FiveMDev', avatarUrl: '/images/avatars/default.png' },
    game: { id: 'g-2', name: 'FiveM', slug: 'fivem' },
    minoShieldStatus: 'CLEAN_BYTECODE',
    tags: ['Fuel', 'Vehicles', 'QBCore', 'ESX'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-bot-3',
    title: 'Discord Automated Ticket & Transcript Archiver Bot',
    summary: 'Automated button ticket creation, private claim channels, and clean HTML transcripts.',
    description: 'Full-featured Node.js & Discord.js v14 ticketing bot with HTML transcript generation and staff productivity metrics.',
    price: 0.00,
    rating: 5.0,
    downloads: 0,
    version: '3.0.1',
    fileSize: '2.1 MB',
    status: 'APPROVED',
    isPromoted: false,
    coverImageUrl: '/images/plugins/discord_ticket_panel.svg',
    author: { id: 'u-3', username: 'BotMaster', avatarUrl: '/images/avatars/default.png' },
    game: { id: 'g-4', name: 'Discord', slug: 'discord' },
    minoShieldStatus: 'CLEAN_BYTECODE',
    tags: ['Discord', 'Tickets', 'Moderation', 'Transcripts'],
    createdAt: new Date().toISOString()
  }
];

let users = [
  { id: 'u-admin', username: 'SevGamerPro', email: 'admin@minoforge.net', role: 'ADMIN', registeredAt: 'Aug 2026', ip: '127.0.0.1', status: 'ACTIVE', flags: 0, avatarUrl: '/images/avatars/default.png' },
  { id: 'u-1', username: 'AlexDev', email: 'creator@example.com', role: 'CREATOR', registeredAt: 'Aug 2026', ip: '82.165.42.19', status: 'ACTIVE', flags: 0, avatarUrl: '/images/avatars/default.png' },
  { id: 'u-2', username: 'PixelCraft', email: 'pixel@example.com', role: 'USER', registeredAt: 'Aug 2026', ip: '192.168.1.102', status: 'FLAGGED_IP_MULTI', flags: 1, avatarUrl: '/images/avatars/default.png' },
];

let auditLogs = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'AUTH_SUCCESS', actor: 'Master Administrator', details: 'Nimda Master 2FA Gateway Access Approved', ip: '127.0.0.1' },
  { id: 'log-2', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'SECURITY_SCAN', actor: 'MinoShield™ Engine', details: 'Bytecode scan completed for UltimateEconomy-v2.4.0.zip (Clean 0/0)', ip: 'SYSTEM' },
  { id: 'log-3', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'CONFIG_SYNC', actor: 'ADMIN', details: 'Global currency registry initialized with USD default', ip: '127.0.0.1' },
];

module.exports = {
  getConfig: () => systemConfig,
  updateConfig: (newConfig) => {
    systemConfig = { ...systemConfig, ...newConfig };
    return systemConfig;
  },
  getPlugins: () => plugins,
  getPluginById: (id) => plugins.find(p => p.id === id),
  getFeaturedPlugins: () => plugins.filter(p => p.status === 'APPROVED' && p.isPromoted),
  updatePlugin: (id, updates) => {
    const idx = plugins.findIndex(p => p.id === id);
    if (idx !== -1) {
      plugins[idx] = { ...plugins[idx], ...updates };
      return plugins[idx];
    }
    return null;
  },
  deletePlugin: (id) => {
    const initialLen = plugins.length;
    plugins = plugins.filter(p => p.id !== id);
    return plugins.length < initialLen;
  },
  getUsers: () => users,
  getUserById: (id) => users.find(u => u.id === id),
  updateUserRole: (id, role) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], role };
      return users[idx];
    }
    return null;
  },
  resolveUserIpFlag: (id) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], flags: 0, status: 'ACTIVE' };
      return users[idx];
    }
    return null;
  },
  getAuditLogs: () => auditLogs,
  addAuditLog: (log) => {
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    });
    if (auditLogs.length > 100) auditLogs.pop();
  }
};
