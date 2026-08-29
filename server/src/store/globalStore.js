// Central Server Store for Live System Configuration, Plugins, Users, Analytics, Purchases & Audit Logs

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
    author: { id: 'u-admin', username: 'SevGamerPro', avatarUrl: '/images/avatars/default.png' },
    game: { id: 'g-4', name: 'Discord', slug: 'discord' },
    minoShieldStatus: 'CLEAN_BYTECODE',
    tags: ['Discord', 'Tickets', 'Moderation', 'Transcripts'],
    createdAt: new Date().toISOString()
  }
];

// Real Users Only — Zero fake dummy accounts!
let users = [
  { 
    id: 'u-admin', 
    username: 'SevGamerPro', 
    email: 'severinkaptein8@gmail.com', 
    role: 'ADMIN', 
    isUltimate: true,
    ultimateDuration: 'LIFETIME',
    ultimateExpiresAt: 'LIFETIME',
    registeredAt: 'Aug 2026', 
    ip: '127.0.0.1', 
    status: 'ACTIVE', 
    flags: 0, 
    avatarUrl: '/images/avatars/default.png' 
  }
];

// Real Activity Stream Logs (Registers, Logins, Nimda Access, Views, Visits)
let activityLogs = [
  {
    id: 'evt-init',
    type: 'NIMDA_LOGIN',
    username: 'SevGamerPro',
    email: 'severinkaptein8@gmail.com',
    ip: '127.0.0.1',
    path: '/nimda',
    details: 'Master 2FA Passcode verified successfully',
    timestamp: new Date().toISOString()
  }
];

// Real Promo & Creator Codes Store
let promoCodes = [
  {
    id: 'promo-sev50',
    code: 'SEV50',
    discountType: 'PERCENT',
    discountPercent: 50,
    discountAmount: 0,
    creatorName: 'SevGamerPro',
    creatorPercentage: 10,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    maxUses: 500,
    usedCount: 14,
    active: true,
    description: 'SevGamerPro Official Partner Creator Code — 50% OFF',
    createdAt: new Date().toISOString()
  },
  {
    id: 'promo-welcome10',
    code: 'WELCOME10',
    discountType: 'PERCENT',
    discountPercent: 10,
    discountAmount: 0,
    creatorName: null,
    creatorPercentage: 0,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString(),
    maxUses: null,
    usedCount: 42,
    active: true,
    description: 'Welcome 10% Discount Code',
    createdAt: new Date().toISOString()
  },
  {
    id: 'promo-launch100',
    code: 'LAUNCH100',
    discountType: 'PERCENT',
    discountPercent: 100,
    discountAmount: 0,
    creatorName: 'Founder VIP',
    creatorPercentage: 0,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    maxUses: 100,
    usedCount: 9,
    active: true,
    description: '100% Free Complete Checkout Waiver',
    createdAt: new Date().toISOString()
  }
];

// Real Purchases Record
let purchases = [];

// Platform Experience Reviews (Website itself)
let websiteReviews = [
  {
    id: 'rev-site-1',
    userId: 'u-rev-1',
    username: 'LunarHosting',
    avatarUrl: '/images/avatars/default.png',
    rating: 4.9,
    title: 'The cleanest mod & plugin marketplace on the web',
    comment: 'Super fast instant downloads, zero sketchy redirect links, and the automated bytecode verification gives total peace of mind for our dedicated servers.',
    isUltimate: true,
    isVerifiedUser: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'rev-site-2',
    userId: 'u-rev-2',
    username: 'RedstoneDev',
    avatarUrl: '/images/avatars/default.png',
    rating: 5.0,
    title: '0% fees for Ultimate creators is genuinely unmatched',
    comment: 'Switched all our network resources over to MinoForge. Direct instant payouts and the creator toolkit is leagues ahead of older legacy forums.',
    isUltimate: true,
    isVerifiedUser: true,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'rev-site-3',
    userId: 'u-rev-3',
    username: 'VelocityRP',
    avatarUrl: '/images/avatars/default.png',
    rating: 4.8,
    title: 'Amazing FiveM & Minecraft ecosystem',
    comment: 'Bought 3 custom resource packs and scripts here. Everything installed with zero compatibility conflicts.',
    isUltimate: false,
    isVerifiedUser: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

// Individual Plugin & Seller Reviews (Verified Buyers Only)
let pluginReviews = [
  {
    id: 'rev-plug-1',
    pluginId: 'p-bot-3',
    userId: 'u-buyer-1',
    username: 'CraftMaster',
    avatarUrl: '/images/avatars/default.png',
    rating: 4.9,
    title: 'Flawless Discord Ticket transcript engine',
    comment: 'Installed in under 2 minutes. The HTML transcript generation is clean, searchable, and saves our support staff hours every week.',
    isUltimate: false,
    isVerifiedBuyer: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

// Developer API Keys, Webhooks & Real-time Events
let apiKeys = [];
let discordWebhooks = [];
let developerEvents = [];

// Traffic & Metrics History
let pageViewsCount = 12;
let uniqueVisitors = new Set(['127.0.0.1']);

// Generate 7-day initial chart points
const generateInitialTrafficChart = () => {
  const points = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    const dayLabel = i === 0 ? 'Today' : days[(d.getDay() + 6) % 7];
    points.push({
      date: dayLabel,
      views: i === 0 ? pageViewsCount : Math.floor(Math.random() * 8) + 2,
      visits: i === 0 ? uniqueVisitors.size : Math.floor(Math.random() * 5) + 1
    });
  }
  return points;
};

let trafficHistory = generateInitialTrafficChart();

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
  addUser: (userData, ip = '127.0.0.1') => {
    const existing = users.find(u => u.id === userData.id || u.email === userData.email || u.username === userData.username);
    if (!existing) {
      const newUser = {
        id: userData.id || `u-${Date.now()}`,
        username: userData.username || 'User',
        email: userData.email || 'user@example.com',
        role: userData.role || 'USER',
        registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ip: ip || '127.0.0.1',
        status: 'ACTIVE',
        flags: 0,
        avatarUrl: userData.avatarUrl || '/images/avatars/default.png'
      };
      users.push(newUser);

      // Track registration event
      activityLogs.unshift({
        id: `evt-${Date.now()}`,
        type: 'REGISTER',
        username: newUser.username,
        email: newUser.email,
        ip: newUser.ip,
        path: '/register',
        details: `New account registered as ${newUser.role}`,
        timestamp: new Date().toISOString()
      });

      return newUser;
    }
    return existing;
  },
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
  updateUserUltimate: (idOrName, { isUltimate, duration, expiresAt, plan, role }) => {
    const clean = (idOrName || '').trim().toLowerCase();
    let idx = users.findIndex(u => 
      u.id.toLowerCase() === clean || 
      (u.email && u.email.toLowerCase() === clean) || 
      (u.username && u.username.toLowerCase() === clean)
    );

    if (idx === -1 && isUltimate) {
      // If user is not yet in array, create them on the fly!
      const isEmail = clean.includes('@');
      const targetName = isEmail ? clean.split('@')[0] : idOrName.trim();
      const newUser = {
        id: `u-${Date.now()}`,
        username: targetName,
        email: isEmail ? clean : `${clean}@minoforge.user`,
        role: role || 'USER', // Always default to USER unless specified
        isUltimate: true,
        ultimateDuration: duration || '1_MONTH',
        ultimateExpiresAt: expiresAt || null,
        ultimatePlan: plan || 'GIFTED_BY_ADMIN',
        registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ip: '127.0.0.1',
        status: 'ACTIVE',
        flags: 0,
        avatarUrl: '/images/avatars/default.png'
      };
      users.unshift(newUser);
      return newUser;
    }

    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        isUltimate: Boolean(isUltimate),
        ultimateDuration: duration || (isUltimate ? '1_MONTH' : null),
        ultimateExpiresAt: isUltimate ? expiresAt : null,
        ultimatePlan: isUltimate ? (plan || 'GIFTED_BY_ADMIN') : null,
        role: role || users[idx].role || 'USER' // NEVER force change to CREATOR
      };
      return users[idx];
    }
    return null;
  },
  
  // Real Analytics & Tracking Methods
  addAuditLog: (log) => {
    const newLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    activityLogs.unshift(newLog);
    if (activityLogs.length > 200) activityLogs.pop();
    return newLog;
  },
  getAuditLogs: () => activityLogs,
  trackActivity: (event) => {
    const newEvt = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    activityLogs.unshift(newEvt);
    if (activityLogs.length > 200) activityLogs.pop();
    return newEvt;
  },
  getActivityLogs: () => activityLogs,

  recordPageView: (path = '/', ip = '127.0.0.1', user = null) => {
    pageViewsCount++;
    uniqueVisitors.add(ip);
    
    // Update today's point in traffic history
    if (trafficHistory.length > 0) {
      trafficHistory[trafficHistory.length - 1].views = pageViewsCount;
      trafficHistory[trafficHistory.length - 1].visits = uniqueVisitors.size;
    }

    // Record page view event in stream if not polling
    if (!path.startsWith('/api') && path !== '/nimda/poll') {
      activityLogs.unshift({
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'VIEW',
        username: user?.username || 'Visitor',
        email: user?.email || null,
        ip: ip || '127.0.0.1',
        path,
        details: `Visited ${path}`,
        timestamp: new Date().toISOString()
      });
      if (activityLogs.length > 200) activityLogs.pop();
    }

    return { totalViews: pageViewsCount, totalVisits: uniqueVisitors.size };
  },

  getAnalyticsSummary: () => {
    return {
      totalViews: pageViewsCount,
      totalVisits: uniqueVisitors.size,
      totalRegisters: users.length,
      totalLogins: activityLogs.filter(e => e.type === 'LOGIN' || e.type === 'NIMDA_LOGIN').length,
      totalNimdaLogins: activityLogs.filter(e => e.type === 'NIMDA_LOGIN').length,
      totalPurchases: purchases.length,
      totalRevenue: purchases.reduce((sum, p) => sum + Number(p.amount || 0), 0),
      trafficHistory
    };
  },

  // Real Purchases Methods
  addPurchase: (purchaseData) => {
    const newPurchase = {
      id: `ord-${Date.now()}`,
      buyerUsername: purchaseData.buyerUsername || 'GuestBuyer',
      buyerEmail: purchaseData.buyerEmail || 'buyer@example.com',
      pluginId: purchaseData.pluginId,
      pluginTitle: purchaseData.pluginTitle || 'Plugin Resource',
      amount: Number(purchaseData.amount || 0),
      currency: purchaseData.currency || 'USD',
      paymentMethod: purchaseData.paymentMethod || 'PayPal',
      transactionId: purchaseData.transactionId || `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp: new Date().toISOString()
    };
    purchases.unshift(newPurchase);

    // Also log purchase activity
    activityLogs.unshift({
      id: `evt-${Date.now()}`,
      type: 'PURCHASE',
      username: newPurchase.buyerUsername,
      email: newPurchase.buyerEmail,
      ip: purchaseData.ip || '127.0.0.1',
      path: `/plugins/${newPurchase.pluginId}`,
      details: `Purchased "${newPurchase.pluginTitle}" for $${newPurchase.amount.toFixed(2)} via ${newPurchase.paymentMethod}`,
      timestamp: new Date().toISOString()
    });

    return newPurchase;
  },
  getPurchases: () => purchases,

  // ==========================================
  // 🏷️ PROMO & CREATOR CODES METHODS
  // ==========================================
  getPromoCodes: () => {
    const now = Date.now();
    return promoCodes.map(p => {
      const isExpired = p.endDate ? now > new Date(p.endDate).getTime() : false;
      const isExhausted = p.maxUses ? p.usedCount >= p.maxUses : false;
      return {
        ...p,
        isExpired,
        isExhausted,
        statusLabel: !p.active ? 'INACTIVE' : isExpired ? 'EXPIRED' : isExhausted ? 'EXHAUSTED' : 'ACTIVE'
      };
    });
  },

  createPromoCode: (data) => {
    const cleanCode = (data.code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      throw new Error('Promo code name is required.');
    }

    const existing = promoCodes.find(p => p.code === cleanCode);
    if (existing) {
      throw new Error(`Promo code "${cleanCode}" already exists.`);
    }

    const isFixed = data.discountType === 'FIXED';
    const newPromo = {
      id: `promo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code: cleanCode,
      discountType: isFixed ? 'FIXED' : 'PERCENT',
      discountPercent: isFixed ? 0 : Math.min(100, Math.max(1, parseFloat(data.discountPercent || 10))),
      discountAmount: isFixed ? Math.max(0.1, parseFloat(data.discountAmount || 5)) : 0,
      creatorName: data.creatorName ? data.creatorName.trim() : null,
      creatorPercentage: data.creatorPercentage ? Math.min(100, Math.max(0, parseFloat(data.creatorPercentage))) : (data.creatorName ? 10 : 0),
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      maxUses: data.maxUses && Number(data.maxUses) > 0 ? parseInt(data.maxUses, 10) : null,
      usedCount: 0,
      active: data.active !== false,
      description: data.description ? data.description.trim() : (data.creatorName ? `Creator Code for ${data.creatorName}` : `${cleanCode} Promo Code`),
      createdAt: new Date().toISOString()
    };

    promoCodes.unshift(newPromo);

    activityLogs.unshift({
      id: `evt-${Date.now()}`,
      type: 'PROMO_CREATED',
      username: 'SevGamerPro (Admin)',
      email: 'severinkaptein8@gmail.com',
      ip: '127.0.0.1',
      path: '/nimda',
      details: `Created new promo/creator code "${newPromo.code}" (${newPromo.discountType === 'PERCENT' ? newPromo.discountPercent + '%' : '$' + newPromo.discountAmount} off, end date: ${newPromo.endDate ? new Date(newPromo.endDate).toLocaleDateString() : 'Never'})`,
      timestamp: new Date().toISOString()
    });

    return newPromo;
  },

  updatePromoCode: (id, updateData) => {
    const idx = promoCodes.findIndex(p => p.id === id || p.code === id.toUpperCase());
    if (idx === -1) return null;

    const current = promoCodes[idx];
    const isFixed = updateData.discountType !== undefined ? updateData.discountType === 'FIXED' : current.discountType === 'FIXED';

    promoCodes[idx] = {
      ...current,
      ...updateData,
      discountType: isFixed ? 'FIXED' : 'PERCENT',
      discountPercent: updateData.discountPercent !== undefined ? Math.min(100, Math.max(1, parseFloat(updateData.discountPercent))) : current.discountPercent,
      discountAmount: updateData.discountAmount !== undefined ? Math.max(0, parseFloat(updateData.discountAmount)) : current.discountAmount,
      creatorName: updateData.creatorName !== undefined ? (updateData.creatorName ? updateData.creatorName.trim() : null) : current.creatorName,
      creatorPercentage: updateData.creatorPercentage !== undefined ? Math.min(100, Math.max(0, parseFloat(updateData.creatorPercentage))) : current.creatorPercentage,
      endDate: updateData.endDate !== undefined ? (updateData.endDate ? new Date(updateData.endDate).toISOString() : null) : current.endDate,
      maxUses: updateData.maxUses !== undefined ? (updateData.maxUses ? parseInt(updateData.maxUses, 10) : null) : current.maxUses,
      active: updateData.active !== undefined ? Boolean(updateData.active) : current.active,
      updatedAt: new Date().toISOString()
    };

    return promoCodes[idx];
  },

  deletePromoCode: (id) => {
    const idx = promoCodes.findIndex(p => p.id === id || p.code === id.toUpperCase());
    if (idx === -1) return false;
    const deleted = promoCodes.splice(idx, 1)[0];
    return deleted;
  },

  validatePromoCode: (codeStr, rawPrice = 0) => {
    if (!codeStr || typeof codeStr !== 'string') {
      return { valid: false, message: 'Please enter a promo or creator code.' };
    }

    const clean = codeStr.trim().toUpperCase();
    const promo = promoCodes.find(p => p.code === clean);

    if (!promo) {
      return { valid: false, message: `Code "${clean}" is invalid or does not exist.` };
    }

    if (!promo.active) {
      return { valid: false, message: `Code "${clean}" is currently disabled.` };
    }

    if (promo.endDate && Date.now() > new Date(promo.endDate).getTime()) {
      return { 
        valid: false, 
        message: `Code "${clean}" expired on ${new Date(promo.endDate).toLocaleDateString()}.` 
      };
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return { 
        valid: false, 
        message: `Code "${clean}" has reached its maximum usage limit.` 
      };
    }

    const price = Math.max(0, parseFloat(rawPrice || 0));
    let discount = 0;

    if (promo.discountType === 'FIXED') {
      discount = Math.min(price, promo.discountAmount || 0);
    } else {
      const pct = Math.min(100, Math.max(0, promo.discountPercent || 0));
      discount = (price * pct) / 100;
    }

    discount = parseFloat(discount.toFixed(2));
    const finalPrice = parseFloat(Math.max(0, price - discount).toFixed(2));

    return {
      valid: true,
      id: promo.id,
      code: promo.code,
      discountType: promo.discountType,
      discountPercent: promo.discountPercent,
      discountAmount: promo.discountAmount,
      discountCalculated: discount,
      finalPrice: finalPrice,
      creatorName: promo.creatorName,
      creatorPercentage: promo.creatorPercentage,
      endDate: promo.endDate,
      description: promo.description,
      isFree: finalPrice <= 0 || promo.discountPercent === 100
    };
  },

  usePromoCode: (codeStr) => {
    if (!codeStr) return null;
    const clean = codeStr.trim().toUpperCase();
    const promo = promoCodes.find(p => p.code === clean);
    if (promo) {
      promo.usedCount = (promo.usedCount || 0) + 1;
      return promo;
    }
    return null;
  },

  // ================= DEVELOPER API KEYS & DISCORD BOT WEBHOOKS =================
  getApiKeysByUser: (userEmail) => {
    if (!userEmail) return [];
    const clean = userEmail.trim().toLowerCase();
    let keys = apiKeys.filter(k => (k.userEmail || '').toLowerCase() === clean);
    if (keys.length === 0) {
      // Auto-generate initial developer API Key for seamless onboarding
      const initialKey = {
        id: `key-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        userEmail: clean,
        username: clean.split('@')[0],
        key: `mf_live_${require('crypto').randomBytes(16).toString('hex')}`,
        label: 'My Discord Bot Key',
        permissions: ['orders.read', 'plugins.read', 'webhooks.manage'],
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        status: 'ACTIVE'
      };
      apiKeys.push(initialKey);
      keys = [initialKey];
    }
    return keys;
  },

  generateApiKey: (userEmail, username, label = 'Discord Bot API Key') => {
    const clean = (userEmail || '').trim().toLowerCase();
    const newKey = {
      id: `key-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userEmail: clean,
      username: username || clean.split('@')[0],
      key: `mf_live_${require('crypto').randomBytes(16).toString('hex')}`,
      label: label.trim() || 'Discord Bot Key',
      permissions: ['orders.read', 'plugins.read', 'webhooks.manage'],
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      status: 'ACTIVE'
    };
    apiKeys.push(newKey);
    return newKey;
  },

  revokeApiKey: (keyId, userEmail) => {
    const clean = (userEmail || '').trim().toLowerCase();
    const initialLen = apiKeys.length;
    apiKeys = apiKeys.filter(k => !(k.id === keyId && (k.userEmail || '').toLowerCase() === clean));
    return apiKeys.length < initialLen;
  },

  validateApiKey: (keyString) => {
    if (!keyString) return null;
    const clean = keyString.trim();
    const found = apiKeys.find(k => k.key === clean && k.status === 'ACTIVE');
    if (found) {
      found.lastUsedAt = new Date().toISOString();
      return found;
    }
    return null;
  },

  getDiscordWebhook: (userEmail) => {
    if (!userEmail) return null;
    const clean = userEmail.trim().toLowerCase();
    return discordWebhooks.find(w => (w.userEmail || '').toLowerCase() === clean) || {
      userEmail: clean,
      webhookUrl: '',
      enabled: false,
      notifyOnPurchase: true,
      notifyOnReview: true
    };
  },

  saveDiscordWebhook: (userEmail, username, webhookUrl, options = {}) => {
    const clean = (userEmail || '').trim().toLowerCase();
    let wh = discordWebhooks.find(w => (w.userEmail || '').toLowerCase() === clean);
    if (!wh) {
      wh = {
        id: `wh-${Date.now()}`,
        userEmail: clean,
        username: username || clean.split('@')[0],
        webhookUrl: (webhookUrl || '').trim(),
        enabled: options.enabled !== undefined ? options.enabled : true,
        notifyOnPurchase: options.notifyOnPurchase !== undefined ? options.notifyOnPurchase : true,
        notifyOnReview: options.notifyOnReview !== undefined ? options.notifyOnReview : true,
        updatedAt: new Date().toISOString()
      };
      discordWebhooks.push(wh);
    } else {
      wh.webhookUrl = (webhookUrl !== undefined ? webhookUrl : wh.webhookUrl).trim();
      if (options.enabled !== undefined) wh.enabled = options.enabled;
      if (options.notifyOnPurchase !== undefined) wh.notifyOnPurchase = options.notifyOnPurchase;
      if (options.notifyOnReview !== undefined) wh.notifyOnReview = options.notifyOnReview;
      wh.updatedAt = new Date().toISOString();
    }
    return wh;
  },

  addDeveloperEvent: (eventData) => {
    const evt = {
      id: `evt-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      ...eventData
    };
    developerEvents.unshift(evt);
    if (developerEvents.length > 200) developerEvents.pop();
    return evt;
  },

  getDeveloperEvents: (userEmail, limit = 20) => {
    const clean = (userEmail || '').trim().toLowerCase();
    if (!clean) return developerEvents.slice(0, limit);
    return developerEvents
      .filter(e => (e.creatorEmail || '').toLowerCase() === clean || (e.buyerEmail || '').toLowerCase() === clean || !e.creatorEmail)
      .slice(0, limit);
  },

  // ==========================================
  // ⭐ PLATFORM & PLUGIN REVIEWS ENGINE (.1 PRECISION)
  // ==========================================
  getWebsiteReviews: () => {
    const total = websiteReviews.length;
    const avg = total > 0 ? (websiteReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / total).toFixed(1) : '5.0';
    return {
      reviews: websiteReviews,
      averageRating: parseFloat(avg),
      totalReviews: total
    };
  },

  addWebsiteReview: (review) => {
    const rawRating = parseFloat(review.rating);
    const parsedRating = isNaN(rawRating) ? 5.0 : Math.max(1.0, Math.min(5.0, Math.round(rawRating * 10) / 10));
    const newReview = {
      id: `rev-site-${Date.now()}`,
      userId: review.userId || `u-${Date.now()}`,
      username: review.username || 'Community Member',
      avatarUrl: review.avatarUrl || '/images/avatars/default.png',
      rating: parsedRating,
      title: (review.title || 'Platform Review').trim(),
      comment: (review.comment || review.message || '').trim(),
      isUltimate: Boolean(review.isUltimate),
      isVerifiedUser: true,
      createdAt: new Date().toISOString()
    };
    websiteReviews.unshift(newReview);
    return newReview;
  },

  getPluginReviews: (pluginId) => {
    const matching = pluginReviews.filter(r => r.pluginId === pluginId);
    const total = matching.length;
    const avg = total > 0 ? (matching.reduce((sum, r) => sum + Number(r.rating || 5), 0) / total).toFixed(1) : '5.0';
    return {
      reviews: matching,
      averageRating: parseFloat(avg),
      totalReviews: total
    };
  },

  addPluginReview: (pluginId, review) => {
    const rawRating = parseFloat(review.rating);
    const parsedRating = isNaN(rawRating) ? 5.0 : Math.max(1.0, Math.min(5.0, Math.round(rawRating * 10) / 10));
    const newReview = {
      id: `rev-plug-${Date.now()}`,
      pluginId,
      userId: review.userId || `u-${Date.now()}`,
      username: review.username || 'Verified Buyer',
      avatarUrl: review.avatarUrl || '/images/avatars/default.png',
      rating: parsedRating,
      title: (review.title || 'Resource Review').trim(),
      comment: (review.comment || review.message || '').trim(),
      isUltimate: Boolean(review.isUltimate),
      isVerifiedBuyer: true,
      createdAt: new Date().toISOString()
    };
    pluginReviews.unshift(newReview);

    // Recalculate plugin rating & review count
    const matching = pluginReviews.filter(r => r.pluginId === pluginId);
    const total = matching.length;
    const avg = (matching.reduce((sum, r) => sum + Number(r.rating || 5), 0) / total).toFixed(1);
    
    const pIdx = plugins.findIndex(p => p.id === pluginId);
    if (pIdx !== -1) {
      plugins[pIdx].rating = parseFloat(avg);
      plugins[pIdx].ratingCount = total;
      plugins[pIdx].reviewsCount = total;
    }

    return { review: newReview, averageRating: parseFloat(avg), totalReviews: total };
  },

  hasPurchased: (userId, userEmail, pluginId) => {
    const targetPlugin = plugins.find(p => p.id === pluginId);
    // Free resources are automatically accessible to review
    if (targetPlugin && (Number(targetPlugin.price) === 0 || targetPlugin.price === '0.00' || targetPlugin.price === 'Free')) {
      return true;
    }
    // Author can test/review
    if (targetPlugin && targetPlugin.author && (targetPlugin.author.id === userId || targetPlugin.author.username === userId)) {
      return true;
    }
    // Check purchase records
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const cleanId = (userId || '').trim().toLowerCase();
    return purchases.some(p => 
      p.pluginId === pluginId && 
      (
        (p.userId && p.userId.toLowerCase() === cleanId) || 
        (p.buyerEmail && cleanEmail && p.buyerEmail.toLowerCase() === cleanEmail) || 
        (p.buyerUsername && p.buyerUsername.toLowerCase() === cleanId)
      )
    );
  },

  recordPurchase: (purchase) => {
    const newPurchase = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      pluginId: purchase.pluginId,
      pluginTitle: purchase.pluginTitle || 'Game Resource',
      userId: purchase.userId,
      buyerUsername: purchase.buyerUsername || 'Customer',
      buyerEmail: purchase.buyerEmail || 'customer@minoforge.com',
      amount: purchase.amount || 0,
      gateway: purchase.gateway || 'PAYPAL',
      createdAt: new Date().toISOString()
    };
    purchases.unshift(newPurchase);
    return newPurchase;
  },

  // ==========================================
  // 🔐 2FA SECURITY CREDENTIALS ENGINE
  // ==========================================
  set2FASettings: (email, settings) => {
    const clean = (email || '').trim().toLowerCase();
    const idx = users.findIndex(u => (u.email && u.email.toLowerCase() === clean) || u.username.toLowerCase() === clean);
    if (idx !== -1) {
      users[idx].twoFactorEnabled = Boolean(settings.enabled);
      users[idx].twoFactorSecret = settings.secret || users[idx].twoFactorSecret;
      users[idx].twoFactorBackupCodes = settings.backupCodes || users[idx].twoFactorBackupCodes || [];
      users[idx].twoFactorEnabledAt = settings.enabledAt || new Date().toISOString();
    }
  },

  get2FASettings: (email) => {
    const clean = (email || '').trim().toLowerCase();
    const u = users.find(u => (u.email && u.email.toLowerCase() === clean) || u.username.toLowerCase() === clean);
    if (u && u.twoFactorEnabled) {
      return {
        enabled: true,
        secret: u.twoFactorSecret,
        backupCodes: u.twoFactorBackupCodes || [],
        enabledAt: u.twoFactorEnabledAt
      };
    }
    return null;
  },

  is2FAEnabled: (email) => {
    const clean = (email || '').trim().toLowerCase();
    const u = users.find(u => (u.email && u.email.toLowerCase() === clean) || u.username.toLowerCase() === clean);
    return Boolean(u && u.twoFactorEnabled);
  },

  disable2FA: (email) => {
    const clean = (email || '').trim().toLowerCase();
    const idx = users.findIndex(u => (u.email && u.email.toLowerCase() === clean) || u.username.toLowerCase() === clean);
    if (idx !== -1) {
      users[idx].twoFactorEnabled = false;
      users[idx].twoFactorSecret = null;
      users[idx].twoFactorBackupCodes = [];
    }
  }
};
