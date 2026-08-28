const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const getPayPalConfig = () => {
  const isLive = (process.env.PAYPAL_MODE || 'live') === 'live';
  return {
    clientId: process.env.PAYPAL_CLIENT_ID || 'BAAREs6NlWG9nBdVzwe1KQHe1hHWrFYLEeAABbw-c020J-zlnJR-pvWi67vlxnASrz6BWSSrQS4oNMsqPQ',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    baseUrl: isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
  };
};

const PLATFORM_FEE_PERCENT = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '10');

// Configure Brevo Mailer for Purchase Receipts & License Keys
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'b70e6a001@smtp-brevo.com';
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass }
  });
};
const transporter = createTransporter();

// Helper: Get PayPal OAuth2 Bearer Token
async function getPayPalAccessToken() {
  const { clientId, clientSecret, baseUrl } = getPayPalConfig();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal OAuth Token Error: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Helper: Generate Official DRM License Key
function generateLicenseKey(title) {
  const cleanTitle = (title || 'PLG').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'MFG';
  const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg3 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MF-${cleanTitle}-${seg1}-${seg2}-${seg3}`;
}

// @route   GET /api/paypal/config
// @desc    Get public PayPal Client ID for frontend SDK initialization
router.get('/config', (req, res) => {
  const { clientId, baseUrl } = getPayPalConfig();
  return res.json({
    clientId,
    currency: 'EUR',
    mode: (process.env.PAYPAL_MODE || 'live')
  });
});

// @route   POST /api/paypal/create-order
// @desc    Create real PayPal order for marketplace checkout
router.post('/create-order', async (req, res) => {
  try {
    const { items, totalAmount, currency = 'EUR' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items to checkout.' });
    }

    const numericTotal = parseFloat(totalAmount || 0);
    if (numericTotal <= 0) {
      return res.status(400).json({ error: 'Total amount must be greater than 0.' });
    }

    const accessToken = await getPayPalAccessToken();

    // Map items for PayPal receipt
    const purchaseUnits = [{
      reference_id: `MF-${Date.now()}`,
      description: `MinoForge Marketplace Order (${items.length} item${items.length > 1 ? 's' : ''})`,
      amount: {
        currency_code: currency,
        value: numericTotal.toFixed(2),
        breakdown: {
          item_total: {
            currency_code: currency,
            value: numericTotal.toFixed(2)
          }
        }
      },
      items: items.map(item => ({
        name: (item.title || 'Game Plugin').slice(0, 127),
        unit_amount: {
          currency_code: currency,
          value: parseFloat(item.price || 0).toFixed(2)
        },
        quantity: '1',
        category: 'DIGITAL_GOODS'
      }))
    }];

    const { baseUrl } = getPayPalConfig();
    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `order-${Date.now()}-${Math.random().toString(36).substring(7)}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: purchaseUnits,
        application_context: {
          brand_name: 'MinoForge Official',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: 'https://minoforge.com/checkout/success',
          cancel_url: 'https://minoforge.com/checkout/cancel'
        }
      })
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error('[PayPal Create Order Error]:', orderData);
      return res.status(response.status).json({ error: orderData.message || 'Failed to create PayPal order.' });
    }

    return res.status(200).json({
      id: orderData.id,
      status: orderData.status
    });
  } catch (err) {
    console.error('[PayPal Create Order Exception]:', err);
    return res.status(500).json({ error: err.message || 'Internal PayPal error.' });
  }
});

// @route   POST /api/paypal/capture-order
// @desc    Capture authorized PayPal payment, split commission, generate license & email receipt
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId, items, buyerEmail, buyerUsername } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'PayPal Order ID is required.' });
    }

    const accessToken = await getPayPalAccessToken();
    const { baseUrl } = getPayPalConfig();

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const captureData = await response.json();

    if (!response.ok || captureData.status !== 'COMPLETED') {
      console.error('[PayPal Capture Error]:', captureData);
      return res.status(400).json({ 
        error: captureData.message || 'PayPal payment could not be captured or completed.' 
      });
    }

    const transactionId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || orderId;
    const paidAmount = parseFloat(captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0');
    const currency = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code || 'EUR';

    // Calculate Marketplace Revenue Split (5% for Ultimate Creators, 10% Standard)
    const isUltimateCreator = req.body.isUltimate || (items && items.some(i => i.authorIsUltimate || i.isUltimate));
    const appliedFeePercent = isUltimateCreator ? 5 : PLATFORM_FEE_PERCENT;
    const platformFee = parseFloat((paidAmount * (appliedFeePercent / 100)).toFixed(2));
    const creatorEarnings = parseFloat((paidAmount - platformFee).toFixed(2));

    // Generate Official DRM Licenses for each purchased item
    const orderItems = (items || []).map(item => ({
      pluginId: item.id,
      pluginTitle: item.title,
      authorName: item.authorName || 'MinoCreator',
      price: item.price,
      downloadUrl: item.downloadUrl || `/downloads/${(item.title || 'plugin').replace(/\s+/g, '')}-latest.zip`,
      licenseKey: generateLicenseKey(item.title),
      orderId: transactionId,
      issuedAt: new Date().toISOString()
    }));

    // Send Official Email Receipt with DRM License & Download links to buyer via Brevo SMTP
    const cleanBuyerEmail = (buyerEmail || captureData.payer?.email_address || '').trim().toLowerCase();
    if (cleanBuyerEmail && cleanBuyerEmail.includes('@')) {
      const receiptOptions = {
        from: `"MinoForge Orders" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@minoforge.com'}>`,
        to: cleanBuyerEmail,
        subject: `🎉 Payment Confirmed: Your MinoForge Order #${transactionId}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
            
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #00f2fe, #2563eb); padding: 8px 16px; border-radius: 12px; font-weight: 900; font-size: 16px; color: #ffffff; letter-spacing: 1px;">
                🦅 MINOFORGE
              </div>
              <h2 style="color: #ffffff; margin-top: 16px; margin-bottom: 4px; font-size: 22px;">Payment Successful!</h2>
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">Order #${transactionId} • Paid via PayPal</p>
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 16px; margin-bottom: 24px; text-align: center;">
              <span style="color: #34d399; font-weight: 800; font-size: 14px;">Total Paid: ${paidAmount.toFixed(2)} ${currency}</span>
              <p style="color: #a7f3d0; font-size: 12px; margin: 4px 0 0 0;">Your digital package is ready for immediate download below.</p>
            </div>

            <h3 style="color: #38bdf8; font-size: 15px; margin-bottom: 12px;">Your Purchased Items &amp; DRM Licenses:</h3>
            <div style="space-y: 12px;">
              ${orderItems.map(item => `
                <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 16px; margin-bottom: 12px;">
                  <strong style="color: #ffffff; font-size: 15px; display: block;">${item.pluginTitle}</strong>
                  <span style="color: #94a3b8; font-size: 12px;">Author: ${item.authorName}</span>
                  
                  <div style="background: #0f172a; border: 1px dashed #38bdf8; border-radius: 8px; padding: 10px; margin: 10px 0;">
                    <span style="color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 800; display: block;">Official License Key:</span>
                    <code style="color: #38bdf8; font-family: monospace; font-size: 14px; font-weight: 800;">${item.licenseKey}</code>
                  </div>

                  <a href="https://minoforge.com${item.downloadUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-top: 4px;">
                    ⬇️ Download Package (.zip)
                  </a>
                </div>
              `).join('')}
            </div>

            <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
              <p style="margin: 4px 0;">180-Day PayPal Buyer Protection Active • <a href="https://minoforge.com" style="color: #38bdf8; text-decoration: none;">minoforge.com</a></p>
              <p style="margin: 4px 0;">Need support? Reply directly to this email.</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(receiptOptions).catch(mErr => {
        console.error('[PayPal Receipt Mailer Error]:', mErr);
      });
    }

    console.log(`[PayPal Transaction Completed]: Order #${transactionId}, Paid: €${paidAmount} (MinoForge Fee: €${platformFee}, Creator Share: €${creatorEarnings})`);

    return res.status(200).json({
      success: true,
      transactionId,
      paidAmount,
      currency,
      platformFee,
      creatorEarnings,
      licenses: orderItems,
      payer: captureData.payer
    });
  } catch (err) {
    console.error('[PayPal Capture Exception]:', err);
    return res.status(500).json({ error: err.message || 'Failed to complete transaction.' });
  }
});

module.exports = router;
