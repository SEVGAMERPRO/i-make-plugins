const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/users/:username
// @desc    Get public user profile with their approved plugins
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        plugins: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          include: {
            game: {
              select: { id: true, name: true, slug: true }
            }
          }
        },
        _count: {
          select: {
            plugins: { where: { status: 'APPROVED' } }
          }
        }
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

// @route   PUT /api/users/profile
// @desc    Update own profile (avatar, bio)
router.put('/profile', auth, async (req, res, next) => {
  try {
    const { avatarUrl, bio } = req.body;

    const updateData = {};
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
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

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
