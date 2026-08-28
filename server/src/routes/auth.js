const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const store = require('../store/globalStore');

const router = express.Router();
const prisma = new PrismaClient();

// Setup Nodemailer for 2FA Verification Codes (Brevo SMTP / Custom Domain)
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: (process.env.SMTP_PASS || '').replace(/\s+/g, '')
      }
    });
  }
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: (process.env.EMAIL_APP_PASSWORD || '').replace(/\s+/g, '')
    }
  });
};

const transporter = createTransporter();

// Verification Codes In-Memory Storage (email -> { code, expiresAt, type })
const verificationCodes = new Map();

// Google Authenticator 2FA Settings (email -> { secret, backupCodes, enabled, enabledAt })
const user2FASettings = new Map();

// Helper to generate 8 single-use backup recovery codes
function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

// Helper to generate a 9-digit alphanumeric code (e.g., 9X2-K7W-4BP)
function generate9DigitCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Clean chars without easily confused 0/O, 1/I
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Format as XXX-XXX-XXX for easy reading
  return `${result.slice(0, 3)}-${result.slice(3, 6)}-${result.slice(6, 9)}`;
}

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/send-verification-code
// @desc    Send 9-digit alphanumeric verification code to email (Sender: MinoForge)
router.post('/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const code = generate9DigitCode();
    
    // Store code for 10 minutes
    verificationCodes.set(cleanEmail, {
      code: code.replace(/-/g, ''),
      formattedCode: code,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    const mailOptions = {
      from: `"MinoForge Official" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@minoforge.com'}>`,
      to: cleanEmail,
      subject: `🔒 [MinoForge Verification] Your Security Code: ${code}`,
      text: `Hello,

Your MinoForge 9-digit security verification code is: ${code}

Enter this code on the website to complete your login. This code expires in 10 minutes.

Didn't receive the code or don't see it?
Make sure to check your Spam or Junk folder and click "Not Spam".

Best regards,
MinoForge Verification Team
https://minoforge.com`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
          
          <!-- Header with Myna Bird Brand -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00f2fe, #2563eb); padding: 10px 18px; border-radius: 14px; font-weight: 900; font-size: 18px; color: #ffffff; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);">
              🦅 MINOFORGE
            </div>
            <h2 style="color: #ffffff; margin-top: 18px; margin-bottom: 4px; font-size: 22px; font-weight: 800;">Security Verification</h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">2-Step Login &amp; Account Protection</p>
          </div>

          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; text-align: center;">
            Enter the following <strong>9-digit verification code</strong> on the website to complete your sign-in:
          </p>

          <!-- 9-Digit Code Box -->
          <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid #00f2fe; border-radius: 16px; padding: 22px; text-align: center; margin: 24px 0; box-shadow: 0 0 25px rgba(0, 242, 254, 0.2);">
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">Your Security Code</span>
            <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #00f2fe;">
              ${code}
            </div>
            <span style="font-size: 11px; color: #64748b; margin-top: 8px; display: block;">⏱️ Valid for 10 minutes • Keep this private</span>
          </div>

          <!-- Spam Folder Notice -->
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 14px; margin-top: 16px;">
            <p style="color: #fcd34d; font-size: 12px; margin: 0; line-height: 1.5;">
              ⚠️ <strong>Don't see this in your main inbox?</strong><br />
              Please check your <strong>Spam / Junk folder</strong> and click <strong>"Report Not Spam"</strong> to ensure you receive future security updates.
            </p>
          </div>

          <div style="border-top: 1px solid #1e293b; padding-top: 18px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
            <p style="margin: 4px 0;">MinoForge Verification Engine • <a href="https://minoforge.com" style="color: #38bdf8; text-decoration: none;">minoforge.com</a></p>
            <p style="margin: 4px 0;">If you did not request this code, no action is needed.</p>
          </div>
        </div>
      `
    };

    // Send email asynchronously and log result
    transporter.sendMail(mailOptions).then(() => {
      console.log(`[MinoForge Verification 2FA] Verification code delivered to ${cleanEmail}: ${code}`);
    }).catch(err => {
      console.error('[MinoForge 2FA Mailer Error]:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Verification code sent to email.'
    });
  } catch (error) {
    console.error('[MinoForge 2FA Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again.'
    });
  }
});

// @route   POST /api/auth/verify-code
// @desc    Verify 9-digit code and complete login / register
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code, username } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    const storedData = verificationCodes.get(cleanEmail);

    if (!storedData) {
      return res.status(400).json({ success: false, message: 'No verification code was sent to this email or it has expired. Please click "Send again".' });
    }

    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
    }

    if (storedData.code !== cleanCode) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
    }

    // Code is valid -> delete from cache
    verificationCodes.delete(cleanEmail);

    // Find or create user with robust database fallback
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });

      if (!user) {
        const baseUsername = username || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        let finalUsername = baseUsername;
        try {
          let counter = 1;
          while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
            finalUsername = `${baseUsername}_${counter++}`;
          }
        } catch (uErr) {}

        const randomPassword = Math.random().toString(36).slice(-10);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        user = await prisma.user.create({
          data: {
            username: finalUsername,
            email: cleanEmail,
            passwordHash,
            role: cleanEmail === 'severinkaptein8@gmail.com' ? 'ADMIN' : 'USER'
          }
        });
      }
    } catch (dbError) {
      console.warn('[Prisma DB Fallback in verify-code]:', dbError.message);
      // Fallback in-memory user to ensure user login NEVER fails
      user = {
        id: `usr_${Date.now()}`,
        username: username || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
        email: cleanEmail,
        role: cleanEmail === 'severinkaptein8@gmail.com' ? 'ADMIN' : 'USER',
        avatarUrl: null
      };
    }

    const token = generateToken(user);
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || null
    };

    store.addUser(userResponse, req.ip);

    return res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Code verification error:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying code.' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a user
router.post(
  '/register',
  [
    body('username')
      .isString().withMessage('Username must be a string')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters long')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          username,
          email: email.toLowerCase(),
          passwordHash,
        },
      });

      const token = generateToken(user);
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      };

      store.addUser(userResponse, req.ip);

      res.status(201).json({ token, user: userResponse });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login a user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      };

      store.addUser(userResponse, req.ip);
      store.trackActivity({
        type: 'LOGIN',
        username: user.username,
        email: user.email,
        ip: req.ip || '127.0.0.1',
        path: '/login',
        details: 'User authenticated with password'
      });

      res.json({ token, user: userResponse });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/auth/google
// @desc    Google OAuth login & registration
router.post('/google', async (req, res, next) => {
  try {
    const { credential, accessToken, userInfo } = req.body;
    let email, name, picture, sub;

    if (userInfo && userInfo.email) {
      email = userInfo.email;
      name = userInfo.name;
      picture = userInfo.picture;
      sub = userInfo.sub || userInfo.id;
    } else if (accessToken) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) {
        return res.status(401).json({ message: 'Invalid or expired Google access token' });
      }
      const payload = await response.json();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      sub = payload.sub;
    } else if (credential) {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!response.ok) {
        return res.status(401).json({ message: 'Invalid or expired Google token' });
      }
      const payload = await response.json();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      sub = payload.sub;
    } else {
      return res.status(400).json({ message: 'Google token or credential is required' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Google account has no associated email' });
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        let baseUsername = (name || email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 18);
        if (baseUsername.length < 3) baseUsername = `user_${Math.floor(Math.random() * 10000)}`;
        
        let username = baseUsername;
        let counter = 1;
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${baseUsername.slice(0, 14)}_${counter++}`;
        }

        const randomPassword = Math.random().toString(36).slice(-10);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        user = await prisma.user.create({
          data: {
            username,
            email: email.toLowerCase(),
            passwordHash,
            avatarUrl: picture || null,
          }
        });
      } else if (!user.avatarUrl && picture) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: picture }
        });
      }
    } catch (dbErr) {
      console.warn('[Google Auth] Database unreachable, creating local session for Google user:', email);
      user = {
        id: `google-user-${sub || Date.now()}`,
        username: (name || email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 16) || 'google_user',
        email: email.toLowerCase(),
        role: 'USER',
        avatarUrl: picture || null
      };
    }

    const token = generateToken(user);
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    };

    store.addUser(userResponse, req.ip);

    res.json({ token, user: userResponse });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/staff/send-code
// @desc    Dispatch 6-digit 2FA code to severinkaptein8@gmail.com
router.post('/staff/send-code', async (req, res) => {
  try {
    const staffEmail = 'severinkaptein8@gmail.com';

    // Generate 6-digit numeric security code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in verification map for 10 minutes
    verificationCodes.set(`staff_${staffEmail.toLowerCase()}`, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // Send styled security email via transporter
    const mailOptions = {
      from: {
        name: 'MinoForge Verification',
        address: process.env.EMAIL_USER || 'severinkaptein8@gmail.com'
      },
      to: staffEmail,
      subject: `🔒 [Nimda Gateway] Staff Verification Code: ${code}`,
      text: `Your MinoForge Staff 2FA Verification Code is: ${code}. This code expires in 10 minutes.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #00f2fe); padding: 12px 18px; border-radius: 14px; font-weight: 900; font-size: 20px; color: #ffffff; letter-spacing: 1px;">
              MinoForge Staff Gateway
            </div>
            <h2 style="color: #ffffff; margin-top: 20px; font-size: 22px; font-weight: 800;">Staff Verification Code</h2>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">A login request was initiated for the Nimda Command Portal.</p>
          </div>

          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid #00f2fe; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; box-shadow: 0 0 25px rgba(0, 242, 254, 0.15);">
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">6-Digit Security Passcode</span>
            <div style="font-family: 'Courier New', monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #00f2fe;">
              ${code}
            </div>
            <span style="font-size: 11px; color: #64748b; margin-top: 8px; display: block;">Valid for 10 minutes • Do not share this code</span>
          </div>

          <div style="border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
            <p style="margin: 4px 0;">Generated by MinoForge Security Engine • minoforge.com</p>
            <p style="margin: 4px 0;">If you did not initiate this login, change your password immediately.</p>
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send staff verification email:', error);
      } else {
        console.log('Staff 2FA code sent successfully to severinkaptein8@gmail.com');
      }
    });

    res.json({
      success: true,
      message: 'Verification code sent to severinkaptein8@gmail.com'
    });
  } catch (error) {
    console.error('Staff send-code error:', error);
    res.status(500).json({ success: false, message: 'Server error processing staff login.' });
  }
});

// @route   POST /api/auth/staff/verify-code
// @desc    Verify 6-digit code and issue Admin JWT
router.post('/staff/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const staffEmail = 'severinkaptein8@gmail.com';

    if (!code) {
      return res.status(400).json({ success: false, message: 'Verification code is required.' });
    }

    let isStaffValid = false;
    if (record && Date.now() <= record.expiresAt && record.code === code.trim()) {
      isStaffValid = true;
      verificationCodes.delete(`staff_${staffEmail.toLowerCase()}`);
    } else {
      // Check Google Authenticator TOTP if enabled
      const settings = user2FASettings.get(staffEmail.toLowerCase());
      if (settings && settings.enabled) {
        const isTotp = speakeasy.totp.verify({
          secret: settings.secret,
          encoding: 'base32',
          token: code.trim(),
          window: 2
        });
        if (isTotp) isStaffValid = true;
      }
    }

    if (!isStaffValid) {
      return res.status(400).json({ success: false, message: 'Incorrect verification code or Google Authenticator token. Please try again.' });
    }

    // Create / fetch staff user in database or fallback object
    let staffUser;
    try {
      staffUser = await prisma.user.findUnique({ where: { email: staffEmail } });
      if (!staffUser) {
        const hash = await bcrypt.hash('Theminoforgeadmin123!', 10);
        staffUser = await prisma.user.create({
          data: {
            username: 'MinoAdmin',
            email: staffEmail,
            passwordHash: hash,
            role: 'ADMIN'
          }
        });
      }
    } catch (e) {
      staffUser = {
        id: 'admin-super-1',
        username: 'MinoAdmin',
        email: staffEmail,
        role: 'ADMIN'
      };
    }

    const token = jwt.sign(
      { id: staffUser.id, role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    store.trackActivity({
      type: 'NIMDA_LOGIN',
      username: 'SevGamerPro (Master)',
      email: staffEmail,
      ip: req.ip || '127.0.0.1',
      path: '/nimda',
      details: 'Master 2FA Passcode verified successfully'
    });

    res.json({
      success: true,
      token,
      user: {
        id: staffUser.id,
        username: staffUser.username || 'MinoAdmin',
        email: staffEmail,
        role: 'ADMIN'
      }
    });
  } catch (error) {
    console.error('Staff verify-code error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify staff code.' });
  }
});

// ==========================================
// 🛡️ GOOGLE AUTHENTICATOR (TOTP 2FA) ENDPOINTS
// ==========================================

// @route   POST /api/auth/2fa/setup
// @desc    Generate Google Authenticator Base32 secret, QR Code DataURL, and 8 Backup Codes
router.post('/2fa/setup', async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for 2FA setup.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const accountName = username ? `${username} (${cleanEmail})` : cleanEmail;

    // Generate RFC 6238 Base32 Secret
    const secret = speakeasy.generateSecret({
      name: `MinoForge:${accountName}`,
      issuer: 'MinoForge Security',
      length: 20
    });

    // Generate QR Code image as base64 Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Generate 8 Emergency Recovery Codes
    const backupCodes = generateBackupCodes();

    res.json({
      success: true,
      secret: secret.base32,
      formattedSecret: secret.base32.match(/.{1,4}/g).join(' '),
      qrCode: qrCodeDataUrl,
      otpauthUrl: secret.otpauth_url,
      backupCodes
    });
  } catch (error) {
    console.error('[2FA Setup Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to generate 2FA secret and QR code.' });
  }
});

// @route   POST /api/auth/2fa/verify-and-activate
// @desc    Verify initial 6-digit TOTP code and lock in 2FA for the account
router.post('/2fa/verify-and-activate', async (req, res) => {
  try {
    const { email, secret, token, backupCodes } = req.body;
    if (!email || !secret || !token) {
      return res.status(400).json({ success: false, message: 'Email, secret, and 6-digit token are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.toString().replace(/\s+/g, '').trim();

    // Verify TOTP token (allow 60s clock skew window)
    const verified = speakeasy.totp.verify({
      secret: secret.trim(),
      encoding: 'base32',
      token: cleanToken,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 6-digit code. Please ensure your device clock is synchronized.'
      });
    }

    // Save to user2FASettings
    user2FASettings.set(cleanEmail, {
      enabled: true,
      secret: secret.trim(),
      backupCodes: Array.isArray(backupCodes) ? backupCodes : generateBackupCodes(),
      enabledAt: new Date().toISOString()
    });

    store.trackActivity({
      type: 'SECURITY_2FA_ENABLED',
      email: cleanEmail,
      ip: req.ip || '127.0.0.1',
      details: 'Google Authenticator 2FA activated successfully'
    });

    res.json({
      success: true,
      message: 'Google Authenticator 2FA has been successfully activated on your account!'
    });
  } catch (error) {
    console.error('[2FA Verify Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to verify 2FA token.' });
  }
});

// @route   POST /api/auth/2fa/validate
// @desc    Validate 6-digit TOTP token OR backup recovery code during login / admin access
router.post('/2fa/validate', async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({ success: false, message: 'Email and 2FA code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.toString().replace(/[\s-]/g, '').trim();
    const settings = user2FASettings.get(cleanEmail);

    // If user hasn't explicitly set up 2FA yet, allow pass or require setup
    if (!settings || !settings.enabled) {
      return res.json({
        success: true,
        valid: true,
        twoFactorRequired: false,
        message: '2FA not enabled for this account.'
      });
    }

    // 1. Check if 6-digit TOTP token
    const isTotpValid = speakeasy.totp.verify({
      secret: settings.secret,
      encoding: 'base32',
      token: cleanToken,
      window: 2
    });

    if (isTotpValid) {
      return res.json({
        success: true,
        valid: true,
        method: 'TOTP_GOOGLE_AUTHENTICATOR',
        message: 'Google Authenticator verified.'
      });
    }

    // 2. Check if single-use backup code
    const formattedToken = token.trim();
    const backupIndex = settings.backupCodes.findIndex(
      c => c === formattedToken || c.replace(/-/g, '') === cleanToken
    );

    if (backupIndex !== -1) {
      // Consume the single-use backup code
      settings.backupCodes.splice(backupIndex, 1);
      user2FASettings.set(cleanEmail, settings);

      store.trackActivity({
        type: 'SECURITY_BACKUP_CODE_USED',
        email: cleanEmail,
        ip: req.ip || '127.0.0.1',
        details: `Emergency backup recovery code used. Remaining codes: ${settings.backupCodes.length}`
      });

      return res.json({
        success: true,
        valid: true,
        method: 'BACKUP_RECOVERY_CODE',
        remainingBackupCodes: settings.backupCodes.length,
        message: 'Emergency backup recovery code accepted.'
      });
    }

    return res.status(400).json({
      success: false,
      valid: false,
      message: 'Invalid Authenticator code or backup recovery code.'
    });
  } catch (error) {
    console.error('[2FA Validate Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to validate 2FA code.' });
  }
});

// @route   POST /api/auth/2fa/disable
// @desc    Disable 2FA on account
router.post('/2fa/disable', async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    user2FASettings.delete(cleanEmail);

    store.trackActivity({
      type: 'SECURITY_2FA_DISABLED',
      email: cleanEmail,
      ip: req.ip || '127.0.0.1',
      details: 'Google Authenticator 2FA disabled'
    });

    res.json({
      success: true,
      message: 'Two-Factor Authentication has been disabled.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to disable 2FA.' });
  }
});

// @route   GET /api/auth/2fa/status/:email
// @desc    Get 2FA status for user
router.get('/2fa/status/:email', (req, res) => {
  const cleanEmail = req.params.email.trim().toLowerCase();
  const settings = user2FASettings.get(cleanEmail);
  res.json({
    enabled: !!(settings && settings.enabled),
    enabledAt: settings?.enabledAt || null,
    remainingBackupCodes: settings?.backupCodes?.length || 0
  });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
