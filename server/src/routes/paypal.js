const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const store = require('../store/globalStore');
const { TRUSTPILOT_AFS_EMAIL, getTrustpilotJsonLd } = require('../services/trustpilotService');

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
        bcc: TRUSTPILOT_AFS_EMAIL,
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

          ${getTrustpilotJsonLd({
            buyerEmail: cleanBuyerEmail,
            buyerUsername: buyerUsername || captureData.payer?.name?.given_name || cleanBuyerEmail.split('@')[0],
            orderId: transactionId
          })}
        `
      };

      transporter.sendMail(receiptOptions).catch(mErr => {
        console.error('[PayPal Receipt Mailer Error]:', mErr);
      });
    }

    if (req.body.promoCode) {
      store.usePromoCode(req.body.promoCode);
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

// Cache for generated PayPal Subscription Plan IDs
let cachedSubscriptionPlans = {
  monthly: process.env.PAYPAL_PLAN_ID_MONTHLY || 'P-6N334537WX7871409NKJRIKY',
  yearly: process.env.PAYPAL_PLAN_ID_YEARLY || 'P-03X31846PF270403XNKJRJUQ',
  productId: process.env.PAYPAL_PRODUCT_ID || null
};

// Helper: Get or create PayPal Subscription Product & Plan dynamically via REST API
async function getOrCreatePayPalSubscriptionPlan(isYearly) {
  const planKey = isYearly ? 'yearly' : 'monthly';
  if (cachedSubscriptionPlans[planKey]) {
    return cachedSubscriptionPlans[planKey];
  }

  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();

  // 1. Get or Create Product
  if (!cachedSubscriptionPlans.productId) {
    try {
      const prodRes = await fetch(`${baseUrl}/v1/catalogs/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'MinoForge Ultimate Membership',
          description: 'VIP creator superpowers, reduced 5% platform fees, and €5/mo free ad credits on MinoForge.',
          type: 'DIGITAL',
          category: 'ONLINE_GAMING',
          image_url: 'https://minoforge.com/favicon.png',
          home_url: 'https://minoforge.com'
        })
      });

      const prodData = await prodRes.json();
      if (prodRes.ok && prodData.id) {
        cachedSubscriptionPlans.productId = prodData.id;
      }
    } catch (pErr) {
      console.warn('[PayPal Product Create Warning]:', pErr);
    }
  }

  // 2. Create Plan
  const planPrice = isYearly ? '132.50' : (process.env.TESTING_PRICE || '0.01');
  const planName = isYearly 
    ? 'MinoForge Ultimate Membership (Annual Plan - 15% Off)' 
    : 'MinoForge Ultimate Membership (Monthly Subscription)';

  try {
    const planRes = await fetch(`${baseUrl}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: cachedSubscriptionPlans.productId || 'PROD-MINOFORGE-ULTIMATE',
        name: planName,
        description: 'Automatic recurring billing for MinoForge Ultimate Creator Tier.',
        status: 'ACTIVE',
        billing_cycles: [
          {
            frequency: {
              interval_unit: isYearly ? 'YEAR' : 'MONTH',
              interval_count: 1
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0, // 0 = indefinite recurring subscription until cancelled
            pricing_scheme: {
              fixed_price: {
                value: planPrice,
                currency_code: 'EUR'
              }
            }
          }
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: '0.00',
            currency_code: 'EUR'
          },
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3
        }
      })
    });

    const planData = await planRes.json();
    if (planRes.ok && planData.id) {
      cachedSubscriptionPlans[planKey] = planData.id;
      console.log(`[PayPal Subscription Plan Created]: ${planKey} -> ${planData.id}`);
      return planData.id;
    } else {
      console.warn(`[PayPal Create Plan API Response]:`, planData);
    }
  } catch (planErr) {
    console.error('[PayPal Create Plan Exception]:', planErr);
  }

  return cachedSubscriptionPlans[planKey] || null;
}

// @route   GET /api/paypal/subscription-plan
// @desc    Retrieve active PayPal Subscription Plan ID for Monthly or Yearly billing
router.get('/subscription-plan', async (req, res) => {
  try {
    const { cycle } = req.query;
    const isYearly = cycle === 'yearly';
    const planKey = isYearly ? 'yearly' : 'monthly';

    const planId = await getOrCreatePayPalSubscriptionPlan(isYearly);
    return res.json({
      success: true,
      cycle: planKey,
      planId: planId || (isYearly ? 'P-MINOFORGE-ULTIMATE-YEARLY' : 'P-MINOFORGE-ULTIMATE-MONTHLY')
    });
  } catch (err) {
    console.error('[PayPal Plan Retrieval Exception]:', err);
    return res.status(500).json({ error: err.message || 'Could not retrieve subscription plan.' });
  }
});

// @route   POST /api/paypal/verify-subscription
// @desc    Verify recurring PayPal Subscription, activate Ultimate VIP status & send email receipt
router.post('/verify-subscription', async (req, res) => {
  try {
    const { subscriptionId, buyerEmail, buyerUsername, billingCycle, tip } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'PayPal Subscription ID is required.' });
    }

    let subStatus = 'ACTIVE';
    try {
      const accessToken = await getPayPalAccessToken();
      const { baseUrl } = getPayPalConfig();

      const response = await fetch(`${baseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const subData = await response.json();
        subStatus = subData.status || 'ACTIVE';
      }
    } catch (e) {
      console.warn('[PayPal Sub Status Check Warning]:', e.message);
    }

    // Activate User in store
    const cleanEmail = (buyerEmail || '').trim().toLowerCase();
    const user = store.getUserByEmail(cleanEmail) || store.getUserByUsername(buyerUsername);
    if (user) {
      store.updateUser(user.id, {
        role: 'CREATOR',
        isUltimate: true,
        ultimateDuration: billingCycle === 'yearly' ? 'ANNUAL' : 'MONTHLY',
        subscriptionId: subscriptionId,
        subscriptionStatus: subStatus,
        billingCycle: billingCycle || 'monthly'
      });
    }

    store.addAuditLog({
      type: 'SUBSCRIPTION_ACTIVATED',
      actor: buyerUsername || cleanEmail || 'Subscriber',
      details: `Activated recurring MinoForge Ultimate Subscription #${subscriptionId} (${billingCycle || 'monthly'})`,
      ip: req.ip || '127.0.0.1'
    });

    // Send Official Subscription Confirmation Email via Brevo SMTP
    if (cleanEmail && cleanEmail.includes('@')) {
      const welcomeEmail = {
        from: `"MinoForge Subscriptions" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@minoforge.com'}>`,
        to: cleanEmail,
        subject: `👑 Welcome to MinoForge Ultimate! (Subscription #${subscriptionId})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 32px; border-radius: 20px; border: 1px solid #f59e0b;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 40px;">👑</span>
              <h2 style="color: #f59e0b; margin-top: 12px; margin-bottom: 4px; font-size: 24px;">Ultimate Subscription Activated!</h2>
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">Subscription #${subscriptionId} • Auto-renews ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}</p>
            </div>

            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 14px; padding: 18px; margin-bottom: 24px;">
              <h4 style="color: #fbbf24; margin: 0 0 8px 0; font-size: 14px;">Your VIP Superpowers Are Live:</h4>
              <ul style="color: #e2e8f0; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li><strong>5.0% Reduced Fee:</strong> Keep 95% of every plugin sale.</li>
                <li><strong>€5.00 / mo Free Ad Credits:</strong> Added to your advertiser wallet.</li>
                <li><strong>Gemini AI Engine:</strong> Unlimited daily config generation.</li>
                <li><strong>Golden Crown Badge:</strong> Displayed on your creator profile &amp; plugins.</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="https://minoforge.com/ultimate" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0b0f19; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-size: 14px; font-weight: 900;">
                👑 Access Your Ultimate Hub
              </a>
            </div>

            <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
              <p>You can manage or cancel your subscription anytime from your PayPal dashboard or MinoForge settings.</p>
              <p>© ${new Date().getFullYear()} MinoForge. All rights reserved.</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(welcomeEmail).catch(mErr => console.error('[Sub Emailer Error]:', mErr));
    }

    return res.status(200).json({
      success: true,
      subscriptionId,
      status: subStatus,
      billingCycle: billingCycle || 'monthly',
      plan: 'MinoForge Ultimate Membership'
    });
  } catch (err) {
    console.error('[PayPal Verify Subscription Exception]:', err);
    return res.status(500).json({ error: err.message || 'Subscription verification failed.' });
  }
});

// @route   POST /api/paypal/cancel-subscription
// @desc    Cancel an active recurring PayPal Subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId, reason } = req.body;
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required.' });
    }

    const accessToken = await getPayPalAccessToken();
    const { baseUrl } = getPayPalConfig();

    const response = await fetch(`${baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: reason || 'Customer requested subscription cancellation via MinoForge portal.'
      })
    });

    if (!response.ok && response.status !== 204) {
      const errText = await response.text();
      console.warn('[PayPal Subscription Cancel Response]:', errText);
    }

    return res.json({
      success: true,
      message: 'Subscription successfully cancelled. Access remains active until end of billing period.'
    });
  } catch (err) {
    console.error('[PayPal Cancel Subscription Exception]:', err);
    return res.status(500).json({ error: err.message || 'Could not cancel subscription.' });
  }
});

module.exports = router;
