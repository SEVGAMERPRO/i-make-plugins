const express = require('express');
const router = express.Router();
const { sendPurchaseReceiptEmail, sendPluginSoldEmail } = require('../utils/mailer');
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

    // 2. Send sale notification email to each plugin's Creator
    for (const item of items) {
      try {
        const creatorEmail = item.authorEmail || process.env.ADMIN_EMAIL || 'minoforge.requests@gmail.com';
        const creatorName = item.authorName || 'MinoCreator';
        const itemPrice = parseFloat(item.price) || 0;
        const creatorEarnings = itemPrice * 0.95; // 95% payout rate

        await sendPluginSoldEmail({
          creatorEmail,
          creatorUsername: creatorName,
          pluginTitle: item.title,
          buyerUsername: cleanUsername,
          amount: itemPrice,
          earnings: creatorEarnings
        });
      } catch (creatorErr) {
        console.warn(`Failed to send creator sale email for ${item.title}:`, creatorErr.message);
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

module.exports = router;
