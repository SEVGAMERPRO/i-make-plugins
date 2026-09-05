const nodemailer = require('nodemailer');
const { TRUSTPILOT_AFS_EMAIL, getTrustpilotJsonLd } = require('../services/trustpilotService');

// Initialize Transporter for Gmail SMTP / Google Workspace
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

// Sender Identity
const getFromAddress = () => {
  const name = process.env.EMAIL_FROM_NAME || 'MinoForge Official';
  const email = process.env.EMAIL_FROM_ADDRESS || 'noreply@minoforge.com';
  return `"${name}" <${email}>`;
};

// Base Email HTML Template with Dark-Modern MinoForge Branding
const wrapInTemplate = (title, bodyContent, footerExtra = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; background: linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.1) 100%); border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                      MINO<span style="color: #38bdf8;">FORGE</span>
                    </span>
                    <span style="display: inline-block; margin-left: 10px; padding: 4px 10px; background-color: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); border-radius: 8px; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase;">Official Verified</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #090d16; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">This is an automated transactional security email from MinoForge Official Marketplace.</p>
              ${footerExtra ? `<p style="margin: 0 0 8px 0; color: #94a3b8;">${footerExtra}</p>` : ''}
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} MinoForge. All rights reserved. &bull; <a href="https://minoforge.com" style="color: #38bdf8; text-decoration: none;">minoforge.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * 1. 🔐 Send 9-Digit Security Code
 */
async function sendSecurityCodeEmail({ to, code, username = 'MinoUser', ip = 'Unknown IP' }) {
  const content = `
    <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Your 9-Digit Verification Code</h2>
    <p style="margin: 0 0 20px 0;">Hello <strong style="color: #38bdf8;">${username}</strong>,</p>
    <p style="margin: 0 0 24px 0;">Use the single-use 9-digit security code below to complete your sign-in to MinoForge:</p>
    
    <div style="background-color: #0b0f19; border: 2px solid #2563eb; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0;">
      <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #38bdf8; display: block;">
        ${code}
      </span>
      <span style="display: block; margin-top: 8px; font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">
        Valid for 10 Minutes &bull; Single Use
      </span>
    </div>

    <p style="font-size: 12px; color: #94a3b8; margin: 20px 0 0 0;">
      Requested from IP: <strong style="color: #f1f5f9;">${ip}</strong>. If you did not request this security code, please ignore this email or reset your password.
    </p>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: `🔐 ${code} is your MinoForge Security Code`,
    html: wrapInTemplate('MinoForge Security Verification', content)
  });
}

/**
 * 2. 🚨 Send New Sign-In / Account Login Alert
 */
async function sendLoginAlertEmail({ to, username = 'MinoUser', ip = 'Unknown IP', userAgent = 'Unknown Browser', time = new Date().toUTCString() }) {
  const content = `
    <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Security Alert: New Sign-In Detected</h2>
    <p style="margin: 0 0 16px 0;">Hello <strong style="color: #38bdf8;">${username}</strong>,</p>
    <p style="margin: 0 0 20px 0;">Your MinoForge account was just accessed from a new device or IP address:</p>

    <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px; margin: 20px 0; font-size: 12px;">
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Time:</strong> <span style="color: #ffffff;">${time}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">IP Address:</strong> <span style="color: #38bdf8; font-family: monospace;">${ip}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Device / Browser:</strong> <span style="color: #ffffff;">${userAgent}</span></p>
    </div>

    <p style="font-size: 12px; color: #94a3b8;">If this was you, no action is needed. If you did not perform this login, please enable Google Authenticator 2FA immediately in your Settings.</p>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: `🚨 Security Alert: New Sign-In to MinoForge Account (${username})`,
    html: wrapInTemplate('MinoForge Sign-In Alert', content)
  });
}

/**
 * 3. 💰 Send Plugin Sold Notification to Creator
 */
async function sendPluginSoldEmail({ creatorEmail, creatorUsername, pluginTitle, buyerUsername, amount, earnings }) {
  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; padding: 6px 16px; background-color: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); border-radius: 100px; font-size: 12px; font-weight: 800; color: #34d399;">
        🎉 YOU MADE A NEW SALE!
      </span>
    </div>
    <h2 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0 0 12px 0; text-align: center;">$${earnings.toFixed(2)} Added to Your Creator Balance</h2>
    <p style="margin: 0 0 20px 0; text-align: center;">Hello <strong style="color: #38bdf8;">${creatorUsername}</strong>, a buyer just purchased your plugin!</p>

    <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin: 20px 0; font-size: 13px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="4">
        <tr>
          <td style="color: #94a3b8;">Plugin:</td>
          <td align="right" style="color: #ffffff; font-weight: 700;">${pluginTitle}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8;">Buyer:</td>
          <td align="right" style="color: #38bdf8; font-weight: 700;">@${buyerUsername}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8;">Sale Price:</td>
          <td align="right" style="color: #ffffff;">$${amount.toFixed(2)} USD</td>
        </tr>
        <tr style="border-top: 1px solid rgba(255,255,255,0.1);">
          <td style="color: #34d399; font-weight: 800; padding-top: 8px;">Your Earnings:</td>
          <td align="right" style="color: #34d399; font-weight: 900; font-size: 16px; padding-top: 8px;">+$${earnings.toFixed(2)} USD</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="https://minoforge.com/dashboard" style="display: inline-block; padding: 12px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; border-radius: 12px; box-shadow: 0 10px 20px -5px rgba(37,99,235,0.5);">
        View Creator Dashboard
      </a>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: creatorEmail,
    subject: `💰 Sale Alert: ${pluginTitle} was purchased by @${buyerUsername} (+$${earnings.toFixed(2)})`,
    html: wrapInTemplate('Plugin Sale Notification', content)
  });
}

/**
 * 4. 📦 Send Purchase Receipt & Download Link to Buyer
 */
async function sendPurchaseReceiptEmail({ buyerEmail, buyerUsername, pluginTitle, pluginVersion = '1.0.0', amount, transactionId, downloadUrl }) {
  const content = `
    <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Order Receipt &amp; Download</h2>
    <p style="margin: 0 0 16px 0;">Thank you for your purchase, <strong style="color: #38bdf8;">${buyerUsername}</strong>!</p>
    <p style="margin: 0 0 20px 0;">Your license key and download link for <strong style="color: #ffffff;">${pluginTitle} (${pluginVersion})</strong> are now active:</p>

    <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin: 20px 0; font-size: 13px;">
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Transaction ID:</strong> <span style="color: #38bdf8; font-family: monospace;">${transactionId}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Total Paid:</strong> <span style="color: #34d399; font-weight: 800;">$${amount.toFixed(2)} USD</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">License DRM:</strong> <span style="color: #ffffff;">Single-Network Verified</span></p>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${downloadUrl || 'https://minoforge.com/dashboard'}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(37,99,235,0.5);">
        ⬇️ Download Plugin (.jar / .zip)
      </a>
    </div>
  `;

    return transporter.sendMail({
      from: getFromAddress(),
      to: buyerEmail,
      bcc: TRUSTPILOT_AFS_EMAIL,
      subject: `📦 Purchase Receipt: ${pluginTitle} (Order #${transactionId})`,
      html: wrapInTemplate('MinoForge Purchase Receipt', content + getTrustpilotJsonLd({
        buyerEmail,
        buyerUsername,
        orderId: transactionId
      }))
    });
  }

/**
 * 5. 📝 Send Custom Plugin Commission Request to Admin & Confirmation to User
 */
async function sendCustomPluginRequestEmail({ adminEmail, requesterName, requesterEmail, game, budget, details, deadline }) {
  const targetAdmin = adminEmail || process.env.ADMIN_EMAIL || 'minoforge.requests@gmail.com';

  const adminContent = `
    <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">New Custom Plugin Commission Request</h2>
    <p style="margin: 0 0 16px 0;">A client has submitted a custom development commission:</p>

    <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin: 20px 0; font-size: 13px;">
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Client Name:</strong> <span style="color: #ffffff;">${requesterName}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Contact Email:</strong> <span style="color: #38bdf8;">${requesterEmail}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Game / Platform:</strong> <span style="color: #f59e0b; font-weight: 700;">${game}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Budget:</strong> <span style="color: #34d399; font-weight: 800;">${budget}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Target Deadline:</strong> <span style="color: #ffffff;">${deadline || 'Flexible'}</span></p>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);">
        <strong style="color: #cbd5e1; display: block; margin-bottom: 4px;">Plugin Specification Details:</strong>
        <p style="margin: 0; color: #94a3b8; white-space: pre-line;">${details}</p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: targetAdmin,
    replyTo: requesterEmail,
    subject: `🛠️ New Custom Plugin Commission: ${game} (${budget}) from ${requesterName}`,
    html: wrapInTemplate('Custom Plugin Request', adminContent)
  });
}

/**
 * 6. 💸 Send Creator Payout Request Notification to Admin & Creator
 */
async function sendPayoutRequestEmail({ creatorEmail, creatorUsername, paypalEmail, grossAmount, feeAmount, netAmount, payoutRef }) {
  const adminEmail = process.env.ADMIN_PAYOUT_EMAIL || 'severinkaptein8@gmail.com';

  const content = `
    <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">💸 Creator Payout Request Submitted</h2>
    <p style="margin: 0 0 16px 0;">Hello <strong>${creatorUsername}</strong>, your withdrawal request has been received and logged into the MinoForge settlement queue.</p>

    <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin: 20px 0; font-size: 13px;">
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Payout Reference:</strong> <span style="color: #38bdf8; font-family: monospace; font-weight: 700;">${payoutRef}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Destination PayPal:</strong> <span style="color: #ffffff;">${paypalEmail}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #94a3b8;">Gross Requested:</strong> <span style="color: #ffffff; font-weight: 700;">€${parseFloat(grossAmount).toFixed(2)}</span></p>
      <p style="margin: 4px 0;"><strong style="color: #f59e0b;">8% Transaction &amp; Gateway Fee:</strong> <span style="color: #f59e0b; font-weight: 700;">-€${parseFloat(feeAmount).toFixed(2)}</span></p>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
        <strong style="color: #34d399; font-size: 15px;">Net PayPal Payout: €${parseFloat(netAmount).toFixed(2)}</strong>
      </div>
    </div>

    <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
      Payouts are dispatched directly via PayPal MassPay within 24-48 business hours. All 10% platform fees and 8% withdrawal processing fees are securely routed to MinoForge Treasury (<a href="mailto:severinkaptein8@gmail.com" style="color: #38bdf8;">severinkaptein8@gmail.com</a>).
    </p>
  `;

  // Send to Creator
  if (creatorEmail && creatorEmail.includes('@')) {
    try {
      await transporter.sendMail({
        from: getFromAddress(),
        to: creatorEmail,
        subject: `💸 Payout Request Received: €${parseFloat(netAmount).toFixed(2)} (${payoutRef})`,
        html: wrapInTemplate('MinoForge Payout Confirmation', content)
      });
    } catch (e) {
      console.warn('Failed to send payout confirmation to creator:', e.message);
    }
  }

  // Send notice to Admin Treasury (severinkaptein8@gmail.com)
  return transporter.sendMail({
    from: getFromAddress(),
    to: adminEmail,
    subject: `🚨 [Payout Action Required] €${parseFloat(netAmount).toFixed(2)} to ${paypalEmail} (${creatorUsername})`,
    html: wrapInTemplate('MinoForge Admin Payout Notification', `
      <h2 style="color: #ffffff; font-size: 20px; font-weight: 800;">New Payout Withdrawal Request</h2>
      <p>A creator has requested a balance withdrawal from their MinoForge wallet:</p>
      <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin: 20px 0;">
        <p><strong>Creator:</strong> ${creatorUsername} (${creatorEmail})</p>
        <p><strong>PayPal Email:</strong> ${paypalEmail}</p>
        <p><strong>Gross Amount:</strong> €${parseFloat(grossAmount).toFixed(2)}</p>
        <p><strong>Your 8% Transaction Cut (Treasury):</strong> <span style="color: #34d399; font-weight: 900;">+€${parseFloat(feeAmount).toFixed(2)}</span></p>
        <p><strong>Net Amount to Send to Creator:</strong> €${parseFloat(netAmount).toFixed(2)}</p>
        <p><strong>Payout Ref:</strong> ${payoutRef}</p>
      </div>
    `)
  });
}

module.exports = {
  transporter,
  getFromAddress,
  sendSecurityCodeEmail,
  sendLoginAlertEmail,
  sendPluginSoldEmail,
  sendPurchaseReceiptEmail,
  sendCustomPluginRequestEmail,
  sendPayoutRequestEmail
};
