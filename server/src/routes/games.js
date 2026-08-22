const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/games
// @desc    List all games ordered by displayOrder
router.get('/', async (req, res, next) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        displayOrder: 'asc'
      },
      include: {
        _count: {
          select: { plugins: { where: { status: 'APPROVED' } } }
        }
      }
    });

    res.json(games);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/games/:slug
// @desc    Get game by slug with plugin count
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { plugins: { where: { status: 'APPROVED' } } }
        }
      }
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/games/:slug/plugins
// @desc    Get approved plugins for a game with pagination, search, sort
router.get('/:slug/plugins', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10, search, sort } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // First find the game to make sure it exists and get its ID
    const game = await prisma.game.findUnique({
      where: { slug }
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Build the query where clause
    const where = {
      gameId: game.id,
      status: 'APPROVED',
      ...(search && {
        OR: [
          { title: { contains: String(search), mode: 'insensitive' } },
          { summary: { contains: String(search), mode: 'insensitive' } },
        ]
      })
    };

    // Build the order by clause
    let orderBy = { createdAt: 'desc' }; // default: newest
    if (sort === 'popular') {
      orderBy = { downloads: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    }

    const [plugins, total] = await Promise.all([
      prisma.plugin.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
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

module.exports = router;
