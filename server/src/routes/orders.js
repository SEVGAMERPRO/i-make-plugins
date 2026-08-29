const express = require('express');
const router = express.Router();
const { sendPurchaseReceiptEmail, sendPluginSoldEmail, sendPayoutRequestEmail } = require('../utils/mailer');
const { postToDiscordWebhook } = require('./developer');
const store = require('../store/globalStore');

// @route   POST /api/orders/confirm-purchase
// @desc    Process checkout and send transactional emails to both buyer and creator(s)
router.post('/confirm-purchase', async (req, res) => {
  try {
    const { buyerEmail, buyerUsername, items = [], totalAmount, transactionId } = req.body;

    if (!buyerEmail || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing order details.' });
    }

    const cleanEmail = buyerEmail.trim().toLowerCase();
    const cleanUsername = buyerUsername || cleanEmail.split('@')[0];
    const orderId = transactionId || `MF-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Send receipt email to the Buyer
    try {
      const firstItem = items[0] || {};
      const pluginTitle = items.length === 1 ? firstItem.title : `${firstItem.title} + ${items.length - 1} more`;
      
      await sendPurchaseReceiptEmail({
        buyerEmail: cleanEmail,
        buyerUsername: cleanUsername,
        pluginTitle,
        pluginVersion: firstItem.version || '1.0.0',
        amount: parseFloat(totalAmount) || 0,
        transactionId: orderId,
        downloadUrl: `https://minoforge.com/dashboard?tab=purchases`
      });
    } catch (buyerErr) {
      console.warn('Failed to send buyer receipt email:', buyerErr.message);
    }

    // 2. Send sale notification email & Discord Webhook to each plugin's Creator
    for (const item of items) {
      try {
        const creatorEmail = (item.authorEmail || item.author?.email || process.env.ADMIN_EMAIL || 'severinkaptein8@gmail.com').trim().toLowerCase();
        const creatorName = item.authorName || item.author?.username || 'MinoCreator';
        const itemPrice = parseFloat(item.price) || 0;
        const creatorEarnings = itemPrice * 0.95; // 95% payout rate

        // Log developer sale event
        store.addDeveloperEvent({
          type: 'PLUGIN_PURCHASED',
          orderId,
          pluginId: item.id,
          pluginTitle: item.title,
          price: itemPrice,
          earnings: creatorEarnings,
          buyerUsername: cleanUsername,
          buyerEmail: cleanEmail,
          creatorEmail,
          creatorUsername: creatorName
        });

        // Send Email
        await sendPluginSoldEmail({
          creatorEmail,
          creatorUsername: creatorName,
          pluginTitle: item.title,
          buyerUsername: cleanUsername,
          amount: itemPrice,
          earnings: creatorEarnings
        });

        // Trigger Creator's Discord Bot Webhook
        const webhookConfig = store.getDiscordWebhook(creatorEmail);
        if (webhookConfig && webhookConfig.enabled && webhookConfig.webhookUrl) {
          const discordEmbed = {
            username: 'MinoForge Sales Bot',
            avatar_url: 'https://minoforge.com/favicon.png',
            embeds: [
              {
                title: `💰 Plugin Sold! — ${item.title}`,
                description: `A customer has just purchased **${item.title}** on the marketplace!`,
                color: 0x10B981, // Emerald green
                fields: [
                  { name: '📦 Resource', value: `**${item.title}**`, inline: true },
                  { name: '👤 Customer', value: `\`${cleanUsername}\``, inline: true },
                  { name: '💵 Sale Price', value: `**€${itemPrice.toFixed(2)}**`, inline: true },
                  { name: '📈 Your Net Earnings (95%)', value: `**€${creatorEarnings.toFixed(2)}**`, inline: true },
                  { name: '🧾 Order ID', value: `\`${orderId}\``, inline: true },
                  { name: '⚡ Event', value: '`order.completed`', inline: true }
                ],
                footer: {
                  text: 'MinoForge Developer API Engine • Automated Discord Sale Alert',
                  icon_url: 'https://minoforge.com/favicon.png'
                },
                timestamp: new Date().toISOString()
              }
            ]
          };

          postToDiscordWebhook(webhookConfig.webhookUrl, discordEmbed)
            .catch(whErr => console.warn('[Discord Webhook Error]:', whErr.message));
        }

      } catch (creatorErr) {
        console.warn(`Failed to process creator sale for ${item.title}:`, creatorErr.message);
      }
    }

    res.json({
      success: true,
      transactionId: orderId,
      message: 'Purchase confirmed. Receipt sent to buyer and sale alerts sent to creator.'
    });

  } catch (error) {
    console.error('[Order Confirmation Error]:', error);
    res.status(500).json({ success: false, message: 'Internal server error processing purchase.' });
  }
});

// @route   POST /api/orders/payout-request
// @desc    Process creator withdrawal request with 8% transaction fee routed to Treasury (severinkaptein8@gmail.com)
router.post('/payout-request', async (req, res) => {
  try {
    const { creatorEmail, creatorUsername, paypalEmail, grossAmount } = req.body;

    const parsedGross = parseFloat(grossAmount);
    if (!parsedGross || parsedGross < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum payout withdrawal is €10.00.' 
      });
    }

    if (!paypalEmail || !paypalEmail.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'A valid destination PayPal email address is required.' 
      });
    }

    // 8% transaction and gateway payout fee to severinkaptein8@gmail.com
    const feeAmount = parseFloat((parsedGross * 0.08).toFixed(2));
    const netAmount = parseFloat((parsedGross - feeAmount).toFixed(2));
    const payoutRef = `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Dispatch email notification to Creator and Admin Treasury (severinkaptein8@gmail.com)
    await sendPayoutRequestEmail({
      creatorEmail: creatorEmail || 'creator@minoforge.com',
      creatorUsername: creatorUsername || 'MinoCreator',
      paypalEmail: paypalEmail.trim(),
      grossAmount: parsedGross,
      feeAmount,
      netAmount,
      payoutRef
    });

    res.json({
      success: true,
      payoutRef,
      grossAmount: parsedGross,
      feeAmount,
      netAmount,
      destinationPayPal: paypalEmail,
      message: `Payout request of €${netAmount.toFixed(2)} submitted successfully! 8% fee (€${feeAmount.toFixed(2)}) routed to Treasury.`
    });

  } catch (error) {
    console.error('[Payout Request Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to submit payout request.' });
  }
});

// @route   POST /api/orders/validate-promo
// @desc    Validate promo or creator code live for checkout
router.post('/validate-promo', (req, res) => {
  const { code, price = 0 } = req.body;
  const result = store.validatePromoCode(code, price);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }

  res.json({
    success: true,
    ...result
  });
});

// @route   POST /api/orders/apply-free-checkout
// @desc    Complete 100% free checkout waiver without requiring PayPal payment
router.post('/apply-free-checkout', async (req, res) => {
  try {
    const { buyerEmail, buyerUsername, code, items = [], planName = 'Order Purchase' } = req.body;

    const validation = store.validatePromoCode(code, 100);
    if (!validation.valid || (!validation.isFree && validation.discountPercent < 100)) {
      return res.status(400).json({ success: false, message: validation.message || 'Valid 100% discount promo code required.' });
    }

    // Increment promo code usage
    store.usePromoCode(code);

    const transactionId = `FREE-${code.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    store.addPurchase({
      buyerUsername: buyerUsername || 'FreeMember',
      buyerEmail: buyerEmail || 'free@minoforge.com',
      pluginId: items[0]?.id || 'free-grant',
      pluginTitle: items[0]?.title || planName,
      amount: 0,
      currency: 'USD',
      paymentMethod: `Promo Code (${code.toUpperCase()})`,
      transactionId,
      ip: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      transactionId,
      message: '100% Free order processed successfully!',
      order: {
        orderId: transactionId,
        amount: '0.00',
        code: code.toUpperCase()
      }
    });
  } catch (err) {
    console.error('Free checkout error:', err);
    res.status(500).json({ success: false, message: 'Failed to process free checkout.' });
  }
});

module.exports = router;
