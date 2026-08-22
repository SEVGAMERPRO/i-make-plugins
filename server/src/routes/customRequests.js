const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Transporter with Google SMTP using App Password
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'severinkaptein8@gmail.com',
    pass: (process.env.EMAIL_APP_PASSWORD || '').replace(/\s+/g, '')
  }
});

// POST /api/requests/custom - Send Custom Plugin Request Email
router.post('/custom', async (req, res) => {
  const { email, phone, game, budget, requestDetails, timestamp } = req.body;

  // 1. Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address (e.g. user@gmail.com).' 
    });
  }

  // 2. Validate Phone Number (must have valid international digits)
  const phoneDigits = (phone || '').replace(/\D/g, '');
  if (!phone || phoneDigits.length < 7) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid phone number with country code (minimum 7 digits).' 
    });
  }

  // 3. Validate Request Details
  if (!requestDetails || requestDetails.trim().length < 5) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide detailed specifications for your plugin request.' 
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || 'minoforge.requests@gmail.com').trim().toLowerCase();
  const cleanPhone = phone.trim();
  const timeStr = timestamp || new Date().toLocaleString();

  // 1. Order details email: SENT ONLY TO ADMIN (minoforge.requests@gmail.com)
  const adminMailOptions = {
    from: `"MinoForgeRequests" <${process.env.EMAIL_USER || 'severinkaptein8@gmail.com'}>`,
    to: adminEmail, // STRICTLY ADMIN ONLY
    replyTo: cleanEmail,
    subject: `🚀 [NEW ORDER] Custom Plugin Request: ${game} (${budget || 'Flexible'})`,
    text: `New Custom Plugin Order from colasmp.net

Client Email: ${cleanEmail}
Client Phone: ${cleanPhone}
Target Platform: ${game || 'Minecraft'}
Estimated Budget: ${budget || 'Flexible'}
Submitted At: ${timeStr}

Specifications:
${requestDetails}
`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 24px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2196F3; margin: 0; font-size: 24px;">MinoForge Custom Plugin Request</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">New incoming order from colasmp.net</p>
        </div>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Client Email:</strong> <a href="mailto:${cleanEmail}" style="color: #60a5fa; text-decoration: none;">${cleanEmail}</a></p>
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Client Phone:</strong> <span style="color: #34d399; font-weight: bold;">${cleanPhone}</span></p>
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Target Platform:</strong> ${game || 'Minecraft'}</p>
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Estimated Budget:</strong> ${budget || 'Flexible'}</p>
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Submitted At:</strong> ${timeStr}</p>
        </div>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 style="color: #38bdf8; margin-top: 0;">Detailed Specifications & Requirements:</h3>
          <p style="color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${requestDetails}</p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
          <p>Click "Reply" to directly email the client at <strong>${cleanEmail}</strong>.</p>
        </div>
      </div>
    `
  };

  // 2. Receipt confirmation email: SENT ONLY TO REQUESTER (cleanEmail)
  const clientConfirmationOptions = {
    from: `"MinoForgeRequests" <${process.env.EMAIL_USER || 'severinkaptein8@gmail.com'}>`,
    to: cleanEmail, // STRICTLY REQUESTER ONLY
    replyTo: adminEmail,
    subject: '✅ Order Confirmation: Your MinoForge Custom Plugin Request',
    text: `Hello,

Thank you for contacting MinoForge Development! We have received your custom plugin order.

Our engineering team is currently reviewing your project requirements for ${game}. A lead developer will get in touch with you at this email address (${cleanEmail}) within 24 hours.

Your Order Summary:
- Platform: ${game}
- Estimated Budget: ${budget}
- Contact Phone: ${cleanPhone}
- Status: Received & Under Developer Review

Specifications:
${requestDetails}

Best regards,
MinoForge Engineering Team
Official Marketplace: https://colasmp.net`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="color: #1d4ed8; margin: 0; font-size: 20px;">Order Confirmation — MinoForge</h2>
        </div>
        
        <p style="font-size: 15px; line-height: 1.5; color: #334155;">
          Thank you for contacting <strong>MinoForge Development</strong>! We have received your custom plugin order.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 6px 0; font-size: 14px;"><strong>Target Platform:</strong> ${game || 'Minecraft'}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Estimated Budget:</strong> ${budget || 'Flexible'}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Contact Phone:</strong> <span style="color: #059669; font-weight: bold;">${cleanPhone}</span></p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Received & Under Developer Review</span></p>
        </div>

        <div style="background-color: #ffffff; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <p style="color: #64748b; font-size: 12px; font-weight: bold; margin: 0 0 4px 0;">YOUR SUBMITTED SPECIFICATIONS:</p>
          <p style="color: #334155; font-size: 13px; margin: 0; line-height: 1.5; white-space: pre-wrap;">${requestDetails}</p>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #334155;">
          Our lead developer is currently reviewing your project scope and will contact you directly at this email address within <strong>24 hours</strong> with an estimate and timeline.
        </p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          MinoForgeRequests • Official Platform: <a href="https://colasmp.net" style="color: #3b82f6; text-decoration: none;">colasmp.net</a>
        </p>
      </div>
    `
  };

  try {
    // 1. Send Order Details strictly to Admin
    const adminRes = await transporter.sendMail(adminMailOptions);
    console.log(`[MinoForgeRequests] Admin order sent to ${adminEmail}: ${adminRes.messageId}`);

    // 2. Send Confirmation strictly to Requester (only if different from admin email, or to requester)
    let clientMessageId = null;
    if (cleanEmail !== adminEmail) {
      const clientRes = await transporter.sendMail(clientConfirmationOptions);
      clientMessageId = clientRes.messageId;
      console.log(`[MinoForgeRequests] Confirmation receipt sent ONLY to requester ${cleanEmail}: ${clientMessageId}`);
    } else {
      console.log(`[MinoForgeRequests] Requester is admin (${cleanEmail}). Skipped duplicate confirmation.`);
    }

    return res.status(200).json({
      success: true,
      message: 'Custom plugin request dispatched. Requester received confirmation only.',
      adminMessageId: adminRes.messageId,
      clientMessageId
    });
  } catch (error) {
    console.error('[MinoForgeRequests Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send emails via mailer.'
    });
  }
});

module.exports = router;
