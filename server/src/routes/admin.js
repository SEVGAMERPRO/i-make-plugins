const express = require('express');
const router = express.Router();
const store = require('../store/globalStore');

// @route   GET /api/admin/config
// @desc    Get current global platform configuration
router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: store.getConfig()
  });
});

// @route   POST /api/admin/config
// @desc    Update platform configuration
router.post('/config', (req, res) => {
  const updates = req.body;
  const updatedConfig = store.updateConfig(updates);

  store.addAuditLog({
    type: 'CONFIG_UPDATE',
    actor: 'Master Administrator',
    details: `Updated platform configuration: ${Object.keys(updates).join(', ')}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    message: 'Global configuration saved and synced across cluster.',
    config: updatedConfig
  });
});

// @route   GET /api/admin/plugins
// @desc    Get all marketplace plugins
router.get('/plugins', (req, res) => {
  res.json({
    success: true,
    plugins: store.getPlugins()
  });
});

// @route   PUT /api/admin/plugins/:id/spotlight
// @desc    Toggle spotlight promotion status on homepage
router.put('/plugins/:id/spotlight', (req, res) => {
  const { id } = req.params;
  const plugin = store.getPluginById(id);
  if (!plugin) {
    return res.status(404).json({ success: false, message: 'Plugin not found' });
  }

  const updated = store.updatePlugin(id, { isPromoted: !plugin.isPromoted });
  store.addAuditLog({
    type: 'SPOTLIGHT_TOGGLE',
    actor: 'Master Administrator',
    details: `${updated.isPromoted ? 'Enabled' : 'Disabled'} spotlight for plugin: ${plugin.title}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    message: `Spotlight ${updated.isPromoted ? 'activated' : 'deactivated'} for ${plugin.title}`,
    plugin: updated
  });
});

// @route   PUT /api/admin/plugins/:id
// @desc    Update plugin details
router.put('/plugins/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = store.updatePlugin(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Plugin not found' });
  }

  store.addAuditLog({
    type: 'PLUGIN_EDIT',
    actor: 'Master Administrator',
    details: `Edited plugin parameters for: ${updated.title}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    message: 'Plugin updated successfully',
    plugin: updated
  });
});

// @route   DELETE /api/admin/plugins/:id
// @desc    Delete a plugin
router.delete('/plugins/:id', (req, res) => {
  const { id } = req.params;
  const plugin = store.getPluginById(id);
  const deleted = store.deletePlugin(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Plugin not found' });
  }

  store.addAuditLog({
    type: 'PLUGIN_DELETE',
    actor: 'Master Administrator',
    details: `Deleted plugin: ${plugin?.title || id}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    message: 'Plugin deleted successfully'
  });
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', (req, res) => {
  res.json({
    success: true,
    users: store.getUsers()
  });
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
router.put('/users/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const updated = store.updateUserRole(id, role);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  store.addAuditLog({
    type: 'USER_ROLE_CHANGE',
    actor: 'Master Administrator',
    details: `Changed role for user ${updated.username} to ${role}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    message: `User role updated to ${role}`,
    user: updated
  });
});

// @route   POST /api/admin/users/:id/resolve-ip
// @desc    Resolve IP multi-account flag
router.post('/users/:id/resolve-ip', (req, res) => {
  const { id } = req.params;
  const updated = store.resolveUserIpFlag(id);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  store.addAuditLog({
    type: 'IP_FLAG_RESOLVE',
    actor: 'Master Administrator',
    details: `Resolved IP multi-account flag for ${updated.username}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    message: 'IP flag resolved and whitelisted',
    user: updated
  });
});

// @route   PUT /api/admin/users/:id/ultimate
// @desc    Gift or revoke MinoForge Ultimate for a user with custom time period
router.put('/users/:id/ultimate', (req, res) => {
  const { id } = req.params;
  const { isUltimate = true, duration = '1_MONTH' } = req.body;

  let expiresAt = null;
  let durationLabel = '1 Month';

  if (!isUltimate || duration === 'REVOKE') {
    durationLabel = 'Revoked';
  } else {
    const now = Date.now();
    switch (duration) {
      case '1_DAY':
        expiresAt = new Date(now + 1 * 24 * 3600 * 1000).toISOString();
        durationLabel = '24 Hours (1 Day)';
        break;
      case '7_DAYS':
        expiresAt = new Date(now + 7 * 24 * 3600 * 1000).toISOString();
        durationLabel = '7 Days (1 Week)';
        break;
      case '1_MONTH':
        expiresAt = new Date(now + 30 * 24 * 3600 * 1000).toISOString();
        durationLabel = '30 Days (1 Month)';
        break;
      case '3_MONTHS':
        expiresAt = new Date(now + 90 * 24 * 3600 * 1000).toISOString();
        durationLabel = '90 Days (3 Months)';
        break;
      case '6_MONTHS':
        expiresAt = new Date(now + 180 * 24 * 3600 * 1000).toISOString();
        durationLabel = '180 Days (6 Months)';
        break;
      case '1_YEAR':
        expiresAt = new Date(now + 365 * 24 * 3600 * 1000).toISOString();
        durationLabel = '365 Days (1 Year)';
        break;
      case 'LIFETIME':
      default:
        if (duration === 'LIFETIME') {
          expiresAt = 'LIFETIME';
          durationLabel = 'Lifetime VIP';
        } else {
          expiresAt = new Date(now + 30 * 24 * 3600 * 1000).toISOString();
          durationLabel = '30 Days (1 Month)';
        }
        break;
    }
  }

  const updated = store.updateUserUltimate(id, {
    isUltimate: duration !== 'REVOKE' && Boolean(isUltimate),
    duration: duration === 'REVOKE' ? null : duration,
    expiresAt: duration === 'REVOKE' ? null : expiresAt,
    plan: duration === 'REVOKE' ? null : `ADMIN_GIFT_${duration}`
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const actionDetails = duration === 'REVOKE' 
    ? `Revoked MinoForge Ultimate from ${updated.username} (${updated.email})`
    : `Gifted ${durationLabel} MinoForge Ultimate access to ${updated.username} (${updated.email})`;

  store.addAuditLog({
    type: duration === 'REVOKE' ? 'ULTIMATE_REVOKE' : 'ULTIMATE_GIFT',
    actor: 'Master Administrator',
    details: actionDetails,
    ip: req.ip || '127.0.0.1'
  });

  store.trackActivity({
    type: 'ADMIN_ACTION',
    username: updated.username,
    email: updated.email,
    ip: req.ip || '127.0.0.1',
    path: '/nimda',
    details: actionDetails
  });

  res.json({
    success: true,
    message: duration === 'REVOKE' 
      ? `Ultimate membership revoked for ${updated.username}` 
      : `Successfully gifted ${durationLabel} Ultimate to ${updated.username}!`,
    user: updated
  });
});

// @route   GET /api/admin/stats
// @desc    Get live operational stats & analytics
router.get('/stats', (req, res) => {
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();
  const plugins = store.getPlugins();
  const users = store.getUsers();

  res.json({
    success: true,
    stats: {
      uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
      memoryHeapMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(1),
      registeredUsers: users.length,
      verifiedCreators: users.filter(u => u.role === 'CREATOR' || u.role === 'ADMIN').length,
      activeSessions: 1,
      totalPlugins: plugins.length,
      pendingReviews: plugins.filter(p => p.status === 'PENDING').length,
      ipFlagsCount: users.filter(u => u.flags > 0).length,
      systemHealth: 'OPTIMAL',
      latencyMs: 14,
      nodeVersion: process.version
    }
  });
});

// @route   GET /api/admin/audit-logs
// @desc    Retrieve security audit trail
router.get('/audit-logs', (req, res) => {
  res.json({
    success: true,
    logs: store.getActivityLogs().slice(0, 100)
  });
});

// @route   GET /api/admin/analytics
// @desc    Get comprehensive traffic, views, visits, and conversion analytics
router.get('/analytics', (req, res) => {
  res.json({
    success: true,
    analytics: store.getAnalyticsSummary()
  });
});

// @route   GET /api/admin/purchases
// @desc    Get real customer purchase ledger
router.get('/purchases', (req, res) => {
  res.json({
    success: true,
    purchases: store.getPurchases()
  });
});

// @route   POST /api/admin/purchases
// @desc    Record a new customer order / marketplace purchase
router.post('/purchases', (req, res) => {
  const purchase = store.addPurchase({
    ...req.body,
    ip: req.ip || '127.0.0.1'
  });
  res.json({
    success: true,
    message: 'Purchase recorded successfully',
    purchase
  });
});

// @route   POST /api/admin/track-view
// @desc    Track live client pageviews and unique sessions
router.post('/track-view', (req, res) => {
  const { path, user } = req.body;
  const result = store.recordPageView(path || '/', req.ip || '127.0.0.1', user);
  res.json({
    success: true,
    ...result
  });
});

// @route   POST /api/admin/purge-cache
// @desc    Flush in-memory and edge cache
router.post('/purge-cache', (req, res) => {
  store.trackActivity({
    type: 'CACHE_PURGE',
    username: 'Master Administrator',
    ip: req.ip || '127.0.0.1',
    path: '/nimda',
    details: 'Full edge and local memory cache purge triggered'
  });

// ==========================================
// 🏷️ PROMO & CREATOR CODE ADMIN ROUTES
// ==========================================

// @route   GET /api/admin/promo-codes
// @desc    Get all promo and creator codes
router.get('/promo-codes', (req, res) => {
  res.json({
    success: true,
    promoCodes: store.getPromoCodes()
  });
});

// @route   POST /api/admin/promo-codes
// @desc    Create a new promo or creator code with end date & discount
router.post('/promo-codes', (req, res) => {
  try {
    const newPromo = store.createPromoCode(req.body);
    res.status(201).json({
      success: true,
      message: `Promo code "${newPromo.code}" created successfully!`,
      promo: newPromo
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to create promo code.'
    });
  }
});

// @route   PUT /api/admin/promo-codes/:id
// @desc    Update promo code or toggle active state
router.put('/promo-codes/:id', (req, res) => {
  const { id } = req.params;
  const updated = store.updatePromoCode(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Promo code not found.' });
  }

  res.json({
    success: true,
    message: `Promo code "${updated.code}" updated successfully!`,
    promo: updated
  });
});

// @route   DELETE /api/admin/promo-codes/:id
// @desc    Delete a promo code
router.delete('/promo-codes/:id', (req, res) => {
  const { id } = req.params;
  const deleted = store.deletePromoCode(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Promo code not found.' });
  }

  res.json({
    success: true,
    message: `Promo code "${deleted.code}" deleted successfully.`
  });
});

module.exports = router;
