const express = require('express');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { auth, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/plugins
// @desc    List approved plugins with search, filter by game, sort, pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tags, gameId, sort } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build where clause
    const where = {
      status: 'APPROVED',
      ...(gameId && { gameId: String(gameId) }),
      ...(search && {
        OR: [
          { title: { contains: String(search), mode: 'insensitive' } },
          { summary: { contains: String(search), mode: 'insensitive' } }
        ]
      }),
      ...(tags && {
        tags: { hasSome: String(tags).split(',') }
      })
    };

    // Build order by clause
    let orderBy = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { downloads: 'desc' };
    else if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };

    const [plugins, total] = await Promise.all([
      prisma.plugin.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          author: {
            select: { id: true, username: true, avatarUrl: true }
          },
          game: {
            select: { id: true, name: true, slug: true }
          }
        }
      }),
      prisma.plugin.count({ where })
    ]);

    res.json({
      data: plugins,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/plugins/featured
// @desc    Get top 8 approved plugins
router.get('/featured', async (req, res, next) => {
  try {
    const plugins = await prisma.plugin.findMany({
      where: { status: 'APPROVED' },
      take: 8,
      orderBy: [
        { rating: 'desc' },
        { downloads: 'desc' }
      ],
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true }
        },
        game: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    res.json(plugins);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/plugins/my/plugins
// @desc    List current user's plugins (any status)
router.get('/my/plugins', auth, async (req, res, next) => {
  try {
    const plugins = await prisma.plugin.findMany({
      where: { authorId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        game: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    res.json(plugins);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/plugins/:id
// @desc    Get single plugin detail
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const plugin = await prisma.plugin.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true, bio: true, createdAt: true }
        },
        game: true
      }
    });

    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found' });
    }

    // Access control: Only show if approved OR if current user is the author/admin
    const isAuthor = req.user && req.user.id === plugin.authorId;
    const isStaff = req.user && ['STAFF', 'ADMIN'].includes(req.user.role);

    if (plugin.status !== 'APPROVED' && !isAuthor && !isStaff) {
      return res.status(403).json({ message: 'Access denied: Plugin is not approved yet' });
    }

    res.json(plugin);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/plugins
// @desc    Create new plugin (draft status)
router.post(
  '/',
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('summary').notEmpty().withMessage('Summary is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('version').notEmpty().withMessage('Version is required'),
    body('gameId').notEmpty().withMessage('Game ID is required'),
    body('price').optional().isNumeric(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, summary, description, version, tags, coverImageUrl, fileUrl, price, currency, gameId } = req.body;

      const plugin = await prisma.plugin.create({
        data: {
          title,
          summary,
          description,
          version,
          tags: tags || [],
          coverImageUrl,
          fileUrl,
          price: price ? parseFloat(price) : 0.00,
          currency: currency || 'USD',
          status: 'DRAFT',
          authorId: req.user.id,
          gameId
        }
      });

      res.status(201).json(plugin);
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/plugins/:id
// @desc    Update plugin
router.put(
  '/:id',
  auth,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const existingPlugin = await prisma.plugin.findUnique({
        where: { id }
      });

      if (!existingPlugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      if (existingPlugin.authorId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to edit this plugin' });
      }

      // Allowed fields to update
      const updateData = {};
      const fields = ['title', 'summary', 'description', 'version', 'tags', 'coverImageUrl', 'fileUrl', 'price', 'currency', 'gameId'];
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price);
      }

      // If they edit it after it was denied, reset to DRAFT
      if (existingPlugin.status === 'DENIED') {
        updateData.status = 'DRAFT';
      }

      const plugin = await prisma.plugin.update({
        where: { id },
        data: updateData
      });

      res.json(plugin);
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/plugins/:id/submit
// @desc    Change status from DRAFT to PENDING
router.post('/:id/submit', auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingPlugin = await prisma.plugin.findUnique({
      where: { id }
    });

    if (!existingPlugin) {
      return res.status(404).json({ message: 'Plugin not found' });
    }

    if (existingPlugin.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to submit this plugin' });
    }

    if (existingPlugin.status !== 'DRAFT' && existingPlugin.status !== 'DENIED') {
      return res.status(400).json({ message: 'Plugin can only be submitted from DRAFT or DENIED status' });
    }

    const plugin = await prisma.plugin.update({
      where: { id },
      data: { status: 'PENDING' }
    });

    res.json(plugin);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
