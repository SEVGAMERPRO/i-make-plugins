const express = require('express');
const router = express.Router();
const store = require('../store/globalStore');
const https = require('https');
const { URL } = require('url');

/**
 * Dispatch rich embed to Discord Webhook via native HTTPS
 */
const postToDiscordWebhook = (webhookUrl, payload) => {
  return new Promise((resolve, reject) => {
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      return reject(new Error('Invalid Discord Webhook URL.'));
    }

    try {
      const parsedUrl = new URL(webhookUrl);
      const postData = JSON.stringify(payload);

      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: `${parsedUrl.pathname}${parsedUrl.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'MinoForge-Discord-Bot-Integration/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, statusCode: res.statusCode });
          } else {
            reject(new Error(`Discord returned status ${res.statusCode}: ${responseBody}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.setTimeout(8000, () => {
        req.destroy();
        reject(new Error('Discord Webhook request timed out.'));
      });

      req.write(postData);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

// ================= 1. GET USER API KEYS =================
// @route   GET /api/developer/keys
router.get('/keys', (req, res) => {
  try {
    const email = req.query.email || 'user@example.com';
    const keys = store.getApiKeysByUser(email);
    res.json({ success: true, keys });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load API keys.' });
  }
});

// ================= 2. GENERATE NEW API KEY =================
// @route   POST /api/developer/keys/generate
router.post('/keys/generate', (req, res) => {
  try {
    const { email, username, label } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }
    const newKey = store.generateApiKey(email, username, label);
    res.json({ success: true, key: newKey, message: 'New API Key generated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating API key.' });
  }
});

// ================= 3. REVOKE API KEY =================
// @route   DELETE /api/developer/keys/:id
router.delete('/keys/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const revoked = store.revokeApiKey(id, email);
    if (revoked) {
      res.json({ success: true, message: 'API Key revoked successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'API Key not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to revoke API key.' });
  }
});

// ================= 4. GET DISCORD WEBHOOK CONFIG =================
// @route   GET /api/developer/webhook
router.get('/webhook', (req, res) => {
  try {
    const email = req.query.email || '';
    const config = store.getDiscordWebhook(email);
    res.json({ success: true, webhook: config });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve webhook settings.' });
  }
});

// ================= 5. SAVE DISCORD WEBHOOK =================
// @route   POST /api/developer/webhook
router.post('/webhook', (req, res) => {
  try {
    const { email, username, webhookUrl, enabled, notifyOnPurchase, notifyOnReview } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    if (webhookUrl && !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid Discord Webhook URL. It must start with https://discord.com/api/webhooks/' 
      });
    }

    const updated = store.saveDiscordWebhook(email, username, webhookUrl, {
      enabled,
      notifyOnPurchase,
      notifyOnReview
    });

    res.json({ 
      success: true, 
      webhook: updated, 
      message: 'Discord webhook settings saved successfully!' 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save Discord webhook.' });
  }
});

// ================= 6. TEST DISCORD WEBHOOK =================
// @route   POST /api/developer/webhook/test
router.post('/webhook/test', async (req, res) => {
  try {
    const { webhookUrl, username = 'MinoCreator' } = req.body;
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid Discord Webhook URL starting with https://discord.com/api/webhooks/' 
      });
    }

    const testEmbed = {
      username: 'MinoForge Sales Bot',
      avatar_url: 'https://minoforge.com/favicon.png',
      embeds: [
        {
          title: '🎉 MinoForge Discord Bot Webhook Connected!',
          description: `Hello **${username}**! Your Discord bot / webhook is successfully connected to MinoForge. Whenever someone purchases or downloads your plugins, you will receive real-time alerts in this channel.`,
          color: 0x00d2ff, // Cyan
          fields: [
            { name: '🔌 Status', value: '`ONLINE & VERIFIED`', inline: true },
            { name: '📦 Target Store', value: `**${username}'s Studio**`, inline: true },
            { name: '⚡ Event Trigger', value: '`order.completed`', inline: true },
            { name: '🛒 Sample Order', value: '**Minecraft Deluxe Vaults ($14.99)** by `AlexGamer`', inline: false }
          ],
          footer: {
            text: 'MinoForge Developer API Engine • Instant Bot Webhooks',
            icon_url: 'https://minoforge.com/favicon.png'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    await postToDiscordWebhook(webhookUrl, testEmbed);

    res.json({
      success: true,
      message: 'Test notification sent to Discord! Check your Discord channel.'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to send test Discord webhook.'
    });
  }
});

// ================= 7. PUBLIC BOT API: GET EVENTS =================
// @route   GET /api/developer/events
// @desc    Allows Discord bots and external scripts to fetch real-time purchase events using X-API-Key
router.get('/events', (req, res) => {
  try {
    const apiKeyHeader = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    const userEmail = req.query.email;

    if (apiKeyHeader) {
      const validated = store.validateApiKey(apiKeyHeader);
      if (!validated) {
        return res.status(401).json({ success: false, message: 'Invalid or revoked API Key.' });
      }
      const events = store.getDeveloperEvents(validated.userEmail, parseInt(req.query.limit) || 25);
      return res.json({ 
        success: true, 
        authenticatedAs: validated.username, 
        keyLabel: validated.label,
        count: events.length,
        events 
      });
    }

    if (userEmail) {
      const events = store.getDeveloperEvents(userEmail, parseInt(req.query.limit) || 25);
      return res.json({ success: true, count: events.length, events });
    }

    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Provide an API key via X-API-Key header or Authorization: Bearer <key>.' 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving developer events.' });
  }
});

module.exports = {
  router,
  postToDiscordWebhook
};
