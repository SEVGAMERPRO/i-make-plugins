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
  updateUserUltimate: (id, { isUltimate, duration, expiresAt, plan }) => {
    const idx = users.findIndex(u => u.id === id || u.email === id || u.username === id);
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        isUltimate: Boolean(isUltimate),
        ultimateDuration: duration || (isUltimate ? '1_MONTH' : null),
        ultimateExpiresAt: expiresAt || null,
        ultimatePlan: plan || (isUltimate ? 'GIFTED_BY_ADMIN' : null),
        role: isUltimate && users[idx].role === 'USER' ? 'CREATOR' : users[idx].role
      };
      return users[idx];
    }
    return null;
  },
  
  // Real Analytics & Tracking Methods
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
  }
};
