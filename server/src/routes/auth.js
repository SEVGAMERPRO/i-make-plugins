const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Setup Nodemailer for 2FA Verification Codes
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'severinkaptein8@gmail.com',
    pass: (process.env.EMAIL_APP_PASSWORD || '').replace(/\s+/g, '')
  }
});

// Verification Codes In-Memory Storage (email -> { code, expiresAt, type })
const verificationCodes = new Map();

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
      from: `"MinoForge" <${process.env.EMAIL_USER || 'severinkaptein8@gmail.com'}>`,
      to: cleanEmail,
      subject: `Your MinoForge Verification Code: ${code}`,
      text: `Hello,

Your MinoForge 9-digit verification code is: ${code}

Enter this code on the website to complete your login. This code expires in 10 minutes.

Didn't receive the code or don't see it?
Make sure to check your Spam or Junk folder and click "Not Spam".

Best regards,
MinoForge Security Team
https://colasmp.net`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; color: #1e293b; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0 0 6px 0; font-size: 22px;">MinoForge Security Verification</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0;">2-Step Login & Account Verification</p>
          </div>

          <p style="font-size: 15px; color: #334155; line-height: 1.5;">
            Use the following <strong>9-digit security code</strong> to sign in to your account:
          </p>

          <div style="background-color: #f1f5f9; border: 2px dashed #94a3b8; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-family: 'Courier New', monospace; font-size: 30px; font-weight: 900; letter-spacing: 4px; color: #0f172a; display: inline-block;">
              ${code}
            </span>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 20px;">
            ⏱️ This security code is valid for <strong>10 minutes</strong>. If you did not attempt to sign in, you can safely ignore this email.
          </p>

          <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 14px; margin-top: 16px;">
            <p style="color: #92400e; font-size: 12px; margin: 0; line-height: 1.5;">
              ⚠️ <strong>Don't see this email in your main inbox?</strong><br />
              Please check your <strong>Spam / Junk folder</strong> or <strong>Promotions tab</strong> and click <strong>"Report Not Spam"</strong>.
            </p>
          </div>

          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
            MinoForge Security • <a href="https://colasmp.net" style="color: #2563eb; text-decoration: none;">colasmp.net</a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[MinoForge 2FA] Verification code sent to ${cleanEmail}: ${code}`);

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

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      const baseUsername = username || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      let finalUsername = baseUsername;
      let counter = 1;
      while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
        finalUsername = `${baseUsername}_${counter++}`;
      }

      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await prisma.user.create({
        data: {
          username: finalUsername,
          email: cleanEmail,
          passwordHash,
        }
      });
    }

    const token = generateToken(user);
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    };

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
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!response.ok) {
      return res.status(401).json({ message: 'Invalid or expired Google token' });
    }
    
    const payload = await response.json();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Google account has no associated email' });
    }

    let user = await prisma.user.findUnique({
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

    const token = generateToken(user);
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    next(error);
  }
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
