const express = require('express');
const router = express.Router();
const { sendPurchaseReceiptEmail, sendPluginSoldEmail, sendPayoutRequestEmail } = require('../utils/mailer');
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

module.exports = router;
