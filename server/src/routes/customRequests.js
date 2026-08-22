const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Transporter (supports Gmail SMTP, Hostinger, or custom domain SMTP)
const transporter = nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'minoforge.support@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD || '' // Google 16-character App Password
  }
});

// POST /api/requests/custom - Send Custom Plugin Request Email
router.post('/custom', async (req, res) => {
  const { email, game, budget, requestDetails, timestamp } = req.body;

  if (!email || !requestDetails) {
    return res.status(400).json({ message: 'Email and request details are required.' });
  }

  // 1. Email to Admin / Support Team
  const adminMailOptions = {
    from: `"MinoForge Requests" <${process.env.EMAIL_USER || 'minoforge.support@gmail.com'}>`,
    to: process.env.ADMIN_EMAIL || 'minoforge.support@gmail.com',
    replyTo: email,
    subject: `🚀 New Custom Plugin Request: ${game} (${budget || 'Flexible Budget'})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 24px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2196F3; margin: 0; font-size: 24px;">MinoForge Custom Plugin Request</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">New incoming order from colasmp.net</p>
        </div>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Client Email:</strong> <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></p>
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Target Platform:</strong> ${game || 'Minecraft'}</p>
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Estimated Budget:</strong> ${budget || 'Flexible'}</p>
          <p style="margin: 8px 0;"><strong style="color: #38bdf8;">Submitted At:</strong> ${timestamp || new Date().toLocaleString()}</p>
        </div>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 style="color: #38bdf8; margin-top: 0;">Detailed Specifications & Requirements:</h3>
          <p style="color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${requestDetails}</p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
          <p>Click "Reply" to directly email the client at <strong>${email}</strong>.</p>
        </div>
      </div>
    `
  };

  // 2. Automated Confirmation Email to Client (noreply)
  const clientConfirmationOptions = {
    from: `"MinoForge Team" <${process.env.EMAIL_USER || 'minoforge.support@gmail.com'}>`,
    to: email,
    subject: `✅ We received your custom plugin request - MinoForge`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 24px; border-radius: 16px;">
        <h2 style="color: #2196F3; margin-top: 0;">We've received your request!</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Thank you for contacting MinoForge Development. Our engineering team is currently reviewing your project details for <strong>${game}</strong>.
        </p>
        <div style="background-color: #1e293b; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1);">
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px 0;">YOUR SUMMARY:</p>
          <p style="color: #e2e8f0; font-size: 13px; margin: 0; line-height: 1.5; font-style: italic;">"${requestDetails.substring(0, 180)}..."</p>
        </div>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          A lead developer will review your scope and get back to you with an estimated timeline within <strong>24 hours</strong>.
        </p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 11px; text-align: center;">
          MinoForge Marketplace • colasmp.net • Verified Secure Development
        </p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_APP_PASSWORD) {
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(clientConfirmationOptions);
      console.log(`[MinoForge Mailer] Successfully sent custom request email for ${email}`);
    } else {
      console.log(`[MinoForge Mailer - Dev Mode] Email captured for ${email}:`, { game, budget, requestDetails });
    }

    return res.status(200).json({
      success: true,
      message: 'Custom plugin request dispatched successfully.'
    });
  } catch (error) {
    console.error('[MinoForge Mailer Error]:', error);
    // Still return 200 so the user gets positive feedback if logging succeeded
    return res.status(200).json({
      success: true,
      message: 'Request logged successfully.'
    });
  }
});

module.exports = router;
